import type { CSSProperties } from 'react';
import { family, portraitRows, type Friend } from '../content/family';
import { ArtPlaceholder } from './Illustrations';

export function FriendDrawing({ friend, className = '' }: { friend: Friend; className?: string }) {
  const style = {
    '--friend-scale': friend.scale,
    '--friend-offset-x': `${friend.offsetX}%`,
    '--friend-offset-y': `${friend.offsetY}%`,
  } as CSSProperties;
  if (friend.artwork) return <img src={friend.artwork} alt="" className={`friend-drawing ${className}`} style={style} />;
  return <ArtPlaceholder className={`friend-drawing ${className}`} label={friend.name} />;
}

interface FamilyPortraitProps {
  present?: string[];
  onPlaceBongo?: () => void;
}

export function FamilyPortrait({ present = family.map((friend) => friend.id), onPlaceBongo }: FamilyPortraitProps) {
  const extra = family.filter((friend) => !portraitRows.flat().includes(friend.id)).map((friend) => friend.id);
  const rows = portraitRows.map((row, index) => index === portraitRows.length - 1 ? [...row, ...extra] : row);

  return (
    <div className="family-portrait" aria-label="Our stuffed-animal family">
      {rows.map((row, index) => (
        <div className="portrait-row" key={index}>
          {row.map((id) => {
            const friend = family.find((entry) => entry.id === id);
            if (!friend) return null;
            const isPresent = present.includes(id);
            const content = <><FriendDrawing friend={friend} /><span>{friend.name}</span></>;
            const className = `portrait-friend ${isPresent ? 'friend-present' : 'friend-missing'}`;
            if (id === 'bongo' && onPlaceBongo) {
              return <button key={id} className={className} onClick={onPlaceBongo} aria-label="Guide Bongo to his portrait spot">{content}</button>;
            }
            return <div key={id} className={className}>{content}</div>;
          })}
        </div>
      ))}
    </div>
  );
}
