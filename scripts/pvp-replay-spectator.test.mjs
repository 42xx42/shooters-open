import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildReplaySpectateTimeline,
  clampReplaySeconds,
  findReplayEventCursor,
  findReplaySnapshotIndex
} from '../src/pvp-replay-spectator.js';

test('clampReplaySeconds clamps to replay duration', () => {
  assert.equal(clampReplaySeconds(-3, 12), 0);
  assert.equal(clampReplaySeconds(4.2, 12), 4.2);
  assert.equal(clampReplaySeconds(18, 12), 12);
});

test('findReplaySnapshotIndex picks the latest snapshot at or before playhead', () => {
  const snapshots = [
    { timelineSeconds: 0 },
    { timelineSeconds: 2.5 },
    { timelineSeconds: 7.25 }
  ];

  assert.equal(findReplaySnapshotIndex(snapshots, 0), 0);
  assert.equal(findReplaySnapshotIndex(snapshots, 1.4), 0);
  assert.equal(findReplaySnapshotIndex(snapshots, 2.5), 1);
  assert.equal(findReplaySnapshotIndex(snapshots, 99), 2);
});

test('findReplayEventCursor skips past all events up to current playhead', () => {
  const events = [
    { timelineSeconds: 0.5 },
    { timelineSeconds: 1.2 },
    { timelineSeconds: 4.8 }
  ];

  assert.equal(findReplayEventCursor(events, 0), 0);
  assert.equal(findReplayEventCursor(events, 0.5), 1);
  assert.equal(findReplayEventCursor(events, 2), 2);
  assert.equal(findReplayEventCursor(events, 9), 3);
});

test('buildReplaySpectateTimeline sorts entries and derives duration', () => {
  const timeline = buildReplaySpectateTimeline({
    snapshots: [
      { timelineSeconds: 6 },
      { timelineSeconds: 1 }
    ],
    events: [
      { timelineSeconds: 4 },
      { timelineSeconds: 2 }
    ]
  });

  assert.deepEqual(
    timeline.snapshots.map((entry) => entry.timelineSeconds),
    [1, 6]
  );
  assert.deepEqual(
    timeline.events.map((entry) => entry.timelineSeconds),
    [2, 4]
  );
  assert.equal(timeline.durationSeconds, 6);
});
