// @author yomotsu
// MIT License
( function ( ns ) {
  const MOUSE_ACCELERATION_X = 100;
  const MOUSE_ACCELERATION_Y = 50;

  // camera              isntance of THREE.Camera
  // params.el           DOM element
  // params.center       instance of THREE.Vector3
  // params.raduis       number
  // params.minRaduis    number
  // params.maxRaduis    number
  // params.rigidObjects array of inctances of THREE.Mesh
  var SphereCamera = function ( camera, params ) {
    this.camera = camera;
    this.el           = params && params.el || window;
    this.$el          = $( this.el );
    this.center       = params && params.center || new THREE.Vector3();
    this.raduis       = params && params.raduis || 10;
    this.minRaduis    = params && params.minRaduis || 1;
    this.maxRaduis    = params && params.maxRaduis || 30;
    this.rigidObjects = params && params.rigidObjects || [];
    this.lat = 0;
    this.lon = -90;
    this._pointerStart = { x: 0, y: 0 };
    this._pointerLast  = { x: 0, y: 0 };

    this._mousedownListener = onmousedown.bind( this );
    this._mouseupListener   = onmouseup.bind( this );
    this._mousedragListener = onmousedrag.bind( this )
    this._scrollListener    = onscroll.bind( this );

    this.el.addEventListener( 'mousedown', this._mousedownListener, false );
    this.el.addEventListener( 'mouseup',   this._mouseupListener,   false );
    this.el.addEventListener( 'mousewheel',     this._scrollListener, false );
    this.el.addEventListener( 'DOMMouseScroll', this._scrollListener, false );

    this.update();
  }

  SphereCamera.prototype.update = function () {
    // angle of zenith
    var phi = THREE.Math.degToRad( this.lat );
    // angle of azimuth
    var theta = -1 * THREE.Math.degToRad( this.lon );
    var distance = this.collisionTest();

    var position = new THREE.Vector3( 
      Math.cos( phi ) * Math.cos( theta ), 
      Math.sin( phi ), 
      Math.cos( phi ) * Math.sin( theta )
    ).multiplyScalar( distance );
    position = position.addVectors( position, this.center );
    this.camera.position = position;
    if ( this.lat === 90 ) {
      this.camera.up.set(
        Math.cos( theta +  THREE.Math.degToRad( 180 ) ),
        0,
        Math.sin( theta +  THREE.Math.degToRad( 180 ) )
      );
    } else if ( this.lat === -90 ) {
      this.camera.up.set(
        Math.cos( theta ),
        0,
        Math.sin( theta )
      );
    } else {
      this.camera.up.set( 0, 1, 0 );
    }
    this.camera.lookAt( this.center );
  }

  SphereCamera.prototype.collisionTest = function ( direction ) {
    if ( this.rigidObjects.length === 0 ) {
      return this.raduis;
    }
    var direction = new THREE.Vector3(
      this.camera.position.x - this.center.x,
      this.camera.position.y - this.center.y,
      this.camera.position.z - this.center.z
    ).normalize();
    var raycaster = new THREE.Raycaster(
      this.center,    // origin
      direction,      // direction
      this.minRaduis, // near
      this.raduis     // far
    );
    var intersects = raycaster.intersectObjects( this.rigidObjects );
    if ( intersects.length >= 1 ){
      return intersects[ 0 ].distance;
    } else {
      return this.raduis;
    }
  };

  function onmousedown () {
    this._pointerStart.x = event.clientX;
    this._pointerStart.y = event.clientY;
    this._pointerLast.x = this.lon;
    this._pointerLast.y = this.lat;
    this.el.removeEventListener( 'mousemove', this._mousedragListener, false );
    this.el.addEventListener( 'mousemove', this._mousedragListener, false );
  }

  function onmouseup () {
    this.el.removeEventListener( 'mousemove', this._mousedragListener, false );
  }

  function onmousedrag () {
    var w = this.$el.width();
    var h = this.$el.height();
    var x = ( this._pointerStart.x - event.clientX ) / w * 2;
    var y = ( this._pointerStart.y - event.clientY ) / h * 2;
    this.lon = this._pointerLast.x + x * MOUSE_ACCELERATION_X;
               this.lon;
    this.lat = this._pointerLast.y + y * MOUSE_ACCELERATION_Y;
    this.lat = this.lat >  90 ?  90 :
               this.lat < -90 ? -90 :
               this.lat;
    this.update();
  }

  function onscroll () {
    event.preventDefault();
    // WebKit
    if ( event.wheelDeltaY ) {
      this.raduis -= event.wheelDeltaY * 0.05 / 5;
    // IE
    } else if ( event.wheelDelta ) {
      this.raduis -= event.wheelDelta * 0.05 / 5;
    // Firefox
    } else if ( event.detail ) {
      this.raduis += event.detail / 5;
    }
    this.raduis = Math.max( this.raduis, this.minRaduis );
    this.raduis = Math.min( this.raduis, this.maxRaduis );
    this.update();
  }

  // export
  ns.SphereCamera = SphereCamera;
} )( window );