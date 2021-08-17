/**
 * 效果模板 - 测试 by zhoupu
 */
import glUtil from '../../utils';
import EffectBase from '../../src/EffectBase';

class EarthPointLayer extends EffectBase {
    constructor(render) {
        super(render);

        this.moveObj = null;
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
        this.moveObj = null;
    }

    // 效果初始化
    compEftInit() {
        // console.log(this); // eslint-disable-line
        const fData = glUtil.dataConvert(this.config.colConfig, this.config.pointData.columns, this.config.pointData.data);
        const points = this.getPoints(fData);
        this.group.add(points);
        this._triggerInnerEvent('mounted', { val: this.config.name });
    }

    getPoints(pointDatas) {
        const pointObject = glUtil.group('pointObject');
        pointObject.renderOrder = this.config.renderOrder;
        const pointConf = this.config.point;

        let pointImg;
        let pointMaterial;
        for (let i = 0; i < pointDatas.length; i++) {
            const singlePoint = glUtil.obj('单个标注');
            if (pointConf.pointImageType !== 'fix') {
                pointImg = `${pointConf.pointPath + pointDatas[i].name}.png`;
                pointMaterial = this.getPointSpriteMtl(pointImg);
            } else {
                pointImg = pointConf.pointDefaultImage;
                pointMaterial = this.getPointSpriteMtl(pointImg);
            }

            const pointSprite = new THREE.Sprite(pointMaterial);
            const pos = glUtil.lonLatToEarthVector3(pointDatas[i].lng, pointDatas[i].lat, this.config.radius);
            const pointSize = pointConf.size;

            pointSprite.scale.set(pointSize, pointSize, pointSize);
            // setFadeInAni(pointSprite, thm.fadeInAniArr, layerOpt.fadeInAni.opacityAniSpeed);
            // pointSprite.userData.bounceSpeed = pointConf.bounceSpeed + pointConf.bounceSpeed * Math.random() * 0.3;
            // pointSprite.userData.bounceDistance = pointConf.bounceDistance;
            // pointSprite.userData.posY = pointSprite.position.y;
            // thm.bounceArr.push(pointSprite);
            pointSprite.userData = pointDatas[i];
            pointSprite.userData.compName = this.config.name;
            this.eventArr.push(pointSprite);
            singlePoint.add(pointSprite);
            const tagsConf = this.config.tags;
            // 创建文字标签
            if (tagsConf && tagsConf.show && pointDatas[i].name) {
                const textSprite = this.createSpriteText(pointDatas[i].name);
                const offsetPos = tagsConf.pos;
                textSprite.position.set(offsetPos[0], offsetPos[1], offsetPos[2]);
                // setFadeInAni(textSprite, thm.fadeInAniArr, layerOpt.fadeInAni.opacityAniSpeed);
                singlePoint.add(textSprite);
            }
            singlePoint.position.set(pos.x, pos.y, pos.z);
            pointObject.add(singlePoint);
        }
        return pointObject;
    }

    // 点击事件
    onClick(...arg) {
        return this.eventParamHandle(...arg);
    }

    // move事件
    onMouseMove(...arg) {
        return this.eventParamHandle(...arg);
    }

    // 移入事件
    onMouseIn(...arg) {
        if (arg[2].id !== this.id) {
            return [arg[0]];
        }
        this.moveObj = arg[1][0].object;
        const { userData } = this.moveObj;
        return [arg[0], userData.compName, userData.name];
    }

    // 移出事件
    onMouseOut(...arg) {
        if (arg[2].id !== this.id || !this.moveObj) {
            return [arg[0]];
        }
        const { userData } = this.moveObj;
        this.moveObj = null;
        return [arg[0], userData.compName, userData.name];
    }

    // 事件参数处理
    eventParamHandle(...arg) {
        if (!arg[1][0] || !arg[1][0].object) {
            return [arg[0]];
        }
        const { userData } = arg[1][0].object;
        return [arg[0], userData.compName, userData.name];
    }

    // 根据名称和配置, 创建名称对应的sprite
    createSpriteText(name) {
        const textNode = this.getPointNodes(name);

        document.body.appendChild(textNode);
        const rect = textNode.getBoundingClientRect();
        const textImg = glUtil.getScreenCut(textNode, false, rect);
        textNode.remove();

        const spriteMap = glUtil.createCanvasTexture(rect, textImg, true);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: spriteMap,
            // color: new THREE.Color(layerOpt.tags.color),
            // opacity: layerOpt.tags.opacity,
            transparent: true,
            depthWrite: false
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        const { scaleRate } = this.config.tags;
        sprite.scale.set(rect.width * scaleRate, rect.height * scaleRate, 1);
        return sprite;
    }

    getPointNodes(name) {
        const textOpt = this.config.tags;
        const node = document.createElement('div');
        const textNode = document.createTextNode(name);

        node.appendChild(textNode);
        node.setAttribute('style', `font-weight: ${textOpt.fontWeight};line-height: 1.2;position:absolute;padding: 0 2px;
            width: ${textOpt.width}px;font-size: ${textOpt.fontSize}px;opacity: ${textOpt.opacity};text-align: center;
            background-image:-webkit-linear-gradient(270deg, ${textOpt.startColor},${textOpt.endColor});
            -webkit-background-clip: text;-webkit-text-fill-color:transparent;`);
        return node;
    }

    // 获取标注的材质
    getPointSpriteMtl(pointImg) {
        const pointTexture = this.renderer._Txues.loadTexture({
            id: glUtil.creatId('txue'),
            url: pointImg,
            isRepeat: false
        });
        const pointMaterial = new THREE.SpriteMaterial({
            // var pointMaterial = new THREE.MeshBasicMaterial({
            map: pointTexture,
            transparent: true,
            side: THREE.FrontSide,
            depthWrite: false
        });
        return pointMaterial;
    }
}

export default EarthPointLayer;
