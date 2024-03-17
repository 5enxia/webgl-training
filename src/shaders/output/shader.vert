#version 300 es
precision highp float;
layout (location = 0) in vec2 position;

uniform sampler2D velocity;

out vec4 vColor;

void main(){
    vec2 pos = position * 0.5 + 0.5;
    vec2 vel = texture(velocity, pos).xy;
    vColor = vec4(vel, 0.1, 1.0);
    gl_Position = vec4(position, 0.0, 1.0);
    gl_PointSize = 1.0;
}