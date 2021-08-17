/**
 * 入场动画
 */
import './three-conic-polygon-geometry';
import EffectBase from '../../src/EffectBase';
import glUtil from '../../utils';
import chinaGeoJson from './china.json';

class Component extends EffectBase {
    constructor(render) {
        super(render);

        this.animate = (dt) => {
            if (!this.config.isAnimate) return; // eslint-disable-line
            if (!this._Clouds) return;
            this._Clouds.rotation.y -= dt * 0.1;
            // return;
            const {
                path, perTimes = 0, transTimes = 0, animateEnd = false
            } = this.renderer.camera.userData;
            if (this.isStart) {
                if (transTimes <= perTimes + dt) {
                    // -设置转场动画
                    const k = Math.min(1, transTimes / perTimes);
                    const position = path.getPointAt(glUtil.easing(k, 'Sinusoidal.In'));
                    this.renderer.camera.position.copy(position);
                    this.renderer.camera.userData.transTimes += dt;
                    if (k > 0.95) {
                        this._Sphere.material.transparent = true;
                        this.group.traverse((child) => {
                            if (child.material && child._opacity) {
                                const _k = glUtil.easing((1 - k) * 20, 'Quadratic.Out');
                                if (!child.material.uniforms) child.material.opacity = child._opacity * _k;
                                else child.material.uniforms.u_opacity.value = child._opacity * _k;
                            }
                        });
                    }
                } else if (!animateEnd) {
                    this.renderer.camera.userData.animateEnd = true;
                    this._triggerInnerEvent('endCallBack', { });
                }
            }
        };
    }

    // 销毁
    disposeCompEft() {
        this.isStart = false;
        this._Clouds = null;
    }

    // 效果初始化
    compEftInit() {
        // 存储初始的相机参数和target参数
        const { renderer } = this;
        this.defaultConfig = {
            camera: {
                near: renderer.camera.near,
                fov: renderer.camera.fov,
                far: renderer.camera.far,
                position: renderer.camera.position.clone()
            },
            target: renderer.controls.target.clone()
        };

        this.isStart = this.config.start || false;

        this.baseInit();
        this._triggerInnerEvent('mounted', { val: this.config.name });
    }

    // 初始化
    baseInit() {
        // -创建球体
        const {
            showMaps = false,
            earth = {},
            defaultPosition = { x: 0, y: 0, z: 0 },
            cameraRadius = 43, lngLat = { lng: 105, lat: 43 }
        } = this.config;
        const { radius = 100 } = earth;
        const geometry = new THREE.SphereBufferGeometry(radius, 64, 64);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 1,
            metalness: 0,
            side: THREE.DoubleSide,
            map: this.renderer.getTxue('em_color'),

            normalMap: this.renderer.getTxue('em_normal'),
            normalScale: new THREE.Vector2(1, -1),

            displacementMap: this.renderer.getTxue('em_display'),
            displacementScale: 0.05,

            aoMap: this.renderer.getTxue('em_aomap'),
            aoMapIntensity: 1
            // transparent: true
        });
        // -创建地球
        const sphere = new THREE.Mesh(geometry, material);
        sphere.renderOrder = 20;
        this._Sphere = sphere;
        sphere._opacity = 1;
        sphere.rotation.y = -Math.PI / 2;
        this.group.add(sphere);

        // -创建云层
        const clouds = new THREE.Mesh(
            geometry,
            new THREE.MeshLambertMaterial({
                blending: THREE.AdditiveBlending,
                map: this.renderer.getTxue('em_cloud'),
                transparent: true,
                depthWrite: false,
                opacity: 0.3
            })
        );
        clouds.scale.setScalar(1.07);
        clouds.renderOrder = 20;
        clouds._opacity = 0.3;
        this.group.add(clouds);
        this._Clouds = clouds;

        // -绑定球体的动画参数
        sphere.position.copy(defaultPosition);

        this.renderer.camera.userData.lastPosition = this.renderer.camera.position.clone();

        this.renderer.camera.userData.path = this.createPath(cameraRadius, radius, lngLat);

        this.renderer.camera.position.set(0, 0, cameraRadius);

        this.renderer.camera.userData.perTimes = 5;
        this.renderer.camera.userData.transTimes = 0;

        this.createMaps(chinaGeoJson, { showMaps, radius });
    }

    /**
     * @description: 根据经纬度计算相机路径
     * @param {*} radius
     * @param {*} earthRadius
     * @param {*} lnglat
     * @return {*}
     */
    createPath(radius, earthRadius, lnglat) {
        const { lng = 0, lat = 0 } = lnglat;
        const radUnit = Math.PI / 180;
        const lngRad = lng * radUnit;
        const latRad = lat * radUnit;

        const position = new THREE.Vector3(earthRadius * Math.sin(lngRad), earthRadius * Math.sin(latRad), earthRadius * Math.cos(lngRad));
        // -计算水平圆弧
        const horCurve = new THREE.EllipseCurve(0, 0, radius, radius, 0, lngRad, false);
        // -竖直圆弧
        const verCurve = new THREE.EllipseCurve(0, 0, radius, radius, 0, latRad, false);
        const hor2dPoints = horCurve.getPoints(100);
        const ver2dPoints = verCurve.getPoints(100);
        // -通过EllipseCurve获取的是二维点，需要通过旋转来得到三维的点
        let horMatrix = new THREE.Matrix4().makeRotationZ(-Math.PI / 2);
        horMatrix = horMatrix.premultiply(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        let verMatrix = new THREE.Matrix4().makeRotationY(-Math.PI / 2);
        verMatrix = verMatrix.multiply(new THREE.Matrix4().makeRotationY(lngRad));
        const vectors = [];
        hor2dPoints.forEach((point) => {
            const vector = new THREE.Vector3(point.x, point.y, 0);
            vector.applyMatrix4(horMatrix);
            vectors.push(vector);
        });
        ver2dPoints.forEach((point) => {
            const vector = new THREE.Vector3(point.x, point.y, 0);
            vector.applyMatrix4(verMatrix);
            vectors.push(vector);
        });
        // -最后加上通过经纬度得到的实际位置
        vectors.push(position);
        return new THREE.CatmullRomCurve3(vectors);
    }

    createMaps(datas, opts) {
        const mapObj = new THREE.Group();
        mapObj.visible = !!opts.showMaps;

        const mtlTop = glUtil.mtl.basic({
            color: this.config.baseColor || '#004933',
            transparent: true,
            opacity: 0.45,
            side: THREE.DoubleSide // blending: THREE.AdditiveBlending,
        });
        const mtlSide = glUtil.mtl.basic({
            color: '#5B5C53',
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this._testTopMtl = mtlTop;
        this._mapObj = mapObj;

        this.mapsObj = {};
        datas.features.forEach((feature) => {
            const coords = feature.geometry.coordinates;
            const testArr = [];
            coords.forEach((coord) => {
                const geoOjb = THREE.getMapGeo(coord, opts.radius + 0.06, opts.radius + 0.08, false, true, true);

                const myMeshTop = new THREE.Mesh(geoOjb.topGeo, mtlTop);
                const myMeshSide = new THREE.Mesh(geoOjb.sideGeo, mtlSide);
                myMeshTop._opacity = 0.45;
                myMeshSide._opacity = 1;

                mapObj.add(myMeshTop, myMeshSide);
                testArr.push(myMeshTop);
            });
            this.mapsObj[feature.properties.NAME || 'test'] = testArr;
        });
        // mapObj.rotation.y = 1.5708;
        this.group.add(mapObj);

        /*
        Object.keys(this.mapsObj).some((key) => {
            if (glUtil.checkStr(key, '四川省')) {
                this.mapsObj[key].forEach((m) => {
                    m.material = this._testTopMtl.clone();
                    m.material.color.set(this.config.lightColor || '#B1AC07');
                    m.material.opacity = 0.8;
                    m._opacity = 0.8;
                });
                return true;
            }
        });
        */
        // console.log(datas, this.mapsObj);
    }

    start(name) {
        this.isStart = true;
        this.renderer.camera.position.copy(new THREE.Vector3(0, 0, 43));
        if (!name) return;
        this._mapObj.visible = true;
        Object.keys(this.mapsObj).some((key) => {
            if (glUtil.checkStr(key, name)) {
                this.mapsObj[key].forEach((m) => {
                    m.material = this._testTopMtl.clone();
                    m.material.color.set(this.config.lightColor || '#B1AC07');
                    m.material.opacity = 0.8;
                    m._opacity = 0.8;
                });
                return true;
            }
            return false;
        });
    }

    repeatOnce() {
        this._Sphere.material.transparent = false;
        this.renderer.camera.userData.perTimes = 5;
        this.renderer.camera.userData.transTimes = 0;
        this.renderer.camera.userData.animateEnd = false;
        this.renderer.camera.position.copy(this.renderer.camera.userData.lastPosition);
        this.group.traverse((child) => {
            if (child.material && child._opacity) {
                if (!child.material.uniforms) child.material.opacity = child._opacity;
                else child.material.uniforms.u_opacity.value = child._opacity;
            }
        });
    }

    setConfig(type, options) {
        if (this[type]) this[type](options);
    }
}

export default Component;
