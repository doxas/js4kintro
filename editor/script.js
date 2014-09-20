var ax, run, canvas, gl, prg, uni, win, editor;

window.onload = function(){
	editor = ace.edit("editor");
	editor.setTheme("ace/theme/vibrant_ink");
	editor.getSession().setMode("ace/mode/glsl");
	editor.commands.addCommand({
		name: 'cmd',
		bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
		exec: function(editor){init();}
	});
	editor.getSession().on('change', function(e){
		bid('fsCount').textContent = editor.getValue().length;
		bid('htmlCount').textContent = editor.getValue().length + 1256;
	});
	editor.getSession().setUseSoftTabs(false);
	bid('editor').style.fontSize = '14px';
	ax = new Ajax(function(){
		var r = ax.getResponse();
		if(r != null){
			if(r !== 'bad request'){
				var a = document.createElement('a');
				a.download = 'index.html';
				a.href = 'http://jp.wgld.org/js4kintro/file/index_' + r + '.html';
				a.click();
			}
		}
	});
	ax.initialize();
	var button = bid('button');
	button.addEventListener('click', downloadTemplete, true);
	win = window; win.addEventListener('keydown', keydown, true);
	run = false;
};

function downloadTemplete(){
	bid('button').disabled = true;
	ax.requestPost('http://jp.wgld.org/js4kintro/script/download.php', {s: editor.getValue()});
}

function init(){
	var e, k;
	run = false;
	bid('button').disabled = true;
	if(!canvas){canvas = bid('canvas');}
	if(!gl){gl = canvas.getContext('webgl');}
	canvas.width = 512;
	canvas.height = 512;
	prg = gl.createProgram();
	var vSource = 'attribute vec3 p;void main(){gl_Position=vec4(p,1.);}';
	var fSource = editor.getValue();
	if(!shader(0, vSource) && !shader(1, fSource)){
		gl.linkProgram(prg);
	}else{
		return;
	}
	e = gl.getProgramParameter(prg, gl.LINK_STATUS);
	if(!e){alert(gl.getProgramInfoLog(prg));return;}
	gl.useProgram(prg);
	run = true;
	bid('button').disabled = false;
	render();
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
	uni.time = gl.getUniformLocation(prg, 't');
	uni.resolution = gl.getUniformLocation(prg, 'r');
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

function Ajax(callBackFunction){
	var response = '';
	this.h;
	this.initialize = function(){
		if(window.XMLHttpRequest){this.h = new XMLHttpRequest();}
		if(this.h){
			response = '';
			return true;
		}else{
			return false;
		}
	};
	if(callBackFunction != null){
		this.callBack = function(){
			if(this.readyState === 4){
				response = this.responseText;
				callBackFunction();
			}
		};
	}else{
		this.callBack = undefined;
	}
	this.requestPost = function(url, param){
		var s = '';
		if(!this.h){return false;}
		if(param){s = this.convertParam(param);}
		this.h.abort();
		this.h.open('post', url, true);
		if(this.callBack != null){
			this.h.onreadystatechange = this.callBack;
		}
		this.h.setRequestHeader('X-From', location.href);
		this.h.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		this.h.send(s);
	};
	this.getResponse = function(){
		return response;
	};
	this.convertParam = function(paramArray){
		var param = new Array();
		for(var v in paramArray){
			var s = encodeURIComponent(v).replace(/%20/g, '+');
			s += '=' + encodeURIComponent(paramArray[v]).replace(/%20/g, '+');
			param.push(s);
		}
		s = param.join('&');
		return s;
	};
}


