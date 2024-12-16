export interface Point2D {
  x: number;
  y: number;
}

export interface AxisLine {
  color: 'red' | 'green' | 'blue';
  start: Point2D;
  end: Point2D;
}

export interface EditorState {
  selectedPoint: Point2D | null;
  isDragging: boolean;
}

export interface CameraState {
  position: [number, number, number];
  rotation: [number, number, number];
  fov: number;
}