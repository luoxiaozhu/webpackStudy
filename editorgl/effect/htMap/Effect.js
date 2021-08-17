/**
 * 热力图层，热力效果 zhoupu
 */
import glUtil from '../../utils';
import HEATMap from './Heatmap';
import EffectBase from '../../src/EffectBase';

const _ShadersHm = {
    HeatMapVShader: `
        uniform float u_time;
        uniform float u_opacity;
        uniform float u_height;
        uniform sampler2D u_shadow;

        varying vec2 vUv;
        varying float vShow;
        varying vec4 vColor;

        void main() {
            vUv = uv;
            vShow = texture2D(u_shadow, uv).w;
            vec3 pos = vec3(position.x, vShow * u_height, position.z);
            vColor = vec4(vec3(1.0), u_time * (2.0 - u_time) * u_opacity);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,

    HeatMapFShader: `
        uniform sampler2D u_txue;

        varying vec2 vUv;
        varying float vShow;
        varying vec4 vColor;

        void main() {
            if (vShow < 0.00000001) discard;
            // if (vShow < 0.00000001) gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5);
            else gl_FragColor = vColor * texture2D(u_txue, vUv);
        }
    `
};

export default class HeatMapEft extends EffectBase {
    constructor(render) {
        super(render);

        /**
         * [animate 组件效果动画入口]
         */
        this.animate = (/* dt */) => {
            // do something
        };
    }

    // 添加默认参数
    setDefaultConfig(dfConfig) {
        glUtil.copy(dfConfig, {
            data: [/* {
                vec: [x, y], // 位置坐标
                weight: 0 // 点位权重值
            } */],
            maximum: 'auto', // 最大值  number / 'auto'; auto-取数据的最大值
            minimum: 0, // 最小值  number / 'auto'; auto-取数据的最小值
            maxcolor: '#CC0000', // 最大值颜色 默认 #FF0000
            mincolor: '#000033', // 最小值颜色 默认 #0000FF
            height: 8, // 三维热力最大高度
            opacity: 0.75, // 透明度     取值 0 ~ 1
            segments: 200, // 细分段数，决定精细度
            blurRadius: 20, // 模糊半径
            offsetY: 1, // 高度位置
            cameraP: { x: -150, y: 200, z: 300 }, // 热力显示时的相机位置
            visible: false // 默认显示隐藏
        });
    }

    // 销毁
    disposeCompEft() {

    }

    // 初始化入口
    compEftInit(data = this.config.data, config) {
        if (this._heatMap) glUtil.disposeNode(this._heatMap);
        if (!(data && data.length)) return;
        if (config) glUtil.copy(this.config, config);
        this._heatMap = this.creatHeatMap(data, this.config);
        this.group.add(this._heatMap);
        this._triggerInnerEvent('mounted', { val: this.config.name });
    }

    // ---
    creatHeatMap(data, params) {
        const result = this.handleHMData(data, params);

        this.__HEATMap = HEATMap.create({
            container: document.createElementNS('http://www.w3.org/1999/xhtml', 'div'),
            width: result.w,
            height: result.h,
            radius: params.blurRadius,
            gradient: params.__gradient
        });

        this.__HEATMap.setData({
            min: params.minimum,
            max: params.maximum,
            data: result.heatmapData
        });

        const hGeo = glUtil.geo.plane(result.w, result.h, result.sw, result.sh);
        hGeo.applyMatrix4(this.Matrix(-1));

        const shadowTxue = new THREE.Texture(this.__HEATMap._renderer.shadowCanvas);
        shadowTxue.needsUpdate = true;
        const heatMapTxue = new THREE.Texture(this.__HEATMap._renderer.canvas);
        heatMapTxue.needsUpdate = true;

        const heatMap = new THREE.Mesh(hGeo, glUtil.mtl.shader({
            uniforms: {
                u_time: { value: params.visible ? 1 : 0 },
                u_height: { value: params.height },
                u_opacity: { value: params.opacity },
                u_shadow: { value: shadowTxue }, // 灰度图
                u_txue: { value: heatMapTxue } // 热力图
            },
            // wireframe: true,
            vertexShader: _ShadersHm.HeatMapVShader,
            fragmentShader: _ShadersHm.HeatMapFShader,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false
        }));
        heatMap.position.set(result.px, params.offsetY || 0, result.py);
        heatMap.renderOrder = 7;
        heatMap.name = 'heatMap';
        heatMap._isHeatMap = true;

        return heatMap;
    }

    handleHMData(data, params) {
        const [heatmapData, dlen, scale, center] = [
            [], data.length, params.basic[params.dataTans].vScale, params.basic[params.dataTans].center
        ];
        const mx = 100000000;
        let [xmax, xmin, ymax, ymin, nmax, nmin] = [-mx, mx, -mx, mx, -mx, mx];

        let [k, vx, vy] = [];
        for (k = dlen - 1; k >= 0; k--) {
            const [vi, num] = [data[k].vec, data[k].weight || 0];

            vx = (vi[0] - center[0]) * scale;
            vy = (vi[1] - center[1]) * scale;

            xmax = xmax > vx ? xmax : vx;
            xmin = xmin < vx ? xmin : vx;
            ymax = ymax > vy ? ymax : vy;
            ymin = ymin < vy ? ymin : vy;
            nmax = nmax > num ? nmax : num;
            nmin = nmin < num ? nmin : num;

            heatmapData.push({
                x: vx, y: vy, value: num, radius: params.blurRadius
            });
        }

        this.handleColors(params, { nmax, nmin });

        const [w1, h1, px, py, r]  = [
            xmax - xmin, ymax - ymin, (xmax + xmin) * 0.5, (ymax + ymin) * 0.5, params.blurRadius * 2
        ];
        const [w, h] = [THREE.Math.ceilPowerOfTwo(w1 + r), THREE.Math.ceilPowerOfTwo(h1 + r)];
        const [sw, sh] = [params.segments * (w > h ? 1 : w / h), params.segments * (h > w ? 1 : h / w)];

        heatmapData.forEach((hi) => {
            hi.x = (hi.x - xmin + (w - w1) * 0.5) | 0;
            hi.y = (hi.y - ymin + (h - h1) * 0.5) | 0;
        });

        return {
            heatmapData, w, h, px, py, sw, sh
        };
    }

    Matrix(k) {
        return new THREE.Matrix4().makeRotationX(1.570796 * k);
    }

    handleColors(params, result) {
        params.__gradient = {};
        const [minC, maxC] = [
            glUtil.getColorArr(params.mincolor), glUtil.getColorArr(params.maxcolor)];

        params.maximum = params.maximum === 'auto' ? result.nmax : params.maximum;
        params.minimum = params.minimum === 'auto' ? result.nmin : params.minimum;

        // - 分解颜色值
        const [_ci, cl0, cl1] = [
            [], minC[0].getHSL({ h: 0, s: 0, l: 0 }), maxC[0].getHSL({ h: 0, s: 0, l: 0 })
        ];
        const [color0, color1, rang] = [
            new THREE.Vector3(cl0.h, cl0.s, cl0.l),
            new THREE.Vector3(cl1.h, cl1.s, cl1.l),
            params.maximum - params.minimum
        ];

        _ci.push(params.minimum, params.maximum);
        _ci.push(minC[1], (maxC[1] - minC[1]) / rang);
        _ci.push(color0, color1.sub(color0).divideScalar(rang));

        params.__gradient['0.25'] = glUtil.getRGBColor(minC);
        let cArr = this.getRatioColors(_ci, rang * 0.5);
        params.__gradient['0.55'] = glUtil.getRGBColor(cArr);
        cArr = this.getRatioColors(_ci, rang * 0.75);
        params.__gradient['0.85'] = glUtil.getRGBColor(cArr);
        params.__gradient['1.0'] = glUtil.getRGBColor(maxC);
    }

    getRatioColors(colors, ratio) {
        const _cArr = [];
        const _v = colors[4].clone().add(colors[5].clone().multiplyScalar(ratio));
        const _c = glUtil.color().setHSL(_v.x, _v.y, _v.z);
        _cArr.push(_c, colors[2] + colors[3] * (ratio));
        return _cArr;
    }

    // ----
    setShow(time, callback) {
        if (this._heatMap) {
            if (time) this.tweenTims = time;
            this.setTestTween(this._heatMap.material.uniforms.u_time, { value: 1 }, callback);
            if (this.config.cameraP) {
                this.tweenTims = 800;
                this._currentPosition = this.render.camera.position.clone();
                this.setTestTween(this.render.camera.position, this.config.cameraP);
            }
        }
    }

    setHide(time, callback) {
        if (this._heatMap) {
            if (time) this.tweenTims = time;
            this.setTestTween(this._heatMap.material.uniforms.u_time, { value: 0 }, callback);
            if (this.config.cameraP) {
                this.setTestTween(this.render.camera.position, this._currentPosition);
            }
        }
    }

    // 设置热力图
    setConfig(type, arg = {}) {
        switch (type) {
        case 'loade': // 重新加载底图
            this.compEftInit(arg.data, arg.config);
            break;
        case 'hide':
            this.setHide(arg.time, arg.callback);
            break;
        case 'show':
            this.setShow(arg.time, arg.callback);
            break;
        default:
            break;
        }
    }
}
