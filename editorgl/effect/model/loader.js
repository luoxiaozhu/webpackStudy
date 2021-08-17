/**
* 加载模型相关组件
* @name RAOYAN
*/
import './Water';
import glUtil from '../../utils';
import EffectBase from '../../src/EffectBase';
import Effects from './Effect';

class Component extends EffectBase {
    constructor(render) {
        super();
        // 初始化一些参数以及方法
        this.modelLoader = new THREE.FBXLoader();
        this.renderer = render;
        this.animateMeshes = []; // 需要动画的物体
        this.animateMaps = []; // 需要动画的纹理
        this.animateTime = []; // 需要动画的Mesh
        this.eventArr = [];
        this.time = { value: 0 }; // shader的time

        this.animate = (dt) => {
            this.time.value += dt;
            // 物体动画
            this.animateMeshes.forEach((elem) => {
                const {
                    mesh,
                    option
                } = elem;
                const {
                    rotation
                } = option;
                if (rotation) {
                    glUtil.loopObject(rotation, (k) => {
                        mesh.rotation[k] += rotation[k] * dt;
                    });
                }
            });
            // uv动画
            this.animateMaps.forEach((m) => {
                // m.texture.
                glUtil.loopObject(m.uv, (k) => {
                    const val = m.uv[k];
                    if (m.texture) m.texture.offset[k] += val * dt;
                });
            });

            this.animateTime.forEach((material) => {
                material.uniforms.time.value += dt * (material._speed || 1);
            });
        };
    }

    // 销毁
    disposeCompEft() {
    }

    // 效果初始化
    compEftInit() {
        const {
            model,
            order,
            chassis
        } = this.config;

        this.createChassis(chassis);
        if (order) {
            // 一次加载模型
            this.loadOrderModel(model, () => {
                this.sceneLoaderEnd();
            });
        } else {
            let loaderNumber = 0; // 加载次数
            model.forEach((conf) => {
                // 加载模型
                this.loadModel(conf, (object) => {
                    this.addModel(object, conf);
                    loaderNumber++;
                    if (loaderNumber === model.length) {
                        this.sceneLoaderEnd();
                    }
                });
            });
        }
    }

    // 场景加载完成
    sceneLoaderEnd() {
        this.renderer.updateEventArr(this);
        this._triggerInnerEvent('mounted', this.group);
    }

    // 往场景中添加模型
    addModel(object, config) {
        const materialTo = config.material;
        const meshTo = config.mesh;
        const {
            replaceMaterial,
            animate,
            bake
        } = config;

        const names = materialTo.map((m) => m.name);
        const meshNames = meshTo.map((m) => m.name);
        const animateNames = animate.map((m) => m.name);
        const bakeNames = bake.map((m) => m.name);

        let replaceMaterialArray = [];
        object.traverse((mesh) => {
            // 材质纹理替换  需要读取纹理的
            const replaceMap = [
                'bumpMap',
                'alphaMap',
                'normalMap',
                'map',
                'aomap',
                'displacementMap',
                'envMap',
                'roughnessMap',
                'lightMap'
            ];
            // console.log(config)
            if (config.pick && config.pick.includes(mesh.name)) {
                this.eventArr.push(mesh);
            }
            // 已经替换的材质
            const replaceNames = replaceMaterialArray.map((elem) => elem.name);
            // 判断修改材质
            glUtil.eachMaterial(mesh.material, (material, index) => {
                // 替换材质
                let mat = material;
                if (replaceMaterial || THREE[replaceMaterial]) {
                    // 判断当前是否已经替换过材质
                    const rmIndex = replaceNames.indexOf(material.name);
                    if (rmIndex === -1) {
                        mat = glUtil.getReplaceMaterial(material, replaceMaterial);
                    } else {
                        // 已经创建过当前材质 读取当前材质
                        mat = replaceMaterialArray[rmIndex];
                    }
                    // 替换材质
                    if (!Array.isArray(mesh.material)) {
                        mesh.material = mat;
                    } else {
                        mesh.material[index] = mat;
                    }

                    // 销毁材质
                    material.dispose();
                }

                const mIndex = names.indexOf(mat.name);
                // 替换材质相关
                if (mIndex !== -1) {
                    const option = materialTo[mIndex];
                    glUtil.loopObject(option, (k) => {
                        if (k === 'name') return;
                        // 检查是否是替换纹理
                        if (replaceMap.includes(k)) {
                            mat[k] = this.renderer.getTxue(option[k]);
                        } else if (k !== 'animate') {
                            mat[k] = option[k];
                        }
                    });
                    // 判断当前材质是否需要纹理动画
                    if (option.animate) {
                        glUtil.loopObject(option.animate, (k) => {
                            const val = option.animate[k];
                            this.animateMaps.push({
                                texture: mat[k],
                                uv: val
                            });
                        });
                    }
                }
            });

            // 判断当前材质是否需要烘培
            const bIndex = bakeNames.indexOf(mesh.name);
            if (bIndex !== -1) {
                // 添加烘培
                const elem = bake[bIndex];
                glUtil.eachMaterial(mesh.material, (material) => {
                    material.onBeforeCompile = (shader) => {
                        material._shader = shader;
                        let vUv = '';
                        let uMap = '';
                        let fColor = 'outgoingLight';
                        let aUv = '';
                        let aUvD = '';

                        glUtil.loopObject(elem, (k) => {
                            if (k === 'name') return;
                            shader.uniforms[`uMap${k}`] = {
                                value: this.renderer.getTxue(elem[k])
                            };
                            aUv += `attribute vec2 ${k};`;
                            vUv += `varying vec2 v${k};`;
                            aUvD += `v${k} = ${k};`;
                            uMap += `uniform sampler2D uMap${k};`;
                            fColor += `* vec3(texture2D(uMap${k}, v${k}).rgb)`;
                        });

                        const fragment = `${vUv}
${uMap}
void main() {`;

                        const fragmentColor = `gl_FragColor = vec4(${fColor}, diffuseColor.a);`;

                        shader.fragmentShader = shader.fragmentShader.replace('void main() {', fragment);
                        shader.fragmentShader = shader.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );', fragmentColor);
                        const vertex = `${vUv}
${aUv}
void main() {
${aUvD}`;
                        shader.vertexShader = shader.vertexShader.replace('void main() {', vertex);
                    };
                });
            }

            // 在object3d上替换属性
            const nIndex = meshNames.indexOf(mesh.name);
            if (nIndex !== -1) {
                const conf = meshTo[nIndex];
                glUtil.loopObject(conf, (key) => {
                    const val = conf[key];
                    if (key === 'effects') {
                        // 给当前物体在shader上添加效果 因配置问题暂时无法与uv2相结合。
                        // 如果需要与多uv相结合需要特定编写
                        const dconf = {
                            time: this.time
                        };
                        let funcName = '';

                        mesh.renderOrder = conf.renderOrder;
                        mesh.geometry.computeBoundingSphere();
                        mesh.geometry.computeBoundingBox();

                        switch (val.name) {
                        case 'diffusion':
                            {
                                const {
                                    speed = 1, radius = 'auto', center, range = 0.1, color
                                } = val;

                                dconf.center = center;
                                dconf.color = color || new THREE.Color();

                                if (radius === 'auto') {
                                    dconf.radius = mesh.geometry.boundingSphere.radius;
                                } else {
                                    dconf.radius = radius;
                                }

                                dconf.range = range;
                                dconf.speed = speed;

                                funcName = 'effectDiffusion';
                            }
                            break;
                        case 'riseLine':
                            {
                                const {
                                    speed = 1, color, gap, width, opacity
                                } = val;

                                dconf.speed = speed;
                                dconf.color = color;
                                dconf.gap = gap;
                                dconf.opacity = opacity;

                                dconf.minHeight = width;

                                funcName = 'effectRiseLine';
                            }
                            break;
                        case 'water':
                            {
                                const {
                                    speed = 1
                                } = val;

                                dconf.speed = speed;

                                funcName = 'effectWaterial';
                            }
                            break;
                        default:
                            break;
                        }
                        glUtil.eachMaterial(mesh.material, (material) => {
                            if (Effects[funcName]) {
                                Effects[funcName](material, dconf);
                            }
                        });
                    } else if (key === 'replace') {
                        let obj = null;
                        switch (val.name) {
                        case 'water':
                            obj = Effects.replaceWater(mesh, {
                                waterNormals: this.renderer.getTxue('waternormals'),
                                map: this.renderer.getTxue('watert'),
                                waterColor: val.waterColor || '#6A715E',
                                textureWidth: 256,
                                textureHeight: 256,
                                distortionScale: 3
                            });
                            obj.material._speed = val.speed || 1;

                            this.animateTime.push(obj.material);
                            break;
                        default:
                            break;
                        }
                        if (obj)  {
                            mesh.parent.add(obj);
                            setTimeout(() => {
                                glUtil.disposeObj(mesh);
                            }, 100);
                        }
                    } else {
                        mesh[key] = val;
                    }
                });
            }

            // 判断是否进行动画
            const aIndex = animateNames.indexOf(mesh.name);
            if (aIndex !== -1) {
                // 需要的动画
                this.animateMeshes.push({
                    option: {
                        ...animate[aIndex]
                    },
                    mesh
                });
            }
        });
        this.group.add(object);

        // 回收
        replaceMaterialArray = null;
    }

    /*
     * 提供直接修改this的方法
     * ('group.visible', false); group隐藏
     */
    setModel(keys, val) {
        // key值以.分离
        if (keys === undefined) return false;

        const keysArr = keys.split('.');

        let self = this;

        for (let i = 0; i < keysArr.length; i++) {
            const key = keysArr[i];
            if (i === keysArr.length - 1 && self) {
                self[key] = val;
            } else {
                self = self[key];
            }
        }

        self = null;
        return false;
    }

    // 直接获取Mesh
    getModel(name) {
        return this.group.getObjectByName(name);
    }

    // 修改制定材质的属性
    setMaterialValues(name, option = {}) {
        this.group.traverse((child) => {
            glUtil.eachMaterial(child.material, (material) => {
                if (material.name === name) {
                    material.setValues(option);
                }
            });
        });
    }

    // 依次加载模型
    loadOrderModel(models, callback) {
        if (models.length === 0) return;
        // 拿到第一个模型参数值
        const conf = models.shift();

        // 递归加载模型 直到没有位置
        this.loadModel(conf, (object) => {
            this.addModel(object, conf);
            if (models.length !== 0) {
                // 继续加载剩余模型
                this.loadOrderModel(models, callback);
            } else if (callback) callback('end');
        });
    }

    // 加载模型
    loadModel(conf, callback) {
        this.modelLoader.load(conf.url, (object) => {
            callback(object);
        });
    }

    // 装饰底盘
    createChassis(option) {
        const mesh = Effects.createChassis(option);

        this.group.add(mesh);
    }

    // 设置所有材质的显示隐藏
    setVisible(visible) {
        this.group.traverse((child) => {
            glUtil.eachMaterial(child.material, (material) => {
                material.visible = visible;
            });
        });
    }

    // 销毁
    dispose() {
        this.modelLoader = null;
        this.animateMeshes = null;
        this.animateMaps = null;
    }

    /* // 点击事件
    onMouseDown(event, instanc) {
        this._triggerInnerEvent('onClick', {
            event,
            instanc: instanc[0] ? instanc[0].object : null
        });
    } */
}

export default Component;
