class PlaneMirror {
  constructor(start, end) {
    this.start = start;
    this.end = end;
    this.mirAxis = p5.Vector.sub(this.end, this.start);
  }
  
  getNormal() {
    this.mirNormal = p5.Vector.rotate(this.mirAxis, -HALF_PI).normalize();
    return this.mirNormal; 
  }

  getAxis() {
    return this.mirAxis;
  }
  
  display() {
    push();
    strokeWeight(5);
    stroke(169);
    line(this.start.x, this.start.y, this.end.x, this.end.y);
    pop();
  }
}

