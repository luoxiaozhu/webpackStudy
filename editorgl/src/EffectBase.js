/**
 * @Author zhoupu
 * 组件效果基础, 提供基础api
 */
import glUtil from '../utils';
import Base from './base/Base';
import { DFCEConfig } from './base/comConfig';

export default class EffectBase extends Base {
    constructor(render) {
        super();

        this.renderer = render;
    }

    /**
     * [init 组件效果初始化入口]
     * @DateTime 2021-02-04
     * @param    {[object]}   config [配置参数]
     */
    init(options) {
        this.setLifecycle(options); // 初始化生命周期

        const { config } = options;
        this._triggerInnerEvent('beforeInit', config); // - 生命周期 初始化前
        this.typeConfig(config, DFCEConfig);

        this.group = new THREE.Group();
        this.group.renderOrder = this.config.renderOrder || 1; // renderOrder
        if (this.config.gridHelper) { // 网格
            this.GridHelper = new THREE.GridHelper(500, 20, 0x145A8D, 0x494949);
            this.group.add(this.GridHelper);
        }
        this.setConfigProxy(this._setting);
        this.compEftInit();

        this._triggerInnerEvent('afterInit', this.config); // - 生命周期 初始化后
    }

    /**
     * [compEftInit 内部处理组件效果初始化，根据 config.renderType 实现不同]
     * @DateTime 2021-02-03
     */
    compEftInit() {}

    /**
     * [animate 动画执行入口]
     * @DateTime 2021-08-07
     */
    animate(/* dt, clock */) {}

    /**
     * [dispose 销毁 baseModel]
     * @DateTime 2021-02-04
     */
    dispose() {
        this._triggerInnerEvent('beforeDispose'); // 生命周期 容器销毁前
        this.renderer.removeCompEft(this);
        glUtil.disposeObj(this.group);
        this.renderer = null;
        this.group = null;

        this.disposeCompEft();
        this.disposeBase(true);
        this._triggerInnerEvent('afterDispose'); // 生命周期 容器销毁后
    }

    /**
     * [disposeCompEft 组件效果上重写的销毁]
     * @DateTime 2021-02-04
     */
    disposeCompEft() {}

    // --------工具--------
    /**
     * [ajaxQuer query请求]
     * @DateTime 2021-02-04
     * @param    {[string]}    url      [url地址]
     * @param    {[funtion]}   callback [回调函数]
     */
    ajaxQuer(url, callback) {
        if (!url) return;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            // readyState === 4 请求已完成
            if ((xhr.readyState === 4 && xhr.status === 200) || xhr.status === 304) {
                callback.call(this, xhr.responseText); // 获得数据
            }
        };
        xhr.send();
    }

    /**
     * [getPathInfo path数据构面及计算点斜率]
     * @DateTime 2021-02-04
     * @param    {[array]}   path    [待处理的path数据]
     * @param    {Boolean}  indices  [是否构面]
     * @param    {Boolean}  beveling [是否计算点斜率]
     * @param    {Boolean}  close    [是否闭合计算]
     * @return   {[object]}          [点、构面、斜率等集合对象]
     */
    getPathInfo(path, indices = false, beveling = true, close = false) {
        const [geoEtds, Rlt = geoEtds.flatten(path)] = [glUtil.geoEtds];
        if (indices) Rlt.indices = geoEtds.triangulate(Rlt.vertices, Rlt.holes);
        if (beveling) Rlt.beveling = geoEtds.offsetPolygon2(Rlt.vertices, Rlt.holes, close);
        return Rlt;
    }

    /**
     * [sideIndices 形状侧面构面]
     * @DateTime 2021-02-04
     * @param    {[array]}   Indices  [形状构面点集合]
     * @param    {[number]}   idx     [点序号]
     * @param    {[number]}   ofs     [整体偏移量]
     * @param    {Number}   key     [构面点间隔值]
     */
    sideIndices(Indices, idx, ofs, key = 2) {
        const a = ofs + idx * key;
        Indices.push(a + key, a, a + 1, a + 1, a + key + 1, a + key);
    }

    /**
     * [handleVec 数据转换，其中经纬度是否做墨卡托转换]
     * @DateTime 2021-02-04
     * @param    {[array]}    dArr   [点数据组 [经度，纬度，高度(可缺省)] ]
     * @param    {[object]}   params [配置参数]
     * @return   {[object]}          [处理后的数据 { vx, vy, vz } ]
     */
    handleVec(dArr, params = this.config) {
        const [isMt, d, b, s = b[d].vScale, c = b[d].center] = [
            params.isMercator, params.dataTans, params.basic
        ];
        if (isMt && d === 'longLat') {
            const { mx, my } = glUtil.getMercator(dArr[0], dArr[1]);
            dArr[0] = mx;
            dArr[1] = my;
        }
        const [vx, vy, vz] = [
            (dArr[0] - c[0]) * s,
            (dArr[1] - c[1]) * s,
            ((dArr[2] || 0) - (c[2] || 0)) * s
        ];
        return { vx, vy, vz };
    }

    /**
     * [pushColor attribute 添加颜色]
     * @DateTime 2021-02-04
     * @param    {[array]}    array  [添加到的数组]
     * @param    {...[array]} colors [颜色组]
     * @return   {[array]}           [array添加到的数组]
     */
    pushColor(array, ...colors) {
        for (let i = 0, clen = colors.length; i < clen; i++) {
            const ci = colors[i];
            array.push(ci[0].r, ci[0].g, ci[0].b, ci[1]);
        }
        return array;
    }

    /**
     * [handleColor 处理颜色组]
     * @DateTime 2021-02-04
     * @param    {[array]}   colorArr [rgba颜色组]
     * @return   {[array]}            [THREE.Color 颜色组]
     */
    handleColor(colorArr) {
        const colors = [];
        colorArr.forEach((ci) => {
            if (glUtil.isArray(ci)) {
                const arr = [];
                ci.forEach((item) => { arr.push(glUtil.getColorArr(item)); });
                colors.push(arr);
            } else {
                colors.push(glUtil.getColorArr(ci));
            }
        });
        return colors;
    }

    /**
     * [nodeAmtFunc 节点动画循环执行函数]
     * @DateTime 2021-02-04
     * @param    {[number]}   dt    [帧时长]
     * @param    {[object]}   node  [节点对象]
     * @param    {[funtion]}   eFn  [回调函数]
     * @param    {String}   t    [节点过渡参数，默认 node._transTimes]
     * @param    {String}   l    [动画周期时长，默认 node._perTimes]
     * @param    {String}   n    [动画执行时间，默认 node.material.uniforms.uTime]
     */
    nodeAmtFunc(dt, node, eFn = null, t = '_transTimes', l = '_perTimes', n = 'uTime') {
        if (node[t] > node[l]) return;
        node[t] += dt;
        node.material.uniforms[n].value = node[t] / node[l];
        if (node[t] < node[l]) return;
        node[t] -= node[l];
        glUtil.exeFunction(eFn, this);
    }
}
