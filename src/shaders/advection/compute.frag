#version 300 es
precision highp float;

// in
in vec2 vVelocity;
// out
out vec4 outColor;

void main() {
   outColor = vec4(vVelocity, 0.0f, 0.0f);
}