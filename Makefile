all: data fonds ## data & fonds de cartes

fonds: bertin1953 robinson winkel-tripel optim ## fonds de cartes standards

fonds-bizarres: larrivee bottomley gallpeters ## fonds de cartes bizarres


### DATA
data: init topo ## initialize data

init: ## create build/ directory
	mkdir -p build

## pour simplifier un peu : 0.00005
topo: ## create build/countries.topo.json
	cat data/countries.geojson \
	| geostitch \
	| geoproject -p 2 'd3.geoIdentity()' \
	| geo2topo countries=- \
	| topoquantize 2000 \
	| toposimplify -s 0.00001 \
	> build/countries.topo.json

### PROJECTIONS

bertin1953: ## projection bertin 1953
	./bin/screenshot.js file://`pwd`/fond.html?projection=bertin1953 build/visionscarto-bertin1953 --scale 2

robinson: ## projection robinson
	./bin/screenshot.js file://`pwd`/fond.html?projection=robinson build/visionscarto-robinson --scale 2

winkel-tripel: ## projection winkel-tripel
	./bin/screenshot.js file://`pwd`/fond.html?projection=winkel-tripel build/visionscarto-winkel-tripel --scale 2


### PROJECTIONS BIZARRES

larrivee: ## projection larrivee
	./bin/screenshot.js file://`pwd`/fond.html?projection=larrivee build/visionscarto-larrivee --scale 2

bottomley: ## projection bottomley
	./bin/screenshot.js file://`pwd`/fond.html?projection=bottomley build/visionscarto-bottomley --scale 2

gallpeters: ## projection gall-peters
	./bin/screenshot.js file://`pwd`/fond.html?projection=gallpeters build/visionscarto-gallpeters --scale 2

timesus: ## projection Times centrée sur les US
	./bin/screenshot.js file://`pwd`/fond.html?projection=timesus build/visionscarto-timesus --scale 2


optim: optim-svg optim-png ## optimize all images

optim-png: ## optimize PNG
	optipng build/*.png
	#pngquant --ext .png --force build/*.png

optim-svg: ## optimize SVG
	svgo --precision=2 --disable=removeUnknownsAndDefaults --disable=removeXMLProcInst build/



help:
	@awk -F ':|##' '/^[^\t].+?:.*?##/ { printf "\033[36m%-30s\033[0m %s\n", $$1, $$NF }' $(MAKEFILE_LIST)

