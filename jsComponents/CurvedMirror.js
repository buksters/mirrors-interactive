// For spherical mirrors (concave and convex)
class CurvedMirror {
  constructor(pole, radSlider) {
    this.pole = pole;
    this.radSlider = radSlider;
    this.initialRadius = radSlider.value();
    this.radius = this.initialRadius;
    this.arcAngle = PI/8;    
  }

  displayDetails() {
    if (mouseIsPressed) {
      push();
      stroke(100); 
      strokeWeight(0.5);
      noFill();
      circle(this.center.x, this.center.y, this.radius*2); 
      
      fill(50);
      circle(this.center.x, this.center.y, 5); 
      circle(this.focalPoint.x, this.focalPoint.y, 5); 

      fill(100);
      textSize(12);
      textAlign(CENTER, CENTER);
      text('center of curvature', this.center.x, this.center.y - 15);
      text('focal point', this.focalPoint.x, this.focalPoint.y + 15)

      pop();
    }
  }
}