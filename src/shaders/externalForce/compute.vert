#version 300 es
precision highp float;
layout(location = 0) in vec2 position;
layout(location = 1) in vec2 velocity;

uniform vec2 mouse; // -1.0 ~ 1.0
uniform float force; // -1.0 ~ 1.0

out vec2 vPosition;
out vec2 vVelocity;

void main() {
    vPosition = position;
    // vec2 p = mouse - position;
    // vVelocity = normalize(velocity + p * force);
    float p = 1.0 - min(length(mouse - position), 1.0);
    vVelocity = vec2(p) * force;
}