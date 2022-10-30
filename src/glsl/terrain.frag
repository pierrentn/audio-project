#include './utils/noise.glsl'
#include './utils/math.glsl'

uniform float uNAmplitude;
uniform float uTime;
uniform float uHightFreq;

varying vec2 vUv;
varying vec3 vNormal;
varying float vDist;
varying float vNoise;
uniform vec3 uColor1;
uniform vec3 uColor2;

void main() {
  float dist = 1. - distance(vec2(0.5), vUv);
  dist = (dist - 0.5) * 2.; 
  // dist = smoothstep(0.05, 0.4, dist);
  vec3 c = vec3(1.);
  float noise = snoise2D(vUv );
  c = mix(vec3(0.05), vec3(0.1), dist);
  c = vec3(dist);

  vec4 mask = mix(vec4(0.), vec4(1.), vec4(dist));

  vec4 colors = vec4(mix(uColor1, uColor2, vUv.x), 1.);
  colors = mix(vec4(.8) + uHightFreq * .8, colors, uHightFreq);
  colors *= mask;

  // if(finalColors == vec4(0.)) {
  //   discard;
  // }
  // float vertexNoise = map(0., 1., 0., 7., vNoise);
  // vertexNoise = smoothstep(1. + sin(uTime), 5., vertexNoise);
  // c = vec3(mix(0.09, 1., vertexNoise));
  // c = vec3(vNoise);

  // if(c == vec3(1.)) {
  //   c = vec3(1., 0., 0.);
  // }
  // c = vec3(vertexNoise);
  // c += noise;
  // c = vec3(vNoise);
  // c = vec3(vUv, 1.);
  // discard;
  // gl_FragColor = vec4(finalColors.rgb, 1.);
  gl_FragColor = vec4(colors);
}