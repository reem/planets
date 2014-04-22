var TIME = TIME;
var _ = _;
var $ = $;

var Vector = function (x, y) {
  this.x = x;
  this.y = y;
};

Vector.prototype.magnitude = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.scale = function (scalar) {
  return new Vector(scalar * this.x, scalar * this.y);
};

Vector.prototype.add = function (other) {
  return new Vector(this.x + other.x, this.y + other.y);
};

Vector.prototype.normalize = function () {
  return this.scale(1 / this.magnitude());
};

Vector.prototype.subtract = function (other) {
  return this.add(other.scale(-1));
};

Vector.prototype.distance = function (other) {
  return this.subtract(other).magnitude();
};

Vector.prototype.isEqual = function (other) {
  return this.x === other.x && this.y === other.y;
};

var GravitationalConstant = 6.674e-11;

var gravity = function Gravity(planet1, planet2) {
  var gravitation =
    (GravitationalConstant * planet1.mass * planet2.mass) /
    Math.pow(planet1.position.distance(planet2.position), 2);
  return planet2.position.subtract(planet1.position)
    .normalize()
    .scale(gravitation);
};

var Planet = function (mass, position, velocity, radius, color) { // Fill in args later.
  // Display properties
  this.$node = $("<div class='planet'></div>");
  this.radius = radius || 10;
  this.color = color || "orange";
  this.$node.css({
    "border-radius": this.radius,
    "color": this.color,
  });

  // Internal math stuff
  this.mass = mass === undefined ? 1e17 : mass;
  this.position =
    position || new Vector(Math.random() * 1000000000,
                           Math.random() * 1000000000);
  this.velocity =
    velocity || new Vector((Math.random() - 0.5) * 400,
                           (Math.random() - 0.5) * 400);
  Planet.planets.push(this);
  this.$node.appendTo($(document.body));
};

Planet.planets = [];

Planet.prototype.updateVelocity = function () {
  var gravityVectors = [];
  _.each(Planet.planets, function (planet) {
    if (this === planet) { return; }
    gravityVectors.push(gravity(this, planet));
  }, this);
  this.velocity = _.reduce(gravityVectors,
    function (memo, gravVector) {
      return memo.add(gravVector.scale(TIME/this.mass));
    },
  this.velocity, this);
};

Planet.prototype.updatePosition = function () {
  this.position = this.position.add(this.velocity.scale(TIME));
};

var ScaleFactor = 0.000001;

Planet.prototype.render = function () {
  var styleSettings = {
    "border-radius": this.radius,
    "background-color": this.color,
    top: (this.position.y * ScaleFactor) - this.radius,
    left: (this.position.x * ScaleFactor) - this.radius,
    width: this.radius * 2,
    height: this.radius * 2
  };
  debugger;
  this.$node.css(styleSettings);
};
