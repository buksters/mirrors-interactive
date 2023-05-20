class Viewer {
  constructor(img, pos) {
    this.img = img;
    this.position = pos.copy();
    this.width = 70;
    this.height = 70;
  }

  move() {
    // Detect when mouse is dragged over viewer
    // Block viewer from being moved past edges of canvas
    if (
      mouseIsPressed && 
      dist(mouseX, mouseY, this.position.x, this.position.y) < this.width/2 && 
      30 < mouseX &&
      mouseX < width-30 && 
      30 < mouseY && 
      mouseY < height-130
    ) {
      this.position.x = mouseX;
      this.position.y = mouseY;
    }
  }

  display() {
    imageMode(CENTER);
    image(this.img, this.position.x, this.position.y, this.width, this.height);
  }
}