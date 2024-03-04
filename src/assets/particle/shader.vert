#version 300 es
precision highp float;
layout (location = 0) in vec3 position;
layout (location = 1) in vec3 velocity;
layout (location = 2) in vec4 color;

// uniform mat4 vpMatrix;
// uniform float move;

out vec4 vColor;

void main(){
    vColor = color + vec4(velocity, 0.0);
    // gl_Position = vpMatrix * vec4(position, 1.0);
    gl_Position = vec4(position, 1.0);
    // gl_PointSize = 1.0 * (1.0 + move);
    gl_PointSize = 1.0;
}