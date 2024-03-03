attribute vec3 position;
uniform vec3 mvpMatrix;

void main(){
    gl_Position = mvpMatrix * vec4(position, 1.0);
}