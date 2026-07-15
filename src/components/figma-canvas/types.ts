export type CanvasItemType = "word" | "subheading" | "tab" | "switch";

export interface CanvasElement {
  id: string;
  type: CanvasItemType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation: number;
  content: string | string[] | Record<string, unknown>;
  label: string;
  depth: number; // For mouse parallax: Typography 0.03, Cards 0.05, Comments 0.08, Toolbar 0.1, Selection box 0.12
}

export interface Collaborator {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  selectedId: string | null;
}
