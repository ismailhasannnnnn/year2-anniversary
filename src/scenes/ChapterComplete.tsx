import { DialogueBox } from '../components/DialogueBox';
import { MemoryChest, LittleStar } from '../components/Illustrations';

export function ChapterComplete({ onReplay }: { onReplay: () => void }) {
  return (
    <>
      <section className="chapter-complete">
        <span className="eyebrow">mission complete · three memories filed</span>
        <h1>i finished<br /><em>the job.</em></h1>
        <div className="complete-art"><MemoryChest filled /><LittleStar /></div>
        <p>mom, all three memories are safely in the box. i did a very good job.</p>
        <p className="letter-instruction">dad left you one more thing in your card.<br /><strong>you should read it, mom.</strong></p>
        <button className="text-button" onClick={onReplay}>Back to the beginning ↗</button>
      </section>
      <DialogueBox>everything is here. i believe i have done a good job. can i please be leader now?</DialogueBox>
    </>
  );
}
