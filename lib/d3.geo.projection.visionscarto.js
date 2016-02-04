var visionscarto_bertin_1953_alpha1 = function (λ, φ) {
	var c = 
	{
		polar: true,
		polarbar: 38 * Math.PI/180,
		southamerica: true,
		oceania: true,
		shrinksouthamerica: 0.13,
		shrinkoceania: 0.03,
		southasia: true,
	}

	// Some clients such as phantomjs don't know hyperbolic functions
	if (typeof Math.tanh === 'undefined') {
		Math.sinh = function(x) { return 0.5 * (Math.exp(x) - Math.exp(-x)); }
		Math.cosh = function(x) { return 0.5 * (Math.exp(x) + Math.exp(-x)); }
		Math.tanh = function(x) { return Math.sinh(x) / Math.cosh(x); }
	}

	// angle depuis le pole nord
    var d = Math.PI/2 - φ;

	// theta : chemin sur la courbe qui sera suivie à la fin
	// var theta = λ; // cercle
	var theta = λ * Math.sin(d) / d; // projection pure

	var jump = 0, bar;

	// compensation polaire
	if (c.polar) {
		bar = Math.PI - c.polarbar;

		factor = Math.max(0, Math.min(1, 0.5 + 0.55 * Math.tanh(10*(1-d))));

		// cote Russie
		if (λ > bar)
			jump += factor*(λ - theta) * (λ - bar) / c.polarbar;
		// cote Alaska
		else if (λ < -bar)
			jump -= factor*(λ - theta) * (λ + bar) / c.polarbar;
	}

	// compensation régionale Amérique du Sud
	if (c.southamerica) {
		var λ1 = -0.74, d1 = 1.15, λ0 = λ1;
		if (d > d1 && λ < λ1 && theta < -0.22) {
			jump += λ0 * (Math.sin(d1)/d1 - Math.sin(d)/d);
			jump += c.shrinksouthamerica * (λ - λ0) * (d - d1);
			d -= c.shrinksouthamerica * (d - d1);
		}
	}


	// compensation régionale Inde
	if (c.oceania) {
		var λ1 = 0.8, d1 = 1.1;
		if (d > d1 && λ > λ1 && theta > 0.30) {
			λ0 = λ1 - 0.45;
			if (λ > 1.3) λ0 = λ1+0.1;
			jump += λ0 * (Math.sin(d1)/d1 - Math.sin(d)/d);
			jump += c.shrinkoceania * (λ - λ0) * (d - d1);
			d -= c.shrinkoceania * (d - d1);
		}
	}


	// compensation régionale Asie du Sud
	if (c.southasia) {
		factor = Math.max(0, Math.min(1, 0.5 + 0.55 * Math.tanh(6*(d-1))));
		bar = Math.PI * 110 / 180;
		if (d > 0 && λ > bar) {
			d += factor * 0.18 * (λ - bar)
		}
	}

	// suivre le cercle
    var x = d * Math.sin( theta + jump );
    var y = -d * Math.cos( theta + jump );

    return [x, y];
};

(d3.geo.visionscarto_bertin_1953_alpha1 = function() {
	return d3.geo.projection(visionscarto_bertin_1953_alpha1)
	.rotate([-14.5,7,0])
    .clipAngle(180 + 1e-6);
}).raw = visionscarto_bertin_1953_alpha1;

d3.geo.visionscarto = d3.geo.visionscarto_bertin_1953_alpha1;
