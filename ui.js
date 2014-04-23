var $ = $;
var _ = _;
var Planet = Planet;
var TimeStream = TimeStream;

var times = function (n, callback) {
  for (var i = 0; i < n; i++) {
    callback();
  }
};

var UI = function () {
  this.time = new TimeStream();
  this.intervalID = null;
};

UI.prototype.run = function () {
  var that = this;
  this.time.stepTime();
  _.invoke(Planet.planets, "render", $(window).width(), $(window).height());
  this.intervalID = window.requestAnimationFrame(function () {
    that.run();
  });
};

UI.prototype.addPlanet = function (mass, position, velocity, radius, color) {
  //new Planet(mass, position, velocity, radius, color);
  new Planet(mass, position, velocity, radius, color);
};

$(document).ready(function () {
  var ui = new UI();
  times(100, function () { ui.addPlanet(undefined, undefined, undefined,
                                      Math.pow(Math.random(), 3) * 5 + 4); });

  ui.run();
});
