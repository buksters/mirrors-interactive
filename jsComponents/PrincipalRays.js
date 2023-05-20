// Principal rays for spherical mirror interactives
// Depend on object position and curvature of mirror

class PrincipalRays {

  calcRays(object, mirror){
    // Ray diagram for convex mirrors: 
    // https://www.physicsclassroom.com/class/refln/Lesson-4/Ray-Diagrams-Convex-Mirrors  

    this.incidentRays = [];
    this.refExtRays = [];

    let focalP = mirror.focalPoint.copy();
    let emitP = object.position;
    
    // The simplest incident rays to find are: 
    // 1. Parallel to principal axis, which will go thru mirror focal point once reflected (prl)
    // 2. Goes thru mirror focal point, which will be parallel to principal axis once reflected (fcl)

    // Find intersection points btwn incident rays and mirror
    let prlInterP, fclInterP;
    if (mirror.type === "convex"){
      prlInterP = intersectLineCircle(emitP.x, emitP.y, mirror.center.x, emitP.y, mirror.center.x, mirror.center.y, mirror.radius)
      fclInterP = intersectLineCircle(emitP.x, emitP.y, focalP.x, focalP.y, mirror.center.x, mirror.center.y, mirror.radius)
    }
    else if (mirror.type === "concave") {
      prlInterP = intersectLineCircle(mirror.center.x, emitP.y, width, emitP.y, mirror.center.x, mirror.center.y, mirror.radius)
      // Extending the ray that goes thru focal point so that it intersects the mirror 
      // (since for concave the focal point lies in front of mirror)
      let shiftedFclRay = p5.Vector.sub(focalP, emitP).mult(5).add(focalP);
      fclInterP = intersectLineCircle(focalP.x, focalP.y, shiftedFclRay.x, shiftedFclRay.y, mirror.center.x, mirror.center.y, mirror.radius)
    }

    // Get incident ray vectors for display purposes
    let prlRay = p5.Vector.sub(prlInterP, emitP);
    this.incidentRays.push({
      start: emitP, 
      end: prlRay
    });
    let fclRay = p5.Vector.sub(fclInterP, emitP);
    this.incidentRays.push({
      start: emitP, 
      end: fclRay
    });

    // Position of reflected image is the intersection point between the reflected parallel and focal rays
    let refPos = intersect(prlInterP.x, prlInterP.y, focalP.x, focalP.y, fclInterP.x, fclInterP.y, width, fclInterP.y);
    this.refPos = refPos;

    let ER = p5.Vector.sub(refPos, emitP); 
    
    // Extended portion of reflected rays that intersect behind mirror
    let prlRef = p5.Vector.sub(ER, prlRay);
    this.refExtRays.push({
      start: prlInterP, 
      end: prlRef
    })
    let fclRef = p5.Vector.sub(ER, fclRay);
    this.refExtRays.push({
      start: fclInterP, 
      end: fclRef
    })

    // How much the image will be scaled 
    this.refProportion = fclRef.mag()/prlRay.mag() 
  }

  // Return position and size of reflected image
  getRefInfo() {
    return {pos: this.refPos, size: this.refProportion}
  }

  display(){
    for (const ray of this.incidentRays) {
      drawVec(ray.start, ray.end, "cornflowerblue");
    }

    for (const ray of this.refExtRays) {
      drawVec(ray.start, ray.end, "#d5d5f6");
      // To draw the reflected rays bouncing off of mirror, we want to rotate the extended ray 180deg 
      let bounceRay = p5.Vector.rotate(ray.end, PI).setMag(2*width);
      drawVec(ray.start, bounceRay, "cornflowerblue")
    }
  }
}