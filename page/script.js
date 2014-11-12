
// global var =================================================================
var A;
var rad = new Array();
var sprite = new Array();
var run = true;
var fps = 1000 / 30;
var arrowCount = 30;
var baseWidth = 300;
var baseColorCount = 12;

// onload =====================================================================
window.onload = function(){
	var i, a;
	for(i = 0; i < 360; i++){rad[i] = i * Math.PI / 180;}
	a = document.getElementById('switch');
	a.addEventListener('click', toggleRun, true);
	A = new Arrow();
	A.init(arrowCount);
	A.render();
};

// sprite =====================================================================
function sp(){};

sp.prototype.init = function(screenWidth){
	var r;
	r = Math.random();
	this.x = r * screenWidth;                    // x pos
	r = Math.random() * baseWidth;
	r < 20 ? r = 20 : r;
	this.y = -r * 0.5;                           // y pos
	this.w = r;                                  // width
	this.wh = r * 0.5;                           // half width
	r = Math.random();
	r < 0.5 ? this.cw = true : this.cw = false;  // clockwise
	this.ct = 0;                                 // rotate counter
	r = Math.random();
	this.st = r * 8 + 1;                         // move stride
	r = Math.random();
	this.rt = r * 2 + 1;                         // rotate counter stride
	this.ra = 90;                                // angle
	r = Math.random();
	this.ci = Math.floor(r * baseColorCount);    // color index
};

sp.prototype.move = function(){
	this.y += this.st;
};

// arrow ======================================================================
function Arrow(){
	this.c  = document.getElementById('screen');
	this.b  = document.getElementById('buffer');
	this.cx = this.c.getContext('2d');
	this.bx = this.b.getContext('2d');
	this.hc = 0;
	
	this.init = function(num){
		var i, j, k, a, h, hh;
		var r, g, b;
		this.c.width = window.innerWidth;
		this.c.height = window.innerHeight;
		this.b.width = baseWidth * baseColorCount;
		this.b.height = baseWidth;
		h = this.b.height;
		hh = h * 0.5;
		
		this.hc = num;
		
		this.bx.shadowOffsetX = 0;
		this.bx.shadowOffsetY = baseWidth;
		this.bx.shadowBlur = 20;
		this.bx.textAlign = 'center';
		this.bx.textBaseline = 'middle';
		this.bx.font = 'normal ' + (this.b.height - 20) +'px cursive';
		
		k = 360 / baseColorCount;
		for(i = 0; i < baseColorCount; i++){
			j = i * k;
			a = hsva(j, 0.85, 1.0, 1.0);
			this.bx.fillStyle = 'rgba(' + a.join(',') + ')';
			this.bx.shadowColor = this.bx.fillStyle;
			this.bx.fillText(String.fromCharCode(0x27a4), i * h + hh, hh - baseWidth, h);
		}
	};
	
	this.render = function(){
		var i;
		var c  = this.cx;
		var cw = this.c.width;
		var ch = this.c.height;
		var h  = this.b;
		var bh = h.height;
		var num = this.hc;
		if(sprite.length === 0){
			for(i = 0; i < num; i++){
				sprite[i] = new sp();
				sprite[i].init(cw);
			}
		}
		c.fillStyle = 'rgba(0, 0, 0, 0.5)';
		(function(){
			var i, a;
			c.globalCompositeOperation = 'source-over';
			c.fillRect(0, 0, cw, ch);
			c.globalCompositeOperation = 'lighter';
			for(i = 0; i < num; i++){
				c.save();
				sprite[i].move();
				a = sprite[i];
				c.translate(a.x, a.y);
				c.rotate(rad[a.ra]);
				c.drawImage(h, a.ci * bh, 0, bh, bh, -a.wh, -a.wh, a.w, a.w);
				if(a.y - a.w > ch){sprite[i].init(cw);}
				c.restore();
			}
			if(run){setTimeout(arguments.callee, fps);}
		})();
	};
}

function toggleRun(e){
	if(!run){
		e.currentTarget.innerHTML = 'off';
		run = true;
		A.render();
	}else{
		e.currentTarget.innerHTML = 'on';
		run = false;
	}
}

function hsva(h, s, v, a){
	if(s > 1 || v > 1 || a > 1){return;}
	var th = h % 360;
	var i = Math.floor(th / 60);
	var f = th / 60 - i;
	var m = v * (1 - s);
	var n = v * (1 - s * f);
	var k = v * (1 - s * (1 - f));
	var color = new Array();
	if(!s > 0 && !s < 0){
		color.push(v, v, v, a); 
	}else{
		var r = new Array(v, n, m, m, k, v);
		var g = new Array(k, v, v, n, m, m);
		var b = new Array(m, m, k, v, v, n);
		color.push(
			Math.floor(r[i] * 255),
			Math.floor(g[i] * 255),
			Math.floor(b[i] * 255),
			a
		);
	}
	return color;
}

