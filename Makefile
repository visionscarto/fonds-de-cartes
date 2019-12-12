LANG=es

all: init tag fonds-bizarres fonds-utiles fonds-tests fonds ## data & fonds de cartes

tag:
	gstat  -c '%y' fond.html > build/tag.txt

fonds: arctic antarctic  airocean bertin1953 cahillkeyes equalearth winkel-tripel optim ## fonds de cartes standards

fonds-bizarres: bottomley gallpeters larrivee timesus robinson ## fonds de cartes bizarres

fonds-tests: gingery cox lee leenorth ## fonds de cartes en test

fonds-utiles: equirectangular ## fonds de cartes utiles


### DATA
data: init topo ## initialize data

init: ## create build/* directory
	mkdir -p build/$$LANG

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
	./bin/screenshot.js "http://localhost/maps/fonds-de-cartes/fond.html?projection=arctic&graticule=1&lang=$$LANG" "build/$$LANG/visionscarto-arctic" 2

antarctic: ## projection azimutale équivalente nord
	./bin/screenshot.js "http://localhost/maps/fonds-de-cartes/fond.html?projection=antarctic&antarctica=1&graticule=1&lang=$$LANG" "build/$$LANG/visionscarto-antarctic" 2

bertin1953: ## projection bertin 1953
	./bin/screenshot.js "http://localhost/maps/fonds-de-cartes/fond.html?projection=bertin1953&lang=$$LANG" "build/$$LANG/visionscarto-bertin1953" 2

winkel-tripel: ## projection winkel-tripel
	./bin/screenshot.js "http://localhost/maps/fonds-de-cartes/fond.html?projection=winkel-tripel&lang=$$LANG" "build/$$LANG/visionscarto-winkel-tripel" 2

airocean: ## projection airocean de Buckminster Fuller
	./bin/screenshot.js "http://localhost/maps/fonds-de-cartes/fond.html?projection=airocean&graticule=1&antarctica=1&lang=$$LANG" "build/$$LANG/visionscarto-airocean" 2

cahillkeyes: ## projection de Cahill-Keyes
	./bin/screenshot.js "http://localhost/maps/fonds-de-cartes/fond.html?projection=cahillkeyes&graticule=1&antarctica=1&lang=$$LANG" "build/$$LANG/visionscarto-cahillkeyes" 2

equalearth: ## projection Equal Earth (2018)
	./bin/screenshot.js "http://localhost/maps/fonds-de-cartes/fond.html?projection=equalearth&graticule=1&antarctica=1&lang=$$LANG"  "build/$$LANG/visionscarto-equalearth" 2 

## obsolete remplacee par equalearth (??)
robinson: ## projection robinson
	./bin/screenshot.js "http://localhost/maps/fonds-de-cartes/fond.html?projection=robinson&lang=$$LANG" "build/$$LANG/visionscarto-robinson" 2



### PROJECTIONS UTILES

equirectangular: ## projection equirectangular
	./bin/screenshot.js "http://localhost/maps/fonds-de-cartes/fond.html?projection=equirectangular&lang=$$LANG" "build/$$LANG/visionscarto-equirectangular" 2

### PROJECTIONS BIZARRES

bottomley: ## projection bottomley
	./bin/screenshot.js "http://localhost/maps/fonds-de-cartes/fond.html?projection=bottomley&lang=$$LANG" "build/$$LANG/visionscarto-bottomley" 2

gallpeters: ## projection gall-peters
	./bin/screenshot.js "http://localhost/maps/fonds-de-cartes/fond.html?projection=gallpeters&lang=$$LANG" "build/$$LANG/visionscarto-gallpeters" 2

larrivee: ## projection larrivee
	./bin/screenshot.js "http://localhost/maps/fonds-de-cartes/fond.html?projection=larrivee&lang=$$LANG" "build/$$LANG/visionscarto-larrivee" 2

timesus: ## projection Times centrée sur les US
	./bin/screenshot.js "http://localhost/maps/fonds-de-cartes/fond.html?projection=timesus&lang=$$LANG" "build/$$LANG/visionscarto-timesus" 2

gingery:
	./bin/screenshot.js "http://localhost/maps/fonds-de-cartes/fond.html?projection=geoGingery&antarctica=1&clip=1&graticule=1&lang=$$LANG" "build/$$LANG/visionscarto-gingery" 2

cox:
	./bin/screenshot.js "http://localhost/maps/fonds-de-cartes/fond.html?projection=Cox&graticule=1&lang=$$LANG" "build/$$LANG/visionscarto-cox" 2

lee:
	./bin/screenshot.js "http://localhost/maps/fonds-de-cartes/fond.html?projection=lee&graticule=1&antarctica=1&rotate=-30&angle=-30&lang=$$LANG" "build/$$LANG/visionscarto-lee" 2

leenorth:
	./bin/screenshot.js "http://localhost/maps/fonds-de-cartes/fond.html?projection=lee&graticule=1&antarctica=1&rotate=-30&roll=180&angle=-30&lang=$$LANG" "build/$$LANG/visionscarto-leenorth" 2

imago:
	./bin/screenshot.js "http://localhost/maps/fonds-de-cartes/fond.html?projection=imago&graticule=1&antarctica=1&lang=$$LANG" "build/$$LANG/visionscarto-imago" 2

optim: optim-svg optim-png ## optimize all images

optim-png: ## optimize PNG
	optipng build/$$LANG/*.png
	#pngquant --ext .png --force build/$$LANG/*.png

optim-svg: ## optimize SVG
	svgo --precision=2 --disable=removeHiddenElems --disable=collapseGroups --disable=removeEditorsNSData --disable=removeUnknownsAndDefaults --disable=removeXMLProcInst build/$$LANG/



help:
	@awk -F ':|##' '/^[^\t].+?:.*?##/ { printf "\033[36m%-30s\033[0m %s\n", $$1, $$NF }' $(MAKEFILE_LIST)

