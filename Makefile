all: ## data & fonds de cartes
	data fonds

fonds: ## fonds de cartes standards
	bertin1953 robinson winkel3 optim

fonds-bizarres: ## fonds de cartes bizarres
	larrivee bottomley gallpeters


### DATA
data: ## initialize data
	init topo

init: ## create build/ directory
	test -d build || mkdir build

topo: ## create build/countries.topo.json
	topojson --properties \
	--id-property id \
	--simplify 0.00001 \
	-- data/countries.geojson > build/countries.topo.json


### PROJECTIONS

bertin1953: ## projection bertin 1953
	./bin/screenshot.js file://`pwd`/fond.html?projection=bertin1953 build/visionscarto-bertin1953 2

robinson: ## projection robinson
	./bin/screenshot.js file://`pwd`/fond.html?projection=robinson build/visionscarto-robinson 2

winkel3: ## projection winkel-tripel
	./bin/screenshot.js file://`pwd`/fond.html?projection=winkel3 build/visionscarto-winkel3 2


### PROJECTIONS BIZARRES

larrivee: ## projection larrivee
	./bin/screenshot.js file://`pwd`/fond.html?projection=larrivee build/visionscarto-larrivee 2

bottomley: ## projection bottomley
	./bin/screenshot.js file://`pwd`/fond.html?projection=bottomley build/visionscarto-bottomley 2

gallpeters: ## projection gall-peters
	./bin/screenshot.js file://`pwd`/fond.html?projection=gallpeters build/visionscarto-gallpeters 2

timesus: ## projection Times centrée sur les US
	./bin/screenshot.js file://`pwd`/fond.html?projection=timesus build/visionscarto-timesus 2


optim: ## optimize all images
	optim-svg optim-png

optim-png: ## optimize PNG
	imageOptim --image-alpha --directory build/

optim-svg: ## optimize SVG
	svgo --precision=2 --disable=removeUnknownsAndDefaults --disable=removeXMLProcInst build/



help:
	@awk -F ':|##' '/^[^\t].+?:.*?##/ { printf "\033[36m%-30s\033[0m %s\n", $$1, $$NF }' $(MAKEFILE_LIST)

