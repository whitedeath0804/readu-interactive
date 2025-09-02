// Use require to avoid TS JSON module config needs
// eslint-disable-next-line @typescript-eslint/no-var-requires
const coursesJson = require('@/assets/data/courses.json');

export type Lesson = {
  id: string;
  title: string;
  stars: number; // 0..5
  status: 'locked' | 'unlocked' | 'current' | 'completed';
  color?: string; // optional bubble color
};

export type Module = {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  coverImage: string; // relative path
  backgroundImage?: string;
  progress?: number; // 0..1
  lessonsTotal?: number;
  trophy?: boolean;
  modules: Module[];
};

export type CoursesDb = {
  courses: Course[];
};

const db = coursesJson as unknown as CoursesDb;

export function listCourses(): Course[] {
  return db.courses;
}

export function getCourse(idOrSlug: string): Course | undefined {
  return db.courses.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
}

export function countLessons(course: Course): number {
  return course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
}

// Resolve local static cover for bundler (require needs static string)
export function getCourseCoverSource(course: Course) {
  switch (course.id) {
    case 'math-101':
      return require('@/assets/images/readu-test-card.jpg');
    default:
      return require('@/assets/images/readu-test-card.jpg');
  }
}
