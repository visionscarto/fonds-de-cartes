all: data fonds

fonds: bertin1953 robinson winkel3 optim

fonds-bizarres: larrivee bottomley

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
	./bin/screenshot.js file://`pwd`/fond.html?projection=bertin1953 build/visionscarto-bertin1953 2

robinson:
	./bin/screenshot.js file://`pwd`/fond.html?projection=robinson build/visionscarto-robinson 2

larrivee:
	./bin/screenshot.js file://`pwd`/fond.html?projection=larrivee build/visionscarto-larrivee 2

bottomley:
	./bin/screenshot.js file://`pwd`/fond.html?projection=bottomley build/visionscarto-bottomley 2

winkel3:
	./bin/screenshot.js file://`pwd`/fond.html?projection=winkel3 build/visionscarto-winkel3 2


### OPTIM
optim: optim-png optim-svg

optim-png:
	imageOptim --image-alpha --directory build/

optim-svg:
	svgo --precision=2 --disable=removeUnknownsAndDefaults build/

