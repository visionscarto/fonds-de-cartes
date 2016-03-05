var c = {
    polar: true,
    polarbar: 38 * Math.PI / 180,
    southamerica: true,
    india: true,
    oceania: true,
    shrinksouthamerica: 0.13,
    southasia: false,
}

var DEG = Math.PI / 180;

var forward = function (λ, φ) {

    // Some clients such as phantomjs don't know hyperbolic functions
    if (typeof Math.tanh === 'undefined') {
        Math.sinh = function (x) {
            return 0.5 * (Math.exp(x) - Math.exp(-x));
        }
        Math.cosh = function (x) {
            return 0.5 * (Math.exp(x) + Math.exp(-x));
        }
        Math.tanh = function (x) {
            return Math.sinh(x) / Math.cosh(x);
        }
    }

    // angle depuis le pole nord
    var d = Math.PI / 2 - φ;

    // var theta = λ; // cercle
    var theta = λ * forward.th(d);

    var jump = 0;

    // compensation polaire
    if (c.polar) {
        var bar = Math.PI - c.polarbar;
        factor = Math.max(0, Math.min(1, 0.5 + 0.55 * Math.tanh(10 * (1 - d))));
        // cote Russie
        if (λ > bar)
            jump += 0.8 * factor * (λ - theta) * (λ - bar) / c.polarbar;
        // cote Alaska
        else if (λ < -bar)
            jump -= 1.2 * factor * (λ - theta) * (λ + bar) / c.polarbar;
    }

    // compensation régionale Amérique du Sud
    if (c.southamerica) {
        var λ1 = -44.7 * DEG,
            d1 = (90 - 24) * DEG,
            λ0 = -90 * DEG;
        if (d > d1 && λ < λ1 && theta < -0.22) {
            jump += λ0 * (forward.th(d1) - forward.th(d)) + λ0 * d1 * (d - d1) * forward.thprime(d1) / 2;
            jump += c.shrinksouthamerica * 0.4 * (λ - λ1) * (d - d1);
            d -= c.shrinksouthamerica * (d - d1);
        }
    }


    // compensation régionale Inde / Océanie
    if (c.india) {
        var λ1 = 51 * DEG,
            d1 = (90 - 22) * DEG,
            λ0 = 72 * DEG;
        if (d > d1 && λ > λ1 && theta > 0.30) {
            jump += λ0 * (forward.th(d1) - forward.th(d)) + λ0 * d1 * (d - d1) * forward.thprime(d1) / 2;
        }
    }

    if (c.oceania) {
        var λ1 = 70 * DEG,
            d1 = (90 - 1.2) * DEG,
            λ0 = 145 * DEG;
        if (d > d1 && λ > λ1 && theta > 0.30) {
            jump += λ0 * (forward.th(d1) - forward.th(d)) + λ0 * d1 * (d - d1) * forward.thprime(d1) / 2;
        }
    }


    // suivre le cercle
    var x = d * Math.sin(theta + jump);
    var y = -d * Math.cos(theta + jump);


    // make sure scalar(z,s) = 0
    if (true || c.oceania2) {
        var s = x + y;
        var z = [1, -1];
        var s1 = 0.9;
        if (s > s1) {
            var m = 0.3 * (1 - Math.cos(1 * (s1 - s)));
            x += z[0] * m;
            y += z[1] * m;
        }
    }

    //return [d * (theta+jump),-d];

    return [x, y];
};

// theta : chemin sur la courbe qui sera suivie à la fin
forward.th = function (d) {
    return Math.sin(d) / d;
}
forward.thprime = function (d) {
    return (Math.cos(d) - Math.sin(d) / d) / d;
}


forward.invert = function (x, y) {

    var d = Math.sqrt(x * x + y * y),
        thetaj = Math.asin(x / d);
    if (Math.cos(thetaj) * y > 0) {
        thetaj = Math.PI - thetaj;
    }

    var theta = thetaj;
    var λ = theta / forward.th(d);

    // compensation sud-americaine
    if (c.southamerica) {
        var λ1 = -44.7 * DEG,
            d1 = (90 - 24) * DEG,
            λ0 = -90 * DEG;

        if (d > d1 && λ < λ1) {
            theta -= λ0 * (forward.th(d1) - forward.th(d)) + λ0 * d1 * (d - d1) * forward.thprime(d1) / 2;
        }
    }

    // compensation régionale Inde / Océanie
    if (c.india) {
        var λ1 = 51 * DEG,
            d1 = (90 - 22) * DEG,
            λ0 = 72 * DEG;
        if (d > d1 && λ > λ1) {
            theta -= λ0 * (forward.th(d1) - forward.th(d)) + λ0 * d1 * (d - d1) * forward.thprime(d1) / 2;
        }
    }
    if (c.oceania) {
        var λ1 = 70 * DEG,
            d1 = (90 - 1.2) * DEG,
            λ0 = 145 * DEG;
        if (d > d1 && λ > λ1) {
            theta -= λ0 * (forward.th(d1) - forward.th(d)) + λ0 * d1 * (d - d1) * forward.thprime(d1) / 2;
        }
    }

    // TODO: shrinkoceania
    // TODO: shrinksouthamerica
    // TODO: Antartica

    λ = theta / forward.th(d);

    var φ = Math.PI / 2 - d;

    return [λ, φ];
};



(d3.geo.visionscarto_bertin_1953_alpha1 = function () {
    var projection = d3.geo.projection(forward)
        .rotate([-14.5, 7, 0])
        .clipAngle(180 + 1e-6);

    var stream_ = projection.stream;

    projection.stream_2 = function (stream) {
        var rotate = projection.rotate(),
            rotateStream = stream_(stream),
            sphereStream = (projection.rotate([0, 0]), stream_(stream));
        projection.rotate(rotate);
        rotateStream.sphere = function () {
            sphereStream.polygonStart();
            sphereStream.lineStart();
            //outline(sphereStream, root);
            sphereStream.lineEnd();
            sphereStream.polygonEnd();
        };
        return rotateStream;
    };
    return projection;
}).raw = forward;

d3.geo.visionscarto = d3.geo.visionscarto_bertin_1953_alpha1;