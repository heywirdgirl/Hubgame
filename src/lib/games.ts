export interface Game {
  slug: string;
  title: string;
  thumbnail: string;
  description: string;
}

export const games: Game[] = [
  {
    slug: 'puzzle-01',
    title: 'Puzzle Quest',
    thumbnail: 'https://picsum.photos/seed/puzzle/800/450',
    description: 'A classic puzzle game to test your logic and strategy skills. Solve intricate puzzles, unlock new levels, and challenge your brain in this immersive experience.',
  },
  {
    slug: 'logic-02',
    title: 'Logic Master',
    thumbnail: 'https://picsum.photos/seed/logic/800/450',
    description: 'Master the art of logic with this challenging brain teaser. Perfect for players who love to think outside the box and solve complex problems.',
  },
  {
    slug: 'speed-03',
    title: 'Speed Runner',
    thumbnail: 'https://picsum.photos/seed/speed/800/450',
    description: 'Test your reflexes and speed in this fast-paced action game. Dodge obstacles, collect power-ups, and race against the clock to achieve the highest score.',
  },
];

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}
