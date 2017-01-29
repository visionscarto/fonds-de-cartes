#! /usr/bin/env phantomjs

var system = require('system');
var env = system.env;


function usage() {
    return args[0] + ' [url] [dest] --help --wait [w] --scale [s] --format [png,pdf] --optim';
}


// CLI options
// sudo npm install -g optparse
var optparse = require('/usr/local/lib/node_modules/optparse/lib/optparse');
var switches = [
    ['-h', '--help', 'Shows help sections'],
    ['-w', '--wait NUMBER', 'Wait w seconds'],
    ['-f', '--format [png]', 'Export format (png, pdf, svg)'],
    ['-s', '--scale NUMBER', 'Scale by s'],
    ['-p', '--optim', 'Optimize file'],
];
var parser = new optparse.OptionParser(switches);

var args = require('system').args;

parser.on('help', function() {
    console.log(usage());
    phantom.exit();
});

var wait = 1;
parser.on('wait', function(opt, n) {
    wait = parseInt(n);
});

var scale = 1;
parser.on('scale', function(opt, n) {
    scale = parseFloat(n);
});

var optim = false;
parser.on('optim', function(opt, n) {
    optim = true;
});

var format = 'png';
parser.on('format', function(opt, n) {
    if ("png pdf".split(/ /).indexOf(n) == -1) {
        console.log('Wrong format:', n);
    } else {
        format = n;
    }
});

var url = false, dest = false;
parser.on(1, function(opt) {
    url = opt;
    if (!url.match(/^(file|https?):\/\//)) {
        url = 'http://' + url;
    }
    dest = env.HOME + '/Dropbox/screenshots/' + url.replace(/[.:\/]/g, '-');
});

parser.on(2, function(opt, n) {
    dest = opt;
    var m = dest.match(/^(.*)[.](png|pdf|svg)$/);
    if (m) {
        dest = m[1];
        format = m[2];
    }
});

parser.parse(args);

var page = require('webpage').create();

// donner une hauteur importante pour forcer lazyload
//page.viewportSize = { width: 1024, height: 400 };

console.log('loading ' + url);
page.open(url,
    function () {

        // scale the page 
        // http://zecipriano.com/2014/10/screenshots-size-phantomjs/
        page.evaluate(function (scale) {
            // the scale of the content, 1 for normal, 2 for a kind of retina
            document.body.style.webkitTransform = "scale(" + scale + ")";
            document.body.style.webkitTransformOrigin = "0% 0%";
            document.body.style.width = 100 / scale + "%";

        }, scale);


        // attendre 1seconde pour d3.legend()
        console.log('wait ' + wait + 's');
        setTimeout(function () {
            console.log('saving ' + url + ' at scale ' + scale + ' as ' + dest + '.' + format);

            if (format == 'svg') {
            var a = page.evaluate(function() {
                var res = [ document.all[0].outerHTML ];

                var embeds = document.getElementsByTagName('embed'), e;

                for (i=0; i< embeds.length; i++) {
                    var txt = (new XMLSerializer())
                    .serializeToString(embeds[parseInt(i)].getSVGDocument());
                    res.push(txt);
                }
                return res.join("\n\n");
            });

            // match all SVGs and save them
            var i = 0;
            var u = a.replace(/<svg[^]*?<\/svg>/gm, function(svg) {

                // plantage sur les textures !
                svg = svg
                .replace(/(fill: )(#.....)( rgba\(.*?\))?;/g, '$1 url($2);')
                .replace(/&nbsp;/g, ' ');
                saveas('<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + svg, dest + (i>0 ? i : '') + '.svg');
                i++;
            });
            }

            else {
            // evacuer un bug sur stroke-dasharray
            page.evaluate(function() {
                (typeof d3 != 'undefined') && d3.selectAll('.fixdasharray')
                .each(function(d) {
                    var me = d3.select(this);
                    if (me.attr('stroke-width') && +me.attr('stroke-width') < 1) {
                        me.attr({
                            opacity: +me.attr('stroke-width'),
                            'stroke-width': 1,
                        });
                    }
                });
            });
            page.render(dest + '.' + format);

            phantom.exit();
            }
        }, wait * 1000);

    });


function saveas(content, path) {
    var fs = require('fs');
    fs.write(path, content, 'w');
}


