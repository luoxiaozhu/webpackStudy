/**
 * @Author zhoupu 整合utils工具类
 */
import utilsTHREE from './detail/utilsTHREE';
import utilsFunction from './detail/utilsFunction';
import screenCut from './detail/simpleScreenCut';
import Listener from './detail/listrenner';
import geoEtds from './detail/geoEtds';
import TWEEN from './detail/Tween';
import deal from './diff';

// 初始判断是否支持webgl
utilsTHREE.detector();

// 初始化 TWEEN
utilsFunction.initTWEEN(TWEEN);
// 扩展 Easing
utilsFunction.setEasing('Quadratic.OutIn', (k) => {
    k *= 2;
    return (k > 1) ? 0.5 * k * (k - 2) + 1 : 0.5 * k * (2 - k);
});
utilsFunction.setEasing('Cubic.OutIn', (k) => {
    k *= 2;
    return 0.5 * (--k * k * k + 1);
});

// 工具集合
const glUtil = {
    ...utilsTHREE,
    ...utilsFunction,
    screenCut,
    Listener,
    geoEtds
};

// 参数对比工具 diff
deal(glUtil);

/**
 * [getBrowserType 浏览器类别]
 * @Author   ZHOUPU
 * @return   {[string]}   [浏览器类别名称]
 */
function getBrowserType() {
    const ua = window.navigator.userAgent.toLowerCase();
    const [isOpera, isFF, isSafari, isChrome, isEdge, isIE] = [
        ua.match(/opera.([\d.]+)/), // 判断是否Opera浏览器
        ua.match(/firefox\/([\d.]+)/), // 判断是否Firefox浏览器
        ua.match(/version\/([\d.]+).*safari/), // 判断是否Safari浏览器
        ua.match(/chrome\/([\d.]+)/), // 判断Chrome浏览器
        ua.indexOf('edge') > -1, // 判断是否IE的Edge浏览器
        window.document.documentMode
    ];

    if (isOpera) return 'Opera';
    if (isFF) return 'FF';
    if (isSafari) return 'Safari';
    if (isChrome) return 'Chrome';
    if (isEdge) return 'Edge';
    if (isIE) return 'IE';
    return '';
}

glUtil.browserType = getBrowserType();

export default glUtil;
