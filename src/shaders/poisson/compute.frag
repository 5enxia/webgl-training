#version 300 es
precision highp float;

uniform sampler2D pressure;
uniform sampler2D divergence;
const vec2 px = vec2(1.0 / 512.0);    

out vec4 outColor;

void main(){
    // vec2 uv = gl_FragCoord.xy / 512.0 * 2.0 - 1.0;
    vec2 uv = gl_FragCoord.xy / 512.0;
    // poisson equation
    float p0 = texture(pressure, uv+vec2(px.x * 2.0,  0)).x;
    float p1 = texture(pressure, uv-vec2(px.x * 2.0, 0)).x;
    float p2 = texture(pressure, uv+vec2(0, px.y * 2.0 )).x;
    float p3 = texture(pressure, uv-vec2(0, px.y * 2.0 )).x;
    float div = texture(divergence, uv).x;
    
    float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
    outColor = vec4(newP);
}