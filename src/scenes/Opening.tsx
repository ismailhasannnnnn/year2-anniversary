import { dialogue } from '../content/adventure';
import { DialogueBox } from '../components/DialogueBox';
import { Arrow, LittleStar, MemoryChest, Tomi } from '../components/Illustrations';

export function Opening({ onBegin }: { onBegin: () => void }) {
  return (
    <>
      <section className="opening-scene" aria-labelledby="opening-title">
        <div className="opening-copy">
          <span className="eyebrow chapter-label"><span className="small-line" /> dad's anniversary gift · tomi's assignment</span>
          <h1 id="opening-title">dad gave me an<br />important <em>job.</em></h1>
          <p>there are three memories in this gift. i will help you find them. please follow my instructions.</p>
          <button className="button button-primary" onClick={onBegin}>
            start the assignment <Arrow />
          </button>
          <span className="opening-footnote">project manager: tomi.</span>
        </div>

        <div className="opening-art" role="img" aria-label="Tomi, a little fried shrimp tail, stands beside an open wooden memory box.">
          <div className="art-sun" />
          <div className="art-ground" />
          <div className="art-orbit" />
          <LittleStar className="art-star star-one" />
          <LittleStar className="art-star star-two" />
          <span className="art-dot dot-one" />
          <span className="art-dot dot-two" />
          <span className="handwritten box-note">important things. i am organizing them.</span>
          <svg className="note-arrow" viewBox="0 0 100 80" fill="none" aria-hidden="true">
            <path d="M10 8c65-17 91 33 46 57m3-15-4 16 17-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <MemoryChest className="opening-chest" />
          <Tomi className="opening-tomi" />
        </div>
      </section>
      <DialogueBox>{dialogue.opening.text}</DialogueBox>
    </>
  );
}
