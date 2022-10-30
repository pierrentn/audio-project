#include './utils/noise.glsl'

uniform float uNFrequency;
uniform float uTime;
uniform float uBeat;
uniform float uNAmplitude;

varying float vDist;
varying vec2 vUv;
varying vec3 vNormal;
varying float vNoise;

void main() {
  float dist = distance(vec2(0.5), uv);
  dist = smoothstep(0.1, 0.2, dist);

  //Noise
  float nFrequency = uNFrequency;
  float nAmpl = uNAmplitude;
  float n = max(0., fbm((position + (uTime * (2. + .5))) * nFrequency));
  n = (n * dist) * nAmpl;
  vec3 nPos = position;
  nPos.z += n * (0.5 + 0.5 * uBeat);

  vUv = uv;
  vDist = dist;
  vNoise = n;
  vNormal = normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(nPos, 1.0);
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}