precision highp float;

uniform float uAlpha;
in float vHeight;
in vec3 vWorld;
out vec4 outColor;

void main() {
  vec3 normal = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  
  // Strict 142-degree cold laboratory light source matching photographic mass
  vec3 lightDirection = normalize(vec3(-0.45, 0.78, 0.42));
  float light = 0.25 + 0.75 * max(dot(normal, lightDirection), 0.0);

  // Sharp analytical elevation contour lines (0.2m intervals)
  float contourDistance = abs(fract((vHeight + 2.0) * 4.0) - 0.5);
  float contour = 1.0 - smoothstep(0.015, 0.045, contourDistance);

  // Analytical Slate Tokens: Void Obsidian to Cold Calcified Contour
  vec3 voidSlate = vec3(0.027, 0.031, 0.043);    // #07080B
  vec3 chalkContour = vec3(0.925, 0.937, 0.961); // #ECEFF5
  vec3 cobaltSignal = vec3(0.176, 0.357, 1.000); // #2D5BFF

  vec3 surfaceColor = mix(voidSlate, chalkContour, 0.06 + 0.64 * contour);
  
  if (vHeight > 1.25) {
    surfaceColor = mix(surfaceColor, cobaltSignal, 0.35);
  }

  vec3 finalRgb = surfaceColor * light;
  outColor = vec4(finalRgb, uAlpha);
}
