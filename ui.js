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
  this.intervalID = setInterval(function () {
    that.time.stepTime();
    _.invoke(Planet.planets, "render", $(window).width(), $(window).height());
  }, 17);
};

UI.prototype.addPlanet = function (mass, position, radius, color, velocity) {
  //new Planet(mass, position, velocity, radius, color);
  new Planet();
};

$(document).ready(function () {
  var ui = new UI();
  times(100, function () { ui.addPlanet(); });

  ui.run();
});
