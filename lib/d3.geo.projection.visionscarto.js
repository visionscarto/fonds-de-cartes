d3.geoBertin1953Raw_alpha3 = function(lambda, phi) {
    // import from math
    var sin = Math.sin, cos = Math.cos, pi = Math.PI;
    var degrees = 180 / pi;

    // import from d3-geo-projection
    var hammerRaw = d3.geo ? d3.geo.hammer.raw : d3.geoHammerRaw;
    var hammer = hammerRaw(1.68, 2);

    var fu = 1.4;
    if (lambda + phi < -fu) {
      var u = (lambda - phi + 1.6) * (lambda + phi + fu) / 8;
      lambda += u;
      phi -= 0.8 * u * sin(phi + pi / 2);
    }

    var r = hammer(lambda, phi);

    var k = 12, d = (1 - cos(lambda * phi)) / k;

    if (r[1] < 0) {
      r[0] *= 1 + d;
    }
    if (r[1] > 0) {
      r[1] *= 1 + d / 1.5 * r[0] * r[0];
    }

    return r;
  };

  d3.geoBertin1953 = function() {
    if (typeof geoInverse == "function")
      d3.geoBertin1953Raw_alpha3.invert = geoInverse(
        d3.geoBertin1953Raw_alpha3,
        0.01,
        d3.geoRobinsonRaw.invert
      );
    var geoProjection = d3.geoProjection ? d3.geoProjection : d3.geo.projection;
    return geoProjection(d3.geoBertin1953Raw_alpha3)
      .rotate([-16.5, -42]);
  };
  
// compatibilité d3v3
if (d3.geo) {
	d3.geo.visionscarto = d3.geoVisionscarto;
	d3.geo.visionscarto.raw = visionscarto_bertin_1953_alpha3;
}