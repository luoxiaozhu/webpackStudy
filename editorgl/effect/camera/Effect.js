import EffectBase from '../../src/EffectBase';
import glUtil from '../../utils';

class Component extends EffectBase {
    constructor(render) {
        super(render);
        this.aniatePath = [];
        this.isHindrance = true; // 是否看起拦截

        // 当前衔接参数
        this.cohesionState = false;
        this.cohesionConfig = {
            state: false, // 当前是否暂停
            animate: 4, // 动画衔接的时间
            wait: 4, // 等待的时间
            time: 0,
            source: null,
            target: null
        };
    }

    // 效果初始化
    compEftInit() {
        this.aniatePath = this.handlePaths(this.config.data);
        this._triggerInnerEvent('mounted', { val: this.config.name });
    }

    disposeCompEft() {
        this.aniatePath = null;
        this.cohesionConfig = null;
    }

    // 启动动画
    start(id, state = true, callback) {
        this.aniatePath.forEach((e, i) => {
            if (id === e.id) {
                // 重新处理当前路径数据
                if (e.cohesion) {
                    // 判断当前
                    this.aniatePath[i] = this.handlePath(e);
                }
                const elem = this.aniatePath[i];
                elem.state = state;
                elem.cTime = 0;
                elem.index = 0;
                elem.callback = () => {
                    console.log(2);
                    if (callback) callback();
                };
                this.cohesionState = elem.loop;
            } else {
                e.state = false;
            }
        });
    }

    // 处理所有数据
    handlePaths(datas) {
        return datas.map((elem) => this.handlePath(elem));
    }

    // 处理单个
    handlePath(elem) {
        const {
            id, time, data, cohesion = true, loop = false, pause = false, callback
        } = elem;
        let length = 0;
        // 判断当前数据是否添加衔接数据
        if (cohesion) {
            const { camera, target } = this.getCameraData();
            if (!data[0].cohesion) {
                data.unshift({
                    camera,
                    target,
                    cohesion
                });
            } else {
                data[0].camera = camera;
                data[0].target = target;
            }
        }
        // 处理数据
        data.forEach((d, i) => {
            const { type = 'none', speed = 1 } = d; // 读取类型
            if (type === 'none') {
                const { camera, target } = d;
                d.camera = new THREE.Vector3(camera.x, camera.y, camera.z);
                d.target = new THREE.Vector3(target.x, target.y, target.z);
                // 当前距离0的距离
                if (i !== 0) {
                    length += (data[i - 1].camera.distanceTo(d.camera) / (speed || 1));
                }
            } else if (type === 'spin') {
                // 求的当前的半径周长
                const { angle = [0, Math.PI] } = d;

                // 找到动画时的camera位置
                const camera = this.getCaneraIng(data[i - 1]);
                const target = d.target || this.getTargetIng(data[i - 1]);
                const oC = new THREE.Vector2(camera.x, camera.z);
                const oT = new THREE.Vector2(target.x, target.z);

                d.camera = camera;
                d.target = target;

                // 计算半径
                const radius = oC.distanceTo(oT);

                // 计算周长
                length += (((angle[1] - angle[0]) * (radius * 2)) / speed);
            }
            d.type = type;
            d.length = length;
            d.easing = d.easing || elem.easing;
        });

        return {
            id, // id
            cTime: 0,
            cohesion, // 是否衔接
            time, // 动画总时间
            data, // 数据
            index: 0, // 当前进行百分比
            start: false, // 当前启动状态
            length,
            loop,
            pause,
            callback
        };
    }

    updateCamera(camera, target) {
        this.renderer.camera.position.copy(camera);
        this.renderer.controls.target.copy(target);
    }

    // 获取当时相机所在位置
    getCaneraIng(data) {
        if (data && data.camera) {
            return data.camera;
        }

        return this.renderer.camera.position.clone();
    }

    // 获取当时target所在位置
    getTargetIng(data) {
        if (data && data.target) {
            return data.target;
        }

        return this.renderer.controls.target.clone();
    }

    // 获取当前镜头的相关参数
    getCameraData() {
        const camera = this.renderer.camera.position;
        const controls = this.renderer.controls.target;
        return glUtil.getCameraData(camera, controls);
    }

    // 动画
    animate = (dt) => {
        if (this.cohesionConfig && this.cohesionConfig.state && this.cohesionState) {
            const {
                animate, wait, time, source, target
            } = this.cohesionConfig;
            const total = animate + wait;
            if (time >= total) {
                this.cohesionConfig.time = total;
                this.cohesionConfig.state = false;
            }
            if (time >= wait) {
                if (!target) {
                    this.cohesionConfig.target = {
                        camera: this.renderer.camera.position.clone(),
                        target: this.renderer.controls.target.clone()
                    };
                }
                const i = THREE.MathUtils.clamp((time - wait) / animate, 0, 1);

                const _i = glUtil.easing(i, 'Quartic.InOut');

                this.renderer.camera.position.copy(this.cohesionConfig.target.camera.clone().lerp(source.camera, _i));
                this.renderer.controls.target.copy(this.cohesionConfig.target.target.clone().lerp(source.target, _i));
                if (i >= 1) {
                    this.cohesionConfig.time = total;
                    this.cohesionConfig.state = false;

                    this.cohesionConfig.source = null;
                    this.cohesionConfig.target = null;
                }
            }
            this.cohesionConfig.time += dt;
            return;
        }
        const pLen = this.aniatePath.length;
        for (let i = 0; i < pLen; i++) {
            const elem = this.aniatePath[i];
            // 判断当前是否暂停
            if (!elem.state) continue;
            // 进行进度
            elem.cTime += (dt * 1000);

            elem.index = elem.cTime / elem.time;
            if (elem.index > 1) {
                elem.index = 1;
            }
            // 计算当前距离所在
            const len = elem.index * elem.length;

            // 找到当前len是出于哪两组数据之间
            elem.data.forEach((d, j) => {
                if (d.length > len && len > elem.data[j - 1].length) {
                    const prv = elem.data[j - 1];
                    const t = d.length - prv.length;
                    const l = len - prv.length;
                    const _i = glUtil.easing(l / t, d.easing);
                    if (d.type === 'none') {
                        const cameraVec = prv._camera || prv.camera;
                        const camera = cameraVec.clone().lerp(d.camera, _i);
                        const target = prv.target.clone().lerp(d.target, _i);
                        this.updateCamera(camera, target);
                    } else {
                        const v = new THREE.Vector2(d.camera.x, d.camera.z);
                        const k = new THREE.Vector2(d.target.x, d.target.z);

                        const ag = THREE.MathUtils.lerp(d.angle[0], d.angle[1], _i);
                        v.rotateAround(k, ag);

                        const camera = new THREE.Vector3(v.x, d.camera.y, v.y);
                        d._camera = camera;
                        this.updateCamera(camera, d.target);
                    }
                }
            });

            if (elem.index >= 1) {
                if (elem.loop) {
                    this.start(elem.id, elem.cohesion);
                } else {
                    this._triggerInnerEvent('endCallBack', { });
                    if (elem.callback) elem.callback();
                    elem.state = false;
                }
            }
        }
    }

    onMouseDown() {
        if (!this.cohesionState) return;
        this.cohesionConfig.state = true;
        this.cohesionConfig.time = 0;
        const { source } = this.cohesionConfig;
        if (!source) {
            this.cohesionConfig.source = {
                camera: this.renderer.camera.position.clone(),
                target: this.renderer.controls.target.clone()
            };
        }
    }
}

export default Component;
