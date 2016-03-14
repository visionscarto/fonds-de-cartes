var visionscarto_bertin_1953_alpha2 = function (λ, φ) {

    if (λ + φ < -1.4) {
        var u = (λ - φ + 1.6) * (λ + φ + 1.4) / 8;
        λ += u;
        φ -= 0.6 * u;
    }

    var r = d3.geo.hammer.raw(1.68, 2)(λ, φ);

    var k = 12,
        d = (1 - Math.cos(λ * φ)) / k;

    if (r[1] < 0) {
        r[0] *= 1 + d;
    }
    if (r[1] > 0) {
        r[1] *= 1 + d / 1.5 * r[0] * r[0];
    }
    return r;
};

(d3.geo.visionscarto = (function () {
    return d3.geo.projection(visionscarto_bertin_1953_alpha2)
        .rotate([-16.5, -42])
        .clipAngle(180 + 1e-6);
})).raw = visionscarto_bertin_1953_alpha2;