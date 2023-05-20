// Ray for plane mirror interactives, which follows mouse
// Visualizes a ray of light reflected off of the object
class Ray {
  constructor(objPos) {
    this.isReflected = false;
    this.emitPoint = objPos;
    this.endPoint = null;    
  }

  // Calculates the path of the ray as it interacts with a given set of mirrors
  calcRay(mirrors, viewer) {
    let isReflected = true;
    let startPoint = this.emitPoint.copy();
    let mousePoint = createVector(mouseX, mouseY);

    // (Using setMag(2*width) as a hacky solution to extend ray beyond mousePoint to edge of canvas)
    let endPoint = p5.Vector.sub(mousePoint, startPoint).setMag(2*width); 

    // To store start and end points for each ray segment
    this.raySegments = [];

    // To store start and end points for ray projections to reflected images, as well as axis that they're mirrored over
    this.imageProjections = [];
    // Length of ray projections
    let imDist = 0; 

    // Either the final reflected ray segment after the last mirror it hits, or mouse ray if no mirror collisions
    // (Will be overwritten with each mirror reflection)
    let finalRay = {start: startPoint, end: endPoint}; 

    this.numReflections = 0;
  
    while (isReflected) {
      isReflected = false;
      let minDist = Infinity;
      let closestMirror = null;
      let xPoint = null; // Intersection point
  
      // Check for intersection with each mirror
      for (const mirror of mirrors) {
        // Returns point of intersection if intersecting, otherwise false
        let isIntersecting = intersect(startPoint.x, startPoint.y, endPoint.x, endPoint.y, mirror.start.x, mirror.start.y, mirror.end.x, mirror.end.y);
        if (isIntersecting) {
          // Determine distance to intersection point
          let dist = p5.Vector.dist(startPoint, isIntersecting);
          if (dist < minDist && !isIntersecting.equals(startPoint)) {
            // Store closest intersecting mirror and intersection point
            xPoint = isIntersecting.copy();
            minDist = dist;
            closestMirror = mirror;
            isReflected = true;
          }
        }
      }

      // Check for intersection with eye, represented as circle
      let isHittingEye = intersectLineCircle(startPoint.x, startPoint.y, endPoint.x, endPoint.y, viewer.position.x, viewer.position.y, viewer.width/4)
      if (isHittingEye) {
        // Determine distance to intersection point
        let dist = p5.Vector.dist(startPoint, isHittingEye);
        // If eye is closer than closest mirror, the light ray stops at the eye
        if (dist < minDist) {
          finalRay.end = p5.Vector.sub(isHittingEye, startPoint); 
        }
      }

      if (isReflected) {
        // Reflect the ray off the closest mirror

        this.numReflections++;
        let n = closestMirror.getNormal();
        let ax = closestMirror.getAxis();
        let rayVec = p5.Vector.sub(xPoint, startPoint);         // Ray segment pre-reflection for this mirror
        let refVec = rayVec.copy().reflect(n).setMag(width*2);  // Ray segment post-reflection (again, using setMag as temporary fix)
        imDist += rayVec.mag();
        let imgVec = rayVec.copy().reflect(ax).setMag(imDist);  // Ray projection to reflected image
  
        this.raySegments.push({
          start: startPoint, 
          end: rayVec
        });

        this.imageProjections.push({
          start: xPoint, 
          end: imgVec, 
          mirrorAx: ax.x === 0 ? "Y" : "X" // if ax.x === 0, mirror over y-axis and vice versa
        }); 

        // Overwrite previous reflected ray
        finalRay = {
          start: xPoint, 
          end: refVec
        }; 

        // Update the start/endPoints for the next iteration
        startPoint = xPoint.copy();
        endPoint = p5.Vector.add(xPoint, refVec);
      }
    }

    this.raySegments.push(finalRay);
    this.endPoint = endPoint;
  }

  // Returns positions and mirror axis of reflected images
  getRefInfo(){
    let refInfo = []
    for (const im of this.imageProjections) {
      refInfo.push({
        pos: p5.Vector.add(im.start, im.end), 
        mirrorAx: im.mirrorAx
      })
    }
    return refInfo;
  }

  // Display angles of incidence and reflection
  displayDetails() {
    if (mouseIsPressed) {
      for (let i = 0; i < this.numReflections; i++) {
        push();
        let ray = this.raySegments[i];
        let nextRay = this.raySegments[i+1];
        let xPoint = p5.Vector.add(ray.start, ray.end);

        // Get the angle between incident and reflected rays
        let angleBtwn = abs(p5.Vector.angleBetween(p5.Vector.rotate(ray.end, PI), nextRay.end));
        // Angle of incidence = angle of reflection
        let arcAngle = (PI - angleBtwn) / 2;

        // Get mirror axis to see if details need to be rotated
        let mirAx = this.imageProjections[i].mirrorAx;
        translate(xPoint.x, xPoint.y);
        fill("aliceblue");
        if (mirAx === "Y") {
          rotate(-HALF_PI);
        }
        arc(0,0, 50, 50, -arcAngle, 0); 
        arc(0,0, 50, 50, -PI, -arcAngle-angleBtwn); 
        textAlign(RIGHT, CENTER);
        fill(0)
        text(degrees(arcAngle).toFixed(1),-30, -15);
        textAlign(LEFT);
        text(degrees(arcAngle).toFixed(1),30, -15);
        pop();

      }
    }
  }

  display() {
    for (const ray of this.raySegments) {
      drawVec(ray.start, ray.end, "cornflowerblue");
    }
    for (const ray of this.imageProjections) {
      drawVec(ray.start, ray.end, "#d5d5f6");
    }
  }
}