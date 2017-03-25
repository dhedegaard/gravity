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
    new planet_1.Planet("Moon", 7.34767309 * Math.pow(10, 22), new utils_1.Point(149.5 * Math.pow(10, 9) + 384400, 0), "grey", new utils_1.Point(0, -3683 + 30000)),
];
var canvas;
var context;
function main() {
    var running = false;
    var func = function () {
        if (running) {
            return;
        }
        running = true;
        // Clear the canvas.
        context.fillStyle = 'white';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        // Calculate and apply forces.
        for (var i = 0; i < Math.pow(10, 4); i++) {
            applyForces();
        }
        // Draw the planets.
        drawPlanets();
        // Do it again :)
        running = false;
    };
    func();
    setInterval(func, 25);
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
        var acceleration = force / this.mass * 2 * Math.pow(10, 1);
        // Calculate and applythe new acceleration vector to apply based on the
        // difference between the newly calculated acceleration and the
        // currenct vector between this and planet.
        this.acc_vector.x += acceleration / distance * delta_x;
        this.acc_vector.y += acceleration / distance * delta_y;
        // TODO: Apply non-uniform acceleration.
        // For now i use a dummyimplementation for simply doing something.
        var acc_vector_multiplier = 6 * Math.pow(10, 1);
        acc_vector_multiplier = Math.pow(10, 1);
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
;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uc3RhbnRzLnRzIiwic3JjL21haW4udHMiLCJzcmMvcGxhbmV0LnRzIiwic3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7R0FFRztBQUNVLFFBQUEsbUJBQW1CLEdBQUcsT0FBTyxHQUFHLFNBQUEsRUFBRSxFQUFJLENBQUMsRUFBRSxDQUFBLENBQUM7QUFDdkQ7O0dBRUc7QUFDVSxRQUFBLFdBQVcsR0FBRyxHQUFHLENBQUM7QUFDL0I7O0dBRUc7QUFDVSxRQUFBLGVBQWUsR0FBRyxDQUFDLEdBQUcsU0FBQSxFQUFFLEVBQUksQ0FBQyxDQUFDLENBQUEsQ0FBQzs7Ozs7QUNYNUMsbUNBQWtDO0FBQ2xDLGlDQUFnQztBQUVoQyxJQUFJLE9BQU8sR0FBa0I7SUFDekIsSUFBSSxlQUFNLENBQ04sS0FBSyxFQUNMLEtBQUssR0FBRyxTQUFBLEVBQUUsRUFBSSxFQUFFLENBQUEsRUFDaEIsSUFBSSxhQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUNmLFFBQVEsQ0FDWDtJQUNELElBQUksZUFBTSxDQUNOLE9BQU8sRUFDUCxLQUFLLEdBQUcsU0FBQSxFQUFFLEVBQUksRUFBRSxDQUFBLEVBQ2hCLElBQUksYUFBSyxDQUFDLEtBQUssR0FBRyxTQUFBLEVBQUUsRUFBSSxDQUFDLENBQUEsRUFBRSxDQUFDLENBQUMsRUFDN0IsT0FBTyxFQUNQLElBQUksYUFBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FDdEI7SUFDRCxJQUFJLGVBQU0sQ0FDTixNQUFNLEVBQ04sVUFBVSxHQUFHLFNBQUEsRUFBRSxFQUFJLEVBQUUsQ0FBQSxFQUNyQixJQUFJLGFBQUssQ0FBQyxLQUFLLEdBQUcsU0FBQSxFQUFFLEVBQUksQ0FBQyxDQUFBLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUN0QyxNQUFNLEVBQ04sSUFBSSxhQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUM5QjtDQUNKLENBQUM7QUFFRixJQUFJLE1BQXlCLENBQUM7QUFDOUIsSUFBSSxPQUFpQyxDQUFDO0FBRXRDO0lBQ0ksSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLElBQUksSUFBSSxHQUFHO1FBQ1AsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNWLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFDRCxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ2Ysb0JBQW9CO1FBQ3BCLE9BQU8sQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BFLDhCQUE4QjtRQUM5QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQUEsRUFBRSxFQUFJLENBQUMsQ0FBQSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDL0IsV0FBVyxFQUFFLENBQUM7UUFDbEIsQ0FBQztRQUNELG9CQUFvQjtRQUNwQixXQUFXLEVBQUUsQ0FBQztRQUNkLGlCQUFpQjtRQUNqQixPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLENBQUMsQ0FBQztJQUNGLElBQUksRUFBRSxDQUFDO0lBQ1AsV0FBVyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMxQixDQUFDO0FBRUQ7SUFDSSx1QkFBdUI7SUFDdkIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU07UUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6QixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFFRDtJQUNJLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQUUsR0FBRztRQUN4QixPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsV0FBVyxFQUFFLFFBQVE7WUFDbEMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbkMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBRUQsa0VBQWtFO0FBQ2xFLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRTtJQUMxQyxJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBbUIsQ0FBQztJQUV2RSxrREFBa0Q7SUFDbEQsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFzQixDQUFDO0lBQy9ELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDaEUsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQzFCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUMzQixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQztJQUV4Qyx3Q0FBd0M7SUFDeEMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5QixPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVsQyxJQUFJLEVBQUUsQ0FBQztBQUNYLENBQUMsQ0FBQyxDQUFDOzs7OztBQ3JGSCxpQ0FBZ0M7QUFDaEMseUNBSXFCO0FBRXJCO0lBT0k7Ozs7OztPQU1HO0lBQ0gsZ0JBQVksSUFBWSxFQUFFLElBQVksRUFBRSxRQUFlLEVBQUUsS0FBYyxFQUFFLFVBQWtCO1FBQ3ZGLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxJQUFJLElBQUksYUFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssSUFBSSxPQUFPLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCwyQkFBVSxHQUFWLFVBQVcsTUFBYztRQUNyQiw0Q0FBNEM7UUFDNUMsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDbEQsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFFbEQsc0RBQXNEO1FBQ3RELGNBQWM7UUFDZCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUNwQixTQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUksQ0FBQyxDQUFBO1lBQ3RCLFNBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBSSxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRTVCLDJDQUEyQztRQUMzQyx1Q0FBdUM7UUFDdkMsSUFBSSxLQUFLLEdBQUcsQ0FDUiwrQkFBbUI7WUFDbkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFBLFFBQVEsRUFBSSxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRS9DLHVFQUF1RTtRQUN2RSx1QkFBdUI7UUFDdkIsSUFBSSxZQUFZLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLFNBQUEsRUFBRSxFQUFJLENBQUMsQ0FBQSxDQUFDO1FBRW5ELHVFQUF1RTtRQUN2RSwrREFBK0Q7UUFDL0QsMkNBQTJDO1FBQzNDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLFlBQVksR0FBRyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLFlBQVksR0FBRyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBRXZELHdDQUF3QztRQUN4QyxrRUFBa0U7UUFDbEUsSUFBSSxxQkFBcUIsR0FBRyxDQUFDLEdBQUcsU0FBQSxFQUFFLEVBQUksQ0FBQyxDQUFBLENBQUM7UUFDeEMscUJBQXFCLEdBQUMsU0FBQSxFQUFFLEVBQUUsQ0FBQyxDQUFBLENBQUM7UUFDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcscUJBQXFCLENBQUM7UUFDN0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcscUJBQXFCLENBQUM7SUFDakUsQ0FBQztJQUVEOzs7T0FHRztJQUNILHFCQUFJLEdBQUosVUFBSyxPQUFpQztRQUNsQyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDeEMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBRXpDLElBQUksZUFBZSxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRywyQkFBZSxDQUFDO1FBQ25FLElBQUksZUFBZSxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRywyQkFBZSxDQUFDO1FBQ25FLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyx1QkFBVyxDQUFDO1FBRXZFLG1CQUFtQjtRQUNuQixPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FDUCxlQUFlLEVBQ2YsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixDQUFDLEVBQ0QsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQ1gsS0FBSyxDQUNSLENBQUM7UUFDRixPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDcEIsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQztRQUMxQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUN0QixPQUFPLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztRQUM5QixPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFakIsd0JBQXdCO1FBQ3hCLE9BQU8sQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxRQUFRLENBQ1osSUFBSSxDQUFDLElBQUksRUFDVCxlQUFlLEdBQUcsZ0JBQWdCLEdBQUcsR0FBRyxFQUN4QyxlQUFlLEdBQUcsZ0JBQWdCLEdBQUcsR0FBRyxDQUMzQyxDQUFDO0lBQ04sQ0FBQztJQUNMLGFBQUM7QUFBRCxDQXBHQSxBQW9HQyxJQUFBO0FBcEdZLHdCQUFNOzs7OztBQ1BuQjs7R0FFRztBQUNIO0lBSUk7Ozs7T0FJRztJQUNILGVBQVksQ0FBUyxFQUFFLENBQVM7UUFDNUIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7SUFDTCxZQUFDO0FBQUQsQ0FiQSxBQWFDLElBQUE7QUFiWSxzQkFBSztBQWFqQixDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQW4gZXN0aW1hdGlvbiBvZiB0aGUgZ3Jhdml0YXRpb25hbCBjb25zdGFudFxuICovXG5leHBvcnQgY29uc3QgR1JBVklUQVRJT05BTF9DT05TVCA9IDYuNjc0MDggKiAxMCAqKiAtMTE7XG4vKipcbiAqIFNjYWxlcyBhbGwgcmVuZGVyaW5nIG9mIG1hc3MgZnJvbSBwbGFuZXRzIGFjY29yZGluZyB0byB0aGlzIGZhY3Rvci5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BU1NfRkFDVE9SID0gMC41O1xuLyoqXG4gKiBTY2FsZXMgYWxsIGRpc3RhbmNlcyBieSB0aGlzIGZhY3Rvci5cbiAqL1xuZXhwb3J0IGNvbnN0IERJU1RBTkNFX0ZBQ1RPUiA9IDEgKiAxMCAqKiAtOTtcbiIsImltcG9ydCB7IFBsYW5ldCB9IGZyb20gXCIuL3BsYW5ldFwiO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5sZXQgcGxhbmV0czogQXJyYXk8UGxhbmV0PiA9IFtcbiAgICBuZXcgUGxhbmV0KFxuICAgICAgICBcIlN1blwiLFxuICAgICAgICAxLjk4OSAqIDEwICoqIDMwLFxuICAgICAgICBuZXcgUG9pbnQoMCwgMCksXG4gICAgICAgIFwieWVsbG93XCIsXG4gICAgKSxcbiAgICBuZXcgUGxhbmV0KFxuICAgICAgICBcIkVhcnRoXCIsXG4gICAgICAgIDUuOTcyICogMTAgKiogMjQsXG4gICAgICAgIG5ldyBQb2ludCgxNDkuNiAqIDEwICoqIDksIDApLFxuICAgICAgICBcImdyZWVuXCIsXG4gICAgICAgIG5ldyBQb2ludCgwLCAzMDAwMCksXG4gICAgKSxcbiAgICBuZXcgUGxhbmV0KFxuICAgICAgICBcIk1vb25cIixcbiAgICAgICAgNy4zNDc2NzMwOSAqIDEwICoqIDIyLFxuICAgICAgICBuZXcgUG9pbnQoMTQ5LjUgKiAxMCAqKiA5ICsgMzg0NDAwLCAwKSxcbiAgICAgICAgXCJncmV5XCIsXG4gICAgICAgIG5ldyBQb2ludCgwLCAtMzY4MyArIDMwMDAwKSxcbiAgICApLFxuXTtcblxubGV0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG5sZXQgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG5mdW5jdGlvbiBtYWluKCkge1xuICAgIGxldCBydW5uaW5nID0gZmFsc2U7XG4gICAgbGV0IGZ1bmMgPSAoKSA9PiB7XG4gICAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICAgIC8vIENsZWFyIHRoZSBjYW52YXMuXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJ3doaXRlJztcbiAgICAgICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCBjb250ZXh0LmNhbnZhcy53aWR0aCwgY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIGFuZCBhcHBseSBmb3JjZXMuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAgKiogNDsgaSsrKSB7XG4gICAgICAgICAgICBhcHBseUZvcmNlcygpO1xuICAgICAgICB9XG4gICAgICAgIC8vIERyYXcgdGhlIHBsYW5ldHMuXG4gICAgICAgIGRyYXdQbGFuZXRzKCk7XG4gICAgICAgIC8vIERvIGl0IGFnYWluIDopXG4gICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICB9O1xuICAgIGZ1bmMoKTtcbiAgICBzZXRJbnRlcnZhbChmdW5jLCAyNSk7XG59XG5cbmZ1bmN0aW9uIGRyYXdQbGFuZXRzKCkge1xuICAgIC8qIERyYXcgZWFjaCBwbGFuZXQuICovXG4gICAgcGxhbmV0cy5mb3JFYWNoKChwbGFuZXQpID0+IHtcbiAgICAgICAgcGxhbmV0LmRyYXcoY29udGV4dCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGFwcGx5Rm9yY2VzKCkge1xuICAgIHBsYW5ldHMuZm9yRWFjaCgocGxhbmV0LCBpZHgpID0+IHtcbiAgICAgICAgcGxhbmV0cy5mb3JFYWNoKChvdGhlclBsYW5ldCwgb3RoZXJJZHgpID0+IHtcbiAgICAgICAgICAgIGlmIChpZHggIT09IG90aGVySWR4KSB7XG4gICAgICAgICAgICAgICAgcGxhbmV0LmFwcGx5Rm9yY2Uob3RoZXJQbGFuZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyogSGFuZGxlIHNldHRpbmcgdGhlIGNvbnRleHQgdmFyaWFibGUgdG8gc29tZXRoaW5nIHJlYXNvbmFibGUuICovXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lclwiKSBhcyBIVE1MRGl2RWxlbWVudDtcblxuICAgIC8vIENyZWF0ZSB0aGUgY2FudmFzIGVsZW1lbnQgYW5kIHNldCB3aWR0aC9oZWlnaHQuXG4gICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICBsZXQgd2lkdGggPSBNYXRoLm1pbihjb250YWluZXIuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgY2FudmFzLndpZHRoID0gd2lkdGggLSAxMDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGggLSAxMDtcbiAgICBjYW52YXMuc3R5bGUuYm9yZGVyID0gXCIxcHggc29saWQgYmxhY2tcIjtcblxuICAgIC8vIEFkZCB0aGUgY2FudmFzIGFuZCBmZXRjaCB0aGUgY29udGV4dC5cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICBtYWluKCk7XG59KTsiLCJpbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQge1xuICAgIE1BU1NfRkFDVE9SLFxuICAgIERJU1RBTkNFX0ZBQ1RPUixcbiAgICBHUkFWSVRBVElPTkFMX0NPTlNULFxufSBmcm9tIFwiLi9jb25zdGFudHNcIjtcblxuZXhwb3J0IGNsYXNzIFBsYW5ldCB7XG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IG1hc3M6IG51bWJlcjtcbiAgICByZWFkb25seSBjb2xvcjogc3RyaW5nO1xuICAgIGxvY2F0aW9uOiBQb2ludDtcbiAgICBhY2NfdmVjdG9yOiBQb2ludDtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgcGxhbmV0IHdpdGggc29tZSBnaXZlbiBkYXRhLlxuICAgICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBwbGFuZXRcbiAgICAgKiBAcGFyYW0gbWFzcyBUaGUgbWFzcyBvZiB0aGUgcGxhbmV0XG4gICAgICogQHBhcmFtIGxvY2F0aW9uIFRoZSBjdXJyZW50IGxvY2F0aW9uIG9mIHRoZSBwbGFuZXRcbiAgICAgKiBAcGFyYW0gY29sb3IgQW4gb3B0aW9uYWwgY29sb3IgdXNlZCBmb3IgcmVuZGVyaW5nIHRoZSBwbGFuZXRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIG1hc3M6IG51bWJlciwgbG9jYXRpb246IFBvaW50LCBjb2xvcj86IHN0cmluZywgYWNjX3ZlY3Rvcj86IFBvaW50KSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMubWFzcyA9IG1hc3M7XG4gICAgICAgIHRoaXMubG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgICAgICAgdGhpcy5hY2NfdmVjdG9yID0gYWNjX3ZlY3RvciB8fCBuZXcgUG9pbnQoMCwgMCk7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvciB8fCBcImdyZWVuXCI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXBwbGllcyB0aGUgZm9yY2UgZnJvbSBhIGdpdmVuIHBsYW5ldCBhZ2FpbnN0IHRoaXMgb25lLlxuICAgICAqIENoYW5naW5nIHRoaXMgcGxhbmV0cyBkaXJlY3Rpb24gYW5kIHNwZWVkIGFjY29yZGluZ2x5LlxuICAgICAqIEBwYXJhbSBwbGFuZXQgVGhlIHBsYW5ldCB0byBhcHBseSB0aGUgZm9yY2UgZnJvbS5cbiAgICAgKi9cbiAgICBhcHBseUZvcmNlKHBsYW5ldDogUGxhbmV0KSB7XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgdmVjdG9yIGZyb20gdGhpcyAtPiBwbGFuZXQuXG4gICAgICAgIGxldCBkZWx0YV94ID0gcGxhbmV0LmxvY2F0aW9uLnggLSB0aGlzLmxvY2F0aW9uLng7XG4gICAgICAgIGxldCBkZWx0YV95ID0gcGxhbmV0LmxvY2F0aW9uLnkgLSB0aGlzLmxvY2F0aW9uLnk7XG5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBjdXJyZW50IGRpc3RhbmNlIGJldHdlZW4gdGhlIHBsYW5ldHMuXG4gICAgICAgIC8vIFB5dGhhZ29yYXMuXG4gICAgICAgIGxldCBkaXN0YW5jZSA9IE1hdGguc3FydChcbiAgICAgICAgICAgIE1hdGguYWJzKGRlbHRhX3gpICoqIDIgK1xuICAgICAgICAgICAgTWF0aC5hYnMoZGVsdGFfeSkgKiogMik7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBmb3JjZSBiZXR3ZWVuIHRoZSBwbGFuZXRzLlxuICAgICAgICAvLyBOZXd0b24ncyBsYXcgb2YgdW5pdmVyYWwgZ3Jhdml0YXRpb25cbiAgICAgICAgbGV0IGZvcmNlID0gKFxuICAgICAgICAgICAgR1JBVklUQVRJT05BTF9DT05TVCAqXG4gICAgICAgICAgICAodGhpcy5tYXNzICogcGxhbmV0Lm1hc3MpIC8gZGlzdGFuY2UgKiogMik7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBhY2NlbGVyYXRpb24gdG8gYXBwbHkgYmFzZWQgb24gdGhlIGZvcmNlIGFuZCB0aGUgbWFzcy5cbiAgICAgICAgLy8gTmV3dG9uJ3Mgc2Vjb25kIGxhdy5cbiAgICAgICAgbGV0IGFjY2VsZXJhdGlvbiA9IGZvcmNlIC8gdGhpcy5tYXNzICogMiAqIDEwICoqIDE7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGFuZCBhcHBseXRoZSBuZXcgYWNjZWxlcmF0aW9uIHZlY3RvciB0byBhcHBseSBiYXNlZCBvbiB0aGVcbiAgICAgICAgLy8gZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBuZXdseSBjYWxjdWxhdGVkIGFjY2VsZXJhdGlvbiBhbmQgdGhlXG4gICAgICAgIC8vIGN1cnJlbmN0IHZlY3RvciBiZXR3ZWVuIHRoaXMgYW5kIHBsYW5ldC5cbiAgICAgICAgdGhpcy5hY2NfdmVjdG9yLnggKz0gYWNjZWxlcmF0aW9uIC8gZGlzdGFuY2UgKiBkZWx0YV94O1xuICAgICAgICB0aGlzLmFjY192ZWN0b3IueSArPSBhY2NlbGVyYXRpb24gLyBkaXN0YW5jZSAqIGRlbHRhX3k7XG5cbiAgICAgICAgLy8gVE9ETzogQXBwbHkgbm9uLXVuaWZvcm0gYWNjZWxlcmF0aW9uLlxuICAgICAgICAvLyBGb3Igbm93IGkgdXNlIGEgZHVtbXlpbXBsZW1lbnRhdGlvbiBmb3Igc2ltcGx5IGRvaW5nIHNvbWV0aGluZy5cbiAgICAgICAgbGV0IGFjY192ZWN0b3JfbXVsdGlwbGllciA9IDYgKiAxMCAqKiAxO1xuICAgICAgICBhY2NfdmVjdG9yX211bHRpcGxpZXI9MTAqKjE7XG4gICAgICAgIHRoaXMubG9jYXRpb24ueCArPSB0aGlzLmFjY192ZWN0b3IueCAqIGFjY192ZWN0b3JfbXVsdGlwbGllcjtcbiAgICAgICAgdGhpcy5sb2NhdGlvbi55ICs9IHRoaXMuYWNjX3ZlY3Rvci55ICogYWNjX3ZlY3Rvcl9tdWx0aXBsaWVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgZHJhd2luZyB0aGUgY3VycmVudCBwbGFuZXQgb24gdGhlIGNhbnZhcyBjb250ZXh0IHN1cHBsaWVkLlxuICAgICAqIEBwYXJhbSBjb250ZXh0IEEgY2FudmFzIGNvbnRleHQgdGhhdCBhbGxvd3MgZHJhd2luZy5cbiAgICAgKi9cbiAgICBkcmF3KGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgICAgICBsZXQgbWlkZGxlX3ggPSBjb250ZXh0LmNhbnZhcy53aWR0aCAvIDI7XG4gICAgICAgIGxldCBtaWRkbGVfeSA9IGNvbnRleHQuY2FudmFzLmhlaWdodCAvIDI7XG5cbiAgICAgICAgbGV0IHBsYW5ldF9taWRkbGVfeCA9IG1pZGRsZV94ICsgdGhpcy5sb2NhdGlvbi54ICogRElTVEFOQ0VfRkFDVE9SO1xuICAgICAgICBsZXQgcGxhbmV0X21pZGRsZV95ID0gbWlkZGxlX3kgKyB0aGlzLmxvY2F0aW9uLnkgKiBESVNUQU5DRV9GQUNUT1I7XG4gICAgICAgIGxldCBwbGFuZXRfcmFkaXVzX3B4ID0gTWF0aC5sb2codGhpcy5tYXNzKSAqIE1hdGguTE9HMTBFICogTUFTU19GQUNUT1I7XG5cbiAgICAgICAgLy8gRHJhdyB0aGUgcGxhbmV0LlxuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0LmFyYyhcbiAgICAgICAgICAgIHBsYW5ldF9taWRkbGVfeCxcbiAgICAgICAgICAgIHBsYW5ldF9taWRkbGVfeSxcbiAgICAgICAgICAgIHBsYW5ldF9yYWRpdXNfcHgsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMiAqIE1hdGguUEksXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuY29sb3IgfHwgJ3doaXRlJztcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICAgIGNvbnRleHQubGluZVdpZHRoID0gMztcbiAgICAgICAgY29udGV4dC5zdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcblxuICAgICAgICAvLyBEcmF3IHRoZSBwbGFuZXQgbmFtZS5cbiAgICAgICAgY29udGV4dC5mb250ID0gXCIxOHB4IEFyaWFsXCI7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICAgICAgY29udGV4dC5maWxsVGV4dChcbiAgICAgICAgICAgIHRoaXMubmFtZSxcbiAgICAgICAgICAgIHBsYW5ldF9taWRkbGVfeCAtIHBsYW5ldF9yYWRpdXNfcHggKiAxLjMsXG4gICAgICAgICAgICBwbGFuZXRfbWlkZGxlX3kgKyBwbGFuZXRfcmFkaXVzX3B4ICogMi41LFxuICAgICAgICApO1xuICAgIH1cbn0iLCIvKipcbiAqIFJlcHJlc3NlbnRzIHNvbWUgcG9pbnQgYXMgKHgsIHkpLlxuICovXG5leHBvcnQgY2xhc3MgUG9pbnQge1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IFBvaW50XG4gICAgICogQHBhcmFtIHggVGhlIGZpcnN0IGF4aXMgb2YgdGhlIGNvb3JkaW5hdGUuXG4gICAgICogQHBhcmFtIHkgVGhlIHNlY29uZCBheGlzIG9mIHRoZSBjb29yZGluYXRlLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxufTsiXX0=
