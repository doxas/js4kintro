var editor;
window.onload = function(){
	editor = ace.edit("editor");
	editor.setTheme("ace/theme/vibrant_ink");
	editor.getSession().setMode("ace/mode/glsl");
	editor.commands.addCommand({
		name: 'cmd',
		bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
		exec: function(editor){alert('alert cmd-s');}
	});
}

function downloadTemplete(){
	
}
