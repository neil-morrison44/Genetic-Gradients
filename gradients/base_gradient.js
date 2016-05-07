Stop = require("./stop");

class BaseGradient {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.stops = [];

    this.type = "linear";

    this.addStop(this.randomColor(), 0);
    this.addStop(this.randomColor(), 0.1);
    // this.addStop(this.transparentColor(), 0.2);
  }

  mutate(factor){
    this.x = (this.x + this.x + this.x + Math.random()) / 4;
    this.y = (this.y + this.y + this.y + Math.random()) / 4;
    this.stops.forEach(stop =>{
      stop.mutate(factor);
    });

    if (Math.random() < 0.1){
      this.addStop(this.randomColor(), Math.random());
    }

    if (Math.random() < 0.1){
      this.type = "radial";
    }else if (Math.random() < 0.1){
      this.type = "linear"
    }


    this.stops.sort((stopA, stopB) =>{
      return stopA.percent - stopB.percent;
    });
  }

  addStop(color, percent) {
    let newStop = new Stop(percent, color);
    this.stops.push(newStop);
  }

  toString(){
    let stops = this.stops.join(",");
    let perX = (this.x * 100).toFixed(2);
    if (this.type === "linear"){
      let perY = (this.y * 360).toFixed(2);
      return `linear-gradient(${perY}deg, ${stops})`;
    }else{
      let perY = (this.y * 100).toFixed(2);
      return `radial-gradient(ellipse at ${perX}% ${perY}%, ${stops})`;
    }
  }

  randomColor(){
    return {r: Math.random(), g: Math.random(), b: Math.random(), a: 0.0};
  }
  transparentColor(){
    return {r: 0, g:0, b:0, a: 0};
  }

  clone(){
    const cloneGradient = new BaseGradient(this.x, this.y);
    cloneGradient.stops = this.stops.map(stop =>{
      return stop.clone();
    });
    return cloneGradient;
  }
}

module.exports = BaseGradient;