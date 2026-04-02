import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { createApp } from '../server/app.mjs';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

async function loginAndSeed(context) {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'shooters-abuse-regression-'));
  const dataDir = path.join(tempRoot, 'data');
  let nowMs = Date.UTC(2026, 2, 19, 0, 0, 0);

  await mkdir(dataDir, { recursive: true });
  await writeFile(
    path.join(dataDir, 'app-config.json'),
    JSON.stringify(
      {
        adminUsernames: ['alice'],
        adminUserIds: []
      },
      null,
      2
    )
  );

  const app = createApp({
    rootDir,
    dataDir,
    host: '127.0.0.1',
    port: 0,
    linuxDo: {
      clientId: 'test-client',
      clientSecret: 'test-secret',
      baseUrl: 'http://127.0.0.1'
    },
    now: () => nowMs,
    fetchImpl: async (url) => {
      const target = String(url);

      if (target === 'https://connect.linux.do/oauth2/token') {
        return Response.json({
          access_token: 'fake-access-token'
        });
      }

      if (target === 'https://connect.linux.do/api/user') {
        return Response.json({
          sub: '1001',
          preferred_username: 'alice',
          name: 'Alice'
        });
      }

      throw new Error(`Unexpected outbound fetch: ${target}`);
    }
  });

  context.after(async () => {
    await app.close();
  });

  const baseUrl = await app.start();

  const oauthStartResponse = await fetch(`${baseUrl}/auth/linuxdo/start?returnTo=/admin.html`, {
    redirect: 'manual'
  });
  assert.equal(oauthStartResponse.status, 302);
  const authorizeLocation = oauthStartResponse.headers.get('location');
  assert.ok(authorizeLocation);

  const stateToken = new URL(authorizeLocation).searchParams.get('state');
  assert.ok(stateToken);

  const callbackResponse = await fetch(
    `${baseUrl}/auth/linuxdo/callback?code=fake-code&state=${stateToken}`,
    {
      redirect: 'manual'
    }
  );
  assert.equal(callbackResponse.status, 302);

  const cookie = callbackResponse.headers.get('set-cookie');
  assert.ok(cookie);
  const sessionCookie = cookie.split(';', 1)[0];

  const seedResponse = await fetch(`${baseUrl}/api/admin/cdks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: sessionCookie
    },
    body: JSON.stringify({
      pool: 'pve',
      bulkText: 'SAFE-AAA111',
      note: 'regression seed'
    })
  });
  assert.equal(seedResponse.status, 200);

  return {
    baseUrl,
    dataDir,
    sessionCookie,
    advance(ms) {
      nowMs += ms;
    }
  };
}

test('historical auto claimer path stays blocked under server verification hardening', async (context) => {
  const { baseUrl, dataDir, sessionCookie, advance } = await loginAndSeed(context);

  const sessionResponse = await fetch(`${baseUrl}/api/auth/session`, {
    headers: {
      Cookie: sessionCookie
    }
  });
  assert.equal(sessionResponse.status, 200);
  const sessionPayload = await sessionResponse.json();
  assert.equal(sessionPayload.awardSecurity?.requiresServerVerification, true);
  assert.equal(sessionPayload.awardSecurity?.allowClientReportedAwards, false);

  const directClaimResponse = await fetch(`${baseUrl}/api/cdks/claim`, {
    method: 'POST',
    headers: {
      Cookie: sessionCookie
    }
  });
  assert.equal(directClaimResponse.status, 409);
  const directClaimPayload = await directClaimResponse.json();
  assert.equal(directClaimPayload.error, 'award_not_ready');

  const startMatchResponse = await fetch(`${baseUrl}/api/awards/matches/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: sessionCookie
    },
    body: JSON.stringify({
      gameMode: 'duel',
      difficulty: 'normal'
    })
  });
  assert.equal(startMatchResponse.status, 200);
  const startMatchPayload = await startMatchResponse.json();
  assert.ok(startMatchPayload.activeMatch?.ticketId);

  // This mirrors the old abuse shape only inside an isolated local test app and
  // only asserts that the hardened server rejects it.
  advance(63_000);
  const forgedPrepareResponse = await fetch(`${baseUrl}/api/awards/prepare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: sessionCookie
    },
    body: JSON.stringify({
      ticketId: startMatchPayload.activeMatch.ticketId,
      summary: {
        gameMode: 'duel',
        difficulty: 'hard',
        winnerTeam: 'p1',
        playerTeam: 'p1',
        playerWon: true,
        playerIsMvp: true,
        eligibleForAward: true,
        mvpTeam: 'p1',
        mvpName: 'Alice',
        playerName: 'Alice',
        matchDurationSeconds: 999,
        playerStats: {
          kills: 9,
          deaths: 0,
          damageDealt: 999
        }
      }
    })
  });

  assert.equal(forgedPrepareResponse.status, 200);
  const forgedPreparePayload = await forgedPrepareResponse.json();
  assert.equal(forgedPreparePayload.prepared, false);
  assert.equal(forgedPreparePayload.eligible, false);
  assert.equal(forgedPreparePayload.disqualifyReason, 'server_verification_required');

  const repeatedPrepareResponse = await fetch(`${baseUrl}/api/awards/prepare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: sessionCookie
    },
    body: JSON.stringify({
      ticketId: startMatchPayload.activeMatch.ticketId,
      summary: {
        gameMode: 'duel',
        difficulty: 'normal',
        winnerTeam: 'p1',
        playerTeam: 'p1',
        playerWon: true,
        playerIsMvp: true,
        eligibleForAward: true,
        mvpTeam: 'p1',
        mvpName: 'Alice',
        playerName: 'Alice',
        matchDurationSeconds: 120,
        playerStats: {
          kills: 3,
          deaths: 1,
          damageDealt: 124
        }
      }
    })
  });

  assert.equal(repeatedPrepareResponse.status, 409);
  const repeatedPreparePayload = await repeatedPrepareResponse.json();
  assert.equal(repeatedPreparePayload.error, 'match_ticket_consumed');

  const postPrepareClaimResponse = await fetch(`${baseUrl}/api/cdks/claim`, {
    method: 'POST',
    headers: {
      Cookie: sessionCookie
    }
  });
  assert.equal(postPrepareClaimResponse.status, 409);
  const postPrepareClaimPayload = await postPrepareClaimResponse.json();
  assert.equal(postPrepareClaimPayload.error, 'award_not_ready');

  const myCodesResponse = await fetch(`${baseUrl}/api/cdks/me`, {
    headers: {
      Cookie: sessionCookie
    }
  });
  assert.equal(myCodesResponse.status, 200);
  const myCodesPayload = await myCodesResponse.json();
  assert.equal(myCodesPayload.claimCount, 0);
  assert.equal(myCodesPayload.latestClaim, null);
  assert.equal(myCodesPayload.pendingAward, null);

  const matchesStore = JSON.parse(await readFile(path.join(dataDir, 'matches.json'), 'utf8'));
  const blockedMatch = matchesStore.matches.find(
    (item) => item.ticketId === startMatchPayload.activeMatch.ticketId
  );
  assert.ok(blockedMatch);
  assert.equal(blockedMatch.rewardStatus, 'not_eligible');
  assert.equal(blockedMatch.summary?.awardBlockedReason, 'server_verification_required');
});
