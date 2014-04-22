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

Vector.prototype.invertX = function () {
  return new Vector(this.x * -1, this.y);
};

Vector.prototype.invertX = function () {
  return new Vector(this.x, this.y * -1);
};

var GravitationalConstant = 6.674e-8;

var gravity = function Gravity(planet1, planet2) {
  var gravitation =
    (GravitationalConstant * planet1.mass * planet2.mass) /
    Math.pow(planet1.position.distance(planet2.position), 2);
  return planet2.position.subtract(planet1.position)
    .normalize()
    .scale(gravitation);
};

var Planet = function (mass, position, velocity, radius, color) {
  this.$node = $("<div class='planet'></div>");
  this.radius = radius || 10;
  this.color = color || "orange";
  this.$node.css({
    "border-radius": this.radius,
    "color": this.color,
  });

  // Internal math stuff
  this.mass = mass === undefined ? 1e18 : mass;
  this.position =
    position || new Vector(Math.random() * 1000000,
                           Math.random() * 1000000);
  this.velocity =
    velocity || new Vector((Math.random() - 0.5) * 800,
                           (Math.random() - 0.5) * 800);
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

  this.boundsCheck();
};

Planet.prototype.updatePosition = function () {
  this.position = this.position.add(this.velocity.scale(TIME));
};

var ScaleFactor = 0.001;

Planet.prototype.boundsCheck = function () {
  // Check x bounds
  if (this.position.x * ScaleFactor >= $(window).width() - this.radius - 20) {
    this.velocity.x = -Math.abs(this.velocity.x);
  } else if (this.position.x * ScaleFactor <= 20 + this.radius) {
    this.velocity.x = Math.abs(this.velocity.x);
  }

  // Check y bounds
  if (this.position.y * ScaleFactor >= $(window).height() - this.radius - 20) {
    this.velocity.y = -Math.abs(this.velocity.y);
  } else if (this.position.y * ScaleFactor <= 20 + this.radius) {
    this.velocity.y = Math.abs(this.velocity.y);
  }
};

Planet.prototype.render = function (maxWidth, maxHeight) {
  var styleSettings = {
    "border-radius": this.radius,
    "background-color": this.color,
    top: Math.min(maxHeight - this.radius * 2, (this.position.y * ScaleFactor) - this.radius),
    left: Math.min(maxWidth - this.radius * 2, (this.position.x * ScaleFactor) - this.radius),
    width: this.radius * 2,
    height: this.radius * 2
  };
  this.$node.css(styleSettings);
};
