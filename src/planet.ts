import { Point } from "./utils";
import {
    MASS_FACTOR,
    DISTANCE_FACTOR,
    GRAVITATIONAL_CONST,
} from "./constants";

export class Planet {
    readonly name: string;
    readonly mass: number;
    readonly color: string;
    location: Point;
    acc_vector: Point;

    /**
     * Creates a new planet with some given data.
     * @param name The name of the planet
     * @param mass The mass of the planet
     * @param location The current location of the planet
     * @param color An optional color used for rendering the planet
     */
    constructor(name: string, mass: number, location: Point, color?: string, acc_vector?: Point) {
        this.name = name;
        this.mass = mass;
        this.location = location;
        this.acc_vector = acc_vector || new Point(0, 0);
        this.color = color || "green";
    }

    /**
     * Applies the force from a given planet against this one.
     * Changing this planets direction and speed accordingly.
     * @param planet The planet to apply the force from.
     */
    applyForce(planet: Planet) {
        // Calculate the vector from this -> planet.
        let delta_x = planet.location.x - this.location.x;
        let delta_y = planet.location.y - this.location.y;

        // Determine the current distance between the planets.
        // Pythagoras.
        let distance = Math.sqrt(
            Math.abs(delta_x) ** 2 +
            Math.abs(delta_y) ** 2);

        // Calculate the force between the planets.
        // Newton's law of univeral gravitation
        let force = (
            GRAVITATIONAL_CONST *
            (this.mass * planet.mass) / distance ** 2);

        // Calculate the acceleration to apply based on the force and the mass.
        // Newton's second law.
        let acceleration = force / this.mass * 2 * 10 ** 1;

        // Calculate and applythe new acceleration vector to apply based on the
        // difference between the newly calculated acceleration and the
        // currenct vector between this and planet.
        this.acc_vector.x += acceleration / distance * delta_x;
        this.acc_vector.y += acceleration / distance * delta_y;

        // TODO: Apply non-uniform acceleration.
        // For now i use a dummyimplementation for simply doing something.
        let acc_vector_multiplier = 6 * 10 ** 1;
        acc_vector_multiplier=10**1;
        this.location.x += this.acc_vector.x * acc_vector_multiplier;
        this.location.y += this.acc_vector.y * acc_vector_multiplier;
    }

    /**
     * Handles drawing the current planet on the canvas context supplied.
     * @param context A canvas context that allows drawing.
     */
    draw(context: CanvasRenderingContext2D) {
        let middle_x = context.canvas.width / 2;
        let middle_y = context.canvas.height / 2;

        let planet_middle_x = middle_x + this.location.x * DISTANCE_FACTOR;
        let planet_middle_y = middle_y + this.location.y * DISTANCE_FACTOR;
        let planet_radius_px = Math.log(this.mass) * Math.LOG10E * MASS_FACTOR;

        // Draw the planet.
        context.beginPath();
        context.arc(
            planet_middle_x,
            planet_middle_y,
            planet_radius_px,
            0,
            2 * Math.PI,
            false
        );
        context.closePath();
        context.fillStyle = this.color || 'white';
        context.fill();
        context.lineWidth = 3;
        context.strokeStyle = "black";
        context.stroke();

        // Draw the planet name.
        context.font = "18px Arial";
        context.fillStyle = 'black';
        context.fillText(
            this.name,
            planet_middle_x - planet_radius_px * 1.3,
            planet_middle_y + planet_radius_px * 2.5,
        );
    }
}