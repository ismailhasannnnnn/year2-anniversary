import { useState } from 'react';
import { DRIVE_ANSWERS, type Action, type Progress } from '../app/progress';
import { concertPassages, driveQuestions } from '../content/concert';
import { AutumnLandscape, ChoiceDrawing } from '../components/AutumnLandscape';
import { DialogueBox } from '../components/DialogueBox';
import { Arrow, Tomi } from '../components/Illustrations';

function ConcertStage({ children }: { children?: React.ReactNode }) {
  return (
    <div className="concert-stage">
      <div className="concert-stars" aria-hidden="true" />
      <div className="stage-light light-amber" /><div className="stage-light light-rose" /><div className="stage-light light-sage" />
      <div className="concert-platform" aria-hidden="true"><span className="stage-mic" /></div>
      <div className="concert-crowd" aria-hidden="true">{Array.from({ length: 19 }, (_, i) => <i key={i} style={{ height: `${40 + (i * 17) % 40}px` }} />)}</div>
      {children}
    </div>
  );
}

export function Concert({ progress, dispatch }: { progress: Progress; dispatch: (action: Action) => void }) {
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const driving = progress.step === 'drive' || progress.step === 'drive-complete';
  const driveComplete = progress.step === 'drive-complete';
  const revealing = progress.step === 'concert-reveal';
  const question = driveQuestions[Math.min(progress.driveAnswers, 2)];
  const passage = concertPassages[progress.passage];

  function choose(answer: string) {
    if (answer !== DRIVE_ANSWERS[progress.driveAnswers]) {
      setFeedback('not quite, mom. try again. i am keeping track.');
      setAttempts((value) => value + 1);
      return;
    }
    setFeedback('');
    setAttempts(0);
    setShowHint(false);
    dispatch({ type: 'answer-drive', answer });
  }

  return (
    <>
      <div className="chapter-heading">
        <span className="eyebrow">03 / a story from dad</span>
        <h1>{driving ? 'your second date.' : revealing ? 'dad told me about this song.' : 'dad says this song is important.'}</h1>
        <p>{driving ? 'dad told me about the drive. now i have questions.' : 'dad says this song started a very important memory.'}</p>
      </div>
      {driving ? (
        <>
          <section className="drive-scene" aria-label="Reconstruct the second-date drive">
            <AutumnLandscape answers={progress.driveAnswers} travelling={driveComplete} />
            <div className="drive-caption handwritten">{progress.driveAnswers >= 2 ? 'the White Mountains, in fall' : 'somewhere at the beginning'}</div>
            <div className="drive-progress" aria-label={`${progress.driveAnswers} of 3 pieces remembered`}>
              {['The season', 'The place', 'The day'].map((label, i) => <span key={label} className={i < progress.driveAnswers ? 'remembered' : ''}>{i < progress.driveAnswers ? '✓' : '○'} {label}</span>)}
            </div>
          </section>
          {driveComplete ? (
            <div className="drive-finished">
              <p className="handwritten">your second date. fall colors. you and dad. i have recorded all the important facts.</p>
              <button className="button button-primary" onClick={() => dispatch({ type: 'return-concert' })}>back to dad's story <Arrow /></button>
            </div>
          ) : (
            <section className="choice-puzzle" aria-labelledby="drive-question">
              <div key={progress.driveAnswers} className="choice-page">
                <span className="eyebrow">mom's memory check · {progress.driveAnswers + 1} / 3</span>
                <h2 id="drive-question">{question.prompt}</h2>
                <div className="drive-choices">
                  {question.options.map((option) => <button key={option.id} className="drive-choice" onClick={() => choose(option.id)}><ChoiceDrawing kind={option.drawing} /><span>{option.label}</span></button>)}
                </div>
              </div>
              <p className="choice-feedback" role="status">{feedback || 'mom, choose the detail that belongs in your memory.'}</p>
              {(showHint || attempts >= 2) && <p className="puzzle-hint">{question.hint}</p>}
              <div className="choice-help"><button className="text-button" onClick={() => setShowHint(true)}>ask tomi for a hint</button><button className="text-button" onClick={() => choose(DRIVE_ANSWERS[progress.driveAnswers])}>have tomi fill it in ↗</button></div>
            </section>
          )}
        </>
      ) : revealing ? (
        <section className="concert-reveal">
          <ConcertStage><span className="concert-memory-caption handwritten">the part dad told me about</span></ConcertStage>
          <div className="concert-passage" key={progress.passage} aria-live="polite">
            <span className="eyebrow">{String(progress.passage + 1).padStart(2, '0')} / 03</span>
            <h2>{passage.title}</h2><p>{passage.text}</p>
          </div>
          <button className="button button-primary" onClick={() => dispatch(progress.passage < 2 ? { type: 'next-passage', passage: progress.passage } : { type: 'collect' })}>
            {progress.passage < 2 ? 'next detail' : 'file this memory'} <Arrow />
          </button>
        </section>
      ) : (
        <>
          <ConcertStage>
            <span className="concert-name">NOAH KAHAN<span>a night worth keeping</span></span>
            <Tomi className="concert-tomi" />
            <button className="concert-ticket" onClick={() => dispatch({ type: 'open-ticket' })} aria-label="Open the concert ticket and remember the drive">
              <span className="eyebrow">Admit two</span><strong>A way back.</strong><span>ONE SONG · ONE MEMORY</span><span className="ticket-stub">Turn it over ↗</span>
            </button>
          </ConcertStage>
          <DialogueBox>dad told me about a concert ticket. i think there is a whole afternoon inside it.</DialogueBox>
        </>
      )}
    </>
  );
}
