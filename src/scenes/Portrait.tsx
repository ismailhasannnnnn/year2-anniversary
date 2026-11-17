import { useEffect, useRef, useState } from 'react';
import { portraitReady, type Action, type Progress } from '../app/progress';
import { family } from '../content/family';
import { DialogueBox } from '../components/DialogueBox';
import { FamilyPortrait, FriendDrawing } from '../components/FamilyPortrait';
import { Arrow, Tomi } from '../components/Illustrations';

export function Portrait({ progress, dispatch }: { progress: Progress; dispatch: (action: Action) => void }) {
  const [hint, setHint] = useState(false);
  const [zoom, setZoom] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const reveal = progress.step === 'portrait-reveal';
  const ready = portraitReady(progress);
  const friendsReady = progress.bongo === 'ready' && progress.fredrick === 'ready';
  const present = family.filter(({ id }) => {
    if (id === 'bongo') return progress.bongo === 'ready';
    if (id === 'fredrick') return progress.fredrick === 'ready';
    if (id === 'tomi') return progress.tomiReady;
    return true;
  }).map(({ id }) => id);

  useEffect(() => {
    if (zoom) dialog.current?.showModal();
    else dialog.current?.close();
  }, [zoom]);

  let line = 'mom, i arranged everyone for the picture. almost everyone is cooperating.';
  if (progress.bongo === 'found') line = 'there you are, bongo. your spot is right here. we are taking a picture, not hiding.';
  if (progress.fredrick === 'dancing') line = 'mom, fredrick is still dancing. please switch off the party light so we can continue.';
  if (friendsReady) line = 'everyone is ready. except… someone is missing.';
  if (friendsReady && hint) line = 'the person organizing the picture belongs in it too. tap tomi.';
  if (ready) line = 'oh. me. yes, of course. everyone look at the camera.';

  return (
    <>
      <div className="chapter-heading">
        <span className="eyebrow">02 / our little world</span>
        <h1>{reveal ? 'everyone is here.' : 'the team photo. almost.'}</h1>
        <p>{reveal ? 'mom, our whole family made it into the picture.' : 'a few familiar faces, and a very serious organizer.'}</p>
      </div>
      {reveal ? (
        <section className="portrait-keepsake">
          <button className="portrait-photo" onClick={() => setZoom(true)} aria-label="Enlarge the completed family portrait">
            <span className="print-tape" /><FamilyPortrait />
            <span className="handwritten">team photo. everyone in the right place.</span>
          </button>
          <p className="portrait-message">bongo is in his spot. fredrick stood still long enough for the photo.<br />i am in the middle, where the leader should be. excellent.</p>
          <button className="button button-primary" onClick={() => dispatch({ type: 'collect' })}>save the team photo <Arrow /></button>
        </section>
      ) : (
        <>
          <section className="portrait-room" aria-label="Find the missing friends in the room">
            <div className="room-window" aria-hidden="true"><i /></div>
            <div className="room-frame"><span className="handwritten">our little world</span></div>
            <div className="portrait-arrangement">
              <FamilyPortrait present={present}
                onPlaceBongo={progress.bongo === 'found' ? () => dispatch({ type: 'place-bongo' }) : undefined} />
            </div>
            {['hidden', 'found'].includes(progress.bongo) && (
              <button className={`cushion-search ${progress.bongo === 'found' ? 'cushion-open' : ''}`} onClick={() => dispatch({ type: 'find-bongo' })} disabled={progress.bongo === 'found'} aria-label="Look behind the cushion for Bongo">
                <FriendDrawing friend={family[1]} /><span className="room-cushion" /><span className="object-label">{progress.bongo === 'hidden' ? 'A suspicious cushion' : 'Bongo is waiting'}</span>
              </button>
            )}
            {progress.fredrick !== 'ready' && (
              <div className={`curtain-search ${progress.fredrick === 'dancing' ? 'curtain-open' : ''}`}>
                <div className="party-glow" aria-hidden="true" />
                <FriendDrawing friend={family[2]} />
                <button className="room-curtain" onClick={() => dispatch({ type: 'find-fredrick' })} disabled={progress.fredrick === 'dancing'} aria-label="Look behind the glowing curtain" />
                <button className="object-label" onClick={() => dispatch({ type: progress.fredrick === 'hidden' ? 'find-fredrick' : 'stop-party' })}>
                  {progress.fredrick === 'hidden' ? 'Lights behind the curtain' : 'Switch off party light'}
                </button>
              </div>
            )}
            {!progress.tomiReady && (
              <button className="portrait-guide" disabled={!friendsReady} onClick={() => dispatch({ type: 'invite-tomi' })} aria-label="Invite Tomi into the family portrait"><Tomi /><span className="handwritten">Tomi</span></button>
            )}
            <span className="room-rug" aria-hidden="true" />
          </section>
          <DialogueBox aside={<button className="text-button" onClick={() => dispatch({ type: 'help-portrait' })}>let me handle it ↗</button>}>{line}</DialogueBox>
          <div className="portrait-controls">
            {ready ? <button className="button button-primary camera-button" onClick={() => dispatch({ type: 'take-photo' })}><span aria-hidden="true">◎</span> Take the photograph</button>
              : <button className="text-button" onClick={() => setHint(true)}>ask tomi for a hint ↗</button>}
            {hint && !friendsReady && <p className="puzzle-hint">mom, check the cushion and the glowing curtain. then tap bongo's empty spot.</p>}
          </div>
        </>
      )}
      <dialog className="portrait-dialog" ref={dialog} onCancel={() => setZoom(false)} onClose={() => setZoom(false)} aria-label="Enlarged family portrait">
        <button autoFocus className="text-button" onClick={() => setZoom(false)}>Close portrait ×</button>
        <FamilyPortrait />
      </dialog>
    </>
  );
}
