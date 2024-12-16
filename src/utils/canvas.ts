import { Point2D } from '../types';

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  start: Point2D,
  end: Point2D,
  color: string,
  lineWidth = 5 // Increased from 3
) => {
  // Draw shadow for depth effect
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = lineWidth + 4; // Increased shadow width
  ctx.stroke();

  // Draw main line
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  // Draw dashed helper line
  ctx.beginPath();
  ctx.setLineDash([8, 8]); // Increased dash size
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2; // Slightly thicker dashed line
  ctx.stroke();
  ctx.setLineDash([]);
};

export const drawEndpoint = (
  ctx: CanvasRenderingContext2D,
  point: Point2D,
  color: string,
  isHovered = false
) => {
  const radius = isHovered ? 12 : 10; // Increased from 8/6

  // Draw outer glow
  const gradient = ctx.createRadialGradient(
    point.x, point.y, radius - 3,
    point.x, point.y, radius + 4
  );
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius + 4, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw main circle
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  // Draw white border
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3; // Thicker border
  ctx.stroke();

  // Draw inner highlight
  ctx.beginPath();
  ctx.arc(point.x - radius/3, point.y - radius/3, radius/2.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fill();
};

export const isPointNearEndpoint = (
  point: Point2D,
  endpoint: Point2D,
  threshold = 15 // Increased from 12 to match larger endpoints
): boolean => {
  const dx = point.x - endpoint.x;
  const dy = point.y - endpoint.y;
  return Math.sqrt(dx * dx + dy * dy) <= threshold;
};