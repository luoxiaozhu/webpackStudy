// - copy和extend需要
const simpleItem = [
    Number,
    String,
    Date,
    RegExp,
    HTMLElement,
    NodeList,
    Boolean,
    Function
];
/**
 * [utilsFunction 公用工具-公用函数]
 * @type {Object}
 */
const utilsFunction = {
    _cId: 0,
    /**
     * [creatId  生成不同 type 的 唯一ID]
     * @Author   ZHOUPU
     * @DateTime 2018-12-28
     * @param    {[string]}   type [类型, 默认'ce']
     * @return   {[string]}        [唯一ID]
     */
    creatId(type = 'ce') {
        this._cId++;
        const [center, right, left] = [
            (Date.now() + this._cId).toString(16),
            Math.random().toString().substr(2, 5),
            Math.random().toString(36).substr(2, 6)
        ];
        const idStr = `${type}_${left}${center.substr(center.length - 5)}${right}`;
        return idStr;
    },
    /**
     * [isArray 判断是否是一个array]
     * @Author   ZHOUPU
     * @DateTime 2018-08-02
     * @param    {[type]}   o [待判断的参数]
     * @return   {Boolean}    [true-array、false-not array]
     */
    isArray(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    },
    /**
     * [isFunction 判断是否是一个function]
     * @Author   ZHOUPU
     * @DateTime 2018-08-02
     * @param    {[type]}   a [待判断的参数]
     * @return   {Boolean}    [false-not function、true-function]
     */
    isFunction(a) {
        return Object.prototype.toString.call(a) === '[object Function]';
    },
    /**
     * [toFunction 参数不是function转为function，是则返回本身]
     * @Author   ZHOUPU
     * @DateTime 2018-08-02
     * @param    {[type]}   a [待判断的参数]
     * @return   {[function]}     [function]
     */
    toFunction(a) {
        return this.isFunction(a) ? a : function () {};
    },
    /**
     * [exeFunction 执行函数a, 若a非函数，return]
     * @Author   ZHOUPU
     * @DateTime 2021-02-04
     * @param    {[function]}   a  [执行函数]
     * @param    {[object]}   ins  [挂载的实例对象]
     * @param    {...[all]}   arg  [函数参数]
     */
    exeFunction(a, ins, ...arg) {
        if (this.isFunction(a)) return a.call(ins, ...arg);
        return false;
    },
    /**
     * [isDomElement 判断对象是否是dom元素]
     * @Author   ZHOUPU
     * @DateTime 2019-10-31
     * @param    {[object]}   d [待判断对象]
     * @return   {[Boolean]}    [是否是dom元素，true/false]
     */
    isDomElement(d) {
        return !!(d instanceof HTMLElement)
            || !!(d && typeof d === 'object' && d.nodeType === 1 && typeof d.nodeName === 'string');
    },

    // 数值大小范围限制
    clamp(v, mi, ma, df) {
        v -= 0;
        return Math.min(ma, Math.max(mi, Number.isNaN(v) ? df : v));
    },
    // -数值变化
    lerp(from, to, t) {
        return from + (to - from) * t;
    },
    // 数值取值限制
    limit(v, arr) {
        return (arr.indexOf(v) !== -1) ? v : arr[0];
    },
    // 转number类型
    toNum(val, df = 1) {
        val -= 0;
        return Number.isNaN(val) ? df : val;
    },
    // 数值大于 df 值
    greater(val, df = 0.001) {
        val -= 0;
        return Number.isNaN(val) ? df : Math.max(df, val);
    },
    /**
     * [initParams 初始化参数，opt参数不是undefined-赋值，否则返回本身]
     */
    initParams(old, opts, arr) {
        for (let i = 0; i < arr.length; i++) {
            const k = arr[i];
            if (Object.prototype.hasOwnProperty.call(opts, k)) { old[k] = opts[k]; }
        }
    },
    /**
     * [setObjParams 设置对象object有params的key的属性的值]
     * @Author   ZHOUPU
     * @DateTime 2019-11-06
     * @param    {[object]}   obj [待设置对象]
     * @param    {[object]}   pms [参数对象]
     */
    setObjParams(obj, pms = {}) {
        Object.keys(pms).forEach((k) => {
            if (Object.prototype.hasOwnProperty.call(obj, k)) obj[k] = pms[k];
        });
    },

    // 初始化 TWEEN
    initTWEEN(TWEEN) {
        this.TWEEN = TWEEN;
    },
    // 执行 val - function/ 'Quadratic.InOut'
    easing(k, val) {
        const func = this.isFunction(val) ? val : this.getEasing(val);
        if (func) {
            if (k <= 0) {
                k = 0;
            } else if (k >= 1) {
                k = 1;
            } else {
                k = func(k);
            }
        }
        return k;
    },
    // 获取 easing 如：Quadratic.InOut
    getEasing(name) {
        if (!this.TWEEN) return false;
        return this.parseEaseNm(name);
    },
    // 扩展 easing  如：Quadratic.OutIn, function
    setEasing(name, func) {
        if (!this.TWEEN || !this.isFunction(func)) return false;
        return this.parseEaseNm(name, func);
    },
    /**
     * [parseEaseNm 解析或设置 缓动函数]
     * @Author   ZHOUPU
     * @DateTime 2021-07-26
     * @param    {[string]}     name   [缓动函数名称]
     * @param    {[function]}   setFun [设置 缓动函数]
     * @return   {[boolean/function]}  [返回值]
     */
    parseEaseNm(name, setFun) {
        if (!this.TWEEN) return false;
        const [names, nmLen = names.length] = [name.split('.')];

        let [self, i] = [this.TWEEN.Easing, 0];
        for (; i < nmLen; i++) {
            const key = names[i];

            if (setFun) {
                self[key] = self[key] ? self[key] : {};
                if (i === nmLen - 1) self[key] = setFun;
            }
            self = self[key];
            if (!self) break;
        }
        return self;
    },

    /**
     * [checkStr 匹配两个字符串，精确匹配、模糊匹配 默认精确匹配]
     * @Author   ZHOUPU
     * @DateTime 2019-08-07
     * @param    {[string]}   string1 [待匹配值1]
     * @param    {[string]}   string2 [待匹配值2]
     * @param    {[number]}   type    [匹配类型 1-精确匹配  2-模糊匹配]
     * @return   {[boolean]}           [true-根据 type 是否匹配]
     */
    checkStr(string1, string2, type = 2) {
        if (!string1 || !string2) return false;
        if (type === 1)  return (string1 === string2); // 精确匹配
        return (string1.includes(string2) || string2.includes(string1)); // 模糊匹配
    },
    /**
     * [startsWith 判断字符串string是否以start开始]
     * @Author   ZHOUPU
     * @DateTime 2019-10-28
     * @param    {[string]}   string [待判断字符串]
     * @param    {[string]}   start  [开始字符串]
     * @return   {[Boolean]}          [true/false]
     */
    startsWith(string, start) {
        return string.slice(0, start.length) === start;
    },
    /**
     * [endsWith 判断字符串string是否以start结束]
     * @Author   ZHOUPU
     * @DateTime 2019-10-28
     * @param    {[string]}   string [待判断字符串]
     * @param    {[string]}   end    [结束字符串]
     * @return   {[Boolean]}          [true/false]
     */
    endsWith(string, end) {
        return string.slice(-end.length) === end;
    },
    /**
     * [deepClone 深度克隆]
     * @Author   ZHOUPU
     * @DateTime 2018-12-22
     * @param    {[object/array]}   obj [被克隆对象]
     * @return   {[object/array]}       [新对象]
     */
    deepClone(obj) {
        let newObj;
        const type = Object.prototype.toString.call(obj); // 对象类型
        if (type === '[object Array]') { // 数组
            newObj = [];
            if (obj.length > 0) {
                for (let x = 0; x < obj.length; x++) {
                    newObj.push(this.deepClone(obj[x]));
                }
            }
        } else if (type === '[object Object]') { // 对象
            newObj = {};
            Object.keys(obj).forEach((x) => {
                newObj[x] = this.deepClone(obj[x]);
            });
        } else { // 基本类型和方法
            newObj = obj;
        }
        return newObj;
    },
    /**
     * [removeArrItem 删除数组中key值]
     * @Author   ZHOUPU
     * @DateTime 2019-10-25
     * @param    {[array]}   arr   [数组]
     * @param    {[value]}   item  [待删除的值]
     */
    removeArrItem(arr, item) {
        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i] === item) {
                arr.splice(i, 1); break;
            }
        }
        return arr;
    },
    removeArrItem2(arr, item) {
        return arr.filter((node) => node !== item);
    },

    /**
     * [now 获取时间戳]
     * @Author   ZHOUPU
     * @DateTime 2019-10-26
     * @return   {[number]}   [当前时间戳值]
     */
    now() {
        return new Date().getTime();
    },
    /**
     * [throttle 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait]
     * @Author   ZHOUPU
     * @DateTime 2019-10-26
     * @param    {[function]}   func    [传入函数]
     * @param    {[number]}   wait    [表示时间窗口的间隔]
     * @param    {[object]}   options [如果想忽略开始边界上的调用，传入{leading: false}。
     *                               如果想忽略结尾边界上的调用，传入{trailing: false}]
     * @return   {[function]}           [返回调用函数]
     */
    throttle(func, wait, options) {
        let context;
        let args;
        let result;
        let timeout = null;

        // 上次执行时间点
        let previous = 0;
        if (!options) options = {};

        // 延迟执行函数
        const later = function () {
            // 若设定了开始边界不执行选项，上次执行时间始终为0
            previous = options.leading === false ? 0 : utilsFunction.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) {
                args = null;
                context = null;
            }
        };

        const throttled = function (...arg) {
            const now = utilsFunction.now();
            // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
            if (!previous && options.leading === false) previous = now;
            // 延迟执行时间间隔

            const remaining = wait - (now - previous);
            context = this;
            args = arg;

            // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
            // remaining大于时间窗口wait，表示客户端系统时间被调整过
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);

                if (!timeout) {
                    args = null;
                    context = null;
                }

                // 如果延迟执行不存在，且没有设定结尾边界不执行选项
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
        // - 取消
        throttled.cancel = function () {
            clearTimeout(timeout);
            previous = 0;
            args = null;
            context = null;
            timeout = null;
        };

        return throttled;
    },
    /**
     * @Author TangChengchuan
     * @Date 2019/12/10
     * @Description
     * @param target [any] ==>检测对象;
     * @return isSimple ==> 是否是简单对象
     */
    isSimpleObj(target) {
        const isProxy = target && target.constructor === Proxy;
        return isProxy || (typeof target !== 'object' && !isProxy)
            || (
                target === null || target === undefined
                || (
                    !isProxy && simpleItem.some((constructor) => target instanceof constructor)
                )
            );
    },
    /**
     * @Author TangChengchuan
     * @Date 2019/10/15
     * @Description 深度拷贝
     * @param base [object] ==>继承对象;
     * @param target [object] ==>被继承对象;
     * @return base ==> 需要继承的对象
     */
    copy(base, target) {
        Object.keys(target).forEach((i) => {
            const item = target[i];
            if (this.isSimpleObj(item)) {
                base[i] = item;
            } else if (this.isSimpleObj(base[i])) {
                base[i] = this.copy(item instanceof Array ? [] : {}, item);
            } else {
                base[i] = this.copy(base[i], item);
            }
        });
        return base;
    },
    /**
     * @Author TangChengchuan
     * @Date 2019/10/24
     * @Description 继承对象属性
     * @param args
     *   isDeep [boolean] ==> 非必填，是否深度拷贝，默认浅拷贝;
     *   base [object] ==> 目标对象;
     *   target [object] ==> 被继承对象，可以有多个;
     * @return base ==> 需要继承的对象
     */
    extend(...args) {
        const arg = Reflect.apply(Array.prototype.splice, args, [0]);
        if (arg[0] instanceof Boolean || typeof arg[0] === 'boolean') {
            const isDeep = arg.splice(0, 1)[0];
            if (isDeep) {
                const base = arg.splice(0, 1)[0];
                arg.forEach((item) => utilsFunction.copy(base, item));
                return base;
            }
        }
        return Reflect.apply(Object.assign, Object, arg);
    },
    /**
     * @Author TangChengchuan
     * @Date 2019/12/18
     * @Description 遍历对象
     * @param object [Object] => 需要遍历的对象
     * @param callback [Function] => 回调
     */
    loopObject(object, callback = function () {}) {
        Object.keys(object || {}).forEach(callback);
    },
    /**
     * [clearObject 清空对象]
     * @DateTime 2021-02-20
     * @param    {[object]}   object [待处理的对象]
     */
    clearObject(object) {
        this.loopObject(object, (nm) => { Reflect.deleteProperty(object, nm); });
    },
    /**
     * [isEqual 判断a,b两个对象内容是否相等]
     * @DateTime 2021-02-22
     * @param    {[any]}   a [待对比对象]
     * @param    {[any]}   b [待对比对象]
     * @return   {Boolean}    [内容是否相等]
     */
    isEqual(a, b) {
        if (a === b) return true;
        if (JSON.stringify(a) === JSON.stringify(b)) return true;
        if (this.isSimpleObj(a) || this.isSimpleObj(b)
            || this.isArray(a) || this.isArray(b)) return false; // 简单对象或数组不做后续判断

        const [ap, bp] = [Object.getOwnPropertyNames(a), Object.getOwnPropertyNames(b)];
        if (ap.length !== bp.length) return false;

        for (let i = 0; i < ap.length; i++) {
            const pnm = ap[i];
            if (Object.prototype.hasOwnProperty.call(b, pnm)) return false;

            const [aVal, bVal] = [a[pnm], b[pnm]];
            if (typeof aVal === 'object') {
                if (!this.isEqual(aVal, bVal)) return false;
            } else if (aVal !== bVal) {
                return false;
            }
        }
        return true;
    },
    /**
     * 墨卡托投影转换
     * @param vx, vy 经纬度
     * @param key 系数
     * @return { mx, my }
     */
    getMercator(vx, vy, key = 180) {
        const mx = (vx * key) / 180;
        let my = vy;
        if (vy < 67 && vy > -67) {
            const [k1, k2] = [Math.PI / 360, key / Math.PI];
            my = Math.log(Math.tan((90 + vy) * k1)) * k2;
        }
        return { mx, my };
    },
    /**
     * [getSegPoint 取 v1 v2 两点间的点v 或 v1到v2方向外的点v]
     * @DateTime 2021-02-04
     * @param    {[object]}   v1 [点对象 { x, y, z }]
     * @param    {[object]}   v2 [点对象 { x, y, z }]
     * @param    {[number]}   r  [比例, r取0~1,为 “v到v1长度/v2到v1长度” - 两点间的点;
     *                           r取>1,为 “v到v1长度/v2到v1长度” - v1到v2方向外的点]
     * @return   {[object]}      [description]
     */
    getSegPoint(v1, v2, r) {
        const result = {};
        Object.keys(v1).forEach((k) => {
            result[k] = v1[k] - v1[k] * r + v2[k] * r;
        });
        return result;
    },

    /**
     * [canvasToImg 获取canvas 缩略图]
     * @param    {[object]}   canvas  [目标canvas]
     * @param    {[number]}   w       [缩略图宽度]
     * @param    {[number]}   h       [缩略图高度]
     * @param    {[string]}   bgcolor [背景颜色]
     * @return   {[string]}           [转出的base64字符串]
     */
    canvasToImg(canvas, w, h, bgcolor) {
        w = this.toNum(w, 1);
        h = this.toNum(h, 1);
        bgcolor = bgcolor || '#24292D';
        let [imgdata, imgCvs, imgCtx] = [];
        imgCvs = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
        imgCtx = imgCvs.getContext('2d');
        imgCvs.width = w;
        imgCvs.height = h;

        // - 加背景
        imgCtx.fillStyle = bgcolor;
        imgCtx.fillRect(0, 0, w, h);

        // - 计算剪切
        function getScale(w1, h1, w2, h2) {
            let [sx, sy, sw, sh] = [];
            const [k1, k2] = [w1 / w2, h1 / h2];
            if (k1 >= k2) {
                sx = 0; sw = w2;
                sy = (h2 - h1 / k1) / 2; sh = h1 / k1;
            } else {
                sx = (w2 - w1 / k2) / 2; sw = w1 / k2;
                sy = 0; sh = h2;
            }
            return {
                sx, sy, sw, sh
            };
        }

        imgCtx.imageSmoothingQuality = 'high'; // 图片采样平滑度，只有chrome 支持

        const sk = getScale(w, h, canvas.width, canvas.height);
        imgCtx.drawImage(canvas, sk.sx, sk.sy, sk.sw, sk.sh, 0, 0, w, h);

        // imgdata = imgCvs.toDataURL("image/png");
        imgdata = imgCvs.toDataURL('image/jpeg', 1).replace('image/jpeg', 'image/octet-stream');
        return imgdata;
    },

    /**
    * 循环对象
     */
    eachObject(obj, callback) { // 删除  有 loopObject
        const keys = Object.keys(obj);
        keys.forEach((key, index) => {
            if (callback) callback(obj[key], key, index);
        });
    },

    /**
     *c09转换函数, 根据列名对应出其具体的列序号,该函数返回对象, 待优化
    * @param {array} rectId 列名和转换后代码中使用的key, 形如var configs = [{colName:"姓名",key:'name'}],
    * @param {array} cols 数据源返回的列数组\
    * @param {array} data 数据源返回的数据
    * 调用示例
    * var configs = [{colName:"姓名",key:'name'}];
    * self.dataConvert(configs,res.columns,res.data);
    * @return {object} 对象数据:形如[{name:"张三",url:"http://XXX"}]
    */
    dataConvert(configs, cols, data) {
        const map = {};// 每列在data中对应的序号:形如{name:1,url:0}
        for (let j = 0, _l = configs.length; j < _l; j++) {
            for (let i = 0, _len = cols.length; i < _len; i++) {
                if (configs[j].colName === cols[i].name || configs[j].colName === cols[i].title) {
                    const { key } = configs[j];
                    map[key] = i;
                    break;
                }
            }
        }
        const ret = [];
        if (data && data.length) {
            data.forEach((d) => {
                const row = {};
                Object.keys(map).forEach((k) => {
                    row[k] = d[map[k]];
                });
                ret.push(row);
            });
        }

        return ret;
    },

    // 经纬度转三维球面坐标
    lonLatToEarthVector3(lon, lat, radius) {
        const phi = (lat * Math.PI) / 180;
        const theta = ((lon - 180) * Math.PI) / 180;
        const x = -(radius) * Math.cos(phi) * Math.cos(theta);
        const y = (radius) * Math.sin(phi);
        const z = (radius) * Math.cos(phi) * Math.sin(theta);
        return new THREE.Vector3(x, y, z);
    },

    // -根据传入的node结构及其生成的图片生成2*n尺寸图片
    createCanvasTexture(rect, base64, isCenter) {
        const imgWidth = rect.width;
        const imgHeight = rect.height;// 图片的size
        const width = THREE.Math.ceilPowerOfTwo(imgWidth);
        const height = THREE.Math.ceilPowerOfTwo(imgHeight);// 图片的size
        const boundary = {
            minX: 0, maxX: 1, minY: 0, maxY: 1
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
            boundary.maxY = (imgHeight) / height;
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
        textureLoader._nodeWidth = imgWidth;
        textureLoader._nodeHeight = imgHeight;
        textureLoader._width = width;
        textureLoader._height = height;
        textureLoader._boundary = boundary;
        return textureLoader;
    },

    // 获取dom的svg图片
    getScreenCut(dom, isClone, size) {
        if (!dom) return '';
        if (isClone) dom = dom.cloneNode(true);
        return `data:image/svg+xml;charset=utf-8,
            <svg xmlns="http://www.w3.org/2000/svg" 
                width="${(size && size.width) || dom.offsetWidth}" 
                height="${(size && size.height) || dom.offsetHeight}">
                <foreignObject class="box-text" x="0" y="0" width="100%" height="100%">
                ${new XMLSerializer().serializeToString(dom).replace(/#/g, '%23').replace(/\n/g, '%0A')}
                </foreignObject></svg>`;
    },

    /**
     * 根据uv和绘制image的canvas, 获取对应位置的颜色
     * @param {*} canvasDom canvas的dom节点
     * @param {*} uv uv坐标
     */
    getUvPickColor(canvasDom, uv) {
        const x = uv.x * canvasDom.width;
        const y = canvasDom.height - uv.y * canvasDom.height;
        const thisContext = canvasDom.getContext('2d');
        const imageData = thisContext.getImageData(x, y, 1, 1);
        // 获取该点像素数据
        const pixel = imageData.data;
        const r = pixel[0];
        const g = pixel[1];
        const b = pixel[2];
        let a = pixel[3] / 255;
        a = Math.round(a * 100) / 100;
        let rHex = r.toString(16);
        if (r < 16) {
            rHex = `0${rHex}`;
        }
        let gHex = g.toString(16);
        if (g < 16) {
            gHex = `0${gHex}`;
        }
        let bHex = b.toString(16);
        if (b < 16) {
            bHex = `0${bHex}`;
        }
        const rgbaColor = `rgba(${r}, ${g}, ${b},${a})`;
        const rgbColor = `rgb(${r}, ${g}, ${b})`;
        const hexColor = `#${rHex}${gHex}${bHex}`;
        return {
            rgba: rgbaColor,
            rgb: rgbColor,
            hex: hexColor,
            r,
            g,
            b,
            a
        };
    }

};

export default utilsFunction;
