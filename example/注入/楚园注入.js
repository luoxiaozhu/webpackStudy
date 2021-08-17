function () {
    const _path = 'attach/static_all0729/';
    return {
        // 组件初始化
        init: function (options) {
            this._super.apply(this, arguments);

            const rect_id = 'rct_a1626268953879103';
            const doms = `
                <div id="eft_loading" style="position:absolute;left:0;right:0;bottom:0;top:0;z-index:100;background:#000;">
                <img src= "${_path}texture/loading.gif" style="position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);">
                </div>
                <div id="eft_canvas_frame" style="width: 100%; height: 100%;"></div>
            `;
            document.querySelector('#' + rect_id).innerHTML = doms;
        },
        // 容器内所有组件加载完成
        allChildrenLoaded: function () {
            const instance = new glInstance();
            // gui
            // datGui(instance);
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

            const loadeComp = {
                name: 'LoaderModel', // 当前组件的名称 用于调用对应的组件
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
                    model: [
                        {
                            url: './yuanqu/chuyuan001.FBX',
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
                name: 'CameraAnimate', // 当前组件的名称 用于调用对应的组件
                id: 'Path_1', // 当前组件的key值 用于监控当前组件的变化或者事件
                config: {
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
                name: 'InstanceMesh', // 当前组件的名称 用于调用对应的组件
                id: 'Instance_1', // 当前组件的key值 用于监控当前组件的变化或者事件
                config: {
                    data: [
                        {
                            renderOrder: 1,
                            meshData: {
                                type: 'data',
                                data: treeData.tree1
                            }, //实例化的数据，可以为模型数据或者是JSON数据
                            model: {
                                url: './yuanqu/gaodaguanmu.fbx', // 模型地址
                            }
                        },
                        {
                            renderOrder: 1,
                            meshData: {
                                type: 'data',
                                data: treeData.tree2
                            }, //实例化的数据，可以为模型数据或者是JSON数据
                            model: {
                                url: './yuanqu/guanmu.fbx', // 模型地址
                            }
                        },
                        {
                            renderOrder: 1,
                            meshData: {
                                type: 'data',
                                data: treeData.tree3
                            }, //实例化的数据，可以为模型数据或者是JSON数据
                            model: {
                                url: './yuanqu/ludeng.FBX', // 模型地址
                            }
                        },
                        {
                            renderOrder: 1,
                            meshData: {
                                type: 'data',
                                data: treeData.tree4
                            }, //实例化的数据，可以为模型数据或者是JSON数据
                            model: {
                                url: './yuanqu/qiaomu.FBX', // 模型地址
                            }
                        },
                        {
                            renderOrder: 1,
                            meshData: {
                                type: 'data',
                                data: treeData.tree5
                            }, //实例化的数据，可以为模型数据或者是JSON数据
                            model: {
                                url: './yuanqu/taoshu.FBX', // 模型地址
                            }
                        },
                        {
                            renderOrder: 1,
                            meshData: {
                                type: 'data',
                                data: treeData.tree6
                            }, //实例化的数据，可以为模型数据或者是JSON数据
                            model: {
                                url: './yuanqu/waiweishuqian.FBX', // 模型地址
                            }
                        },
                        {
                            renderOrder: 1,
                            meshData: {
                                type: 'data',
                                data: treeData.tree7
                            }, //实例化的数据，可以为模型数据或者是JSON数据
                            model: {
                                url: './yuanqu/waiweishushen.FBX', // 模型地址
                            }
                        },
                    ],
                    material: {
                        side: 2,
                        opacity: 1.3,
                        alphaTest: 0.05
                    },
                    rotation: {
                        x: -Math.PI / 2,
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
                    console.log("mounted");
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
                name: 'SwitchAnimate', // 当前组件的名称 用于调用对应的组件
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
                    instance.setOption('skyCube', { visible: true });

                    const com1 = instance.getComponent({ sort: 1 });
                    const com2 = instance.getComponent({ sort: 2 });
                    const com3 = instance.getComponent({ sort: 3 });
                    const com4 = instance.getComponent({ sort: 4 });

                    com4.dispose();
                    /* com1.setVisible(true)
                    com3.setVisible(true) */
                    /* com1.group.visible = true;
                    com3.group.visible = true; */
                    const scale = 1;
                    com1.group.scale.set(scale, scale, scale);
                    com3.group.scale.set(scale, scale, scale);

                    com2.start('path_1').then(res => {
                        setTimeout(() => {
                            com2.start('path_2');
                        }, 1000)
                    });

                    setTimeout(() => {
                        const com5 = instance.getComponent({ sort: 5 });
                        const com6 = instance.getComponent({ sort: 6 });

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
                name: 'FlyerEft', // 当前组件的名称 用于调用对应的组件
                id: 'flyer_1', // 当前组件的key值 用于监控当前组件的变化或者事件
                config: {
                    url: _path + 'flyers/Stork.glb', // 模型路径
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
                name: 'FlyerEft', // 当前组件的名称 用于调用对应的组件
                id: 'flyer_2', // 当前组件的key值 用于监控当前组件的变化或者事件
                config: {
                    url: _path + 'flyers/Flamingo.glb', // 模型路径
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
                    //console.log("mounted2");
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
                        near: 2,
                        far: 10000,
                        position: {
                            x: -1.55,
                            y: 30.98,
                            z: 30.86
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
                    }
                },
                sky: {
                    created: true, // 是否创建
                    currentSky: 'type_3', // name(初始天空盒，对应name) / null(初始不启动天空盒)
                    environment: 'type_2', // 环境贴图
                    skys: [
                        /*{
                            name: 'type_1',
                            type: 'hdr', // 类别
                            // url: 'texture/basic.hdr'
                            url: 'texture/test.hdr'
                        },*/
                        {
                            name: 'type_2',
                            type: 'cube',
                            url: [
                                _path + 'texture/skyboxsun25deg/px.jpg',
                                _path + 'texture/skyboxsun25deg/nx.jpg',
                                _path + 'texture/skyboxsun25deg/py.jpg',
                                _path + 'texture/skyboxsun25deg/ny.jpg',
                                _path + 'texture/skyboxsun25deg/pz.jpg',
                                _path + 'texture/skyboxsun25deg/nz.jpg',
                            ]
                        },
                        {
                            name: 'type_3',
                            type: 'cube',
                            url: [
                                _path + 'texture/MilkyWay/px.jpg',
                                _path + 'texture/MilkyWay/nx.jpg',
                                _path + 'texture/MilkyWay/py.jpg',
                                _path + 'texture/MilkyWay/ny.jpg',
                                _path + 'texture/MilkyWay/pz.jpg',
                                _path + 'texture/MilkyWay/nz.jpg',
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

                loadEndCallback() {
                    // 所有组件加载完毕回调
                    setTimeout(() => {
                        instance.getComponent({ sort: 4 }).startInit(); // 初始相机角度
                        document.querySelector('#eft_loading').style.opacity = 1;
                        instance.loadingHide(document.querySelector('#eft_loading').style, { opacity: 0 }, () => {
                            document.querySelector('#eft_loading').remove();

                            instance.getComponent({ sort: 4 }).start(); // 开始入场 '四川'
                        });

                    }, 200);
                },
                textures: [{
                    id: 'waternormals',
                    url: _path + 'texture/waternormals.jpg',
                    isRepeat: true,
                    repeat: { x: 10, y: 10 }
                }, {
                    id: 'watert',
                    url: _path + 'texture/watert.jpg',
                    isRepeat: true,
                    repeat: { x: 10, y: 10 }
                }, {
                    id: 'water',
                    url: _path + 'texture/water.jpg',
                    isRepeat: true
                }, {
                    id: 'DX001',
                    url: 'yuanqu/DX001.jpg',
                    isRepeat: true
                },
                {
                    id: 'DX002',
                    url: 'yuanqu/DX002.jpg',
                    isRepeat: true
                },
                {
                    id: 'JZ001',
                    url: 'yuanqu/JZ001.jpg',
                    isRepeat: true
                }, {
                    id: 'JZ002',
                    url: 'yuanqu/JZ002.jpg',
                    isRepeat: true
                }, {
                    id: 'JZ003',
                    url: 'yuanqu/JZ003.jpg',
                    isRepeat: true
                }, {
                    id: 'JZ004',
                    url: 'yuanqu/JZ004.jpg',
                    isRepeat: true
                }, {
                    id: 'JZ005',
                    url: 'yuanqu/JZ005.jpg',
                    isRepeat: true
                }, {
                    id: 'em_color',
                    url: _path + 'em/color.jpg'
                }, {
                    id: 'em_normal',
                    url: _path + 'em/normal.jpg'
                }, {
                    id: 'em_aomap',
                    url: _path + 'em/aomap.jpg'
                }, {
                    id: 'em_display',
                    url: _path + 'em/display.jpg'
                }, {
                    id: 'em_cloud',
                    url: _path + 'em/cloud.png'
                }]
            });
        }
    };
}
