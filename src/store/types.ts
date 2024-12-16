import { AxisSlice } from './slices/axisSlice';
import { CameraSlice } from './slices/cameraSlice';
import { ImageSlice } from './slices/imageSlice';

export type StoreState = ImageSlice & AxisSlice & CameraSlice;