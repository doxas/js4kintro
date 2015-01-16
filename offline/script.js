var ax, run, canvas, gl, prg, uni, win, editor;

window.onload = function(){
	editor = ace.edit("editor");
	editor.setTheme("ace/theme/vibrant_ink");
	editor.getSession().setMode("ace/mode/glsl");
	editor.commands.addCommand({
		name: 'cmd',
		bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
		exec: function(editor){init();}
	});
	editor.getSession().on('change', function(e){
		bid('fsCount').textContent = editor.getValue().length;
		bid('htmlCount').textContent = editor.getValue().length + 1256;
	});
	editor.getSession().setUseSoftTabs(false);
	bid('editor').style.fontSize = '14px';
	setEditorSource();
	var runButton = bid('bStart');
	runButton.addEventListener('click', init, true);
	var stopButton = bid('bStop');
	stopButton.addEventListener('click', function(){run = false;}, true);
	win = window;
	win.addEventListener('keydown', keydown, true);
	editor.focus();
};

function setEditorSource(){
	var fSource = decodeURIComponent(window.location.hash);
	fSource = fSource.slice(1).replace(/\r/, '');
	if(fSource && editor.getValue() !== fSource){
		editor.setValue(fSource);
		editor.gotoLine(1);
		init();
	}
}

function init(){
	var e, k;
	run = false;
	if(!canvas){canvas = bid('canvas');}
	if(!gl){gl = canvas.getContext('webgl');}
	canvas.width = 512;
	canvas.height = 512;
	prg = gl.createProgram();
	var vSource = 'attribute vec3 p;void main(){gl_Position=vec4(p,1.);}';
	var fSource = editor.getValue().replace(/\r/gi, '');
	if(!shader(0, vSource) && !shader(1, fSource)){
		gl.linkProgram(prg);
	}else{
		return;
	}
	e = gl.getProgramParameter(prg, gl.LINK_STATUS);
	if(!e){alert(gl.getProgramInfoLog(prg));return;}
	gl.useProgram(prg);
	setTimeout(function(){run = true; render();}, 100);
	function shader(i, j){
		k = gl.createShader(gl.VERTEX_SHADER - i);
		gl.shaderSource(k, j);
		gl.compileShader(k);
		if(!gl.getShaderParameter(k, gl.COMPILE_STATUS)){
			alert(gl.getShaderInfoLog(k));
			return;
		}
		gl.attachShader(prg, k);
		return gl.getShaderInfoLog(k);
	}
}

function render(){
	var a, d, z;
	uni = {};
	uni.time = gl.getUniformLocation(prg, 'time');
	uni.resolution = gl.getUniformLocation(prg, 'resolution');
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,0,-1,-1,0,1,1,0,1,-1,0]), gl.STATIC_DRAW);
	a = gl.getAttribLocation(prg, 'p');
	gl.enableVertexAttribArray(a);
	gl.vertexAttribPointer(a, 3, gl.FLOAT, false, 0, 0);
	gl.clearColor(0, 0, 0, 1);
	gl.viewport(0, 0, 512, 512);
	z = new Date().getTime();
	(function(){
		if(!run){return;}
		d = (new Date().getTime() - z) * 0.001;
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.uniform1f(uni.time, d);
		gl.uniform2fv(uni.resolution, [512, 512]);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		gl.flush();
		requestAnimationFrame(arguments.callee);
	})();
}

function keydown(eve){run = (eve.keyCode !== 27);}

function bid(id){return document.getElementById(id);}

