import utilsFunction from './utilsFunction';

// - 全局对象 - 是否支持webgl
window._isSupportWebGL = -1;
/**
 * [utilsTHREE 公用工具-THREE相关工具方法]
 * @type {Object}
 */
const utilsTHREE = {
    mtl: { // 常用材质
        point(param) {
            return new THREE.PointsMaterial(param); // 点材质
        },
        sprite(param) {
            return new THREE.SpriteMaterial(param); // sprite粒子材质
        },

        line(param) {
            return new THREE.LineBasicMaterial(param); // 线材质
        },
        lineD(param) {
            return new THREE.LineDashedMaterial(param); // 线段材质
        },

        shader(param) {
            return new THREE.ShaderMaterial(param); // shader自定义材质
        },

        basic(param) {
            return new THREE.MeshBasicMaterial(param); // 基础几何体材质
        },
        phong(param) {
            return new THREE.MeshPhongMaterial(param); // 高光几何体材质
        },
        lambert(param) {
            return new THREE.MeshLambertMaterial(param); // 兰伯特感光几何体材质
        },
        standard(param) {
            return new THREE.MeshStandardMaterial(param); // 标准几何体材质
        }
    },
    geo: { // 常用几何体
        geo() {
            return new THREE.Geometry(); // 基础几何体
        },
        buf() {
            return new THREE.BufferGeometry(); // 基础buffe几何体
        },
        insBuf() {
            return new THREE.InstancedBufferGeometry(); // 基础buffer实例几何体
        },

        shape(shp, seg) {
            return new THREE.ShapeBufferGeometry(shp, seg); // 形状
        },
        extrude(shp, opt) {
            return new THREE.ExtrudeBufferGeometry(shp, opt); // 拉伸几何体
        },

        plane(w, h, ws, hs) {
            return new THREE.PlaneBufferGeometry(w, h, ws, hs); // 平面
        },
        circle(r, s) {
            return new THREE.CircleBufferGeometry(r, s); // 圆面
        },
        box(w, h, d) {
            return new THREE.BoxBufferGeometry(w, h, d); // 立方体
        },
        sphere(r, ws, hs, pS, pL, tS, tL) {
            return new THREE.SphereBufferGeometry(r, ws, hs, pS, pL, tS, tL); // 球体
        },
        torus(r, t, rs, ts) {
            return new THREE.TorusBufferGeometry(r, t, rs, ts); // 圆环
        },
        Icosah(r, s) {
            return new THREE.IcosahedronBufferGeometry(r, s); // 二十面体
        },
        cylinder(rt, rb, h, rs, o) {
            return new THREE.CylinderBufferGeometry(rt, rb, h, rs, 1, o); // 圆柱
        }
    },

    // - 常量
    PI: 3.141592653589793,
    M_PI: 6.283185307179586,
    M_PI2: 1.5707963267948966,
    wh: 400, // 基准大小值

    // - 图片loader
    txueLoader: (function () { return new THREE.TextureLoader(); }()),

    // - 基础object3D
    obj(describe = 'object') {
        const obj = new THREE.Object3D();
        obj.name = describe;
        obj.userData.describe = describe;
        return obj;
    },
    group(describe = 'group') {
        const group = new THREE.Group();
        group.name = describe;
        group.userData.describe = describe;
        return group;
    },
    // - 基础颜色
    color(c) {
        return new THREE.Color(c); // 颜色
    },
    //-
    creatCGeo(p) {
        return new THREE.CurvePath().createGeometry(p); // 根据path创建几何体形状
    },
    tgShape(c, h) {
        return THREE.ShapeUtils.triangulateShape(c, h); // shape形状切分面
    },

    /**
     * [detector 判断是否支持webgl]
     * @Author   ZHOUPU
     * @DateTime 2019-10-24
     * @return   {[boolean]}   [true/false]
     */
    detector() {
        if (window._isSupportWebGL !== -1) { // 初始化后直接取值
            return window._isSupportWebGL;
        }
        try { // 是否支持webgl 只需要判断是否支持webgl就够了
            window._isSupportWebGL = !!window.WebGLRenderingContext
                && !!document.createElement('canvas').getContext('webgl');
            return window._isSupportWebGL;
        } catch (e) {
            window._isSupportWebGL = false;
            return window._isSupportWebGL;
        }
    },

    // shape点的顺序是否顺时针
    reverse(c) {
        if (!THREE.ShapeUtils.isClockWise(c)) c = c.reverse();
    },
    // hole点的顺序是否逆时针
    holeReverse(c) {
        if (THREE.ShapeUtils.isClockWise(c)) c = c.reverse();
    },

    // - analysis color
    /**
     * [getColorArr 分拆RGBA,获取颜色（THREE）和透明度数组]
     * @Author   ZHOUPU
     * @DateTime 2018-08-02
     * @param    {[string/number]}   str [rgba/rgb/16进制/颜色名称等]
     * @return   {[array]}       [颜色（THREE）和透明度数组]
     */
    getColorArr(str) {
        function pad2(c) {
            return c.length === 1 ? `0${c}` : `${c}`;
        }
        if (utilsFunction.isArray(str)) return str;
        const arr = [];
        const nStr = (`${str}`).toLowerCase().replace(/\s/g, '');
        if (/^((?:rgba)?)\(\s*([^)]*)/.test(nStr)) {
            const nArr = nStr.replace(/rgba\(|\)/gi, '').split(',');
            const hex = [
                pad2(Math.round(nArr[0] - 0 || 0).toString(16)),
                pad2(Math.round(nArr[1] - 0 || 0).toString(16)),
                pad2(Math.round(nArr[2] - 0 || 0).toString(16))
            ];
            arr[0] = this.color(`#${hex.join('')}`);
            arr[1] = Math.max(0, Math.min(1, (nArr[3] - 0 || 0)));
        } else if (str === 'transparent') {
            arr[0] = this.color();
            arr[1] = 0;
        } else {
            arr[0] = this.color(str);
            arr[1] = 1;
        }
        return arr;
    },
    /**
     * [getRGBColor 颜色数组转rgba颜色]
     * @Author   ZHOUPU
     * @DateTime 2018-12-29
     * @param    {[array]}   arr [颜色数组, [ THREE.Color, number(opacity) ] ]
     * @return   {[string]}       [rgba颜色]
     */
    getRGBColor(arr) {
        if (!this.isArray(arr)) return arr;
        if (!arr[0].isColor) return arr;
        const c = arr[0].clone().multiplyScalar(255);
        const o = Number.isNaN(arr[1]) ? 1 : arr[1];
        return `rgba(${c.r | 0},${c.g | 0},${c.b | 0},${o})`;
    },

    /**
     * 三维坐标转二维屏幕坐标
     * @param position
     * @param self
     * @returns {z|z}
     */
    transCoord(position, self) {
        const [halfW, halfH] = [self.width / 2, self.height / 2];
        const vec3 = position.clone().applyMatrix4(self.scene.matrix).project(self.camera);
        const [mx, my] = [(vec3.x * halfW + halfW), (-vec3.y * halfH + halfH)];
        return new THREE.Vector2(mx, my);
    },

    /**
     * [transPosition 二维转三维坐标]
     * @DateTime 2021-04-26
     * @param    {[object]}   vec2    [{ x, y } 二维坐标]
     * @param    {[number]}   targetY [高度值]
     * @param    {[object]}   self    [渲染器对象]
     * @return   {[object]}           [三维坐标]
     */
    transPosition(vec2, targetY, self) {
        const [vec, pos] = [new THREE.Vector3(), new THREE.Vector3()];
        vec.set((vec2.x / self.width) * 2 - 1, -(vec2.y / self.height) * 2 + 1, 0.5);

        vec.unproject(self.camera);
        vec.sub(self.camera.position).normalize();
        const distance = (targetY - self.camera.position.y) / vec.y;
        pos.copy(self.camera.position).add(vec.multiplyScalar(distance));
        return pos;
    },

    // - dispose
    /**
     * [disposeArr 销毁THREE对象数组元素]
     * @Author   ZHOUPU
     * @DateTime 2021-01-28
     * @param    {[array]}   array [THREE对象数组]
     */
    disposeArr(array) {
        Object.keys(array || {}).forEach((item) => {
            if (array[item].dispose) array[item].dispose();
            delete array[item];
        });
    },
    /**
     * [disposeObj 删除组合节点]
     * @Author   ZHOUPU
     * @DateTime 2019-05-14
     * @param    {[object]}   obj [组合节点]
     */
    disposeObj(obj) {
        if (obj && obj.type === 'Scene' && obj.background) {
            obj.background.dispose();
            obj.background = null;
        }
        if (obj instanceof THREE.Object3D) {
            this.objectTraverse(obj, utilsTHREE.disposeNode.bind(utilsTHREE));
        }
    },
    /**
     * [disposeNode 删除单个节点]
     * @Author   ZHOUPU
     * @DateTime 2019-05-14
     * @param    {[object]}   node [节点对象]
     */
    disposeNode(node) {
        if (utilsFunction.isArray(node._txueArr)) { // 兼容以前
            for (let i = 0; i < node._txueArr.length; i++) {
                node._txueArr[i].dispose();
                node._txueArr[i] = null;
            }
            node._txueArr = null;
        }
        this.deleteGeometry(node);
        this.deleteMaterial(node);
        this.deleteUserData(node);
        if (node.dispose && node.type !== 'Scene') node.dispose();
        if (node.parent) node.parent.remove(node);
        node = null;
    },
    /**
     * [deleteUserData 清除节点userData]
     * @Author   ZHOUPU
     * @DateTime 2021-08-05
     * @param    {[object]}   node [节点对象]
     */
    deleteUserData(node) {
        if (node.userData) {
            Object.keys(node.userData).forEach((key) => {
                if (node.userData[key].dispose) node.userData[key].dispose();
                node.userData[key] = null;
            });
            node.userData = null;
        }
    },
    /**
     * [deleteGeometry 删除几何体]
     * @Author   ZHOUPU
     * @DateTime 2019-05-14
     * @param    {[object]}   node [节点对象]
     */
    deleteGeometry(node) {
        if (node.geometry && node.geometry.dispose) {
            if (node.geometry._bufferGeometry) {
                node.geometry._bufferGeometry.dispose();
            }

            this.deleteUserData(node.geometry);
            node.geometry.dispose();
            node.geometry = null;
        }
    },
    /**
     * [deleteMaterial 删除材质，多材质]
     * @Author   ZHOUPU
     * @DateTime 2019-05-14
     * @param    {[object]}   node [节点对象]
     */
    deleteMaterial(node) {
        this.eachMaterial(node.material, (mtl) => {
            this.deleteUserData(mtl);
            this.disposeMaterial(mtl);
        });
        node.material = null;
    },
    /**
     * [disposeMaterial 销毁材质]
     * @Author   ZHOUPU
     * @DateTime 2018-08-02
     * @param    {[object]}   obj      [THREE的材质对象]
     */
    disposeMaterial(mtl) {
        Object.keys(mtl).forEach((key) => {
            if (!(mtl[key] && utilsFunction.isFunction(mtl[key].dispose))
                && key !== 'uniforms') {
                if (key === 'program' || key === 'fragmentShader' || key === 'vertexShader') {
                    mtl[key] = null;
                }
                return;
            }

            if (key === 'uniforms') {
                Object.keys(mtl.uniforms).forEach((i) => {
                    let uniform = mtl.__webglShader ? mtl.__webglShader.uniforms[i] : undefined;
                    if (uniform && uniform.value) {
                        if (uniform.value.dispose) { uniform.value.dispose(); }
                        uniform.value = null;
                    }
                    uniform = mtl.uniforms[i];
                    if (uniform.value) {
                        if (uniform.value.dispose) { uniform.value.dispose(); }
                        uniform.value = null;
                    }
                });
            } else {
                mtl[key].dispose();
                mtl[key] = null;
            }
        });

        mtl.dispose();
        mtl = null;
    },
    /**
     * [objectTraverse 遍历对象树，由叶到根]
     * @Author   ZHOUPU
     * @DateTime 2018-08-02
     * @param    {[object]}   obj      [THREE的object3D对象]
     * @param    {Function} callback [回调函数，返回遍历对象]
     */
    objectTraverse(obj, callback) {
        if (!utilsFunction.isFunction(callback)) return;
        const { children } = obj;
        for (let i = children.length - 1; i >= 0; i--) {
            this.objectTraverse(children[i], callback);
        }
        callback(obj);
    },

    /**
     * [eachMaterial 循环材质]
     * @Author   RAOYAN
     * @DateTime 2021-06-30
     * @param    {[object]}   材质      [材质]
     * @param    {Function} callback    [回调函数，返回当前循环的材质]
     */
    eachMaterial(materials, callback) {
        if (!materials || !callback) return false;
        if (utilsFunction.isArray(materials)) {
            materials.forEach((material, idx) => {
                if (callback) callback(material, idx);
            });
        } else if (callback) callback(materials, 0);
        return true;
    },

    /**
     * [getCameraData 获取相机参数]
     * @Author   RAOYAN
     * @DateTime 2021-7-07
     * @param    {[object]}   相机      [相机]
     * @param    {[object]}   控制器    [控制器]
     */
    getCameraData(camera, controls) { // 删除，render中有对应的 getCameraParams
        return {
            camera: {
                x: parseFloat(camera.x.toFixed(2)),
                y: parseFloat(camera.y.toFixed(2)),
                z: parseFloat(camera.z.toFixed(2))
            },
            target: {
                x: parseFloat(controls.x.toFixed(2)),
                y: parseFloat(controls.y.toFixed(2)),
                z: parseFloat(controls.z.toFixed(2))
            }
        };
    },
    /**
     * 获取替换的材质
     * @param {Object} material 材质
     * @param {String} replaceMaterial THREE相关材质名称
     * @returns 已替换的材质
     */
    getReplaceMaterial(material, replaceMaterial) {
        if (!replaceMaterial || !THREE[replaceMaterial]) return false;
        // 新材质需要替换的键值
        const replaceKyes = [
            'name',
            'alphaTest',
            'blendDst',
            'blendDstAlpha',
            'blending',
            'colorWrite',
            'depthTest',
            'depthWrite',
            'fog',
            'opacity',
            'side',
            'transparent',
            'color',
            // 'type',
            'vertexColors',
            'visible',
            'aoMap',
            'map',
            'alphaMap',
            'userData'
        ];
        // 替换材质参数
        const conf = {};
        replaceKyes.forEach((key) => {
            conf[key] = material[key];
        });

        const mat = new THREE[replaceMaterial](conf);
        material.dispose();
        return mat;
    }
};

export default utilsTHREE;
