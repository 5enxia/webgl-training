#version 300 es
precision highp float;
layout (location = 0) in vec2 position;
layout (location = 1) in vec2 velocity;

out vec4 vColor;

void main(){
    vColor = vec4(velocity, 1.0, 1.0);
    gl_Position = vec4(position, 0.0, 1.0);
    gl_PointSize = 1.0;
}