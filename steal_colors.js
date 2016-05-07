const ColorThief = require("color-thief");

var stolenColours = null;

module.exports = function(imageFile){
  if (stolenColours){
    return stolenColours;
  }else{
    var colorThief = new ColorThief();
    stolenColours = colorThief.getPalette(imageFile, 10);
    return stolenColours;
  }
}
