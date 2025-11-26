export const OnboardingPalette = {
  background: '#050505',
  surface: '#111111',
  card: '#181818',
  elevated: '#1F1F1F',
  accent: '#D7FF5F',
  accentMuted: '#9CC04A',
  textPrimary: '#F5F5F5',
  textSecondary: '#B4B6B9',
  outline: '#2A2A2A',
  muted: '#5E5E5E',
};

export type ClassOption = {
  id: string;
  label: string;
  subtitle: string;
};

export const classOptions: ClassOption[] = [
  { id: '5', label: 'Class 5', subtitle: 'Build strong basics' },
  { id: '6', label: 'Class 6', subtitle: 'Discover new topics' },
  { id: '7', label: 'Class 7', subtitle: 'Strengthen core skills' },
  { id: '8', label: 'Class 8', subtitle: 'Dive into projects' },
  { id: '9', label: 'Class 9', subtitle: 'Prepare for boards' },
  { id: '10', label: 'Class 10', subtitle: 'Master fundamentals' },
  { id: '11', label: 'Class 11', subtitle: 'Specialise for streams' },
  { id: '12', label: 'Class 12', subtitle: 'Get exam ready' },
];

export type SubjectOption = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export const subjectOptions: SubjectOption[] = [
  { id: 'mathematics', title: 'Mathematics', description: 'Problem solving & logic', icon: 'calculator-outline' },
  { id: 'physics', title: 'Physics', description: 'Mechanics to modern tech', icon: 'planet-outline' },
  { id: 'chemistry', title: 'Chemistry', description: 'Atoms to reactions', icon: 'flask-outline' },
  { id: 'biology', title: 'Biology', description: 'Life sciences & health', icon: 'leaf-outline' },
  { id: 'english', title: 'English', description: 'Communication mastery', icon: 'book-outline' },
  { id: 'history', title: 'History', description: 'Civilisations & events', icon: 'time-outline' },
];

export type DownloadStatus = 'done' | 'downloading' | 'queued';

export type DownloadItem = {
  id: string;
  title: string;
  size: string;
  status: DownloadStatus;
  progress: number;
  icon: string;
};

export const downloadQueue: DownloadItem[] = [
  {
    id: 'neural',
    title: 'Neural Networks',
    size: '120 MB',
    status: 'done',
    progress: 1,
    icon: 'scan-circle-outline',
  },
  {
    id: 'data-science',
    title: 'Data Science Fundamentals',
    size: '95 MB',
    status: 'done',
    progress: 1,
    icon: 'analytics-outline',
  },
  {
    id: 'python-ai',
    title: 'Python for AI',
    size: '210 MB',
    status: 'downloading',
    progress: 0.55,
    icon: 'code-slash-outline',
  },
  {
    id: 'algorithms',
    title: 'Advanced Algorithms',
    size: '150 MB',
    status: 'queued',
    progress: 0,
    icon: 'git-network-outline',
  },
  {
    id: 'robotics',
    title: 'Robotics Basics',
    size: '85 MB',
    status: 'queued',
    progress: 0,
    icon: 'hardware-chip-outline',
  },
];
