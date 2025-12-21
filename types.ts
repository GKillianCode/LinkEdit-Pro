export interface TextStyle {
  id: string;
  label: string;
  category: 'basic' | 'serif' | 'script' | 'fancy' | 'decoration';
  transform: (text: string) => string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

export type ViewMode = 'generator' | 'editor';