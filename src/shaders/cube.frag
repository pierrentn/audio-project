#include './utils/noise.glsl'
#include './utils/rotate.glsl'
#include './utils/math.glsl'

#define PI 3.141592653

varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;

// vec3 getColorPalette () {}

void main() {
  float gridEdge = 0.9;
  float gridLines = 50.;
  vec2 uvGrid = vec2(mod(vUv.x * gridLines, 1.), mod(vUv.y * gridLines, 1.));
  float grid = step(gridEdge, uvGrid.x);
  grid += step(gridEdge, uvGrid.y);
  grid = 1. - grid;
  grid = clamp(grid, 0., 1.);
  // uvGrid -= grid;

  // float n1 = snoise2D(vec2((vUv.y * 10.) * (vUv.x * 10.), uTime));
  float n1 = noise(vec3(vUv * 10., uTime));
  vec2 uv = vec2(vUv.x * 1., vUv.y * 1.);
  float n2 = snoise2D((vec2(n1) + sin(uTime)));

  float waves = 0.;
  // vec2 uvWaves = sin(vec2(vUv.x * 50., vUv.y * 50. + uTime * 5.)); 
  // vec2 uvWaves = vUv + vUv * (sin(vUv.y + uTime) * 1.); 
  float uvWaveSinFreq = 10. + sin(uTime) * 2.;
  float uvWaveSpeed = 7.;
  float uvWaveAmp = 0.2;
  vec2 uvWaves = vec2(vUv.x, vUv.y); 
  // uvWaves.x += sin(vUv.y * uvWaveSinFreq + (uTime * uvWaveSpeed)) * uvWaveAmp;
  // uvWaves.x = sin(uvWaves.x * 2.);
  // uvWaves.y += uTime;
  for(int i = 0; i < 20; i++) {
    float reMappedI = map(float(i), 0., 10., -float(i), float(i));
    float offsetTime = sin(uTime) + (0.2 * reMappedI);

    // float newOffset 
    float newWave = step(sin(uvWaves.x), 0.02 + 0.05 * (float(i) + offsetTime));
    newWave -= step(sin(uvWaves.x), 0.01  + 0.05 * (float(i) + offsetTime));
    waves += newWave;
  }
  // waves = sin(snoise2D(waves * uv * uTime));
  // waves = sin(snoise2D(vecwaves * uTime));

  // vec3 c = (n2 * vec3(vUv, 1.) * 2.);
  vec3 c = (n2 * vec3( 1.) * 2.);
  // c = vec3(.5, 0.5, .5);
  c = mix(c, abs(n1 / n2) * vec3(1.), step(0.1, waves));
  c = vec3(n1 / n2);

  // vec2 uvSecondPattern = vec2(floor(vUv.x * 10.) / 10., floor(vUv.y * 10.) / 10.);
  // c = vec3(noise(vec3(uvSecondPattern, 1.)));
  c *= grid;

  uvGrid -= (1. - grid);
  float gridColorNoise = clamp(snoise2D(vUv * .5 + uTime * .2), 0., 1.) * 1.5;
  vec2 gridColorOff = vec2(smoothstep(1. - 0.5 * gridColorNoise, 1., uvGrid.x), smoothstep(1. - 0.5 * gridColorNoise, 1., uvGrid.y));
  // c = vec3(0., 0., 0.);
  // c+=grid;
  // c= vec3(0.);
  c += (gridColorOff.x + gridColorOff.y) * vec3(0., 0., .35);


  gl_FragColor = vec4(c, 1.);
  // gl_FragColor = vec4(vec3(gridColorOff.x + gridColorOff.y), 1.);
  gl_FragColor = vec4(vec3(waves), 1.);
}