/*
 * @Author: Duke
 * @Date: 2021-08-11 09:12:47
 * @LastEditors: Duke
 * @LastEditTime: 2021-08-16 10:10:03
 * @Description: file content
 */
import '../../editorgl/libs/index';
import glInstance from '../../editorgl/glInstance';
// 树信息
import '../data/index'

window.glInstance = glInstance;

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

let name = getQueryVariable('name') || 'wlksh';
// 大清谷
if (name) {
    require('../index_bak/' + name);
}