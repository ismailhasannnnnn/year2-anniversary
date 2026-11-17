import { dialogue } from '../content/adventure';
import { Arrow, LittleStar, Popcorn } from '../components/Illustrations';

export function MemoryReveal({ onCollect }: { onCollect: () => void }) {
  return (
    <section className="memory-reveal" aria-labelledby="reveal-title">
      <div className="keepsake-print">
        <span className="print-tape" />
        <div className="print-art"><LittleStar className="print-star" /><Popcorn /></div>
        <p className="handwritten">dad spilled it. everyone laughed. memory filed.</p>
      </div>
      <div className="reveal-copy">
        <span className="eyebrow">memory no. 01 · operation popcorn</span>
        <h1 id="reveal-title">{dialogue.reveal.title}</h1>
        <p>{dialogue.reveal.text}</p>
        <button className="button button-primary" onClick={onCollect}>put it in the box <Arrow /></button>
      </div>
    </section>
  );
}
