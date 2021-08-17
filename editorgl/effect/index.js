/*
 * @Author: Duke
 * @Date: 2021-08-11 09:12:47
 * @LastEditors: Duke
 * @LastEditTime: 2021-08-16 09:39:21
 * @Description: file content
 */
import LoaderModel from './model/index';
import CameraAnimate from './camera/index';
import InstanceMesh from './instance/index';
import FlyEffect from './flyPoint/index';
import SwitchAnimate from './switchAnimate/index'; // 入场动画

import HtMapEft from './htMap/index'; // 热力效果
import FlyerEft from './flyer/index'; // 飞鸟效果
import FlowsEft from './flows/index'; // path流光
import FencesEft from './fences/index'; // 围栏光效
import SubFaceEft from './subface/index'; // 底面反射效果
import TestingEft from './testing/index'; // 模板测试
import EarthGlobal from './earthGlobal'; // 地球球体
import ShaderEarthGlobal from './shaderEarthGlobal'; // 地球球体
import EarthPointLayer from './earthPointLayer'; // 地球球体
import PointTip from './pointTips';

export default {
    LoaderModel,
    CameraAnimate,
    InstanceMesh,
    FlyEffect,
    SwitchAnimate,

    HtMapEft, // 热力效果
    FlyerEft, // 飞鸟效果
    FlowsEft, // path流光
    FencesEft, // 围栏光效
    SubFaceEft, // 底面反射效果

    EarthGlobal,
    ShaderEarthGlobal,
    EarthPointLayer,
    PointTip,
    TestingEft
};
