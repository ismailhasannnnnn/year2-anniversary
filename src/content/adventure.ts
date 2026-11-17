/** Tomi's very serious account of the family memories. */
export const dialogue = {
  opening: {
    speaker: 'Tomi',
    text: "hello mom. dad wants me to help you go through this anniversary gift. so i'm here now.",
  },
  circus: {
    discover: 'first, we need popcorn. this bag is very large. i approve.',
    spilled: 'dad spilled the popcorn. i have identified this as a leadership opportunity. mom, please find the worker while i supervise.',
    refilled: 'the worker filled the popcorn again for free. my plan worked. we are back on schedule.',
    seat: 'good seat. not useful for the popcorn problem. moving on.',
    stand: 'there is more popcorn at the stand. mom, we should ask that worker for help.',
  },
  reveal: {
    title: 'the popcorn incident',
    text: 'dad spilled the popcorn everywhere. a worker helped us fill the bag again, and you and dad laughed a lot. i have decided this still counts as a successful outing.',
  },
} as const;

export const memories = [
  { id: 'popcorn', number: '01', title: 'the popcorn incident', object: 'a bag of popcorn' },
  { id: 'portrait', number: '02', title: 'the team photo', object: 'a family portrait' },
  { id: 'ticket', number: '03', title: "dad's story", object: 'a concert ticket' },
] as const;

export type MemoryId = (typeof memories)[number]['id'];
