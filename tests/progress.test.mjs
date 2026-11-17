import assert from 'node:assert/strict';
import { test } from 'node:test';
import { initialProgress, progressReducer, loadProgress, saveProgress } from '../src/app/progress.ts';

const act = (state, type, extra = {}) => progressReducer(state, { type, ...extra });

function throughCircus() {
  return ['begin', 'spill', 'refill', 'remember', 'collect'].reduce(act, initialProgress);
}

function throughPortrait() {
  return ['find-bongo', 'place-bongo', 'find-fredrick', 'stop-party', 'invite-tomi', 'take-photo', 'collect'].reduce(act, throughCircus());
}

function memoryStorage() {
  const data = new Map();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) },
  });
  return data;
}

test('all three chapters complete in order and collect each keepsake once', () => {
  let state = throughPortrait();
  assert.equal(state.step, 'concert');
  assert.deepEqual(state.collected, ['popcorn', 'portrait']);
  state = act(state, 'open-ticket');
  for (const answer of ['fall', 'white-mountains', 'second']) state = act(state, 'answer-drive', { answer });
  assert.equal(state.step, 'drive-complete');
  state = act(state, 'return-concert');
  state = act(state, 'next-passage', { passage: 0 });
  state = act(state, 'next-passage', { passage: 1 });
  state = act(state, 'collect');
  assert.equal(state.step, 'complete');
  assert.deepEqual(state.collected, ['popcorn', 'portrait', 'ticket']);
  assert.equal(act(state, 'collect'), state);
});

test('Tomi cannot join too early, and the camera requires all three friends', () => {
  let state = throughCircus();
  assert.equal(act(state, 'invite-tomi'), state);
  assert.equal(act(state, 'take-photo'), state);
  state = act(state, 'help-portrait');
  assert.equal(state.bongo, 'ready');
  state = act(state, 'help-portrait');
  assert.equal(state.fredrick, 'ready');
  assert.equal(state.tomiReady, false);
  state = act(state, 'help-portrait');
  assert.equal(act(state, 'take-photo').step, 'portrait-reveal');
});

test('wrong choices preserve progress; help completes the current choice only', () => {
  let state = act(throughPortrait(), 'open-ticket');
  assert.equal(act(state, 'answer-drive', { answer: 'winter' }), state);
  state = act(state, 'help-drive');
  assert.equal(state.driveAnswers, 1);
  assert.equal(state.step, 'drive');
  state = act(act(state, 'help-drive'), 'help-drive');
  assert.equal(state.step, 'drive-complete');
});

test('stale passage events and early collection cannot skip the reveal', () => {
  const state = { ...throughPortrait(), step: 'concert-reveal', driveAnswers: 3, passage: 0 };
  assert.equal(act(state, 'collect'), state);
  const next = act(state, 'next-passage', { passage: 0 });
  assert.equal(act(next, 'next-passage', { passage: 0 }), next);
});

test('reload restores portrait puzzle and drive checkpoints', () => {
  memoryStorage();
  const portrait = act(throughCircus(), 'find-bongo');
  saveProgress(portrait);
  assert.deepEqual(loadProgress(), portrait);
  const drive = act(act(throughPortrait(), 'open-ticket'), 'help-drive');
  saveProgress(drive);
  assert.deepEqual(loadProgress(), drive);
});

test('older saves with Bongo turned away migrate to the simpler portrait flow', () => {
  const data = memoryStorage();
  data.set('tomi-adventure-v3', JSON.stringify({ ...throughCircus(), step: 'portrait', bongo: 'backwards' }));
  assert.equal(loadProgress().bongo, 'ready');
});

test('old completed prototype resumes at chapter two; bad or blocked storage is safe', () => {
  const data = memoryStorage();
  data.set('tomi-adventure-v2', JSON.stringify({ version: 2, step: 'complete', popcornCollected: true }));
  assert.equal(loadProgress().step, 'portrait');
  data.set('tomi-adventure-v3', '{broken');
  assert.deepEqual(loadProgress(), initialProgress);
  data.set('tomi-adventure-v3', JSON.stringify({ ...initialProgress, step: 'drive' }));
  assert.deepEqual(loadProgress(), initialProgress);
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('Unavailable'); } });
  assert.deepEqual(loadProgress(), initialProgress);
  assert.doesNotThrow(() => saveProgress(initialProgress));
});
