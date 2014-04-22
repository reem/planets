var $ = $;
var _ = _;
var Planet = Planet;
var TimeStream = TimeStream;

var times = function (n, callback) {
  for (var i = 0; i < n; i++) {
    callback();
  }
};

$(document).ready(function () {

  times(100, function () { new Planet(); });
  var time = new TimeStream();

  setInterval(function () {
    time.stepTime();
    _.invoke(Planet.planets, "render");
  }, 17);
});
