precision highp float;

uniform float uProgress;
uniform float uAmplitude;

out float vHeight;
out vec3 vWorld;

const float TAU = 6.28318530718;

void main() {
  vec3 displaced = position;
  vec2 p = position.xy / 4.0;

  float ridgeA = sin(dot(p, vec2(1.35, 0.55)) * TAU + uProgress * 4.0);
  float ridgeB = 0.5 * sin(dot(p, vec2(-0.70, 1.60)) * TAU * 2.0 - uProgress * 2.5);

  float radius = length(p);
  float radial = exp(-1.35 * dot(p, p));
  float radialWave = sin(8.0 * radius - uProgress * 5.0);

  float counter = smoothstep(0.30, 0.36, uProgress) * (1.0 - smoothstep(0.48, 0.54, uProgress));
  float settle = 1.0 - smoothstep(0.82, 0.94, uProgress);

  float z = uAmplitude * (0.35 + 0.65 * settle) * (
    0.65 * ridgeA +
    0.35 * ridgeB +
    1.20 * radial * radialWave -
    0.35 * counter * ridgeA
  );

  displaced.z += z;
  vHeight = z;
  vWorld = (modelMatrix * vec4(displaced, 1.0)).xyz;
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
