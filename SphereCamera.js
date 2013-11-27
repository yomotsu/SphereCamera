// MIT License @yomotsu
function SphereCamera ( scene, camera ) {
  this.center = new THREE.Object3D();
  this.scene = scene;
  this.camera = camera;
  this.phi = 0;   // zenith angle ( 天頂角 )
  this.theta = 0; // azimuth angle ( 方位角 )
  this.r = 10;    // radius ( 半径 )

  this.scene.remove( this.camera );
  this.center.add( this.camera );
  this.scene.add( this.center );
  this.camera.position.set( 0, 0, this.r );
}

SphereCamera.prototype.setPhi = function ( phi ) {
  this.phi = phi;
  this.update();
}

SphereCamera.prototype.setTheta = function ( theta ) {
  this.theta = theta;
  this.update();
}

SphereCamera.prototype.setDistance = function ( r ) {
  this.r = r;
  this.update();
}

SphereCamera.prototype.update = function () {
  var theta = this.theta * Math.PI / 180;
  var phi   = this.phi   * Math.PI / 180;
  var qBase = new THREE.Quaternion();
  var qHorizontal = new THREE.Quaternion();
  var qVertical = new THREE.Quaternion();
  var axisX = new THREE.Vector3( 1, 0, 0 );
  var axisY = new THREE.Vector3( 0, 1, 0 );

  qHorizontal.setFromAxisAngle( axisY, theta );
  qVertical.setFromAxisAngle( axisX, phi );
  qBase.multiplyQuaternions( qBase, qHorizontal );
  qBase.multiplyQuaternions( qBase, qVertical );
  this.center.quaternion = qBase;
  this.camera.lookAt( this.center.position );
  this.camera.position.z = this.r;
}