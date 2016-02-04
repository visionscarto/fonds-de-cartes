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
	function th(d) {
		return Math.sin(d) / d;
	}
	function thprime(d) {
		return (Math.cos(d) - Math.sin(d)/d)/d;
	}
	// var theta = λ; // cercle
	var theta = λ * th(d);

	var jump = 0, DEG = Math.PI/180;

	// compensation polaire
	if (c.polar) {
		var bar = Math.PI - c.polarbar;
		factor = Math.max(0, Math.min(1, 0.5 + 0.55 * Math.tanh(10*(1-d))));
		// cote Russie
		if (λ > bar)
			jump += 0.8*factor*(λ - theta) * (λ - bar) / c.polarbar;
		// cote Alaska
		else if (λ < -bar)
			jump -= 1.2*factor*(λ - theta) * (λ + bar) / c.polarbar;
	}

	// compensation régionale Amérique du Sud
	if (c.southamerica) {
		var λ1 = -44.7 * DEG, d1 = (90-24)*DEG, λ0 = -90*DEG;
		if (d > d1 && λ < λ1 && theta < -0.22) {
			jump += λ0 * (th(d1) - th(d))
				+ λ0 * d1 * (d - d1) * thprime(d1) / 2;
			jump += c.shrinksouthamerica * 0.4 * (λ - λ1) * (d - d1);
			d -= c.shrinksouthamerica * (d - d1);
		}
	}


	// compensation régionale Inde / Océanie
	if (c.india) {
		var λ1 = 51*DEG, d1 = (90-22)*DEG, λ0 = 72*DEG;
		if (d > d1 && λ > λ1 && theta > 0.30) {
			jump += λ0 * (th(d1) - th(d))
				+ λ0 * d1 * (d - d1) * thprime(d1) / 2;
		}
	}

	if (c.oceania) {
		var λ1 = 70*DEG, d1 = (90-1.2)*DEG, λ0 = 145*DEG;
		if (d > d1 && λ > λ1 && theta > 0.30) {
			jump += λ0 * (th(d1) - th(d))
				+ λ0 * d1 * (d - d1) * thprime(d1) / 2;

			jump += c.shrinkoceania * 0.4 * (λ - λ1) * (d - d1);
			d -= c.shrinkoceania * (d - d1);

		}

	}


	// suivre le cercle
    var x = d * Math.sin( theta + jump );
    var y = -d * Math.cos( theta + jump );

    //return [d * (theta+jump),-d];

    return [x,y];
};

(d3.geo.visionscarto_bertin_1953_alpha1 = function() {
	return d3.geo.projection(visionscarto_bertin_1953_alpha1)
	.rotate([-14.5,7,0])
    .clipAngle(180 + 1e-6);
}).raw = visionscarto_bertin_1953_alpha1;

d3.geo.visionscarto = d3.geo.visionscarto_bertin_1953_alpha1;
