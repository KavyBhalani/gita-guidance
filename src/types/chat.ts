export interface Chat {
  id: string;
  question: string;
  answer: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timestamp: any;
  cachedDate?: string | null;
  isFavorite?: boolean;
  note?: string;
  shlokas?: string[];
}
