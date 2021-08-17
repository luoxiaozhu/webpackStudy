import EffectBase from '../../src/EffectBase';

class Component extends EffectBase {
    constructor(render) {
        super(render);

        this.time = { value: 0 };
    }

    // 效果初始化
    compEftInit() {
        this.baseInit();
        this._triggerInnerEvent('mounted', { val: this.config.name });
    }

    baseInit() {
        const {
            data, dpi, color, range = 100, size = 10, point, speed = 1, renderOrder, visible = true
        } = this.config;

        data.forEach((e) => {
            const path = this.tranformPath(e.data, dpi);
            const fly = this.createPoint({
                data: path,
                color: new THREE.Color(color),
                range,
                size,
                speed,
                point: this.renderer.getTxue(point)
            });
            this.group.add(fly);

            fly.renderOrder = renderOrder;
        });

        this.group.visible = visible;
    }

    createPoint({
        data, color, range = 100, size = 10, point, speed
    }) {
        const attrPositions = [];
        const attrCindex = [];

        data.forEach((p, i) => {
            attrPositions.push(p.x, p.y, p.z);
            attrCindex.push(i);
        });

        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(attrPositions, 3));
        // 传递当前所在位置
        geometry.setAttribute('index', new THREE.Float32BufferAttribute(attrCindex, 1));

        const shader = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            // depthTest: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uColor: {
                    value: color // 颜色
                },
                uRange: {
                    value: range // 显示当前范围的个数
                },
                uSize: {
                    value: size // 粒子大小
                },
                uSpeed: {
                    value: speed // 速度
                },
                uTotal: {
                    value: data.length // 当前粒子的所有的总数
                },
                uMap: {
                    value: point // 当前粒子的所有的总数
                },
                time: this.time
            },
            vertexShader: `
        attribute float index;
        uniform float time;
        uniform float uSize;
        uniform float uRange; // 展示区间
        uniform float uTotal; // 粒子总数
        uniform vec3 uColor;
        varying vec3 vColor;
        varying float vOpacity;
        uniform float uSpeed;
        void main() {
            // 需要当前显示的索引
            float size = uSize;
            float showNumber = uTotal * mod(time, 1.1);
            float tindex = mod(time * uSpeed, uTotal);

            vColor = uColor;
            if (tindex > index && tindex < index + uRange) {
                float ts = (index + uRange - tindex) / uRange;
                size *= ts;
                vOpacity = 1.0;
            } else {
                vOpacity = 0.0;
                size = 0.0;
            }

            // 顶点着色器计算后的Position
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            // 大小
            gl_PointSize = size * 300.0 / (-mvPosition.z);
        }`,
            fragmentShader: `
        uniform sampler2D uMap;
        uniform vec3 uColor;
        varying float vOpacity;
        void main() {
            gl_FragColor = vec4(uColor, vOpacity) * texture2D(uMap, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));
        }`
        });
        const fly = new THREE.Points(geometry, shader);
        return fly;
    }

    setVisible(visible) {
        this.group.visible = !!visible;
    }

    /**
     * 根据线条组生成路径
     * @param {*} arr 需要生成的线条组
     * @param {*} dpi 密度
     */
    tranformPath(arr, dpi = 1) {
        const vecs = [];
        for (let i = 1; i < arr.length; i++) {
            const src = arr[i - 1];
            const dst = arr[i];
            const s = new THREE.Vector3(src.x, src.y, src.z);
            const d = new THREE.Vector3(dst.x, dst.y, dst.z);
            const length = s.distanceTo(d) * dpi;
            const len = Math.round(length);
            for (let x = 0; x <= len; x++) {
                vecs.push(s.clone().lerp(d, x / len));
            }
        }
        return vecs;
    }

    // 动画
    animate = (dt) => {
        this.time.value += dt;
    }
}

export default Component;
