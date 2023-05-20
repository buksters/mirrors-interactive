// The object being reflected in the mirror(s)
class Obj {
  constructor(img, pos) {
    this.img = img;
    this.position = pos.copy();
    this.width = 100;
    this.height = 100;
  }
  
  displayRefPlane(ray) {
    let refImgs = ray.getRefInfo();
    push();
    for (const im of refImgs) {
      // Translate origin to reflection position so that image can be reflected in place
      translate(im.pos.x, im.pos.y); 
      if(im.mirrorAx === "X"){
        scale(1,-1); // Reverses Y Axis
      }
      else{
        scale(-1,1); // Reverses X Axis
      }
      tint(255, 255*0.6); // 60% transparency
      image(this.img, 0, 0, this.width, this.height);
      // Translate origin back to 0,0
      translate(-im.pos.x, -im.pos.y); 
    }
    pop(); 
  }

  displayRefCurve(ray){
    let refInfo = ray.getRefInfo();
    let refScale = refInfo.size;
    let refPos = refInfo.pos;
    push();
    // Translate origin to reflection position so that image can be reflected and scaled in place
    translate(refPos.x, refPos.y); 
    scale(-refScale,refScale);     // Assuming only vertical mirrors for now
    tint(255, 255*0.6);            // 60% transparency
    image(this.img, 0, 0, this.width, this.height);
    pop();
  }

  setPosition(objPos) {
    this.position = objPos.copy();
  }

  moveX(mirror) {
    let mirrorX = mirror.pole.x; 
    // Detect when mouse is dragged over object
    // Block object from being moved past mirror's leftmost point or edge of canvas
    if (
      mouseIsPressed && 
      dist(mouseX, mouseY, this.position.x, this.position.y) < this.width/2 && 
      mouseX < mirrorX - 50 && 
      mouseX > 50
    ) {
      this.position.x = mouseX;
    }
  }
  
  displayObj(){
    imageMode(CENTER);
    image(this.img, this.position.x, this.position.y, this.width, this.height);
  }
}