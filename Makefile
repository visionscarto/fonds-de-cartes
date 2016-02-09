all: data fonds

fonds: bertin1953 robinson winkel3 optim

fonds-bizarres: larrivee bottomley gallpeters

data: init topo


### DATA
init:
	test -d build || mkdir build

topo:
	topojson --properties \
	--id-property id \
	--simplify 0.00001 \
	-- data/countries.geojson > build/countries.topo.json


### PROJECTIONS

bertin1953:
	./bin/screenshot.js file://`pwd`/fond.html?projection=bertin1953 build/visionscarto-bertin1953 2

robinson:
	./bin/screenshot.js file://`pwd`/fond.html?projection=robinson build/visionscarto-robinson 2

winkel3:
	./bin/screenshot.js file://`pwd`/fond.html?projection=winkel3 build/visionscarto-winkel3 2

### PROJECTIONS BIZARRES

larrivee:
	./bin/screenshot.js file://`pwd`/fond.html?projection=larrivee build/visionscarto-larrivee 2

bottomley:
	./bin/screenshot.js file://`pwd`/fond.html?projection=bottomley build/visionscarto-bottomley 2

gallpeters:
	./bin/screenshot.js file://`pwd`/fond.html?projection=gallpeters build/visionscarto-gallpeters 2


### OPTIM
optim: optim-svg optim-png

optim-png:
	imageOptim --image-alpha --directory build/

optim-svg:
	svgo --precision=2 --disable=removeUnknownsAndDefaults build/

