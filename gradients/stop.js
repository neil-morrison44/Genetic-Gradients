const stealColors = require("../steal_colors");


class Stop{
  constructor(percent, color) {
    var colors = stealColors();
    var index = Math.floor(colors.length * Math.random());
    
    this.r = colors[index][0] / 255;
    this.g = colors[index][1] / 255;
    this.b = colors[index][2] / 255;
    this.a = color.a;
    this.percent = percent;
  }

  toString(){
    let red = Math.round(this.r * 255);
    let green = Math.round(this.g * 255);
    let blue = Math.round(this.b * 255);
    let alpha = this.a.toFixed(3);
    let percent = (this.percent * 100).toFixed(2);
    return `rgba(${red},${green},${blue},${alpha}) ${percent}%`;
  }

  mutate(factor){
    var scale = Math.max(1, 10 - factor);
    this.r = ((this.r * scale) + Math.random()) / (scale + 1);
    this.g = ((this.g * scale) + Math.random()) / (scale + 1);
    this.b = ((this.b * scale) + Math.random()) / (scale + 1);
    this.a = ((this.a * 2) + Math.random()) / 3;

    this.percent = ((this.percent * scale) + Math.random()) / (scale + 1);

    // var colors = stealColors();
    // var index = Math.floor(colors.length * Math.random());
    // this.r = colors[index][0] / 255;
    // this.g = colors[index][1] / 255;
    // this.b = colors[index][2] / 255;
  }

  clone(){
    var clonedStop = new Stop(this.percent, this);
    return clonedStop;
  }
}

module.exports = Stop;