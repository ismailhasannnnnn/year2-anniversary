export const driveQuestions = [
  {
    prompt: 'what season was it, mom?',
    hint: 'dad told me the trees were orange, red, and gold. new hampshire was almost at its brightest.',
    options: [{ id: 'spring', label: 'spring', drawing: 'flower' }, { id: 'fall', label: 'fall', drawing: 'leaf' }, { id: 'winter', label: 'winter', drawing: 'snow' }],
  },
  {
    prompt: 'where were you and dad headed?',
    hint: 'dad said it was a winding road into the white mountains.',
    options: [{ id: 'coast', label: 'the coast', drawing: 'wave' }, { id: 'city', label: 'the city', drawing: 'city' }, { id: 'white-mountains', label: 'white mountains', drawing: 'mountain' }],
  },
  {
    prompt: 'which date was it?',
    hint: 'dad told me it was right at the beginning. your second date.',
    options: [{ id: 'first', label: 'your first', drawing: '1' }, { id: 'second', label: 'your second', drawing: '2' }, { id: 'third', label: 'your third', drawing: '3' }],
  },
] as const;

// Tomi is repeating the story Dad told her.
export const concertPassages = [
  { title: 'dad told me about the song', text: 'at your favorite concert this year, you asked dad if he remembered when you first played that song for him. he did.' },
  { title: 'dad remembered', text: 'dad said it was your second date. you drove to the white mountains, with new hampshire’s fall colors almost at their peak.' },
  { title: 'you almost cried', text: 'dad told me you were so happy he remembered that you almost cried. he said seeing you so happy made him happy too.' },
];
