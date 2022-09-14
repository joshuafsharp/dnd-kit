import type {BoundingRectangle, Coordinates} from '@dnd-kit/types';

/**
 * Check if a given point is contained within a bounding rectangle
 */
function isPointWithinRect(
  point: Coordinates,
  rect: BoundingRectangle
): boolean {
  const {top, left, bottom, right} = rect;

  return (
    top <= point.y && point.y <= bottom && left <= point.x && point.x <= right
  );
}
