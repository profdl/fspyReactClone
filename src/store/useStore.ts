import { create } from 'zustand';
import { createImageSlice } from './slices/imageSlice';
import { createAxisSlice } from './slices/axisSlice';
import { createCameraSlice } from './slices/cameraSlice';
import { StoreState } from './types';

export const useStore = create<StoreState>((...args) => ({
  ...createImageSlice(...args),
  ...createAxisSlice(...args),
  ...createCameraSlice(...args),
}));