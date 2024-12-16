import { StateCreator } from 'zustand';
import { StoreState } from '../types';
import { CameraState } from '../../types';

export interface CameraSlice {
  camera: CameraState;
  updateCamera: (camera: Partial<CameraState>) => void;
}

export const createCameraSlice: StateCreator<StoreState, [], [], CameraSlice> = (set) => ({
  camera: {
    position: [0, 0, 5],
    rotation: [0, 0, 0],
    fov: 50,
  },
  updateCamera: (camera) =>
    set((state) => ({
      camera: { ...state.camera, ...camera },
    })),
});