function () {
    return {
        // 组件初始化
        init: function (options) {
            this._super.apply(this, arguments);
        },
        // 容器内所有组件加载完成
        allChildrenLoaded: function () {


            const path = 'attach/static/'; // 公共资源
            const publicPath = 'attach/static/'; // 当前项目资源
            const rect_id = 'rct_a1629121942502102';
          	const levelId = 'txt_a1629180653990133'; // 级数文本框
          	const pointTextId = 'txt_a1629180656442134'; // 标注名传出文本框

            const instance = new glInstance({
                debugs: true
            });

const earthComp = {
    compType: 'EarthGlobal', // 组件类别名称
    config: {
        name: 'earthGlobal', // 组件名称，查找组件
        earthImage: `${publicPath}/wlksh3D/earthBaseMap.jpg`,
        radius: 120, // 球半径
        // sort: 1, // 组件序号，组件按序号大小加载，默认0, 越大越后加载
        hasGlow: false, // 还有问题
        glowTxueId: 'earthGlowImg',
        glowColor: '#33CCFF',
        gridHelper: false, // 是否显示辅助网格
        renderOrder: 1, // 组件基础渲染层级
        isCompEvents: false // 是否开启组件事件，渲染器上影响所有组件
    },
    mounted(val) {
        // 效果完成
        console.log('----------mounted------', val);
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
            url: `${path}pointTips/tip.png`
        }
    },
    {
        name: '视频会议终端1',
        position: { x: -32.7, y: 7.5, z: 96.4 },
        opacityMark: true,
        mouseEvent: true,
        tipStyle: {
            content: '&nbsp视频',
            url: `${path}pointTips/blob.png`,
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
            url: `${path}pointTips/tip.png`
        }
    }
];

// -第四级点位信息
const forthPoints = [
    {
        name: '作训鞋架子',
        position: { x: -44.96, y: 1.0, z: 83.9 },
        opacityMark: true,
        mouseEvent: true,
        spreadStyle: {
            size: 50,
            color: '#FFFFFF',
            textureName: 'spread'
        },
        tipStyle: {
            content: '作训鞋架子',
            url: `${path}pointTips/tip.png`
        }
    },
    {
        name: '一级防疫炮弹架子',
        position: { x: -43.96, y: 1.0, z: 84.9 },
        opacityMark: true,
        mouseEvent: true,
        spreadStyle: {
            size: 50,
            color: '#FFFFFF',
            textureName: 'spread'
        },
        tipStyle: {
            content: '一级东风炮弹架子',
            url: `${path}pointTips/tip.png`
        }
    },
    {
        name: '迷彩作训服',
        position: { x: -45.2, y: 1.0, z: 85.9 },
        mouseEvent: true,
        opacityMark: true,
        spreadStyle: {
            color: '#FFFFFF',
            textureName: 'spread'
        },
        tipStyle: {
            content: '迷彩作训服架子',
            url: `${path}pointTips/tip.png`
        }
    },
    {
        name: '内部视频点位1',
        position: { x: -26.1, y: 3.94, z: 86.9 },
        opacityMark: true,
        mouseEvent: true,
        tipStyle: {
            content: '&nbsp视频1',
            url: `${path}pointTips/blob.png`,
            divCallback
        }
    },
    {
        name: '内部视频点位2',
        position: { x: -55.2, y: 3.9, z: 86.9 },
        opacityMark: true,
        mouseEvent: true,
        tipStyle: {
            content: '&nbsp视频2',
            url: `${path}pointTips/blob.png`,
            divCallback
        }
    },
    {
        name: '内部视频点位3',
        position: { x: -55.4, y: 3.7, z: 76.67 },
        opacityMark: true,
        mouseEvent: true,
        tipStyle: {
            content: '&nbsp视频3',
            url: `${path}pointTips/blob.png`,
            divCallback
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
        // const com1 = instance.getIns('pt_1');
        // com1.setPointTips('opacity', { isShow: false });
        console.log('pt_1 mounted');
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
                    { camera: { x: -550.39, y: 94.98, z: -1107.6 }, target: { x: -13.57, y: 0, z: 95.12 } },
                    { camera: { x: -53.04, y: 26.54, z: 33.66 }, target: { x: -13.58, y: 0, z: 95.11 } }
                ]
            },
            {
                id: 'path_2',
                time: 5000,
                easing: 'Quartic.InOut', // 当前动画的缓动 可以添加导子数据上
                cohesion: true, // 是否衔接当前视角过度
                loop: false, // 是否衔接当前视角过度
                data: [
                    { camera: { x: -51.28, y: 9.07, z: 60.74 }, target: { x: -44.37, y: 0, z: 86.51 } },
                    { camera: { x: -48.01, y: 1.79, z: 79.75 }, target: { x: -44.37, y: 0, z: 86.51 } }
                ]
            }
        ]
    },
    created() {
        /* 生成组件后的生命周期 （在生成效果前） */
        // console.log("created");
    },
    mounted(group) {
        /* 组件创建完成并且效果完成后的回调 */
        console.log('mounted');
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
    compType: 'InstanceMesh', // 当前组件的名称 用于调用对应的组件
    config: {
        name: 'Instance_1', // 当前组件的key值 用于监控当前组件的变化或者事件
        data: [
            {
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: TreeData.gaodaguanmu
                },
                model: {
                    url: `${publicPath}wlksh/gaodaguanmu.fbx`
                }
            },
            {
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: TreeData.guanmu
                },
                model: {
                    url: `${publicPath}wlksh/guanmu.fbx`
                }
            },
            {
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: TreeData.taoshu
                },
                model: {
                    url: `${publicPath}wlksh/taoshu.FBX`
                }
            },
            {
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: TreeData.tree6
                },
                model: {
                    url: `${publicPath}wlksh/waiweishushen.FBX`,
                    rotate: {
                        x: -Math.PI / 2
                    }
                }
            },
            {
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: TreeData.tree7
                },
                model: {
                    url: `${publicPath}wlksh/waiweishuqian.FBX`,
                    rotate: {
                        x: -Math.PI / 2
                    }
                }
            }
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
        const scale = 0.0001;
        group.scale.set(scale, scale, scale);
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

const divideDatas = dataDivide('类型', ['在建', '纪念园'], pointData);
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
        isCompEvents: true, // 是否开启组件事件，渲染器上影响所有组件
        radius: 122,
        colConfig: [
            { colName: '名称', key: 'name' },
            { colName: '经度', key: 'lng' },
            { colName: '纬度', key: 'lat' },
            { colName: '类型', key: 'type' },
            {colName:"战区",key:'dist'}
        ],
        pointData: divideDatas[0],
        tags: {
            // 标注文字
            show: true, // 是否显示标注上的文字
            fontSize: 30, // 标注文字大小
            startColor: '#ffffff', // 标注文字渐变开始颜色
            fontWeight: 'bold', // 是否加粗
            endColor: '#ffffff', // 渐变结束颜色
            // width: 100,  // 多行显示时的宽度
            scaleRate: 0.08, // 缩放的比率
            pos: [0.3, 3.5, 1] // 相对于图标的位置
        },
        point: {
            // 标注图片
            size: 6, // 图片大小
            pointImageType: 'fix', // 图片类型 fix 使用pointDefaultImage的图片,  name 图片跟随标注名称
            pointPath: `${publicPath}/wlksh3D/`, // 图片跟随标注名称是的路径
            pointDefaultImage: `${publicPath}/wlksh3D/storagePoint.png` // 标点图片
            // bounceSpeed: 0.004,
            // bounceDistance: 0.2
        }
    },
    mounted(val) {
        // 效果完成
        console.log('----------mounted------', val);
    }
};

const compPointLayer = {
    compType: 'EarthPointLayer', // 组件类别名称
    config: {
        name: 'compPointLayer', // 组件名称，查找组件
        // sort: 3, // 组件序号，组件按序号大小加载，默认0, 越大越后加载
        renderOrder: 4, // 组件基础渲染层级
        isCompEvents: true, // 是否开启组件事件，渲染器上影响所有组件
        radius: 122,
        colConfig: [
            { colName: '名称', key: 'name' },
            { colName: '经度', key: 'lng' },
            { colName: '纬度', key: 'lat' },
            { colName: '类型', key: 'type' },
            {colName:"战区",key:'dist'}
        ],
        pointData: divideDatas[2],
        tags: {
            // 标注文字
            show: true, // 是否显示标注上的文字
            fontSize: 30, // 标注文字大小
            startColor: '#ffffff', // 标注文字渐变开始颜色
            fontWeight: 'bold', // 是否加粗
            endColor: '#FFDF25', // 渐变结束颜色
            // width: 100,  // 多行显示时的宽度
            scaleRate: 0.08, // 缩放的比率
            pos: [0.3, 3.5, 1] // 相对于图标的位置
        },
        point: {
            // 标注图片
            size: 6, // 图片大小
            pointImageType: 'fix', // 图片类型 fix 使用pointDefaultImage的图片,  name 图片跟随标注名称
            pointPath: `${publicPath}/wlksh3D/`, // 图片跟随标注名称是的路径
            pointDefaultImage: `${publicPath}/wlksh3D/compPoint.png` // 标点图片
            // bounceSpeed: 0.004,
            // bounceDistance: 0.2
        }
    },
    mounted(val) {
        // 效果完成
        console.log('----------mounted------', val);
    }
};

// 初始化
instance.init({
    render: {
        // 渲染器
        cts: rect_id, // 容器 dom 或id
        camera: {
            near: 2,
            position: { x: -57.98, y: 215.32, z: -276.16 } //  { x: -89.8, y: 171.0, z: -211.1 }
        },
        controls: {
            target: { x: 0, y: 0, z: 0 }, // 中心位置
          	params: {
                enablePan: false, // 是否平移
                enableZoom: false, // 是否缩放
                enableRotate: true, // 是否旋转
            }
        },
        light: {
            // 灯光参数
            Ambient: { color: '#FFFFFF', strength: 1.2 } // 环境光 strength -2
        },
        sky: {
            created: true, // 是否创建
            currentSky: 'test_11', // 初始天空盒对应名称 / null(初始不启动天空盒)
            environment: 'type_2', // 环境贴图
            hdr: [
                {
                    id: 'test_11',
                    url: path+'texture/basic.hdr'
                },
                {
                    id: 'test_222',
                    url: path+'texture/quarry_01_1k.hdr'
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
        earthComp,
        earthCompChina,
        storagePointLayer,
        compPointLayer,
        pointTipCmp,
        loadeComp,
        instanceCom1,
        cameraComp
    ],
    endCallBack() {
        // 所有加载完成回调
        console.log('----------endCallBack-----');
        testing();
    },
    textures: [
        {
            id: 'waternormals',
            url: `${path}texture/waternormals.jpg`,
            isRepeat: true,
            repeat: {
                x: 10,
                y: 10
            }
        },
        // 纹理加载
        {
            id: 'earthGlowImg',
            url: `${path}wlksh3D/earthAllglow.png`, // 地图边缘光晕图片
            isRepeat: false
        },
        {
            id: 'watert',
            url: `${path}texture/watert.jpg`,
            isRepeat: true,
            repeat: { x: 10, y: 10 }
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
window.test = instance;
let eventTrigger = false;
// ----接口测试
const testing = () => {
    // instance.on('renderer', 'onMouseMove', () => {
    //     console.log('------renderer-----onMouseMove-----');
    // });
    if (!eventTrigger) {
        eventTrigger = true;
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
          	$('#' + levelId).widget().setCurrentValue(2);
        });

        instance.on('storagePointLayer', 'onClick', (event, compName, pointName) => {
            if (compName !== 'storagePointLayer') {
                return;
            }
            console.log('storagePointLayer', event, pointName);
          	if (curLevel <= 1) {
              // 传值到文本框
              $('#' + pointTextId).widget().setCurrentValue(pointName);
              return;
          	}
          	$('#' + levelId).widget().setCurrentValue(3);

            const com2 = instance.getIns('model1');
            const com3 = instance.getIns('Path_1');
            const com4 = instance.getIns('earthGlobal');
            const com5 = instance.getIns('earthGlobalChina');
            const com6 = instance.getIns('storagePointLayer');
            const com7 = instance.getIns('compPointLayer');
            const com8 = instance.getIns('Instance_1');

            // const com3 = instance.getIns("Instance_1");
            // const com4 = instance.getComponent({ sort: 4 });

            // com4.dispose();

            const scale = 1;

            com2.group.scale.set(scale, scale, scale);
            com8.group.scale.set(scale, scale, scale);

            const smallScale = 0.0001;
            com4.group.scale.set(smallScale, smallScale, smallScale);
            com5.group.scale.set(smallScale, smallScale, smallScale);
            com6.group.scale.set(smallScale, smallScale, smallScale);
            com7.group.scale.set(smallScale, smallScale, smallScale);

            com3.start('path_1', true, () => {
                const com1 = instance.getIns('pt_1');
                com1.setPointTips('opacity', { isShow: false });
            });
        });

        instance.on('compPointLayer', 'onClick', (event, compName, pointName) => {
            if (compName !== 'compPointLayer') {
                return;
            }
            console.log('compPointLayer', event, pointName);
          	if (curLevel <= 1) {
              $('#' + pointTextId).widget().setCurrentValue(pointName);
              // 传值到文本框
              return;
          	}
        });

        instance.on('pt_1', 'onMouseDown', (...obj) => {
            console.log('------pt_1-----onMouseDown-----', ...obj);
        });

        /* instance.on('pt_1', 'onDblClick', () => {
            console.log('------test_1-----onDblClick-----');
            const pointCom = instance.getIns('pt_1');
            const com3 = instance.getIns('Path_1');
            pointCom.setPointTips('opacity', {
                perTimes: 2,
                callback: () => {
                    pointCom.createPoints({ points: rdPoints });
                    com3.start('path_1', true, () => {
                        pointCom.setPointTips('opacity', {
                            perTimes: 2,
                            isShow: false
                        });
                    });
                }
            });
        }); */
        instance.on('model1', 'onMouseDown', (event, objects) => {
            // 点击屋顶
            const instanc = objects[0] ? objects[0].object : null;
            const com3 = instance.getIns('Path_1');
            const pointCom = instance.getIns('pt_1');
            if (instanc && instanc.name === 'buiding_01111111') {
                pointCom.setPointTips('opacity', {
                    perTimes: 2,
                    callback: () => {
                        pointCom.createPoints({ points: forthPoints });
                        com3.start('path_2', true, () => {
                            pointCom.setPointTips('opacity', {
                                perTimes: 2,
                                isShow: false
                            });
                        });
                    }
                });
            }
        });
    }

    // console.log('---', instance.getOption('renderer', 'camera'));

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


        }
    };
}