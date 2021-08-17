/**
* @Author TangChengchuan
* @Date 2019/12/18
* @Description 监听工厂函数
*/
let util;
const COMPUTED = Symbol('COMPUTED');
export default class Diff {
    /**
     * @Author TangChengchuan
     * @Date 2019/12/18
     * @Description 工厂构造函数
     * @param utils [Object] => 工具类
    */
    constructor(utils) {
        util = utils;
        // 监听器
        this._listener = new util.Listener();
        /**
         * @Author TangChengchuan
         * @Date 2019/12/18
         * @Description 对外bind方法，这里返回的对象不会通过destroy删除，
         * @param target [Object] => 固定格式的配置项
         * @param callback [function] => 执行后的回调参数  可选
         * @return proxy [Proxy] => 生成的代理对象
         */
        this.bind = function (target, callback = function () {}) {
            // 生成监听原始值并绑定计算属性标识
            // const targetBase = { ...target.data };
            util.loopObject(target.computed, (nm) => { target.data[nm] = COMPUTED; });
            // 生成Proxy
            const rep = this._createListener(
                target.data, target.watch, target.computed, target.bind
            );
            callback(rep);
            return rep;
        };
        /**
         * @Author TangChengchuan
         * @Date 2019/12/18
         * @Description 销毁工厂，并不会销毁生成的代理
        */
        this.dispose = function (isClear) {
            this._listener.destroy();
            if (isClear) return; // 是否销毁全部
            util.clearObject(this);
            util = null;
        };
    }

    /**
     * @Author TangChengchuan
     * @Date 2019/12/18
     * @Description 内部生成逻辑
     * @param targetBase [Object] => 需要监听的对象
     * @param watcher [Object] => 需要触发的监听
     * @param compute [Object] => 计算属性
     * @param __dir [String] => 记录地址
     * @return Proxy [Proxy] => 代理对象
    */
    _createListener = function (targetBase = {}, watcher = {}, compute = {}, bind = {}) {
        const [
            self, listener, checkingList, computed,
            _triggerCache, _computedCache, _changeComputedCache
        ] = [this, {}, {}, {}, {}, {}, {}];

        let [rep, TIME_TRIGGER, TIME_COMPUTED, TIME_CHANGE_COMPUTED] = [];

        /**
         * @Author TangChengchuan
         * @Date 2019/12/18
         * @Description 判断是否需要过检测
         * @param name [String] => 需要检测的名称
         * @return needCheck [Boolean]
        */
        function _needCheck(name) {
            return !!(checkingList[name] || listener[name]);
        }
        /**
         * @Author TangChengchuan
         * @Date 2019/12/18
         * @Description 将内部事件缓存设置为休眠状态
        */
        function _clearCache() {
            self._listener.setListener(self._listenerList);
        }
        /**
         * @Author TangChengchuan
         * @Date 2019/12/18
         * @Description 将内部事件缓存设置为运行状态
        */
        function _setCache() {
            self._listener.setListener(listener);
        }
        /**
         * @Author TangChengchuan
         * @Date 2019/12/18
         * @Description 设置监听
         * @param name [String] => 监听名称
         * @param callback [Function] => 回调函数
         */
        function _setListener(name, callback = function () {}) {
            self._listener.bind(name, callback);
        }
        /**
         * @Author TangChengchuan
         * @Date 2019/12/18
         * @Description 触发监听 有延迟节流
         * @param name [String] => 监听名称
         * @param newValue [Any] => 新值
         * @param oldValue [Any] => 旧值
        */
        function _trigger(name, newValue, oldValue) {
            if (!TIME_TRIGGER) {
                TIME_TRIGGER = true;
                requestAnimationFrame(() => {
                    TIME_TRIGGER = false;
                    util.loopObject(_triggerCache, (itemName) => {
                        _setCache();
                        self._listener.trigger(..._triggerCache[itemName], itemName);
                        _clearCache();
                        Reflect.deleteProperty(_triggerCache, itemName);
                    });
                });
            }
            _triggerCache[name] = [name, rep, newValue, oldValue];
        }
        /**
         * @Author TangChengchuan
         * @Date 2019/12/19
         * @Description 循环遍历object
         * @param object [Object] => 要遍历的对象
         * @param callback [Function] => 回调
         * @param path [Array] => 路径记录位置
        */
        function _loop(object, callback, path = []) {
            util.loopObject(object, (itemName) => {
                const [pathList, next] = [path.slice(), object[itemName]];
                pathList.push(itemName);
                callback(next, pathList);
                if (!util.isSimpleObj(next)) _loop(next, callback, pathList);
            });
        }
        /**
         * @Author TangChengchuan
         * @Date 2019/12/19
         * @Description 初始化保存的缓存对象
        */
        function _init() {
            // 销毁已经存在的
            util.clearObject(listener);
            util.clearObject(checkingList);
            util.clearObject(computed);
            // 初始化
            _setCache();
            // 绑定事件
            _loop(watcher, (item, pathList) => {
                if (!(item instanceof Function)) return;
                let path = pathList[0];
                pathList.forEach((itemName, i) => {
                    if (i) path += `.${itemName}`;

                    _setListener(path, ((_pathList, _i, callback) => {
                        const lists = _pathList.filter((_item, index) => index > _i);
                        return function (newValue, oldValue, pathNm) {
                            if (lists.length) {
                                lists.some((list) => {
                                    newValue = newValue[list];
                                    return newValue === undefined;
                                });
                            }
                            Reflect.apply(callback, bind, [newValue, oldValue, pathNm, this]);
                        };
                    })(pathList, i, item));
                });
            });
            // 计算属性初始化
            self.computed = true;
            util.loopObject(compute, (itemName) => {
                self.computedName = itemName;
                computed[itemName] = Reflect.apply(compute[itemName], rep, []);
                Reflect.deleteProperty(self, 'computedName');
            });
            Reflect.deleteProperty(self, 'computed');
            _clearCache();
        }
        /**
         * @Author TangChengchuan
         * @Date 2019/12/19
         * @Description 用于遍历处理计算属性
         * @param object [_changeComputedCache|_computedCache] => computed缓存对象
         * @param needDeal [Boolean] => 是否需要判断值变化
        */
        function _triggerComputed(object, needDeal) {
            util.loopObject(object, (itemName) => {
                if (compute[itemName]) {
                    const oldValue = computed[itemName];
                    computed[itemName] = Reflect.apply(compute[itemName], rep, []);
                    const newValue = computed[itemName];
                    if (!needDeal && newValue === oldValue) return;
                    _setCache();
                    self._listener.trigger(
                        itemName,
                        rep,
                        newValue,
                        needDeal ? undefined : oldValue,
                        itemName
                    );
                    _clearCache();
                }
                Reflect.deleteProperty(object, itemName);
            });
        }
        /**
         * @Author TangChengchuan
         * @Date 2019/12/19
         * @Description 处理触发的计算属性 用于bind生成固定执行方法
         * @param _computed [Array] => 记录的计算属性
        */
        function _dealComputed(_computed) {
            if (!TIME_COMPUTED) {
                TIME_COMPUTED = true;
                requestAnimationFrame(() => {
                    TIME_COMPUTED = false;
                    _triggerComputed(_computedCache);
                });
            }
            _computed.forEach((itemName) => {
                _computedCache[itemName] = true;
            });
        }
        /**
         * @Author TangChengchuan
         * @Date 2019/12/19
         * @Description 用于处理修改计算属性的情况
         * @param name [String] => 计算属性名称
        */
        function _changeComputed(name) {
            if (!TIME_CHANGE_COMPUTED) {
                // 滞后
                TIME_CHANGE_COMPUTED = true;
                requestAnimationFrame(() => {
                    // 比节流还要滞后
                    requestAnimationFrame(() => {
                        // 从新初始化值
                        _init();
                        // 触发计算属性
                        TIME_CHANGE_COMPUTED = false;
                        _triggerComputed(_changeComputedCache, true);
                    });
                });
            }
            _changeComputedCache[name] = true;
        }
        /**
         * @Author TangChengchuan
         * @Date 2019/12/18
         * @Description 内部生成逻辑
         * @param _targetBase [Object] => 需要监听的对象
         * @param _watcher [Object] => 需要触发的监听
         * @param _compute [Object] => 计算属性
         * @param _dir [String] => 记录地址
         * @return Proxy [Proxy] => 代理对象
         */
        const __create = (_targetBase = {}, _watcher = {}, _compute = {}, _dir = '') => {
            /**
             * @Author TangChengchuan
             * @Date 2019/12/19
             * @Description 获取当前代理的路径
             * @param path [String] => 当前属性名称
             * @return _dir [String] => 拼接的路径
            */
            function getPath(path) {
                return _dir ? `${_dir}.${typeof path === 'string'
                    ? path : 'Symble---toString'}` : path;
            }
            return new Proxy(_targetBase, {
                // 遍历的处理
                ownKeys(target) {
                    const report = Object.keys(target);
                    if (target instanceof Array) report.push('length');
                    return report;
                },
                // 获取值处理
                get(target, name, receiver) {
                    if (name === '__getBase__') return target; // 返回默认目标值
                    if (name === 'constructor') return Proxy; // 简单对象

                    // 获取当前路径
                    const path = getPath(name);
                    // 获取默原始值
                    const baseValue = Reflect.get(target, name, receiver);
                    // 当处于计算属性绑定阶段处理逻辑
                    if (self.computed) {
                        _setCache();
                        checkingList[path] = checkingList[path] || new Set();
                        checkingList[path].add(self.computedName);
                        listener[path] = listener[path] || [];
                        const _listenerList = listener[path];
                        if (!_listenerList.some((item) => item.isComputed)) {
                            const dealComputed = _dealComputed.bind(null, checkingList[path]);
                            dealComputed.isComputed = true;
                            _listenerList.push(dealComputed);
                        }
                        _clearCache();
                    }
                    // 处理Array的事件触发问题
                    if (Array.isArray(target) && baseValue instanceof Function) {
                        return function (...arg) {
                            const next = target.map((item, i) => {
                                const _path = getPath(i);
                                if (util.isSimpleObj(item)) return item;
                                return __create(item, _watcher[i], _compute, _path);
                            });
                            const { length } = next;
                            const _rep = Reflect.apply(baseValue, next, arg);
                            const nextLength = next.length;
                            let oldValue;
                            if (nextLength !== length) oldValue = target.slice();

                            target.splice(0);
                            next.forEach((item) => {
                                if (util.isSimpleObj(item)) {
                                    target.push(item);
                                } else {
                                    target.push(item.__getBase__);
                                }
                            });
                            if (nextLength !== length) _trigger(_dir, target.slice(), oldValue);
                            return _rep;
                        };
                    }
                    // 计算属性的取值
                    if (baseValue === COMPUTED) return Reflect.get(computed, name, receiver);
                    // 正常模式下的非基本变量返回值
                    if (_needCheck(path) && !util.isSimpleObj(baseValue)) {
                        return __create(baseValue, _watcher[name], _compute, path);
                    }
                    // 基本变量返回值
                    return baseValue;
                },
                // 设置值处理
                set(target, name, value, receiver) {
                    // 处理默认路径
                    const path = getPath(name);
                    // 获取原始值
                    const oldValue = target[name];
                    // 计算属性修改触发从新计算
                    if (oldValue === COMPUTED) {
                        if (value instanceof Function) {
                            compute[name] = value;
                        } else {
                            Reflect.deleteProperty(compute, name);
                            Reflect.set(target, name, value, receiver);
                        }
                        _changeComputed(name);
                        return true;
                    }
                    // 不监听内容相等 和 未注册的属性
                    if (!util.isEqual(value, oldValue) && _needCheck(path)) {
                        // 触发监听
                        _trigger(path, value, oldValue);
                    }
                    // 处理赋值的方法
                    return Reflect.set(target, name, value, receiver);
                }
            });
        };

        rep = __create(targetBase, watcher, compute);
        _init();
        return rep;
    };

    _listenerList = {};
}
