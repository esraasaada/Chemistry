import type { Question } from './tutorScience';
export interface Preferences {
  started: boolean;
  useName: boolean;
  voice: boolean;
  effects: boolean;
  avatar: boolean;
  rate: number;
  language: 'ar' | 'en';
}
export const defaults: Preferences = {started:false,useName:true,voice:true,effects:true,avatar:true,rate:1,language:'ar'};
export type Progress = Record<string, { correct: boolean; misses: number }>;
const settingsKey = 'chemistry-tutor-settings-v1';
const progressKey = 'chemistry-tutor-progress-v1';
function read<T extends object>(key: string, fallback: T): T {
  try { return { ...fallback, ...JSON.parse(localStorage.getItem(key) || 'null') }; }
  catch { return fallback; }
}
function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* session remains usable */ }
}
export const readPreferences = () => read(settingsKey, defaults);
export const savePreferences = (p: Preferences) => write(settingsKey, p);
export const readProgress = () => read<Progress>(progressKey, {});
export const saveProgress = (p: Progress) => write(progressKey, p);
export function record(progress: Progress, q: Question, correct: boolean, misses: number): Progress {
  const previous = progress[q.id];
  return { ...progress, [q.id]: {correct: Boolean(previous?.correct || correct), misses: (previous?.misses || 0) + misses} };
}
