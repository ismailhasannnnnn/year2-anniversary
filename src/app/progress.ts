import type { MemoryId } from '../content/adventure';

export type Step =
  | 'opening' | 'discover' | 'spilled' | 'refilled' | 'reveal'
  | 'portrait' | 'portrait-reveal'
  | 'concert' | 'drive' | 'drive-complete' | 'concert-reveal' | 'complete';

export interface Progress {
  version: 3;
  step: Step;
  collected: MemoryId[];
  bongo: 'hidden' | 'found' | 'ready';
  fredrick: 'hidden' | 'dancing' | 'ready';
  tomiReady: boolean;
  driveAnswers: number;
  passage: number;
}

export type Action =
  | { type: 'begin' }
  | { type: 'spill' }
  | { type: 'refill' }
  | { type: 'remember' }
  | { type: 'collect' }
  | { type: 'restart' }
  | { type: 'find-bongo' | 'place-bongo' }
  | { type: 'find-fredrick' | 'stop-party' | 'invite-tomi' | 'help-portrait' | 'take-photo' }
  | { type: 'open-ticket' | 'answer-drive'; answer?: string }
  | { type: 'help-drive' | 'return-concert' }
  | { type: 'next-passage'; passage: number };

const STORAGE_KEY = 'tomi-adventure-v3';
const STEPS: Step[] = [
  'opening', 'discover', 'spilled', 'refilled', 'reveal', 'portrait',
  'portrait-reveal', 'concert', 'drive', 'drive-complete', 'concert-reveal', 'complete',
];
export const DRIVE_ANSWERS = ['fall', 'white-mountains', 'second'];

export const initialProgress: Progress = {
  version: 3,
  step: 'opening',
  collected: [],
  bongo: 'hidden',
  fredrick: 'hidden',
  tomiReady: false,
  driveAnswers: 0,
  passage: 0,
};

export function portraitReady(state: Progress): boolean {
  return state.bongo === 'ready' && state.fredrick === 'ready' && state.tomiReady;
}

function collect(state: Progress, memory: MemoryId, step: Step): Progress {
  return { ...state, step, collected: [...new Set([...state.collected, memory])] };
}

/** Only the expected action can advance a checkpoint; repeated taps are harmless. */
export function progressReducer(state: Progress, action: Action): Progress {
  switch (action.type) {
    case 'begin':
      return state.step === 'opening' ? { ...state, step: 'discover' } : state;
    case 'spill':
      return state.step === 'discover' ? { ...state, step: 'spilled' } : state;
    case 'refill':
      return state.step === 'spilled' ? { ...state, step: 'refilled' } : state;
    case 'remember':
      return state.step === 'refilled' ? { ...state, step: 'reveal' } : state;
    case 'collect':
      if (state.step === 'reveal') return collect(state, 'popcorn', 'portrait');
      if (state.step === 'portrait-reveal') return collect(state, 'portrait', 'concert');
      if (state.step === 'concert-reveal' && state.passage === 2) return collect(state, 'ticket', 'complete');
      return state;
    case 'find-bongo':
      return state.step === 'portrait' && state.bongo === 'hidden' ? { ...state, bongo: 'found' } : state;
    case 'place-bongo':
      return state.step === 'portrait' && state.bongo === 'found' ? { ...state, bongo: 'ready' } : state;
    case 'find-fredrick':
      return state.step === 'portrait' && state.fredrick === 'hidden' ? { ...state, fredrick: 'dancing' } : state;
    case 'stop-party':
      return state.step === 'portrait' && state.fredrick === 'dancing' ? { ...state, fredrick: 'ready' } : state;
    case 'invite-tomi':
      return state.step === 'portrait' && state.bongo === 'ready' && state.fredrick === 'ready'
        ? { ...state, tomiReady: true } : state;
    case 'help-portrait':
      if (state.step !== 'portrait') return state;
      if (state.bongo !== 'ready') return { ...state, bongo: 'ready' };
      if (state.fredrick !== 'ready') return { ...state, fredrick: 'ready' };
      return { ...state, tomiReady: true };
    case 'take-photo':
      return state.step === 'portrait' && portraitReady(state) ? { ...state, step: 'portrait-reveal' } : state;
    case 'open-ticket':
      return state.step === 'concert' ? { ...state, step: 'drive' } : state;
    case 'answer-drive': {
      if (state.step !== 'drive' || action.answer !== DRIVE_ANSWERS[state.driveAnswers]) return state;
      const driveAnswers = state.driveAnswers + 1;
      return { ...state, driveAnswers, step: driveAnswers === 3 ? 'drive-complete' : 'drive' };
    }
    case 'help-drive':
      return progressReducer(state, { type: 'answer-drive', answer: DRIVE_ANSWERS[state.driveAnswers] });
    case 'return-concert':
      return state.step === 'drive-complete' ? { ...state, step: 'concert-reveal' } : state;
    case 'next-passage':
      return state.step === 'concert-reveal' && state.passage === action.passage && state.passage < 2
        ? { ...state, passage: state.passage + 1 } : state;
    case 'restart':
      return initialProgress;
  }
}

/** Keep a scene mounted during its puzzle, and animate only full scene changes. */
export function sceneKey(step: Step): string {
  if (['discover', 'spilled', 'refilled'].includes(step)) return 'circus';
  if (step === 'drive-complete') return 'drive';
  return step;
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacy = JSON.parse(localStorage.getItem('tomi-adventure-v2') ?? 'null');
      if (legacy?.version === 2 && legacy.step === 'complete') {
        return { ...initialProgress, step: 'portrait', collected: ['popcorn'] };
      }
      if (legacy?.version === 2 && ['opening', 'discover', 'spilled', 'refilled', 'reveal'].includes(legacy.step)) {
        return { ...initialProgress, step: legacy.step };
      }
      return initialProgress;
    }

    const saved = JSON.parse(raw) as Partial<Progress> | null;
    if (!saved || saved.version !== 3 || !STEPS.includes(saved.step as Step)) return initialProgress;
    // Earlier saves had an extra "turn Bongo around" step; the supplied drawing faces forward.
    const savedBongo = (saved as { bongo?: string }).bongo;
    const bongo = savedBongo === 'backwards' ? 'ready' : savedBongo;
    if (!['hidden', 'found', 'ready'].includes(bongo ?? '')) return initialProgress;
    if (!['hidden', 'dancing', 'ready'].includes(saved.fredrick ?? '')) return initialProgress;
    if (typeof saved.tomiReady !== 'boolean') return initialProgress;
    if (!Number.isInteger(saved.driveAnswers) || saved.driveAnswers! < 0 || saved.driveAnswers! > 3) return initialProgress;
    if (!Number.isInteger(saved.passage) || saved.passage! < 0 || saved.passage! > 2) return initialProgress;
    const stage = STEPS.indexOf(saved.step!);
    const expected: MemoryId[] = stage >= 7 ? ['popcorn', 'portrait'] : stage >= 5 ? ['popcorn'] : [];
    if (saved.step === 'complete') expected.push('ticket');
    if (JSON.stringify(saved.collected) !== JSON.stringify(expected)) return initialProgress;
    const progress = { ...saved, bongo } as Progress;
    if (stage >= 6 && !portraitReady(progress)) return initialProgress;
    if (stage >= 9 && saved.driveAnswers !== 3) return initialProgress;
    if (saved.step === 'drive' && saved.driveAnswers === 3) return initialProgress;
    return progress;
  } catch {
    // Private browsing or corrupt storage must never prevent the adventure.
  }
  return initialProgress;
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // The full experience also works without persistence.
  }
}
