all: init tag fonds-bizarres fonds-utiles fonds-tests fonds ## data & fonds de cartes

tag:
	gstat  -c '%y' fond.html > build/tag.txt

fonds: arctic antarctic bertin1953 robinson winkel-tripel optim ## fonds de cartes standards

fonds-bizarres: bottomley gallpeters larrivee timesus ## fonds de cartes bizarres

fonds-tests: gingery cox lee leenorth ## fonds de cartes en test

fonds-utiles: equirectangular ## fonds de cartes utiles


### DATA
data: init topo ## initialize data

init: ## create build/ directory
	mkdir -p build

## pour simplifier un peu : 0.00005
## npm install -g topojson@3.0.0
topo3: ## create build/countries.topo.json
	cat data/countries-110m.geojson \
	| geostitch \
	| geoproject -p 4 'd3.geoIdentity()' \
	| geo2topo countries=- \
	| topoquantize 3000 \
	| toposimplify -s 0.00004 --filter-detached \
	> build/countries.topo.json

toporefine: ## create build/countries.topo.json
	cat data/countries.topo.json \
	| toposimplify -s 0.00004 --filter-all \
	> build/countries.topo.json

## npm install -g topojson@1.6.19
topo1: ## create build/countries.topo.json
	topojson --properties \
       --id-property id \
       --simplify 0.00005 \
       countries=- \
       < data/countries-110m.geojson > build/countries.topo.json

topo: topo1

### PROJECTIONS PUBLIEES SUR https://visionscarto.net/fonds-de-cartes

arctic: ## projection azimutale équivalente nord
	./bin/screenshot.js "file://`pwd`/fond.html?projection=arctic&graticule=1" build/visionscarto-arctic 2

antarctic: ## projection azimutale équivalente nord
	./bin/screenshot.js "file://`pwd`/fond.html?projection=antarctic&antarctica=1&graticule=1" build/visionscarto-antarctic 2

bertin1953: ## projection bertin 1953
	./bin/screenshot.js "file://`pwd`/fond.html?projection=bertin1953" build/visionscarto-bertin1953 2

robinson: ## projection robinson
	./bin/screenshot.js "file://`pwd`/fond.html?projection=robinson" build/visionscarto-robinson 2

winkel-tripel: ## projection winkel-tripel
	./bin/screenshot.js "file://`pwd`/fond.html?projection=winkel-tripel" build/visionscarto-winkel-tripel 2

### PROJECTIONS UTILES

equirectangular: ## projection equirectangular
	./bin/screenshot.js "file://`pwd`/fond.html?projection=equirectangular" build/visionscarto-equirectangular 2

### PROJECTIONS BIZARRES

bottomley: ## projection bottomley
	./bin/screenshot.js "file://`pwd`/fond.html?projection=bottomley" build/visionscarto-bottomley 2

gallpeters: ## projection gall-peters
	./bin/screenshot.js "file://`pwd`/fond.html?projection=gallpeters" build/visionscarto-gallpeters 2

larrivee: ## projection larrivee
	./bin/screenshot.js "file://`pwd`/fond.html?projection=larrivee" build/visionscarto-larrivee 2

timesus: ## projection Times centrée sur les US
	./bin/screenshot.js "file://`pwd`/fond.html?projection=timesus" build/visionscarto-timesus 2

gingery:
	./bin/screenshot.js "file://`pwd`/fond.html?projection=geoGingery&antarctica=1&clip=1&graticule=1" build/visionscarto-gingery 2

cox:
	./bin/screenshot.js "file://`pwd`/fond.html?projection=Cox&graticule=1" build/visionscarto-cox 2

lee:
	./bin/screenshot.js "file://`pwd`/fond.html?projection=PolyhedralLee&graticule=1&antarctica=1&rotate=-30&orient=180" build/visionscarto-lee 2

leenorth:
	./bin/screenshot.js "file://`pwd`/fond.html?projection=PolyhedralLee&graticule=1&antarctica=1&rotate=30&roll=180&orient=180" build/visionscarto-leenorth 2

optim: optim-svg optim-png ## optimize all images

optim-png: ## optimize PNG
	optipng build/*.png
	#pngquant --ext .png --force build/*.png

optim-svg: ## optimize SVG
	svgo --precision=2 --disable=removeHiddenElems --disable=collapseGroups --disable=removeEditorsNSData --disable=removeUnknownsAndDefaults --disable=removeXMLProcInst build/



help:
	@awk -F ':|##' '/^[^\t].+?:.*?##/ { printf "\033[36m%-30s\033[0m %s\n", $$1, $$NF }' $(MAKEFILE_LIST)

