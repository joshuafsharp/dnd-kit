export interface Coordinates {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Vector extends Coordinates, Dimensions {}

export interface PositioningCoordinates {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface BoundingRectangle extends Dimensions, PositioningCoordinates {}
