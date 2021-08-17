/**
 * path流光 zhoupu
 */
import glUtil from '../../utils';
import EffectBase from '../../src/EffectBase';

const _ShadersFL = {
    RoadVShader: `
        uniform float uTime;
        uniform float uTime2;
        uniform vec4 uColor;
        uniform vec3 uRatio;

        attribute vec4 cRatio;
        attribute vec4 cColor;

        varying vec4 vColor;
        varying vec3 vUv;

        const float PI = 3.14159265359;
        void main() {
            vUv = vec3(uv, cRatio.w);
            vColor = uColor * cColor;
            vec4 mP = modelViewMatrix * vec4(position + cRatio.xyz * uRatio.z, 1.0);
            gl_Position = projectionMatrix * mP;
        }
    `,

    RoadFShader: `
        uniform float uTime;
        uniform float uTime2;
        uniform vec3 uRatio;
        uniform sampler2D uTxue;

        varying vec4 vColor;
        varying vec3 vUv;
        const float PI = 3.14159265359;
        void main() {
            float c = 1.0 * uTime2;
            if (uTime > 0.0 && uRatio.y > 0.0 && vUv.z > 0.0) {
                float k = uTime - vUv.z; c = 0.0;
                float ma = (k <= 0.0 ? k + 1.0 : k) * (1.0 + uRatio.x);
                if (vUv.x > ma - uRatio.x && vUv.x < ma) {
                    c = 2.5 * sin(PI * (vUv.x - ma + uRatio.x) / uRatio.x);
                }
            }
            gl_FragColor = vec4(vColor.xyz, vColor.w * (0.2 + c)) * texture2D(uTxue, vUv.xy);
        }
    `
};

export default class FlowsEft extends EffectBase {
    constructor(render) {
        super(render);

        /**
         * [animate 组件效果动画入口]
         */
        this.animate = (dt) => {
            if (!this.config.isAnimate) return; // eslint-disable-line
            const node = this._flowObj;
            if (node && node._isFlows) {
                if (!node._isInit) {
                    this.nodeAmtFunc(dt, node, () => {
                        node._isInit = true;
                    }, '_transTimes1', '_initTime', 'uTime2');
                }
                this.nodeAmtFunc(dt, node);
            }
        };
    }

    // 添加默认参数
    setDefaultConfig(dfConfig) {
        glUtil.copy(dfConfig, {
            data: [
                /*
                [ [x, y], [x, y], [x, y] ], // 一条路径
                [ [x, y], [x, y], [x, y] ],
                */
            ],
            offsetY: 1, // 整体高度偏移
            initTime: 2, // 初始化时间
            lightTime: 1, // 光效周期时长
            effectLen: 1000, // 光效限制长度
            isLight: false, // 是否开启光效
            mtl: {
                width: 2, // 宽度
                effectRatio: 0.8, // 效果比例参数
                color: 'rgba(204, 204, 255, 0.5)', // 整体颜色
                txue: '' // 贴图名称
            },
            colors: [ // 随机颜色数组
                'rgba(102, 153, 255, 0.9)', 'rgba(255, 255, 102, 0.9)'
            ]
        });
    }

    // 销毁
    disposeCompEft() {

    }

    // 初始化入口
    compEftInit() {
        if (this._flowObj) glUtil.disposeNode(this._flowObj);

        const { data } = this.config;
        if (!(data && data.length)) return;
        this._flowObj = this.creatRoads(data, this.config);
        this.group.add(this._flowObj);

        this._triggerInnerEvent('mounted', { val: this.config.name });
    }

    // ---
    // 创建道路
    creatRoads(data, params) {
        const [lGeo, d, b, s = b[d].vScale, c = b[d].center] = [
            glUtil.geo.buf(), params.dataTans, params.basic
        ];

        const Buffer = {
            ofs: 0, // 点偏移
            l_uvs: [],
            l_color: [],
            l_ratio: [],
            l_indices: [],
            l_position: []
        };

        const Configs = {
            effectLen: params.effectLen,
            _colorArr: this.handleColor(params.colors)
        };
        for (let i = data.length - 1; i >= 0; i--) {
            const result = this.handleArray(data[i], s, c, false, true);
            this.roadsBuffer(result, Buffer, Configs);
        }

        lGeo.setIndex(Buffer.l_indices);
        lGeo.setAttribute('uv', new THREE.Float32BufferAttribute(Buffer.l_uvs, 2));
        lGeo.setAttribute('cColor', new THREE.Float32BufferAttribute(Buffer.l_color, 4));
        lGeo.setAttribute('cRatio', new THREE.Float32BufferAttribute(Buffer.l_ratio, 4));
        lGeo.setAttribute('position', new THREE.Float32BufferAttribute(Buffer.l_position, 3));

        // - mesh
        params.mtl.isEffect = params.isLight;
        const road = new THREE.Mesh(lGeo, this.roadsMtl(params.mtl));
        road.position.y = params.offsetY || 0;
        road.renderOrder = params.renderOrder || 0;
        road.name = 'flowsEft';

        road._isInit = false;
        road._transTimes = 0;
        road._transTimes1 = 0;
        road._isFlows = params.isLight;
        road._initTime = params.initTime - 0;
        road._perTimes = params.lightTime * (1 + Math.random() * 0.3);

        return road;
    }

    handleArray(arr, scale, center, minmax, distance) {
        const vec2s = [];
        let [vx, vy, dtc] = [0, 0, 0];
        let [xmax, xmin, ymax, ymin] = [-Infinity, Infinity, -Infinity, Infinity];

        const rlt = this.vec2StartEnd(arr, minmax);
        for (let k = rlt.vlen - 1; k >= 0; k--) {
            vx = (arr[k][0] - center[0]) * scale;
            vy = (arr[k][1] - center[1]) * scale;
            arr[k][0] = vx;
            arr[k][1] = vy;

            if (!minmax || k !== rlt.vlen - 1) vec2s.push([vx, vy]);
            if (distance && k > 0) dtc += this.vec2Distance(arr[k], arr[k - 1]);

            if (!minmax) continue;
            xmax = xmax > vx ? xmax : vx;
            xmin = xmin < vx ? xmin : vx;
            ymax = ymax > vy ? ymax : vy;
            ymin = ymin < vy ? ymin : vy;
        }

        return {
            x: xmin,
            y: ymin,
            w: xmax - xmin,
            h: ymax - ymin,
            l: rlt.vlen,
            vec2s,
            dtc
        };
    }

    vec2StartEnd(arr, type) {
        let [vlen, change] = [arr.length, false];
        const [start, end] = [arr[0], arr[vlen - 1]];
        if (type && (end[0] !== start[0] || end[1] !== start[1])) {
            arr.push([start[0], start[1]]);
            change = true;
        }
        vlen = change ? arr.length : vlen;
        return { change, vlen };
    }

    // vec2点数组 距离
    vec2Distance(vec2, preVec2) {
        const [dx, dy] = [vec2[0] - preVec2[0], vec2[1] - preVec2[1]];
        return Math.sqrt(dx * dx + dy * dy);
    }

    // 道路材质
    roadsMtl(opts) {
        const [roadColor, uRatio] = [
            glUtil.getColorArr(opts.color),
            this.uVector3(opts.effectRatio, opts.isEffect ? 1 : -1, opts.width)
        ];
        return glUtil.mtl.shader({
            uniforms: {
                uTime: { value: 0 },
                uTime2: { value: 0 },
                uRatio: { value: uRatio },
                uColor: { value: this.uColor(roadColor) },
                uTxue: { value: this.render.getTxue(opts.txue) } // 纹理
            },
            // wireframe: true,
            transparent: true,
            depthWrite: false,
            side: THREE.BackSide,
            polygonOffset: true,
            polygonOffsetUnits: 3.0,
            polygonOffsetFactor: 0.6,
            blending: THREE.AdditiveBlending,
            vertexShader: _ShadersFL.RoadVShader,
            fragmentShader: _ShadersFL.RoadFShader
        });
    }

    uVector3(...vec) {
        if (vec.length > 1) {
            vec[2] = vec[2] || 0;
            return new THREE.Vector3(vec[0], vec[1], vec[2]);
        }
        return new THREE.Vector3().copy(vec[0]);
    }

    uColor(cArr) {
        return new THREE.Vector4(cArr[0].r, cArr[0].g, cArr[0].b, cArr[1]);
    }

    // 道路几何体
    roadsBuffer(result, Buffer, opts) {
        const [randomC, pathInfo] = [
            Math.random(), this.getPathInfo([result.vec2s], false, true, false)
        ];
        const [vecs, bels, color, ratio] = [
            pathInfo.vertices, pathInfo.beveling,
            this.getArri(opts._colorArr, randomC),
            result.dtc > opts.effectLen ? randomC : -1
        ];

        for (let i = result.l - 1; i >= 0; i--) {
            const [k, m, n = m + 1] = [i / (result.l - 1), i * 2];
            Buffer.l_uvs.push(k, 1, k, 0);
            this.pushColor(Buffer.l_color, color, color); // - 顶点颜色,rgba
            Buffer.l_position.push(vecs[m], 0, vecs[n], vecs[m], 0, vecs[n]);
            Buffer.l_ratio.push(bels[m], 0.4, bels[n], ratio, -bels[m], 0.4, -bels[n], ratio);

            if (i < result.l - 1) this.sideIndices(Buffer.l_indices, i, Buffer.ofs);
        }
        Buffer.ofs += result.l * 2;
    }

    // 获取随机数组元素
    getArri(arr, key = Math.random()) {
        return arr[arr.length * key | 0];
    }

    // ----
    setShow(time, callback) {
        if (this._flowObj) {
            if (time) this.tweenTims = time;
            this.setTestTween(this._flowObj.material.uniforms.uTime, { value: 1 }, callback);
        }
    }

    setHide(time, callback) {
        if (this._flowObj) {
            if (time) this.tweenTims = time;
            this.setTestTween(this._flowObj.material.uniforms.uTime, { value: 0 }, callback);
        }
    }

    // 设置
    setConfig(type, arg) {
        switch (type) {
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
