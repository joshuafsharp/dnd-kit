import {Collision} from '../types';

/**
 * Sort collisions from smallest to greatest value
 */
export function sortCollisionsAsc(
  {value: a}: Collision,
  {value: b}: Collision
) {
  return a - b;
}

/**
 * Sort collisions from greatest to smallest value
 */
export function sortCollisionsDesc(
  {value: a}: Collision,
  {value: b}: Collision
) {
  return b - a;
}
