const path = ''; // 公共资源
const publicPath = ''; // 当前项目资源
const rect_id = 'test1';
const instance = new glInstance({ debugs: true });

window._instance = instance;

// 玻璃
const glass = {
    roughness: 0.1,
    metalness: 0.4,
    clearcoat: 0.4,
    clearcoatRoughness: 0.8
};
// 屋顶
const roof = {
    roughness: 1,
    metalness: 0.1,
    clearcoat: 0.1,
    clearcoatRoughness: 1.5
};

const loaderComp = {
    compType: 'LoaderModel', // 当前组件的名称 用于调用对应的组件

    config: {
        name: 'model1',
        sort: 1, // 当前组件的渲染顺序
        renderOrder: 0, // 当前组件的渲染层级
        order: true, // true 按照顺序加载 false 一起加载
        chassis: {
            radius: 5000,
            position: {
                x: 0,
                y: -50,
                z: 0
            },
            gradient: [
                'rgba(10,13,26,0.5)',
                'rgba(10,13,26,0.0)',
            ]
        }, // 配置底盘显示  装饰作用
        model: [
            {
                url: publicPath + 'yuanqu/chuyuan001.FBX',
                id: 'index_1',
                replaceMaterial: 'MeshPhysicalMaterial', // 是否替换材质
                pick: [], // 拾取的物体  'all' 为所有物体
                bake: [
                    {
                        name: 'DX001',
                        uv2: 'DX001'
                    },
                    {
                        name: 'DX002',
                        uv2: 'DX002'
                    },
                    {
                        name: 'JZ001',
                        uv2: 'JZ001'
                    },
                    {
                        name: 'JZ002',
                        uv2: 'JZ002'
                    },
                    {
                        name: 'JZ003',
                        uv2: 'JZ003'
                    },
                    {
                        name: 'JZ004',
                        uv2: 'JZ004'
                    },
                    {
                        name: 'JZ005',
                        uv2: 'JZ005'
                    },
                ],
                animate: [],
                mesh: [{
                    name: 'water',
                    renderOrder: 1,
                    replace: {
                        name: 'water',
                        speed: 0.3
                    }
                }],
                material: [
                    // 外围白色建筑
                    {
                        name: 'TK',
                        transparent: true,
                        // opacity: 1,
                        color: new THREE.Color('#666'),
                        ...glass
                    },

                    {
                        name: 'CK_001',
                        ...glass
                    },
                    {
                        name: 'CK_006',
                        ...glass
                    },
                    {
                        name: 'CK_008',
                        ...glass
                    },
                    {
                        name: 'CK_009',
                        ...glass
                    },
                    {
                        name: 'chuyuan_007',
                        ...glass
                    },
                    {
                        name: 'Material #2141359202',
                        ...glass
                    },
                    {
                        name: 'chuyuan_007',
                        ...glass
                    },
                    {
                        name: 'chuyuan_009',
                        ...roof
                    },
                    // 路
                    {
                        name: 'Material #200150',
                        ...roof
                    },
                    {
                        name: 'Material #2141356530',
                        side: 0,
                        color: new THREE.Color('rgb(40,50,50)'),
                        opacity: 0.35,
                        metalness: 0.3
                    },
                    {
                        name: 'Material #200150',
                        ...roof
                    },
                    {
                        name: 'Material #200125',
                        ...roof
                    }

                ]
            },
        ]
    },

    endCallBack(group) {
    },
    mounted(group) {
        const scale = 0.0001;
        group.scale.set(scale, scale, scale)
    }
};

const cameraComp = {
    compType: 'CameraAnimate', // 当前组件的名称 用于调用对应的组件
    config: {
        name: 'Path_1', // 当前组件的key值 用于监控当前组件的变化或者事件
        sort: 2,
        renderOrder: 0,
        data: [
            {
                id: 'path_1',
                time: 5000,
                easing: 'Quartic.InOut', // 当前动画的缓动 可以添加导子数据上
                cohesion: false, // 是否衔接当前视角过度
                data: [
                    { "camera": { "x": -1069.83, "y": 141.83, "z": -881.06 }, "target": { "x": -129.05, "y": 0, "z": -101.25 } },
                    { "camera": { "x": -146.85, "y": 35.28, "z": -34.86 }, "target": { "x": -48.64, "y": 0, "z": 68.19 } },


                ]
            },
            {
                id: 'path_2',
                time: 60000,
                easing: 'Quartic.InOut', // 当前动画的缓动 可以添加导子数据上
                cohesion: true, // 是否衔接当前视角过度
                loop: true, // 循环 默认false
                pause: true, // 是否允许暂停， 默认false
                data: [
                    { "camera": { "x": 12.34, "y": 89.25, "z": -405.44 }, "target": { "x": 88.03, "y": 0, "z": -200.13 } },
                    { "camera": { "x": 361.61, "y": 126.35, "z": -252.88 }, "target": { "x": 107.72, "y": 0, "z": -180.13 } },
                    { "camera": { "x": 118.39, "y": 31.01, "z": 31.68 }, "target": { "x": 36.93, "y": 0, "z": 4.86 } },
                    // { "camera": { "x": 114.28, "y": 52.41, "z": 45.02 }, "target": { "x": 8.05, "y": 0, "z": 89.88 } },
                    { "camera": { "x": 226.44, "y": 101.75, "z": 16.58 }, "target": { "x": -22.88, "y": 0, "z": 45.13 } },
                    { type: 'spin', angle: [0, Math.PI * 1.2], speed: 2 },
                    { "camera": { "x": -104.47, "y": 28.27, "z": -29.65 }, "target": { "x": -51.32, "y": 0, "z": 40.66 } },
                    { "camera": { "x": -193.22, "y": 149.63, "z": -284.67 }, "target": { "x": 59.18, "y": 0, "z": -85.25 } }

                    /*  {"camera":{"x":-85.4,"y":4,"z":52.28},"target":{"x":11.38,"y":0,"z":58.15}},
                     {"camera":{"x":48.72,"y":3.24,"z":52.12},"target":{"x":127.06,"y":0,"z":56.87}},
                     {"camera":{"x":249.61,"y":97.03,"z":198.78},"target":{"x":51.09,"y":0,"z":-16.6}},
                     { type: 'spin', angle: [0, Math.PI * 3], speed: 1 }, */
                ]
            },
        ]
    },
    created() {
        /* 生成组件后的生命周期 （在生成效果前） */
        // console.log("created");
    },
    mounted(group) {
        /* 组件创建完成并且效果完成后的回调 */
        console.log("mounted");
    },
    destroyed() {
        /* 当前组件销毁后执行的回调 */
        console.log("destroyed");
    },
    update() {
        /* 当前组件中的mesh发生变化 触发 */
        console.log("update");
    },
    watch(object) {
        /* 当前组件每次修改效果后的回调 增删改 */
        console.log("watch");
    },
    eftEnd() {
        /* console.log("end");
        setTimeout(() => {
            _instance.getComponent({ sort: 4 }).setConfig('show', {
                time: 1600,
                callback: function () {
                    setTimeout(() => {
                        _instance.getComponent({ sort: 4 }).setConfig('hide');
                    }, 3000)
                }
            });
        }, 400) */
    }
};

// const instanceCom1 = {
//     compType: 'InstanceMesh', // 当前组件的名称 用于调用对应的组件
//     config: {
//         name: 'Instance_1', // 当前组件的key值 用于监控当前组件的变化或者事件
//         data: [
//             {
//                 renderOrder: 1,
//                 meshData: {
//                     type: 'data',
//                     data: chuyuanTree.tree1
//                 }, //实例化的数据，可以为模型数据或者是JSON数据
//                 model: {
//                     url: publicPath + 'yuanqu/gaodaguanmu.fbx', // 模型地址
//                 }
//             },
//             {
//                 renderOrder: 1,
//                 meshData: {
//                     type: 'data',
//                     data: chuyuanTree.tree2
//                 }, //实例化的数据，可以为模型数据或者是JSON数据
//                 model: {
//                     url: publicPath + 'yuanqu/guanmu.fbx', // 模型地址
//                 }
//             },
//             {
//                 renderOrder: 1,
//                 meshData: {
//                     type: 'data',
//                     data: chuyuanTree.tree3
//                 }, //实例化的数据，可以为模型数据或者是JSON数据
//                 model: {
//                     url: publicPath + 'yuanqu/ludeng.FBX', // 模型地址
//                 }
//             },
//             {
//                 renderOrder: 1,
//                 meshData: {
//                     type: 'data',
//                     data: chuyuanTree.tree4
//                 }, //实例化的数据，可以为模型数据或者是JSON数据
//                 model: {
//                     url: publicPath + 'yuanqu/qiaomu.FBX', // 模型地址
//                 }
//             },
//             {
//                 renderOrder: 1,
//                 meshData: {
//                     type: 'data',
//                     data: chuyuanTree.tree5
//                 }, //实例化的数据，可以为模型数据或者是JSON数据
//                 model: {
//                     url: publicPath + 'yuanqu/taoshu.FBX', // 模型地址
//                 }
//             },
//             {
//                 renderOrder: 1,
//                 meshData: {
//                     type: 'data',
//                     data: chuyuanTree.tree6
//                 }, //实例化的数据，可以为模型数据或者是JSON数据
//                 model: {
//                     url: publicPath + 'yuanqu/waiweishuqian.FBX', // 模型地址
//                 }
//             },
//             {
//                 renderOrder: 1,
//                 meshData: {
//                     type: 'data',
//                     data: chuyuanTree.tree7
//                 }, //实例化的数据，可以为模型数据或者是JSON数据
//                 model: {
//                     url: publicPath + 'yuanqu/waiweishushen.FBX', // 模型地址
//                 }
//             },
//         ],
//         material: {
//             side: 2,
//             opacity: 1.3,
//             alphaTest: 0.05
//         },
//         rotation: {
//             x: -Math.PI / 2,
//             y: 0,
//             z: 0
//         }
//     },
//     renderOrder: 0, // 当前组件的渲染层级
//     renderSort: 3, // 当前组件的渲染顺序
//     mounted(group) {
//         /* 生成组件后的生命周期 （在生成效果前） */
//         const scale = 0.0001;
//         group.scale.set(scale, scale, scale)
//     }
// }

const switchCmp = {
    compType: 'SwitchAnimate', // 当前组件的名称 用于调用对应的组件
    config: {
        name: 'sw_1',
        sort: 0, // 当前组件的渲染顺序
        start: false,
        earth: {
            radius: 10
        },
        camera: {
            fov: 45,
            near: 2,
            far: 10000,
            position: {
                x: 0,
                y: 0,
                z: 43
            }
        },

        target: {
            x: 0,
            y: 0,
            z: 0
        }, // 中心位置

        showMaps: false,
        isCompEvents: false,
        baseColor: '#004933',
        lightColor: '#B1AC07', // #079FB1
        renderOrder: 1, // 当前组件的渲染层级
    },

    endCallBack() {
        // 地图加载完成
        // instance.setOption('skyCube', { visible: true });

        const com1 = instance.getIns('model1');
        const com2 = instance.getIns('Path_1');
        //const com3 = instance.getIns("Instance_1");
        // const com4 = instance.getComponent({ sort: 4 });

        // com4.dispose();

        const scale = 1;
        com1.group.scale.set(scale, scale, scale);
        //com3.group.scale.set(scale, scale, scale);

        com2.start('path_1', true, () => {
            setTimeout(() => {
                com2.start('path_2');
            }, 1000)
        })

        // setTimeout(() => {
        //     const com5 = instance.getComponent({ sort: 5 });
        //     const com6 = instance.getComponent({ sort: 6 });

        //     com5.setConfig('show');
        //     com6.setConfig('show');
        // }, 300)
    },
    mounted(group) {
        // return;
        /* 组件创建完成并且效果完成后的回调 */

    }
};

const flyerComp = {
    compType: 'FlyerEft', // 当前组件的名称 用于调用对应的组件
    config: {
        name: 'flyer_1', // 当前组件的key值 用于监控当前组件的变化或者事件
        url: path + 'flyers/Stork.glb', // 模型路径
        size: 0.05, // 大小
        width: 8, // 2的n次方，决定数量(width*width)和纹理(dataTxue的大小)
        count: 0.4, // 0 ~ 1, 数量系数

        center: { x: 450, y: 300, z: 0 }, // 效果环绕中心
        radius: 0.7, // 半径系数
        isPrey: true, // 是否鼠标位置影响
        preyRadius: 200, // 鼠标位置影响半径

        // freedom: 0.75, // 自由率
        cohesion: 20, // 凝聚距离
        alignment: 20, // 队列距离
        separation: 20, // 离散距离

        scopeR: { x: 1, y: 0.2, z: 1 } // 效果范围影响系数
    },
    renderOrder: 4, // 当前组件的渲染层级
    renderSort: 5, // 当前组件的渲染顺序
    created() {
        /* 生成组件后的生命周期 （在生成效果前） */
        // console.log("created");
    },
    mounted(group) {
        /* 组件创建完成并且效果完成后的回调 */
        console.log("mounted1");
    },
    destroyed() {
        /* 当前组件销毁后执行的回调 */
        console.log("destroyed");
    },
    update() {
        /* 当前组件中的mesh发生变化 触发 */
        console.log("update");
    },
    watch(object) {
        /* 当前组件每次修改效果后的回调 增删改 */
        console.log("watch");
    },
    eftEnd() {
        console.log("end");
    }
};

const flyerComp2 = {
    compType: 'FlyerEft', // 当前组件的名称 用于调用对应的组件
    config: {
        name: 'flyer_2', // 当前组件的key值 用于监控当前组件的变化或者事件
        url: path + 'flyers/Flamingo.glb', // 模型路径
        size: 0.04, // 大小
        width: 4, // 2的n次方，决定数量(width*width)和纹理(dataTxue的大小)
        count: 0.3, // 0 ~ 1, 数量系数

        center: { x: -200, y: 300, z: 200 }, // 效果环绕中心
        radius: 0.7, // 半径系数
        isPrey: true, // 是否鼠标位置影响
        preyRadius: 200, // 鼠标位置影响半径

        // freedom: 0.75, // 自由率
        cohesion: 20, // 凝聚距离
        alignment: 20, // 队列距离
        separation: 20, // 离散距离

        scopeR: { x: 1, y: 0.2, z: 1 } // 效果范围影响系数
    },
    renderOrder: 4, // 当前组件的渲染层级
    renderSort: 6, // 当前组件的渲染顺序
    created() {
        /* 生成组件后的生命周期 （在生成效果前） */
        // console.log("created");
    },
    mounted(group) {
        /* 组件创建完成并且效果完成后的回调 */
        console.log("mounted2");
    },
    destroyed() {
        /* 当前组件销毁后执行的回调 */
        console.log("destroyed");
    },
    update() {
        /* 当前组件中的mesh发生变化 触发 */
        console.log("update");
    },
    watch(object) {
        /* 当前组件每次修改效果后的回调 增删改 */
        console.log("watch");
    },
    eftEnd() {
        console.log("end");
    }
};

// 初始化
instance.init({
    visible: true, // 设置所有组显示设置  可以设置单个组件的显示隐藏
    sort: true,
    // 基础配置
    render: {
        cts: rect_id, // 容器 dom 或id
        camera: {
            fov: 45,
            near: 2,
            far: 10000,
            position: {
                x: 0,
                y: 0,
                z: 43
            }
        },
        controls: {
            target: {
                x: 0,
                y: 0,
                z: 0
            } // 中心位置
        },
        light: { // 灯光参数
            Ambient: { color: '#FFFFFF', strength: 1.2 }, // 环境光 strength -2
        },
        sky: {
            created: true, // 是否创建
            currentSky: 'test_11', // 初始天空盒对应名称 / null(初始不启动天空盒)
            environment: 'test_11', // 环境贴图
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
    },
    components: [
        switchCmp,
        loaderComp,
        cameraComp,
        //instanceCom1
        // flyerComp,
        // flyerComp2
    ],

    endCallBack() {
        // instance.getComponent({
        //     sort: 4
        // }).start(); // 开始入场 '四川'
        const earth = instance.getIns('sw_1')
        earth.start();
    },
    textures: [{
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
    // 公共资源 
    {
        id: 'DX001',
        url: publicPath + 'yuanqu/DX001.jpg',
        isRepeat: true
    },
    {
        id: 'DX002',
        url: publicPath + 'yuanqu/DX002.jpg',
        isRepeat: true
    },
    {
        id: 'JZ001',
        url: publicPath + 'yuanqu/JZ001.jpg',
        isRepeat: true
    }, {
        id: 'JZ002',
        url: publicPath + 'yuanqu/JZ002.jpg',
        isRepeat: true
    }, {
        id: 'JZ003',
        url: publicPath + 'yuanqu/JZ003.jpg',
        isRepeat: true
    }, {
        id: 'JZ004',
        url: publicPath + 'yuanqu/JZ004.jpg',
        isRepeat: true
    }, {
        id: 'JZ005',
        url: publicPath + 'yuanqu/JZ005.jpg',
        isRepeat: true
    }]
});
