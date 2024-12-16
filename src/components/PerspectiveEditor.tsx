import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { drawLine, drawEndpoint, isPointNearEndpoint } from '../utils/canvas';
import { Point2D, EditorState, AxisLine } from '../types';

export const PerspectiveEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageUrl = useStore((state) => state.imageUrl);
  const axisLines = useStore((state) => state.axisLines);
  const updateAxisLine = useStore((state) => state.updateAxisLine);
  const initializeAxisLines = useStore((state) => state.initializeAxisLines);

  const [editorState, setEditorState] = useState<EditorState>({
    selectedPoint: null,
    isDragging: false,
  });
  const [draggedEndpoint, setDraggedEndpoint] = useState<{
    line: AxisLine;
    isStart: boolean;
  } | null>(null);
  const [hoveredEndpoint, setHoveredEndpoint] = useState<{
    line: AxisLine;
    isStart: boolean;
  } | null>(null);

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>): Point2D => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas || !imageUrl) return;

    // Clear and draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.src = imageUrl;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Add semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw axis lines
    axisLines.forEach((line) => {
      drawLine(ctx, line.start, line.end, line.color);
      const isStartHovered = hoveredEndpoint?.line === line && hoveredEndpoint?.isStart;
      const isEndHovered = hoveredEndpoint?.line === line && !hoveredEndpoint?.isStart;
      drawEndpoint(ctx, line.start, line.color, isStartHovered);
      drawEndpoint(ctx, line.end, line.color, isEndHovered);
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (axisLines.length === 0) {
        initializeAxisLines(img.width, img.height);
      }
      redrawCanvas();
    };
  }, [imageUrl, axisLines, initializeAxisLines, hoveredEndpoint]);

  const getSelectedEndpoint = (point: Point2D) => {
    for (const line of axisLines) {
      if (isPointNearEndpoint(point, line.start)) {
        return { line, isStart: true };
      }
      if (isPointNearEndpoint(point, line.end)) {
        return { line, isStart: false };
      }
    }
    return null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(e);

    if (editorState.isDragging && draggedEndpoint) {
      updateAxisLine(draggedEndpoint.line.color, point, draggedEndpoint.isStart);
    } else {
      const hovered = getSelectedEndpoint(point);
      setHoveredEndpoint(hovered);
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.cursor = hovered ? 'grab' : 'default';
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(e);
    const selected = getSelectedEndpoint(point);

    if (selected) {
      setEditorState({
        selectedPoint: point,
        isDragging: true,
      });
      setDraggedEndpoint(selected);
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.cursor = 'grabbing';
      }
    }
  };

  const handleMouseUp = () => {
    setEditorState({
      selectedPoint: null,
      isDragging: false,
    });
    setDraggedEndpoint(null);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = hoveredEndpoint ? 'grab' : 'default';
    }
  };

  if (!imageUrl) return null;

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="max-w-full h-auto border border-gray-300 rounded-lg"
      />
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>X Axis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Y Axis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Z Axis</span>
          </div>
        </div>
      </div>
    </div>
  );
};