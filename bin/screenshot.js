#! /usr/bin/env node

// PDF ou JPG ont une qualité inférieure
const args = process.argv,
    url = args[2],
    dest = args[3] || 'screenshot',
    scale = eval(args[4]) || 1,
    secs = 1;


if (!url) {
    console.log(usage());
    return;
}

const fs = require("fs"),
  puppeteer = require('puppeteer');


(async function(){

console.log('loading ' + url);

let svgCode = await screen(url, dest);

// plantage sur les textures !
svgCode = svgCode.replace(/(fill: )(#.....)( rgba\(.*?\))?;/g, '$1 url($2);')
  .replace(/&nbsp;/g, ' ');
svgCode = '<?xml version="1.0" encoding="utf-8"?>' + svgCode;
saveas(svgCode, dest + ".svg");

})();

// ----------------------------------

async function screen(url, path) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const width = 704, height = 483; // includes margins
  await page.setViewport({width, height, deviceScaleFactor: scale});
  await page.goto(url, {waitUntil: 'networkidle2'});

  await delay(1000);
  await page.screenshot({path: path + ".png", omitBackground: true });

  const svgCode = await page.evaluate(() => document.all[0].outerHTML.match(/<svg[^]*?<\/svg>/gm)[0]);

  await browser.close();
  
  return svgCode;
}

function saveas(content, path) {
    fs.writeFileSync(path, content);
}

function usage() {
    return `${args[0]} ${args[1]} [url] [dest.png]`;
}

async function delay (duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}