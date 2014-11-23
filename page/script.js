var run, entryCount, entrySource;

window.onload = function(){
	var e, i, r, s, t;
	var eEntries = document.getElementById('section').childNodes;
	entryCount = 0;
	entrySource = new Array();
	for(i = 0; i < eEntries.length; i++){
		if(eEntries[i] != null){
			if(eEntries[i].className != null){
				if(eEntries[i].className === 'entry'){
					t = zeroPadding(entryCount, 3);
					s = document.getElementById(t).textContent;
					if(s != null && s !== ''){
						e = document.getElementById('image' + t);
						e.addEventListener('click', runShader, true);
						entrySource[entryCount] = s;
						entryCount++;
					}
				}
			}
		}
	}
	window.addEventListener('keydown', stopShader, true);
	e = document.getElementById('menuButton');
	e.addEventListener('click', stopShader, true);
	e = document.getElementById('targetSource');
	run = false;
	r = Math.floor(Math.random() * entryCount);
	if(r === 6){r = 0;}
	e.value = r;
	shader(entrySource[r]);
};

function zeroPadding(num, range){
	if(('' + num).length > range){return '' + num;}
	var a = new Array(range).join('0');
	return (a + num).substr(-range);
}

function shader(source){
	var a, c, d, e, f, g, h, p, t, u, v, x, y, z;
	c = document.getElementById('canvas');
	g = c.getContext('webgl');
	p = g.createProgram();
	h = function(i, j){
		k = g.createShader(g.VERTEX_SHADER - i);
		g.shaderSource(k, j);
		g.compileShader(k);
		g.attachShader(p, k);
		return g.getShaderInfoLog(k);
	}
	if(!h(0, 'attribute vec3 p;void main(){gl_Position=vec4(p,1.);}') && !h(1, source)){g.linkProgram(p);}
	e = g.getProgramParameter(p, g.LINK_STATUS);
	g.useProgram(p);
	u = {};
	u.time = g.getUniformLocation(p, 't');
	u.resolution = g.getUniformLocation(p, 'r');
	g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
	g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1,1,0,-1,-1,0,1,1,0,1,-1,0]), g.STATIC_DRAW);
	a = g.getAttribLocation(p, 'p');
	g.enableVertexAttribArray(a);
	g.vertexAttribPointer(a, 3, g.FLOAT, false, 0, 0);
	g.clearColor(0, 0, 0, 1);
	z = new Date().getTime();
	if(!e){
		alert('shader compile is failed');
		e = document.getElementById('menuButton');
		e.textContent = 'run';
		run = false;
		return;
	}
	(function(){
		c.width = c.height = x = y = 512;
		g.viewport(0, 0, x, y);
		d = (new Date().getTime() - z) * 0.001;
		g.clear(g.COLOR_BUFFER_BIT);
		g.uniform1f(u.time, d);
		g.uniform2fv(u.resolution, [x, y]);
		g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
		g.flush();
		if(run){requestAnimationFrame(arguments.callee);}
	})();
}

function runShader(eve){
	var i = parseInt(eve.currentTarget.id.replace(/image/, ''));
	var s = entrySource[i];
	var e = document.getElementById('targetSource');
	if(s != null && s !== ''){
		e.value = i;
		scrollToTop();
		run = true;
		e = document.getElementById('menuButton');
		e.textContent = 'stop';
		shader(s);
	}
}

function stopShader(eve){
	var e, f, g;
	if((eve != null && eve.keyCode === 0) || (eve.keyCode == null)){
		e = eve.currentTarget;
		if(e.textContent === 'run'){
			f = document.getElementById('targetSource').value;
			if(f.value !== ''){
				g = parseInt(f);
				e.textContent = 'stop';
				scrollToTop();
				run = true;
				shader(entrySource[g]);
			}
		}else{
			run = false;
			e.textContent = 'run';
		}
	}else{
		run = (eve.keyCode !== 27);
		if(!run){
			e = document.getElementById('menuButton');
			e.textContent = 'run';
		}
	}
}

function scrollToTop(){
	var x = 0;
	var y = document.documentElement.scrollTop || document.body.scrollTop;
	var l = 30;
	if(y == 0){return;}
	(function(){
		x++;
		var ty = easeOutCubic(x, 0, y, l);
		window.scroll(0, y - ty);
		if(x < l){requestAnimationFrame(arguments.callee);}
	})();
}

function easeOutCubic(t, b, c, d) {
	var ts = (t /= d) * t;
	var tc = ts * t;
	return b + c * (tc + -3 * ts + 3 * t);
}

