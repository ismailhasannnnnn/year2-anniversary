import { useEffect, useReducer, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { LittleStar } from '../components/Illustrations';
import { MemoryShelf } from '../components/MemoryShelf';
import { ChapterComplete } from '../scenes/ChapterComplete';
import { Circus } from '../scenes/Circus';
import { MemoryReveal } from '../scenes/MemoryReveal';
import { Opening } from '../scenes/Opening';
import { Portrait } from '../scenes/Portrait';
import { Concert } from '../scenes/Concert';
import { loadProgress, progressReducer, saveProgress, sceneKey, type Action } from './progress';

export function App() {
  const [progress, rawDispatch] = useReducer(progressReducer, undefined, loadProgress);
  const transitionActive = useRef(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const restartDialogRef = useRef<HTMLDialogElement>(null);
  const previousStep = useRef(progress.step);
  const isOpening = progress.step === 'opening';

  function dispatch(action: Action) {
    if (transitionActive.current) return;
    const next = progressReducer(progress, action);
    if (next === progress) return;
    const changesScene = sceneKey(next.step) !== sceneKey(progress.step);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const commit = () => {
      flushSync(() => rawDispatch(action));
      if (changesScene) mainRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    };

    if (!changesScene || reducedMotion || !document.startViewTransition) {
      commit();
      return;
    }

    // Snapshot outgoing and incoming scenes. The browser owns cleanup, including
    // skipped transitions in background tabs; story progress never waits on a timer.
    transitionActive.current = true;
    document.documentElement.dataset.transition = action.type === 'take-photo'
      ? 'photograph' : action.type === 'open-ticket' || action.type === 'return-concert' ? 'memory' : 'chapter';
    const transition = document.startViewTransition(commit);
    void transition.finished.catch(() => {}).finally(() => {
      transitionActive.current = false;
      delete document.documentElement.dataset.transition;
    });
  }

  useEffect(() => saveProgress(progress), [progress]);

  useEffect(() => {
    if (previousStep.current === progress.step) return;
    previousStep.current = progress.step;

    // Keep focus on a stable landmark when the pressed button leaves the page.
    mainRef.current?.focus({ preventScroll: true });
  }, [progress.step]);

  useEffect(() => {
    if (confirmRestart) restartDialogRef.current?.showModal();
    else restartDialogRef.current?.close();
  }, [confirmRestart]);

  function restart() {
    dispatch({ type: 'restart' });
    setConfirmRestart(false);
  }

  return (
    <div className="page-shell">
      <header className="site-header">
        <a className="wordmark" href="#main" aria-label="Tomi’s little adventure"><LittleStar /> tomi’s little adventure</a>
        <span className="header-dedication">mom and dad's anniversary · managed by tomi</span>
        <span className="header-edition">VOL. 02 <span> / </span> ANNIVERSARY</span>
      </header>

      <main id="main" ref={mainRef} tabIndex={-1}>
        <div className="adventure-scene" key={sceneKey(progress.step)}>
        {isOpening && <Opening onBegin={() => dispatch({ type: 'begin' })} />}
        {(progress.step === 'discover' || progress.step === 'spilled' || progress.step === 'refilled') && (
          <Circus step={progress.step} dispatch={dispatch} />
        )}
        {progress.step === 'reveal' && <MemoryReveal onCollect={() => dispatch({ type: 'collect' })} />}
        {(progress.step === 'portrait' || progress.step === 'portrait-reveal') && <Portrait progress={progress} dispatch={dispatch} />}
        {['concert', 'drive', 'drive-complete', 'concert-reveal'].includes(progress.step) && <Concert progress={progress} dispatch={dispatch} />}
        {progress.step === 'complete' && <ChapterComplete onReplay={() => setConfirmRestart(true)} />}
        </div>
        <MemoryShelf collected={progress.collected} />
      </main>

      <footer className="site-footer">
        {!isOpening && <button className="text-button" onClick={() => setConfirmRestart(true)}>Start again</button>}
      </footer>

      <dialog ref={restartDialogRef} className="restart-dialog" onCancel={() => setConfirmRestart(false)} onClose={() => setConfirmRestart(false)} aria-labelledby="restart-title">
        <span className="eyebrow">One more adventure?</span>
        <h2 id="restart-title">Start from the beginning?</h2>
        <p>This will empty your memory box and restart the adventure.</p>
        <div className="dialog-actions">
          <button className="button button-secondary" autoFocus onClick={() => setConfirmRestart(false)}>Keep my place</button>
          <button className="button button-primary" onClick={restart}>Start again</button>
        </div>
      </dialog>
    </div>
  );
}
