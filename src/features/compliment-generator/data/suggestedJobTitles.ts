/**
 * A pool of job titles used to populate the 3 random suggestion pills shown
 * in "Job Title" mode. Kept intentionally varied — a mix of everyday,
 * niche, and playful titles — so the pills feel fresh across visits.
 */
export const SUGGESTED_JOB_TITLES: readonly string[] = [
  'Barista',
  'Kindergarten teacher',
  'Software engineer',
  'Nurse',
  'Air traffic controller',
  'Librarian',
  'Long-haul truck driver',
  'Line cook',
  'Dentist',
  'Wedding photographer',
  'Firefighter',
  'Accountant',
  'Zookeeper',
  'Middle school principal',
  'Freelance illustrator',
  'Customer support agent',
  'Electrician',
  'Park ranger',
  'Data analyst',
  'Pastry chef',
  'Paralegal',
  'UX designer',
  'Warehouse supervisor',
  'Veterinarian',
  'Flight attendant',
  'IT help desk technician',
  'Social worker',
  'Construction foreman',
  'Podcast producer',
  'Physical therapist',
];

/** Returns `count` random, unique job titles from the pool. */
export function getRandomJobTitles(count = 3): string[] {
  const pool = [...SUGGESTED_JOB_TITLES];
  const picked: string[] = [];

  while (picked.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }

  return picked;
}
