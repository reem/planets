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

// Vector.prototype.modularDifference = function (other, widthModulus, heightModulus) {
//   return new Vector(
//     _.min([other.x - this.x,
//            other.x + widthModulus - this.x,
//            other.x - widthModulus - this.x],
//            Math.abs),
//     _.min([other.y - this.y,
//            other.y + heightModulus - this.y,
//            other.y - heightModulus - this.y],
//            Math.abs)
//   );
// };

// Vector.prototype.modularDistance = function (other, widthModulus, heightModulus) {
//   return this.modularDifference(other, widthModulus, heightModulus).magnitude();
// };

Vector.prototype.isEqual = function (other) {
  return this.x === other.x && this.y === other.y;
};

Vector.prototype.invertX = function () {
  return new Vector(this.x * -1, this.y);
};

Vector.prototype.invertX = function () {
  return new Vector(this.x, this.y * -1);
};

Vector.prototype.invert = function () {
  return this.scale(-1);
};

Vector.prototype.dotProduct = function (other) {
  return (this.x * other.x) + (this.y * other.y);
};

var GravitationalConstant = 9e-3;

var windowWidth = $(window).width();
var windowHeight = $(window).height();

var gravity = function Gravity(planet1, planet2) {
  var gravitation =
    (GravitationalConstant * planet1.mass * planet2.mass) /
    Math.pow(planet1.position.distance(planet2.position,
      windowWidth / ScaleFactor, windowHeight / ScaleFactor)
    , 2);
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
  this.mass = mass === undefined ? 1e16 : mass;
  this.position =
    position || new Vector(Math.random() * 9500000,
                           Math.random() * 9500000);
  this.velocity =
    velocity || new Vector(0, 0);
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

  this.collisionCheck();

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

var ScaleFactor = 0.0001;

Planet.prototype.boundsCheck = function () {
  // Check x bounds
  if (this.position.x * ScaleFactor >= $(window).width() - this.radius - 20) {
    this.velocity.x = -Math.abs(this.velocity.x);
  } else if (this.position.x * ScaleFactor <= this.radius + 20) {
    this.velocity.x = Math.abs(this.velocity.x);
  }

  // Check y bounds
  if (this.position.y * ScaleFactor >= $(window).height() - this.radius - 20) {
    this.velocity.y = -Math.abs(this.velocity.y);
  } else if (this.position.y * ScaleFactor <= this.radius + 20) {
    this.velocity.y = Math.abs(this.velocity.y);
  }
};

Planet.prototype.collisionCheck = function () {
  _.each(Planet.planets, function (other) {
    if (this.position.distance(other.position) * ScaleFactor <
        this.radius + other.radius) {
      var sepUnit = other.position.subtract(this.position)
        .normalize();
      var thisVelocityCompMag = this.velocity.dotProduct(sepUnit);
      var otherVelocityCompMag = other.velocity.dotProduct(sepUnit);
      if (thisVelocityCompMag > otherVelocityCompMag) {
        var thisVelocityComp = sepUnit.scale(thisVelocityCompMag);
        var otherVelocityComp = sepUnit.scale(otherVelocityCompMag);
        this.velocity = this.velocity.subtract(thisVelocityComp)
          .add((otherVelocityComp).scale(1));
        other.velocity = other.velocity.subtract(otherVelocityComp)
          .add((thisVelocityComp).scale(1));
      }
    }
  }, this);
};

Planet.prototype.render = function (maxWidth, maxHeight) {
  var styleSettings = {
    "border-radius": this.radius,
    "background-color": this.color,
    top: Math.min(maxHeight - this.radius, (this.position.y * ScaleFactor) - this.radius),
    left: Math.min(maxWidth - this.radius, (this.position.x * ScaleFactor) - this.radius),
    width: this.radius * 2,
    height: this.radius * 2
  };
  this.$node.css(styleSettings);
};
