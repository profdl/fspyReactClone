import { StateCreator } from 'zustand';
import { StoreState } from '../types';

export interface ImageSlice {
  imageUrl: string | null;
  setImageUrl: (url: string) => void;
}

export const createImageSlice: StateCreator<StoreState, [], [], ImageSlice> = (set) => ({
  imageUrl: null,
  setImageUrl: (url) => set({ imageUrl: url }),
});