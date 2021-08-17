/**
 * 飞鸟效果 zhoupu
 */
import './GPUComputationRenderer';
import glUtil from '../../utils';
import EffectBase from '../../src/EffectBase';

const _ShadersFY = {
    PositionFShade: /* 位置 */`
        uniform float time;
        uniform float delta;

        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            vec4 tmpPos = texture2D(txuePos, uv);
            vec3 velocity = texture2D(txueVlt, uv).xyz;

            float phase = mod((tmpPos.w + delta +
                length(velocity.xz) * delta * 3. +
                max(velocity.y, 0.0) * delta * 6.), 62.83);

            gl_FragColor = vec4(tmpPos.xyz + velocity * delta * 15., phase);
        }
    `,

    VelocityFShader: /* 位移 */`
        uniform float time;
        uniform float testing;
        uniform float delta; // about 0.016
        uniform float separationD; // 20
        uniform float alignmentD; // 40
        uniform float cohesionD; //
        // uniform float freedomF;
        uniform vec3 predator;

        const float width = resolution.x;
        const float height = resolution.y;

        const float PI = 3.141592653589793;
        const float PI_2 = PI * 2.0;

        const float SPEED_LIMIT = 9.0;

        float rand(vec2 co){
            return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
        }

        void main() {

            float zoneRadius = radius * (separationD + alignmentD + cohesionD);
            float separationThresh = separationD / zoneRadius;
            float alignmentThresh = (separationD + alignmentD) / zoneRadius;
            float zoneRadiusSquared = zoneRadius * zoneRadius;

            float separationSquared = separationD * separationD;
            float cohesionSquared = cohesionD * cohesionD;

            vec2 uv = gl_FragCoord.xy / resolution.xy;

            vec3 selfPosition = texture2D(txuePos, uv).xyz; // -- position
            vec3 selfVelocity = texture2D(txueVlt, uv).xyz;

            float dist, distSquared, f, percent, limit = SPEED_LIMIT;;
            vec3 dir = predator - selfPosition, velocity = selfVelocity; // -- dir - direction

            dist = length(dir);
            distSquared = dist * dist;

            float preyRadiusSq = preyRadius * preyRadius;

            // -- move birds away from predator
            if (isPrey > 0.0 && dist < preyRadius) {
                f = (distSquared / preyRadiusSq - 1.0) * delta * 100.;
                velocity += normalize( dir ) * f;
                limit += 5.0;
            }

            // -- Attract flocks to the center
            // vec3 central = vec3(510.0, 370.0, 0.);
            dir = selfPosition - central;
            dist = length(dir);

            dir.y *= 2.5;
            velocity -= normalize(dir) * delta * 5.;

            vec3 birdPosition, birdVelocity;
            for (float y = 0.0; y < height; y++) {
                for (float x = 0.0; x < width; x++) {

                    vec2 ref = vec2(x + 0.5, y + 0.5) / resolution.xy;
                    birdPosition = texture2D(txuePos, ref).xyz;

                    dir = birdPosition - selfPosition;
                    dist = length(dir);

                    if (dist < 0.0001) continue;

                    distSquared = dist * dist;

                    if (distSquared > zoneRadiusSquared) continue;

                    percent = distSquared / zoneRadiusSquared;

                    if (percent < separationThresh) { // low
                        // -- Separation - Move apart for comfort
                        f = (separationThresh / percent - 1.0) * delta;
                        velocity -= normalize(dir) * f;

                    } else if (percent < alignmentThresh) { // high
                        // -- Alignment - fly the same direction
                        float threshDelta = alignmentThresh - separationThresh;
                        float adjustedPercent = (percent - separationThresh) / threshDelta;

                        birdVelocity = texture2D(txueVlt, ref).xyz;

                        f = (0.5 - cos(adjustedPercent * PI_2) * 0.5 + 0.5) * delta;
                        velocity += normalize(birdVelocity) * f;

                    } else {
                        // -- Attraction / Cohesion - move closer
                        float threshDelta = 1.0 - alignmentThresh;
                        float adjustedPercent;
                        if(threshDelta == 0.) adjustedPercent = 1.;
                        else adjustedPercent = (percent - alignmentThresh) / threshDelta;

                        f = (0.5 - (cos(adjustedPercent * PI_2) * -0.5 + 0.5)) * delta;

                        velocity += normalize(dir) * f;
                    }
                }
            }

            // -- this make tends to fly around than down or up
            // if (velocity.y > 0.) velocity.y *= (1. - 0.2 * delta);

            // -- Speed Limits
            if (length(velocity) > limit) {
                velocity = normalize(velocity) * limit;
            }

            gl_FragColor = vec4(velocity, 1.0);
        }
    `
};

export default class FlyerEft extends EffectBase {
    constructor(render) {
        super(render);

        this.isShow = true;

        /**
         * [animate 组件效果动画入口]
         */
        let times = performance.now();
        this.animate = (dt) => {
            if (!this.config.isAnimate) return; // eslint-disable-line
            times += dt * 1000;
            if (!this.isShow) return;
            if (!this.gpuCompt) return;

            this.posUniforms.delta.value = dt;
            this.posUniforms.time.value = times;
            this.vltUniforms.delta.value = dt;
            this.vltUniforms.time.value = times;
            if (this.config.isPrey) {
                const ty = this.config.center.y;
                const vec3 = glUtil.transPosition(this.renderer._Events._Mouse2, ty, this.renderer);
                this.vltUniforms.predator.value.copy(vec3);
            }

            if (this.mtlShader) {
                this.mtlShader.uniforms.delta.value = dt;
                this.mtlShader.uniforms.time.value = times / 1000;
            }

            this.gpuCompt.compute();

            if (this.mtlShader) {
                this.mtlShader.uniforms.txuePos.value = this.gpuCompt.getCurrentRenderTarget(this.posVarib).texture;
                this.mtlShader.uniforms.txueVlt.value = this.gpuCompt.getCurrentRenderTarget(this.vltVarib).texture;
            }
        };
    }

    // 添加默认参数
    setDefaultConfig(dfConfig) {
        glUtil.copy(dfConfig, {
            url: '', // 模型路径
            size: 0.1, // 大小
            width: 16, // 2的n次方，决定数量(width*width)和纹理(dataTxue的大小)
            count: 0.6, // 0 ~ 1, 数量系数
            isShow: false, // 初始显示隐藏

            center: { x: 500, y: 300, z: 0 }, // 效果环绕中心
            radius: 0.7, // 半径系数
            isPrey: true, // 是否鼠标位置影响
            preyRadius: 400, // 鼠标位置影响半径

            // freedom: 0.75, // 自由率
            cohesion: 20, // 凝聚距离
            alignment: 20, // 队列距离
            separation: 20, // 离散距离

            scopeR: { x: 1, y: 0.2, z: 1 } // 效果范围影响系数
        });
    }

    // 销毁
    disposeCompEft() {
        this.gpuCompt = null;
    }

    // 初始化入口
    compEftInit() {
        const opts = this.config;
        this.WIDTH = opts.width;
        this.COUNTS = opts.count;
        this.BIRDS = this.WIDTH * this.WIDTH;
        this.BirdGeo = glUtil.geo.buf();

        this.loadBirds(opts);
        this.computeRender(opts);
    }

    // ----
    nextPowerOf2(n) {
        return 2 ** Math.ceil(Math.log(n) / Math.log(2));
    }

    // 根据参数 l(0~1) 返回 val1 到 val2 之间的值
    lerp(val1, val2, l) {
        l = Math.max(Math.min(l, 1), 0);
        return val1 + (val2 - val1) * l;
    }

    // 加载模型
    loadBirds(opts) {
        new THREE.GLTFLoader().load(opts.url, (gltf) => {
            const [amts, bGeo] = [gltf.animations, gltf.scene.children[0].geometry];
            const posAttr = bGeo.getAttribute('position');

            const vtxBird = posAttr.count;
            const durtAmt = Math.round(amts[0].duration * 60);

            const mphAttr = bGeo.morphAttributes.position;
            const [tHt, tWh] = [this.nextPowerOf2(durtAmt), this.nextPowerOf2(vtxBird)];

            const tData = new Float32Array(3 * tWh * tHt);
            for (let i = 0; i < tWh; i++) {
                for (let j = 0; j < tHt; j++) {
                    const [kj, offset] = [j / durtAmt, j * tWh * 3];

                    const lpCnt = (kj * mphAttr.length) % 1;
                    const curM = Math.floor(kj * mphAttr.length);
                    const nxtM = (Math.floor(kj * mphAttr.length) + 1) % mphAttr.length;

                    if (j < durtAmt) {
                        let d0; let
                            d1;

                        d0 = mphAttr[curM].array[i * 3];
                        d1 = mphAttr[nxtM].array[i * 3];
                        if (d0 !== undefined && d1 !== undefined) tData[offset + i * 3] = this.lerp(d0, d1, lpCnt);

                        d0 = mphAttr[curM].array[i * 3 + 1];
                        d1 = mphAttr[nxtM].array[i * 3 + 1];
                        if (d0 !== undefined && d1 !== undefined) tData[offset + i * 3 + 1] = this.lerp(d0, d1, lpCnt);

                        d0 = mphAttr[curM].array[i * 3 + 2];
                        d1 = mphAttr[nxtM].array[i * 3 + 2];
                        if (d0 !== undefined && d1 !== undefined) tData[offset + i * 3 + 2] = this.lerp(d0, d1, lpCnt);
                    }
                }
            }

            // 模型动画写入 数据纹理中
            this.txueAmt = new THREE.DataTexture(tData, tWh, tHt, THREE.RGBFormat, THREE.FloatType);
            this.txueAmt.needsUpdate = true;

            const [vertices, color, reference, seeds, indices] = [[], [], [], [], []];

            // 扩展数量
            for (let i = 0; i < vtxBird * 3 * this.BIRDS; i++) {
                const bIdx = i % (vtxBird * 3);
                vertices.push(posAttr.array[bIdx]);
                color.push(bGeo.getAttribute('color').array[bIdx]);
            }

            // let r = Math.random();
            for (let i = 0; i < vtxBird * this.BIRDS; i++) {
                const bIdx = i % vtxBird;
                const bird = Math.floor(i / vtxBird);
                // if (bIdx == 0) r = Math.random();
                const j = ~~bird;
                const x = (j % this.WIDTH) / this.WIDTH;
                const y = ~~(j / this.WIDTH) / this.WIDTH;
                reference.push(x, y, bIdx / tWh, durtAmt / tHt);
                seeds.push(bird, Math.random());
            }

            const [idxArr, idxLen = idxArr.length] = [bGeo.index.array];
            for (let i = 0; i < idxLen * this.BIRDS; i++) {
                const offset = Math.floor(i / idxLen) * vtxBird;
                indices.push(idxArr[i % idxLen] + offset);
            }

            this.BirdGeo.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
            this.BirdGeo.setAttribute('seeds', new THREE.Float32BufferAttribute(seeds, 2));
            this.BirdGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            this.BirdGeo.setAttribute('reference', new THREE.Float32BufferAttribute(reference, 4));

            this.BirdGeo.setIndex(indices);
            const lr = (this.BIRDS * this.COUNTS) | 0;
            this.BirdGeo.setDrawRange(0, idxLen * lr);
            this.BirdGeo.attributes.position.needsUpdate = true;

            this.initBirds(opts);
        });
    }

    // 初始化纹理数据
    fillTxue(txue, key = 10) {
        const theArray = txue.image.data;
        for (let k = 0, kl = theArray.length; k < kl; k += 4) {
            const [x, y, z] = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5];

            theArray[k + 0] = x * key;
            theArray[k + 1] = y * key;
            theArray[k + 2] = z * key;
            theArray[k + 3] = 1;
        }
    }

    computeRender(opts) {
        this.gpuCompt = new THREE.GPUComputationRenderer(this.WIDTH, this.WIDTH, this.renderer.renderer);

        const dtPosition = this.gpuCompt.createTexture();
        const dtVelocity = this.gpuCompt.createTexture();
        this.fillTxue(dtPosition, 100);
        this.fillTxue(dtVelocity, 10);

        this.vltVarib = this.gpuCompt.addVariable('txueVlt', _ShadersFY.VelocityFShader, dtVelocity);
        this.posVarib = this.gpuCompt.addVariable('txuePos', _ShadersFY.PositionFShade, dtPosition);

        this.gpuCompt.setVariableDependencies(this.vltVarib, [this.posVarib, this.vltVarib]);
        this.gpuCompt.setVariableDependencies(this.posVarib, [this.posVarib, this.vltVarib]);

        this.posUniforms = this.posVarib.material.uniforms;
        this.vltUniforms = this.vltVarib.material.uniforms;

        this.posUniforms.time = { value: 0.0 };
        this.posUniforms.delta = { value: 0.0 };
        this.vltUniforms.time = { value: 1.0 };
        this.vltUniforms.delta = { value: 0.0 };
        this.vltUniforms.testing = { value: 1.0 };
        // this.vltUnifms["freedomF"] = { value: opts.freedom }; // 自由率
        this.vltUniforms.cohesionD = { value: opts.cohesion }; // 凝聚距离
        this.vltUniforms.alignmentD = { value: opts.alignment }; // 队列距离
        this.vltUniforms.separationD = { value: opts.separation }; // 离散距离
        this.vltUniforms.predator = { value: new THREE.Vector3() }; // 捕食者位置

        const ct = opts.center; // 中心点
        this.vltVarib.material.defines.central = `vec3(${ct.x.toFixed(1)}, ${ct.y.toFixed(1)}, ${ct.z.toFixed(1)})`;
        this.vltVarib.material.defines.radius = opts.radius.toFixed(2); // 效果半径
        this.vltVarib.material.defines.isPrey = (opts.isPrey ? 1 : -1).toFixed(2); // 是否开启捕食
        this.vltVarib.material.defines.preyRadius = opts.preyRadius.toFixed(2); // 捕食者半径

        this.vltVarib.wrapS = THREE.RepeatWrapping;
        this.vltVarib.wrapT = THREE.RepeatWrapping;
        this.posVarib.wrapS = THREE.RepeatWrapping;
        this.posVarib.wrapT = THREE.RepeatWrapping;

        const error = this.gpuCompt.init();
        if (error !== null) console.error(error); // eslint-disable-line
    }

    initBirds(opts) {
        const bMtl = glUtil.mtl.standard({
            vertexColors: true, flatShading: true, roughness: 1, metalness: 0, transparent: true
        });
        const sr = opts.scopeR;
        bMtl.defines.scopeR = `vec3(${sr.x.toFixed(1)}, ${sr.y.toFixed(1)}, ${sr.z.toFixed(1)})`;

        bMtl.onBeforeCompile = (shader) => {
            shader.uniforms.txuePos = { value: null };
            shader.uniforms.txueVlt = { value: null };
            shader.uniforms.txueAmt = { value: this.txueAmt };
            shader.uniforms.time = { value: 1.0 };
            shader.uniforms.size = { value: opts.size };
            shader.uniforms.delta = { value: 0.0 };
            shader.uniforms.uTime = { value: opts.isShow ? 1.0 : 0.0 }; // 控制显示隐藏
            this.isShow = opts.isShow;

            let token = '#define STANDARD';
            let insert = /* glsl */`
                attribute vec4 reference;
                attribute vec2 seeds;
                // attribute vec3 birdColor;
                uniform sampler2D txuePos;
                uniform sampler2D txueVlt;
                uniform sampler2D txueAmt;
                uniform float size;
                uniform float time;
            `;
            shader.vertexShader = shader.vertexShader.replace(token, token + insert);

            token = '#include <begin_vertex>';
            insert = /* glsl */`
                vec4 tmpPos = texture2D(txuePos, reference.xy);
                vec3 pos = tmpPos.xyz * scopeR;

                vec3 velocity = normalize(texture2D(txueVlt, reference.xy).xyz);
                vec3 v3 = seeds.x * (0.0004 + seeds.y / 10000.0 + velocity / 20000.0);
                vec3 aniPos = texture2D(txueAmt, vec2(reference.z, mod(time + v3, reference.w))).xyz;

                vec3 newPosition = position;

                newPosition = mat3(modelMatrix) * (newPosition + aniPos);
                newPosition *= size + seeds.y * size * 0.2;

                velocity.z *= -1.;
                float xz = length(velocity.xz);
                float xyz = 1.;
                float x = sqrt(1. - velocity.y * velocity.y);

                float cosry = velocity.x / xz;
                float sinry = velocity.z / xz;

                float cosrz = x / xyz;
                float sinrz = scopeR.y * velocity.y / xyz;

                mat3 maty =  mat3(cosry, 0, -sinry, 0, 1, 0, sinry, 0, cosry);
                mat3 matz =  mat3(cosrz, sinrz, 0, -sinrz, cosrz, 0, 0, 0, 1);

                newPosition = maty * matz * newPosition;
                newPosition += pos;

                vec3 transformed = vec3(newPosition);
            `;
            shader.vertexShader = shader.vertexShader.replace(token, insert);

            // --
            token = '#define STANDARD';
            insert = '\nuniform float uTime;';
            shader.fragmentShader = shader.fragmentShader.replace(token, token + insert);

            token = '#include <dithering_fragment>';
            insert = '\ngl_FragColor *= vec4(1.0, 1.0, 1.0, uTime);';
            shader.fragmentShader = shader.fragmentShader.replace(token, token + insert);

            this.mtlShader = shader;
        };

        const birdMesh = new THREE.Mesh(this.BirdGeo, bMtl);
        birdMesh.castShadow = true;
        birdMesh.receiveShadow = true;
        birdMesh.rotation.y = Math.PI / 2;

        this.group.add(birdMesh);

        this._triggerInnerEvent('mounted', { val: this.config.name }); // 完成
    }

    // ----
    setShow(time, callback) {
        if (this.mtlShader) {
            this.isShow = true;
            if (time) this.tweenTims = time;
            this.setTestTween(this.mtlShader.uniforms.uTime, { value: 1 }, callback);
        }
    }

    setHide(time, callback) {
        if (this.mtlShader) {
            if (time) this.tweenTims = time;
            this.setTestTween(this.mtlShader.uniforms.uTime, { value: 0 }, () => {
                this.isShow = false;
                glUtil.exeFunction(callback);
            });
        }
    }

    // 设置
    setConfig(type, arg = {}) {
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
