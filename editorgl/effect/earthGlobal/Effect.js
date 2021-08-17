/**
 * 效果模板 - 测试 by zhoupu
 */
import glUtil from '../../utils';
import EffectBase from '../../src/EffectBase';

class EarthGlobal extends EffectBase {
    constructor(render) {
        super(render);

        this.animate = (/* dt, clock */) => {
            if (!this.config.isAnimate) return; // eslint-disable-line
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

        this._triggerInnerEvent('mounted', { val: this.config.name });
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
        const globalMtl = glUtil.mtl.basic({
            map: earthTexture,
            transparent: true,
            // blending: THREE.CustomBlending,
            side: THREE.FrontSide, // FrontSide
            depthWrite: false
            // depthTest: false
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

export default EarthGlobal;
