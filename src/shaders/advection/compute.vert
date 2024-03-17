#version 300 es
precision highp float;
layout(location = 0) in vec2 position;

// uniform
uniform sampler2D velocity;
uniform float dt;

// out
out vec2 vVelocity;

void main() {
    gl_Position = vec4(position, 0.0f, 1.0f);

    vec2 uv = position * 0.5f + 0.5f;
    vec2 vel = texture(velocity, uv).xy;
    vec2 uv2 = uv - vel * dt;
    vVelocity = texture(velocity, uv2).xy;

    gl_PointSize = 1.0f;
}
