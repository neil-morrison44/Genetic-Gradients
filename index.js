// const phantom = require("phantom");
const Nightmare = require("nightmare");
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

const nightmare = new Nightmare({
  "show": false,
  "switches":{
    "disable-javascript": true,
    "disable-renderer-backgrounding": true
  }
});

nightmare.viewport(dimensions.width, dimensions.height)


function compareGradients(testGradients, callback){
  var _ph, _page, _outObj;

  nightmare
    .goto("data:text/html;charset=utf-8,"+ generatePage(testGradients))
    .screenshot()
    .then(function(imageData){
      pageFile = imageData;
      var diff = resemble.resemble(imageFile).compareTo(imageData).onComplete(function(data){
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
      console.log("improvement!", `${missMatch}%`);
      bestMismatch = missMatch;
      gradients = newGradients;
      fs.writeFileSync("best.png", pageFile);
      fs.writeFileSync("best.html", generatePage(gradients));
    }else{
      if(totalLoops%10 === 0){
        console.log("no improvement!", totalLoops, `${missMatch}%`);
      }
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

