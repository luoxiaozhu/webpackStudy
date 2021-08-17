function () {
    const _path = 'attach/static_all0729/';
    return {
        // 组件初始化
        init: function (options) {
            this._super.apply(this, arguments);
        },
        // 容器内所有组件加载完成
        allChildrenLoaded: function () {

            const rect_id = 'rct_a1627624485110141';
            const doms = `
                <div id="eft_loading" style="position:absolute;left:0;right:0;bottom:0;top:0;z-index:100;background:#000;">
                <img src= "${_path}texture/loading.gif" style="position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);">
                </div>
                <div id="eft_canvas_frame" style="width: 100%; height: 100%;"></div>
            `;
            document.querySelector('#' + rect_id).innerHTML = doms;

            const instance2 = new glInstance();

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
                renderSort: 1, // 当前组件的渲染顺序
                created() {
                },
                mounted(group) {
                    $('#' + rect_id).widget().hide();
                    instance2.dispose();
                },
                destroyed() { console.log('destroyed'); },
                update() { console.log('update'); },
                watch(object) { console.log('watch'); }
            };

            instance2.init({
                sort: true,
                // 基础配置
                render: {
                    cts: 'eft_canvas_frame', // 容器 dom 或id
                    camera: {
                        fov: 45, near: 1, far: 10000, position: { x: -1.55, y: 30.98, z: 30.86 }
                    },
                    controls: {
                        target: { x: 0, y: 0, z: 0 } // 中心位置
                    }
                },
                sky: {
                    created: true, // 是否创建
                    currentSky: 'type_1', // name(初始天空盒，对应name) / null(初始不启动天空盒)
                    environment: null, // 环境贴图
                    skys: [
                        {
                            name: 'type_1',
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
                    switchCmp
                ],
                loadEndCallback() {
                    // 所有组件加载完毕回调
                    setTimeout(() => {
                        instance2.getComponent({ sort: 1 }).startInit(); // 初始相机角度
                        document.querySelector('#eft_loading').style.opacity = 1;
                        instance2.loadingHide(document.querySelector('#eft_loading').style, { opacity: 0 }, () => {
                            document.querySelector('#eft_loading').remove();

                            instance2.getComponent({ sort: 1 }).start('江西'); // 开始入场 '四川'
                        });

                    }, 200);
                },
                textures: [{
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
