SphereCamera for three.js
===========

SphereCamera class provides a camera which move around a sphere, like TPS games, for three.js.

## Usage

include SphereCamera.js with three.js and jQuery

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="js/three.min.js"></script>
<script src="js/SphereCamera.js"></script>
```

and then, write some code with SphereCamera class.

```html
<script>
var width = window.innerWidth,
    height = window.innerHeight,
    camera,
    scene,
    renderer,
    mesh,
    sphereCamera;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera( 75, width / height, 1, 10000 );
  scene = new THREE.Scene();

  mesh = new THREE.Mesh(
    new THREE.CubeGeometry( 200, 200, 200 ),
    new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } )
  );
  scene.add( mesh );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( width, height );
  document.body.appendChild( renderer.domElement );

  var params = {
    radius    : 300,
    minRadius : 200,
    maxRadius : 1000
  };
  sphereCamera = new SphereCamera( camera, params );
 }

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}
</script>
```

then after, you will control camera with mouse drag / wheel, like [the result](http://yomotsu.github.io/SphereCamera/example/demo1.html).

## Params

following params are available.

```
el                 | DOM element for draggable area
center             | center position of sphereCamera
radius             | radius from the center of sphereCamera ( higher than 0 )
minRadius          | minimum radius when zooming in  ( higher than 0 )
maxRadius          | maximum radius when zooming out ( higher than 0 )
rigidObjects       | collision target objects
mouseAccelerationX | mouse acceleration for horizontal
mouseAccelerationY | mouse acceleration for vertical
```

## Method

instance.getFrontAngle() | you'll get front angle in degrees
instance.update()        | when you changed params manually, use `update`

## Demos

to see more details, following demos are available.

- [objects colliding](http://yomotsu.github.io/SphereCamera/example/demo2.html)
- [while moving](http://yomotsu.github.io/SphereCamera/example/demo3.html)
- [input from UI](http://yomotsu.github.io/SphereCamera/example/demo4.html)
- [events](http://yomotsu.github.io/SphereCamera/example/demo5.html)