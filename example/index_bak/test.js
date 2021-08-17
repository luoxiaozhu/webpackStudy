const path = ''; // 公共资源
const publicPath = ''; // 当前项目资源
const rect_id = 'test1';

const instance = new glInstance({ debugs: false });
window._instance = instance;

// 底面反射效果
const testComp = {
    compType: 'SubFaceEft', // 组件类别名称
    config: {
        name: 'test_1', // 组件名称，查找组件
        sort: 1, // 组件序号，组件按序号大小加载，默认0, 越大越后加载
        isCompEvents: false, // 是否开启组件事件，渲染器上影响所有组件
        renderOrder: 1, // 组件基础渲染层级


    },
    mounted(val) { // 效果完成
        console.log('----------mounted------', val);
    }
};

// 飞鸟效果
const testComp2 = {
    compType: 'FlyerEft', // 组件类别名称
    config: {
        name: 'test_2', // 组件名称，查找组件
        sort: 2, // 组件序号，组件按序号大小加载，默认0, 越大越后加载
        renderOrder: 2, // 组件基础渲染层级

        url: path + 'flyers/Stork.glb', // 模型路径
        size: 0.05, // 大小
        width: 8, // 2的n次方，决定数量(width*width)和纹理(dataTxue的大小)
        count: 0.4, // 0 ~ 1, 数量系数
        isShow: false, // 初始显示隐藏

        center: { x: 0, y: 310, z: 0 }, // 效果环绕中心
        radius: 0.7, // 半径系数
        isPrey: true, // 是否鼠标位置影响
        preyRadius: 200, // 鼠标位置影响半径

        // freedom: 0.75, // 自由率
        cohesion: 20, // 凝聚距离
        alignment: 20, // 队列距离
        separation: 20, // 离散距离

        scopeR: { x: 1, y: 0.2, z: 1 }, // 效果范围影响系数
    },
    mounted(val) { // 效果完成
        console.log('----------mounted------', val);
    }
};

// 围栏光效
const testComp3 = {
    compType: 'FencesEft', // 组件类别名称
    config: {
        name: 'test_3', // 组件名称，查找组件
        // sort: 0, // 组件序号，组件按序号大小加载，默认0, 越大越后加载
        renderOrder: 1, // 组件基础渲染层级

        fire: [
            {
                points: [[0, 310, 0]], // 位置
                radius: 50, // 半径
                height: 600,// 高度
                seg: 5, // 边数
                color: '#ff0000' // 颜色
            }
        ]
    },
    mounted(val) { // 效果完成
        console.log('----------mounted------', val);
    }
};

// 测试模板
const testComp4 = {
    compType: 'TestingEft', // 组件类别名称
    config: {
        name: 'test_4', // 组件名称，查找组件
        // sort: 0, // 组件序号，组件按序号大小加载，默认0, 越大越后加载
        gridHelper: true, // 是否显示辅助网格
        renderOrder: 1, // 组件基础渲染层级
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
            near: 2, position: { x: 300, y: 200, z: 400 }
        },
        controls: {
            target: { x: 0, y: 0, z: 0 } // 中心位置
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
        testComp,
        testComp2,
        testComp3,
        testComp4
    ],
    endCallBack() { // 所有加载完成回调
        console.log('----------endCallBack-----');
        testing();
    },
    textures: [ // 纹理加载
        {
            id: 'waternormals',
            url: path + 'texture/waternormals.jpg',
            isRepeat: true,
            repeat: { x: 10, y: 10 }
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

// ----接口测试
const testing = () => {
    // instance.on('renderer', 'onMouseMove', () => {
    //     console.log('------renderer-----onMouseMove-----');
    // });

    instance.on('renderer', 'onDblClick', (...arg) => {
        console.log('------renderer-----onDblClick-----', ...arg);
    });

    instance.on('test_1', 'onMouseDown', (...arg) => {
        console.log('------test_2-----onMouseDown-----', ...arg);
    });

    console.log('---', instance.getOption('renderer', 'camera'));

    setTimeout(() => {
        instance.setOption('renderer', 'restore'); // 视觉还原
    }, 5 * 1000);

    instance.setOption('test_2', 'show'); // 飞鸟显示
};
