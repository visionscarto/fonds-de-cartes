all: data fonds

fonds: bertin1953 robinson larrivee optim

data: init topo


### DATA
init:
	test -d build || mkdir build

topo:
	topojson --properties \
	--id-property id \
	--simplify 0.00001 -- data/countries.geojson > build/countries.topo.json
	topojson --properties \
	--id-property id \
	--projection 'd3.geo.visionscarto().translate([285,360])' \
	--simplify 0.7 -- data/countries.geojson > build/bertin1953.topo.json



### PROJECTIONS

bertin1953:
	./bin/screenshot.js http://localhost/maps/fonds-de-cartes/fond.html?projection=bertin1953 build/visionscarto-bertin1953

robinson:
	./bin/screenshot.js http://localhost/maps/fonds-de-cartes/fond.html?projection=robinson build/visionscarto-robinson

larrivee:
	./bin/screenshot.js http://localhost/maps/fonds-de-cartes/fond.html?projection=larrivee build/visionscarto-larrivee


### OPTIM
optim: optim-png optim-svg

optim-png:
	imageOptim -a -d build/

optim-svg:
	svgo --precision=2 --disable=removeUnknownsAndDefaults build/

