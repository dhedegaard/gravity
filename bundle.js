(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.DISTANCE_FACTOR = 2 * Math.pow(10, -9);

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var planet_1 = require("./planet");
var utils_1 = require("./utils");
var planets = [
    new planet_1.Planet("Sun", 1.989 * Math.pow(10, 30), new utils_1.Point(0, 0), "yellow"),
    new planet_1.Planet("Earth", 5.972 * Math.pow(10, 24), new utils_1.Point(149.6 * Math.pow(10, 9), 0), "green"),
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
    }, 0);
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
    canvas.width = container.clientWidth - 10;
    canvas.height = window.innerHeight - 10;
    canvas.style.border = "1px solid black";
    // Add the canvas and fetch the context.
    container.appendChild(canvas);
    context = canvas.getContext('2d');
    main();
});

},{"./planet":3,"./utils":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    function Planet(name, mass, location, color) {
        this.name = name;
        this.mass = mass;
        this.location = location;
        this.acc_vector = new utils_1.Point(0, 0);
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
        this.location.x += this.acc_vector.x * Math.pow(10, 7);
        this.location.y += this.acc_vector.y * Math.pow(10, 7);
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
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uc3RhbnRzLnRzIiwic3JjL21haW4udHMiLCJzcmMvcGxhbmV0LnRzIiwic3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7R0FFRztBQUNVLFFBQUEsbUJBQW1CLEdBQUcsT0FBTyxHQUFHLFNBQUEsRUFBRSxFQUFJLENBQUMsRUFBRSxDQUFBLENBQUM7QUFDdkQ7O0dBRUc7QUFDVSxRQUFBLFdBQVcsR0FBRyxHQUFHLENBQUM7QUFDL0I7O0dBRUc7QUFDVSxRQUFBLGVBQWUsR0FBRyxDQUFDLEdBQUcsU0FBQSxFQUFFLEVBQUksQ0FBQyxDQUFDLENBQUEsQ0FBQzs7Ozs7QUNYNUMsbUNBQWtDO0FBQ2xDLGlDQUFnQztBQUVoQyxJQUFJLE9BQU8sR0FBbUI7SUFDMUIsSUFBSSxlQUFNLENBQ04sS0FBSyxFQUNMLEtBQUssR0FBRyxTQUFBLEVBQUUsRUFBSSxFQUFFLENBQUEsRUFDaEIsSUFBSSxhQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUNmLFFBQVEsQ0FDWDtJQUNELElBQUksZUFBTSxDQUNOLE9BQU8sRUFDUCxLQUFLLEdBQUcsU0FBQSxFQUFFLEVBQUksRUFBRSxDQUFBLEVBQ2hCLElBQUksYUFBSyxDQUFDLEtBQUssR0FBRyxTQUFBLEVBQUUsRUFBSSxDQUFDLENBQUEsRUFBRSxDQUFDLENBQUMsRUFDN0IsT0FBTyxDQUNWO0NBQ0osQ0FBQztBQUVGLElBQUksTUFBMEIsQ0FBQztBQUMvQixJQUFJLE9BQWlDLENBQUM7QUFFdEM7SUFDSSxvQkFBb0I7SUFDcEIsT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7SUFDNUIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7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dXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBBbiBlc3RpbWF0aW9uIG9mIHRoZSBncmF2aXRhdGlvbmFsIGNvbnN0YW50XG4gKi9cbmV4cG9ydCBjb25zdCBHUkFWSVRBVElPTkFMX0NPTlNUID0gNi42NzQwOCAqIDEwICoqIC0xMTtcbi8qKlxuICogU2NhbGVzIGFsbCByZW5kZXJpbmcgb2YgbWFzcyBmcm9tIHBsYW5ldHMgYWNjb3JkaW5nIHRvIHRoaXMgZmFjdG9yLlxuICovXG5leHBvcnQgY29uc3QgTUFTU19GQUNUT1IgPSAwLjU7XG4vKipcbiAqIFNjYWxlcyBhbGwgZGlzdGFuY2VzIGJ5IHRoaXMgZmFjdG9yLlxuICovXG5leHBvcnQgY29uc3QgRElTVEFOQ0VfRkFDVE9SID0gMiAqIDEwICoqIC05O1xuIiwiaW1wb3J0IHsgUGxhbmV0IH0gZnJvbSBcIi4vcGxhbmV0XCI7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmxldCBwbGFuZXRzIDogQXJyYXk8UGxhbmV0PiA9IFtcbiAgICBuZXcgUGxhbmV0KFxuICAgICAgICBcIlN1blwiLFxuICAgICAgICAxLjk4OSAqIDEwICoqIDMwLFxuICAgICAgICBuZXcgUG9pbnQoMCwgMCksXG4gICAgICAgIFwieWVsbG93XCIsXG4gICAgKSxcbiAgICBuZXcgUGxhbmV0KFxuICAgICAgICBcIkVhcnRoXCIsXG4gICAgICAgIDUuOTcyICogMTAgKiogMjQsXG4gICAgICAgIG5ldyBQb2ludCgxNDkuNiAqIDEwICoqIDksIDApLFxuICAgICAgICBcImdyZWVuXCJcbiAgICApLFxuXTtcblxubGV0IGNhbnZhcyA6IEhUTUxDYW52YXNFbGVtZW50O1xubGV0IGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuZnVuY3Rpb24gbWFpbigpIHtcbiAgICAvLyBDbGVhciB0aGUgY2FudmFzLlxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJ3doaXRlJztcbiAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIGNvbnRleHQuY2FudmFzLndpZHRoLCBjb250ZXh0LmNhbnZhcy5oZWlnaHQpO1xuICAgIC8vIERyYXcgdGhlIHBsYW5ldHMuXG4gICAgZHJhd1BsYW5ldHMoKTtcbiAgICAvLyBDYWxjdWxhdGUgYW5kIGFwcGx5IGZvcmNlcy5cbiAgICBhcHBseUZvcmNlcygpO1xuICAgIC8vIERvIGl0IGFnYWluIDopXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgbWFpbigpO1xuICAgIH0sIDApO1xufVxuXG5mdW5jdGlvbiBkcmF3UGxhbmV0cygpIHtcbiAgICAvKiBEcmF3IGVhY2ggcGxhbmV0LiAqL1xuICAgIHBsYW5ldHMuZm9yRWFjaCgocGxhbmV0KSA9PiB7XG4gICAgICAgIHBsYW5ldC5kcmF3KGNvbnRleHQpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhcHBseUZvcmNlcygpIHtcbiAgICBwbGFuZXRzLmZvckVhY2goKHBsYW5ldCkgPT4ge1xuICAgICAgICBwbGFuZXRzLmZvckVhY2goKG90aGVyUGxhbmV0KSA9PiB7XG4gICAgICAgICAgICBpZiAocGxhbmV0ICE9IG90aGVyUGxhbmV0KSB7XG4gICAgICAgICAgICAgICAgcGxhbmV0LmFwcGx5Rm9yY2Uob3RoZXJQbGFuZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuLyogSGFuZGxlIHNldHRpbmcgdGhlIGNvbnRleHQgdmFyaWFibGUgdG8gc29tZXRoaW5nIHJlYXNvbmFibGUuICovXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lclwiKSBhcyBIVE1MRGl2RWxlbWVudDtcblxuICAgIC8vIENyZWF0ZSB0aGUgY2FudmFzIGVsZW1lbnQgYW5kIHNldCB3aWR0aC9oZWlnaHQuXG4gICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICBjYW52YXMud2lkdGggPSBjb250YWluZXIuY2xpZW50V2lkdGggLSAxMDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0IC0gMTA7XG4gICAgY2FudmFzLnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkIGJsYWNrXCI7XG5cbiAgICAvLyBBZGQgdGhlIGNhbnZhcyBhbmQgZmV0Y2ggdGhlIGNvbnRleHQuXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgbWFpbigpO1xufSk7IiwiaW1wb3J0IHsgUG9pbnQgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHtcbiAgICBNQVNTX0ZBQ1RPUixcbiAgICBESVNUQU5DRV9GQUNUT1IsXG4gICAgR1JBVklUQVRJT05BTF9DT05TVCxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5cbmV4cG9ydCBjbGFzcyBQbGFuZXQge1xuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcbiAgICByZWFkb25seSBtYXNzOiBudW1iZXI7XG4gICAgcmVhZG9ubHkgY29sb3I6IHN0cmluZztcbiAgICBsb2NhdGlvbjogUG9pbnQ7XG4gICAgYWNjX3ZlY3RvcjogUG9pbnQ7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IHBsYW5ldCB3aXRoIHNvbWUgZ2l2ZW4gZGF0YS5cbiAgICAgKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgcGxhbmV0XG4gICAgICogQHBhcmFtIG1hc3MgVGhlIG1hc3Mgb2YgdGhlIHBsYW5ldFxuICAgICAqIEBwYXJhbSBsb2NhdGlvbiBUaGUgY3VycmVudCBsb2NhdGlvbiBvZiB0aGUgcGxhbmV0XG4gICAgICogQHBhcmFtIGNvbG9yIEFuIG9wdGlvbmFsIGNvbG9yIHVzZWQgZm9yIHJlbmRlcmluZyB0aGUgcGxhbmV0XG4gICAgICovXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBtYXNzOiBudW1iZXIsIGxvY2F0aW9uOiBQb2ludCwgY29sb3I/OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5tYXNzID0gbWFzcztcbiAgICAgICAgdGhpcy5sb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgICAgICB0aGlzLmFjY192ZWN0b3IgPSBuZXcgUG9pbnQoMCwgMCk7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvciB8fCBcImdyZWVuXCI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXBwbGllcyB0aGUgZm9yY2UgZnJvbSBhIGdpdmVuIHBsYW5ldCBhZ2FpbnN0IHRoaXMgb25lLlxuICAgICAqIENoYW5naW5nIHRoaXMgcGxhbmV0cyBkaXJlY3Rpb24gYW5kIHNwZWVkIGFjY29yZGluZ2x5LlxuICAgICAqIEBwYXJhbSBwbGFuZXQgVGhlIHBsYW5ldCB0byBhcHBseSB0aGUgZm9yY2UgZnJvbS5cbiAgICAgKi9cbiAgICBhcHBseUZvcmNlKHBsYW5ldDogUGxhbmV0KSB7XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgdmVjdG9yIGZyb20gdGhpcyAtPiBwbGFuZXQuXG4gICAgICAgIGxldCBkZWx0YV94ID0gcGxhbmV0LmxvY2F0aW9uLnggLSB0aGlzLmxvY2F0aW9uLng7XG4gICAgICAgIGxldCBkZWx0YV95ID0gcGxhbmV0LmxvY2F0aW9uLnkgLSB0aGlzLmxvY2F0aW9uLnk7XG5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBjdXJyZW50IGRpc3RhbmNlIGJldHdlZW4gdGhlIHBsYW5ldHMuXG4gICAgICAgIC8vIFB5dGhhZ29yYXMuXG4gICAgICAgIGxldCBkaXN0YW5jZSA9IE1hdGguc3FydChcbiAgICAgICAgICAgIE1hdGguYWJzKGRlbHRhX3gpICoqIDIgK1xuICAgICAgICAgICAgTWF0aC5hYnMoZGVsdGFfeSkgKiogMik7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBmb3JjZSBiZXR3ZWVuIHRoZSBwbGFuZXRzLlxuICAgICAgICAvLyBOZXd0b24ncyBsYXcgb2YgdW5pdmVyYWwgZ3Jhdml0YXRpb25cbiAgICAgICAgbGV0IGZvcmNlID0gKFxuICAgICAgICAgICAgR1JBVklUQVRJT05BTF9DT05TVCAqXG4gICAgICAgICAgICAodGhpcy5tYXNzICogcGxhbmV0Lm1hc3MpIC8gZGlzdGFuY2UgKiogMik7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBhY2NlbGVyYXRpb24gdG8gYXBwbHkgYmFzZWQgb24gdGhlIGZvcmNlIGFuZCB0aGUgbWFzcy5cbiAgICAgICAgLy8gTmV3dG9uJ3Mgc2Vjb25kIGxhdy5cbiAgICAgICAgbGV0IGFjY2VsZXJhdGlvbiA9IGZvcmNlIC8gdGhpcy5tYXNzO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBhbmQgYXBwbHl0aGUgbmV3IGFjY2VsZXJhdGlvbiB2ZWN0b3IgdG8gYXBwbHkgYmFzZWQgb24gdGhlXG4gICAgICAgIC8vIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgbmV3bHkgY2FsY3VsYXRlZCBhY2NlbGVyYXRpb24gYW5kIHRoZVxuICAgICAgICAvLyBjdXJyZW5jdCB2ZWN0b3IgYmV0d2VlbiB0aGlzIGFuZCBwbGFuZXQuXG4gICAgICAgIHRoaXMuYWNjX3ZlY3Rvci54ICs9IGFjY2VsZXJhdGlvbiAvIGRpc3RhbmNlICogZGVsdGFfeDtcbiAgICAgICAgdGhpcy5hY2NfdmVjdG9yLnkgKz0gYWNjZWxlcmF0aW9uIC8gZGlzdGFuY2UgKiBkZWx0YV95O1xuXG4gICAgICAgIC8vIFRPRE86IEFwcGx5IG5vbi11bmlmb3JtIGFjY2VsZXJhdGlvbi5cbiAgICAgICAgLy8gRm9yIG5vdyBpIHVzZSBhIGR1bW15aW1wbGVtZW50YXRpb24gZm9yIHNpbXBseSBkb2luZyBzb21ldGhpbmcuXG4gICAgICAgIHRoaXMubG9jYXRpb24ueCArPSB0aGlzLmFjY192ZWN0b3IueCAqIDEwICoqIDc7XG4gICAgICAgIHRoaXMubG9jYXRpb24ueSArPSB0aGlzLmFjY192ZWN0b3IueSAqIDEwICoqIDc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyBkcmF3aW5nIHRoZSBjdXJyZW50IHBsYW5ldCBvbiB0aGUgY2FudmFzIGNvbnRleHQgc3VwcGxpZWQuXG4gICAgICogQHBhcmFtIGNvbnRleHQgQSBjYW52YXMgY29udGV4dCB0aGF0IGFsbG93cyBkcmF3aW5nLlxuICAgICAqL1xuICAgIGRyYXcoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgICAgIGxldCBtaWRkbGVfeCA9IGNvbnRleHQuY2FudmFzLndpZHRoIC8gMjtcbiAgICAgICAgbGV0IG1pZGRsZV95ID0gY29udGV4dC5jYW52YXMuaGVpZ2h0IC8gMjtcblxuICAgICAgICBsZXQgcGxhbmV0X21pZGRsZV94ID0gbWlkZGxlX3ggKyB0aGlzLmxvY2F0aW9uLnggKiBESVNUQU5DRV9GQUNUT1I7XG4gICAgICAgIGxldCBwbGFuZXRfbWlkZGxlX3kgPSBtaWRkbGVfeSArIHRoaXMubG9jYXRpb24ueSAqIERJU1RBTkNFX0ZBQ1RPUjtcbiAgICAgICAgbGV0IHBsYW5ldF9yYWRpdXNfcHggPSBNYXRoLmxvZyh0aGlzLm1hc3MpICogTWF0aC5MT0cxMEUgKiBNQVNTX0ZBQ1RPUjtcblxuICAgICAgICAvLyBEcmF3IHRoZSBwbGFuZXQuXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQuYXJjKFxuICAgICAgICAgICAgcGxhbmV0X21pZGRsZV94LFxuICAgICAgICAgICAgcGxhbmV0X21pZGRsZV95LFxuICAgICAgICAgICAgcGxhbmV0X3JhZGl1c19weCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAyICogTWF0aC5QSSxcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5jb2xvciB8fCAnd2hpdGUnO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSAzO1xuICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuXG4gICAgICAgIC8vIERyYXcgdGhlIHBsYW5ldCBuYW1lLlxuICAgICAgICBjb250ZXh0LmZvbnQgPSBcIjE4cHggQXJpYWxcIjtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgICBjb250ZXh0LmZpbGxUZXh0KFxuICAgICAgICAgICAgdGhpcy5uYW1lLFxuICAgICAgICAgICAgcGxhbmV0X21pZGRsZV94IC0gcGxhbmV0X3JhZGl1c19weCAqIDEuMyxcbiAgICAgICAgICAgIHBsYW5ldF9taWRkbGVfeSArIHBsYW5ldF9yYWRpdXNfcHggKiAyLjUsXG4gICAgICAgICk7XG4gICAgfVxufSIsIi8qKlxuICogUmVwcmVzc2VudHMgc29tZSBwb2ludCBhcyAoeCwgeSkuXG4gKi9cbmV4cG9ydCBjbGFzcyBQb2ludCB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgUG9pbnRcbiAgICAgKiBAcGFyYW0geCBUaGUgZmlyc3QgYXhpcyBvZiB0aGUgY29vcmRpbmF0ZS5cbiAgICAgKiBAcGFyYW0geSBUaGUgc2Vjb25kIGF4aXMgb2YgdGhlIGNvb3JkaW5hdGUuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG59Il19
