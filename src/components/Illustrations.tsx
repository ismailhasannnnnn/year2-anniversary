import type { CSSProperties } from 'react';
import { family } from '../content/family';

const popcornArt = new URL('../assets/popcorn.png', import.meta.url).href;
const memoryChestArt = new URL('../assets/memory-box.png', import.meta.url).href;

interface IllustrationProps {
  className?: string;
}

/** Neutral stand-in for foreground illustrations until the final artwork is ready. */
export function ArtPlaceholder({ className = '', label }: IllustrationProps & { label: string }) {
  return (
    <div className={`art-placeholder ${className}`} aria-hidden="true">
      <span className="art-placeholder-label">{label}</span>
      <span className="art-placeholder-note">art placeholder</span>
    </div>
  );
}

export function Tomi({ className = '' }: IllustrationProps) {
  const tomi = family.find((friend) => friend.id === 'tomi');
  if (!tomi?.artwork) return <ArtPlaceholder className={className} label="Tomi" />;
  const style = {
    '--friend-scale': tomi.scale,
    '--friend-offset-x': `${tomi.offsetX}%`,
    '--friend-offset-y': `${tomi.offsetY}%`,
  } as CSSProperties;
  return <img className={`family-artwork ${className}`} src={tomi.artwork} alt="" aria-hidden="true" style={style} />;
}

export function Popcorn({ className = '' }: IllustrationProps) {
  return <img className={`illustration-art ${className}`} src={popcornArt} alt="" aria-hidden="true" />;
}

export function MemoryChest({ className = '', filled = false }: IllustrationProps & { filled?: boolean }) {
  return <img className={`illustration-art ${className}`} src={memoryChestArt} alt="" aria-hidden="true" data-filled={filled || undefined} />;
}

export function Arrow({ className = '' }: IllustrationProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LittleStar({ className = '' }: IllustrationProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 2c0 10-4 14-14 14 10 0 14 4 14 14 0-10 4-14 14-14C20 16 16 12 16 2Z" fill="currentColor" />
    </svg>
  );
}
