/**
 * @Author zhoupu
 * 渲染器基础类, 提供基础api
 */
import glUtil from '../../utils';
import Base from './Base';
import Textures from './Textures';
import BaseEvent from './BaseEvent';
import { DFConfig } from './comConfig';

export default class renderers extends Base {
    constructor() {
        super();

        this.GId = ''; // 容器ID
        this.width = 0.01; // 宽度，默认0.01
        this.height = 0.01; // 高度，默认0.01

        this.clock = null; // 动画时钟
        this.renderer = null; // 渲染器
        this.container = null; // 容器节点
        this.composer = null; // 后期处理

        this.subAnimateArr = []; // 动画数组，渲染函数
        this.subCompEffects = {}; // 注册组件效果 { id: instance }
        this.subCompEffectArr = []; // 组件效果数组保存，渲染和操作

        this.isInit = false; // 是否初始化标识
        this._Txues = new Textures(this); // 纹理管理对象
        this._Events = new BaseEvent(this); // 事件处理对象
    }

    /**
     * [init 容器初始化入口]
     * @DateTime 2021-01-28
     * @param    {[object]}    config       [配置参数 {} ]
     * @param    {[object]}    txueOpts     [纹理配置参数 {} ]
     */
    init(config, txueOpts) {
        this.parentCont = this.parseCts(config.cts); // 解析生成容器
        if (window._isSupportWebGL && this.parentCont !== null) {
            try {
                this.setLifecycle(config);
                this.parentCont.innerHTML = '';
                this._triggerInnerEvent('beforeInit', config, txueOpts); // - 生命周期 初始化前

                this.typeConfig(config, DFConfig); // base
                this.GId = glUtil.creatId(this.parentCont.id || 'render');
                this.container = this.creatContainer(this.GId);
                this.parentCont.appendChild(this.container);

                this.initiate(txueOpts);
                window.requestAnimationFrame(() => { this.renderers(); });  // 异步执行
                this._triggerInnerEvent('afterInit', this.config); // - 生命周期 初始化后
            } catch (e) {
                this.onError({ errorType: 1, describe: 'Initialization Error!' }); // 初始化错误
            }
        } else {
            this.onError({ errorType: 2, describe: 'Not Support WebGL!' }); // 不支持webgl
        }
    }

    // [onError 执行错误返回值, { errorType-错误类别, describe-错误描述 }]
    onError(/* { errorType, describe } */) {}

    /**
     * [initTxue 初始化纹理]
     * @DateTime 2021-08-05
     * @param    {[object]}   options [纹理配置参数]
     */
    initTxue(options) {
        this._Txues.init(options);
    }

    /**
     * [dispose 渲染器销毁入口]
     * @DateTime 2021-01-28
     */
    dispose() {
        if (this.isInit && this.testing()) {
            this._triggerInnerEvent('beforeDispose'); // 生命周期 容器销毁前
            this.isInit = false;
        }
    }

    /**
     * [setRenderSize 容器宽高重置]
     * @DateTime 2021-01-28
     * @param    {[number]}   w [宽度值]
     * @param    {[number]}   h [高度值]
     */
    setRenderSize(w, h) {
        const { nw, nh, rs } = this.getWH(w, h);
        if (!rs) return;
        if (this.isInit) {
            this.renderer.setSize(nw, nh);
            if (this.composer) this.composer.setSize(nw, nh);
        }
        if (this.camera) {
            this.camera.aspect = nw / nh;
            this.camera.updateProjectionMatrix();
        }
    }

    // ---------内部---------
    /**
     * [initiate 渲染器初始化，renderType区分不同的渲染类别]
     * @DateTime 2021-01-28
     */
    initiate(txueOpts) {
        this.getWH();
        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();

        // - renderer
        const [bg, cArr = glUtil.getColorArr(bg.color)] = [this.config.background];
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.shadowMap.enabled = this.config.shadow; // 是否支持阴影
        this.renderer.toneMapping = this.config.tone.toneMapping; // 色调
        this.renderer.toneMappingExposure = this.config.tone.toneMappingExposure;
        // this.renderer.sortObjects = true;
        this.renderer.setPixelRatio(this.config.devicePixelRatio); // 屏幕像素比
        this.renderer.setClearColor(cArr[0], bg.opacity);
        this.renderer.setSize(this.width, this.height);
        this.container.appendChild(this.renderer.domElement);

        // - txue & event
        this._Txues.init(txueOpts);
        this._Events.init(this.config.isViewport);

        // - fog
        const { fog } = this.config;
        if (fog && fog.creat) {
            this.scene.fog = new THREE.Fog(new THREE.Color(fog.color), fog.near, fog.far);
        }

        // - camera
        this.camera = this.creatCamera(this.config.camera, this.width, this.height);

        // - controls
        this.controls = new THREE.OrbitControls(this.camera, this.container);
        this.setControls(this.controls, this.config.controls);
        this.camera.userData.target = this.controls.target.clone();

        // - lights
        this.setLight(this.scene, this.config.light);
        this._effectComposer(); // 后期处理
        this.setConfigProxy(this._setting);

        this.initExtend();
        this.isInit = true;
    }

    // 初始化扩展
    initExtend() {}

    /**
     * [creatCamera 设置相机，根据参数创建 透视/正交 相机]
     * @DateTime 2021-02-05
     * @param    {[object]}   opts   [相机配置参数]
     * @param    {[number]}   w      [相机视区宽度]
     * @param    {[number]}   h      [相机视区高度]
     * @return   {object}    [透视/正交 相机对象]
     */
    creatCamera(opts, w, h) {
        let camera;
        if (opts.isOrth) {
            const [hw, hh] = [opts.ratio * w * 0.5, opts.ratio * h * 0.5];
            camera = new THREE.OrthographicCamera(-hw, hw, hh, -hh, opts.near, opts.far);
        } else {
            camera = new THREE.PerspectiveCamera(opts.fov, w / h, opts.near, opts.far);
        }
        camera.position.copy(opts.position);
        return camera;
    }

    /**
     * [setControls 设置控制器参数]
     * @DateTime 2021-01-28
     * @param    {[object]}   controls [控制器对象]
     * @param    {[object]}   opts     [控制器参数配置{ params: {} }]
     */
    setControls(controls, opts = {}) {
        if (!controls) return;
        if (opts.target) controls.target.copy(opts.target);
        glUtil.setObjParams(controls, opts.params);
        controls.update(); // 更改后更新

        // - 编辑器非预览，关闭 controls
        controls.enabled = !!(opts.enabled && this.config.isViewport);
    }

    /**
     * [setLight 设置场景灯光，在绝对中心渲染中创建]
     * @DateTime 2021-02-03
     * @param    {[object]}   scene [渲染场景对象]
     * @param    {[object]}   opts  [灯光配置参数]
     */
    setLight(scene, opts) {
        if (opts.Ambient) { // 环境光
            scene.add(new THREE.AmbientLight(opts.Ambient.color, opts.Ambient.strength));
        }
        const [lh, ld] = [opts.hemisphere, opts.directional];
        if (opts.isHemisphere && lh) { // 半球光
            const hLight = new THREE.HemisphereLight(lh.color, lh.groundColor, lh.strength);
            hLight.position.set(lh.position[0], lh.position[2], lh.position[1]);
            scene.add(hLight);
        }
        if (opts.isDirectional && ld) { // 方向光
            const dlight = new THREE.DirectionalLight(ld.color, ld.strength);
            dlight.position.set(ld.position[0], ld.position[2], ld.position[1]);
            dlight.castShadow = this.config.shadow;
            this.directLight = dlight;

            if (dlight.castShadow) { // 创建阴影
                const mSize = ld.mapSize || 1024;
                dlight.shadow.mapSize.width = mSize;
                dlight.shadow.mapSize.height = mSize;

                const d = ld.boxSize || 5000;
                dlight.shadow.camera.left = -d;
                dlight.shadow.camera.right = d;
                dlight.shadow.camera.top = d;
                dlight.shadow.camera.bottom = -d;

                dlight.shadow.camera.far = 10000;
                dlight.shadow.bias = -0.0001;
            }
            if (ld.lightHelper) { // 灯光辅助器
                const dLightHelper = new THREE.DirectionalLightHelper(dlight, 10);
                scene.add(dLightHelper);
            }
            scene.add(dlight);
        }
    }

    /**
     * [animation 容器动画相关入口]
     * @DateTime 2021-01-29
     * @param    {[number]}   dt [帧时长]
     */
    animation(dt) {
        if (!this.config.isViewport) return; // 编辑态关闭所有
        if (this._TWEEN) this._TWEEN.update();
        if (this.controls.enableDamping) this.controls.update();

        if (!this.config.isAnimate) return; // 关闭内部动画
        for (let i = 0; i < this.subAnimateArr.length; i++) {
            this.subAnimateArr[i](dt, this.clock);
        }
    }

    /**
     * [renderers 渲染入口]
     * @DateTime 2021-01-28
     */
    renderers() {
        let dfRaf = 0;
        const Animations = () => {
            if (this.isInit) {
                dfRaf = window.requestAnimationFrame(Animations);
                if (!this.config.isShow) return; // 隐藏停止渲染

                const delta = this.clock.getDelta();
                if (delta > this.config.frameLimit) return;
                this.animation(delta);

                if (this.composer) this.composer.render();
                else this.renderer.render(this.scene, this.camera);
            } else {
                window.cancelAnimationFrame(dfRaf);
                this._disposeRender();
            }
        };
        Animations();
    }

    /**
     * [_disposeRender 内部，销毁渲染器相关]
     * @DateTime 2021-01-28
     */
    _disposeRender() {
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        this.renderer.domElement = null;
        if (this.composer) { // 后期处理销毁
            this.outlinePass = null;
            glUtil.disposeArr(this.composer.passes);
            glUtil.disposeArr(this.composer);
        }
        this.renderer = null;
        this._disposeValue();
        this._triggerInnerEvent('afterDispose'); // 生命周期 容器销毁后
    }

    /**
     * [_disposeValue 内部，销毁内部变量]
     * @DateTime 2021-01-28
     */
    _disposeValue() {
        glUtil.disposeArr(this.subCompEffects);
        this._Txues.dispose(); // 纹理销毁
        this._Events.dispose(); // 事件销毁
        this.container.remove();

        this.subAnimateArr.splice(0, this.subAnimateArr.length);
        this.subCompEffectArr.splice(0, this.subCompEffectArr.length);

        this._Txues = null;
        this._Events = null;
        this._setting = null;
        this.container = null;
        this.parentCont = null;

        this.clock = null;
        this.scene = null;
        this.camera = null;
        this.controls = null;
        this.directLight = null;
        this.disposeBase();
    }

    /**
     * [testing 测试render是否还是活跃状态]
     * @DateTime 2019-10-25
     * @return   {[Boolean]}   [true/false]
     */
    testing() {
        return this.renderer instanceof THREE.WebGLRenderer;
    }

    /**
     * [getWH 获取容器宽高]
     * @DateTime 2021-01-28
     * @param    {[number]}   w [宽度值]
     * @param    {[number]}   h [高度值]
     * @return   {[object]}   [{ w: 宽, h: 高, rs: 是否重置 }]
     */
    getWH(w, h) {
        const [nw, nh] = [
            glUtil.clamp(w, 0.01, Infinity, this.container.offsetWidth),
            glUtil.clamp(h, 0.01, Infinity, this.container.offsetHeight)
        ];
        const rs = !(this.width === nw && this.height === nh);
        if (rs) { // 重置
            this.width = nw;
            this.height = nh;
        }

        return { nw, nh, rs };
    }

    /**
     * [parseCts 判断是否是dom对象]
     * @DateTime 2021-01-28
     * @param    {[*]}   cts []
     * @return   {[object/null]}       [dom对象或者null值]
     */
    parseCts(cts) {
        if (typeof cts !== 'object') return document.getElementById(cts);
        let domEle = glUtil.isDomElement(cts) ? cts : cts[0];
        domEle = glUtil.isDomElement(domEle) ? domEle : null;
        return domEle;
    }

    /**
     * [creatContainer 根据id创建dom容器]
     * @DateTime 2021-01-28
     * @param    {[string]}   id [容器id]
     * @return   {[object]}      [容器domEle对象]
     */
    creatContainer(id) {
        const [containers, style] = [document.createElement('div'),
            'width: 100%; height: 100%; overflow: hidden; position: relative !important;'];
        containers.id = id;
        containers.style = style;
        return containers;
    }

    /**
     * [_effectComposer 场景渲染后期通道]
     * @DateTime 2021-02-03
     */
    _effectComposer() {
        /* eslint-disable */
        return; // 暂不开放

        const cps = this.config.composer;
        if (!cps.isOutline) return;

        // - post composer
        const renderScene = new THREE.RenderPass(this.scene, this.camera);
        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.setSize(this.width, this.height);
        this.composer.addPass(renderScene);

        // - 外发光
        const outlinePass = new THREE.OutlinePass(
            new THREE.Vector2(this.width, this.height), this.scene, this.camera
        );
        outlinePass.visibleEdgeColor.set(cps.outlineColor);
        outlinePass.edgeStrength = cps.outlineStrength;
        outlinePass.edgeGlow = cps.outlineGlow;
        this.outlinePass = outlinePass;
        this.composer.addPass(outlinePass);

        // - 抗锯齿
        if (cps.isAntialias) {
            const antialias = new THREE.ShaderPass(THREE.FXAAShader);
            antialias.uniforms.resolution.value.set(1 / this.width, 1 / this.height);
            this.composer.addPass(antialias);
        }
        /* eslint-enable */
    }
}
