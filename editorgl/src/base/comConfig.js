/**
 * 容器及效果组件配置参数
 * zhoupu
 */
/**
 * @type {Object}
 */
const Publics = {
    name: '', // 场景名称，便于查找

    isShow: true, // 显示隐藏，影响事件及渲染
    isAnimate: true, // 是否执行动画
    isViewport: true, // 预留参数，是否视图，影响事件 值为false不执行动画

    isDfEvent: true, // 是否执行默认事件操作
    isCompEvents: true // 是否开启组件事件，渲染器上影响所有组件
};

/**
 * [DFConfig 容器默认配置 公共配置]
 * @type {Object}
 */
const DFConfig = {
    cts: '', // 容器dom 或id

    ...Publics, // 加入公共配置

    shadow: true, // 是否支持阴影，默认true
    frameLimit: 0.1, // 帧率限制
    devicePixelRatio: 1, // 屏幕像素比

    threshold: 1, // 设置 Points 拾取精度
    isRayRecur: true, // 是否递归射线拾取

    loading: { // loading效果
        created: true, // 是否创建
        url: '',
        hidden: 600, // 渐变消失时长，毫秒
        style: null, // loading外层dom style, 默认内置
        imgStyle: null // img style, 默认内置
    },
    camera: { // 相机参数
        fov: 45,
        near: 0.1,
        far: 10000,
        position: { x: 0, y: 512, z: 256 },
        ratio: 1,
        isOrth: false // 是否正交相机
    },
    controls: { // 控制器参数
        target: { x: 0, y: 0, z: 0 }, // 中心位置
        enabled: true, // 开关控制器
        params: {
            enablePan: true, // 是否平移
            enableZoom: true, // 是否缩放
            enableRotate: true, // 是否旋转
            enableDamping: true, // 是否阻尼
            dampingFactor: 0.08, // 阻尼系数
            panSpeed: 0.5, // 平移系数
            zoomSpeed: 0.1, // 缩放系数
            rotateSpeed: 0.08, // 旋转系数
            minDistance: 2, // 缩放 最近距离
            maxDistance: 2048, // 缩放 最远距离
            minPolarAngle: 0, // 上下旋转 向下最小弧度值
            maxPolarAngle: 3.14159265, // 上下旋转 向上最大弧度值
            minAzimuthAngle: -Infinity, // 左右旋转  向左弧度值
            maxAzimuthAngle: Infinity //  左右旋转  向右弧度值
        }
    },
    light: { // 灯光参数
        isHemisphere: true,  // 半球光
        isDirectional: true,  // 方向光
        Ambient: { color: '#FFFFFF', strength: 1 }, // 环境光 strength
        hemisphere: {
            color: '#FBFEFF', groundColor: '#FFFEFB', strength: 0.5, position: [0, 0, 128]
        },
        directional: {
            color: '#FFFFFF',
            strength: 0.8, // 1.7
            position: [5, 7, 10],
            mapSize: 1024, // 阴影面大小
            boxSize: 4096, // 阴影范围
            lightHelper: false // 灯光辅助线
        }
    },
    fog: { // 雾
        creat: false,
        color: '#666666',
        near: 1000,
        far: 3000
    },
    background: { // 背景参数
        color: '#ffffff', opacity: 0
    },
    sky: { // 天空盒 & 环境贴图 & hdr
        created: true, // 是否创建
        currentSky: '', // name(初始天空盒，对应name) / null(初始不启动天空盒)
        environment: '', // 环境贴图
        hdr: [ // hdr 纹理, 优先用
            // {
            //     id: 'type_1',
            //     url: 'texture/basic.hdr'
            // }
        ]
    },
    tone: { // 色调映射
        toneMapping: THREE.NoToneMapping,
        toneMappingExposure: 1
    },
    composer: { // 后期处理 暂不开放
        isAntialias: false,
        isOutline: false, // 外边框
        outlineColor: '#BF4E00', // 外边框颜色
        outlineStrength: 2, // 外边框强度
        outlineGlow: 1 // 外边框范围
    }
};

/**
 * [DFCEConfig 组件效果默认配置 公共配置]
 * @type {Object}
 */
const DFCEConfig = {
    sort: 0, // 组件序号，组件按序号大小加载，默认0, 越大越后加载

    ...Publics, // 加入公共配置

    gridHelper: false, // 是否显示辅助网格
    renderOrder: 1, // 组件基础渲染层级

    isMercator: false, // 经纬度是否墨卡托投影转换
    dataTans: 'plane', // 数据转换方式 对应 basic.longLat, basic.plane
    basic: {
        longLat: { // 经纬度转换
            vScale: 40000, // 点缩放值-比例尺
            center: [104.08195, 30.64615] // 中心点
        },
        plane: { // 平面转换
            vScale: 1, // 点缩放值-比例尺
            center: [0, 0] // 中心点
        }
    }
};

export { DFConfig, DFCEConfig };
