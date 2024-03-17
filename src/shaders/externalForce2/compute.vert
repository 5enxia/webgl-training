#version 300 es
precision highp float;
layout(location = 0) in vec2 position;

uniform vec2 mouse; // -1.0 ~ 1.0
uniform vec2 force; // -1.0 ~ 1.0
uniform sampler2D velocity;

out vec2 vVelocity;

void main() {
    gl_Position = vec4(position, 0.0, 1.0);
    float p = 1.0 - min(length(mouse - position), 1.0);
    // p *= p;
    vec2 uv = position * 0.5 + 0.5;
    vec2 vel = texture(velocity, uv).xy;
    // vVelocity = vel + vec2(p * force);
    vVelocity = vec2(p * force);
    gl_PointSize = 1.0;
}