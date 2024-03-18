#version 300 es
precision highp float;

// uniform
uniform sampler2D velocity;
uniform float dt;

// out
out vec4 outColor;

void main() {
   vec2 uv = gl_FragCoord.xy / 512.0f;
   vec2 vel = texture(velocity, uv).xy;
   vec2 uv2 = uv - vel * dt;
   vec2 vVelocity = texture(velocity, uv2).xy;
   outColor = vec4(vVelocity, 0.0f, 0.0f);
}