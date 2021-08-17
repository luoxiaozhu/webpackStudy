/**
 * 效果模板 - 测试 by zhoupu
 */
import glUtil from '../../utils';
import EffectBase from '../../src/EffectBase';

class Testing extends EffectBase {
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
        // console.log(this); // eslint-disable-line
        this.create();

        this._triggerInnerEvent('mounted', { val: this.config.name });
    }

    create() {

    }
}

export default Testing;
