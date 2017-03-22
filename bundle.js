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
    new planet_1.Planet("Earth", 5.972 * Math.pow(10, 24), new utils_1.Point(149.6 * Math.pow(10, 9), 0), "green", new utils_1.Point(0, 30.000 * 4 * Math.pow(10, -2))),
];
var canvas;
var context;
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
    planets.forEach(function (planet) {
        planet.draw(context);
    });
}
function applyForces() {
    planets.forEach(function (planet) {
        planets.forEach(function (otherPlanet) {
            if (planet != otherPlanet) {
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
        var acceleration = force / this.mass;
        // Calculate and applythe new acceleration vector to apply based on the
        // difference between the newly calculated acceleration and the
        // currenct vector between this and planet.
        this.acc_vector.x += acceleration / distance * delta_x;
        this.acc_vector.y += acceleration / distance * delta_y;
        // TODO: Apply non-uniform acceleration.
        // For now i use a dummyimplementation for simply doing something.
        var acc_vector_multiplier = 3 * Math.pow(10, 8);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uc3RhbnRzLnRzIiwic3JjL21haW4udHMiLCJzcmMvcGxhbmV0LnRzIiwic3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7R0FFRztBQUNVLFFBQUEsbUJBQW1CLEdBQUcsT0FBTyxHQUFHLFNBQUEsRUFBRSxFQUFJLENBQUMsRUFBRSxDQUFBLENBQUM7QUFDdkQ7O0dBRUc7QUFDVSxRQUFBLFdBQVcsR0FBRyxHQUFHLENBQUM7QUFDL0I7O0dBRUc7QUFDVSxRQUFBLGVBQWUsR0FBRyxDQUFDLEdBQUcsU0FBQSxFQUFFLEVBQUksQ0FBQyxDQUFDLENBQUEsQ0FBQzs7Ozs7QUNYNUMsbUNBQWtDO0FBQ2xDLGlDQUFnQztBQUVoQyxJQUFJLE9BQU8sR0FBa0I7SUFDekIsSUFBSSxlQUFNLENBQ04sS0FBSyxFQUNMLEtBQUssR0FBRyxTQUFBLEVBQUUsRUFBSSxFQUFFLENBQUEsRUFDaEIsSUFBSSxhQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUNmLFFBQVEsQ0FDWDtJQUNELElBQUksZUFBTSxDQUNOLE9BQU8sRUFDUCxLQUFLLEdBQUcsU0FBQSxFQUFFLEVBQUksRUFBRSxDQUFBLEVBQ2hCLElBQUksYUFBSyxDQUFDLEtBQUssR0FBRyxTQUFBLEVBQUUsRUFBSSxDQUFDLENBQUEsRUFBRSxDQUFDLENBQUMsRUFDN0IsT0FBTyxFQUNQLElBQUksYUFBSyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxHQUFHLFNBQUEsRUFBRSxFQUFJLENBQUMsQ0FBQyxDQUFBLENBQUMsQ0FDdEM7Q0FDSixDQUFDO0FBRUYsSUFBSSxNQUF5QixDQUFDO0FBQzlCLElBQUksT0FBaUMsQ0FBQztBQUV0QztJQUNJLG9CQUFvQjtJQUNwQixPQUFPLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztJQUM1QixPQUFPLENBQUMsUUFBUSxDQUFD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SUk7Ozs7T0FJRztJQUNILGVBQVksQ0FBUyxFQUFFLENBQVM7UUFDNUIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7SUFDTCxZQUFDO0FBQUQsQ0FiQSxBQWFDLElBQUE7QUFiWSxzQkFBSyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIEFuIGVzdGltYXRpb24gb2YgdGhlIGdyYXZpdGF0aW9uYWwgY29uc3RhbnRcbiAqL1xuZXhwb3J0IGNvbnN0IEdSQVZJVEFUSU9OQUxfQ09OU1QgPSA2LjY3NDA4ICogMTAgKiogLTExO1xuLyoqXG4gKiBTY2FsZXMgYWxsIHJlbmRlcmluZyBvZiBtYXNzIGZyb20gcGxhbmV0cyBhY2NvcmRpbmcgdG8gdGhpcyBmYWN0b3IuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVNTX0ZBQ1RPUiA9IDAuNTtcbi8qKlxuICogU2NhbGVzIGFsbCBkaXN0YW5jZXMgYnkgdGhpcyBmYWN0b3IuXG4gKi9cbmV4cG9ydCBjb25zdCBESVNUQU5DRV9GQUNUT1IgPSAxICogMTAgKiogLTk7XG4iLCJpbXBvcnQgeyBQbGFuZXQgfSBmcm9tIFwiLi9wbGFuZXRcIjtcbmltcG9ydCB7IFBvaW50IH0gZnJvbSBcIi4vdXRpbHNcIjtcblxubGV0IHBsYW5ldHM6IEFycmF5PFBsYW5ldD4gPSBbXG4gICAgbmV3IFBsYW5ldChcbiAgICAgICAgXCJTdW5cIixcbiAgICAgICAgMS45ODkgKiAxMCAqKiAzMCxcbiAgICAgICAgbmV3IFBvaW50KDAsIDApLFxuICAgICAgICBcInllbGxvd1wiLFxuICAgICksXG4gICAgbmV3IFBsYW5ldChcbiAgICAgICAgXCJFYXJ0aFwiLFxuICAgICAgICA1Ljk3MiAqIDEwICoqIDI0LFxuICAgICAgICBuZXcgUG9pbnQoMTQ5LjYgKiAxMCAqKiA5LCAwKSxcbiAgICAgICAgXCJncmVlblwiLFxuICAgICAgICBuZXcgUG9pbnQoMCwgMzAuMDAwICogNCAqIDEwICoqIC0yKSxcbiAgICApLFxuXTtcblxubGV0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG5sZXQgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG5mdW5jdGlvbiBtYWluKCkge1xuICAgIC8vIENsZWFyIHRoZSBjYW52YXMuXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY29udGV4dC5jYW52YXMud2lkdGgsIGNvbnRleHQuY2FudmFzLmhlaWdodCk7XG4gICAgLy8gRHJhdyB0aGUgcGxhbmV0cy5cbiAgICBkcmF3UGxhbmV0cygpO1xuICAgIC8vIENhbGN1bGF0ZSBhbmQgYXBwbHkgZm9yY2VzLlxuICAgIGFwcGx5Rm9yY2VzKCk7XG4gICAgLy8gRG8gaXQgYWdhaW4gOilcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbWFpbigpO1xuICAgIH0sIDEpO1xufVxuXG5mdW5jdGlvbiBkcmF3UGxhbmV0cygpIHtcbiAgICAvKiBEcmF3IGVhY2ggcGxhbmV0LiAqL1xuICAgIHBsYW5ldHMuZm9yRWFjaCgocGxhbmV0KSA9PiB7XG4gICAgICAgIHBsYW5ldC5kcmF3KGNvbnRleHQpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhcHBseUZvcmNlcygpIHtcbiAgICBwbGFuZXRzLmZvckVhY2goKHBsYW5ldCkgPT4ge1xuICAgICAgICBwbGFuZXRzLmZvckVhY2goKG90aGVyUGxhbmV0KSA9PiB7XG4gICAgICAgICAgICBpZiAocGxhbmV0ICE9IG90aGVyUGxhbmV0KSB7XG4gICAgICAgICAgICAgICAgcGxhbmV0LmFwcGx5Rm9yY2Uob3RoZXJQbGFuZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyogSGFuZGxlIHNldHRpbmcgdGhlIGNvbnRleHQgdmFyaWFibGUgdG8gc29tZXRoaW5nIHJlYXNvbmFibGUuICovXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lclwiKSBhcyBIVE1MRGl2RWxlbWVudDtcblxuICAgIC8vIENyZWF0ZSB0aGUgY2FudmFzIGVsZW1lbnQgYW5kIHNldCB3aWR0aC9oZWlnaHQuXG4gICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICBsZXQgd2lkdGggPSBNYXRoLm1pbihjb250YWluZXIuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgY2FudmFzLndpZHRoID0gd2lkdGggLSAxMDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGggLSAxMDtcbiAgICBjYW52YXMuc3R5bGUuYm9yZGVyID0gXCIxcHggc29saWQgYmxhY2tcIjtcblxuICAgIC8vIEFkZCB0aGUgY2FudmFzIGFuZCBmZXRjaCB0aGUgY29udGV4dC5cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICBtYWluKCk7XG59KTsiLCJpbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQge1xuICAgIE1BU1NfRkFDVE9SLFxuICAgIERJU1RBTkNFX0ZBQ1RPUixcbiAgICBHUkFWSVRBVElPTkFMX0NPTlNULFxufSBmcm9tIFwiLi9jb25zdGFudHNcIjtcblxuZXhwb3J0IGNsYXNzIFBsYW5ldCB7XG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuICAgIHJlYWRvbmx5IG1hc3M6IG51bWJlcjtcbiAgICByZWFkb25seSBjb2xvcjogc3RyaW5nO1xuICAgIGxvY2F0aW9uOiBQb2ludDtcbiAgICBhY2NfdmVjdG9yOiBQb2ludDtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgcGxhbmV0IHdpdGggc29tZSBnaXZlbiBkYXRhLlxuICAgICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBwbGFuZXRcbiAgICAgKiBAcGFyYW0gbWFzcyBUaGUgbWFzcyBvZiB0aGUgcGxhbmV0XG4gICAgICogQHBhcmFtIGxvY2F0aW9uIFRoZSBjdXJyZW50IGxvY2F0aW9uIG9mIHRoZSBwbGFuZXRcbiAgICAgKiBAcGFyYW0gY29sb3IgQW4gb3B0aW9uYWwgY29sb3IgdXNlZCBmb3IgcmVuZGVyaW5nIHRoZSBwbGFuZXRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIG1hc3M6IG51bWJlciwgbG9jYXRpb246IFBvaW50LCBjb2xvcj86IHN0cmluZywgYWNjX3ZlY3Rvcj86IFBvaW50KSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMubWFzcyA9IG1hc3M7XG4gICAgICAgIHRoaXMubG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgICAgICAgdGhpcy5hY2NfdmVjdG9yID0gYWNjX3ZlY3RvciB8fCBuZXcgUG9pbnQoMCwgMCk7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvciB8fCBcImdyZWVuXCI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXBwbGllcyB0aGUgZm9yY2UgZnJvbSBhIGdpdmVuIHBsYW5ldCBhZ2FpbnN0IHRoaXMgb25lLlxuICAgICAqIENoYW5naW5nIHRoaXMgcGxhbmV0cyBkaXJlY3Rpb24gYW5kIHNwZWVkIGFjY29yZGluZ2x5LlxuICAgICAqIEBwYXJhbSBwbGFuZXQgVGhlIHBsYW5ldCB0byBhcHBseSB0aGUgZm9yY2UgZnJvbS5cbiAgICAgKi9cbiAgICBhcHBseUZvcmNlKHBsYW5ldDogUGxhbmV0KSB7XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgdmVjdG9yIGZyb20gdGhpcyAtPiBwbGFuZXQuXG4gICAgICAgIGxldCBkZWx0YV94ID0gcGxhbmV0LmxvY2F0aW9uLnggLSB0aGlzLmxvY2F0aW9uLng7XG4gICAgICAgIGxldCBkZWx0YV95ID0gcGxhbmV0LmxvY2F0aW9uLnkgLSB0aGlzLmxvY2F0aW9uLnk7XG5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBjdXJyZW50IGRpc3RhbmNlIGJldHdlZW4gdGhlIHBsYW5ldHMuXG4gICAgICAgIC8vIFB5dGhhZ29yYXMuXG4gICAgICAgIGxldCBkaXN0YW5jZSA9IE1hdGguc3FydChcbiAgICAgICAgICAgIE1hdGguYWJzKGRlbHRhX3gpICoqIDIgK1xuICAgICAgICAgICAgTWF0aC5hYnMoZGVsdGFfeSkgKiogMik7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBmb3JjZSBiZXR3ZWVuIHRoZSBwbGFuZXRzLlxuICAgICAgICAvLyBOZXd0b24ncyBsYXcgb2YgdW5pdmVyYWwgZ3Jhdml0YXRpb25cbiAgICAgICAgbGV0IGZvcmNlID0gKFxuICAgICAgICAgICAgR1JBVklUQVRJT05BTF9DT05TVCAqXG4gICAgICAgICAgICAodGhpcy5tYXNzICogcGxhbmV0Lm1hc3MpIC8gZGlzdGFuY2UgKiogMik7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBhY2NlbGVyYXRpb24gdG8gYXBwbHkgYmFzZWQgb24gdGhlIGZvcmNlIGFuZCB0aGUgbWFzcy5cbiAgICAgICAgLy8gTmV3dG9uJ3Mgc2Vjb25kIGxhdy5cbiAgICAgICAgbGV0IGFjY2VsZXJhdGlvbiA9IGZvcmNlIC8gdGhpcy5tYXNzO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBhbmQgYXBwbHl0aGUgbmV3IGFjY2VsZXJhdGlvbiB2ZWN0b3IgdG8gYXBwbHkgYmFzZWQgb24gdGhlXG4gICAgICAgIC8vIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgbmV3bHkgY2FsY3VsYXRlZCBhY2NlbGVyYXRpb24gYW5kIHRoZVxuICAgICAgICAvLyBjdXJyZW5jdCB2ZWN0b3IgYmV0d2VlbiB0aGlzIGFuZCBwbGFuZXQuXG4gICAgICAgIHRoaXMuYWNjX3ZlY3Rvci54ICs9IGFjY2VsZXJhdGlvbiAvIGRpc3RhbmNlICogZGVsdGFfeDtcbiAgICAgICAgdGhpcy5hY2NfdmVjdG9yLnkgKz0gYWNjZWxlcmF0aW9uIC8gZGlzdGFuY2UgKiBkZWx0YV95O1xuXG4gICAgICAgIC8vIFRPRE86IEFwcGx5IG5vbi11bmlmb3JtIGFjY2VsZXJhdGlvbi5cbiAgICAgICAgLy8gRm9yIG5vdyBpIHVzZSBhIGR1bW15aW1wbGVtZW50YXRpb24gZm9yIHNpbXBseSBkb2luZyBzb21ldGhpbmcuXG4gICAgICAgIGxldCBhY2NfdmVjdG9yX211bHRpcGxpZXIgPSAzICogMTAgKiogODtcbiAgICAgICAgdGhpcy5sb2NhdGlvbi54ICs9IHRoaXMuYWNjX3ZlY3Rvci54ICogYWNjX3ZlY3Rvcl9tdWx0aXBsaWVyO1xuICAgICAgICB0aGlzLmxvY2F0aW9uLnkgKz0gdGhpcy5hY2NfdmVjdG9yLnkgKiBhY2NfdmVjdG9yX211bHRpcGxpZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyBkcmF3aW5nIHRoZSBjdXJyZW50IHBsYW5ldCBvbiB0aGUgY2FudmFzIGNvbnRleHQgc3VwcGxpZWQuXG4gICAgICogQHBhcmFtIGNvbnRleHQgQSBjYW52YXMgY29udGV4dCB0aGF0IGFsbG93cyBkcmF3aW5nLlxuICAgICAqL1xuICAgIGRyYXcoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgICAgIGxldCBtaWRkbGVfeCA9IGNvbnRleHQuY2FudmFzLndpZHRoIC8gMjtcbiAgICAgICAgbGV0IG1pZGRsZV95ID0gY29udGV4dC5jYW52YXMuaGVpZ2h0IC8gMjtcblxuICAgICAgICBsZXQgcGxhbmV0X21pZGRsZV94ID0gbWlkZGxlX3ggKyB0aGlzLmxvY2F0aW9uLnggKiBESVNUQU5DRV9GQUNUT1I7XG4gICAgICAgIGxldCBwbGFuZXRfbWlkZGxlX3kgPSBtaWRkbGVfeSArIHRoaXMubG9jYXRpb24ueSAqIERJU1RBTkNFX0ZBQ1RPUjtcbiAgICAgICAgbGV0IHBsYW5ldF9yYWRpdXNfcHggPSBNYXRoLmxvZyh0aGlzLm1hc3MpICogTWF0aC5MT0cxMEUgKiBNQVNTX0ZBQ1RPUjtcblxuICAgICAgICAvLyBEcmF3IHRoZSBwbGFuZXQuXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQuYXJjKFxuICAgICAgICAgICAgcGxhbmV0X21pZGRsZV94LFxuICAgICAgICAgICAgcGxhbmV0X21pZGRsZV95LFxuICAgICAgICAgICAgcGxhbmV0X3JhZGl1c19weCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAyICogTWF0aC5QSSxcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5jb2xvciB8fCAnd2hpdGUnO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSAzO1xuICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgIC8vIERyYXcgdGhlIHBsYW5ldCBuYW1lLlxuICAgICAgICBjb250ZXh0LmZvbnQgPSBcIjE4cHggQXJpYWxcIjtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgICBjb250ZXh0LmZpbGxUZXh0KFxuICAgICAgICAgICAgdGhpcy5uYW1lLFxuICAgICAgICAgICAgcGxhbmV0X21pZGRsZV94IC0gcGxhbmV0X3JhZGl1c19weCAqIDEuMyxcbiAgICAgICAgICAgIHBsYW5ldF9taWRkbGVfeSArIHBsYW5ldF9yYWRpdXNfcHggKiAyLjUsXG4gICAgICAgICk7XG4gICAgfVxufSIsIi8qKlxuICogUmVwcmVzc2VudHMgc29tZSBwb2ludCBhcyAoeCwgeSkuXG4gKi9cbmV4cG9ydCBjbGFzcyBQb2ludCB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgUG9pbnRcbiAgICAgKiBAcGFyYW0geCBUaGUgZmlyc3QgYXhpcyBvZiB0aGUgY29vcmRpbmF0ZS5cbiAgICAgKiBAcGFyYW0geSBUaGUgc2Vjb25kIGF4aXMgb2YgdGhlIGNvb3JkaW5hdGUuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG59Il19
