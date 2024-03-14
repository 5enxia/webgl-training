#version 300 es
precision highp float;
layout(location = 0) in vec2 position;
layout(location = 1) in vec2 velocity;
layout(location = 2) in vec4 color;

uniform float time;
uniform vec2 mouse; // -1.0 ~ 1.0
uniform float move; // 0.0 ~ 1.0

out vec2 vPosition;
out vec2 vVelocity;
out vec4 vColor;

void main() {
    vPosition = position + velocity * 0.1 * move;
    // vec3 p = vec3(mouse, sin(time) * 0.25) - position;
    vec2 p = mouse - position;
    vVelocity = normalize(velocity + p * 0.2 * move);
    vColor = color;
}