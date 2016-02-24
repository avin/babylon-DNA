import _ from 'lodash';

import Ball from './Ball';
import BallLine from './BallLine';

export default class {

    constructor() {
        this.container = null;
        this.canvas = null;
        this.engine = null;
        this.scene = null;
        this.debug = null;
        this.camera = null;
        this.mainLight = null;
        this.subLight = null;
        this.time = 0.0;

        this.ballLines = [];
        this.balls = [];
    }


    /**
     * @param container
     * @param onInit
     */
    initialize(container, onInit) {

        this.canvas = container;
        this.engine = new BABYLON.Engine(this.canvas, true);

        //On resize event
        window.addEventListener('resize', () => {
            this.engine.resize();
        });


        onInit.call(this);
    }


    /**
     * Init scene
     * @param cb
     */
    loadScene(cb) {

        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        //this.scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.2);

        this.scene.debugLayer.show();

        this.addCamera();
        this.addLight();

        // Generate all source meshes

        let redBall = BABYLON.Mesh.CreateSphere("mainBall", 5, 1, this.scene, false);
        //let redBall = BABYLON.Mesh.CreateBox("mainBall", 1, this.scene, false);
        redBall.scaling = new BABYLON.Vector3(0, 0, 0);
        redBall.material = new BABYLON.StandardMaterial('red', this.scene);
        redBall.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        redBall.material.specularColor = new BABYLON.Color4(0.5, 0.5, 0.5, 0);
        redBall.material.useGlossinessFromSpecularMapAlpha = true;
        redBall.material.alpha = 0.8;
        redBall.material.freeze();


        //Black ball
        let blackBall = BABYLON.Mesh.CreateSphere('blackBall', 5, 1, this.scene, false);
        //let blackBall = BABYLON.Mesh.CreateBox("mainBall", 1, this.scene, false);
        blackBall.material = new BABYLON.StandardMaterial('blackBallMaterial', this.scene);
        blackBall.material.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.5);
        blackBall.scaling = new BABYLON.Vector3(0, 0, 0);
        blackBall.material.specularColor = new BABYLON.Color4(0.5, 0.5, 0.5, 0.5);
        blackBall.material.useGlossinessFromSpecularMapAlpha = true;
        blackBall.material.freeze();

        //Medium ball
        let mediumBall = BABYLON.Mesh.CreateSphere('mediumBall', 5, 1, this.scene, false);
        //let mediumBall = BABYLON.Mesh.CreateBox("mainBall", 1, this.scene, false);
        mediumBall.material = new BABYLON.StandardMaterial('mediumBallMaterial', this.scene);
        mediumBall.material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.7);
        mediumBall.scaling = new BABYLON.Vector3(0, 0, 0);
        mediumBall.material.specularColor = new BABYLON.Color4(0.5, 0.5, 0.5, 0.5);
        mediumBall.material.useGlossinessFromSpecularMapAlpha = true;
        mediumBall.material.freeze();

        //Light ball
        let lightBall = BABYLON.Mesh.CreateSphere('lightBall', 5, 1, this.scene, false);
        //let lightBall = BABYLON.Mesh.CreateBox("mainBall", 1, this.scene, false);
        lightBall.material = new BABYLON.StandardMaterial('lightBallMaterial', this.scene);
        lightBall.material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 1);
        lightBall.scaling = new BABYLON.Vector3(0, 0, 0);
        lightBall.material.specularColor = new BABYLON.Color4(0.5, 0.5, 0.5, 0.5);
        lightBall.material.useGlossinessFromSpecularMapAlpha = true;
        lightBall.material.freeze();

        // Generate instanced objects

        let lineBalls = {blackBall, mediumBall, lightBall};

        let ball;
        for (let i = -20; i < 20; i++) {
            let parentMesh = new BABYLON.AbstractMesh('part', this.scene);

            //Draw 2 red balls

            ball = new Ball(this, new BABYLON.Vector3(-8, 0, 0), redBall);
            _.each(ball.balls, (ball) => {
                ball.parent = parentMesh;
            });
            this.balls.push(ball);

            ball = new Ball(this, new BABYLON.Vector3(8, 0, 0), redBall);
            _.each(ball.balls, (ball) => {
                ball.parent = parentMesh;
            });
            this.balls.push(ball);

            //Draw line

            let ballLine = new BallLine(this, [-7, 7], lineBalls);
            this.ballLines.push(ballLine);
            _.each(ballLine.balls, (ball) => {
                ball.parent = parentMesh;
            });
            _.each(ballLine.randomBalls, (ball) => {
                ball.parent = parentMesh;
            });

            //Set position and rotation to parentMesh
            parentMesh.position = new BABYLON.Vector3(0, i * 2, 0);
            parentMesh.rotation = new BABYLON.Vector3(0, i / 5, 0);
        }

        // ============================

        this.scene.beforeRender = () => {
            let delta = this.engine.getDeltaTime() / 1000.0;
            this.time += delta;

            this.update(delta, this.time);
        };

        if (_.isFunction(cb)) {
            cb(this.scene);
        }
    }

    /**
     * Add light to scene
     */
    addLight() {
        this.mainLight = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), this.scene);
        this.mainLight.position = new BABYLON.Vector3(20, 200, 20);
        this.mainLight.intensity = 0.2;

        this.subLight = new BABYLON.PointLight("subLight", new BABYLON.Vector3(1, 10, 1), this.scene);
        this.subLight.intensity = 0.5;

        //Sublight position changes with camera
        this.subLight.position = this.camera.position;

    }

    /**
     * Add active camera
     */
    addCamera() {
        this.camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0.0, 0.0, 0.0), this.scene);

        //Начальная Позиция камеры (сверху немного на удалении от центра)
        this.camera.position.x = 10;
        this.camera.position.y = 10;
        this.camera.position.z = 10;

        //Направление камеры (смотрим вниз в центр карты)
        this.camera.setTarget(new BABYLON.Vector3(0.0, 0, -1));

        this.scene.activeCamera = this.camera;

        this.scene.activeCamera.attachControl(this.canvas);

        this.camera.setTarget(new BABYLON.Vector4.Zero());

    }

    /**
     * Init update of elements on scene
     * @param delta
     * @param time
     */
    update(delta, time) {
        //return false;
        this.updateCameraPosition(delta, time);

        _.each(this.ballLines, (ballLine) => {
            ballLine.update(delta, time);
        });

        _.each(this.balls, (ball) => {
            ball.update(delta, time);
        });

    }

    /**
     * Update camera position
     * @param delta
     * @param time
     */
    updateCameraPosition(delta, time) {
        this.camera.position.x = Math.sin(time / 2) * 30;
        this.camera.position.z = Math.cos(time / 2) * 30;
        this.camera.position.y = Math.cos(time / 3) * 30;
        this.camera.setTarget(new BABYLON.Vector3(0, 0, 0));

        this.camera.fov = Math.sin(time / 5) / 4 + 1;
    }

    /**
     * Start render loop
     */
    run() {
        this.engine.runRenderLoop(() => {
            if (this.scene) {
                this.scene.render();
            }
        });
    }
}