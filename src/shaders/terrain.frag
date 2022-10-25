#include './utils/noise.glsl'
#include './utils/math.glsl'

uniform float uNAmplitude;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying float vDist;
varying float vNoise;

void main() {
  float dist = 1. - distance(vec2(0.5), vUv);
  dist = (dist - 0.7) * 5.; 
  // dist = smoothstep(0.05, 0.4, dist);
  vec3 c = vec3(1.);
  float noise = snoise2D(vUv );
  c = mix(vec3(0.05), vec3(0.1), dist);
  c = vec3(dist);

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
  gl_FragColor = vec4(c, 1.0);
}