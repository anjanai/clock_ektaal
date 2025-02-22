var tempo, divider, startTime, manualStep=0;

   
(function ($) {
    
    function core(id, preset, options) {
	var canvas = $(id)[0];

	var ctx = canvas.getContext('2d');
	var bound = canvas.height;
	var safepad = 0;
	if (preset.hasShadow) {
	    safepad = preset.shadowBlur;
	}
	var radius = canvas.height / 2 - safepad;
	//var quarterStep = 2 * Math.PI / 48;
	var quarterStep = 2 * Math.PI / 12;
	var hourStep = 2 * Math.PI / 12;


	tempo = 60;
	startTime = new Date();
	
	
	var initialize = function () {
	    $(document).keypress(function(e){
		//if ($("#manual").is(":checked"))
		manualStep++;
	    });


	    show_tempo_value(tempo);
	    
	    $(canvas).css('max-width', '100%');
	    $(canvas).css('width', $(canvas).css('height'));
	    canvas.width = canvas.height;
	    if (preset.hasShadow) {
		ctx.shadowOffsetX = 0.0;
		ctx.shadowOffsetY = 0.0;
		ctx.shadowBlur = preset.shadowBlur;
		ctx.shadowColor = preset.shadowColor;
	    }

	    draw();
	};


	var p2v = function (value) {
	    return value / 100.0 * radius;
	};


	var drawMajorLines = function () {
	    ctx.lineWidth = p2v(preset.majorTicksLength);
	    ctx.strokeStyle = preset.majorTicksColor;

	    for (var i = 1; i <= 12; i++) {
		ctx.beginPath();
		ctx.arc(radius + safepad, radius + safepad, radius - ctx.lineWidth / 2, i * hourStep - p2v(preset.majorTicksWidth) / 2, i * hourStep + p2v(preset.majorTicksWidth) / 2);
		ctx.stroke();
		
	    }
	};


	var drawMinorLines = function () {
	    ctx.lineWidth = p2v(preset.minorTicksLength);
	    ctx.strokeStyle = preset.minorTicksColor;

	    for (var i = 1; i <= 48; i++) {
		ctx.beginPath();
		ctx.arc(radius + safepad, radius + safepad,
			radius - ctx.lineWidth / 2,
			i * quarterStep - p2v(preset.minorTicksWidth) / 2,
			i * quarterStep + p2v(preset.minorTicksWidth) / 2);
		ctx.stroke();
	    }
	};


	var drawBorder = function () {
	    ctx.strokeStyle = preset.borderColor;
	    ctx.lineWidth = p2v(preset.borderWidth);
	    ctx.beginPath();
	    ctx.arc(radius + safepad, radius + safepad, radius - ctx.lineWidth / 2, 0.0, 2 * Math.PI);
	    ctx.stroke();
	};


	var drawFill = function () {
	    ctx.fillStyle = preset.fillColor;
	    ctx.lineWidth = p2v(preset.borderWidth);
	    ctx.beginPath();
	    ctx.arc(radius + safepad, radius + safepad, radius - ctx.lineWidth, 0.0, 2 * Math.PI);
	    ctx.fill();

	    /* last 2 beats */
	    ctx.fillStyle = "orange";
	    ctx.lineWidth = p2v(preset.borderWidth);
	    ctx.beginPath();
	    ctx.arc(radius + safepad, radius + safepad, radius - ctx.lineWidth,
		    Math.PI * 1.5 , // 1 + 6/12
		    Math.PI * 7/6 , true );  // 1 + 2/12
	    ctx.lineTo(radius + safepad, radius + safepad);
	    ctx.fill();

	    /* first 2 beats */
	    
	    ctx.fillStyle = "lightgreen";
	    ctx.lineWidth = p2v(preset.borderWidth);
	    ctx.beginPath();
	    ctx.arc(radius + safepad, radius + safepad, radius - ctx.lineWidth,
		    Math.PI * 1.5, // 1 + 6/12
		    Math.PI * 11/6, false ); // 1 + 10/12
	    ctx.lineTo(radius + safepad, radius + safepad);
	    ctx.fill();
	    
	    
	    
	};


	var drawHandle = function (angle, lengthPercent, widthPercent, color) {
	    var x = angle - Math.PI / 2;
	    x = Math.cos(x) * p2v(lengthPercent);
	    var x_1 = angle - Math.PI / 2;
	    var y = Math.sin(x_1) * p2v(lengthPercent);
	    ctx.lineWidth = p2v(widthPercent);
	    ctx.strokeStyle = color;
	    ctx.beginPath();
	    ctx.moveTo(radius + safepad, radius + safepad);
	    ctx.lineTo(radius + safepad + x, radius + safepad + y);
	    ctx.stroke();
	};


	var bols = 'dhin dhin dhaa_ge ti_ra_ki_Ta tu naa kat taa dhaa_ge ti_ra_ki_Ta dhi naa'.split(' ');

	var fontColors = 'lightgreen lightgreen white white white white white white white white orange orange'.split(' ');
	
	var drawTexts = function () {
	    for (var i = 0; i < 12; i++) {
		var angle = i * hourStep;
		var x = angle - Math.PI / 2;
		x = Math.cos(x) * p2v(80.0);
		var x_1 = angle - Math.PI / 2;
		var y = Math.sin(x_1) * p2v(80.0);

		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		ctx.fillStyle = "white"; //fontColors[i];
		ctx.beginPath();
		ctx.font = p2v(preset.fontSize).toString() + 'px ' + preset.fontName;
		ctx.fillText((i+1).toString(), radius + safepad + x, radius + safepad + y);
		ctx.font = p2v(preset.fontSize - 4).toString() + 'px ' + preset.fontName;
		ctx.fillText(bols[i], radius + safepad + x, radius + safepad + y + 40);
		ctx.stroke();
	    }
	};


	var drawPin = function () {
	    ctx.fillStyle = preset.pinColor;
	    ctx.beginPath();
	    ctx.arc(radius + safepad, radius + safepad, p2v(preset.pinRadius), 0.0, 2 * Math.PI);
	    ctx.fill();
	};


	var draw = function () {
	    ctx.clearRect(0.0, 0.0, bound, bound);
	    ctx.lineCap = 'butt';

	    if (preset.drawFill) {
		drawFill();
	    }

	    if (preset.drawMinorTicks) {
		drawMinorLines();
	    }

	    if (preset.drawMajorTicks) {
		drawMajorLines();
	    }

	    if (preset.drawBorder) {
		drawBorder();
	    }

	    if (preset.drawTexts) {
		drawTexts();
	    }

	    ctx.lineCap = 'round';

	    if ($("#auto").is(":checked")) {
		$("#tempo_div").show();
		var date = new Date();
		var s = date.getSeconds();
		s = Math.round(getMillisecondsBetweenDates(startTime,date) /divider);
		drawHandle(s * quarterStep, preset.secondHandLength, preset.secondHandWidth, preset.secondHandColor);
	    } else {
		$("#tempo_div").hide();
		drawHandle(manualStep * quarterStep, preset.secondHandLength, preset.secondHandWidth, preset.secondHandColor);
	    }
	    

	    if (preset.drawPin) {
		drawPin();
	    }

	    window.requestAnimationFrame(function () {
		draw(this);
	    });
	};


	initialize();
    }


    $.fn.htAnalogClock = function (preset, options) {
	return this.each(function () {
	    var _preset = $.extend({}, htAnalogClock.preset_default, preset || {});
	    var _options = $.extend({}, $.fn.htAnalogClock.defaultOptions, options || {});
	    core(this, _preset, _options);
	});
    };


    $.fn.htAnalogClock.defaultOptions = {
	timezone: null
    };

}(jQuery));

function getMillisecondsBetweenDates(date1, date2) {
    return date2.getTime() - date1.getTime();
}

function show_tempo_value(t) {
    document.getElementById("tempo_value").innerHTML=t;
    divider = 60 * 1000/t/4;

}

function add(x) {
    show_tempo_value(tempo+=x);
    
}
function mult(x) {
    show_tempo_value(tempo*=x);
}

function restart() {
    startTime = new Date();
    manualStep = 0;
}

function htAnalogClock() {}
htAnalogClock.preset_default = {
    hasShadow: true,
    shadowColor: "#000",
    shadowBlur: 10,

    drawSecondHand: true,
    drawMajorTicks: true,
    drawMinorTicks: false,
    drawBorder: true,
    drawFill: true,
    drawTexts: true,
    drawPin: true,

    majorTicksColor: "#f88",
    minorTicksColor: "#fa0",

    majorTicksLength: 10.0,
    minorTicksLength: 7.0,
    majorTicksWidth: 0.005,
    minorTicksWidth: 0.0025,

    fillColor: "#668cff", //"#333",
    pinColor: "#f88",
    pinRadius: 5.0,

    borderColor: "#000",
    borderWidth: 2.0,

    secondHandColor: "#f00",
    minuteHandColor: "#fff",
    hourHandColor: "#fff",

    fontColor: "#fff",
    fontName: "Tahoma",
    fontSize: 10.0,

    secondHandLength: 90.0,
    minuteHandLength: 70.0,
    hourHandLength: 50.0,

    secondHandWidth: 1.0,
    minuteHandWidth: 2.0,
    hourHandWidth: 3.0
};
