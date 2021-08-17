import EffectBase from '../../src/EffectBase';
import glUtil from '../../utils';

class Component extends EffectBase {
    constructor(render) {
        super();

        this.renderer = render;
        this.modelLoader = new THREE.FBXLoader();
        this.InstanceMesh = null;
    }

    // 效果初始化
    compEftInit() {
        const datas = this.config.data;
        const materialConf = this.config.material || {};
        let loadNumber = 0;
        datas.forEach((conf) => {
            this.loadModelData(conf.meshData, (data) => {
                const { length } = data;
                this.loadBascMesh(conf.model, (object) => {
                    const colors = conf.model.colors || ['#fff'];
                    const color = colors.map((c) => new THREE.Color(c));
                    // 创建实例化
                    glUtil.eachMaterial(object.material, (material) => {
                        material.setValues(materialConf);
                    });
                    this.InstanceMesh = new THREE.InstancedMesh(object.geometry, object.material, length);
                    this.InstanceMesh.renderOrder = conf.renderOrder;
                    this.handleMtl(this.InstanceMesh); // 添加 法线明暗
                    // 添加
                    this.group.add(this.InstanceMesh);
                    const matrix = new THREE.Matrix4();
                    // 给实例化物体添加位置 旋转 颜色等
                    data.forEach((elem, i) => {
                        matrix.identity();
                        if (conf.model.randomRotate) {
                            const k = Object.keys(conf.model.randomRotate);
                            k.forEach((key) => {
                                elem.rotation[key] = Math.random() * conf.model.randomRotate[key];
                            });
                        }
                        if (conf.model.rotate) {
                            const k = Object.keys(conf.model.rotate);
                            k.forEach((key) => {
                                elem.rotation[key] += conf.model.rotate[key];
                            });
                        }
                        matrix.makeRotationFromEuler(elem.rotation);
                        matrix.scale(elem.scale);
                        matrix.setPosition(elem.position);
                        this.InstanceMesh.setMatrixAt(i, matrix);
                        this.InstanceMesh.setColorAt(i, color[i % color.length]);
                    });

                    loadNumber++;
                    if (loadNumber === datas.length) {
                        this._triggerInnerEvent('mounted', this.group);
                    }
                });
            });
        });
    }

    // 材质法线做暗面
    handleMtl(mesh) {
        const mtl = mesh.material;

        glUtil.eachMaterial(mtl, (m) => {
            m.onBeforeCompile = (shader) => {
                /*
                const newVerTex = `
                    varying vec3 vColor1;
                    void main() {
                        vec3 N = normalize(normal);
                        vec3 L = normalize(position);
                        float Kd = max(1.5 * dot(L, N), 0.125);
                        vColor1 = vec3(0.5 + 0.5 * Kd);
                `;
                shader.vertexShader = shader.vertexShader.replace('void main() {', newVerTex);

                const newfragment = `
                    varying vec3 vColor1;
                    void main() {
                `;
                const newfragmentText = `
                    #include <dithering_fragment>
                    gl_FragColor *= vec4(vColor1, 1.0);
                `;
                shader.fragmentShader = shader.fragmentShader.replace('void main() {', newfragment);
                shader.fragmentShader = shader.fragmentShader.replace('#include <dithering_fragment>', newfragmentText);
                */

                /**/
                const newVerTex = `
                    varying vec3 vNormal1;
                    varying vec3 vPosition1;
                    void main() {
                        vNormal1 = normalize(normal);
                        vPosition1 = normalize(position);
                `;
                shader.vertexShader = shader.vertexShader.replace('void main() {', newVerTex);

                const newfragment = `
                    varying vec3 vNormal1;
                    varying vec3 vPosition1;

                    float rand1dTo1d(float value){
                        float mutator = 0.546;
                        float random = fract(sin(value + mutator) * 143758.5453);
                        return random;
                    }

                    float noise1d(float val) {
                        float x = fract(val);
                        float t = 6. * pow(x, 5.) - 15. * pow(x, 4.) + 10. * pow(x, 3.);
                        float noise = mix(rand1dTo1d(floor(val)), rand1dTo1d(ceil(val)), fract(t));
                        return noise;
                    }

                    void main() {
                `;
                const newfragmentText = `
                    #include <dithering_fragment>
                    float Kd = max(2.0 * dot(vPosition1, vNormal1), 0.0);
                    gl_FragColor *= vec4( 0.3 + 0.5 * Kd + 0.4 * noise1d(vPosition1.y) );
                `;
                shader.fragmentShader = shader.fragmentShader.replace('void main() {', newfragment);
                shader.fragmentShader = shader.fragmentShader.replace('#include <dithering_fragment>', newfragmentText);
            };
        });
    }

    // 加载需要实例化的模型
    loadBascMesh(conf, callback) {
        const mNames = (conf.material || []).map((m) => m.name);

        this.modelLoader.load(conf.url, (object) => {
            object.traverse((child) => {
                // 返回当前的第一个mesh
                if (child.isMesh) {
                    glUtil.eachMaterial(child.material, (material) => {
                        const index = mNames.indexOf(material.name);
                        if (index !== -1) {
                            material.setValues(conf.material[index]);
                        }
                    });
                    callback(child);
                }
            });
        });
    }

    // 加载楼层，并且解析数据
    loadModelData(conf, callback) {
        const { type, data } = conf;
        const tr = this.config.rotation;

        if (type === 'data') {
            const datas = [];
            data.forEach((elem) => {
                const p = elem.position;
                const r = elem.rotation;
                const s = elem.scale;

                datas.push({
                    position: new THREE.Vector3(p.x, p.y, p.z),
                    rotation: new THREE.Euler(r.x + tr.x, r.y + tr.y, r.y + tr.z),
                    scale: new THREE.Vector3(s.x, s.y, s.z)
                });
            });
            callback(datas);
        } else if (type === 'fbx') {
            const e = new THREE.Euler(0, 0, 0, 'XYZ');
            this.modelLoader.load(data, (object) => {
                const datas = [];
                object.children.forEach((c) => {
                    c.rotation.x += tr.x;
                    c.rotation.y += tr.y;
                    c.rotation.z += tr.z;
                    e.set(c.rotation.x + object.rotation.x, c.rotation.y + object.rotation.y, c.rotation.z + object.rotation.z);
                    datas.push({
                        position: c.position,
                        rotation: e.clone(),
                        scale: c.scale
                    });
                });
                callback(datas);

                glUtil.disposeObj(object);
            });
        }
    }

    // 设置所有材质的显示隐藏
    setVisible(visible) {
        this.group.traverse((child) => {
            glUtil.eachMaterial(child.material, (material) => {
                material.opacity = visible ? 1 : 0;
            });
        });
    }

    dispose() {
        glUtil.disposeObj(this.group);
    }
}

export default Component;
