/**
 * 纹理，场景纹理管理
 */
import glUtil from '../../utils';

/* eslint-disable */
// 单个纹理配置说明
const defaultPrams = {
    id: '', // 纹理名称
    type: '', // cube / other // hdr - 暂不支持
    url: '', // 地址； type='cube' 时为数组
    isUpdate: false, // 同名是否更新

    // type 为 other时 起效
    isRepeat: false, // 是否重复纹理
    repeat: { x: 1, y: 1 } // 重复系数
};
/* eslint-enable */

export default class Textures {
    constructor(render) {
        this.Txues = {}; // 所有纹理集合
        this.txueArr = [];
        this.renderer = render;
    }

    /**
     * [init 纹理管理初始化]
     * @param    {[array]}   txues [纹理参数集合]
     */
    init(txues) {
        this.txueArr = [];
        glUtil.disposeArr(this.Txues);
        txues.forEach((item) => { this.loadTexture(item); });
    }

    /**
     * [getTxue 根据名称获取纹理]
     * @param    {[string]}   name [纹理名称]
     * @return   {[object/null]}        [纹理对象、null]
     */
    getTxue(name) {
        if (!name) return null;
        const txue = this.Txues[name] ? this.Txues[name] : null;
        if (txue) txue._use++;
        return txue;
    }

    /**
     * [removeTxue 根据名称删除纹理]
     * @param    {[string]}   name [纹理名称]
     */
    removeTxue(name) {
        const txue = this.Txues[name] ? this.Txues[name] : null;
        if (txue) txue._use--;
        if (txue && txue._use <= 0) {
            txue.dispose();
            delete this.Txues[name];
        }
    }

    /**
     * [setTxue 根据配置参数设置纹理]
     * @param    {[Object]}   opts [纹理配置参数]
     * @return   {[object/null]}        [当前设置的纹理对象、null]
     */
    setTxue(opts) {
        return this.loadTexture(opts);
    }

    /**
     * [dispose 对象销毁]
     */
    dispose() {
        glUtil.disposeArr(this.Txues);
        this.Txues = null;
        this.txueArr = null;
        this.renderer = null;
    }

    /**
     * [loadTexture 加载纹理入口]
     * @DateTime 2021-08-05
     * @param    {Object}   opts   [纹理配置参数]
     * @return   {[Object]}        [texture纹理对象]
     */
    loadTexture(opts = {}) {
        let end = this.Txues[`${opts.id}`];
        if (!opts.isUpdate && end !== undefined) return end;
        this.txueArr.push(opts);

        switch (opts.type) {
        // case 'hdr': // 必须异步
        //     end = this.loadHdr(opts);
        //     break;
        case 'cube':
            end = this.loadCubeSky(opts);
            break;
        default:
            end = this.loadImage(opts);
            break;
        }
        if (this.Txues[`${opts.id}`]) this.Txues[`${opts.id}`].dispose(); //
        this.Txues[`${opts.id}`] = end;
        return end;
    }

    /**
     * [loadImage 加载纹理]
     * @param    {Object}   opts     [纹理配置参数]
     */
    loadImage(opts = {}) {
        if (!(/\.(png|jpe?g)(\?.*)?$/.test(opts.url))) return null;
        const txue =  glUtil.txueLoader.load(opts.url);
        txue._use = 1;

        if (opts.isRepeat) {
            txue.wrapS = THREE.RepeatWrapping;
            txue.wrapT = THREE.RepeatWrapping;
        }
        if (opts.repeat) txue.repeat = new THREE.Vector2(opts.repeat.x, opts.repeat.y);
        return txue;
    }

    /**
     * [loadHdr 加载 .hdr 纹理]
     * @Author   ZHOUPU
     * @DateTime 2021-08-06
     * @param    {[string]}             url       [纹理地址]
     * @param    {[function]}           callback  [加载完成回调函数]
     * @param    {[object/undefined]}   render    [渲染器，默认内置]
     * @return   {[object/null]}          [纹理对象/null]
     */
    loadHdr(opts = {}, callback, render = this.renderer.renderer) {
        if (!(/\.(hdr)(\?.*)?$/.test(opts.url))) return null;
        if (!render) {
            console.warn('render is inactivity!'); // eslint-disable-line
            return null;
        }
        const pmremGenerator = new THREE.PMREMGenerator(render);
        pmremGenerator.compileEquirectangularShader(); // 预编译

        new THREE.RGBELoader().setDataType(THREE.UnsignedByteType).load(opts.url, (result) => {
            const txue = pmremGenerator.fromEquirectangular(result).texture;
            this.Txues[`${opts.id}`] = txue;
            txue._use = 1;

            if (callback) callback(txue);
            if (opts.callback) opts.callback(txue);

            pmremGenerator.dispose();
        });
        return true;
    }

    /**
     * [loadCubeSky 加载天空盒纹理]
     * @Author   ZHOUPU
     * @DateTime 2021-08-06
     * @param    {[array]}         url [纹理路径数组，6个路径]
     * @return   {[object/null]}       [纹理对象/null]
     */
    loadCubeSky(opts = {}) {
        if (!(glUtil.isArray(opts.url) && opts.url.length >= 6)) return null;
        const txue = new THREE.CubeTextureLoader().load(opts.url);
        txue.encoding = THREE.sRGBEncoding;
        txue._use = 1;
        return txue;
    }
}
