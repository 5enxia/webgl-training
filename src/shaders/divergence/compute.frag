#version 300 es
precision highp float;

in vec4 divergence;
out vec4 outColor;

void main(){
    outColor = divergence;
}