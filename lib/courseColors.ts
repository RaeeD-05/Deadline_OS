export interface CourseTheme {
  primary: string;
  gradient: string;
  bannerBg: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  borderAccent: string;
  dotColor: string;
}

const GOOGLE_CLASSROOM_THEMES: CourseTheme[] = [
  {
    // Vibrant Google Classroom Green
    primary: '#137333',
    gradient: 'from-emerald-600 via-emerald-500 to-teal-500',
    bannerBg: 'bg-emerald-600',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    borderAccent: 'border-l-emerald-500',
    dotColor: 'bg-emerald-500',
  },
  {
    // Vibrant Google Classroom Blue
    primary: '#1a73e8',
    gradient: 'from-blue-600 via-indigo-600 to-blue-500',
    bannerBg: 'bg-blue-600',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-800',
    badgeBorder: 'border-blue-200',
    borderAccent: 'border-l-blue-500',
    dotColor: 'bg-blue-500',
  },
  {
    // Vibrant Google Classroom Orange / Amber
    primary: '#ea8600',
    gradient: 'from-amber-500 via-orange-500 to-amber-600',
    bannerBg: 'bg-amber-600',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    borderAccent: 'border-l-amber-500',
    dotColor: 'bg-amber-500',
  },
  {
    // Vibrant Google Classroom Purple / Violet
    primary: '#9334e6',
    gradient: 'from-purple-600 via-violet-600 to-fuchsia-600',
    bannerBg: 'bg-purple-600',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-800',
    badgeBorder: 'border-purple-200',
    borderAccent: 'border-l-purple-500',
    dotColor: 'bg-purple-500',
  },
  {
    // Vibrant Google Classroom Coral / Red
    primary: '#d93025',
    gradient: 'from-rose-500 via-red-500 to-pink-600',
    bannerBg: 'bg-rose-600',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-800',
    badgeBorder: 'border-rose-200',
    borderAccent: 'border-l-rose-500',
    dotColor: 'bg-rose-500',
  },
  {
    // Vibrant Google Classroom Teal / Cyan
    primary: '#007b83',
    gradient: 'from-teal-600 via-cyan-600 to-teal-500',
    bannerBg: 'bg-teal-600',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-800',
    badgeBorder: 'border-teal-200',
    borderAccent: 'border-l-teal-500',
    dotColor: 'bg-teal-500',
  },
];

export function getCourseTheme(courseName: string): CourseTheme {
  if (!courseName) return GOOGLE_CLASSROOM_THEMES[0];

  let hash = 0;
  for (let i = 0; i < courseName.length; i++) {
    hash = (hash << 5) - hash + courseName.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % GOOGLE_CLASSROOM_THEMES.length;
  return GOOGLE_CLASSROOM_THEMES[index];
}
