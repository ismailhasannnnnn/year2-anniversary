import { useState } from 'react';
import type { Action, Step } from '../app/progress';
import { dialogue } from '../content/adventure';
import { family } from '../content/family';
import { DialogueBox } from '../components/DialogueBox';
import { FriendDrawing } from '../components/FamilyPortrait';
import { Arrow, Popcorn, Tomi } from '../components/Illustrations';

type CircusStep = Extract<Step, 'discover' | 'spilled' | 'refilled'>;

interface CircusProps {
  step: CircusStep;
  dispatch: (action: Action) => void;
}

export function Circus({ step, dispatch }: CircusProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const needsHelp = step === 'spilled';
  const mrClod = family.find((friend) => friend.id === 'mr-clod');

  function refill() {
    setFeedback(null);
    dispatch({ type: 'refill' });
  }

  return (
    <>
      <div className="chapter-heading">
        <span className="eyebrow">01 / operation popcorn</span>
        <h1>first, the popcorn.</h1>
        <p>{needsHelp ? 'dad spilled it. this is now a leadership opportunity.' : 'we need popcorn. please stay focused, mom.'}</p>
      </div>

      <section className={`circus-stage circus-${step}`} aria-label="An illustrated circus. Tap the labeled objects to explore.">
        <div className="circus-canopy" />
        <div className="circus-valance" />
        <div className="circus-string-lights" aria-hidden="true">
          {Array.from({ length: 11 }, (_, index) => <i key={index} />)}
        </div>
        <span className="circus-backdrop-label" aria-hidden="true">THE CIRCUS</span>
        <div className="circus-floor" />

        <button
          className="scene-object seat-object"
          onClick={() => setFeedback(dialogue.circus.seat)}
          disabled={!needsHelp}
          aria-label="Look at the circus seat"
        >
          <span className="seat-art" aria-hidden="true"><i /><i /></span>
          {needsHelp && <span className="object-label">The seat</span>}
        </button>

        <button
          className="scene-object stand-object"
          onClick={() => setFeedback(dialogue.circus.stand)}
          disabled={!needsHelp}
          aria-label="Explore the snack stand"
        >
          <span className="stand-art" aria-hidden="true">
            <span className="stand-roof" />
            <span className="stand-sign">POPCORN</span>
            <span className="stand-counter" />
          </span>
          {needsHelp && <span className="object-label">Snack stand</span>}
        </button>

        <button className="scene-object worker-object" onClick={refill} disabled={!needsHelp} aria-label="Ask the friendly circus worker for help">
          {mrClod && <FriendDrawing friend={mrClod} className="worker-art" />}
        </button>

        <Tomi className="circus-tomi" />
        <button
          className="scene-object popcorn-object"
          onClick={() => dispatch({ type: 'spill' })}
          disabled={step !== 'discover'}
          aria-label="Tap the enormous bag of popcorn"
        >
          <Popcorn />
        </button>

        {step !== 'discover' && (
          <div className="spilled-kernels" aria-hidden="true">
            {Array.from({ length: 16 }, (_, index) => (
              <i key={index} style={{ left: `${(index * 29) % 95}%`, top: `${(index * 19) % 65}%`, rotate: `${index * 37}deg` }} />
            ))}
          </div>
        )}
        {step === 'refilled' && <span className="refill-note handwritten">recovery complete · project lead tomi</span>}
      </section>

      <DialogueBox aside={needsHelp ? <button className="text-button" onClick={refill}>mom, give me a hand ↗</button> : undefined}>
        {feedback ?? dialogue.circus[step]}
      </DialogueBox>
      {step === 'refilled' && (
        <div className="scene-next">
          <button className="button button-primary" onClick={() => dispatch({ type: 'remember' })}>file this memory <Arrow /></button>
        </div>
      )}
    </>
  );
}
