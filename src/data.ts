import { colors } from './theme';
import type { IconName } from './components/Icon';

export type Slice = { id: string; label: string; value: number; color: string };

/** Peak Focus Times — three concentric gauges. */
export const peakFocus: Array<{
  id: string;
  range: string;
  value: number;
  color: string;
  note: string;
}> = [
  { id: 'am', range: '9:00 - 11:30 AM', value: 92, color: colors.rose, note: 'Deep work, zero meetings' },
  { id: 'pm', range: '2:00 - 4:30 PM', value: 87, color: colors.sky, note: 'Collaboration and review' },
  { id: 'eve', range: '7:00 - 8:00 PM', value: 92, color: colors.amber, note: 'Planning and wrap-up' },
];

/** Project Focus Distribution — donut. */
export const distribution: Slice[] = [
  { id: 'ds', label: 'Design System', value: 35, color: colors.rose },
  { id: 'q4', label: 'Q4 Planning', value: 25, color: colors.sky },
  { id: 'ur', label: 'User Research', value: 18, color: colors.amber },
  { id: 'tm', label: 'Team Management', value: 12, color: colors.lime },
  { id: 'ot', label: 'Other', value: 10, color: colors.purple },
];

export const channels: Array<{
  id: string;
  name: string;
  detail: string;
  icon: IconName;
  tint: [string, string];
}> = [
  { id: 'email', name: 'Email', detail: 'Batch Check at 9AM, 1PM, 3PM', icon: 'mail', tint: ['#8E9AA6', '#3D4650'] },
  { id: 'slack', name: 'Slack', detail: 'Frequent during collaboration hours', icon: 'slack', tint: ['#C9A28B', '#4A3B44'] },
  { id: 'meet', name: 'Meetings', detail: 'Prefer mornings, avoid 2-4PM blocks', icon: 'calendar', tint: ['#9FC6E8', '#3B4C5E'] },
];

export const insights = [
  "You're 40% more productive in morning focus blocks",
  'Design work flows better when batched',
  'Interruptions peak between 11am-12pm',
];

export const optimizations = [
  'Move status syncs into the 2-4PM low-focus window',
  'Batch Slack replies into two 15 minute passes',
  'Protect 9-11:30AM as a no-meeting block',
];

export type Commitment = {
  id: string;
  title: string;
  meta: string;
  done: boolean;
};

export type Lane = {
  id: string;
  label: string;
  color: string;
  items: Commitment[];
};

export const lanes: Lane[] = [
  {
    id: 'overdue',
    label: 'Overdue',
    color: colors.rose,
    items: [
      { id: 'o1', title: 'Send Wireframes to Sarah', meta: '2 days overdue', done: false },
      { id: 'o2', title: 'Review pricing page copy', meta: '1 day overdue', done: false },
      { id: 'o3', title: 'Close out research synthesis', meta: '3 days overdue', done: false },
    ],
  },
  {
    id: 'today',
    label: 'Due Today',
    color: colors.amber,
    items: [
      { id: 't1', title: 'API documentation for Michael', meta: '80% complete', done: false },
      { id: 't2', title: 'Design system audit pass', meta: 'Due 5:00 PM', done: false },
      { id: 't3', title: 'Reply to onboarding thread', meta: '2 messages waiting', done: false },
    ],
  },
  {
    id: 'upcoming',
    label: 'Upcoming',
    color: colors.lime,
    items: [
      { id: 'u1', title: 'Q4 budget draft for Leadership', meta: 'Estimate: 6hr', done: false },
      { id: 'u2', title: 'Prep usability session script', meta: 'Thursday', done: false },
      { id: 'u3', title: 'Component library release notes', meta: 'Next Monday', done: false },
    ],
  },
];

export const menus = ['Finder', 'File', 'Edit', 'View', 'Go', 'Window', 'Help'];

/** Dock apps — stylized to read like the macOS dock in the frame. */
export const dockApps: Array<{
  id: string;
  name: string;
  colors: [string, string];
  icon: IconName;
  running?: boolean;
}> = [
  { id: 'finder', name: 'Finder', colors: ['#3FB8FF', '#1075E8'], icon: 'smile', running: true },
  { id: 'launchpad', name: 'Launchpad', colors: ['#6E7A88', '#3A424C'], icon: 'grid' },
  { id: 'safari', name: 'Safari', colors: ['#EAF3FB', '#1E8FE1'], icon: 'compass' },
  { id: 'messages', name: 'Messages', colors: ['#5CE865', '#17B32C'], icon: 'chat' },
  { id: 'mail', name: 'Mail', colors: ['#4FB6FF', '#1268E0'], icon: 'mail' },
  { id: 'maps', name: 'Maps', colors: ['#8FE39A', '#2F9E6E'], icon: 'pin' },
  { id: 'photos', name: 'Photos', colors: ['#FFD36E', '#F0546A'], icon: 'flower' },
  { id: 'facetime', name: 'FaceTime', colors: ['#57E86B', '#12A62B'], icon: 'video' },
  { id: 'calendar', name: 'Calendar', colors: ['#FFFFFF', '#E9EBEF'], icon: 'calendar' },
  { id: 'contacts', name: 'Contacts', colors: ['#C89B6A', '#7A5334'], icon: 'user' },
  { id: 'reminders', name: 'Reminders', colors: ['#FFFFFF', '#E6E8EC'], icon: 'list' },
  { id: 'notes', name: 'Notes', colors: ['#FFE083', '#F2C33C'], icon: 'note' },
  { id: 'music', name: 'Music', colors: ['#FF6B7E', '#E01E3C'], icon: 'music' },
  { id: 'tv', name: 'TV', colors: ['#2B2B2E', '#0B0B0D'], icon: 'tv' },
  { id: 'podcasts', name: 'Podcasts', colors: ['#D07BF5', '#8B2FD1'], icon: 'podcast' },
  { id: 'news', name: 'News', colors: ['#FFFFFF', '#EFEFF2'], icon: 'news' },
  { id: 'settings', name: 'System Settings', colors: ['#8A939D', '#4A5058'], icon: 'gear' },
  { id: 'sentient', name: 'Sentient', colors: ['#7FC4FF', '#1E7BE0'], icon: 'orb', running: true },
];

export const seedChat: Array<{ id: string; from: 'me' | 'ai'; text: string }> = [
  { id: 'm1', from: 'ai', text: 'Morning. I mapped yesterday against your last four weeks — your 9:00-11:30 block held at 92% focus again.' },
  { id: 'm2', from: 'me', text: 'What is eating the afternoon?' },
  {
    id: 'm3',
    from: 'ai',
    text: 'Three status syncs landed inside 2-4PM. That window is already your weakest, so the cost compounds. Want me to propose a new slot?',
  },
];

export const chatSuggestions = [
  'Where did my focus go today?',
  'Reschedule my 2PM syncs',
  'Summarise this week',
];
