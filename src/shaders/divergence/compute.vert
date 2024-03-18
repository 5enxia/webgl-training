#version 300 es
precision highp float;
layout (location = 0) in vec2 position;

uniform sampler2D velocity;
uniform float dt;
const vec2 px = vec2(1.0 / 512.0);    

out vec4 divergence;

void main(){
    vec2 uv = position * 0.5 + 0.5;
    float x0 = texture(velocity, uv-vec2(px.x, 0)).x;
    float x1 = texture(velocity, uv+vec2(px.x, 0)).x;
    float y0 = texture(velocity, uv-vec2(0, px.y)).y;
    float y1 = texture(velocity, uv+vec2(0, px.y)).y;
    float div = (x1-x0 + y1-y0) / 2.0;

    divergence = vec4(div / dt);
}