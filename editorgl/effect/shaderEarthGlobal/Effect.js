/**
 * 效果模板 - 测试 by zhoupu
 */
import glUtil from '../../utils';
import EffectBase from '../../src/EffectBase';
import TWEEN from '../../utils/detail/Tween';

class ShaderEarthGlobal extends EffectBase {
    constructor(render) {
        super(render);

        this.animate = (/* dt, clock */) => {
            if (!this.config.isAnimate) return; // eslint-disable-line
            TWEEN.update();
            /**
             *  do something
             */
        };
    }

    // 添加默认参数
    setDefaultConfig(dfConfig) {
        glUtil.copy(dfConfig, {});
        // console.log('----dfConfig--', dfConfig); // eslint-disable-line
    }

    // 销毁
    disposeCompEft() {
        this.canvasDom = null;
    }

    // 效果初始化
    compEftInit() {
        // console.log(this); // eslint-disable-line
        const earth = this.getEarth();
        this.group.add(earth);

        if (this.config.hasGlow) {
            const earthGlow = this.createEarthGlow();
            this.group.add(earthGlow);
        }

        if (this.config.isCompEvents) {
            this.canvasDom = this.createImageCanvas(this.config.earthImage);
        }
        this._triggerInnerEvent('mounted', { val: this.config.name });
    }

    /**
     * 通过imgDom创建canvas
     * @param {*} imgUrl 图片地址
     */
    createImageCanvas(imgUrl) {
        const cvs = document.createElement('canvas');
        const c = cvs.getContext('2d');
        const img = new Image();

        img.src = imgUrl;
        img.onload = () => {
            cvs.width = img.width;
            cvs.height = img.height;
            c.drawImage(img, 0, 0, cvs.width, cvs.height);
        };
        return cvs;
    }

    // 点击事件
    onClick(...arg) {
        const obj = arg[1][0];
        if (!obj || obj.object.parent.name !== '地球球体') {
            return [arg[0]];
        }
        const { uv } = obj;
        const clickColor = glUtil.getUvPickColor(this.canvasDom, uv);
        const mtl = this.group.children[0].children[0].material;
        if (clickColor.a === 0) {
            return [arg[0]];
        }
        mtl.uniforms.u_color.value = new THREE.Color(clickColor.hex);
        mtl.uniforms.u_opacity.value = clickColor.a;
        mtl.uniforms.u_state.value = false;

        const distMapData = this.config.distMap[clickColor.hex];
        this.setCameraAni(distMapData.camera, distMapData.target);
        return [arg[0], distMapData.name, clickColor];
    }

    // 设置相机动画
    setCameraAni(cameraPos) {
        // 目前target都是0， 暂不书写
        const curPos = this.renderer.getCameraParams().position;
        let self = this;
        new TWEEN.Tween(curPos).to(cameraPos).easing(TWEEN.Easing.Linear.None).onUpdate(function(a) {
            self.renderer.setCameraParams({
                position: this
            });
        }).onComplete(() => {
            self = null;
        }).start();
    }

    // 创建地球球体
    getEarth() {
        const earthObject = glUtil.obj('地球球体');
        const earthTexture = this.renderer._Txues.loadTexture({
            id: glUtil.creatId('txue'),
            url: this.config.earthImage,
            isRepeat: false
        });
        const earthGeo = glUtil.geo.sphere(this.config.radius, 64, 64);
        const globalMtl = glUtil.mtl.shader({
            uniforms: {
                u_color: {
                    value: new THREE.Color(0xffffff)
                },
                u_state: {
                    value: true
                },
                u_opacity: {
                    value: 1.0
                },
                u_map: {
                    value: earthTexture
                }
            },
            transparent: true,
            // blending: THREE.CustomBlending,
            side: THREE.DoubleSide, // FrontSide
            // depthWrite: false,
            vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
            }`,
            fragmentShader: `uniform vec3 u_color;
            uniform float u_opacity;
            uniform sampler2D u_map;
            uniform bool u_state;
            varying vec2 vUv;
            bool nerCheck(float wColor, float hColor) {
                return abs(wColor - hColor) < 0.1;
            }
            void main() {
                vec4 _map = texture2D(u_map, vUv);
                if (u_state) {
                    gl_FragColor = vec4(u_color, u_opacity) * _map;
                } else if (nerCheck(u_color.r, _map.r) && nerCheck(u_color.g, _map.g) && nerCheck(u_color.b, _map.b)) {
                    gl_FragColor = vec4(u_color, 1.0) *_map;
                } else {
                    gl_FragColor = vec4(u_color, 0.0) *_map;
                }
            }`
        });
        // earthInnerMaterial.needsUpdate = true;
        const earthMesh = new THREE.Mesh(earthGeo, globalMtl);
        earthObject.add(earthMesh);
        if (this.config.isCompEvents) {
            this.eventArr.push(earthMesh);
        }
        return earthObject;
    }

    createEarthGlow() {
        // EARTH GLOW
        const earthGlowSize = this.config.radius * 2.0 + 80;
        const earthGlowTexture = this.renderer.getTxue(this.config.glowTxueId);
        earthGlowTexture.anisotropy = 4;

        // earthGlowTexture.wrapS = earthGlowTexture.wrapT = THREE.RepeatWrapping;
        // earthGlowTexture.minFilter = THREE.NearestMipMapNearestFilter;

        const earthGlowBufferGeometry = new THREE.PlaneBufferGeometry(earthGlowSize, earthGlowSize, 1, 1);
        const earthGlowMaterial = new THREE.MeshBasicMaterial({
            map: earthGlowTexture,
            color: new THREE.Color(this.config.glowColor),
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const earthGlowMesh = new THREE.Mesh(earthGlowBufferGeometry, earthGlowMaterial);
        earthGlowMesh.name = 'earthGlowMesh';
        // earthGlowMesh.lookAt(-89.8, 171.0, -211.1);
        return earthGlowMesh;
    }
}

export default ShaderEarthGlobal;
