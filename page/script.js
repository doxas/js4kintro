var c, gl;

window.onload = function(){
	
};

function scrollToTop(){
	var x = 0;
	var y = document.documentElement.scrollTop || document.body.scrollTop;
	var l = 40;
	if(y == 0){return;}
	(function(){
		x++;
		var ty = easeOutCubic(x, 0, y, l);
		window.scroll(0, y - ty);
		if(x < l){setTimeout(arguments.callee, 30);}
	})();
}

function easeOutCubic(t, b, c, d) {
	var ts = (t /= d) * t;
	var tc = ts * t;
	return b + c * (tc + -3 * ts + 3 * t);
}

