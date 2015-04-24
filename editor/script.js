var ax, run, canvas, gl, prg, uni, win, editor, mousePosition, fFront, fBack, fTemp;
var tPrg, tUni;

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
	var downloadButton = bid('button');
	downloadButton.addEventListener('click', downloadTemplete, true);
	var runButton = bid('bStart');
	runButton.addEventListener('click', init, true);
	var stopButton = bid('bStop');
	stopButton.addEventListener('click', function(){run = false;}, true);
	var shortenButton = bid('shorten');
	shortenButton.addEventListener('click', shorten, true);
	var uriBox = bid('uri');
	uriBox.addEventListener('click', function(){
		uriBox.focus();
		uriBox.select();
	});
	win = window;
	win.addEventListener('keydown', keydown, true);
	win.addEventListener('hashchange', setEditorSource, true);
};

function setShortenUri(uri){
	bid('uri').value = uri;
}

function shorten(){
	bid('shorten').disabled = true;
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", function(){setShortenUri(JSON.parse(xhr.response).id);}, true);
	xhr.open("POST", "https://www.googleapis.com/urlshortener/v1/url");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify({longUrl: window.location.href}));
}

function setEditorSource(){
	var fSource = decodeURIComponent(window.location.hash);
	fSource = fSource.slice(1).replace(/\r/, '');
	if(fSource && editor.getValue() !== fSource){
		editor.setValue(fSource);
		editor.gotoLine(1);
		init();
	}
}

function downloadTemplete(){
	bid('button').disabled = true;
	ax.requestPost('http://jp.wgld.org/js4kintro/script/download.php', {s: editor.getValue()});
}

function init(){
	var e, k;
	run = false;
	bid('button').disabled = true;
	bid('shorten').disabled = true;
	bid('uri').value = "";
	if(!canvas){canvas = bid('canvas');}
	if(!gl){gl = canvas.getContext('webgl');}
	canvas.width = 512;
	canvas.height = 512;
	canvas.addEventListener('mousemove', mouseMove, true);
	mousePosition = [0.0, 0.0];
	prg = gl.createProgram();
	var vSource = 'attribute vec3 p;void main(){gl_Position=vec4(p,1.);}';
	var fSource = editor.getValue().replace(/\r/gi, '');
	var encoded = encodeURIComponent(fSource);
	window.location.hash = encoded;
	if(!shader(prg, 0, vSource) && !shader(prg, 1, fSource)){
		gl.linkProgram(prg);
	}else{
		return;
	}
	e = gl.getProgramParameter(prg, gl.LINK_STATUS);
	if(!e){alert(gl.getProgramInfoLog(prg));return;}

	tPrg = gl.createProgram();
	vSource = bid('vs').textContent;
	fSource = bid('fs').textContent;
	shader(tPrg, 0, vSource); shader(tPrg, 1, fSource);
	gl.linkProgram(tPrg);

	bid('button').disabled = false;
	bid('shorten').disabled = false;
	setTimeout(function(){run = true; render();}, 100);
	function shader(p, i, j){
		k = gl.createShader(gl.VERTEX_SHADER - i);
		gl.shaderSource(k, j);
		gl.compileShader(k);
		if(!gl.getShaderParameter(k, gl.COMPILE_STATUS)){
			alert(gl.getShaderInfoLog(k));
			return;
		}
		gl.attachShader(p, k);
		return gl.getShaderInfoLog(k);
	}
}

function render(){
	var a, b, d, z;
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,0,-1,-1,0,1,1,0,1,-1,0]), gl.STATIC_DRAW);
	gl.useProgram(prg);
	uni = {};
	uni.mouse = gl.getUniformLocation(prg, 'm');
	uni.time = gl.getUniformLocation(prg, 't');
	uni.resolution = gl.getUniformLocation(prg, 'r');
	uni.sampler = gl.getUniformLocation(prg, 's');
	a = gl.getAttribLocation(prg, 'p');
	gl.uniform2fv(uni.resolution, [512, 512]);
	gl.uniform1i(uni.sampler, 0);

	gl.useProgram(tPrg);
	tUni = {};
	tUni.texture = gl.getUniformLocation(tPrg, 'texture');
	b = gl.getAttribLocation(tPrg, 'position');
	gl.uniform1i(tUni.texture, 0);

	fFront = create_framebuffer(canvas.width, canvas.height);
	fBack  = create_framebuffer(canvas.width, canvas.height);
	gl.activeTexture(gl.TEXTURE0);
	gl.clearColor(0, 0, 0, 1);
	gl.viewport(0, 0, 512, 512);
	z = new Date().getTime();
	(function(){
		if(!run){return;}
		d = (new Date().getTime() - z) * 0.001;
		gl.useProgram(prg);
		gl.bindFramebuffer(gl.FRAMEBUFFER, fFront.f);
		gl.bindTexture(gl.TEXTURE_2D, fBack.t);
		gl.enableVertexAttribArray(a);
		gl.vertexAttribPointer(a, 3, gl.FLOAT, false, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.uniform2fv(uni.mouse, mousePosition);
		gl.uniform1f(uni.time, d);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		gl.useProgram(tPrg);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, fFront.t);
		gl.enableVertexAttribArray(b);
		gl.vertexAttribPointer(b, 3, gl.FLOAT, false, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		gl.flush();
		fTemp = fFront;
		fFront = fBack;
		fBack = fTemp;
		requestAnimationFrame(arguments.callee);
	})();
}

function create_framebuffer(width, height){
	var frameBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
	var depthRenderBuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
	var fTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, fTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0);
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	return {f : frameBuffer, d : depthRenderBuffer, t : fTexture};
}

function mouseMove(eve){
	var i = 1 / 512;
	mousePosition = [
		(eve.clientX - canvas.offsetLeft) * i * 2.0 - 1.0,
		1.0 - (eve.clientY - canvas.offsetTop) * i * 2.0
	];
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


