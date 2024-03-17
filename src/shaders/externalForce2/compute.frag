#version 300 es
precision highp float;

in vec2 vVelocity;
out vec4 outColor;

void main(){
   outColor = vec4(vVelocity, 1.0, 1.0);
}