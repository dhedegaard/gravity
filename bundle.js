(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 * An estimation of the gravitational constant
 */
exports.GRAVITATIONAL_CONST = 6.67408 * Math.pow(10, -11);
/**
 * Scales all rendering of mass from planets according to this factor.
 */
exports.MASS_FACTOR = 0.5;
/**
 * Scales all distances by this factor.
 */
exports.DISTANCE_FACTOR = 1 * Math.pow(10, -9);

},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var planet_1 = require("./planet");
var utils_1 = require("./utils");
var planets = [
    new planet_1.Planet("Sun", 1.989 * Math.pow(10, 30), new utils_1.Point(0, 0), "yellow"),
    new planet_1.Planet("Earth", 5.972 * Math.pow(10, 24), new utils_1.Point(149.6 * Math.pow(10, 9), 0), "green", new utils_1.Point(0, 30000)),
];
var canvas;
var context;
function main() {
    var running = false;
    setInterval(function () {
        if (running) {
            return;
        }
        running = true;
        // Clear the canvas.
        context.fillStyle = 'white';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        // Calculate and apply forces.
        for (var i = 0; i < 50; i++) {
            applyForces();
        }
        // Draw the planets.
        drawPlanets();
        // Do it again :)
        running = false;
    }, 13);
}
function drawPlanets() {
    /* Draw each planet. */
    planets.forEach(function (planet) {
        planet.draw(context);
    });
}
function applyForces() {
    planets.forEach(function (planet, idx) {
        planets.forEach(function (otherPlanet, otherIdx) {
            if (idx !== otherIdx) {
                planet.applyForce(otherPlanet);
            }
        });
    });
}
/* Handle setting the context variable to something reasonable. */
document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById("container");
    // Create the canvas element and set width/height.
    canvas = document.createElement("canvas");
    var width = Math.min(container.clientWidth, window.innerHeight);
    canvas.width = width - 10;
    canvas.height = width - 10;
    canvas.style.border = "1px solid black";
    // Add the canvas and fetch the context.
    container.appendChild(canvas);
    context = canvas.getContext('2d');
    main();
});

},{"./planet":3,"./utils":4}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var utils_1 = require("./utils");
var constants_1 = require("./constants");
var Planet = (function () {
    /**
     * Creates a new planet with some given data.
     * @param name The name of the planet
     * @param mass The mass of the planet
     * @param location The current location of the planet
     * @param color An optional color used for rendering the planet
     */
    function Planet(name, mass, location, color, acc_vector) {
        this.name = name;
        this.mass = mass;
        this.location = location;
        this.acc_vector = acc_vector || new utils_1.Point(0, 0);
        this.color = color || "green";
    }
    /**
     * Applies the force from a given planet against this one.
     * Changing this planets direction and speed accordingly.
     * @param planet The planet to apply the force from.
     */
    Planet.prototype.applyForce = function (planet) {
        // Calculate the vector from this -> planet.
        var delta_x = planet.location.x - this.location.x;
        var delta_y = planet.location.y - this.location.y;
        // Determine the current distance between the planets.
        // Pythagoras.
        var distance = Math.sqrt(Math.pow(Math.abs(delta_x), 2) +
            Math.pow(Math.abs(delta_y), 2));
        // Calculate the force between the planets.
        // Newton's law of univeral gravitation
        var force = (constants_1.GRAVITATIONAL_CONST *
            (this.mass * planet.mass) / Math.pow(distance, 2));
        // Calculate the acceleration to apply based on the force and the mass.
        // Newton's second law.
        var acceleration = force / this.mass * 6 * Math.pow(10, 3);
        // Calculate and applythe new acceleration vector to apply based on the
        // difference between the newly calculated acceleration and the
        // currenct vector between this and planet.
        this.acc_vector.x += acceleration / distance * delta_x;
        this.acc_vector.y += acceleration / distance * delta_y;
        // TODO: Apply non-uniform acceleration.
        // For now i use a dummyimplementation for simply doing something.
        var acc_vector_multiplier = 6 * Math.pow(10, 3);
        this.location.x += this.acc_vector.x * acc_vector_multiplier;
        this.location.y += this.acc_vector.y * acc_vector_multiplier;
    };
    /**
     * Handles drawing the current planet on the canvas context supplied.
     * @param context A canvas context that allows drawing.
     */
    Planet.prototype.draw = function (context) {
        var middle_x = context.canvas.width / 2;
        var middle_y = context.canvas.height / 2;
        var planet_middle_x = middle_x + this.location.x * constants_1.DISTANCE_FACTOR;
        var planet_middle_y = middle_y + this.location.y * constants_1.DISTANCE_FACTOR;
        var planet_radius_px = Math.log(this.mass) * Math.LOG10E * constants_1.MASS_FACTOR;
        // Draw the planet.
        context.beginPath();
        context.arc(planet_middle_x, planet_middle_y, planet_radius_px, 0, 2 * Math.PI, false);
        context.closePath();
        context.fillStyle = this.color || 'white';
        context.fill();
        context.lineWidth = 3;
        context.strokeStyle = "black";
        context.stroke();
        // Draw the planet name.
        context.font = "18px Arial";
        context.fillStyle = 'black';
        context.fillText(this.name, planet_middle_x - planet_radius_px * 1.3, planet_middle_y + planet_radius_px * 2.5);
    };
    return Planet;
}());
exports.Planet = Planet;

},{"./constants":1,"./utils":4}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/**
 * Repressents some point as (x, y).
 */
var Point = (function () {
    /**
     * Creates a new Point
     * @param x The first axis of the coordinate.
     * @param y The second axis of the coordinate.
     */
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
exports.Point = Point;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uc3RhbnRzLnRzIiwic3JjL21haW4udHMiLCJzcmMvcGxhbmV0LnRzIiwic3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7R0FFRztBQUNVLFFBQUEsbUJBQW1CLEdBQUcsT0FBTyxHQUFHLFNBQUEsRUFBRSxFQUFJLENBQUMsRUFBRSxDQUFBLENBQUM7QUFDdkQ7O0dBRUc7QUFDVSxRQUFBLFdBQVcsR0FBRyxHQUFHLENBQUM7QUFDL0I7O0dBRUc7QUFDVSxRQUFBLGVBQWUsR0FBRyxDQUFDLEdBQUcsU0FBQSxFQUFFLEVBQUksQ0FBQyxDQUFDLENBQUEsQ0FBQzs7Ozs7QUNYNUMsbUNBQWtDO0FBQ2xDLGlDQUFnQztBQUVoQyxJQUFJLE9BQU8sR0FBa0I7SUFDekIsSUFBSSxlQUFNLENBQ04sS0FBSyxFQUNMLEtBQUssR0FBRyxTQUFBLEVBQUUsRUFBSSxFQUFFLENBQUEsRUFDaEIsSUFBSSxhQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUNmLFFBQVEsQ0FDWDtJQUNELElBQUksZUFBTSxDQUNOLE9BQU8sRUFDUCxLQUFLLEdBQUcsU0FBQSxFQUFFLEVBQUksRUFBRSxDQUFBLEVBQ2hCLElBQUksYUFBSyxDQUFDLEtBQUssR0FBRyxTQUFBLEVBQUUsRUFBSSxDQUFDLENBQUEsRUFBRSxDQUFDLENBQUMsRUFDN0IsT0FBTyxFQUNQLElBQUksYUFBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FDdEI7Q0FRSixDQUFDO0FBRUYsSUFBSSxNQUF5QixDQUFDO0FBQzlCLElBQUksT0FBaUMsQ0FBQztBQUV0QztJQUNJLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztJQUNwQixXQUFXLENBQUM7UUFDUixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ1YsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELE9B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QUFZLENBQUM7UUFDNUIsT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7UUFDNUIsT0FBTyxDQUFDLFFBQVEsQ0FDWixJQUFJLENBQUMsSUFBSSxFQUNULGVBQWUsR0FBRyxnQkFBZ0IsR0FBRyxHQUFHLEVBQ3hDLGVBQWUsR0FBRyxnQkFBZ0IsR0FBRyxHQUFHLENBQzNDLENBQUM7SUFDTixDQUFDO0lBQ0wsYUFBQztBQUFELENBbkdBLEFBbUdDLElBQUE7QUFuR1ksd0JBQU07Ozs7O0FDUG5COztHQUVHO0FBQ0g7SUFJSTs7OztPQUlHO0lBQ0gsZUFBWSxDQUFTLEVBQUUsQ0FBUztRQUM1QixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUNMLFlBQUM7QUFBRCxDQWJBLEFBYUMsSUFBQTtBQWJZLHNCQUFLIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQW4gZXN0aW1hdGlvbiBvZiB0aGUgZ3Jhdml0YXRpb25hbCBjb25zdGFudFxuICovXG5leHBvcnQgY29uc3QgR1JBVklUQVRJT05BTF9DT05TVCA9IDYuNjc0MDggKiAxMCAqKiAtMTE7XG4vKipcbiAqIFNjYWxlcyBhbGwgcmVuZGVyaW5nIG9mIG1hc3MgZnJvbSBwbGFuZXRzIGFjY29yZGluZyB0byB0aGlzIGZhY3Rvci5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BU1NfRkFDVE9SID0gMC41O1xuLyoqXG4gKiBTY2FsZXMgYWxsIGRpc3RhbmNlcyBieSB0aGlzIGZhY3Rvci5cbiAqL1xuZXhwb3J0IGNvbnN0IERJU1RBTkNFX0ZBQ1RPUiA9IDEgKiAxMCAqKiAtOTtcbiIsImltcG9ydCB7IFBsYW5ldCB9IGZyb20gXCIuL3BsYW5ldFwiO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5sZXQgcGxhbmV0czogQXJyYXk8UGxhbmV0PiA9IFtcbiAgICBuZXcgUGxhbmV0KFxuICAgICAgICBcIlN1blwiLFxuICAgICAgICAxLjk4OSAqIDEwICoqIDMwLFxuICAgICAgICBuZXcgUG9pbnQoMCwgMCksXG4gICAgICAgIFwieWVsbG93XCIsXG4gICAgKSxcbiAgICBuZXcgUGxhbmV0KFxuICAgICAgICBcIkVhcnRoXCIsXG4gICAgICAgIDUuOTcyICogMTAgKiogMjQsXG4gICAgICAgIG5ldyBQb2ludCgxNDkuNiAqIDEwICoqIDksIDApLFxuICAgICAgICBcImdyZWVuXCIsXG4gICAgICAgIG5ldyBQb2ludCgwLCAzMDAwMCksXG4gICAgKSxcbiAgICAvLyBuZXcgUGxhbmV0KFxuICAgIC8vICAgICBcIk1vb25cIixcbiAgICAvLyAgICAgNy4zNDc2NzMwOSAqIDEwICoqIDIyLFxuICAgIC8vICAgICBuZXcgUG9pbnQoMTQ5LjUgKiAxMCAqKiA5IC0gMzg0NDAwLCAwKSxcbiAgICAvLyAgICAgXCJncmV5XCIsXG4gICAgLy8gICAgIG5ldyBQb2ludCgtMzY4MywgMCksXG4gICAgLy8gKVxuXTtcblxubGV0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG5sZXQgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG5mdW5jdGlvbiBtYWluKCkge1xuICAgIGxldCBydW5uaW5nID0gZmFsc2U7XG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICAvLyBDbGVhciB0aGUgY2FudmFzLlxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XG4gICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY29udGV4dC5jYW52YXMud2lkdGgsIGNvbnRleHQuY2FudmFzLmhlaWdodCk7XG4gICAgICAgIC8vIENhbGN1bGF0ZSBhbmQgYXBwbHkgZm9yY2VzLlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDUwOyBpKyspIHtcbiAgICAgICAgICAgIGFwcGx5Rm9yY2VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRHJhdyB0aGUgcGxhbmV0cy5cbiAgICAgICAgZHJhd1BsYW5ldHMoKTtcbiAgICAgICAgLy8gRG8gaXQgYWdhaW4gOilcbiAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgIH0sIDEzKTtcbn1cblxuZnVuY3Rpb24gZHJhd1BsYW5ldHMoKSB7XG4gICAgLyogRHJhdyBlYWNoIHBsYW5ldC4gKi9cbiAgICBwbGFuZXRzLmZvckVhY2goKHBsYW5ldCkgPT4ge1xuICAgICAgICBwbGFuZXQuZHJhdyhjb250ZXh0KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gYXBwbHlGb3JjZXMoKSB7XG4gICAgcGxhbmV0cy5mb3JFYWNoKChwbGFuZXQsIGlkeCkgPT4ge1xuICAgICAgICBwbGFuZXRzLmZvckVhY2goKG90aGVyUGxhbmV0LCBvdGhlcklkeCkgPT4ge1xuICAgICAgICAgICAgaWYgKGlkeCAhPT0gb3RoZXJJZHgpIHtcbiAgICAgICAgICAgICAgICBwbGFuZXQuYXBwbHlGb3JjZShvdGhlclBsYW5ldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKiBIYW5kbGUgc2V0dGluZyB0aGUgY29udGV4dCB2YXJpYWJsZSB0byBzb21ldGhpbmcgcmVhc29uYWJsZS4gKi9cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyXCIpIGFzIEhUTUxEaXZFbGVtZW50O1xuXG4gICAgLy8gQ3JlYXRlIHRoZSBjYW52YXMgZWxlbWVudCBhbmQgc2V0IHdpZHRoL2hlaWdodC5cbiAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgIGxldCB3aWR0aCA9IE1hdGgubWluKGNvbnRhaW5lci5jbGllbnRXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICBjYW52YXMud2lkdGggPSB3aWR0aCAtIDEwO1xuICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aCAtIDEwO1xuICAgIGNhbnZhcy5zdHlsZS5ib3JkZXIgPSBcIjFweCBzb2xpZCBibGFja1wiO1xuXG4gICAgLy8gQWRkIHRoZSBjYW52YXMgYW5kIGZldGNoIHRoZSBjb250ZXh0LlxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgIG1haW4oKTtcbn0pOyIsImltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7XG4gICAgTUFTU19GQUNUT1IsXG4gICAgRElTVEFOQ0VfRkFDVE9SLFxuICAgIEdSQVZJVEFUSU9OQUxfQ09OU1QsXG59IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuXG5leHBvcnQgY2xhc3MgUGxhbmV0IHtcbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgbWFzczogbnVtYmVyO1xuICAgIHJlYWRvbmx5IGNvbG9yOiBzdHJpbmc7XG4gICAgbG9jYXRpb246IFBvaW50O1xuICAgIGFjY192ZWN0b3I6IFBvaW50O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBwbGFuZXQgd2l0aCBzb21lIGdpdmVuIGRhdGEuXG4gICAgICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgb2YgdGhlIHBsYW5ldFxuICAgICAqIEBwYXJhbSBtYXNzIFRoZSBtYXNzIG9mIHRoZSBwbGFuZXRcbiAgICAgKiBAcGFyYW0gbG9jYXRpb24gVGhlIGN1cnJlbnQgbG9jYXRpb24gb2YgdGhlIHBsYW5ldFxuICAgICAqIEBwYXJhbSBjb2xvciBBbiBvcHRpb25hbCBjb2xvciB1c2VkIGZvciByZW5kZXJpbmcgdGhlIHBsYW5ldFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgbWFzczogbnVtYmVyLCBsb2NhdGlvbjogUG9pbnQsIGNvbG9yPzogc3RyaW5nLCBhY2NfdmVjdG9yPzogUG9pbnQpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5tYXNzID0gbWFzcztcbiAgICAgICAgdGhpcy5sb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgICAgICB0aGlzLmFjY192ZWN0b3IgPSBhY2NfdmVjdG9yIHx8IG5ldyBQb2ludCgwLCAwKTtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yIHx8IFwiZ3JlZW5cIjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIHRoZSBmb3JjZSBmcm9tIGEgZ2l2ZW4gcGxhbmV0IGFnYWluc3QgdGhpcyBvbmUuXG4gICAgICogQ2hhbmdpbmcgdGhpcyBwbGFuZXRzIGRpcmVjdGlvbiBhbmQgc3BlZWQgYWNjb3JkaW5nbHkuXG4gICAgICogQHBhcmFtIHBsYW5ldCBUaGUgcGxhbmV0IHRvIGFwcGx5IHRoZSBmb3JjZSBmcm9tLlxuICAgICAqL1xuICAgIGFwcGx5Rm9yY2UocGxhbmV0OiBQbGFuZXQpIHtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSB2ZWN0b3IgZnJvbSB0aGlzIC0+IHBsYW5ldC5cbiAgICAgICAgbGV0IGRlbHRhX3ggPSBwbGFuZXQubG9jYXRpb24ueCAtIHRoaXMubG9jYXRpb24ueDtcbiAgICAgICAgbGV0IGRlbHRhX3kgPSBwbGFuZXQubG9jYXRpb24ueSAtIHRoaXMubG9jYXRpb24ueTtcblxuICAgICAgICAvLyBEZXRlcm1pbmUgdGhlIGN1cnJlbnQgZGlzdGFuY2UgYmV0d2VlbiB0aGUgcGxhbmV0cy5cbiAgICAgICAgLy8gUHl0aGFnb3Jhcy5cbiAgICAgICAgbGV0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KFxuICAgICAgICAgICAgTWF0aC5hYnMoZGVsdGFfeCkgKiogMiArXG4gICAgICAgICAgICBNYXRoLmFicyhkZWx0YV95KSAqKiAyKTtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGZvcmNlIGJldHdlZW4gdGhlIHBsYW5ldHMuXG4gICAgICAgIC8vIE5ld3RvbidzIGxhdyBvZiB1bml2ZXJhbCBncmF2aXRhdGlvblxuICAgICAgICBsZXQgZm9yY2UgPSAoXG4gICAgICAgICAgICBHUkFWSVRBVElPTkFMX0NPTlNUICpcbiAgICAgICAgICAgICh0aGlzLm1hc3MgKiBwbGFuZXQubWFzcykgLyBkaXN0YW5jZSAqKiAyKTtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGFjY2VsZXJhdGlvbiB0byBhcHBseSBiYXNlZCBvbiB0aGUgZm9yY2UgYW5kIHRoZSBtYXNzLlxuICAgICAgICAvLyBOZXd0b24ncyBzZWNvbmQgbGF3LlxuICAgICAgICBsZXQgYWNjZWxlcmF0aW9uID0gZm9yY2UgLyB0aGlzLm1hc3MgKiA2ICogMTAgKiogMztcblxuICAgICAgICAvLyBDYWxjdWxhdGUgYW5kIGFwcGx5dGhlIG5ldyBhY2NlbGVyYXRpb24gdmVjdG9yIHRvIGFwcGx5IGJhc2VkIG9uIHRoZVxuICAgICAgICAvLyBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIG5ld2x5IGNhbGN1bGF0ZWQgYWNjZWxlcmF0aW9uIGFuZCB0aGVcbiAgICAgICAgLy8gY3VycmVuY3QgdmVjdG9yIGJldHdlZW4gdGhpcyBhbmQgcGxhbmV0LlxuICAgICAgICB0aGlzLmFjY192ZWN0b3IueCArPSBhY2NlbGVyYXRpb24gLyBkaXN0YW5jZSAqIGRlbHRhX3g7XG4gICAgICAgIHRoaXMuYWNjX3ZlY3Rvci55ICs9IGFjY2VsZXJhdGlvbiAvIGRpc3RhbmNlICogZGVsdGFfeTtcblxuICAgICAgICAvLyBUT0RPOiBBcHBseSBub24tdW5pZm9ybSBhY2NlbGVyYXRpb24uXG4gICAgICAgIC8vIEZvciBub3cgaSB1c2UgYSBkdW1teWltcGxlbWVudGF0aW9uIGZvciBzaW1wbHkgZG9pbmcgc29tZXRoaW5nLlxuICAgICAgICBsZXQgYWNjX3ZlY3Rvcl9tdWx0aXBsaWVyID0gNiAqIDEwICoqIDM7XG4gICAgICAgIHRoaXMubG9jYXRpb24ueCArPSB0aGlzLmFjY192ZWN0b3IueCAqIGFjY192ZWN0b3JfbXVsdGlwbGllcjtcbiAgICAgICAgdGhpcy5sb2NhdGlvbi55ICs9IHRoaXMuYWNjX3ZlY3Rvci55ICogYWNjX3ZlY3Rvcl9tdWx0aXBsaWVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgZHJhd2luZyB0aGUgY3VycmVudCBwbGFuZXQgb24gdGhlIGNhbnZhcyBjb250ZXh0IHN1cHBsaWVkLlxuICAgICAqIEBwYXJhbSBjb250ZXh0IEEgY2FudmFzIGNvbnRleHQgdGhhdCBhbGxvd3MgZHJhd2luZy5cbiAgICAgKi9cbiAgICBkcmF3KGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgICAgICBsZXQgbWlkZGxlX3ggPSBjb250ZXh0LmNhbnZhcy53aWR0aCAvIDI7XG4gICAgICAgIGxldCBtaWRkbGVfeSA9IGNvbnRleHQuY2FudmFzLmhlaWdodCAvIDI7XG5cbiAgICAgICAgbGV0IHBsYW5ldF9taWRkbGVfeCA9IG1pZGRsZV94ICsgdGhpcy5sb2NhdGlvbi54ICogRElTVEFOQ0VfRkFDVE9SO1xuICAgICAgICBsZXQgcGxhbmV0X21pZGRsZV95ID0gbWlkZGxlX3kgKyB0aGlzLmxvY2F0aW9uLnkgKiBESVNUQU5DRV9GQUNUT1I7XG4gICAgICAgIGxldCBwbGFuZXRfcmFkaXVzX3B4ID0gTWF0aC5sb2codGhpcy5tYXNzKSAqIE1hdGguTE9HMTBFICogTUFTU19GQUNUT1I7XG5cbiAgICAgICAgLy8gRHJhdyB0aGUgcGxhbmV0LlxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0LmFyYyhcbiAgICAgICAgICAgIHBsYW5ldF9taWRkbGVfeCxcbiAgICAgICAgICAgIHBsYW5ldF9taWRkbGVfeSxcbiAgICAgICAgICAgIHBsYW5ldF9yYWRpdXNfcHgsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMiAqIE1hdGguUEksXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuY29sb3IgfHwgJ3doaXRlJztcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gMztcbiAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAvLyBEcmF3IHRoZSBwbGFuZXQgbmFtZS5cbiAgICAgICAgY29udGV4dC5mb250ID0gXCIxOHB4IEFyaWFsXCI7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICAgICAgY29udGV4dC5maWxsVGV4dChcbiAgICAgICAgICAgIHRoaXMubmFtZSxcbiAgICAgICAgICAgIHBsYW5ldF9taWRkbGVfeCAtIHBsYW5ldF9yYWRpdXNfcHggKiAxLjMsXG4gICAgICAgICAgICBwbGFuZXRfbWlkZGxlX3kgKyBwbGFuZXRfcmFkaXVzX3B4ICogMi41LFxuICAgICAgICApO1xuICAgIH1cbn0iLCIvKipcbiAqIFJlcHJlc3NlbnRzIHNvbWUgcG9pbnQgYXMgKHgsIHkpLlxuICovXG5leHBvcnQgY2xhc3MgUG9pbnQge1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IFBvaW50XG4gICAgICogQHBhcmFtIHggVGhlIGZpcnN0IGF4aXMgb2YgdGhlIGNvb3JkaW5hdGUuXG4gICAgICogQHBhcmFtIHkgVGhlIHNlY29uZCBheGlzIG9mIHRoZSBjb29yZGluYXRlLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxufSJdfQ==
