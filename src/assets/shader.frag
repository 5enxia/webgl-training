precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
    vec2 m = vec2(mouse.x * 2.0 - 1.0, 1.0 - mouse.y * 2.0);
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    // x座標が大きいほど赤y座標が大きいほど緑になる
    // vec2 color = (vec2(1.0) + p.xy) * 0.5;
    float t = sin(length(m - p) * 30.0 + time * 2.0);
    // float t = sin(length(m - p) * 30.0 + 1.0 * 5.0);
    // カラーを設定
    gl_FragColor = vec4(vec3(t), 1.0);
}