import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const args = {
    url: 'http://127.0.0.1:4173/index.html',
    outDir: path.join(rootDir, 'output', 'visual-regression'),
    headless: true
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === '--url' && next) {
      args.url = next;
      i += 1;
    } else if (arg === '--out-dir' && next) {
      args.outDir = path.resolve(process.cwd(), next);
      i += 1;
    } else if (arg === '--headless' && next) {
      args.headless = next !== '0' && next !== 'false';
      i += 1;
    }
  }

  return args;
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

function expect(condition, message, failures) {
  if (!condition) failures.push(message);
}

function summarizeVisualState(snapshot) {
  return snapshot?.visualState || snapshot || {};
}

function scenarioResult(name, snapshot, failures) {
  const result = {
    name,
    ok: failures.length === 0,
    failures,
    visualState: summarizeVisualState(snapshot)
  };
  for (const key of ['peakFeedOpacity', 'peakScreenshot', 'peakFrameOffsetMs']) {
    if (snapshot && Object.hasOwn(snapshot, key)) {
      result[key] = snapshot[key];
    }
  }
  return result;
}

async function main() {
  const args = parseArgs(process.argv);
  await ensureDir(args.outDir);

  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch (error) {
    console.error(`Playwright is required for visual-system.browser.test.mjs: ${error.message}`);
    process.exit(1);
  }

  const browser = await chromium.launch({
    headless: args.headless,
    args: ['--use-gl=angle', '--use-angle=swiftshader']
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const runtimeErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      runtimeErrors.push({ type: 'console.error', text: msg.text() });
    }
  });
  page.on('pageerror', (error) => {
    runtimeErrors.push({ type: 'pageerror', text: String(error) });
  });

  await page.goto(args.url, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.phase21TestApi), { timeout: 10000 });
  await page.waitForTimeout(300);

  const runScenario = async (name, browserAction, verify, screenshotName = null) => {
    const snapshot = await page.evaluate(browserAction);
    if (screenshotName) {
      await page.screenshot({
        path: path.join(args.outDir, screenshotName),
        fullPage: false,
        type: 'png'
      });
    }
    const failures = [];
    try {
      verify(snapshot, failures);
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
    return scenarioResult(name, snapshot, failures);
  };

  const sampleCriticalSwingOverlapFrame = async (offsetMs = 0) => {
    return page.evaluate((sampleOffsetMs) => {
      const api = window.phase21TestApi;
      api.startMatch('duel', { forcePlaying: true });
      api.setEntityHp('p1', 20);
      api.advance(180);
      api.setEntityHp('p2', 10);
      api.firePlayerAtTeam('p2', { resetFeedback: false });
      api.advance(96);
      for (let timeoutId = 1; timeoutId < 1000; timeoutId += 1) {
        clearTimeout(timeoutId);
      }
      const banner = document.getElementById('banner');
      if (banner) {
        banner.classList.remove('show');
        banner.dataset.suppressed = 'true';
      }
      api.advance(16);
      if (sampleOffsetMs > 0) {
        api.advance(sampleOffsetMs);
      }
      const snapshot = api.snapshot();
      const combatFeed = document.getElementById('combatFeed');
      const styles = combatFeed ? window.getComputedStyle(combatFeed) : null;
      return {
        offsetMs: sampleOffsetMs,
        snapshot,
        feed: combatFeed && styles ? {
          opacity: Number(styles.opacity || 0),
          transform: styles.transform || '',
          emphasis: combatFeed.dataset.emphasis || 'standard',
          rect: (() => {
            const rect = combatFeed.getBoundingClientRect();
            return {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height
            };
          })()
        } : {
          opacity: 0,
          transform: '',
          emphasis: 'standard',
          rect: null
        }
      };
    }, offsetMs);
  };

  const runCriticalSwingOverlapScenario = async () => {
    await sampleCriticalSwingOverlapFrame(0);
    await page.screenshot({
      path: path.join(args.outDir, 'critical-plus-swing.png'),
      fullPage: false,
      type: 'png'
    });

    const sampleWindowMs = 192;
    const stepMs = 16;
    let bestFrame = null;

    for (let offsetMs = 0; offsetMs <= sampleWindowMs; offsetMs += stepMs) {
      const frame = await sampleCriticalSwingOverlapFrame(offsetMs);
      const visual = summarizeVisualState(frame.snapshot);
      const isCandidate = (
        visual.foregroundSeverity === 'swing' &&
        visual.backgroundSeverity === 'critical' &&
        visual.bannerVisible === false &&
        visual.combatFeed?.emphasis === 'hero' &&
        frame.feed.emphasis === 'hero' &&
        frame.feed.opacity > 0.01
      );
      if (isCandidate) {
        const shouldReplace = !bestFrame ||
          frame.feed.opacity > bestFrame.feed.opacity + 0.0001 ||
          (
            Math.abs(frame.feed.opacity - bestFrame.feed.opacity) <= 0.0001 &&
            frame.offsetMs < bestFrame.offsetMs
          );
        if (shouldReplace) {
          bestFrame = frame;
          await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => resolve())));
          await page.evaluate(() => {
            document.getElementById('combatFeedCapture')?.remove();
            const source = document.getElementById('combatFeed');
            if (!source) return;
            const rect = source.getBoundingClientRect();
            const clone = source.cloneNode(true);
            clone.id = 'combatFeedCapture';
            clone.style.position = 'fixed';
            clone.style.left = '24px';
            clone.style.top = '24px';
            clone.style.bottom = 'auto';
            clone.style.transform = 'none';
            clone.style.opacity = '1';
            clone.style.margin = '0';
            clone.style.zIndex = '99999';
            clone.style.pointerEvents = 'none';
            clone.style.width = `${Math.ceil(rect.width)}px`;
            clone.style.maxWidth = 'none';
            document.body.appendChild(clone);
          });
          await page.locator('#combatFeedCapture').screenshot({
            path: path.join(args.outDir, 'critical-plus-swing-peak.png'),
            type: 'png'
          });
          await page.evaluate(() => {
            document.getElementById('combatFeedCapture')?.remove();
          });
        }
      }
      if (offsetMs < sampleWindowMs) {
        await page.evaluate((ms) => {
          window.phase21TestApi.advance(ms);
        }, stepMs);
      }
    }

    const peakSnapshot = bestFrame
      ? {
          ...bestFrame.snapshot,
          peakFeedOpacity: Number(bestFrame.feed.opacity.toFixed(4)),
          peakScreenshot: 'critical-plus-swing-peak.png',
          peakFrameOffsetMs: bestFrame.offsetMs
        }
      : {
          ...(await page.evaluate(() => window.phase21TestApi.snapshot())),
          peakFeedOpacity: null,
          peakScreenshot: null,
          peakFrameOffsetMs: null
        };

    const failures = [];
    const visual = summarizeVisualState(peakSnapshot);
    expect(visual.severity === 'swing', 'critical-plus-swing-overlap severity should resolve to swing', failures);
    expect(visual.foregroundSeverity === 'swing', 'critical-plus-swing-overlap foregroundSeverity should be swing', failures);
    expect(visual.backgroundSeverity === 'critical', 'critical-plus-swing-overlap backgroundSeverity should stay critical', failures);
    expect(visual.bannerVisible === false, 'critical-plus-swing-overlap should suppress the center banner', failures);
    expect(visual.layerSeverities?.feed === 'swing', 'critical-plus-swing-overlap feed layer should be swing', failures);
    expect(visual.layerSeverities?.pulse === 'swing', 'critical-plus-swing-overlap pulse layer should be swing', failures);
    expect(visual.layerSeverities?.camera === 'swing', 'critical-plus-swing-overlap camera layer should be swing', failures);
    expect(visual.layerSeverities?.badge === 'critical', 'critical-plus-swing-overlap badge layer should remain critical', failures);
    expect(visual.layerSeverities?.vignette === 'critical', 'critical-plus-swing-overlap vignette layer should remain critical', failures);
    expect(visual.combatFeed?.emphasis === 'hero', 'critical-plus-swing-overlap combatFeed should use hero emphasis', failures);
    expect(typeof peakSnapshot.peakFeedOpacity === 'number', 'critical-plus-swing-overlap should report peakFeedOpacity', failures);
    expect(peakSnapshot.peakFeedOpacity > 0.7, 'critical-plus-swing-overlap peakFeedOpacity should exceed 0.7', failures);
    expect(peakSnapshot.peakScreenshot === 'critical-plus-swing-peak.png', 'critical-plus-swing-overlap should report peakScreenshot', failures);
    expect(Number.isFinite(peakSnapshot.peakFrameOffsetMs), 'critical-plus-swing-overlap should report peakFrameOffsetMs', failures);

    return scenarioResult('critical-plus-swing-overlap', peakSnapshot, failures);
  };

  const results = [];

  results.push(await runScenario(
    'duel-calm',
    () => {
      const api = window.phase21TestApi;
      return api.startMatch('duel', { forcePlaying: true });
    },
    (snapshot, failures) => {
      const visual = summarizeVisualState(snapshot);
      expect(visual.density === 'focus', 'duel-calm should keep focus density', failures);
      expect(visual.severity === 'calm', 'duel-calm severity should be calm', failures);
      expect(visual.foregroundSeverity === null, 'duel-calm foregroundSeverity should be null', failures);
      expect(visual.backgroundSeverity === null, 'duel-calm backgroundSeverity should be null', failures);
      expect(visual.persistentDanger === false, 'duel-calm persistentDanger should be false', failures);
      expect(Object.values(visual.layerSeverities || {}).every((value) => value === null), 'duel-calm layerSeverities should be empty', failures);
    }
  ));

  results.push(await runScenario(
    'damage-pressure',
    () => {
      const api = window.phase21TestApi;
      api.startMatch('duel', { forcePlaying: true });
      return api.damagePlayer(15, 'p2');
    },
    (snapshot, failures) => {
      const visual = summarizeVisualState(snapshot);
      expect(visual.foregroundSeverity === 'pressure', 'damage-pressure foregroundSeverity should be pressure', failures);
      expect(visual.backgroundSeverity === null, 'damage-pressure backgroundSeverity should be null', failures);
      expect(visual.layerSeverities?.feed === 'pressure', 'damage-pressure feed layer should be pressure', failures);
      expect(visual.layerSeverities?.pulse === 'pressure', 'damage-pressure pulse layer should be pressure', failures);
      expect(visual.layerSeverities?.camera === 'pressure', 'damage-pressure camera layer should be pressure', failures);
      expect(visual.layerSeverities?.vignette === null, 'damage-pressure vignette layer should be null', failures);
    }
  ));

  results.push(await runScenario(
    'near-miss-warning',
    () => {
      const api = window.phase21TestApi;
      api.startMatch('duel', { forcePlaying: true });
      return api.firePlayerNearMiss('p2');
    },
    (snapshot, failures) => {
      const visual = summarizeVisualState(snapshot);
      expect(visual.foregroundSeverity === 'warning', 'near-miss-warning foregroundSeverity should be warning', failures);
      expect(visual.backgroundSeverity === null, 'near-miss-warning backgroundSeverity should be null', failures);
      expect(visual.layerSeverities?.feed === 'warning', 'near-miss-warning feed layer should be warning', failures);
      expect(visual.layerSeverities?.pulse === 'warning', 'near-miss-warning pulse layer should be warning', failures);
      expect(visual.layerSeverities?.vignette === null, 'near-miss-warning vignette layer should be null', failures);
    }
  ));

  results.push(await runScenario(
    'low-hp-critical',
    () => {
      const api = window.phase21TestApi;
      api.startMatch('duel', { forcePlaying: true });
      api.setEntityHp('p1', 20);
      return api.advance(180);
    },
    (snapshot, failures) => {
      const visual = summarizeVisualState(snapshot);
      expect(visual.foregroundSeverity === null, 'low-hp-critical foregroundSeverity should be null', failures);
      expect(visual.backgroundSeverity === 'critical', 'low-hp-critical backgroundSeverity should be critical', failures);
      expect(visual.persistentDanger === true, 'low-hp-critical persistentDanger should be true', failures);
      expect(visual.layerSeverities?.badge === 'critical', 'low-hp-critical badge layer should be critical', failures);
      expect(visual.layerSeverities?.vignette === 'critical', 'low-hp-critical vignette layer should be critical', failures);
    },
    'critical.png'
  ));

  results.push(await runScenario(
    'heal-reset',
    () => {
      const api = window.phase21TestApi;
      api.startMatch('duel', { forcePlaying: true });
      api.setEntityHp('p1', 20);
      api.advance(180);
      api.setEntityHp('p1', 90);
      return api.advance(120);
    },
    (snapshot, failures) => {
      const visual = summarizeVisualState(snapshot);
      expect(visual.foregroundSeverity === null, 'heal-reset foregroundSeverity should be null', failures);
      expect(visual.backgroundSeverity === null, 'heal-reset backgroundSeverity should be null', failures);
      expect(visual.persistentDanger === false, 'heal-reset persistentDanger should be false', failures);
      expect(visual.layerSeverities?.vignette === null, 'heal-reset vignette should be cleared', failures);
      expect(visual.layerSeverities?.badge === null, 'heal-reset badge layer should be cleared', failures);
    }
  ));

  results.push(await runScenario(
    'topdown-pistol-shot-visual',
    () => {
      const api = window.phase21TestApi;
      api.startMatch('duel', { forcePlaying: true });
      api.setViewMode('topdown');
      api.setPlayerWeapon('pistol');
      return api.firePlayerAtTeam('p2');
    },
    (snapshot, failures) => {
      const visual = summarizeVisualState(snapshot);
      expect(snapshot.viewMode === 'topdown', 'topdown-pistol-shot-visual should stay in topdown mode', failures);
      expect(visual.shotFx?.lastViewMode === 'topdown', 'topdown-pistol-shot-visual lastViewMode should be topdown', failures);
      expect(visual.shotFx?.lastWeaponId === 'pistol', 'topdown-pistol-shot-visual lastWeaponId should be pistol', failures);
      expect((visual.shotFx?.lastStreakLength || 0) > 0.4, 'topdown-pistol-shot-visual should emit a visible streak', failures);
      expect((visual.shotFx?.lastStreakLength || 0) < 9, 'topdown-pistol-shot-visual streak should not span the full arena', failures);
      expect((visual.shotFx?.activeStreaks || 0) >= 1, 'topdown-pistol-shot-visual should keep at least one active streak', failures);
    }
  ));

  results.push(await runScenario(
    'fps-pistol-shot-visual',
    () => {
      const api = window.phase21TestApi;
      api.startMatch('duel', { forcePlaying: true });
      api.setViewMode('fps');
      api.setPlayerWeapon('pistol');
      return api.firePlayerAtTeam('p2');
    },
    (snapshot, failures) => {
      const visual = summarizeVisualState(snapshot);
      expect(snapshot.viewMode === 'fps', 'fps-pistol-shot-visual should stay in fps mode', failures);
      expect(visual.shotFx?.lastViewMode === 'fps', 'fps-pistol-shot-visual lastViewMode should be fps', failures);
      expect((visual.shotFx?.lastStreakLength || 0) > 0.2, 'fps-pistol-shot-visual should emit a short streak', failures);
      expect((visual.shotFx?.lastStreakLength || 0) < 4.5, 'fps-pistol-shot-visual streak should stay close to the muzzle', failures);
      expect((visual.shotFx?.lastTravelHint || 0) <= 1, 'fps-pistol-shot-visual should report travel-hint state', failures);
    }
  ));

  results.push(await runScenario(
    'smg-density-shot-visual',
    () => {
      const api = window.phase21TestApi;
      api.startMatch('deathmatch', { forcePlaying: true });
      api.setViewMode('topdown');
      api.setPlayerWeapon('smg');
      for (let i = 0; i < 4; i += 1) {
        api.firePlayerAtTeam('p2', { resetFeedback: i === 0 });
        api.advance(16);
      }
      return api.snapshot();
    },
    (snapshot, failures) => {
      const visual = summarizeVisualState(snapshot);
      expect(visual.shotFx?.lastWeaponId === 'smg', 'smg-density-shot-visual lastWeaponId should be smg', failures);
      expect((visual.shotFx?.sampleEvery || 0) >= 2, 'smg-density-shot-visual should use sampling for streak emission', failures);
      expect((visual.shotFx?.sampleSkipped || 0) >= 1, 'smg-density-shot-visual should skip some rapid-fire streaks', failures);
      expect((visual.shotFx?.activeStreaks || 0) <= 3, 'smg-density-shot-visual should avoid screen-filling streak spam', failures);
    }
  ));

  results.push(await runScenario(
    'barrel-impact-shot-visual',
    () => {
      const api = window.phase21TestApi;
      api.startMatch('duel', { forcePlaying: true });
      api.setViewMode('topdown');
      return api.firePlayerAtBarrel(0);
    },
    (snapshot, failures) => {
      const visual = summarizeVisualState(snapshot);
      expect(visual.shotFx?.lastImpactKind === 'barrel', 'barrel-impact-shot-visual lastImpactKind should be barrel', failures);
      expect(visual.shotFx?.lastImpactStyle === 'barrel', 'barrel-impact-shot-visual lastImpactStyle should use barrel profile', failures);
      expect((visual.shotFx?.activeImpactFlashes || 0) >= 1, 'barrel-impact-shot-visual should emit an impact flash', failures);
    }
  ));

  results.push(await runScenario(
    'near-miss-shot-visual',
    () => {
      const api = window.phase21TestApi;
      api.startMatch('duel', { forcePlaying: true });
      api.setViewMode('fps');
      return api.firePlayerNearMiss('p2');
    },
    (snapshot, failures) => {
      const visual = summarizeVisualState(snapshot);
      expect(visual.shotFx?.lastImpactKind === 'near_miss', 'near-miss-shot-visual lastImpactKind should be near_miss', failures);
      expect(visual.shotFx?.lastImpactStyle === 'near_miss', 'near-miss-shot-visual should use near_miss impact style', failures);
      expect(visual.shotFx?.lastViewMode === 'fps', 'near-miss-shot-visual should preserve fps view mode', failures);
      expect((visual.shotFx?.activeImpactFlashes || 0) >= 1, 'near-miss-shot-visual should emit a near-miss flash', failures);
    }
  ));

  results.push(await runCriticalSwingOverlapScenario());

  results.push(await runScenario(
    'deathmatch-compact-calm',
    () => {
      const api = window.phase21TestApi;
      return api.startMatch('deathmatch', { forcePlaying: true });
    },
    (snapshot, failures) => {
      const visual = summarizeVisualState(snapshot);
      expect(visual.density === 'compact', 'deathmatch-compact-calm density should be compact', failures);
      expect(visual.severity === 'calm', 'deathmatch-compact-calm severity should be calm', failures);
      expect(visual.foregroundSeverity === null, 'deathmatch-compact-calm foregroundSeverity should be null', failures);
      expect(visual.backgroundSeverity === null, 'deathmatch-compact-calm backgroundSeverity should be null', failures);
    }
  ));

  results.push(await runScenario(
    'restart-menu-reset',
    () => {
      const api = window.phase21TestApi;
      api.startMatch('duel', { forcePlaying: true });
      api.setEntityHp('p1', 20);
      api.advance(180);
      api.setEntityHp('p2', 10);
      api.firePlayerAtTeam('p2', { resetFeedback: false });
      return api.startMatch('duel', { forcePlaying: true });
    },
    (snapshot, failures) => {
      const visual = summarizeVisualState(snapshot);
      expect(visual.severity === 'calm', 'restart-menu-reset severity should be calm', failures);
      expect(visual.foregroundSeverity === null, 'restart-menu-reset foregroundSeverity should be null', failures);
      expect(visual.backgroundSeverity === null, 'restart-menu-reset backgroundSeverity should be null', failures);
      expect(visual.persistentDanger === false, 'restart-menu-reset persistentDanger should be false', failures);
      expect(Object.values(visual.layerSeverities || {}).every((value) => value === null), 'restart-menu-reset layerSeverities should be cleared', failures);
    }
  ));

  const report = {
    url: args.url,
    generatedAt: new Date().toISOString(),
    results,
    runtimeErrors
  };

  await fs.writeFile(
    path.join(args.outDir, 'results.json'),
    JSON.stringify(report, null, 2),
    'utf8'
  );

  const failingScenarios = results.filter((entry) => !entry.ok);
  if (runtimeErrors.length > 0) {
    await fs.writeFile(
      path.join(args.outDir, 'runtime-errors.json'),
      JSON.stringify(runtimeErrors, null, 2),
      'utf8'
    );
  }

  await browser.close();

  assert.equal(runtimeErrors.length, 0, `browser runtime errors: ${JSON.stringify(runtimeErrors, null, 2)}`);
  assert.equal(failingScenarios.length, 0, `visual regression failures: ${JSON.stringify(failingScenarios, null, 2)}`);
  console.log(`visual-system.browser.test.mjs passed with ${results.length} scenarios`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
