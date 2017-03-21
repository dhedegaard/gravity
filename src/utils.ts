/**
 * Repressents some point as (x, y).
 */
export class Point {
    x: number;
    y: number;

    /**
     * Creates a new Point
     * @param x The first axis of the coordinate.
     * @param y The second axis of the coordinate.
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}