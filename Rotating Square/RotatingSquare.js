"use strict";

var canvas;
var gl;

var theta = 0.0;
var dtheta = 0.1;
var thetaLoc;
var speed = 1000;
var bufferId;
var vertices;


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    vertices = [
        vec2(0, 1),
        vec2(-1, 0),
        vec2(1, 0),
        vec2(0, -1)
    ];

    // Load the data into the GPU
    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    document.getElementById('speedval').onchange =
        function (event) {
            dtheta = Number(document.getElementById('speedval').value);
        }

    document.getElementById('dirBut').onclick =
        function (event) {
            dtheta *= -1;
        }

    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    setTimeout(function () {
        theta += dtheta;
        vertices[0] = vec2(Math.sin(theta), Math.cos(theta));
        vertices[1] = vec2(-Math.cos(theta), Math.sin(theta));
        vertices[2] = vec2(Math.cos(theta), -Math.sin(theta));
        vertices[3] = vec2(-Math.sin(theta), -Math.cos(theta));

        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
        render();
        //requestAnimFrame(render);
    }, 100);
}