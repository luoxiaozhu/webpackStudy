const path = ''; // 公共资源
const publicPath = ''; // 当前项目资源

const instance = new glInstance({ debugs: true });

window._instance = instance;

const rect_id = 'test1';
const doms = `
        <div id="eft_loading" style="position:absolute;left:0;right:0;bottom:0;top:0;z-index:100;background:#000;">
        <img src= "${path}texture/loading.gif" style="position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);">
        </div>
        <div id="eft_canvas_frame" style="width: 100%; height: 100%;"></div>
    `;
document.querySelector('#' + rect_id).innerHTML = doms;

const loadeComp = {
    compType: 'LoaderModel', // 当前组件的名称 用于调用对应的组件
    config: {
        name: 'model1',
        sort: 1, // 当前组件的渲染顺序
        renderOrder: 0, // 当前组件的渲染层级
        order: false, // true 按照顺序加载 false 一起加载
        chassis: {
            radius: 10000,
            position: {
                x: 0,
                y: -50,
                z: 0
            },
            gradient: [
                'rgba(10,13,26,1)',
                'rgba(10,13,26,0.0)',
            ]
        }, // 配置底盘显示 装饰作用
        model: [{
            url: publicPath + 'shouye/taikang.FBX',
            id: 'index_1',
            replaceMaterial: 'MeshPhysicalMaterial', // 是否替换材质
            pick: [], // 拾取的物体 'all' 为所有物体
            animate: [{
                name: 'Main_Rotor',
                rotation: {
                    z: 8
                }
            }], // 需要控制的动画物体
            bake: [{
                name: 'load',
                uv2: 'loadRay'
            }],
            mesh: [{
                name: 'Glass_02',
                renderOrder: 10
            }, {
                name: 'Glass_01',
                renderOrder: 15
            }, {
                name: 'Box01',
                renderOrder: 1
            }, {
                name: 'Box02',
                renderOrder: 2
            }, {
                name: 'metal',
                renderOrder: 30
            }, {
                name: 'building',
                renderOrder: 0
            }, {
                name: 'light',
                effects: {
                    name: 'riseLine', // 上升效果
                    gap: 30, // 间隔
                    width: 1, // 显示宽度
                    opacity: 0.9,
                    color: new THREE.Color("#a98e5e"),
                    speed: 20
                }
            }],
            material: [{
                name: 'glass05',
                alphaMap: null,
                vertexColors: false,
                roughness: 0.05,
                metalness: 0.4,
                clearcoat: 0.9,
                clearcoatRoughness: 0.1,
                transparent: true,
                side: 2,
                opacity: 0.7,
                color: new THREE.Color("#2C6780"),
                sheen: new THREE.Color("#80A5AD"),
                transmission: 0.05,
                ior: 2.3,
                map: 'box_glass'
            },
            {
                name: 'glass06',
                vertexColors: false,
                roughness: 0.05,
                metalness: 0.4,
                clearcoat: 0.9,
                clearcoatRoughness: 0.1,
                transparent: true,
                opacity: 0.5,
                side: 2,
                color: new THREE.Color("#2C6780"),
                sheen: new THREE.Color("#80A5AD"),
                transmission: 0.05,
                ior: 2.3,
                map: 'box_glass'
            },
            {
                name: 'glass04',
                vertexColors: false,
                roughness: 0.0,
                metalness: 0.5,
                clearcoat: 0.4,
                clearcoatRoughness: 0.05,
                reflectivity: 0.2,
                sheen: new THREE.Color("#80A5AD")
            },
            {
                name: 'glass01',
                roughness: 0.0,
                metalness: 0.5,
                clearcoat: 0.4,
                clearcoatRoughness: 0.05,
                reflectivity: 0.2,
                ior: 1.8,
                sheen: new THREE.Color("#80A5AD")
            },
            {
                name: 'glass02',
                roughness: 0.1,
                metalness: 0.4,
                clearcoat: 0.4,
                clearcoatRoughness: 0.05
            },
            {
                name: 'metal',
                roughness: 0.1,
                metalness: 0.4,
                clearcoat: 0.4,
                clearcoatRoughness: 0.05
            },
            {
                name: 'Material #1734567734',
                roughness: 0.1,
                metalness: 0.4,
                clearcoat: 0.4,
                clearcoatRoughness: 0.05
            },
            {
                name: 'glass03',
                alphaMap: null,
                vertexColors: false,
                roughness: 0.1,
                metalness: 0.1,
                clearcoat: 0.15,
                clearcoatRoughness: 0.1,
                transparent: true
            },
            {
                name: 'tree01',
                side: 2,
                opacity: 1.3,
                // depthWrite: false,
                transparent: true
            },
            {
                name: 'tree02',
                side: 2,
                // depthWrite: false,
                opacity: 1.3,
                transparent: true
            },
            {
                name: 'Material #1734567865',
                alphaMap: null,
                vertexColors: false,
                roughness: 0.5,
                metalness: 0.6,
                clearcoat: 0.3,
                clearcoatRoughness: 0.05,

            },
            {
                name: 'Material #1734568790',
                alphaMap: null,
                vertexColors: false,
                roughness: 0.5,
                metalness: 0.6,
                clearcoat: 0.3,
                clearcoatRoughness: 0.05,
                transparent: true
            },
            {
                name: 'Material #625',
                alphaMap: null,
                vertexColors: false,
                roughness: 0.9,
                metalness: 0.0,
                clearcoat: 0.0,
                clearcoatRoughness: 0.5,
                color: new THREE.Color("#363636")
                // transparent: true
            },
            {
                name: 'load',
                alphaMap: null,
                vertexColors: false,
                roughness: 0.5,
                metalness: 0.1,
                clearcoat: 0.1,
                clearcoatRoughness: 0.7,
                reflectivity: 0.1,
                ior: 1.2,
                // transparent: true
            }, // 地板
            {
                name: 'Material #1734568901.001',
                alphaMap: null,
                vertexColors: false,
                roughness: 0.1,
                metalness: 0.4,
                clearcoat: 0.5,
                clearcoatRoughness: 0.9
                // transparent: true
            }, //飞机
            {
                name: 'water',
                alphaMap: null,
                vertexColors: false,
                roughness: 0.1,
                metalness: 0.3,
                clearcoat: 0.2,
                clearcoatRoughness: 0.4,
                normalMap: 'waternormals',
                bumpMap: 'water',
                color: new THREE.Color('#999'),
                animate: {
                    map: {
                        x: 0.01,
                        y: 0.1
                    }
                }
            }, //水
            {
                name: 'Material #673',
                color: new THREE.Color('#aaa'),
                roughness: 0.1,
                metalness: 0.2,
            }, //水
            ], // 修改材质的属性

        }]
    },
    renderOrder: 0, // 当前组件的渲染层级
    renderSort: 1, // 当前组件的渲染顺序
    created(group) {
        /* 生成组件后的生命周期 （在生成效果前） */
        const scale = 0.0001;
        group.scale.set(scale, scale, scale)
    },
    mounted(group) {
        /* 组件创建完成并且效果完成后的回调 */
        console.log("mounted");

        // 拿到镜头动画组件
        setTimeout(() => {
            instance.getIns('flyPoint').setVisible(true);
        }, 1000)
    },
    destroyed() {
        /* 当前组件销毁后执行的回调 */
        console.log("destroyed");
    },
    update(object) {
        /* 当前组件中的mesh发生变化 触发 */
        // console.log(object);
    },
    watch(object) {
        /* 当前组件每次修改效果后的回调 增删改 */
        console.log("watch");
    }
};

const cameraComp = {
    compType: 'CameraAnimate', // 当前组件的名称 用于调用对应的组件
    id: 'Path_1', // 当前组件的key值 用于监控当前组件的变化或者事件
    config: {
        data: [{
            id: 'path_1',
            time: 5000,
            easing: 'Quartic.InOut', // 当前动画的缓动 可以添加导子数据上
            cohesion: false, // 是否衔接当前视角过度
            data: [
                {
                    "camera": {
                        "x": -2.03,
                        "y": 776.62,
                        "z": 878.88
                    },
                    "target": {
                        "x": -1.99,
                        "y": 120,
                        "z": 51.29
                    }
                },
                {
                    "camera": {
                        "x": -16.02,
                        "y": 477.83,
                        "z": 372.49
                    },
                    "target": {
                        "x": -6.64,
                        "y": 200,
                        "z": 110.35
                    }
                },
                /*{
                "camera": {
                "x": -29.22,
                "y": 387.15,
                "z": 572
                },
                "target": {
                "x": -19.55,
                "y": 200,
                "z": 261.61
                }
                },*/
                {
                    "camera": {
                        "x": -170.29,
                        "y": 289.22,
                        "z": 200.84
                    },
                    "target": {
                        "x": -76.35,
                        "y": 200,
                        "z": 87.88
                    }
                }
            ]
        }]
    },
    renderOrder: 0, // 当前组件的渲染层级
    renderSort: 2, // 当前组件的渲染顺序
    created() {
        /* 生成组件后的生命周期 （在生成效果前） */
        //console.log("created");
    },
    mounted(group) {
        /* 组件创建完成并且效果完成后的回调 */
        //console.log("mounted");
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
    }
};

const FlowsComp = {
    compType: 'FlowsEft',
    id: 'test_Flows',
    renderSort: 3, // 当前组件的渲染顺序
    config: {
        offsetY: 1, // 整体高度偏移
        initTime: 3, // 初始化时间
        lightTime: 2, // 光效周期时长
        effectLen: 1000, // 光效限制长度
        isLight: true, // 是否开启光效
        mtl: {
            width: 3, //宽度
            width: 10, //宽度
            effectRatio: 0.8, // 效果比例参数
            color: 'rgba(204, 204, 255, 0.5)', // 整体颜色
            txue: 'flows', //贴图名称
        },
        colors: [ // 随机颜色数组
            'rgba(40, 255, 11, 0.45)', 'rgba(255, 255, 0, 0.45)', 'rgba(0, 133, 255, 0.45)',
        ],
        data: [
            [
                [-1489, -1317],
                [-1299, -1165],
                [-901, -1031],
                [-538, -902],
                [150, -588],
                [360, -538],
                [886, -505],
                [1835, -479]
            ],
            [
                [-538, -1845],
                [-507, 59],
                [-466, 171],
                [-462, 323],
                [668, 323],
                [1835, 323]
            ],
            [
                [896, -1845],
                [885, -509],
                [876, 325],
                [863, 1036]
            ],
            [
                [-1923, 858],
                [-1408, 825],
                [-1038, 809],
                [-532, 771],
                [334, 711],
                [864, 677],
                [1400, 649],
                [1840, 619]
            ],
            [
                [157, -1335],
                [153, -53],
                [153, 318],
                [556, 327],
                [560, 694]
            ],
            [
                [-1923, -244],
                [-1521, -246],
                [-899, -251],
                [-222, -267],
                [147, -277],
                [886, -282],
                [1272, -291],
                [1352, -282],
                [1432, -255],
                [1569, -239],
                [1837, -219]
            ],
            [
                [-1917, 302],
                [-1410, 316],
                [-563, 319],
                [-556, 486],
                [-529, 607],
                [-540, 1121]
            ],
            [
                [-1513, -1318],
                [-1513, -918],
                [-1513, -380],
                [-1516, 296],
                [-1417, 317],
                [-1409, 332],
                [-1400, 623],
                [-1394,
                    823
                ]
            ],
            [
                [-1047, 129],
                [-1043, -33],
                [-1025, -46],
                [-871, -48],
                [-846, -52],
                [-514, -55],
                [151, -54],
                [479, -49],
                [876, -57]
            ]
        ],
    },
    created(group) {
        const scale = 0.0001;
        group.scale.set(scale, scale, scale)
    }
};

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
                x: 39,
                y: 5,
                z: -19
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

        // const com1 = instance.getIns('model1');
        // const com2 = instance.getIns('Path_1');
        // const com3 = instance.getComponent({ sort: 3 });
        // const com4 = instance.getComponent({ sort: 4 });

        // com4.dispose();

        // const scale = 1;
        // com1.group.scale.set(scale, scale, scale);
        // com3.group.scale.set(scale, scale, scale);

        // com2.start('path_1', true, () => {
        //     setTimeout(() => {
        //         com2.start('path_2');
        //     }, 1000)
        // })

        // setTimeout(() => {
        //     const com5 = instance.getComponent({ sort: 5 });
        //     const com6 = instance.getComponent({ sort: 6 });

        //     com5.setConfig('show');
        //     com6.setConfig('show');
        // }, 300)
    },
    mounted(group) {
        console.log(111)
        // return;
        /* 组件创建完成并且效果完成后的回调 */

    },
    destroyed() {
        /* 当前组件销毁后执行的回调 */
        console.log('destroyed');
    },
    update() {
        /* 当前组件中的mesh发生变化 触发 */
        console.log('update');
    },
    watch(object) {
        /* 当前组件每次修改效果后的回调 增删改 */
        console.log('watch');
    }
};
// fly
const flyCom = {
    compType: 'FlyEffect', // 费县效果
    config: {
        name: 'flyPoint',
        sort: 1,
        order: 1,
        renderOrder: 120,

        visible: false,
        dpi: 2,
        color: '#2E5E72',
        point: 'flows',
        speed: 55,
        range: 60,
        size: 15,
        data: [
            {
                data: [
                    {
                        "x": -27.887023999507278,
                        "y": -0.0003833770751724419,
                        "z": 25.079606985711745
                    },
                    {
                        "x": -30.329585753818275,
                        "y": 211.77419743334457,
                        "z": 27.68833060967063
                    }
                ]
            },
            {
                data: [
                    {
                        "x": 22.991449819183103,
                        "y": 16.893801545388413,
                        "z": 28.093844059127285
                    },
                    {
                        "x": 25.655977335590244,
                        "y": 211.29613188508097,
                        "z": 28.751035593478903
                    }
                ]
            },
            {
                data: [
                    {
                        "x": 23.13685386187191,
                        "y": 16.86800379737292,
                        "z": -25.620747043437724
                    },
                    {
                        "x": 25.64083846638247,
                        "y": 211.77440643310547,
                        "z": -28.15838677741541
                    }
                ]
            },
            {
                data: [
                    {
                        "x": -27.832019831914785,
                        "y": 16.819566835122743,
                        "z": -25.866643069244375
                    },
                    {
                        "x": -30.24061736264604,
                        "y": 211.7222237861739,
                        "z": -28.391853758847148
                    }
                ]
            }
        ]
    },
    created(group) {
        const scale = 0.0001;
        group.scale.set(scale, scale, scale)
    }
}
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
                x: -1.55,
                y: 530.98,
                z: 530.86
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
        loadeComp,
        // cameraComp,
        //     glowsComp,
        // htMapComp,
        flyCom,
        // FlowsComp,
        switchCmp
    ],
    endCallBack() {
        // instance.getComponent({
        //     sort: 4
        // }).start(); // 开始入场 '四川'
        const earth = instance.getIns('sw_1')
        earth.start();
        console.log(earth);
    },
    textures: [{
        id: 'waternormals',
        url: path + 'texture/waternormals.jpg',
        isRepeat: true
    }, {
        id: 'water',
        url: path + 'texture/water.jpg',
        isRepeat: true
    }, {
        id: 'flows',
        url: path + 'particle/smokeparticle1.png'
    }, {
        id: 'box_glass',
        url: path + 'texture/box_glass.png',
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
    // 首页资源
    {
        id: 'loadRay',
        url: publicPath + 'shouye/loadVRay.jpg',
        isRepeat: true
    }]
});




// 判断用于代码注入
if (typeof jQuery !== 'undefined') {
    const _element = $("#" + rect_id).widget();
    $(_element).on("$destroy", function () {
        // 销毁
        instance.dispose();
    });
}
