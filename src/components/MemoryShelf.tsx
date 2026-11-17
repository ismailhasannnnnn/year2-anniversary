import { memories, type MemoryId } from '../content/adventure';
import { Popcorn } from './Illustrations';

export function MemoryShelf({ collected }: { collected: MemoryId[] }) {
  return (
    <section className="memory-shelf" aria-label="Mom and Dad's memories">
      <div className="shelf-heading">
        <span className="eyebrow">mom and dad's memory box</span>
        <span aria-live="polite">{collected.length} of 3 memories</span>
      </div>
      <ol className="memory-list">
        {memories.map((memory) => {
          const isCollected = collected.includes(memory.id);
          return (
            <li key={memory.id} className={isCollected ? 'memory-item is-collected' : 'memory-item'}>
              <div className="memory-symbol" aria-hidden="true">
                {isCollected ? (
                  <span className="keepsake-arrival">
                    {memory.id === 'popcorn' ? <Popcorn /> : memory.id === 'portrait' ? <span className="mini-portrait">♡</span> : <span className="mini-ticket">Ⅱ</span>}
                  </span>
                ) : <span>{memory.number}</span>}
              </div>
              <div>
                <p className="memory-title">{memory.title}</p>
                <span className="memory-caption">{isCollected ? 'filed by tomi' : 'not found yet'}</span>
              </div>
              {isCollected && <span className="collected-check" aria-label="Collected">✓</span>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
