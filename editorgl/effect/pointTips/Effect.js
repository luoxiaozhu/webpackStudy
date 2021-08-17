/*
 * @Author: Duke
 * @Date: 2021-07-07 14:52:34
 * @LastEditors: Duke
 * @LastEditTime: 2021-08-16 20:39:49
 * @Description: file content
 */
import glUtil from '../../utils';
import EffectBase from '../../src/EffectBase';

const SHADERS = {
    SpreadVShader: `uniform vec3 uColor;
    uniform float uTime;
    uniform float uOpacity;
    attribute vec3 position2; attribute float cRatio;
    varying vec4 vColor;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        float _k = uTime + cRatio;
        _k = fract(_k);
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vec3 vPos = mix( position, position2, _k * length(mvPosition.xyz)/800.0);
        vColor = vec4( uColor, (1.0 - _k)*uOpacity); vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos, 1.0 );
    }`,
    // -高级样式扩散底盘片元着色器
    SpreadFShader: `uniform sampler2D uTexture;
    varying vec4 vColor;
    varying vec2 vUv;
    void main() {
        gl_FragColor = vColor * texture2D(uTexture, vUv);
    }`
};

const _parseDom = (arg) => {
    const objE = document.createElement('div');

    objE.innerHTML = arg;

    return objE.childNodes[0];
};

// -根据传入的node结构及其生成的图片生成2*n尺寸图片
const _createCanvasTexture = (node, base64, isCenter) => {
    const imgWidth = node.offsetWidth;
    const imgHeight = node.offsetHeight; // 图片的size
    const width = THREE.Math.ceilPowerOfTwo(imgWidth);
    const height = THREE.Math.ceilPowerOfTwo(imgHeight); // 图片的size
    const boundary = {
        minX: 0,
        maxX: 1,
        minY: 0,
        maxY: 1
    };
    // - 计算新的图片边界
    if (isCenter) {
        boundary.minX = (width - imgWidth) / (2 * width);
        boundary.maxX = 1 - boundary.minX;
        boundary.minY = (height - imgHeight) / (2 * height);
        boundary.maxY = 1 - boundary.minY;
    } else {
        boundary.minX = (width - imgWidth) / (2 * width);
        boundary.maxX = 1 - boundary.minX;
        boundary.minY = 0;
        boundary.maxY = imgHeight / height;
    }
    const textureLoader = new THREE.TextureLoader().load(base64, (texture) => {
        const canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');

        let { image } = texture;
        if (isCenter) {
            context.drawImage(image, (width - imgWidth) / 2, (height - imgHeight) / 2);
        } else {
            context.drawImage(image, (width - imgWidth) / 2, height - imgHeight);
        }
        texture.image = canvas;
        image = null;
    });
    textureLoader.needsUpdate = true;
    textureLoader._nodeWidth = imgWidth;
    textureLoader._nodeHeight = imgHeight;
    textureLoader._width = width;
    textureLoader._height = height;
    textureLoader._boundary = boundary;
    return textureLoader;
};

class Components extends EffectBase {
    // 销毁
    disposeCompEft() {

    }

    // -初始化
    compEftInit() {
        this.createPoints(this.config);
    }

    // -创建点位
    createPoints(options) {
        this.loadConfig = {
            loadedCount: 0,
            allNodeCount: 0
        };
        this.opacityConfig = {
            start: false,
            transTimes: 0,
            perTimes: 1
        };

        this.currentMouseObject = null;
        this.eventArr = [];
        this.renderer.removeEventArr(this.id);
        // -销毁对象
        for (let i = this.group.children.length; i > 0; i--) {
            const child = this.group.children[i - 1];
            glUtil.disposeObj(child);
        }

        const { points = [] } = options;
        this.loadConfig.allNodeCount = points.length;
        points.forEach((point) => {
            const {
                position, spreadStyle, tipStyle, mouseEvent, opacityMark, name
            } = point;
            if (spreadStyle) {
                const spread = this.createSpreadPoint(spreadStyle);
                spread.position.copy(position);
                this.group.add(spread);
            }
            if (tipStyle) {
                this.createTips({
                    position,
                    mouseEvent,
                    opacityMark,
                    name,
                    ...tipStyle
                });
            }
        });
    }

    onMouseIn(event, intersects) {
        if (intersects.length > 0) {
            const { userData } = intersects[0].object;
            if (this.currentMouseObject !== intersects[0].object) {
                this.currentMouseObject = intersects[0].object;
                this.currentMouseObject.material.color = new THREE.Color('#FF0000');
            }
            return [event, userData];
        }
        return [event];
    }

    onMouseOut(event, intersects) {
        if (this.currentMouseObject) {
            this.currentMouseObject.material.color = new THREE.Color('#FFFFFF');
            this.currentMouseObject = null;
        }
    }

    onMouseDown(event, intersects, compEft) {
        if (intersects.length > 0) {
            const { userData } = intersects[0].object;
            return [event, userData, compEft];
        }
        return [event, compEft];
    }

    onDblClick(event, intersects, compEft) {
        if (intersects.length > 0) {
            const { userData } = intersects[0].object;
            return [event, userData];
        }
        return [event];
    }

    setTipOpacityAnimate(k) {
        if (this.opacityConfig.direct) k = 1 - k;
        this.group.traverse((child) => {
            if (child.material && child._opacity !== undefined) {
                if (!child.material.uniforms) child.material.opacity = child._opacity * k;
                else child.material.uniforms.uOpacity.value = child._opacity * k;
            }
        });
    }

    setPointTips(type, option = {}) {
        switch (type) {
        case 'opacity': {
            const { isShow = true, perTimes = 1, callback } = option;
            this.opacityConfig.start = true;
            this.opacityConfig.direct = isShow;
            this.opacityConfig.transTimes = 0;
            this.opacityConfig.perTimes = perTimes;
            this.opacityConfig.animateEndCallback = callback;

            break;
        }

        default: break;
        }
    }

    createTips(option) {
        const _this = this;
        const { url } = option;
        const image = new Image();
        image.src = url;
        image.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, image.width, image.height);
            const ext = image.src.substring(image.src.lastIndexOf('.') + 1).toLowerCase();
            const background = canvas.toDataURL(`image/${ext}`);
            _this.createTipObj({
                background,
                ...option
            });
        };
    }

    createTipObj(option) {
        const {
            background, content, name = '', position, divCallback, center, mouseEvent, opacityMark
        } = option;
        const divStr = divCallback
            ? divCallback(background, content)
            : `<div style = "width: 388px;height: 175px;background: url('${background}') no-repeat 100% 100%;">
        <div style="color: #fbf5f5;font-size: 24px;position: absolute;left: 154px;top: 26px;">${content}</div></div>`;
        const node = _parseDom(divStr);
        document.body.appendChild(node); // 先加到body下面计算宽高值
        glUtil.screenCut(node, (base64) => {
            const SPRITE_SIZE = 1500;
            const spriteMap = _createCanvasTexture(node, base64, true);
            const spriteMaterial = new THREE.SpriteMaterial({
                map: spriteMap,
                opacity: 0,
                transparent: true,
                depthTest: false,
                depthWrite: false,
                sizeAttenuation: false
            });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.renderOrder = 100;
            sprite.scale.set(
                spriteMap._width / SPRITE_SIZE,
                spriteMap._height / SPRITE_SIZE,
                spriteMap._width / SPRITE_SIZE
            );
            if (center) sprite.center.set(center.x, center.y);
            else sprite.center.set(spriteMap._boundary.minX + 0.03, spriteMap._boundary.minY + 0.07);
            sprite.position.copy(position);
            sprite.userData = { content, name };
            if (mouseEvent) this.eventArr.push(sprite);
            if (opacityMark)sprite._opacity = 1.0;
            this.group.add(sprite);
            this.loadConfig.loadedCount++;
            this._onTotalLoaded();
        });
        document.body.removeChild(node); // 使用完毕丢弃
    }

    createSpreadPoint(options) {
        const SPREAD_POINT_SIZE = 40;
        const { color, textureName, size = SPREAD_POINT_SIZE } = options;
        const colors = glUtil.getColorArr(color);
        const spreadArr = {
            indices: [],
            ratios: [],
            vecs1: [],
            vecs2: [],
            uvs: []
        };
        /* 扩散 */
        for (let i = 0; i < 3; i++) {
            for (let k = 0; k < 4; k++) {
                spreadArr.vecs1.push(0, 0, 0);
                spreadArr.ratios.push(i / 3);
            }
            //
            spreadArr.vecs2.push(-size, -size, 0);
            spreadArr.uvs.push(0, 0);
            //
            spreadArr.vecs2.push(size, -size, 0);
            spreadArr.uvs.push(1, 0);
            //
            spreadArr.vecs2.push(-size, size, 0);
            spreadArr.uvs.push(0, 1);
            //
            spreadArr.vecs2.push(size, size, 0);
            spreadArr.uvs.push(1, 1);

            spreadArr.indices.push(4 * i, 4 * i + 2, 4 * i + 3);
            spreadArr.indices.push(4 * i, 4 * i + 3, 4 * i + 1);
        }

        const spreadGeo = new THREE.BufferGeometry();

        spreadGeo.setIndex(spreadArr.indices);
        spreadGeo.setAttribute('uv', new THREE.Float32BufferAttribute(spreadArr.uvs, 2));
        spreadGeo.setAttribute('cRatio', new THREE.Float32BufferAttribute(spreadArr.ratios, 1));
        spreadGeo.setAttribute('position', new THREE.Float32BufferAttribute(spreadArr.vecs1, 3));
        spreadGeo.setAttribute('position2', new THREE.Float32BufferAttribute(spreadArr.vecs2, 3));

        const sMtl = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: {
                    value: this.renderer.getTxue(textureName)
                },
                uOpacity: {
                    value: 0.0
                },
                uColor: {
                    value: colors[0]
                },
                uTime: {
                    value: 0
                }
            },
            transparent: true,
            side: THREE.DoubleSide,
            depthTest: false,
            // depthWrite: false,
            vertexShader: SHADERS.SpreadVShader,
            fragmentShader: SHADERS.SpreadFShader
        });

        const _spread = new THREE.Mesh(spreadGeo, sMtl);
        _spread._opacity = 1.0;
        _spread.transTimes = 0;
        _spread.perTimes = 2;
        _spread._isSpread = true;
        _spread.onBeforeRender = function (render, scene, camera) {
            _spread.rotation.copy(camera.rotation);
        };
        return _spread;
    }

    _onTotalLoaded() {
        if (this.loadConfig.loadedCount === this.loadConfig.allNodeCount) {
            this.renderer.updateEventArr(this);
            this._triggerInnerEvent('mounted', this.group);
        }
    }

    animate = (dt) => {
        this.group.traverse((child) => {
            if (child._isSpread) {
                // child.rotation.copy(this.renderer.camera.rotation);
                child.transTimes += dt;
                child.material.uniforms.uTime.value = child.transTimes / child.perTimes;
            }
        });
        if (this.opacityConfig.start) {
            this.opacityConfig.transTimes += dt;
            const { transTimes, perTimes } = this.opacityConfig;
            if (transTimes <= perTimes + dt) {
                const k = Math.min(1, transTimes / perTimes);
                this.setTipOpacityAnimate(k);
            } else {
                this.opacityConfig.start = false;
                if (this.opacityConfig.animateEndCallback) this.opacityConfig.animateEndCallback();
            }
        }
    };

    setConfig(type, options) {
        if (this[type]) this[type](options);
    }
}

export default Components;
