/**
 * @Author zhoupu
 * 渲染器基础类, 提供基础api
 */
import glUtil from '../utils';
import renderers from './base/renderers';

export default class WebGLBase extends renderers {
    constructor() {
        super();

        this.isShift = false; // 是否按下 shift 键
        this.isCtrl = false; // 是否按下 ctrl 键
        this.isDown = false; // 是否鼠标按下
    }

    initExtend() {
        this.addSkysEffect(this.config.sky);
        this.addLoading(this.config.loading);
    }

    // 添加默认参数
    setDefaultConfig(/* dfConfig */) {
        // glUtil.copy(dfConfig, {});
    }

    /**
     * [onAnimate 加入动画函数到列表]
     * @DateTime 2021-01-29
     * @param    {[function]}   func [动画函数]
     */
    onAnimate(func) {
        if (glUtil.isFunction(func)) this.subAnimateArr.push(func);
    }

    /**
     * [unAnimate 从列表中移出对应的动画函数]
     * @DateTime 2021-01-29
     * @param    {[function]}   func [动画函数]
     */
    unAnimate(func) {
        glUtil.removeArrItem(this.subAnimateArr, func);
    }

    /**
     * [addCompEft 添加效果入口]
     * @DateTime 2021-01-29
     * @param    {[object]}   compEft [组件效果实例对象]
     */
    addCompEft(compEft) {
        this._triggerInnerEvent('beforeAdd', compEft); // 生命周期 添加前
        compEft._triggerInnerEvent('beforeAdd'); // 生命周期 添加前

        this.subCompEffects[compEft.id] = compEft;
        this.subCompEffectArr.push(compEft);
        this.updateEventArr(compEft);
        compEft.group.name += compEft.id;
        compEft.config.isViewport = this.config.isViewport;

        this.scene.add(compEft.group);
        this.onAnimate(compEft.animate);

        this._triggerInnerEvent('afterAdd', compEft); // 生命周期 添加后
        compEft._triggerInnerEvent('afterAdd'); // 生命周期 添加后
    }

    /**
     * [removeCompEft 容器中移出组件效果实例]
     * @DateTime 2021-01-30
     * @param    {[object]}   compEft   [组件效果实例对象]
     * @param    {Boolean}  isDispose   [是否销毁实例]
     */
    removeCompEft(compEft, isDispose) {
        this._triggerInnerEvent('beforeRemove', compEft); // 生命周期 移除前
        compEft._triggerInnerEvent('beforeRemove'); // 生命周期 移除前

        this._Events.dispose(true); // 清除事件变量缓存
        delete this.subCompEffects[compEft.id];
        glUtil.removeArrItem(this.subCompEffectArr, compEft);
        this.removeEventArr(compEft.id);
        this.scene.remove(compEft.group);
        this.unAnimate(compEft.animate);
        if (isDispose) compEft.dispose();

        this._triggerInnerEvent('afterRemove'); // 生命周期 移除后
        compEft._triggerInnerEvent('afterRemove'); // 生命周期 移除后
    }

    /**
     * [removeAll 容器中移出所有组件效果实例]
     * @DateTime 2021-02-05
     * @param    {Boolean}  isDispose   [是否销毁实例]
     */
    removeAll(isDispose) {
        glUtil.loopObject(this.subCompEffects, (id) => {
            this.removeCompEft(this.subCompEffects[id], isDispose);
        });
    }

    /**
     * [updateEventArr 更新容器或组件上的事件数组信息]
     * @DateTime 2021-01-30
     * @param    {[object]}   compEft [组件效果实例对象]
     */
    updateEventArr(compEft) {
        const [ceId, events] = [compEft.id, compEft.eventArr];
        this.removeEventArr(ceId); // 清除原事件对象

        for (let i = 0; i < events.length; i++) {
            events[i].traverse((node) => { node.userData.ceId = ceId; });
            this.eventArr.push(events[i]);
        }
    }

    /**
     * [removeEventArr 移除容器事件数组中的对象]
     * @DateTime 2021-01-30
     * @param    {[string]}   ceId [组件效果id]
     */
    removeEventArr(ceId) {
        for (let i = this.eventArr.length - 1; i >= 0; i--) {
            if (this.eventArr[i].userData.ceId !== ceId) continue;
            this.eventArr.splice(i, 1);
        }
    }

    // ----------------------
    /**
     * [setCameraParams 设置相机参数，视觉、位置及中心点]
     * @DateTime 2021-02-03
     * @param    {[object]}   params [{ fov, position, target } 相机视觉、位置 及 中心点]
     */
    setCameraParams(params = {}) {
        const t = params.target;
        if (this.camera && params.position) {
            if (params.fov) this.camera.fov = params.fov;
            this.camera.position.copy(params.position);
            if (t) this.camera.lookAt(t.x, t.y, t.z);
            this.camera.userData.target = t;
            this.camera.updateProjectionMatrix();
        }
        if (this.controls && t) {
            this.controls.target.copy(t);
            this.controls.update();
        }
    }

    /**
     * [getCameraParams 获取相机参数，视觉、位置及中心点]
     * @DateTime 2021-02-26
     * @return   {[object]}   [{ fov, position, target } 相机视觉、位置 及 中心点]
     */
    getCameraParams() {
        return {
            fov: this.camera ? this.camera.fov : null,
            position: this.camera ? { ...this.camera.position } : null, // { x, y, z }
            target: this.controls ? { ...this.controls.target } : null // { x, y, z }
        };
    }

    /**
     * [getImage 获取渲染缩略图]
     * @DateTime 2021-08-04
     * @param    {Number}     w          [缩略图宽度]
     * @param    {Number}     h          [缩略图高度]
     * @param    {[string]}   background [颜色值，rgba/16进制等]
     * @return   {[string]}              [图片 base64 信息]
     */
    getImage(w = 200, h = 150, background = '#1E1F22') {
        this.renderer.render(this.scene, this.camera);
        return glUtil.canvasToImg(this.renderer.domElement, w, h, background);
    }

    /**
     * [getTxue 根据名称获取对应的纹理]
     * @DateTime 2021-08-04
     * @param    {[string]}   nm [纹理名称 name]
     * @return   {[object]}      [纹理对象 texture]
     */
    getTxue(nm) {
        return !this._Txues ? null : this._Txues.getTxue(nm);
    }

    /**
     * [addSkysEffect 添加天空盒和环境贴图]
     * @Author   ZHOUPU
     * @DateTime 2021-08-06
     * @param    {[object]}   opts [配置参数]
     */
    addSkysEffect(opts) {
        if (!opts || !opts.created) return;

        const thenFun = () => {
            this.scene.background = this.getTxue(opts.currentSky); // 天空盒
            this.scene.environment = this.getTxue(opts.environment); // 环境贴图
        };
        let num = 0;
        opts.hdr.forEach((pms) => {
            let func = null;
            if (opts.currentSky === pms.id || opts.environment === pms.id) {
                func = thenFun;
                num++;
            }
            this._Txues.loadHdr(pms, func);
        });
        if (num === 0) thenFun();
    }

    /**
     * [chgBackground 更改场景背景]
     * @DateTime 2021-08-07
     * @param    {[string]}   id [纹理id(名称)]
     */
    chgBackground(id) {
        this.scene.background = this.getTxue(id);
    }

    /**
     * [chgEnvironment 更改环境贴图]
     * @DateTime 2021-08-07
     * @param    {[string]}   id [纹理id(名称)]
     */
    chgEnvironment(id) {
        this.scene.environment = this.getTxue(id);
    }

    /**
     * [addLoading 添加加载loading效果]
     * @Author   ZHOUPU
     * @DateTime 2021-08-07
     * @param    {[object]}   opts [loading参数]
     */
    addLoading(opts) {
        if (!opts || !opts.created || !opts.url) return;

        const [loading, style, style2] = [
            document.createElement('div'),
            'position: absolute; inset: 0; z-index: 100; background: #000;',
            'position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);'
        ];
        loading.id = `loading_${this.id}`;
        loading.style = opts.style || style;
        loading.innerHTML = `<img src= "${opts.url}" style="${opts.imgStyle || style2}">`;
        this.loadingDom = loading;
        this.container.insertBefore(loading, this.container.firstChild);
    }

    /**
     * [removeLoading 移除loading效果]
     * @Author   ZHOUPU
     * @DateTime 2021-08-07
     * @param    {Function} callback [移除后回调]
     */
    removeLoading(callback) {
        if (!this.loadingDom) {
            glUtil.exeFunction(callback);
            return;
        }

        this.loadingDom.style.opacity = 1;
        this.setTestTween(this.loadingDom.style, { opacity: 0 }, () => {
            glUtil.exeFunction(callback);
            this.loadingDom.remove();
        }, this.config.loading.hidden);
    }

    // --------------------------
    // [onKeyup 键盘移开事件]
    onKeyup(e, ...arg) {
        if (e.key === 'Shift') this.isShift = false;
        if (e.key === 'Control') this.isCtrl = false;
        return [e, ...arg];
    }

    // [onKeydown 键盘按下事件]
    onKeydown(e, ...arg) {
        if (e.key === 'Shift') this.isShift = true;
        if (e.key === 'Control') this.isCtrl = true;
        return [e, ...arg];
    }

    // [onMouseUp 鼠标松开事件]
    onMouseUp(e, ...arg) {
        this.isDown = false;
        return [e, ...arg];
    }

    // [onMouseDown 鼠标点下事件]
    onMouseDown(e, ...arg) {
        this.isDown = true;
        return [e, ...arg];
    }

    // [onDblClick 鼠标双击事件]
    onDblClick(e, ...arg) {
        if (this.config.isDfEvent) this.restoreCamra(this);
        return [e, ...arg];
    }

    // ---------------
    /**
     * [setConfig 根据type设置不同效果]
     * @Author   ZHOUPU
     * @DateTime 2021-08-11
     * @param    {[string]}   type      [更改类别]
     * @param    {[object]}   option    [配置参数]
     */
    setConfig(type, opts) {
        switch (type) {
        case 'skyBox': // 天空盒
            glUtil.exeFunction(this.chgBackground, this, opts.name);
            break;
        case 'environment': // 环境贴图
            glUtil.exeFunction(this.chgEnvironment, this, opts.name);
            break;
        case 'camera': // 更改相机参数
            glUtil.exeFunction(this.setCameraParams, this, opts);
            break;
        case 'control': // 更改控制器参数
            glUtil.exeFunction(this.setControls, this, this.controls, opts);
            break;
        case 'restore': // 还原最初视觉
            glUtil.exeFunction(this.restoreCamra, this, this);
            break;
        case 'show': // 显示
            glUtil.exeFunction(this.show, this, opts);
            break;
        case 'hide': // 隐藏
            glUtil.exeFunction(this.hide, this, opts);
            break;
        default:
            break;
        }
    }

    /**
     * [getConfig 根据type 获取不同返回]
     * @Author   ZHOUPU
     * @DateTime 2021-08-11
     * @param    {[string]}   type      [更改类别]
     * @param    {[object]}   option    [配置参数]
     */
    getConfig(type, opts) {
        let end = null;
        switch (type) {
        case 'camera': // 获取相机参数
            end = glUtil.exeFunction(this.getCameraParams, this);
            break;
        case 'litImg': // 获取缩略图
            end = glUtil.exeFunction(this.getImage, this, opts.w, opts.h, opts.color);
            break;
        default:
            break;
        }
        return end;
    }
}
