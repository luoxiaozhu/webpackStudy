const path = ''; // 公共资源
const publicPath = ''; // 当前项目资源
const timeOutArray = [];

let instance = new glInstance();

window._instance = instance;

const rect_id = 'test1';
const doms = `
        <div id="eft_loading" style="position:absolute;left:0;right:0;bottom:0;top:0;z-index:100;background:#000;">
        <img src= "${path}texture/loading.gif" style="position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);">
        </div>
        <div id="eft_canvas_frame" style="width: 100%; height: 100%;"></div>
    `;
document.querySelector('#' + rect_id).innerHTML = doms;

// 玻璃
const glass = {
    roughness: 0.1,
    metalness: 0.2,
    clearcoat: 0.7,
    clearcoatRoughness: 0.5,
    side: 2,
    sheen: new THREE.Color("#ffe08a")
};
// 屋顶
const roof = {
    roughness: 1,
    metalness: 0.1,
    clearcoat: 0.1,
    clearcoatRoughness: 1.5
};

const loadeComp = {
    compType:'LoaderModel', // 当前组件的名称 用于调用对应的组件
    id: 'model1', // 当前组件的key值 用于监控当前组件的变化或者事件
    config: {
        order: false, // true 按照顺序加载 false 一起加载
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
        model: [{
            url: publicPath + 'daqinggu/DQG_01.FBX',
            id: 'index_1',
            replaceMaterial: 'MeshPhysicalMaterial', // 是否替换材质
            pick: [], // 拾取的物体  'all' 为所有物体
            bake: [{
                name: 'DQG_DX01',
                uv2: 'DQG_DX01'
            },
            {
                name: 'DQG_DX02',
                uv2: 'DQG_DX02'
            },
            {
                name: 'DQG_JZ001',
                uv2: 'DQG_JZ001'
            },
            {
                name: 'DQG_JZ002',
                uv2: 'DQG_JZ002'
            },
            {
                name: 'DQG_XP',
                uv2: 'DQG_XP'
            }
            ],
            animate: [],
            mesh: [{
                name: 'DQG_water',
                renderOrder: 1,
                replace: {
                    name: 'water',
                    speed: 0.3,
                    waterColor: '#317f96'
                }
            }],
            material: [
                {
                    name: 'TK_langan_003_alpha',
                    side: 2,
                    roughness: 0.1,
                    metalness: 0.3,
                    clearcoat: 0.3,
                    clearcoatRoughness: 0.8,
                    opacity: 1.1
                },
                {
                    name: 'TK_BY_003_alpha',
                    side: 2,
                    roughness: 0.1,
                    metalness: 0.3,
                    clearcoat: 0.3,
                    alphaMap: null,
                    clearcoatRoughness: 0.8
                },
                {
                    name: 'TK_CK042',
                    roughness: 0.1,
                    metalness: 0.5,
                    clearcoat: 0.5,
                    clearcoatRoughness: 0.8
                },
                {
                    name: 'TK_CK006',
                    ...glass
                },
                {
                    name: 'TK_CK026',
                    ...glass
                },
                {
                    name: 'TK_CK001',
                    ...glass
                },
                {
                    name: 'TK_CK005',
                    ...glass
                },
                {
                    name: 'TK_CK019',
                    ...glass
                },
                {
                    name: 'TK_boli003',
                    ...glass
                },
                {
                    name: 'TK_CK014',
                    ...glass,
                    transmission: 0.7
                },
                {
                    name: 'TK_roof_009',
                    roughness: 0.7,
                    metalness: 0.4,
                    clearcoat: 0.4,
                    clearcoatRoughness: 0.8
                },
                {
                    name: 'TK_roof_004',
                    roughness: 1,
                    metalness: 0.15,
                    clearcoat: 0.4,
                    clearcoatRoughness: 1

                },
                {
                    name: 'Material #9432',
                    color: new THREE.Color('#E09458'),
                    roughness: 1,
                    metalness: 0.25,
                    clearcoat: 0.4,
                    clearcoatRoughness: 0.4

                }, // 周围box
            ]
        },

        ]
    },
    renderOrder: 0, // 当前组件的渲染层级
    renderSort: 1, // 当前组件的渲染顺序
    created(group) {
        /* 生成组件后的生命周期 （在生成效果前） */
        // console.log("created");
        const scale = 0.0001;
        group.scale.set(scale, scale, scale)
    },
    mounted(group) {
        /* 组件创建完成并且效果完成后的回调 */
        // console.log("mounted");
        // const com1 = instance.getComponent({ sort: 1 });
        // com1.setVisible(false);
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
    compType:'CameraAnimate', // 当前组件的名称 用于调用对应的组件
    id: 'Path_1', // 当前组件的key值 用于监控当前组件的变化或者事件
    config: {
        data: [{
            id: 'path_1',
            time: 5000,
            easing: 'Quartic.InOut', // 当前动画的缓动 可以添加导子数据上
            cohesion: false, // 是否衔接当前视角过度
            data: [{
                camera: { x: 127.88, y: 130.87, z: 807.11 },
                target: { x: -72.95, y: -0, z: 334.56 }
            },
            {
                camera: { x: -59.69, y: 26.64, z: 241.06 },
                target: { x: -128.56, y: 0, z: 150.31 }
            }]
        },
        {
            id: 'path_2',
            time: 60000,
            easing: 'Quartic.InOut', // 当前动画的缓动 可以添加导子数据上
            cohesion: true, // 是否衔接当前视角过度
            loop: true, // 循环 默认false
            pause: true, // 是否允许暂停， 默认false
            data: [
                {
                    camera: { x: -76.64, y: 70.99, z: 46.03 },
                    target: { x: -149.36, y: -0, z: -58.85 }
                },
                {
                    camera: { x: -120.31, y: 50.43, z: -270.63 },
                    target: { x: -181.59, y: -0, z: -148.04 }
                },
                {
                    camera: { x: -285.38, y: 48.8, z: 22.05 },
                    target: { x: -187.09, y: -0, z: -45.3 }
                }, {
                    camera: { x: -262.19, y: 101.76, z: 246.76 },
                    target: { x: -127.77, y: 0, z: 98.25 }
                },
                {
                    camera: { x: -28.57, y: 50.2, z: 273.73 },
                    target: { x: -143.6, y: -0, z: 110.11 }
                }


            ]
        },
        ]
    },
    renderOrder: 0, // 当前组件的渲染层级
    renderSort: 2, // 当前组件的渲染顺序
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

const instanceCom1 = {
    compType:'InstanceMesh', // 当前组件的名称 用于调用对应的组件
    id: 'Instance_1', // 当前组件的key值 用于监控当前组件的变化或者事件
    config: {
        replaceMaterial: 'MeshPhysicalMaterial',
        data: [{
            renderOrder: 1,
            meshData: {
                type: 'data',
                data: daqingguTree.tree_a
            }, //实例化的数据，可以为模型数据或者是JSON数据
            model: {
                url: publicPath + 'daqinggu/tree_a.FBX', // 模型地址
                // dark: true
                scale: 0.8
            }
        },
        {
            renderOrder: 1,
            meshData: {
                type: 'data',
                data: daqingguTree.tree_b
            }, //实例化的数据，可以为模型数据或者是JSON数据
            model: {
                url: publicPath + 'daqinggu/tree_b.FBX', // 模型地址
                // dark: true,
                scale: 0.8
            }
        },
        {
            renderOrder: 1,
            meshData: {
                type: 'data',
                data: daqingguTree.tree_c
            }, //实例化的数据，可以为模型数据或者是JSON数据
            model: {
                url: publicPath + 'daqinggu/tree_c.FBX', // 模型地址
                // dark: true
                scale: 0.8
            }
        },
        {
            renderOrder: 1,
            meshData: {
                type: 'data',
                data: daqingguTree.tree_d
            }, //实例化的数据，可以为模型数据或者是JSON数据
            model: {
                url: publicPath + 'daqinggu/tree_d.FBX', // 模型地址
                // dark: true,
                scale: 0.8,
                randomRotate: {
                    z: Math.PI * 2
                },
            }
        },
        {
            renderOrder: 1,
            meshData: {
                type: 'data',
                data: daqingguTree.tree_e
            }, //实例化的数据，可以为模型数据或者是JSON数据
            model: {
                url: publicPath + 'daqinggu/tree_e.FBX', // 模型地址
                // dark: true,
                scale: 0.8,
                randomRotate: {
                    z: Math.PI * 2
                },
            }
        },
        {
            renderOrder: 1,
            meshData: {
                type: 'data',
                data: daqingguTree.tree_f
            }, //实例化的数据，可以为模型数据或者是JSON数据
            model: {
                url: publicPath + 'daqinggu/tree_f.FBX', // 模型地址
                // dark: true,
                scale: 0.8,
                randomRotate: {
                    z: Math.PI * 2
                },
            }
        },
        /*  {
             renderOrder: 1,
             meshData: {
                 type: 'data',
                 data: daqingguTree.tree_g
             }, //实例化的数据，可以为模型数据或者是JSON数据
             model: {
                 url: publicPath + 'daqinggu/tree_g.FBX', // 模型地址
                 // dark: true,
                 randomRotate: {
                     z: Math.PI * 2
                 },
             },
 
         }, */
        {
            renderOrder: 1,
            meshData: {
                type: 'data',
                data: daqingguTree.tree_h
            }, //实例化的数据，可以为模型数据或者是JSON数据
            model: {
                url: publicPath + 'daqinggu/tree_h.FBX', // 模型地址
                // dark: true,
                randomRotate: {
                    z: Math.PI * 2
                },
                colors: [
                    '#E6A888',
                    '#999999',
                    '#aaaaaa',
                    '#eeeeee',
                    '#262813',
                    '#ffe66d',
                ],
            }
        },
        ],
        material: {
            side: 2,
            opacity: 1.0,
            alphaTest: 0.3,
            transparent: true,
            vertexColors: false,
            roughness: 1,
            metalness: 0.1,
            clearcoat: 0.2,
            clearcoatRoughness: 1
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    renderOrder: 0, // 当前组件的渲染层级
    renderSort: 3, // 当前组件的渲染顺序
    created(group) {
        /* 生成组件后的生命周期 （在生成效果前） */
        const scale = 0.0001;
        group.scale.set(scale, scale, scale)
    },
    mounted(group) {
        /* 组件创建完成并且效果完成后的回调 */
        //console.log("mounted");
        // const com1 = instance.getComponent({ sort: 3 });
        // com1.setVisible(false);
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
}

const switchCmp = {
    compType:'SwitchAnimate', // 当前组件的名称 用于调用对应的组件
    id: 'sw_1', // 当前组件的key值 用于监控当前组件的变化或者事件
    visible: true,
    config: {
        start: false,
        earth: {
            radius: 10
        },
        showMaps: false,
        baseColor: '#004933',
        lightColor: '#B1AC07', // #079FB1
    },
    renderOrder: 0, // 当前组件的渲染层级
    renderSort: 4, // 当前组件的渲染顺序

    created() {
        /* 生成组件后的生命周期 （在生成效果前） */
        //console.log('created');
    },
    mounted(group) {
        // return;
        /* 组件创建完成并且效果完成后的回调 */
        instance.setOption('skyCube', {
            visible: true
        });

        const com1 = instance.getComponent({
            sort: 1
        });
        const com2 = instance.getComponent({
            sort: 2
        });
        const com3 = instance.getComponent({
            sort: 3
        });
        const com4 = instance.getComponent({
            sort: 4
        });

        com4.dispose();
        /* com1.setVisible(true)
        com3.setVisible(true) */
        /* com1.group.visible = true;
        com3.group.visible = true; */
        const scale = 1;
        com1.group.scale.set(scale, scale, scale);
        com3.group.scale.set(scale, scale, scale);

        com2.start('path_1').then(res => {
            timeOutArray[0] = setTimeout(() => {
                com2.start('path_2');
            }, 1000)
        });

        timeOutArray[1] = setTimeout(() => {
            const com5 = instance.getComponent({
                sort: 5
            });
            const com6 = instance.getComponent({
                sort: 6
            });

            com5.setConfig('show');
            com6.setConfig('show');
        }, 300)
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

const flyerComp = {
    compType:'FlyerEft', // 当前组件的名称 用于调用对应的组件
    id: 'flyer_1', // 当前组件的key值 用于监控当前组件的变化或者事件
    config: {
        url: path + 'flyers/Stork.glb', // 模型路径
        size: 0.05, // 大小
        width: 8, // 2的n次方，决定数量(width*width)和纹理(dataTxue的大小)
        count: 0.4, // 0 ~ 1, 数量系数

        center: {
            x: 450,
            y: 700,
            z: 0
        }, // 效果环绕中心
        radius: 0.7, // 半径系数
        isPrey: true, // 是否鼠标位置影响
        preyRadius: 200, // 鼠标位置影响半径

        // freedom: 0.75, // 自由率
        cohesion: 20, // 凝聚距离
        alignment: 20, // 队列距离
        separation: 20, // 离散距离

        scopeR: {
            x: 1,
            y: 0.2,
            z: 1
        } // 效果范围影响系数
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
    compType:'FlyerEft', // 当前组件的名称 用于调用对应的组件
    id: 'flyer_2', // 当前组件的key值 用于监控当前组件的变化或者事件
    config: {
        url: path + 'flyers/Flamingo.glb', // 模型路径
        size: 0.04, // 大小
        width: 4, // 2的n次方，决定数量(width*width)和纹理(dataTxue的大小)
        count: 0.3, // 0 ~ 1, 数量系数

        center: {
            x: -200,
            y: 500,
            z: 200
        }, // 效果环绕中心
        radius: 0.7, // 半径系数
        isPrey: true, // 是否鼠标位置影响
        preyRadius: 200, // 鼠标位置影响半径

        // freedom: 0.75, // 自由率
        cohesion: 20, // 凝聚距离
        alignment: 20, // 队列距离
        separation: 20, // 离散距离

        scopeR: {
            x: 1,
            y: 0.2,
            z: 1
        } // 效果范围影响系数
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
        cts: 'eft_canvas_frame', // 容器 dom 或id
        camera: {
            fov: 45,
            near: 3,
            far: 10000,
            position: {
                x: 43,
                y: 0,
                z: 0
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
            Ambient: {
                color: '#FFFFFF',
                strength: 0.9
            }, // 环境光 strength -2
        },
        tone: {
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0
        }
    },
    sky: {
        created: true, // 是否创建
        currentSky: 'type_3', // name(初始天空盒，对应name) / null(初始不启动天空盒)
        environment: 'type_1', // 环境贴图
        skys: [
            {
                name: 'type_1',
                type: 'hdr', // 类别
                url: path+'texture/basic.hdr'
                // url: 'texture/test.hdr'
            },
            /* {
                name: 'type_2',
                type: 'cube',
                url: [
                    path + 'texture/skyboxsun25deg/px.jpg',
                    path + 'texture/skyboxsun25deg/nx.jpg',
                    path + 'texture/skyboxsun25deg/py.jpg',
                    path + 'texture/skyboxsun25deg/ny.jpg',
                    path + 'texture/skyboxsun25deg/pz.jpg',
                    path + 'texture/skyboxsun25deg/nz.jpg',
                ]
            }, */
            {
                name: 'type_3',
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
        ],
        material: []
    },
    components: [
        switchCmp,
        loadeComp,
        cameraComp,
        instanceCom1,
        flyerComp,
        flyerComp2
    ],

    endCallBack() {
        // 所有组件加载完毕回调
        timeOutArray[2] = setTimeout(() => {
            instance.getComponent({
                sort: 4
            }).startInit(); // 初始相机角度
            document.querySelector('#eft_loading').style.opacity = 1;
            instance.loadingHide(document.querySelector('#eft_loading').style, {
                opacity: 0
            }, () => {
                document.querySelector('#eft_loading').remove();

                instance.getComponent({
                    sort: 4
                }).start('四川'); // 开始入场 '四川'
            });
        }, 200);
    },
    textures: [{
        id: 'waternormals',
        url: path + 'texture/waternormals.jpg',
        isRepeat: true,
        repeat: {
            x: 10,
            y: 10
        }
    }, {
        id: 'watert',
        url: path + 'texture/watert.jpg',
        isRepeat: true,
        repeat: {
            x: 10,
            y: 10
        }
    }, {
        id: 'water',
        url: path + 'texture/water.jpg',
        isRepeat: true
    }, {
        id: 'em_color',
        url: path + 'em/color.jpg'
    },
    {
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

    // 项目资源
    {
        id: 'DQG_DX01',
        url: publicPath + 'daqinggu/DQG_DX01.jpg'
    },
    {
        id: 'DQG_DX02',
        url: publicPath + 'daqinggu/DQG_DX02.jpg'
    },
    {
        id: 'DQG_JZ001',
        url: publicPath + 'daqinggu/DQG_JZ001.jpg'
    },
    {
        id: 'DQG_JZ002',
        url: publicPath + 'daqinggu/DQG_JZ002.jpg'
    },
    {
        id: 'DQG_XP',
        url: publicPath + 'daqinggu/DQG_XP.jpg'
    }

    ]
});

// 判断用于代码注入
if (typeof jQuery !== 'undefined') {
    const _element = $("#" + rect_id).widget()._element;
    $(_element).on("$destroy", function () {
        timeOutArray.forEach(time => {
            clearTimeout(time);
        })
        // 销毁
        
        instance.dispose();
        instance = null;
    });
}
