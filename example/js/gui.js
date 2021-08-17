import * as dat from 'dat.gui'

const gui = new dat.GUI()

const build = gui.addFolder('建筑');
const option = {
    color1: '#1C4E71', // box1
    color2: '#1C4E71', // box2
    opacity1: 1, // box1
    opacity2: 1, // box2
    colorDiff: '#1C4E71', // 扩散颜色 
}

export default function (instance) {
    build.addColor(option, 'color1').name('建筑颜色1').onChange((val) => {
        const com = instance.getComponent({
            sort: 1
        });
        com.setMaterialValues('glass05', {
            color: new THREE.Color(val)
        })
    });
    build.addColor(option, 'color2').name('建筑颜色2').onChange((val) => {
        const com = instance.getComponent({
            sort: 1
        });
        com.setMaterialValues('glass06', {
            color: new THREE.Color(val)
        })
    });
    build.add(option, 'opacity1', 0, 1, 0.01).name('建筑透明1').onChange((val) => {
        const com = instance.getComponent({
            sort: 1
        });
        com.setMaterialValues('glass05', {
            opacity: parseFloat(val)
        })
    });
    build.add(option, 'opacity2', 0, 1, 0.01).name('建筑透明2').onChange((val) => {
        const com = instance.getComponent({
            sort: 1
        });
        com.setMaterialValues('glass06', {
            opacity: parseFloat(val)
        })
    });
    build.addColor(option, 'colorDiff').name('扩散颜色').onChange((val) => {
        const com = instance.getComponent({
            sort: 1
        });
        const M1 = com.getModel('Box01').material;
        const M2 = com.getModel('Box02').material;
        M1.shader.uniforms.uColor.value = new THREE.Color(val);
        M2.shader.uniforms.uColor.value = new THREE.Color(val);
    });
};