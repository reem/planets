var _ = _;
var TIME = 0.3;

var TimeStream = function () {};

TimeStream.prototype.stepTime = function () {
  this.updateVelocities();
  this.updatePositions();
};

TimeStream.prototype.updateVelocities = function () {
  _.invoke(Planet.planets, "computeVelocityChange");
  _.invoke(Planet.planets, "updateVelocity");
};

TimeStream.prototype.updatePositions = function () {
  _.invoke(Planet.planets, "updatePosition");
};
