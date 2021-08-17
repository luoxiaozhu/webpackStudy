/**
 * 围栏效果 by zhoupu
 */
import glUtil from '../../utils';
import EffectBase from '../../src/EffectBase';

const _ShadersFC = {
    // 顶点着色器
    BaseVertex: `
        precision lowp float;
        varying vec2 vUv;
        void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,

    // 片元着色器
    FireFragment: `
        precision mediump float;
        uniform float time;
        uniform vec3 color;
        uniform float opacity;

        varying vec2 vUv; // 正常纹理

        float snoise(vec3 uv, float res) {
        const vec3 s = vec3(1e0, 1e2, 1e3);

        uv *= res;

        vec3 uv0 = floor(mod(uv, res))*s;
        vec3 uv1 = floor(mod(uv+vec3(1.), res))*s;

        vec3 f = fract(uv);
        f = f*f*(4.0-3.0*f);

        vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z, uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);
        vec4 r = fract(sin(v*1e-1)*1e3);
        float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);

        r = fract(sin((v + uv1.z - uv0.z)*1e-1)*1e3);
        float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);

        return mix(r0, r1, f.z)*2.-1.;
        }

        void main() {

        vec2 p = vec2(-0.5 + vUv.x, (1. - vUv.y)*0.4);

        float aColor = 3. - (6.*p.y );

        vec3 coord = vec3(atan(p.x, p.y)/6.2832+.5, length(p)*.4, .5);
        coord = 1.0 - coord;

        for(int i = 1; i <= 3; i++) {
            float power = pow(2.0, float(i));
            aColor += (0.4 / power) * snoise(coord + vec3(.0, -time*.04, time*.03), power*16.);
        }
        aColor = 1.0 - aColor;
        aColor *= 2.7;
        aColor *= smoothstep(0.43, 0.4, p.y);

        gl_FragColor = vec4(vec3(aColor), aColor) * vec4(color, opacity * 0.22);

        // gl_FragColor = vec4(aColor, pow(max(aColor,0.),2.)*0.4, pow(max(aColor,0.),3.)*0.15 , aColor);
        }`,
    //
    FireFragment0: `
        precision mediump float;
        uniform float time;
        uniform vec3 color;

        varying vec2 vUv; // 正常纹理

        float snoise(vec3 uv, float res) {
        const vec3 s = vec3(1e0, 1e2, 1e3);

        uv *= res;

        vec3 uv0 = floor(mod(uv, res))*s;
        vec3 uv1 = floor(mod(uv+vec3(1.), res))*s;

        vec3 f = fract(uv);
        f = f*f*(4.0-3.0*f);

        vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z, uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);
        vec4 r = fract(sin(v*1e-1)*1e3);
        float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);

        r = fract(sin((v + uv1.z - uv0.z)*1e-1)*1e3);
        float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);

        return mix(r0, r1, f.z)*2.-1.;
        }

        void main() {

        vec2 p = -0.5 + vUv;

        float aColor = 3. - (3.*length(2.*p));

        vec3 coord = vec3(atan(p.x,p.y)/6.2832+.5, length(p)*.4, .5);
        coord = 1.0 - coord;

        for(int i = 1; i <= 2; i++) {
            float power = pow(2.0, float(i));
            aColor += (0.4 / power) * snoise(coord + vec3(0., -time*.05, time*.01), power*16.);
        }
        aColor = 1.0 - aColor;
        aColor *= 2.7;

        aColor *= smoothstep(0.43, 0.4, length(p));
        gl_FragColor = vec4(aColor) * vec4(color, 1.);

        // gl_FragColor = vec4(aColor, pow(max(aColor,0.),2.)*0.4, pow(max(aColor,0.),3.)*0.15 , aColor);
        //gl_FragColor = vec4(pow(max(aColor,0.),3.)*0.15, pow(max(aColor,0.),2.)*0.4, aColor, aColor);
        }`
};

export default class FlowsEft extends EffectBase {
    constructor(render) {
        super(render);

        this.aTime = { value: 0 };
        this.aOpacity = { value: 0 };

        /**
         * [animate 组件效果动画入口]
         */
        let key = 0;
        this.animate = (dt) => {
            if (!this.config.isAnimate) return; // eslint-disable-line
            if (key < 4) {
                key += dt;
                this.aOpacity.value = key / 4;
            }
            this.aTime.value += dt;
        };
    }

    // 添加默认参数
    setDefaultConfig(dfConfig) {
        glUtil.copy(dfConfig, {
            fire: [
                // {
                //     points: [[0, 0, 0]], // 位置
                //     radius: 50, // 半径
                //     height: 50,// 高度
                //     seg: 64, // 边数
                //     color: '#ff0000' // 颜色
                // }
            ]
        });
    }

    // 销毁
    disposeCompEft() {

    }

    // 效果初始化
    compEftInit() {
        this.creatEft();

        this._triggerInnerEvent('mounted', { val: this.config.name });
    }

    // ---
    // 创建
    creatEft() {
        /*
        const plane = new THREE.Mesh(glUtil.geo.plane(100, 100), glUtil.mtl.shader({
            uniforms: {
                time: this.aTime,
                color: { value: glUtil.color('#0f37ff') }
            },
            blending: THREE.AdditiveBlending,//颜色混合
            transparent: true,//开启透明度通道
            side: THREE.DoubleSide,
            depthTest: false,//关闭深度测试
            vertexShader: _ShadersFC.BaseVertex, //顶点着色器
            fragmentShader: _ShadersFC.FireFragment0 //片元着色器
        }));
        plane.rotateX(-Math.PI*.45);
        this.group.add(plane);

        let cylinder1 = new THREE.Mesh(glUtil.geo.cylinder(50, 50, 100, 64, true), glUtil.mtl.shader({
            uniforms: {
                time: this.aTime,
                color: { value: glUtil.color('#ff1130') }
            },
            blending: THREE.AdditiveBlending,//颜色混合
            transparent: true,//开启透明度通道
            side: THREE.DoubleSide,
            depthTest: false,//关闭深度测试
            vertexShader: _ShadersFC.BaseVertex, //顶点着色器
            fragmentShader: _ShadersFC.FireFragment0 //片元着色器
        }));

        // 生产颜色纹理数据
        let geometry1 = cylinder1.geometry;
        let uvs1 = [];
        let positions1 = geometry1.attributes.position;
        let len1 = positions1.count/2;
        for( let i =0; i<len1; i++){

            uvs1.push(0.5, 0.5);
        }
        for( let i =0; i<len1; i++){

            let s = ( positions1.getX(i+len1) / 50 + 1 ) / 2;
            let t = ( positions1.getZ(i+len1) / 50 + 1 ) / 2;
            uvs1.push(s, t);
        }
        geometry1.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs1, 2 ) );
        cylinder1.position.set(0, 0, 150);
        this.group.add(cylinder1);
        */

        // 配置项
        const { fire } = this.config;

        // mesh
        fire.forEach((config) => {
            // 配置项
            const {
                radius, height, seg, points
            } = config;

            const geometry = glUtil.geo.cylinder(radius, radius, height, seg, true);
            this.updateGeometry(geometry, radius); // 生产颜色纹理数据
            const material = this.getMaterial(config);

            points.forEach((p) => {
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.fromArray(p, 0);
                mesh.rotation.set(0, 0.8, 0);
                mesh.renderOrder = 22;
                this.group.add(mesh);
            });
        });
    }

    updateGeometry(geometry, radius) {
        // 生产颜色纹理数据
        const positions = geometry.attributes.position;
        const uvs = geometry.attributes.uv;
        for (let i = 0, len = positions.count; i < len; i++) {
            const s = (positions.getX(i) / radius + 1) / 2;
            // let t = (positions.getZ(i) / radius + 1) / 2;
            uvs.setX(i, s);
        }
        // uvs.needsUpdate = true;
    }

    getMaterial(config) {
        // 配置项
        const { color } = config;

        // shader参数-uniforms
        const uniforms = {
            time: this.aTime,
            opacity: this.aOpacity,
            color: { value: glUtil.color(color) }
        };

        // 材质对象-material
        const material = glUtil.mtl.shader({
            uniforms,
            blending: THREE.AdditiveBlending, // 颜色混合
            transparent: true, // 开启透明度通道
            side: THREE.DoubleSide,
            depthWrite: false, // 关闭深度测试
            vertexShader: _ShadersFC.BaseVertex, // 顶点着色器
            fragmentShader: _ShadersFC.FireFragment // 片元着色器
        });

        return material;
    }
}
