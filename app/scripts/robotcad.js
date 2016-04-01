
'use strict';

var CadViewer = function(target, path) {
    this.container = document.getElementById(target);
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 10, 4000);
    this.camera.up.set(0, 0, 1);
    this.camera.position.z = 800;
    this.camera.position.x = 1000;

    this.controls = new THREE.TrackballControls(this.camera, this.container);

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0x505050));

    this.spotLight = new THREE.SpotLight(0xE0E0E0, 1, 0, THREE.Math.degToRad(40));
    this.spotLight.position.set(800, 0, 800);
    this.spotLight.castShadow = true;
    this.spotLight.shadow.camera.near = 400;
    this.spotLight.shadow.camera.far = 1600;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.scene.add(this.spotLight);

    this.spotLight2 = new THREE.SpotLight(0xeedcb3, 1, 0, THREE.Math.degToRad(60));
    this.spotLight2.position.set(0, 0, -100);
    this.spotLight2.castShadow = true;
    this.spotLight2.shadow.camera.near = 50;
    this.spotLight2.shadow.camera.far = 200;
    this.spotLight2.shadow.camera.fov = 120;
    this.spotLight2.shadow.mapSize.width = 1024;
    this.spotLight2.shadow.mapSize.height = 1024;
    this.scene.add(this.spotLight2);

    /*
        var spotLightShadowHelper = new THREE.CameraHelper(this.spotLight2.shadow.camera);
        this.scene.add(spotLightShadowHelper);
        var spotLightHelper = new THREE.SpotLightHelper(this.spotLight2);
        this.scene.add(spotLightHelper);
    */
    if (path) {
        this.loadOBJ(path);
    }
};


CadViewer.prototype.loadOBJ = function(path) {
    var onProgress = function(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    var onError = function(xhr) {
        console.log(xhr);
    };

    var objLoader = new THREE.OBJLoader();
    var self = this;
    objLoader.load(path, function(object) {
        self.object = object;
        object.receiveShadow = true;
        object.castShadow = true;
        object.children.forEach(function(obj) {
            obj.receiveShadow = true;
            obj.castShadow = true;
        });
        self.scene.add(object);
    }, onProgress, onError);

    this.plane = new THREE.Mesh(
        /*new THREE.PlaneGeometry(1000, 1000, 10, 10),*/
        new THREE.CylinderGeometry(500, 500, 10, 50),
        new THREE.MeshLambertMaterial({ color: 0xdddddd })
    );
    this.plane.rotation.x = Math.PI / 2;
    this.plane.position.z = -100;
    this.plane.receiveShadow = true;
    this.scene.add(this.plane);
};

CadViewer.prototype.animate = function() {
    this.controls.update();
    if (this.object) {
        this.object.rotation.z += 0.005;
    }
    this.render();
};

CadViewer.prototype.render = function() {
    this.renderer.render(this.scene, this.camera);
};
