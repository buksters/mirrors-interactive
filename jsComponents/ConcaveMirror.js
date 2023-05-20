// Couldn't implement in time; is a work in progress
class ConcaveMirror extends CurvedMirror {
  constructor(pole, radSlider) {
    super(pole, radSlider);
    this.center = createVector(this.pole.x-this.radius, this.pole.y);
    this.focalPoint = createVector(this.pole.x-this.radius/2, this.pole.y)
    this.type = "concave";
  }

  modifyCurve() {
    this.radius = this.radSlider.value();
    // Adjust so that arc position and length don't change
    this.center.x = this.pole.x-this.radius;
    this.arcAngle = PI/8 * this.initialRadius/this.radius;
    this.focalPoint.x = this.pole.x-this.radius/2;
  }

  display(){
    push();
    noFill();
    strokeWeight(5);
    stroke(169);
    arc(this.center.x, this.center.y, this.radius*2, this.radius*2, -this.arcAngle, this.arcAngle);
    pop();
  }
}