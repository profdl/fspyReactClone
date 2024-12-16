import { StateCreator } from 'zustand';
import { StoreState } from '../types';
import { AxisLine, Point2D } from '../../types';

export interface AxisSlice {
  axisLines: AxisLine[];
  updateAxisLine: (color: AxisLine['color'], point: Point2D, isStart: boolean) => void;
  initializeAxisLines: (width: number, height: number) => void;
}

export const createAxisSlice: StateCreator<StoreState, [], [], AxisSlice> = (set) => ({
  axisLines: [],
  updateAxisLine: (color, point, isStart) =>
    set((state) => ({
      axisLines: state.axisLines.map((line) =>
        line.color === color
          ? { ...line, [isStart ? 'start' : 'end']: point }
          : line
      ),
    })),
  initializeAxisLines: (width, height) =>
    set({
      axisLines: [
        {
          color: 'red',
          start: { x: width * 0.3, y: height * 0.5 },
          end: { x: width * 0.7, y: height * 0.5 },
        },
        {
          color: 'green',
          start: { x: width * 0.5, y: height * 0.3 },
          end: { x: width * 0.5, y: height * 0.7 },
        },
        {
          color: 'blue',
          start: { x: width * 0.4, y: height * 0.4 },
          end: { x: width * 0.6, y: height * 0.6 },
        },
      ],
    }),
});