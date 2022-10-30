#include './utils/noise.glsl'
#include './utils/rotate.glsl'

uniform float uTime;
uniform float uBassFreq;
uniform float uMediumFreq;
uniform float uIsEnabled;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

float getFbm(vec2 uv) {
  float n = fbm(vec3(uv, uTime * 0.1));
  n = noise(vec3(n) * 20.);
  n = smoothstep(0.2, 0.8, n);
  return n;
}

void main() {
  vec2 noiseUv = vUv;
  // noiseUv *= rotate2d(0. + uMediumFreq);

  float bassFreq = clamp(uBassFreq, 0., 1.);
  float mediumFreq = clamp(uMediumFreq, 0., 1.);

  vec3 c = snoise2D(vec2(noiseUv.x * 10., noiseUv.y  * 1.) + (uTime * .5) + 1. * bassFreq) * vec3(1.);
  vec3 firstColor = vec3(vUv, 1.);
  float mask = smoothstep(0.47, 0.55, vUv.y);
  c *= mask;
  // c = mix( vec3(0.), c, bassFreq);
  float startUv = smoothstep(0., 0.1, vUv.x);
  float endUv = smoothstep(0.9, 1., vUv.x);
  float maskUvSeam =  2.;
  maskUvSeam -= startUv;
  maskUvSeam -= 1. - endUv;

  vec3 secondaryColor = mix(uColor1, uColor2, vUv.x);
  c *= mix(firstColor, secondaryColor, mediumFreq);
  c *= 1. + 1. * mediumFreq;
  c *= abs(1. - maskUvSeam);
  gl_FragColor = vec4(vec3( c), uIsEnabled);
}