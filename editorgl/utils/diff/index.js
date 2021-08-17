/**
* @Author TangChengchuan
* @Date 2019/12/18
* @Description diff监听部分代码
*/
import Diff from './diff';

export default function deal(util) {
    const diff = new Diff(util);
    util._setDiff = function (target, callback) {
        return diff.bind(target, callback);
    };
    // 销毁工厂
    util._disposeDiff = (isClear) => {
        if (diff.dispose) diff.dispose(isClear);
    };
}
