var visionscarto_bertin_1953_alpha1 = function (λ, φ) {
	var c = 
	{
		polar: true,
		polarbar: 38 * Math.PI/180,
		southamerica: true,
		india: true,
		oceania: true,
		shrinksouthamerica: 0.13,
		shrinkoceania: 0.08,
		southasia: false,
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

	var jump = 0, bar, DEG = Math.PI/180;

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
		var λ1 = -44.7 * DEG, d1 = 1.15, λ0 = -71*DEG;
		if (d > d1 && λ < λ1 && theta < -0.22) {
			jump += λ0 * (Math.sin(d1)/d1 - Math.sin(d)/d);

			jump += 0.5 * Math.cos(λ0) * (d-d1);

			jump += c.shrinksouthamerica * 0.4 * (λ - λ1) * (d - d1);
			d -= c.shrinksouthamerica * (d - d1);
		}
	}


	// compensation régionale Inde / Océanie
	if (c.india) {
		var λ1 = 52*DEG, d1 = 1.0, λ0 = 55*DEG;
		if (d > d1 && λ > λ1 && theta > 0.30) {
			jump += λ0 * (Math.sin(d1)/d1 - Math.sin(d)/d);
			jump -= 0.5 * Math.cos(λ0) * (d-d1);
		}
	}

	if (c.oceania) {
		var λ1 = 73*DEG, d1 = 1.5, λ0 = 120*DEG;
		if (d > d1 && λ > λ1 && theta > 0.30) {
			jump += λ0 * (Math.sin(d1)/d1 - Math.sin(d)/d);
			jump -= 0.4 * (d-d1);
		}

	}


	// suivre le cercle
    var x = d * Math.sin( theta + jump );
    var y = -d * Math.cos( theta + jump );

    return [x,y];
};

(d3.geo.visionscarto_bertin_1953_alpha1 = function() {
	return d3.geo.projection(visionscarto_bertin_1953_alpha1)
	.rotate([-14.5,7,0])
    .clipAngle(180 + 1e-6);
}).raw = visionscarto_bertin_1953_alpha1;

d3.geo.visionscarto = d3.geo.visionscarto_bertin_1953_alpha1;
