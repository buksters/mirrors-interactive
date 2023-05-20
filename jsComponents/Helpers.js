// --- Some Helper Functions ---

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {

  // Check if none of the lines are of length 0
	if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
		return false
	}

	denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  // Lines are parallel
	if (denominator === 0) {
		return false
	}

	let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
	let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
		return false
	}

  // Return a object with the x and y coordinates of the intersection
	let x = x1 + ua * (x2 - x1)
	let y = y1 + ua * (y2 - y1)

	return new p5.Vector(x,y)
}


// Determine intersection point of line segment and circle
// Return FALSE if no intersection
function intersectLineCircle(x1, y1, x2, y2, cx, cy, r) {

  // Check if the line segment and circle are not of zero length
  if (x1 === x2 && y1 === y2) {
    return false;
  }

  // Translate the origin to the center of the circle
  let x3 = x1 - cx;
  let y3 = y1 - cy;
  let x4 = x2 - cx;
  let y4 = y2 - cy;

  // Calculate quadratic equation coefficients
  let a = (x4 - x3) * (x4 - x3) + (y4 - y3) * (y4 - y3);
  let b = 2 * ((x4 - x3) * x3 + (y4 - y3) * y3);
  let c = x3 * x3 + y3 * y3 - r * r;

  // Calculate discriminant
  let discriminant = b * b - 4 * a * c;

  // Check if there are two solutions
  if (discriminant < 0) {
    return false;
  }

  // Calculate both solutions
  let t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
  let t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

  // Check if the solutions are in range
  if (t1 >= 0 && t1 <= 1) {
    return createVector(x1 + (x2 - x1) * t1, y1 + (y2 - y1) * t1);
  }

  if (t2 >= 0 && t2 <= 1) {
    return createVector(x1 + (x2 - x1) * t2, y1 + (y2 - y1) * t2);
  }

  return false;
}


// Draws an arrow for a vector at a given base position
// Borrowed from p5.js example sketch
function drawVec(base, vec, myColor) {
	push();
	stroke(myColor);
	strokeWeight(2);
	fill(myColor);
	translate(base.x, base.y);
	line(0, 0, vec.x, vec.y);
	rotate(vec.heading());
	let arrowSize = 7;
	translate(vec.mag() - arrowSize, 0);
	triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
	pop();
}