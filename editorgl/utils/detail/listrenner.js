/*
* @Author TangChengchuan
* @Date 2019/12/13
* @Description 样式监听器
*/
export default class Listener {
    constructor() {
        let listener = {};
        /**
         * @Author TangChengchuan
         * @Date 2019/12/14
         * @Description 绑定方法
         * @param type [string] 类型名称
         * @param callback [function] 回调方法
         */
        this.bind = function (type, callback) {
            const list = listener[type] || [];
            if (!listener[type]) {
                listener[type] = list;
            }
            list.push(callback);
        };
        /**
         * @Author TangChengchuan
         * @Date 2019/12/14
         * @Description 解除绑定的方法
         * @param type [string] 类型名称
         * @param callback [function] 回调方法
        */
        this.unbind = function (type, callback) {
            if (!type) {
                Object.keys(listener).forEach((itemName) => {
                    Reflect.deleteProperty(listener, itemName);
                });
            }
            const list = listener[type];
            if (!list) {
                return true;
            }
            if (list && !callback) {
                return Reflect.deleteProperty(listener, type);
            }
            listener[type] = list.filter((item) => item !== callback);
            if (!listener[type].length) {
                return Reflect.deleteProperty(listener, type);
            }
            return true;
        };
        /**
         * @Author TangChengchuan
         * @Date 2019/12/14
         * @Description 获取绑定对象
        */
        this.getListener = function () {
            return listener;
        };
        /**
         * @Author TangChengchuan
         * @Date 2019/12/14
         * @Description 设置绑定对象
         * @param thatListener [object] 绑定对象
        */
        this.setListener = function (thatListener) {
            listener = thatListener;
        };
        /**
         * @Author TangChengchuan
         * @Date 2019/12/14
         * @Description 触发事件
         * @param type [string] 类型名称
         * @param source [string] 事件源
         * @param [params] [string] 传入参数
        */
        this.trigger = function (type, source, ...params) {
            const list = listener[type];
            if (!list) {
                return false;
            }
            list.forEach((item) => {
                item.apply(source, params);
            });
            return true;
        };
        /**
         * @Author TangChengchuan
         * @Date 2019/12/14
         * @Description 触发事件流
         * @param type [string] 类型名称
         * @param source [string] 事件源
         * @param [params] [string] 传入参数
         */
        this.stream = function (type, source, ...params) {
            const list = listener[type];
            if (!list) {
                return;
            }
            let i = -1;
            const _next = (...param) => {
                const event = list[++i];
                if (event) {
                    event.apply(source, [_next].concat(param));
                }
            };
            _next(...params);
        };
        /**
         * @Author TangChengchuan
         * @Date 2019/12/14
         * @Description 销毁实例
        */
        this.destroy = function () {
            Object.keys(listener).forEach((item) => {
                Reflect.deleteProperty(listener, item);
            });
            // Object.keys(this).forEach((item) => {
            //     Reflect.deleteProperty(this, item);
            // });
        };
    }
}
