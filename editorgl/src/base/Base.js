/**
 * @Author zhoupu
 * 基类，生命周期、事件、公共属性、参数代理等
 */
import glUtil from '../../utils';

/**
 * [LIFECYCLES 生命周期注册]
 * @type {Array}
 */
const LIFECYCLES = [
    'mounted', // 组件效果完成
    'update', // 组件效果更新
    'endCallBack', // 单个组件加载完成回调
    'onClick', // 单个组件加载完成回调

    'beforeInit', // 初始化前
    'afterInit', // 初始化后
    'beforeOption', // 配置参数设置前
    'afterOption', // 配置参数设置后
    'beforeDispose', // 销毁前
    'afterDispose', // 销毁后

    'beforeAdd', // 添加组件效果前
    'afterAdd', // 添加组件效果后
    'beforeRemove', // 移除组件效果前
    'afterRemove' // 移除组件效果后
];

export default class Base {
    constructor() {
        // 容器和组件效果共有属性
        this.id = ''; // id -初始化后不变
        this.name = ''; // 名称，可根据名称查找
        this.config = null; // 配置项
        this.eventArr = []; // 公共事件数组

        this._TWEEN = glUtil.TWEEN;
        this.tweenTims = 800; // tween动画 过渡时间

        // 遍历的方法
        this._setting = {
            checkList: {},
            callback: {}
        };
    }

    #innerListener = new glUtil.Listener(); // 组件效果内部事件

    #outPutListener = new glUtil.Listener(); // 组件效果外部绑定的事件

    #_config = null; // 配置项代理 proxy

    /**
     * [setLifecycle 设置生命周期函数]
     * @Author   ZHOUPU
     * @DateTime 2021-08-09
     * @param    {[object]}   opts [配置参数]
     */
    setLifecycle(opts = {}) {
        glUtil.loopObject(opts, (key) => {
            if (LIFECYCLES.includes(key) && glUtil.isFunction(opts[key])) {
                this.on(key, opts[key]);
            }
        });
    }

    /**
     * [on 绑定函数方法，内部使用]
     * @Author   ZHOUPU
     * @DateTime 2021-08-06
     * @param    {[string]}   funcName [函数方法名称]
     * @param    {Function} callback  [执行的事件方法]
     */
    on(funcName, callback) {
        this.#innerListener.bind(funcName, callback);
    }

    /**
     * [un 解绑函数方法，内部使用, 对应 on]
     * @Author   ZHOUPU
     * @DateTime 2021-08-06
     * @param    {[string]}   funcName [函数方法名称]
     * @param    {Function} callback  [执行的事件方法]
     */
    un(funcName, callback) {
        this.#innerListener.unbind(funcName, callback);
    }

    /**
     * [_triggerInnerEvent 触发执行内部绑定的函数方法]
     * @Author   ZHOUPU
     * @DateTime 2021-08-06
     * @param    {[string]}    funcName [函数方法名称]
     * @param    {...[any]}    params    [事件参数]
     */
    _triggerInnerEvent(funcName, ...params) {
        this.#innerListener.trigger(funcName, this, ...params);
    }

    /**
     * [bind 绑定事件，外部使用]
     * @DateTime 2021-03-01
     * @param    {[string]}   eventName [事件类别名称]
     * @param    {Function} callback  [执行的事件方法]
     */
    bind(eventName, callback) {
        this.#outPutListener.bind(eventName, callback);
    }

    /**
     * [unbind 解绑事件，外部使用，对应 bind]
     * @DateTime 2021-03-01
     * @param    {[string]}   eventName [事件类别名称]
     * @param    {Function} callback  [执行的事件方法]
     */
    unbind(eventName, callback) {
        this.#outPutListener.unbind(eventName, callback);
    }

    /**
     * [_triggerOutEvent 触发执行外部绑定的事件]
     * @DateTime 2021-03-01
     * @param    {[string]}    eventName [事件对应的名称]
     * @param    {...[any]}    params    [事件参数]
     */
    _triggerOutEvent(eventName, ...params) {
        this.#outPutListener.trigger(eventName, this, ...params);
    }

    /**
     * [_handleEventFn 事件分发入口，在baseEvent中执行]
     * @DateTime 2021-03-01
     * @param    {[string]}    eventName [事件名称， onMouseOut 等]
     * @param    {...[any]}    params    [事件参数]
     */
    _handleEventFn(eventName, ...params) {
        const outParams = this[eventName](...params);
        if (!glUtil.isArray(outParams)) return;
        this._triggerOutEvent(eventName, ...outParams);
    }

    /**
     * [disposeBase 销毁基类信息]
     * @DateTime 2021-02-04
     * @param    {[boolean]}   compEft [是否组件效果销毁]
     */
    disposeBase(compEft) {
        glUtil._disposeDiff(compEft);
        this.#outPutListener.destroy();
        this.#innerListener.destroy();
        this.#outPutListener = null;
        this.#innerListener = null;
        this.#_config = null;
        if (compEft) return;

        // 全局销毁
        glUtil.disposeObj(this.scene);
        this.eventArr.splice(0, this.eventArr.length);
        this._TWEEN.removeAll();

        this._TWEEN = null;
        this.config = null;
    }

    /**
     * [show hide 显示隐藏]
     */
    show() { this.config.isShow = true; }

    hide() { this.config.isShow = false; }

    /**
     * [restoreCamra 还原相机位置及视觉]
     * @DateTime 2021-03-22
     * @param    {[object]}   renderers [渲染器对象]
     */
    restoreCamra(renderers) {
        const [tgt, pos, config] = [
            renderers.controls.target, renderers.camera.position, renderers.config];
        const [ntgt, npos] = [config.controls.target, config.camera.position];
        if (!tgt.equals(ntgt)) this.setTestTween(tgt, ntgt);
        if (!pos.equals(ntgt)) this.setTestTween(pos, npos);
    }

    /**
     * [setTestTween 设置TWEEN动画]
     * @DateTime 2021-02-04
     * @param    {[object]}   obj      [动画待更改对象]
     * @param    {[object]}   target   [目标值对象]
     * @param    {Function} callback   [回调函数]
     * @param    {number}   time       [效果总时长，毫秒]
     * @param    {string}   easing     [缓动函数名称]
     */
    setTestTween(obj, target, callback, time = this.tweenTims, easing = 'Quadratic.InOut') {
        new this._TWEEN.Tween(obj).to(target, time)
            .easing(glUtil.getEasing(easing)).start()
            .onComplete(() => { glUtil.exeFunction(callback, this); });
    }

    /**
     * [setOption 容器设置配置参数]
     * @DateTime 2021-02-04
     */
    setOption(option, isNew) {
        this.beforeOption(option);
        if (isNew) {
            if (this.compEftInit) this.compEftInit();
        } else this.contrastedOpt(option, this._setting.checkList, this.#_config);
        this.afterOption(option);
    }

    /**
     * [setConfigProxy 设置配置项代理]
     * @DateTime 2021-02-23
     * @param    {[object]}   obj [参数代理配置]
     */
    setConfigProxy(obj) {
        /* eslint-disable */
        return; // 暂不开放

        const watch = this.handleSetting(obj.checkList, obj.callback);
        this.#_config = glUtil._setDiff({
            data: this.config,
            computed: {},
            watch,
            bind: this
        });
        /* eslint-enable */
    }

    /**
     * [handleSetting 处理参数代理配置]
     * @DateTime 2021-02-22
     * @param    {[object]} checkList [检测的参数列表]
     * @param    {Function} callback  [对应的执行方法]
     * @return   {[object]}           [参数代理关系监听]
     */
    handleSetting(checkList, callback) {
        const watch = {};
        glUtil.loopObject(checkList, (item) => {
            const ci = checkList[item];
            if (typeof ci === 'object') {
                watch[item] = this.handleSetting(ci, callback);
            } else if (Object.prototype.hasOwnProperty.call(callback, ci)) {
                watch[item] = callback[ci];
            }
        });
        return watch;
    }

    /**
     * [contrastedOpt 对比checkList和setOption配置参数]
     * @DateTime 2021-02-23
     * @param    {[object]}   opt       [传入的配置参数]
     * @param    {[object]}   checkList [内部检测的参数列表]
     * @param    {[proxy]}    proxy     [参数代理对象]
     */
    contrastedOpt(opt, checkList, proxy) {
        if (!proxy) return;
        glUtil.loopObject(opt, (item) => {
            const [ti, ci] = [opt[item], checkList[item]];
            if (typeof ci === 'object') {
                this.contrastedOpt(ti, ci, proxy[item]);
            } else {
                proxy[item] = ti;
            }
        });
    }

    /**
     * [typeConfig 内部配置项初始化入口，根据 config.renderType 实现不同]
     * @DateTime 2021-02-04
     * @param    {[object]}   config    [传入的参数]
     * @param    {[object]}   dfConfig  [组件或者容器基础配置参数]
     */
    typeConfig(config, dfConfig) {
        const nDfConfig = glUtil.extend(true, {}, dfConfig);
        this.setDefaultConfig(nDfConfig);
        this.config = glUtil.extend(true, {}, nDfConfig, config);
        this.name = this.config.name;
        this.id = glUtil.creatId(this.name || this.config.sort || undefined);
    }

    /**
     * [setDefaultConfig 修改默认配置项]
     * @DateTime 2021-02-04
     * @param    {[object]}   dfConfig  [组件或者容器基础配置参数]
     */
    setDefaultConfig(/* dfConfig */) {
        // glUtil.copy(dfConfig, {});
    }

    // ------------------
    // [onWheel 鼠标滚轮事件]
    onWheel(...arg/* event, intersects, compEft */) { return [...arg]; }

    // [onKeyup 键盘移开事件]
    onKeyup(...arg/* event, intersects, compEft */) { return [...arg]; }

    // [onKeydown 键盘按下事件]
    onKeydown(...arg/* event, intersects, compEft */) { return [...arg]; }

    // [onMouseMove 鼠标移动事件]
    onMouseMove(...arg/* event, intersects, compEft */) { return [...arg]; }

    // [onMouseOut 鼠标移出事件]
    onMouseOut(...arg/* event, intersects, compEft */) { return [...arg]; }

    // [onMouseIn 鼠标移入事件]
    onMouseIn(...arg/* event, intersects, compEft */) { return [...arg]; }

    // [onMouseUp 鼠标松开事件]
    onMouseUp(...arg/* event, intersects, compEft */) { return [...arg]; }

    // [onMouseDown 鼠标点下事件]
    onMouseDown(...arg/* event, intersects, compEft */) { return [...arg]; }

    // [onClick 鼠标单击事件]
    onClick(...arg/* event, intersects, compEft */) { return [...arg]; }

    // [onDblClick 鼠标双击事件]
    onDblClick(...arg/* event, intersects, compEft */) { return [...arg]; }
}
