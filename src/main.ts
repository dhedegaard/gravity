import { Planet } from "./planet";
import { Point } from "./utils";

let planets: Array<Planet> = [
    new Planet(
        "Sun",
        1.989 * 10 ** 30,
        new Point(0, 0),
        "yellow",
    ),
    new Planet(
        "Earth",
        5.972 * 10 ** 24,
        new Point(149.6 * 10 ** 9, 0),
        "green",
        new Point(0, 30.000 * 9 * 10 ** -2),
    ),
];

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

function main() {
    // Clear the canvas.
    context.fillStyle = 'white';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    // Draw the planets.
    drawPlanets();
    // Calculate and apply forces.
    applyForces();
    // Do it again :)
    setTimeout(function () {
        main();
    }, 1);
}

function drawPlanets() {
    /* Draw each planet. */
    planets.forEach((planet) => {
        planet.draw(context);
    });
}

function applyForces() {
    planets.forEach((planet) => {
        planets.forEach((otherPlanet) => {
            if (planet != otherPlanet) {
                planet.applyForce(otherPlanet);
            }
        });
    });
}

/* Handle setting the context variable to something reasonable. */
document.addEventListener('DOMContentLoaded', () => {
    let container = document.getElementById("container") as HTMLDivElement;

    // Create the canvas element and set width/height.
    canvas = document.createElement("canvas") as HTMLCanvasElement;
    let width = Math.min(container.clientWidth, window.innerHeight);
    canvas.width = width - 10;
    canvas.height = width - 10;
    canvas.style.border = "1px solid black";

    // Add the canvas and fetch the context.
    container.appendChild(canvas);
    context = canvas.getContext('2d');

    main();
});