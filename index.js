const phantom = require("phantom");
const sizeOf = require('image-size');
const fs = require('fs');
const resemble = require("resemble");
const BaseGradient = require("./gradients/base_gradient");
const stealColors = require("./steal_colors");

const dimensions = sizeOf('mona_lisa.png');
const imageFile = fs.readFileSync('mona_lisa.png');
var pageFile = null;

stealColors(imageFile);


function generatePage(gradientArray){
  return `<html>
  <head>
  <style>
  html{
    background: black;
  }
  body{
    background: ${gradientArray};
    margin: 0px 0px;
  }
  </style>
  </head>
  <body>
  </body>
  </html>`;
}


var gradients = [];

for (var i = 5; i >= 0; i--) {
  var newGradient = new BaseGradient(0.5, Math.random());
  newGradient.mutate(10);
  gradients.push(newGradient);
}
// gradients.push("white");

// console.log(generatePage(gradients));

function compareGradients(testGradients, callback){
  var _ph, _page, _outObj;

  phantom.create().then(ph => {
      _ph = ph;
      // console.log("phantom");
      return _ph.createPage();
  }).then(page => {
      _page = page;
      // console.log("page");
      _page.property('viewportSize', {width:dimensions.width, height:dimensions.height});
      return _page.open('data:text/html;charset=utf-8,'+ generatePage(testGradients));
  }).then(status => {
      // console.log(status);
      return _page.property('content')
  }).then(content => {
      _page.render("page.png");
      _page.close();
      _ph.exit();

      pageFile = fs.readFileSync(__dirname + "/page.png");
      var diff = resemble.resemble(imageFile).compareTo(pageFile).onComplete(function(data){
        var missMatch = parseFloat(data.misMatchPercentage);
        callback(missMatch);
      });
  });
}

var totalLoops = 10000;
var bestMismatch = 101;

function testNewGradients(){
  var newGradients = gradients.map(function(gradient){
    const clone = gradient.clone();
    if (Math.random() < (bestMismatch / 100)){
      let factor = Math.round(bestMismatch / 10);
      clone.mutate(factor);
    }
    return clone;
  });
  compareGradients(newGradients, function(missMatch){
    if (missMatch < bestMismatch){
      console.log("improvement!", missMatch);
      bestMismatch = missMatch;
      gradients = newGradients;
      fs.writeFileSync("best.png", pageFile);
    }else{
      console.log("no improvement!", totalLoops, `${missMatch}%`);
    }
    totalLoops--;
    if (totalLoops > 0){
      testNewGradients();
    }else{
      console.log(`best:${bestMismatch}%`);
      console.log(generatePage(gradients));
    }
  });
}

testNewGradients();

