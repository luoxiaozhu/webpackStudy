import glUtil from '../../utils';

export default {
    createChassis(options) {
        const {
            radius = 100,
            position = new THREE.Vector3(),
            gradient = [
                'rgba(0,0,0,1)',
                'rgba(0,0,0,0.8)'
            ]
        } = options;
        const geometry = new THREE.CircleBufferGeometry(radius, 32);

        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false
        });

        // 替换物体的材质
        material.onBeforeCompile = (shader) => {
            const cColor1 = glUtil.getColorArr(gradient[0]);
            const cColor2 = glUtil.getColorArr(gradient[1]);

            shader.uniforms.uColor1 = {
                value: cColor1[0]
            };
            shader.uniforms.uColor2 = {
                value: cColor2[0]
            };
            shader.uniforms.uOpacity1 = {
                value: cColor1[1]
            };
            shader.uniforms.uOpacity2 = {
                value: cColor2[1]
            };
            shader.uniforms.uRadius = {
                value: radius
            };

            const fragment = `
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uRadius;
uniform float uOpacity1;
uniform float uOpacity2;
varying vec3 vPosition;

void main() {
    float _i = 1.0 - distance(vec2(.0, .0), vec2(vPosition.x, vPosition.y)) / uRadius;

    float baseOpacity = uOpacity1;
    if (_i <= 0.4) {
        baseOpacity = mix(uOpacity2, uOpacity1, _i * 2.5);
    }
    vec3 baseColor = mix(uColor2, uColor1, _i);
    `;

            const fragmentColor = 'gl_FragColor = vec4(baseColor, baseOpacity );';

            shader.fragmentShader = shader.fragmentShader.replace('void main() {', fragment);
            shader.fragmentShader = shader.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );', fragmentColor);

            const vertex = `varying vec3 vPosition;
void main() {
vPosition = position;`;
            shader.vertexShader = shader.vertexShader.replace('void main() {', vertex);
        };

        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        plane.position.copy(position);
        plane.renderOrder = 0;
        return plane;
    },
    // 生成扩散效果
    effectDiffusion(material, option) {
        const {
            center, color, radius, range, time, speed
        } = option;
        material.onBeforeCompile = (shader) => {
            material.shader = shader;
            // 效果中心点
            shader.uniforms.uCenter = {
                value: center
            };
            // 效果颜色
            shader.uniforms.uColor = {
                value: color
            };
            // 半径
            shader.uniforms.uRadius = {
                value: radius
            };
            // 范围
            shader.uniforms.uRange = {
                value: range
            };
            shader.uniforms.uSpeed = {
                value: speed
            };
            // time
            shader.uniforms.time = time;

            const fragment = `
uniform vec3 uCenter;
uniform vec3 uColor;

uniform float uRadius;
uniform float uRange;
uniform float uSpeed;
uniform float time;

varying vec3 vPosition;

float distanceTo(vec2 src, vec2 dst) {
    float dx = src.x - dst.x;
    float dy = src.y - dst.y;
    float dv = dx * dx + dy * dy;
    return sqrt(dv);
}

void main() {

    `;

            const fragmentColor = `
            float index = mod(time * uSpeed, 1.0);
            float len = distanceTo(vec2(.0, .0), vPosition.xy);

            float lenIndex = len / uRadius;
            if (lenIndex < index && lenIndex + uRange > index) {
                float i = (lenIndex + uRange - index) / uRange;
                i = sin(i * PI);
                outgoingLight = mix(outgoingLight, uColor, i);
            }
            gl_FragColor = vec4(outgoingLight, diffuseColor.a );`;

            shader.fragmentShader = shader.fragmentShader.replace('void main() {', fragment);
            shader.fragmentShader = shader.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );', fragmentColor);

            const vertex = `varying vec3 vPosition;
void main() {
    `;
            const vertexPosition = `
vec4 mvPosition = vec4( transformed, 1.0 );

#ifdef USE_INSTANCING

    mvPosition = instanceMatrix * mvPosition;

#endif
vPosition = mvPosition.xyz;
mvPosition = modelViewMatrix * mvPosition;

gl_Position = projectionMatrix * mvPosition;
`;
            shader.vertexShader = shader.vertexShader.replace('void main() {', vertex);
            shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', vertexPosition);
            // shader.vertexShader = shader.vertexShader.replace('vViewPosition = - mvPosition.xyz;', vertexPosition);
        };
    },

    // 上升线条线条
    effectRiseLine(material, option) {
        const {
            gap = 20, color, speed, time, width, opacity
        } = option;

        material.color.copy(color);

        material.onBeforeCompile = (shader) => {
            material.shader = shader;
            // 效果中心点
            shader.uniforms.uGap = {
                value: gap
            };
            // 效果颜色
            shader.uniforms.uColor = {
                value: color
            };
            shader.uniforms.uSpeed = {
                value: speed
            };
            shader.uniforms.uWidth = {
                value: width
            };
            shader.uniforms.uOpacity = {
                value: opacity
            };
            // time
            shader.uniforms.time = time;

            const fragment = `
uniform vec3 uColor;

uniform float uGap;
uniform float uSpeed;
uniform float uWidth;
uniform float uOpacity;
uniform float time;

varying vec3 vPosition;

float distanceTo(vec2 src, vec2 dst) {
    float dx = src.x - dst.x;
    float dy = src.y - dst.y;
    float dv = dx * dx + dy * dy;
    return sqrt(dv);
}

void main() {

    `;

            const fragmentColor = `
            float iTime = time * uSpeed;
            float showRange = mod(vPosition.z - iTime, uGap);
            if (showRange < 1.0 && vPosition.z < iTime) {
                diffuseColor.a = uOpacity * sin((1.0 - showRange) * PI);
            } else {
                diffuseColor.a = 0.0;
            }
            gl_FragColor = vec4(outgoingLight, diffuseColor.a );`;

            shader.fragmentShader = shader.fragmentShader.replace('void main() {', fragment);
            shader.fragmentShader = shader.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );', fragmentColor);

            const vertex = `varying vec3 vPosition;
void main() {
    `;
            const vertexPosition = `
vec4 mvPosition = vec4( transformed, 1.0 );

#ifdef USE_INSTANCING

    mvPosition = instanceMatrix * mvPosition;

#endif
vPosition = mvPosition.xyz;
mvPosition = modelViewMatrix * mvPosition;

gl_Position = projectionMatrix * mvPosition;
`;
            shader.vertexShader = shader.vertexShader.replace('void main() {', vertex);
            shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', vertexPosition);
            // shader.vertexShader = shader.vertexShader.replace('vViewPosition = - mvPosition.xyz;', vertexPosition);
        };
    },

    effectWaterial(material, option) {
        const {
            speed, time
        } = option;

        material.onBeforeCompile = (shader) => {
            shader.uniforms.time = time;
            shader.uniforms.uSpeed = { value: speed };
            const fragment = `
uniform float time;
uniform float uSpeed;

            const float hardness = 0.1;
            const int iterations = 4;
            const float speed = 1.5;
            const float intensity = 1.0;

            #define COMPLEX
            #define HASHSCALE4 vec4(1031, .1030, .0973, .1099)
            vec4 hash43(vec3 p)
{
    vec4 p4 = fract(vec4(p.xyzx)  * HASHSCALE4);
    p4 += dot(p4, p4.wzxy+19.19);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}

float drip(vec2 uv, vec2 pos, float age, float scale, float cells) {
    vec2 vD = vec2 (uv - pos);
    float fD = sqrt(dot (vD, vD)) * 2.0 * (cells/16.0);
    float fDa = 10.0 * fD;
    float freq = 300.0 * scale;
    return    max (0.0, 1.0 - fDa*fDa)
            * sin ((fD*freq - age*40.0*(scale*2.0-1.0))*hardness);
}

// Based on texture bombing: http://http.developer.nvidia.com/GPUGems/gpugems_ch20.html
float drops(vec2 uv, float cells) {
    float height = 0.0;
    vec2 cell = floor(uv * cells);
    for(int iter=0; iter<iterations; iter++) {
        for(int i = -1; i <= 1; i++) {
          for(int j = -1; j <= 1; j++) {
            vec2 cell_t = cell + vec2(i, j);
            vec2 uv_t = uv;
 #ifdef TILED
              // could be simplified...
              if (cell_t.x<0.0) {
                  cell_t.x += cells;
                  uv_t.x += 1.0;
              } else if (cell_t.x>cells-1.0) {
                  cell_t.x -= cells;
                  uv_t.x -= 1.0;
              }

              if (cell_t.y<0.0) {
                  cell_t.y += cells;
                  uv_t.y += 1.0;
              } else if (cell_t.y>cells-1.0) {
                  cell_t.y -= cells;
                  uv_t.y -= 1.0;
              }
 #endif
            vec4 rnd_t = hash43(vec3(cell_t, float(iter)));
            vec2 pos_t = (cell_t+rnd_t.xy)/cells;
            float age_t = (time * speed + rnd_t.z);
            float scale_t = rnd_t.w;
            height += drip(uv_t, pos_t, age_t, scale_t, cells);
          }
        }
    }
    return height;
}

float heightmap(vec2 uv) {
    float height = 0.0;
 #ifdef COMPLEX
    height += drops(uv, 32.0);
    height += drops(uv, 16.0);
    height += drops(uv, 8.0);
    height += drops(uv, 4.0);
    height += drops(uv, 2.0);
    height /= 8.0;
 #else
    height += drops(uv, 8.0);
    height += drops(uv, 4.0);
    height /= 5.0;
 #endif
    return height * intensity;
}

vec2 dudvmap(vec2 uv) {
    const float eps = 0.01;
    vec2 offset = vec2(eps, 0.0);
    return vec2(
        heightmap(uv+offset.xy) - heightmap(uv-offset.xy),
        heightmap(uv+offset.yx) - heightmap(uv-offset.yx)
    );
}

            void main() {
                vec2 _uv = vUv;

                float height = heightmap(_uv);

                vec2 dudv = dudvmap(_uv) * uSpeed;
            `;

            shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `

            #ifdef USE_MAP

                vec4 texelColor = texture2D( map, vUv + dudv * 0.015 );

                texelColor = mapTexelToLinear( texelColor );
                diffuseColor *= texelColor;

            #endif
            `);
            shader.fragmentShader = shader.fragmentShader.replace('void main() {', fragment);
            shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', `

#ifdef OBJECTSPACE_NORMALMAP

    normal = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0; // overrides both flatShading and attribute normals

    #ifdef FLIP_SIDED

        normal = - normal;

    #endif

    #ifdef DOUBLE_SIDED

        normal = normal * faceDirection;

    #endif

    normal = normalize( normalMatrix * normal );

#elif defined( TANGENTSPACE_NORMALMAP )

    vec3 mapN = texture2D( normalMap, vUv + dudv * 0.01 ).xyz * 2.0 - 1.0;
    mapN.xy *= normalScale;

    #ifdef USE_TANGENT

        normal = normalize( vTBN * mapN );

    #else

        normal = perturbNormal2Arb( -vViewPosition, normal, mapN, faceDirection );

    #endif

#elif defined( USE_BUMPMAP )

    normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd(), faceDirection );

#endif
`);

            // shader.fragmentShader = shader.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );', fragmentColor);
            //     const vertexUv = ``;
            // shader.vertexShader = shader.vertexShader.replace('#include <uv_vertex>', vertexUv);

            shader.vertexShader = `
            #define STANDARD

            varying vec3 vViewPosition;

            #ifndef FLAT_SHADED

                varying vec3 vNormal;

                #ifdef USE_TANGENT

                    varying vec3 vTangent;
                    varying vec3 vBitangent;

                #endif

            #endif

            #ifdef USE_TRANSMISSION

                varying vec4 vWorldPosition;

            #endif

            #include <common>

            varying vec2 vUv;
            varying vec2 tUv;
            uniform mat3 uvTransform;

            #include <uv2_pars_vertex>
            #include <displacementmap_pars_vertex>
            #include <color_pars_vertex>
            #include <fog_pars_vertex>
            #include <morphtarget_pars_vertex>
            #include <skinning_pars_vertex>
            #include <shadowmap_pars_vertex>
            #include <logdepthbuf_pars_vertex>
            #include <clipping_planes_pars_vertex>

            void main() {

                vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
                #include <uv2_vertex>
                #include <color_vertex>

                #include <beginnormal_vertex>
                #include <morphnormal_vertex>
                #include <skinbase_vertex>
                #include <skinnormal_vertex>
                #include <defaultnormal_vertex>

            #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED

                vNormal = normalize( transformedNormal );

                #ifdef USE_TANGENT

                    vTangent = normalize( transformedTangent );
                    vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );

                #endif

            #endif

                #include <begin_vertex>
                #include <morphtarget_vertex>
                #include <skinning_vertex>
                #include <displacementmap_vertex>
                #include <project_vertex>
                #include <logdepthbuf_vertex>
                #include <clipping_planes_vertex>

                vViewPosition = - mvPosition.xyz;

                #include <worldpos_vertex>
                #include <shadowmap_vertex>
                #include <fog_vertex>

            #ifdef USE_TRANSMISSION

                vWorldPosition = worldPosition;

            #endif
            }
            `;
            // shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', vertexPosition);
        };
    },

    replaceWater(mesh, option) {
        const water = new THREE.Water(
            mesh.geometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: option.waterNormals,
                sunDirection: new THREE.Vector3(),
                sunColor: new THREE.Color('#FFFBAD'),
                waterColor: new THREE.Color(option.waterColor || '#6A715E'),
                distortionScale: 20,
                fog: false
            }
        );
        water.position.copy(mesh.position);
        water.rotation.copy(mesh.rotation);
        water.scale.copy(mesh.scale);
        return water;
    }
};
