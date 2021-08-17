/**
 * @Author zhoupu
 * 事件分发，提供基础事件入口
 */
import glUtil from '../../utils';

export default class BaseEvent {
    constructor(render) {
        this.renderer = render; // 渲染对象
        this.dblclickDelay = 200; // 200毫秒间隔内为单击

        this.eventDom = null; // 事件挂载dom
        this._ItdMesh = null; // 拾取过渡对象
        this._Mouse = null;
        this._Raycaster = null;
        this._Intersects = []; // 射线拾取对象
        this._CurrentID = null; // 当前事件关联的效果ID,实时

        let dfDbClickTot = 0; // 单双击延时
        let dfMouseUpTot = 0; // MouseUp 延时
        /**
         * [鼠标事件入口]
         * @param    {[object]}   event [事件event]
         */
        const [
            onDocumentWheel,
            onDocumentKeyup,
            onDocumentKeydown,
            onDocumentMouseUp,
            onDocumentMouseOut,
            onDocumentMouseMove,
            onDocumentMouseDown,
            onDocumentMousedblclick
        ] = [
            (event) => { // onDocumentWheel
                if (this._isIntercept(event)) return;
                this.setEvent(event, 'onWheel');
            },
            (event) => { // onDocumentKeyup
                if (this._isIntercept(event, true)) return;
                this.setEvent(event, 'onKeyup');
            },
            (event) => { // onDocumentKeydown
                if (this._isIntercept(event, true)) return;
                this.setEvent(event, 'onKeydown');
            },
            (event) => { // onDocumentMouseUp
                if (this._isIntercept(event)) return;

                clearTimeout(dfMouseUpTot);
                dfMouseUpTot = setTimeout(() => {
                    this.setEvent(event, ['onMouseUp', 'onClick']);
                }, this.dblclickDelay);
            },
            (event) => { // onDocumentMouseOut
                if (this._isIntercept(event)) return;
                this.setMouseOut(event);
            },
            (event) => { // onDocumentMouseMove
                if (this._isIntercept(event)) return;

                this.setEvent(event, 'onMouseMove');
                this.getIntersects(event); // -拾取物体
                if (this._Intersects.length) {
                    const obj0 = this._Intersects[0].object;
                    if (obj0 !== this._ItdMesh) this.setMouseOut(event);
                    this.setMouseIn(event, obj0);
                } else {
                    this.setMouseOut(event);
                }
            },
            (event) => { // onDocumentMouseDown
                if (this._isIntercept(event)) return;

                clearTimeout(dfDbClickTot);
                dfDbClickTot = setTimeout(() => {
                    this.getIntersects(event);
                    this.setEvent(event, 'onMouseDown');
                }, this.dblclickDelay);
            },
            (event) => { // onDocumentMousedblclick
                if (this._isIntercept(event)) return;

                clearTimeout(dfDbClickTot);
                clearTimeout(dfMouseUpTot);
                this.getIntersects(event);
                this.setEvent(event, ['onDblClick', 'onMouseUp']);
            }
        ];

        /**
         * [handleEvent 处理事件，挂载或移除]
         * @DateTime 2021-01-30
         * @param    {[dom]}   eventDom    [事件注册dom元素]
         * @param    {[string]}   type     [类别 add/remove]
         */
        this.handleEvent = (eventDom, type) => {
            if (!eventDom) return;
            clearTimeout(dfDbClickTot);
            clearTimeout(dfMouseUpTot);
            eventDom[`${type}EventListener`]('wheel', onDocumentWheel, false);
            document[`${type}EventListener`]('keyup', onDocumentKeyup, false);
            document[`${type}EventListener`]('keydown', onDocumentKeydown, false);
            eventDom[`${type}EventListener`]('mouseup', onDocumentMouseUp, false);
            eventDom[`${type}EventListener`]('mouseout', onDocumentMouseOut, false);
            eventDom[`${type}EventListener`]('mousemove', onDocumentMouseMove, false);
            eventDom[`${type}EventListener`]('mousedown', onDocumentMouseDown, false);
            eventDom[`${type}EventListener`]('dblclick', onDocumentMousedblclick, false);
        };
    }

    /**
     * [init 初始化事件入口]
     * @DateTime 2021-02-01
     * @param    {Boolean}  isInit [false-不初始化，在编辑器非预览使用]
     */
    init(isInit) {
        if (!isInit) return;

        this._Mouse = new THREE.Vector2();
        this._Mouse2 = new THREE.Vector2();
        this._Raycaster = new THREE.Raycaster();
        this.eventDom = this.renderer.container; // 事件挂载dom
        this.handleEvent(this.eventDom, 'add');
    }

    /**
     * [dispose 销毁事件]
     * @DateTime 2021-01-30
     * @param    {Boolean}  isClearRay [是否只清空拾取]
     */
    dispose(isClearRay) {
        this._ItdMesh = null;
        if (isClearRay) return;

        this._Mouse = null;
        this._Mouse2 = null;
        this._Raycaster = null;
        this._Intersects = null;
        this._CurrentID = null;

        this.handleEvent(this.eventDom, 'remove');
        this.eventDom = null;
        this.renderer = null;
    }

    /**
     * [setMouseOut 鼠标移出事件执行]
     * @DateTime 2021-02-01
     * @param    {[object]}   event      [事件event]
     */
    setMouseOut(event) {
        if (!this._ItdMesh) return;
        this.eventDom.style.cursor = 'auto';
        this.setEvent(event, 'onMouseOut');
        this._ItdMesh = null;
    }

    /**
     * [setMouseIn 鼠标移入事件执行]
     * @DateTime 2021-02-01
     * @param    {[object]}   event [事件event]
     * @param    {[object]}   obj   [拾取对象缓存，区分是否是相同的拾取]
     */
    setMouseIn(event, obj) {
        this._ItdMesh = obj;
        this.eventDom.style.cursor = 'pointer';
        this.setEvent(event, 'onMouseIn');
    }

    /**
     * [setEvent 事件处理分发]
     * @DateTime 2021-02-01
     * @param    {[object]}   event     [事件event]
     * @param    {[string/array]}   eventName [事件类别]
     */
    setEvent(event, eventName) {
        const compEft = this.renderer.subCompEffects[this._CurrentID];
        if (glUtil.isArray(eventName)) {
            eventName.forEach((eNm) => {
                this.handoutEvent(event, eNm, compEft);
            });
        } else this.handoutEvent(event, eventName, compEft);
    }

    /**
     * [handoutEvent 组件效果事件分发执行]
     * @DateTime 2021-02-01
     * @param    {[object]}   event      [事件event]
     * @param    {[string]}   eventName  [事件名称]
     * @param    {[object]}   compEft    [事件触发的组件效果对象]
     */
    handoutEvent(event, eventName, compEft) {
        this.renderer._handleEventFn(eventName, event, this._Intersects, compEft);

        const compArr = this.renderer.subCompEffectArr;
        for (let i = 0; i < compArr.length; i++) {
            const ci = compArr[i];
            if (!ci.config.isCompEvents && !ci.eventArr.length) continue;
            ci._handleEventFn(eventName, event, this._Intersects, compEft);
        }
    }

    /**
     * [getIntersects 获取拾取对象]
     * @Author   ZHOUPU
     * @DateTime 2021-08-09
     * @param    {[object]}   event [事件event]
     */
    getIntersects(event) {
        const result = this.getIntersectMeshs(event);

        // - 删除 不执行事件的元素 _unEvent
        for (let i = result.length - 1; i >= 0; i--) {
            if (result[i].object._unEvent) result.splice(i, 1);
        }

        if (result.length) this._CurrentID = result[0].object.userData.ceId;

        this._Intersects = result;
    }

    /**
     * [getIntersectMeshs 传递指定的数组对象拾取]
     * @param   {Object}  event      [event 鼠标Event]
     * @param   {Array}   meshs      [meshArray 需要拾取的数组]
     * @return  {Object}             [return 当前拾取的 Intersect]
     */
    getIntersectMeshs(event, meshs) {
        const [render, et] = [this.renderer, event.offsetX !== undefined ? 'offset' : 'layer'];
        this._Mouse2.set(event[`${et}X`], event[`${et}Y`]);
        this._Mouse.x = (event[`${et}X`] / render.width) * 2 - 1;
        this._Mouse.y = -(event[`${et}Y`] / render.height) * 2 + 1;

        const { threshold, isRayRecur } = render.config;
        if (threshold) this._Raycaster.params.Points.threshold = threshold; // - 设置 Points 拾取精度

        this._Raycaster.setFromCamera(this._Mouse, render.camera);
        return this._Raycaster.intersectObjects(meshs || render.eventArr, isRayRecur);
    }

    /**
     * [_isIntercept 根据容器配置项，判定是否拦截事件]
     * @DateTime 2021-02-01
     * @param    {[object]}   event [事件event]
     * @param    {[Boolean]}   key  [阻止事件默认操作]
     * @return   {Boolean}  [是否拦截事件]
     */
    _isIntercept(event, key) {
        if (!key) event.preventDefault();
        const {
            isShow, // 显示隐藏
            isViewport, // 是否视图
            isCompEvents // 是否开启组件事件
        } = this.renderer.config;
        return !(isShow && isViewport && isCompEvents);
    }
}
