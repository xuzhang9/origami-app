export interface Step {
  stepNumber: number;
  instruction: string;
  imageUrl: string;
}

export interface Origami {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'animals' | 'toys' | 'flowers' | 'decorations' | 'other';
  steps: Step[];
  sourceUrl?: string;
  thumbnailUrl?: string;
  isFavorite?: boolean;
  isCompleted?: boolean;
}

export interface Device {
  id: number;
  deviceToken: string;
  deviceName?: string;
  createdAt: Date;
  lastUsed: Date;
}

export interface SearchResult {
  success: boolean;
  origami?: Origami;
  error?: string;
  cached?: boolean;
}

export interface Settings {
  openaiApiKey?: string;
  deviceToken?: string;
  deviceName?: string;
}
