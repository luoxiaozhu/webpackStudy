const path = ''; // 公共资源
const publicPath = ""; // 当前项目资源
const rect_id = 'test1';
import pointData from '../data/pointMockLongLife.json';
import { dataDivide } from './dataDivide';
const instance = new glInstance({ debugs: true });
window._instance = instance;

const earthComp = {
    compType: 'EarthGlobal', // 组件类别名称
    config: {
        name: 'earthGlobal', // 组件名称，查找组件
        earthImage: publicPath + '/wlksh3D/earthBaseMap.jpg',
        radius: 120, // 球半径
        // sort: 1, // 组件序号，组件按序号大小加载，默认0, 越大越后加载
        hasGlow: false, // 还有问题
        glowTxueId: 'earthGlowImg',
        glowColor: '#33CCFF',
        gridHelper: false, // 是否显示辅助网格
        renderOrder: 1, // 组件基础渲染层级
        isCompEvents: false, // 是否开启组件事件，渲染器上影响所有组件
    },
    mounted(val) { // 效果完成
        console.log('----------mounted------', val);
    }
};

const earthCompChina = {
    compType: 'ShaderEarthGlobal', // 组件类别名称 EarthGlobal ShaderEarthGlobal
    config: {
        name: 'earthGlobalChina', // 组件名称，查找组件
        earthImage: publicPath + '/wlksh3D/earthBaseMap1.png',
        radius: 120, // 球半径
        // sort: 2, // 组件序号，组件按序号大小加载，默认0, 越大越后加载
        hasGlow: false,
        isCompEvents: true, // 是否开启组件事件，渲染器上影响所有组件
        gridHelper: false, // 是否显示辅助网格
        renderOrder: 2, // 组件基础渲染层级
        distMap: {
            '#ffc325': {
                name: '北部',
                "camera":{"x":-51.17,"y":134.61,"z":-120.65},"target":{"x":0,"y":0,"z":0}
            },
            '#25b9ff': {
                name: '西部',
                "camera":{"x":-0.77,"y":128.16,"z":-164.45},"target":{"x":0,"y":0,"z":0}
            },
            '#a864ff': {
                name: '中部',
                "camera":{"x":-58.88,"y":97.09,"z":-124.96},"target":{"x":0,"y":0,"z":0}
            },
            '#00ffcd': {
                name: '南部',
                "camera":{"x":-44.5,"y":68.96,"z":-147.61},"target":{"x":0,"y":0,"z":0}
            },
            '#fa9e9e': {
                name: '东部',
                "camera":{"x":-72.16,"y":81.21,"z":-129.32},"target":{"x":0,"y":0,"z":0}
            }
        }
    },
    mounted(val) { // 效果完成
        console.log('----------mounted------', val);
    }
};

let divideDatas = dataDivide('类型', ['在建', '纪念园'], pointData);
console.log('divideDatas', divideDatas);
// divideDatas.forEach(function(d, idx) {
//     ins.setPoints(colConfig, d, longLifelayerConfig[idx]);
// });

const storagePointLayer = {
    compType: 'EarthPointLayer', // 组件类别名称
    config: {
        name: 'storagePointLayer', // 组件名称，查找组件
        // sort: 3, // 组件序号，组件按序号大小加载，默认0, 越大越后加载
        renderOrder: 3, // 组件基础渲染层级
        isCompEvents: false, // 是否开启组件事件，渲染器上影响所有组件
        radius: 122,
        colConfig: [{colName:"名称",key:'name'},
            {colName:"经度",key:'lng'},
            {colName:"纬度",key:'lat'},
            {colName:"类型",key:'type'},
            {colName:"战区",key:'dist'}],
        pointData: divideDatas[0],
        tags: { // 标注文字
            show: true,  // 是否显示标注上的文字
            fontSize: 30, // 标注文字大小
            startColor: '#ffffff', // 标注文字渐变开始颜色
            fontWeight: 'bold', // 是否加粗
            endColor: '#ffffff', // 渐变结束颜色
            // width: 100,  // 多行显示时的宽度
            scaleRate: 0.08, // 缩放的比率
            pos: [0.3, 3.5, 1] // 相对于图标的位置
        },
        point: { // 标注图片
            size: 6, // 图片大小
            pointImageType: 'fix', // 图片类型 fix 使用pointDefaultImage的图片,  name 图片跟随标注名称
            pointPath: publicPath + '/wlksh3D/', // 图片跟随标注名称是的路径
            pointDefaultImage: publicPath + '/wlksh3D/storagePoint.png', // 标点图片
            // bounceSpeed: 0.004,
            // bounceDistance: 0.2
        }

    },
    mounted(val) { // 效果完成
        console.log('----------mounted------', val);
    }
};

const compPointLayer = {
    compType: 'EarthPointLayer', // 组件类别名称
    config: {
        name: 'compPointLayer', // 组件名称，查找组件
        // sort: 3, // 组件序号，组件按序号大小加载，默认0, 越大越后加载
        renderOrder: 4, // 组件基础渲染层级
        isCompEvents: false, // 是否开启组件事件，渲染器上影响所有组件
        radius: 122,
        colConfig: [{colName:"名称",key:'name'},
            {colName:"经度",key:'lng'},
            {colName:"纬度",key:'lat'},
            {colName:"类型",key:'type'},
            {colName:"战区",key:'dist'}],
        pointData: divideDatas[2],
        tags: { // 标注文字
            show: true,  // 是否显示标注上的文字
            fontSize: 30, // 标注文字大小
            startColor: '#ffffff', // 标注文字渐变开始颜色
            fontWeight: 'bold', // 是否加粗
            endColor: '#FFDF25', // 渐变结束颜色
            // width: 100,  // 多行显示时的宽度
            scaleRate: 0.08, // 缩放的比率
            pos: [0.3, 3.5  , 1] // 相对于图标的位置
        },
        point: { // 标注图片
            size: 6, // 图片大小
            pointImageType: 'fix', // 图片类型 fix 使用pointDefaultImage的图片,  name 图片跟随标注名称
            pointPath: publicPath + '/wlksh3D/', // 图片跟随标注名称是的路径
            pointDefaultImage: publicPath + '/wlksh3D/compPoint.png', // 标点图片
            // bounceSpeed: 0.004,
            // bounceDistance: 0.2
        }

    },
    mounted(val) { // 效果完成
        console.log('----------mounted------', val);
    }
};


// 初始化
instance.init({
    render: { // 渲染器
        cts: rect_id, // 容器 dom 或id
        camera: {
            near: 2, position: { x: -57.98, y: 215.32, z: -276.16 }
        },
        controls: {
            target: { x: 0, y: 0, z: 0 }, // 中心位置
            params: {
                enablePan: false, // 是否平移
                enableZoom: false, // 是否缩放
                enableRotate: true, // 是否旋转
            }
        },
        light: { // 灯光参数
            Ambient: { color: '#FFFFFF', strength: 1.2 }, // 环境光 strength -2
        },
        sky: {
            created: true, // 是否创建
            currentSky: 'test_11', // 初始天空盒对应名称 / null(初始不启动天空盒)
            environment: 'type_2', // 环境贴图
            hdr: [
                {
                    id: 'test_11',
                    url: 'texture/basic.hdr'
                },
                {
                    id: 'test_222',
                    url: 'texture/quarry_01_1k.hdr'
                }
            ]
        },
        loading: { // loading效果
            created: true, // 是否创建
            url: path + 'texture/loading.gif'
        },

        beforeInit(...arg) {
            console.log('----------beforeInit-----');
        }
    },
    components: [ // 组件效果
        earthComp,
        earthCompChina,
        storagePointLayer,
        compPointLayer
    ],
    endCallBack() { // 所有加载完成回调
        console.log('----------endCallBack-----');
        testing();
    },
    textures: [ // 纹理加载
        {
            id: 'earthGlowImg',
            url: path + 'wlksh3D/earthAllglow.png', // 地图边缘光晕图片
            isRepeat: false
        }, {
            id: 'watert',
            url: path + 'texture/watert.jpg',
            isRepeat: true,
            repeat: { x: 10, y: 10 }
        }, {
            id: 'water',
            url: path + 'texture/water.jpg',
            isRepeat: true
        }, {
            id: 'em_color',
            url: path + 'em/color.jpg'
        }, {
            id: 'em_normal',
            url: path + 'em/normal.jpg'
        }, {
            id: 'em_aomap',
            url: path + 'em/aomap.jpg'
        }, {
            id: 'em_display',
            url: path + 'em/display.jpg'
        }, {
            id: 'em_cloud',
            url: path + 'em/cloud.png'
        },

        {
            id: 'type_2',
            type: 'cube',
            url: [
                path + 'texture/skyboxsun25deg/px.jpg',
                path + 'texture/skyboxsun25deg/nx.jpg',
                path + 'texture/skyboxsun25deg/py.jpg',
                path + 'texture/skyboxsun25deg/ny.jpg',
                path + 'texture/skyboxsun25deg/pz.jpg',
                path + 'texture/skyboxsun25deg/nz.jpg',
            ]
        },
        {
            id: 'type_3',
            type: 'cube',
            url: [
                path + 'texture/MilkyWay/px.jpg',
                path + 'texture/MilkyWay/nx.jpg',
                path + 'texture/MilkyWay/py.jpg',
                path + 'texture/MilkyWay/ny.jpg',
                path + 'texture/MilkyWay/pz.jpg',
                path + 'texture/MilkyWay/nz.jpg',
            ]
        }
    ]
});

window.test = instance;

// 隐藏其他战区的point
function hideOtherDistPoint(topObj, dist) {
    let objs = topObj.group.children[0].children;
    objs.forEach((obj) => {
        if (obj.children[0].userData.dist !== dist) {
            obj.visible = false;
        } else {
            obj.visible = true;
        }
    });
}
// ----接口测试
const testing = () => {
    // instance.on('renderer', 'onMouseMove', (...arg) => {
    //     console.log('------renderer-----onMouseMove-----');
    // });
    let curLevel = 1;
    instance.on('earthGlobalChina', 'onClick', (event, dist, color) => {
        if (!color) {
            return;
        }
        const compOjb = instance.getIns('compPointLayer');
        hideOtherDistPoint(compOjb, dist);
        const storageObj = instance.getIns('storagePointLayer');
        hideOtherDistPoint(storageObj, dist);
        curLevel = 2;
        // 传出级数到文本框
    });
    
    // 仓库标注点击
    instance.on('storagePointLayer', 'onClick', (event, compName, pointName) => {
        if (compName !== 'storagePointLayer') {
            return;
        }
        if (curLevel <= 1) {
            // 传值到文本框
            return;
        }
        // 原有逻辑
        console.log('storagePointLayer onClick', event, pointName);
    });

    // 中心标注点击
    instance.on('compPointLayer', 'onClick', (event, compName, pointName) => {
        if (compName !== 'compPointLayer') {
            return;
        }
        if (curLevel <= 1) {
            // 传值到文本框
            return;
        }
        // 原有逻辑
        console.log('compPointLayer onClick', event, pointName);
    });

    // 鼠标移入仓库标注
    instance.on('storagePointLayer', 'onMouseIn', (event, compName, pointName) => {
        if (compName !== 'storagePointLayer') {
            return;
        }
        // console.log('storagePointLayer onMouseIn', event, pointName);
    });

    // 鼠标移入中心标注
    instance.on('compPointLayer', 'onMouseIn', (event, compName, pointName) => {
        if (compName !== 'compPointLayer') {
            return;
        }
        // console.log('compPointLayer onMouseIn', event, pointName);
    });

    // 鼠标移出仓库标注
    instance.on('storagePointLayer', 'onMouseOut', (event, compName, pointName) => {
        if (compName !== 'storagePointLayer') {
            return;
        }
        // console.log('storagePointLayer onMouseOut', event, pointName);
    });

    // 鼠标移出中心标注
    instance.on('compPointLayer', 'onMouseOut', (event, compName, pointName) => {
        if (compName !== 'compPointLayer') {
            return;
        }
        // console.log('compPointLayer onMouseOut', event, pointName);
    });

    // console.log('---', instance.getOption('renderer', 'camera'));
};

// 2秒后设置标注图层
setTimeout(() => {
    // instance.setOption('renderer', 'restore');
    // let colConfig = [{colName:"名称",key:'name'},
    //     {colName:"经度",key:'lng'},
    //     {colName:"纬度",key:'lat'},
    //     {colName:"类型",key:'type'}];
    // let divideDatas = dataDivide('类型', ['在建', '纪念园'], pointData);
    // divideDatas.forEach(function(d, idx) {
    //     ins.setPoints(colConfig, d, longLifelayerConfig[idx]);
    // });
}, 2 * 1000);