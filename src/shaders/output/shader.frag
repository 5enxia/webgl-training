#version 300 es
precision highp float;

uniform sampler2D velocity;

out vec4 outColor;

void main(){
    // vec2 pos = position * 0.5 + 0.5;
    vec2 pos = gl_FragCoord.xy / 512.0;
    vec2 vel = texture(velocity, pos).xy;
    vec4 vColor = vec4(abs(vel), 0.0, 1.0);
    outColor = vColor;
}