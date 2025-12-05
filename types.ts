export enum LayoutType {
  TITLE_ONLY = 'TITLE_ONLY',
  TITLE_BODY = 'TITLE_BODY',
  TWO_COLUMN = 'TWO_COLUMN',
  THREE_COLUMN = 'THREE_COLUMN',
  SPLIT_WITH_BOTTOM = 'SPLIT_WITH_BOTTOM',
  QUOTE_CENTER = 'QUOTE_CENTER',
  GRID_FOUR = 'GRID_FOUR'
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface CustomElement {
  id: string;
  type: 'text' | 'image';
  content: string; // HTML for text, Data URL for image
}

export interface SlideContent {
  id: number;
  title: string;
  subtitle?: string;
  body?: string;
  leftColumn?: string;
  middleColumn?: string;
  rightColumn?: string;
  bottomSection?: string;
  imageDesc?: string; // Description for the placeholder
  imageUrl?: string; // User uploaded image
  layout: LayoutType;
  notes?: string;
  elementPositions?: Record<string, Position>;
  elementSizes?: Record<string, Size>;
  customElements?: CustomElement[];
}