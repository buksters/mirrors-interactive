let mirrors = [];
let bottomMirror;
let sideMirror;
let concaveMirror;
let convexMirror;
let ray;
let pRay;
let appleImg;
let eyeImg;
let obj;
let viewer;
let objPos;
let viewerPos;
let buttons = [];
let buttonsCont;
let prompt;
let sglButton, dblButton, vexButton, caveButton;
let radSlider;
let planeMode; // true if interactive uses plane mirrors, false if using spherical mirrors

function preload() {
  appleImg = loadImage('imgs/apple.png');
  eyeImg = loadImage('imgs/eye.png');
}

function setup() {
  prompt = createP("");
  createCanvas(1100,500);

  buttonsCont = createDiv();
  // Buttons for each interactive
  sglButton = createButton("single plane mirror");
  sglButton.mousePressed(sglPlane);
  dblButton = createButton("two plane mirrors");
  dblButton.mousePressed(dblPlane);
  vexButton = createButton("convex mirror");
  vexButton.mousePressed(convex);
  // caveButton = createButton("concave mirror");
  // caveButton.mousePressed(concave);
  buttons.push(sglButton, dblButton, vexButton);
  for (const btn of buttons) {
    buttonsCont.child(btn)
  }

  // Instantiate plane mirrors with start and end points
  bottomMirror = new PlaneMirror(createVector(150, 250), createVector(450, 250)); 
  sideMirror = new PlaneMirror(createVector(550, 50), createVector(550, 250));

  let radius = 300;
  let pole = createVector(550, 200);

  radSlider = createSlider(radius-100, radius+100, radius);
  radSlider.position(pole.x+100, pole.y+200);
  radSlider.style('width', '100px');

  // Instantiate spherical mirrors with pole and slider 
  // (Pole is the center of the reflecting surface)
  concaveMirror = new ConcaveMirror(pole, radSlider); 
  convexMirror = new ConvexMirror(pole, radSlider);

  // Start with single plane mirror interactive
  sglButton.elt.focus();
  sglPlane();

  // Default object and viewer positions (since they can be moved by user)
  objPos = createVector(300, 150);
  viewerPos = createVector(100, 100);

  obj = new Obj(appleImg, objPos);
  viewer = new Viewer(eyeImg, viewerPos);
  ray = new Ray(objPos);
  pRay = new PrincipalRays();
}

function sglPlane(){
  mirrors = [bottomMirror]
  planeMode = true;
  prompt.html("Light rays follow straight lines unless they encounter a reflecting surface, such as a mirror. <br> <br> Move your cursor around to control the direction of the light ray and see how - or if - it affects the position of the reflected image. Click and hold to see the relationship between the angles of the incoming and outgoing light rays and the mirror surface.");
}

function dblPlane(){
  mirrors = [bottomMirror, sideMirror]
  planeMode = true;
  prompt.html("When there's only one mirror, there can only be one reflected image, which doesn't leave much room for variation. But now that there are two mirrors, how many total images can be formed? <br> <br> Now, as an observer, you won't see a reflected image unless the light ray reaches your eye. Is there a point where an observer would be able to see all the reflected images? Try moving the eye around. <br> <br> Lastly, notice how the distance from the eye to the reflected image is always the same as the total distance traveled by the real ray.")  
}

function convex(){
  mirrors = [convexMirror]
  planeMode = false;
  prompt.html("When dealing with spherical mirrors, finding the distance of reflected images isn't as straightforward, and unlike flat mirrors, the size of the reflected images are different from the actual objects. With a convex mirror, like the one shown here, light rays are reflected outward when they hit the mirror surface. If you extend the reflected rays past the mirror, the point where they intersect is where the image is formed. <br> <br> Try changing the curvature of the mirror with the slider or dragging the object closer or further away from the mirror. How does it affect the reflected image?");
}

function concave(){
  mirrors = [concaveMirror]
  planeMode = false;
  prompt.html("Work in progress");
}

function draw() {
  background(255);

  // Plane mirror interactives:
  if (planeMode) { 
    radSlider.hide();
    obj.setPosition(objPos);
    obj.displayObj();
    ray.calcRay(mirrors, viewer);  // Calculate light ray, controlled by mouse 
    ray.displayDetails();
    mirrors.forEach(mirror => {
      mirror.display();
    })
    ray.display();
    obj.displayRefPlane(ray);
    viewer.display();
    viewer.move();

  }

  // Spherical mirror interactives:
  else {
    radSlider.show();
    mirrors.forEach(mirror => {    // Considering only one spherical mirror per interactive for now
      mirror.modifyCurve();        // Change curvature of mirror using slider
      obj.displayObj();
      mirror.displayDetails();     // Display attributes, eg focal point and overall sphere that the mirror is a part of
      mirror.display();
      obj.moveX(mirror);           // Drag object closer/further from mirror
      pRay.calcRays(obj, mirror);  // Calculate principal rays to find position and size of reflected image 
      pRay.display();
      obj.displayRefCurve(pRay);
    })
  }
}