import type { ReactNode } from 'react';
import { Tomi } from './Illustrations';

interface DialogueBoxProps {
  children: ReactNode;
  aside?: ReactNode;
}

export function DialogueBox({ children, aside }: DialogueBoxProps) {
  return (
    <div className="dialogue-box">
      <div className="dialogue-avatar"><Tomi /></div>
      <div className="dialogue-copy" aria-live="polite" aria-atomic="true">
        <span className="eyebrow">Tomi <span className="speaker-role">/ acting team leader</span></span>
        <p>{children}</p>
      </div>
      {aside && <div className="dialogue-aside">{aside}</div>}
    </div>
  );
}
