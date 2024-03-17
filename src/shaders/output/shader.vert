#version 300 es
precision highp float;
layout (location = 0) in vec2 position;

uniform sampler2D velocity;

out vec4 vColor;

void main(){
    vec2 vel = texture(velocity, position).xy;
    vColor = vec4(vel, 0, 1.0);
    gl_Position = vec4(position, 0.0, 1.0);
    gl_PointSize = 1.0;
}