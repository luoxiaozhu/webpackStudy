/**
 * 底面 反射、渐变   zhoupu
 */
import EffectBase from '../../src/EffectBase';
import glUtil from '../../utils';

import './objects/ReflectorRTT';
import {
    NodeFrame,
    ExpressionNode,
    PhongNodeMaterial,
    MathNode,
    OperatorNode,
    TextureNode,
    BlurNode,
    FloatNode,
    ReflectorNode,
    SwitchNode,
    NormalMapNode
} from './nodes/Nodes';

const _Shaders = {
    // - subface
    SubfaceVShader: `
        attribute vec2 uv2;
        varying vec4 vUv;
        void main() {
            vUv = vec4(uv2, uv);
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,

    SubfaceFShader: `
        uniform float u_time;
        uniform sampler2D u_txue;
        uniform sampler2D u_txue_bk;

        varying vec4 vUv;
        void main() {
            vec4 txue = texture2D(u_txue, vUv.xy);
            vec4 txue_bk = texture2D(u_txue_bk, vUv.zw);
            gl_FragColor = txue * txue_bk * vec4(vec3(1.0), u_time);
        }
    `
};

/*
subface: { // 底面
    isCreat: false, // 是否创建
    offset: [100, 100], // 横向，纵向偏移
    colDecal: null, // 主纹理 表面贴图纹理
    alpDecal: null, // 透贴，边缘渐变消失
    offsetY: 0, // 上下位置偏移
    opacity: 1, // 透明度
    isRoateX: true, // 翻转X轴
    subfaceLoadTime: 1, // 底面加载时间，加载完成后开始其他动效

    txueRpt: [1, 1], // 普通底面时 横向、纵向 纹理重复—— colDecal 的重复

    isMirror: false, // 是否镜面
    norDecal: null, // 镜面法线图
    mirBlur: 2.6, // 镜面模糊度， 0 -不模糊
    mirRatio: 0.85 // 镜面反射和主纹理比例取值
}
*/

class SubFaceEft extends EffectBase {
    constructor(render) {
        super(render);

        this.animate = (/* dt, clock */) => {
            if (!this.config.isAnimate) return; // eslint-disable-line
            /**
             *  do something
             */
        };
    }

    // 添加默认参数
    setDefaultConfig(dfConfig) {
        glUtil.copy(dfConfig, {});
        // console.log('----dfConfig--', dfConfig); // eslint-disable-line
    }

    // 销毁
    disposeCompEft() {

    }

    // 效果初始化
    compEftInit() {
        // 底面
        // this.subface = this.creatSubface(this.config.subface);
        // if (this.subface) this.scene.add(this.subface);
        console.log(glUtil, this);


        this._triggerInnerEvent('mounted', { val: this.config.name });
    }

    //--------------
    //

    // 创建镜面底面
    mirrorSubface(sGeo, opts) {
        const [frame, norTxueNode, colTxueNode, alpTxueNode] = [
            new NodeFrame(),
            new TextureNode(this.getTxue(opts.norDecal)),
            new TextureNode(this.getTxue(opts.colDecal)),
            new SwitchNode(new TextureNode(this.getTxue(opts.alpDecal)), 'w')
        ];

        // 镜面对象
        const endMirror = new THREE.ReflectorRTT(sGeo.clone(), {
            clipBias: 0.003, textureWidth: this.width, textureHeight: this.height
        });

        // 转换node
        const [mirror, norXY, norXYFlip = new MathNode(norXY, MathNode.INVERT)] = [
            new ReflectorNode(endMirror), new SwitchNode(norTxueNode, 'xy')
        ];
        // 模糊镜面
        const [offsetNor, blurMirror] = [
            new OperatorNode(norXYFlip, new FloatNode(0.4), OperatorNode.SUB), new BlurNode(mirror)
        ];

        mirror.offset = new OperatorNode(offsetNor, new FloatNode(6), OperatorNode.MUL);
        blurMirror.size = new THREE.Vector2(this.width, this.height);
        blurMirror.uv = new ExpressionNode('projCoord.xyz / projCoord.q', 'vec3');
        blurMirror.uv.keywords.projCoord = new OperatorNode(mirror.offset, mirror.uv, OperatorNode.ADD);
        blurMirror.radius.x = blurMirror.radius.y = opts.mirBlur;

        // 最终材质
        const mirrorMtl = new PhongNodeMaterial();
        mirrorMtl.color = colTxueNode; // 主纹理
        mirrorMtl.environment = blurMirror; // 反射纹理
        mirrorMtl.alpha = new OperatorNode(alpTxueNode, new FloatNode(0), OperatorNode.MUL); // 透贴
        mirrorMtl.environmentAlpha = new FloatNode(opts.mirRatio); // 反射和主纹理比例取值

        endMirror.name = 'mirrorSubface';
        endMirror._isMirrorSubface = true;
        endMirror.add(new THREE.Mesh(sGeo, mirrorMtl));
        endMirror.position.y = opts.offsetY || 0;
        if (opts.isRoateX) endMirror.rotateX(-Math.PI * 0.5);

        // 动画执行方法
        endMirror.userData.amtFun = (dt) => {
            frame.update(dt).updateNode(mirrorMtl);
        };
        endMirror.userData.Tween = {
            obj: mirrorMtl.alpha.b,
            end: { value: opts.opacity },
            time: opts.subfaceLoadTime * 1000
        };

        return endMirror;
    }

    // 底面缓入
    subfaseAmt(node = this.subface) {
        const sf = node;
        if (!sf || !sf.userData.Tween) return;
        const [tweens, t] = [sf.userData.Tween, this.tweenTims];
        this.tweenTims = tweens.time;
        this.setTestTween(tweens.obj, tweens.end, () => { this.tweenTims = t; });
    }

    // ----------

    creatSubface(opts) {
        if (!opts.isCreat) return null;
        const sGeo = this.subfaceGeo(glUtil.wh, opts);
        const end = opts.isMirror ? this.mirrorSubface(sGeo, opts) : this.commonSubface(sGeo, opts);
        this.onAnimate(end.userData.amtFun);
        return end;
    }

    // 底面创建 geo
    subfaceGeo(wh, opts) {
        const [min, max] = [-wh * 0.5, wh * 0.5];
        const { offset, txueRpt } = opts;
        const [ix, ax, iz, az, tpu, tpv] = [
            min - offset[0], max + offset[0], min - offset[1], max + offset[1],
            isNaN(txueRpt[0]) ? 1 : txueRpt[0], isNaN(txueRpt[1]) ? 1 : txueRpt[1]
        ];
        const [sGeo, sIndices, uv1, uv2, nral, sPos] = [
            glUtil.geo.buf(),
            [0, 2, 1, 2, 3, 1],
            [0, 1, 1, 1, 0, 0, 1, 0],
            // [0, tpv, tpu, tpv, 0, 0, tpu, 0],
            [0, tpv, tpu, tpv, 0, 0, tpu, 0],
            [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
            [ix, az, 0, ax, az, 0, ix, iz, 0, ax, iz, 0]
            // [ix, 0, iz, ix, 0, az, ax, 0, az, ax, 0, iz],
        ];
        sGeo.setIndex(sIndices);
        sGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uv1, 2));
        sGeo.setAttribute('uv2', new THREE.Float32BufferAttribute(uv2, 2));
        sGeo.setAttribute('position', new THREE.Float32BufferAttribute(sPos, 3));
        // 是否镜面
        if (opts.isMirror) sGeo.setAttribute('normal', new THREE.Float32BufferAttribute(nral, 3));

        return sGeo;
    }

    // 创建普通底面
    commonSubface(sGeo, opts) {
        const subface = new THREE.Mesh(sGeo, glUtil.mtl.shader({
            uniforms: {
                u_time: { value: 0 },
                u_txue: { value: this.getTxue(opts.colDecal) },
                u_txue_bk: { value: this.getTxue(opts.alpDecal) }
            },
            transparent: true,
            polygonOffset: true,
            polygonOffsetUnits: 3.0,
            polygonOffsetFactor: 0.6,
            vertexShader: _Shaders.SubfaceVShader,
            fragmentShader: _Shaders.SubfaceFShader
        }));
        subface.renderOrder = 0;

        subface.name = 'commonSubface';
        subface._isCommonSubface = true;
        subface.rotateX(-Math.PI * 0.5);
        subface.position.y = opts.offsetY || 0;

        subface.userData.amtFun = null;
        subface.userData.Tween = {
            obj: subface.material.uniforms.u_time,
            end: { value: opts.opacity },
            time: opts.subfaceLoadTime * 1000
        };

        return subface;
    }
}

export default SubFaceEft;
