const path = ''; // 公共资源
const publicPath = ''; // 当前项目资源
const rect_id = 'test1';


const instance = new glInstance({
    debugs: true
});
window._instance = instance;
const switchCmp = {
    compType: 'SwitchAnimate', // 当前组件的名称 用于调用对应的组件
    id: 'sw_1', // 当前组件的key值 用于监控当前组件的变化或者事件
    visible: true,
    config: {
        name: 'sa_1',
        start: true,
        earth: {
            radius: 10
        },
        showMaps: false,
        baseColor: '#004933',
        lightColor: '#B1AC07' // #079FB1
    },
    mounted(group) {
        console.log('mounted');
    },

    endCallBack() {
        console.log('SwitchAnimateEnd');
        const com1 = instance.getIns('pt_1');
        const com2 = instance.getIns('model1');
        const com3 = instance.getIns('Path_1');
        // const com3 = instance.getIns("Instance_1");
        // const com4 = instance.getComponent({ sort: 4 });

        // com4.dispose();

        const scale = 1;
        com1.group.scale.set(scale, scale, scale);
        com2.group.scale.set(scale, scale, scale);

        com3.start('path_1', true, () => { })
    }
};

const divCallback = (background, content) => {
    const divStr = `<div style = "width: 72px;height: 52px;background: url('${background}') no-repeat 100% 100%;">
    <div style="color: #fbf5f5;font-size: 20px;position: absolute;left: 8px;top: 7px; white-space:nowrap;">${content}</div></div>`;
    return divStr;
};
// -第三级点位信息
const rdPoints = [
    {
        name: '监控点位1',
        position: { x: -44.37, y: 5.4, z: 81.8 },
        opacityMark: true,
        mouseEvent: true,
        spreadStyle: {
            size: 50,
            color: '#FFFFFF',
            textureName: 'spread'
        },
        tipStyle: {
            content: '视频监控点位1',
            url: 'pointTips/tip.png'
        }
    },
    {
        name: '视频会议终端1',
        position: { x: -32.7, y: 7.5, z: 96.4 },
        opacityMark: true,
        mouseEvent: true,
        tipStyle: {
            content: '&nbsp视频',
            url: 'pointTips/blob.png',
            divCallback
        }
    },
    {
        name: '监控点位2',
        position: { x: -52.3, y: 4.6, z: 76.8 },
        mouseEvent: true,
        opacityMark: true,
        spreadStyle: {
            color: '#FFFFFF',
            textureName: 'spread'
        },
        tipStyle: {
            content: '视频监控点位2',
            url: 'pointTips/tip.png'
        }
    }
];

// -第四级点位信息
const forthPoints = [
    {
        name: '内部监控点位1',
        position: { x: -44.96, y: 1.0, z: 83.4 },
        opacityMark: true,
        mouseEvent: true,
        spreadStyle: {
            size: 50,
            color: '#FFFFFF',
            textureName: 'spread'
        },
        tipStyle: {
            content: '视频监控点位1',
            url: 'pointTips/tip.png'
        }
    },
    {
        name: '内部视频点位1',
        position: { x: -26.1, y: 3.94, z: 86.9 },
        opacityMark: true,
        mouseEvent: true,
        tipStyle: {
            content: '&nbsp视频1',
            url: 'pointTips/blob.png',
            divCallback
        }
    },{
        name: '内部视频点位2',
        position: { x: -55.2, y: 3.9, z: 86.9 },
        opacityMark: true,
        mouseEvent: true,
        tipStyle: {
            content: '&nbsp视频2',
            url: 'pointTips/blob.png',
            divCallback
        }
    },
    {
        name: '内部监控点位2',
        position: { x: -47.2, y: 1.0, z: 83.5 },
        mouseEvent: true,
        opacityMark: true,
        spreadStyle: {
            color: '#FFFFFF',
            textureName: 'spread'
        },
        tipStyle: {
            content: '视频监控点位2',
            url: 'pointTips/tip.png'
        }
    }
];

const pointTipCmp = {
    compType: 'PointTip', // 当前组件的名称 用于调用对应的组件
    config: {
        name: 'pt_1',
        points: rdPoints
    },
    mounted(group) {
        // const scale = 0.0001;
        // group.scale.set(scale, scale, scale);
        //group.visible = false;
        console.log('pt_1 mounted');
        console.log("4");
    }
};
const loadeComp = {
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
            gradient: ['rgba(10,13,26,0.5)', 'rgba(10,13,26,0.0)']
        }, // 配置底盘显示  装饰作用
        model: [{
            "url": path + "wlksh/scene.FBX",
            "replaceMaterial": "MeshPhysicalMaterial",
            "pick": ['buiding_01111111'],
            "bake": [],
            "animate": [],
            "mesh": [{
                name: 'water',
                renderOrder: 1,
                replace: {
                    name: 'water',
                    speed: 0.3
                }
            }],
            "material": [
                {
                    "name": "chuyuan_road001",
                    "metalness": 0.2,
                    "clearcoat": 0.2,
                    "clearcoatRoughness": 0.8
                },
                {
                    "name": "chuyuan_001",
                    "metalness": 0.5
                },
                {
                    "name": "CK_001",
                    "metalness": 0.7,
                    "clearcoat": 0.2,
                    "clearcoatRoughness": 0.7,
                    side: 2
                },
                {
                    "name": "wuding",
                    "roughness": 1,
                    "metalness": 0.2
                },
                {
                    "name": "chuyuan_001",
                    "metalness": 0.4
                },
                {
                    "name": "CK_006",
                    "metalness": 0.2
                },
                {
                    "name": "CK_005",
                    "metalness": 0.4,
                    "side": 2,
                },
                {
                    "name": "Material #1734569939",
                    "metalness": 0.5,
                    "opacity": 1,
                    "side": 2,
                    "clearcoat": 0.2,
                    "clearcoatRoughness": 1
                },
                {
                    "name": "Material #1734569828",
                    "metalness": 0.2
                },
                {
                    "name": "wall001",
                    "metalness": 0.5,
                    "roughness": 1
                },
                {
                    "name": "移动_xhs会展中心002",
                    "metalness": 0.4,
                    "roughness": 0.5,
                    "clearcoat": 0.3,
                    "clearcoatRoughness": 0.5
                },
                {
                    "name": "Material #1734570876",
                    "metalness": 0.7,
                    "roughness": 0.7,
                    "clearcoat": 0.6,
                    "clearcoatRoughness": 1
                },
                {
                    "name": "Material #224",
                    "metalness": 0.4,
                    "roughness": 0.5
                },
                {
                    "name": "glass001",
                    "roughness": 0.5,
                    "metalness": 0.4,
                    "clearcoat": 0.5,
                    "clearcoatRoughness": 0.9,
                    side: 2
                },
                {
                    "name": "glass002",
                    "roughness": 0.5,
                    "metalness": 0.5,
                    "transmission": 0,
                    "alphaTest": 0,
                    "opacity": 1,
                    "clearcoat": 0.4,
                    "clearcoatRoughness": 0.7,
                    side: 2

                },
                {
                    "name": "alpha_langan",
                    "transparent": true,
                    "side": 2,
                    "alphaTest": 0,
                    "metalness": 0.4,
                    "roughness": 0.5,
                    "clearcoat": 0.5,
                    "clearcoatRoughness": 0.9
                },
                {
                    "name": "alpha_boli",
                    "roughness": 0.5,
                    "metalness": 0.5,
                    "clearcoat": 0.5,
                    "clearcoatRoughness": 0.9
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "07 - Default",
                    "metalness": 0.2
                },
                {
                    "name": "CK_008",
                    "metalness": 0.4
                },
                {
                    "name": "chuyuan_001",
                    "metalness": 0.4
                },
                {
                    "name": "CK_006",
                    "metalness": 0.4
                },
                {
                    "name": "chuyuan_001",
                    "metalness": 0.4
                },
                {
                    "name": "CK_006",
                    "roughness": 1
                },
                {
                    "name": "lf-wood-002122",
                    "metalness": 0.4
                },
                {
                    "name": "CK_008",
                    "metalness": 0.4
                },
                {
                    "name": "lf-wood-002122",
                    "metalness": 0.4
                },
                {
                    "name": "chuyuan_001",
                    "metalness": 0.5
                },
                {
                    "name": "CK_001",
                    "metalness": 0.7,
                    "clearcoat": 0.2,
                    "clearcoatRoughness": 0.7
                },
                {
                    "name": "TK",
                    "transparent": true,
                    "metalness": 0.5
                },
                {
                    "name": "wuding",
                    "roughness": 1,
                    "metalness": 0.2
                },
                {
                    "name": "chuyuan_001",
                    "metalness": 0.4
                },
                {
                    "name": "CK_006",
                    "metalness": 0.2
                },
                {
                    "name": "CK_005",
                    "metalness": 0.4
                },
                {
                    "name": "Material #1734569828",
                    "metalness": 0.2
                },
                {
                    "name": "wall001",
                    "metalness": 0.5,
                    "roughness": 1
                },
                {
                    "name": "移动_xhs会展中心002",
                    "metalness": 0.4,
                    "roughness": 0.5,
                    "clearcoat": 0.3,
                    "clearcoatRoughness": 0.5
                },
                {
                    "name": "Material #1734570876",
                    "metalness": 0.7,
                    "roughness": 0.7,
                    "clearcoat": 0.6,
                    "clearcoatRoughness": 1
                },
                {
                    "name": "Material #224",
                    "metalness": 0.4,
                    "roughness": 0.5
                },
                {
                    "name": "glass001",
                    "roughness": 0.5,
                    "metalness": 0.4,
                    "clearcoat": 0.5,
                    "clearcoatRoughness": 0.9,
                    side: 2
                },
                {
                    "name": "glass002",
                    "roughness": 0.5,
                    "metalness": 0.5,
                    "transmission": 0,
                    "alphaTest": 0,
                    "opacity": 1,
                    "clearcoat": 0.4,
                    "clearcoatRoughness": 0.7,
                    side: 2
                },
                {
                    "name": "alpha_langan",
                    "transparent": true,
                    "side": 2,
                    "alphaTest": 0,
                    "metalness": 0.4,
                    "roughness": 0.5,
                    "clearcoat": 0.5,
                    "clearcoatRoughness": 0.9
                },
                {
                    "name": "alpha_boli",
                    "roughness": 0.5,
                    "metalness": 0.5,
                    "clearcoat": 0.5,
                    "clearcoatRoughness": 0.9
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "07 - Default",
                    "metalness": 0.2
                },
                {
                    "name": "CK_008",
                    "metalness": 0.4
                },
                {
                    "name": "CK_001",
                    "metalness": 0.4
                },
                {
                    "name": "chuyuan_001",
                    "metalness": 0.4
                },
                {
                    "name": "CK_006",
                    "metalness": 0.4
                },
                {
                    "name": "chuyuan_001",
                    "metalness": 0.4
                },
                {
                    "name": "CK_006",
                    "roughness": 1
                },
                {
                    "name": "lf-wood-002122",
                    "metalness": 0.4
                },
                {
                    "name": "CK_008",
                    "metalness": 0.4
                },
                {
                    "name": "lf-wood-002122",
                    "metalness": 0.4
                },
                {
                    "name": "Material #2145849400",
                    "metalness": 0.4,
                    "clearcoat": 0.2,
                    "clearcoatRoughness": 0.9
                },
                {
                    "name": "Material #2145834790",
                    "metalness": 0.1
                },
                {
                    "name": "chuyuan_001",
                    "metalness": 0.5
                },
                {
                    "name": "CK_001",
                    "metalness": 0.7,
                    "clearcoat": 0.2,
                    "clearcoatRoughness": 0.7
                },
                {
                    "name": "TK",
                    "transparent": true,
                    "metalness": 0.5
                },
                {
                    "name": "wuding",
                    "roughness": 1,
                    "metalness": 0.2
                },
                {
                    "name": "chuyuan_001",
                    "metalness": 0.4
                },
                {
                    "name": "CK_006",
                    "metalness": 0.2
                },
                {
                    "name": "CK_005",
                    "metalness": 0.4
                },
                {
                    "name": "Material #274",
                    "metalness": 0.4
                },
                {
                    "name": "Material #1734569828",
                    "metalness": 0.4
                },
                {
                    "name": "wall001",
                    "metalness": 0.5,
                    "roughness": 1
                },
                {
                    "name": "移动_xhs会展中心002",
                    "metalness": 0.4,
                    "roughness": 0.5,
                    "clearcoat": 0.3,
                    "clearcoatRoughness": 0.5
                },
                {
                    "name": "Material #1734570876",
                    "metalness": 0.7,
                    "roughness": 0.7,
                    "clearcoat": 0.6,
                    "clearcoatRoughness": 1
                },
                {
                    "name": "Material #224",
                    "metalness": 0.4,
                    "roughness": 0.5
                },
                {
                    "name": "glass003",
                    "metalness": 0.6,
                    "roughness": 0.2,
                    "opacity": 1,
                    "clearcoat": 0.2,
                    "clearcoatRoughness": 0.8,
                    "side": 2,
                    side: 2
                },
                {
                    "name": "glass001",
                    "roughness": 0.5,
                    "metalness": 0.4,
                    "clearcoat": 0.5,
                    "clearcoatRoughness": 0.9,
                    "side": 2
                },
                {
                    "name": "glass004",
                    "metalness": 0.2,
                    "clearcoat": 0.5
                },
                {
                    "name": "glass002",
                    "roughness": 0.5,
                    "metalness": 0.5,
                    "transmission": 0,
                    "alphaTest": 0,
                    "opacity": 1,
                    "clearcoat": 0.4,
                    "clearcoatRoughness": 0.7,
                    side: 2
                },
                {
                    "name": "alpha_langan",
                    "transparent": true,
                    "side": 2,
                    "alphaTest": 0,
                    "metalness": 0.4,
                    "roughness": 0.5,
                    "clearcoat": 0.5,
                    "clearcoatRoughness": 0.9
                },
                {
                    "name": "alpha_boli",
                    "roughness": 0.5,
                    "metalness": 0.5,
                    "clearcoat": 0.5,
                    "clearcoatRoughness": 0.9
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "07 - Default",
                    "metalness": 0.2
                },
                {
                    "name": "CK_008",
                    "metalness": 0.4
                },
                {
                    "name": "chuyuan_001",
                    "metalness": 0.4
                },
                {
                    "name": "CK_006",
                    "metalness": 0.4
                },
                {
                    "name": "chuyuan_001",
                    "metalness": 0.4
                },
                {
                    "name": "CK_006",
                    "roughness": 1
                },
                {
                    "name": "lf-wood-002122",
                    "metalness": 0.4
                },
                {
                    "name": "CK_008",
                    "metalness": 0.4
                },
                {
                    "name": "lf-wood-002122",
                    "metalness": 0.4
                },
                {
                    "name": "Material #2145849400",
                    "metalness": 0.4,
                    "clearcoat": 0.2,
                    "clearcoatRoughness": 0.9
                },
                {
                    "name": "Material #2145834790",
                    "metalness": 0.1
                },
                {
                    "name": "07 - Default",
                    "metalness": 0.4,
                    "roughness": 0.6
                },
                {
                    "name": "02 - Default",
                    "metalness": 0.4
                },
                {
                    "name": "luya",
                    "metalness": 0.3
                },
                {
                    "name": "chuyuan_001",
                    "metalness": 0.5
                },
                {
                    "name": "TK",
                    "transparent": true,
                    "metalness": 0.5
                },
                {
                    "name": "CK_001",
                    "metalness": 0.5,
                    "opacity": 1,
                    "clearcoat": 0.5
                },
                {
                    "name": "wuding",
                    "roughness": 1,
                    "metalness": 0.2
                },
                {
                    "name": "chuyuan_001",
                    "metalness": 0.4
                },
                {
                    "name": "CK_006",
                    "metalness": 0.2
                },
                {
                    "name": "CK_005",
                    "metalness": 0.4
                },
                {
                    "name": "Material #274",
                    "metalness": 0.4
                },
                {
                    "name": "Material #1734569828",
                    "metalness": 0.4
                },
                {
                    "name": "wall001",
                    "metalness": 0.5,
                    "roughness": 1
                },
                {
                    "name": "matel003",
                    "metalness": 0.2,
                    "clearcoat": 0.3,
                    "side": 2
                },
                {
                    "name": "matel001",
                    "metalness": 0.2,
                    "clearcoat": 0.3,
                    "side": 2
                },
                {
                    "name": "移动_xhs会展中心002",
                    "metalness": 0.4,
                    "roughness": 0.5,
                    "clearcoat": 0.3,
                    "clearcoatRoughness": 0.5
                },
                {
                    "name": "Material #1734570876",
                    "metalness": 0.7,
                    "roughness": 0.7,
                    "clearcoat": 0.6,
                    "clearcoatRoughness": 1
                },
                {
                    "name": "Material #224",
                    "metalness": 0.4,
                    "roughness": 0.5
                },
                {
                    "name": "matel002",
                    "metalness": 0.35,
                    "side": 2
                },
                {
                    "name": "glass001",
                    "roughness": 0.5,
                    "metalness": 0.4,
                    "clearcoat": 0.5,
                    "clearcoatRoughness": 0.9,
                    "side": 2
                },
                {
                    "name": "glass002",
                    "roughness": 0.5,
                    "metalness": 0.5,
                    "transmission": 0,
                    "alphaTest": 0,
                    "opacity": 1,
                    "clearcoat": 0.4,
                    "clearcoatRoughness": 0.7
                },
                {
                    "name": "alpha_langan",
                    "transparent": true,
                    "side": 2,
                    "alphaTest": 0,
                    "metalness": 0.4,
                    "roughness": 0.5,
                    "clearcoat": 0.5,
                    "clearcoatRoughness": 0.9
                },
                {
                    "name": "alpha_boli",
                    "roughness": 0.5,
                    "metalness": 0.5,
                    "clearcoat": 0.5,
                    "clearcoatRoughness": 0.9
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "alpha_tree04",
                    "transparent": true
                },
                {
                    "name": "07 - Default",
                    "metalness": 0.2
                },
                {
                    "name": "CK_008",
                    "metalness": 0.4
                },
                {
                    "name": "CK_001",
                    "metalness": 0.4
                },
                {
                    "name": "chuyuan_001",
                    "metalness": 0.4
                },
                {
                    "name": "CK_006",
                    "metalness": 0.4
                },
                {
                    "name": "chuyuan_001",
                    "metalness": 0.4
                },
                {
                    "name": "CK_006",
                    "roughness": 1
                },
                {
                    "name": "lf-wood-002122",
                    "metalness": 0.4
                },
                {
                    "name": "CK_008",
                    "metalness": 0.4
                },
                {
                    "name": "lf-wood-002122",
                    "metalness": 0.4
                },
                {
                    "name": "Material #2145849400",
                    "metalness": 0.4,
                    "clearcoat": 0.2,
                    "clearcoatRoughness": 0.9
                },
                {
                    "name": "Material #2145834790",
                    "metalness": 0.1
                },
                {
                    "name": "07 - Default",
                    "metalness": 0.4,
                    "roughness": 0.6
                },
                {
                    "name": "02 - Default",
                    "metalness": 0.4
                }
            ]
        }]
    },

    endCallBack(group) {

    },
    mounted(group) {
        const scale = 0.0001;
        group.scale.set(scale, scale, scale);
        console.log("2");
    },
    onClick(option) {
        const { instanc } = option;
        // -点击屋顶
        const com3 = instance.getIns('Path_1');
        const pointCom = instance.getIns('pt_1');
        // -获取点信息
        if (instanc && instanc.name === 'buiding_01111111') {
            pointCom.setPointTips('opacity', {
                perTimes:2,
                callback: () => {
                    com3.start('path_2', true, () => {
                        pointCom.createPoints({points:forthPoints});
                        console.log('test');
                    });
                }
            });
        }
    }
};
const cameraComp = {
    compType: 'CameraAnimate', // 当前组件的名称 用于调用对应的组件
    config: {
        name: 'Path_1', // 当前组件的key值 用于监控当前组件的变化或者事件
        sort: 2,
        renderOrder: 0,
        data: [{
            id: 'path_1',
            time: 5000,
            easing: 'Quartic.InOut', // 当前动画的缓动 可以添加导子数据上
            cohesion: false, // 是否衔接当前视角过度
            data: [{
                "camera": {
                    "x": -550.39,
                    "y": 94.98,
                    "z": -1107.6
                },
                "target": {
                    "x": -13.57,
                    "y": 0,
                    "z": 95.12
                }
            },
            {
                "camera": {
                    "x": -53.04,
                    "y": 26.54,
                    "z": 33.66
                },
                "target": {
                    "x": -13.58,
                    "y": 0,
                    "z": 95.11
                }
            }
            ]
        },
        {
            id: 'path_2',
            time: 5000,
            easing: 'Quartic.InOut', // 当前动画的缓动 可以添加导子数据上
            cohesion: true, // 是否衔接当前视角过度
            loop: false, // 是否衔接当前视角过度
            data: [{
                "camera": {
                    "x": -51.28,
                    "y": 9.07,
                    "z": 60.74
                },
                "target": {
                    "x": -44.37,
                    "y": 0,
                    "z": 86.51
                }
            },
            {
                "camera": {
                    "x": -48.01,
                    "y": 1.79,
                    "z": 79.75
                },
                "target": {
                    "x": -44.37,
                    "y": 0,
                    "z": 86.51
                }
            }
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
        console.log("1");
    }
};
const instanceCom1 = {
    compType: 'InstanceMesh', // 当前组件的名称 用于调用对应的组件
    config: {
        name: 'Instance_1', // 当前组件的key值 用于监控当前组件的变化或者事件
        data: [{
            "renderOrder": 1,
            "meshData": {
                "type": "data",
                "data": TreeData.gaodaguanmu
            },
            "model": {
                "url": publicPath + "wlksh/gaodaguanmu.fbx"
            }
        },
        {
            "renderOrder": 1,
            "meshData": {
                "type": "data",
                "data": TreeData.guanmu
            },
            "model": {
                "url": publicPath + "wlksh/guanmu.fbx"
            }
        },
        {
            "renderOrder": 1,
            "meshData": {
                "type": "data",
                "data": TreeData.taoshu
            },
            "model": {
                "url": publicPath + "wlksh/taoshu.FBX"
            }
        },
        {
            "renderOrder": 1,
            "meshData": {
                "type": "data",
                "data": TreeData.tree6
            },
            "model": {
                "url": publicPath + "wlksh/waiweishushen.FBX",
                rotate: {
                    x: -Math.PI / 2,
                }
            }
        },
        {
            "renderOrder": 1,
            "meshData": {
                "type": "data",
                "data": TreeData.tree7
            },
            "model": {
                "url": publicPath + "wlksh/waiweishuqian.FBX",
                rotate: {
                    x: -Math.PI / 2,
                }
            }
        },
            /* {
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: chuyuanTree.tree7
                }, //实例化的数据，可以为模型数据或者是JSON数据
                model: {
                    url: publicPath + 'yuanqu/waiweishushen.FBX', // 模型地址
                }
            }, */
        ],
        material: {
            side: 2,
            opacity: 1.3,
            alphaTest: 0.4,
            transparent: false
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    mounted(group) {
        // const scale = 0.0001;
        // group.scale.set(scale, scale, scale)
        console.log("3");
    }
};
// 初始化
instance.init({
    render: {
        // 渲染器
        cts: rect_id, // 容器 dom 或id
        camera: {
            near: 2,
            position: {"x":-73.34,"y":42.05,"z":0.02}
        },
        controls: {
            target: {"x":-16.69,"y":0,"z":102.66} // 中心位置
        },
        light: {
            // 灯光参数
            Ambient: {
                color: '#FFFFFF',
                strength: 1.2
            } // 环境光 strength -2
        },
        sky: {
            created: true, // 是否创建
            currentSky: 'test_11', // 初始天空盒对应名称 / null(初始不启动天空盒)
            environment: 'type_2', // 环境贴图
            hdr: [{
                id: 'test_11',
                url: publicPath + 'texture/basic.hdr'
            },
            {
                id: 'test_222',
                url: publicPath + 'texture/quarry_01_1k.hdr'
            }
            ]
        },
        loading: {
            // loading效果
            created: true, // 是否创建
            url: `${path}texture/loading.gif`
        },

        beforeInit(...arg) {
            console.log('----------beforeInit-----');
        }
    },
    components: [
        // 组件效果
        // flyerComp,
        instanceCom1,
        cameraComp,
        loadeComp,
        pointTipCmp
    ],
    endCallBack() {
        // 所有加载完成回调
        console.log('----------endCallBack-----');
        //instance.setOption('sa_1','start','四川');    
        testing();
    },
    textures: [
        // 纹理加载
        {
            id: 'waternormals',
            url: `${path}texture/waternormals.jpg`,
            isRepeat: true,
            repeat: {
                x: 10,
                y: 10
            }
        },
        {
            id: 'watert',
            url: `${path}texture/watert.jpg`,
            isRepeat: true,
            repeat: {
                x: 10,
                y: 10
            }
        },
        {
            id: 'water',
            url: `${path}texture/water.jpg`,
            isRepeat: true
        },
        {
            id: 'em_color',
            url: `${path}em/color.jpg`
        },
        {
            id: 'em_normal',
            url: `${path}em/normal.jpg`
        },
        {
            id: 'em_aomap',
            url: `${path}em/aomap.jpg`
        },
        {
            id: 'em_display',
            url: `${path}em/display.jpg`
        },
        {
            id: 'em_cloud',
            url: `${path}em/cloud.png`
        },

        {
            id: 'type_2',
            type: 'cube',
            url: [
                `${path}texture/skyboxsun25deg/px.jpg`,
                `${path}texture/skyboxsun25deg/nx.jpg`,
                `${path}texture/skyboxsun25deg/py.jpg`,
                `${path}texture/skyboxsun25deg/ny.jpg`,
                `${path}texture/skyboxsun25deg/pz.jpg`,
                `${path}texture/skyboxsun25deg/nz.jpg`
            ]
        },
        {
            id: 'type_3',
            type: 'cube',
            url: [
                `${path}texture/MilkyWay/px.jpg`,
                `${path}texture/MilkyWay/nx.jpg`,
                `${path}texture/MilkyWay/py.jpg`,
                `${path}texture/MilkyWay/ny.jpg`,
                `${path}texture/MilkyWay/pz.jpg`,
                `${path}texture/MilkyWay/nz.jpg`
            ]
        },
        // -打点
        {
            id: 'spread',
            url: `${path}pointTips/spread.png`
        }
    ]
});

// ----接口测试
const testing = () => {
    instance.on('renderer', 'onMouseMove', () => {
        console.log('------renderer-----onMouseMove-----');
    });

    instance.on('pt_1', 'onMouseDown', (...obj) => {
        console.log('------pt_1-----onMouseDown-----', ...obj);
    });

    instance.on('pt_1', 'onDblClick', () => {
        console.log('------test_1-----onDblClick-----');
    });
    instance.on('model1', 'onMouseDown', (event, objects) => {
        // 点击屋顶
        const instanc = objects[0] ? objects[0].object : null;
        const com3 = instance.getIns('Path_1');
        if (instanc && instanc.name === 'buiding_01111111') {
            com3.start('path_2', true, () => {
                console.log(123)
            })
        }
    });

    console.log('---', instance.getOption('renderer', 'camera'));

    // setTimeout(() => {
    //     instance.setOption('renderer', 'restore');
    // }, 5 * 1000);
};
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

