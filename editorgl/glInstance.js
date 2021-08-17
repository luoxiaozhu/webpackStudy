/**
 * @Author zhoupu
 * 编辑器对象
 */
import glUtil from './utils';
import WebGLBase from './src/WebGLBase';
import Components from './effect/index';

export default class glInstance {
    constructor(params = {}) {
        this.#debugs = params.debugs; // debug 模式，默认关闭

        // 私有 获取实例
        this.#getIns = (name) => {
            if (name === 'renderer') return this.#renderer;
            const { subCompEffectArr } = this.#renderer;
            return subCompEffectArr.filter((c) => name === c.name)[0] || null;
        };
    }

    // 私有
    #getIns = null;

    #debugs = false; // debug模式

    #renderer = new WebGLBase(); // 渲染器

    /**
     *
     * [init 初始化底图对象]
     * @DateTime 2021-03-26
     * @param    {[object]}   config [配置参数]
     */
    init(scene) {
        const {
            render, // 渲染器配置参数
            sort = true, // 是否按sort值加载组件
            textures = [], // 纹理配置
            components = [], // 组件集合
            endCallBack = null // 所有组件加载完成回调
        } = scene;

        if (!render) return;
        this.#renderer.init(render, textures);

        // 预处理
        const comps = components.filter((c) => Components[c.compType]);
        if (sort) comps.sort((a, b) => (a.config.sort || 0) - (b.config.sort || 0));

        this.initCompEfts(comps, endCallBack);
    }

    /**
     * [initCompEfts 初始化组件效果]
     * @Author   ZHOUPU
     * @DateTime 2021-08-10
     * @param    {[array]}      comps        [组件效果配置参数集合]
     * @param    {[function]}   endCallBack  [加载完成回调]
     */
    initCompEfts(comps, endCallBack) {
        let idx = 0;
        const loadEnd = () => {
            idx++;
            if (!comps[idx]) {
                this.#renderer.removeLoading(endCallBack);
                return;
            }
            this.loadCompEft(comps[idx], loadEnd);
        };
        this.loadCompEft(comps[idx], loadEnd);
    }

    /**
     * [loadCompEft 加载组件效果]
     * @Author   ZHOUPU
     * @DateTime 2021-08-10
     * @param    {[object]}  options  [配置参数]
     * @param    {Function}  callback [加载完成回调, 异步]
     */
    loadCompEft(options, callback) {
        const Module = Components[options.compType];
        const inst = new Module(this.#renderer);
        inst.on('mounted', () => {
            window.requestAnimationFrame(() => {
                glUtil.exeFunction(callback);
            }); // 异步
        }); // 加载完成
        inst.init(options);
        this.#renderer.addCompEft(inst);
    }

    // --------------------
    /**
     * [on 注册事件 eventName]
     * @DateTime 2021-03-26
     * @param    {[string]}   insName   [对象实例筛选名称]
     * @param    {[string]}   eventName [事件名称, 如 'onMouseIn', 'onMouseOut', 'onClick' ...]
     * @param    {[function]}   func    [事件执行方法]
     */
    on(insName, eventName, func) {
        const ins = this.#getIns(insName);
        if (ins) ins.bind(eventName, func);
    }

    /**
     * [un 取消事件 eventName]
     * @DateTime 2021-03-26
     * @param    {[string]}   insName   [对象实例筛选名称]
     * @param    {[string]}   eventName [事件名称, 如 'onMouseIn', 'onMouseOut', 'onClick' ...]
     * @param    {[function]}   func    [事件执行方法]
     */
    un(insName, eventName, func) {
        const ins = this.#getIns(insName);
        if (ins) ins.unbind(eventName, func);
    }

    /**
     * [setOption 根据type设置不同实例效果]
     * @Author   ZHOUPU
     * @DateTime 2021-08-10
     * @param    {[string]}   insName   [对象实例筛选名称]
     * @param    {[string]}   type      [更改类别]
     * @param    {[object]}   option    [配置参数]
     */
    setOption(insName, type, option) {
        const ins = this.#getIns(insName);
        if (!ins) return;

        ins.setConfig(type, option);
    }

    /**
     * [setOption 根据type获取不同实例返回]
     * @Author   ZHOUPU
     * @DateTime 2021-08-10
     * @param    {[string]}   insName   [对象实例筛选名称]
     * @param    {[string]}   type      [更改类别]
     * @param    {[object]}   option    [配置参数]
     */
    getOption(insName, type, option) {
        const ins = this.#getIns(insName);
        if (!ins) return null;

        return ins.getConfig(type, option);
    }

    /**
     * [getIns debug模式下获取对象实例]
     * @Author   ZHOUPU
     * @DateTime 2021-08-10
     * @param    {[string]}   name [筛选名称]
     * @return   {[object]}        [对象实例]
     */
    getIns(name) {
        if (!this.#debugs) return null;
        return this.#getIns(name);
    }

    /**
     * [trans 坐标转换]
     * @DateTime 2021-04-27
     * @param    {[object]}   vec  [vec3或vec2]
     * @param    {[number]}   tgtz [二维转三维的深度值]
     * @return   {[object]}        [转换结果]
     */
    trans(vec, tgtz) {
        const end = tgtz !== undefined
            ? glUtil.transPosition(vec, tgtz, this.#renderer)
            : glUtil.transCoord(new THREE.Vector3().copy(vec), this.#renderer);
        return { ...end };
    }

    /**
     * [setSize 重置宽高，缺省则取容器宽高]
     * @DateTime 2021-04-27
     * @param    {[number]}   width  [宽度]
     * @param    {[number]}   height [高度]
     */
    setSize(width, height) {
        this.#renderer.setRenderSize(width, height);
    }

    /**
     * [dispose 销毁]
     * @DateTime 2021-03-26
     */
    dispose() {
        this.#renderer.dispose();
    }

    getCameraData() {
        const camera = this.#renderer.camera.position;
        const controls = this.#renderer.controls.target;
        console.log(JSON.stringify(glUtil.getCameraData(camera, controls)));
    }
}
