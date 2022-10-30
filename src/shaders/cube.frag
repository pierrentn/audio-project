#include './utils/noise.glsl'
#include './utils/rotate.glsl'
#include './utils/math.glsl'

#define PI 3.141592653

varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;
uniform sampler2D uGradient;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform float uHightFreq;
uniform float uBassFreq;

// vec3 getColorPalette () {}
float getFbm(vec2 uv, float uvModifier) {
  float n = fbm(vec3(uv, uTime * 0.1 + uvModifier));
  n = noise(vec3(n) * 20. + 10. * uvModifier);
  n = smoothstep(0.2, 0.8, n);
  return n;
}

void main() {
  float gridEdge = 0.9;
  float gridLines = 30.;
  vec2 uvGrid = vec2(mod(vUv.x * gridLines, 1.), mod(vUv.y * gridLines, 1.));
  float grid = step(gridEdge, uvGrid.x);
  grid += step(gridEdge, uvGrid.y);
  grid = 1. - grid;
  grid = clamp(grid, 0., 1.);
  uvGrid -= (1. - grid);

  float n1 = noise(vec3(vUv * 5., uTime * .25));
  vec2 uv = vec2(vUv.x * 1., vUv.y * 1.);
  float n2 = snoise2D((vec2(n1) + sin(uTime)));

  float waves = 0.;
  float uvWaveSinFreq = .5;
  float uvWaveSpeed = .1;
  float uvWaveAmp = .5;
  vec2 uvWaves = vec2(vUv.x, vUv.y); 
  // uvWaves.x += sin(vUv.y * uvWaveSinFreq + (uTime * uvWaveSpeed)) * uvWaveAmp;
  uvWaves.x += snoise2D(vec2(vUv.y * (uvWaveSinFreq + snoise2D(vec2(vUv.y * .5))) + (uTime * uvWaveSpeed))) * uvWaveAmp;

  for(int i = 0; i < 10; i++) {
    float reMappedI = map(float(i), 0., float(i), -float(i), float(i));
    float offsetTime = cos(uTime) * (0.5 * reMappedI);

    // float newOffset 
    float newWave = step(uvWaves.x, 0.1 + 0.2 * (float(i)));
    // float newWave = step(sin(uvWaves.x), 0.02 + 0.05 * (float(i) + offsetTime * .5));
    newWave -= step(uvWaves.x, 0.01  + 0.2 * (float(i)));
    // newWave -= step(sin(uvWaves.x), 0.01  + 0.05 * (float(i) + offsetTime * .5));
    waves += newWave;
  }
  // waves = sin(snoise2D(waves * uv * uTime));
  // waves = sin(snoise2D(vecwaves * uTime));

  vec3 gradientTexture = texture2D(uGradient, vUv).rgb;

  // vec3 c = (n2 * vec3( 1.) * 2.);
  // c = mix(c, abs(n1 / n2) * vec3(1.), step(0.1, waves));

  vec3 c = (vec3(n1 / n2) * gradientTexture) * waves; 

  c *= grid;

  float gridColorNoise = clamp(snoise2D(vUv * .5 + uTime * .2), 0., 1.) * 1.5;
  vec2 gridColorOff = vec2(smoothstep(0.8, 1., uvGrid.x), smoothstep(0.8, 1., uvGrid.y));
  c += (gridColorOff.x + gridColorOff.y) * vec3(1.);

  float fnoise1 = getFbm(vUv, 1. * uBassFreq);
  float fnoise2 = getFbm(uvWaves, 1. * pow(uHightFreq, 2.));

  vec3 fn1Color = mix(uColor1, uColor2, fnoise1);
  fn1Color -= 1. - step(0.05, fnoise1);

  vec3 fn2Color = mix(uColor3, uColor4, fnoise1);
  fn2Color -= 1. - step(0.05, fnoise2);
  vec3 mixFNColor = mix(fn1Color, fn2Color, uHightFreq);
  mixFNColor += (gridColorOff.x + gridColorOff.y) * vec3(1.);
  // c = mix(mixFNColor, c, step(0.05, c));
  mixFNColor = mix(mixFNColor, mixFNColor * vec3(.4), 1. - grid);

  // gl_FragColor = vec4(c, 1.);
  // gl_FragColor = vec4(vec3(gridColorOff.x + gridColorOff.y), 1.);
  gl_FragColor = vec4(vec3( mixFNColor), 1.);
}