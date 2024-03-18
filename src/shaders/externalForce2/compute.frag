#version 300 es
precision highp float;

uniform vec2 mouse; // -1.0 ~ 1.0
uniform vec2 force; // -1.0 ~ 1.0
uniform sampler2D velocity;

out vec4 outColor;

void main(){
   vec2 position = gl_FragCoord.xy / 512.0 * 2.0 - 1.0;
    float p = 1.0 - min(length(mouse - position), 1.0);
    p *= p;
    vec2 uv = position * 0.5 + 0.5;
    vec2 vel = texture(velocity, uv).xy;
    vec2 vVelocity = vel + vec2(p * force);
   // vec2 vVelocity = vec2(p * force);
   outColor = vec4(vVelocity, 1.0, 1.0);
}