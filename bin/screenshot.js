#! /usr/bin/env node

const puppeteer = require("puppeteer");

// PDF ou JPG ont une qualité inférieure
var args = process.argv,
  url = args[2],
  dest = args[3] || "screenshot.png",
  scale = eval(args[4]) || 1,
  secs = 1;

if (!url) {
  console.log(usage());
}

(async () => {
  console.log("loading " + url);

  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.setViewport({ width: 704, height: 483, deviceScaleFactor: scale });
  await page.goto(url);
  await sleep(1000 * secs);

  await page.screenshot({ path: dest + ".png" });
  console.log("saving " + url + " at scale " + scale + " as " + dest + ".png");

  svg = (await page.waitForFunction(
    _ => document.all[0].outerHTML.match(/<svg[^]*?<\/svg>/gm)[0]
  ))._remoteObject.value;
  browser.close();

  // match all SVGs and save them
  var i = 0;
  var u = svg.replace(/<svg[^]*?<\/svg>/gm, function(svg) {
    console.log(
      "saving " + url + " at scale " + scale + " as " + dest + ".svg"
    );

    // plantage sur les textures !
    svg = svg
      .replace(/(fill: )(#.....)( rgba\(.*?\))?;/g, "$1 url($2);")
      .replace(/&nbsp;/g, " ");
    saveas(
      '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
        svg,
      dest + (i > 0 ? i : "") + ".svg"
    );
    i++;
  });
})();

function saveas(content, path) {
  var fs = require("fs");
  fs.writeFileSync(path, content);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function usage() {
  return args[0] + "[url] [dest.png]";
}
