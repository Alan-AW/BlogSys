function title() {
    var d = new Date()
    var time = d.getHours()
    if (time < 24) {
        $('#title').html('Good evening😘')
    }
    if (time < 19) {
        $('#title').html('Good afternoon🥰')
    }
    if (time < 12) {
        $('#title').html('Good morning😍')
    }
    if (time < 5) {
        $('#title').html('Go to sleep😪')
    }
}
title();

// 波浪
(function(){
	"use strict";
	var cvs,ctx;
	//var nodes = 5;
	var waves = [];
	var waveHeight = 30;
	var colours = ["#f00","#0f0","#00f"]

	function init() {
		cvs = document.getElementById("canvas");
		ctx = cvs.getContext("2d");
		resizeCanvas(cvs);

		for (var i = 0; i < 3; i++) {
			var temp = new wave(colours[i],1,5);
		}
		setInterval(update,16);
	}

	function randomColour() {
		// body...
		var h = Math.round(Math.random()*360);
		return "hsl("+h+",100%,50%)";
	}

	function update(array) {
		// body...
		//ctx.clearRect(0, 0, cvs.width, cvs.height);
    var fill = window.getComputedStyle(document.querySelector(".header"),null).getPropertyValue("background-color");
		ctx.fillStyle = fill;
		ctx.globalCompositeOperation = "source-over";
		ctx.fillRect(0,0,cvs.width,cvs.height);
		ctx.globalCompositeOperation = "screen";
		for (var i = 0; i < waves.length; i++) {
			for (var j = 0; j < waves[i].nodes.length; j++) {
				bounce(waves[i].nodes[j]);
			}
			drawWave(waves[i]);
			//drawLine(waves[i].nodes);
			//drawNodes(waves[i].nodes);
		}
		ctx.globalCompositeOperation = "hue";
		ctx.fillStyle = fill;
		//ctx.fillRect(0,0,cvs.width,cvs.height);
	}

	function wave(colour,lambda,nodes) {
		// body...
		this.colour = colour;
		this.lambda = lambda;
		this.nodes = [];
		var tick = 1;
		for (var i = 0; i <= nodes+2; i++) {
			var temp = [(i-1)*cvs.width/nodes,0,Math.random()*200,.3];//this.speed*plusOrMinus
			this.nodes.push(temp);
			console.log(temp);
		}
		console.log(this.nodes);
		waves.push(this);
	}

	function bounce(node) {
		node[1] = waveHeight/2*Math.sin(node[2]/20)+cvs.height/2;
		node[2] = node[2] + node[3];
	}

	function drawWave (obj) {
		var diff = function(a,b) {
			return (b - a)/2 + a;
		}
		ctx.fillStyle = obj.colour;
		ctx.beginPath();
		ctx.moveTo(0,cvs.height);
		ctx.lineTo(obj.nodes[0][0],obj.nodes[0][1]);
		for (var i = 0; i < obj.nodes.length; i++) {
			if (obj.nodes[i+1]) {
				ctx.quadraticCurveTo(
					obj.nodes[i][0],obj.nodes[i][1],
					diff(obj.nodes[i][0],obj.nodes[i+1][0]),diff(obj.nodes[i][1],obj.nodes[i+1][1])
				);
			}else{
				ctx.lineTo(obj.nodes[i][0],obj.nodes[i][1]);
				ctx.lineTo(cvs.width,cvs.height);
			}
		}
		ctx.closePath();
		ctx.fill();
	}

	function drawNodes (array) {
		ctx.strokeStyle = "#888";
		for (var i = 0; i < array.length; i++) {
			ctx.beginPath();
			ctx.arc(array[i][0],array[i][1],4,0,2*Math.PI);
			ctx.closePath();
			ctx.stroke();
		}
	}

	function drawLine (array) {
		ctx.strokeStyle = "#888";
		for (var i = 0; i < array.length; i++) {
			if (array[i+1]) {
				ctx.lineTo(array[i+1][0],array[i+1][1]);
			}
		}
			ctx.stroke();
	}

	function resizeCanvas(canvas,width,height) {
		if (width && height) {
			canvas.width = width;
			canvas.height = height;
		} else {
			if (window.innerHeight > 1920) {
				canvas.width = window.innerWidth;
			}
			else {
				canvas.width = 1920;
			}
			canvas.height = waveHeight;
		}
	}

	document.addEventListener("DOMContentLoaded",init,false);
})();

// 时钟
const WIDTH = 500  // 大小
const HEIGHT = 500
const R = WIDTH >= HEIGHT ? WIDTH / 2 : HEIGHT / 2  // 半径
const WEEKS = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const COUNTDAYS = getCountDays()
const YEAR = new Date().getFullYear()
var canvas = document.getElementById('myCanvas')
canvas.width = WIDTH
canvas.height = HEIGHT
var cxt = canvas.getContext('2d')
var date = {
    s: new Date().getSeconds(),
    m: new Date().getMinutes(),
    h: new Date().getHours(),
    w: new Date().getDay(),
    D: new Date().getDate(),
    M: new Date().getMonth() + 1
}
var jdate = {
    s: date.s,
    m: date.m,
    h: date.h,
    w: date.w,
    D: date.D,
    M: date.M
}
var radian = {
    s: 0,
    m: 0,
    h: 0,
    w: 0,
    D: 0,
    M: 0
}
var index = {
    s: -1,
    m: -1,
    h: -1,
    w: -1,
    D: -1,
    M: -1
}
run()

function run() {
    cxt.clearRect(0, 0, WIDTH, HEIGHT);
    draw()
    motion(R * 0.8, 60, 30, new Date().getSeconds(), 's')
    motion(R * 0.7, 60, 30, new Date().getMinutes(), 'm')
    motion(R * 0.6, 24, 12, new Date().getHours(), 'h')
    motion(R * 0.4, 7, 3.5, new Date().getDay(), 'w')
    motion(R * 0.2, COUNTDAYS, COUNTDAYS / 2, new Date().getDate(), 'D')
    motion(R * 0.1, 12, 6, new Date().getMonth() + 1, 'M')
    window.requestAnimationFrame(run);
}

function draw() {
    // 背景色
    cxt.fillStyle = 'rgba(245,245,245,0)';
    cxt.fillRect(0, 0, WIDTH, HEIGHT)
    cxt.restore();
    cxt.save();
    // 标度
    cxt.fillStyle = 'rgb(0, 250, 154)';
    cxt.fillRect(WIDTH / 2, HEIGHT / 2, WIDTH / 2, 1)
    cxt.restore();
    cxt.save();
    // 年
    cxt.fillStyle = 'rgb(238, 221, 130,1)';
    cxt.fillText(YEAR, WIDTH / 2, HEIGHT / 2)
    cxt.restore();
    cxt.save();
}

function motion(r, n, b, newT, type) {
    var count = n - 1
    var pi = 6 * (count + 1)
    if (newT == jdate[type]) {
        index[type]++
    }
    if (newT != jdate[type]) {
        jdate[type]++
            if (jdate[type] > count) {
                jdate[type] = 0
            }
        if (index[type] < 12) {
            radian[type] += (12 - index[type]) * Math.PI / pi
        }
        index[type] = 0
    }
    if (index[type] < 12) {
        radian[type] += Math.PI / pi
    } else {
        index[type] = 12
    }
    drawNum(r, n, b, date[type], radian[type], type)
}

function drawNum(r, n, b, t, radian, type) {
    var val = null
    for (var i = 0; i < n; i++) {
        cxt.save();
        var rad = Math.PI / b * (i + 1 - t) - radian;
        var x = Math.cos(rad) * r + WIDTH / 2;
        var y = Math.sin(rad) * r + HEIGHT / 2;
        rotateContext(cxt, x, y, rad)
        cxt.fillStyle = 'rgba(238, 221, 130,1)';  // 数字的颜色
        if (i < 10) {
            val = '0' + i
        } else {
            val = i
        }
        if (type === 'w') {
            for (var j = 0; j < WEEKS.length; j++) {
                val = WEEKS[i]
            }
        } else if (type === 'D' || type === 'M') {
            for (var j = 0; j < n; j++) {
                if (i === 0) {
                    val = n
                }
            }
        }
        cxt.fillText(val, x, y)
        cxt.restore();
    }
}

function rotateContext(cxt, x, y, degree) {
    cxt.translate(x, y);
    cxt.rotate(degree);
    cxt.translate(-x, -y);
}

// 获取当前月份的总天数
function getCountDays() {
    var curDate = new Date();
    /* 获取当前月份 */
    var curMonth = curDate.getMonth();
    /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
    curDate.setMonth(curMonth + 1);
    /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
    curDate.setDate(0);
    /* 返回当月的天数 */
    return curDate.getDate();
}

// HTML区域点击生成上浮文字
$(function () {
    var a_idx = 0,
        b_idx = 0;
        c_idx = 0;
    jQuery(document).ready(function ($) {
        $("html").click(function (e) {
            var a = ["欢迎你", "么么哒", "你真好", "雅蠛蝶", "棒棒哒", "真可爱", "你最美", "喜欢你", "真聪明", "爱你哦", "好厉害", "你真帅", "哈拉少"],
                b = ["#09ebfc", "#ff6651", "#ffb351", "#51ff65", "#5197ff", "#a551ff", "#ff51f7", "#ff518e", "#ff5163", "#efff51"],
                c = ["12", "14", "16", "18", "20", "22", "24", "26", "28", "30"];
            var $i = $("<span/>").text(a[a_idx]);
            a_idx = (a_idx + 1) % a.length;
            b_idx = (b_idx + 1) % b.length;
            c_idx = (c_idx + 1) % c.length;
            var x = e.pageX,
                y = e.pageY;
            $i.css({
                "z-index": 999,
                "top": y - 20,
                "left": x,
                "position": "absolute",
                "font-weight": "bold",
                "font-size": c[c_idx] + "px",
                "color": b[b_idx]
            });
            $("body").append($i);
            $i.animate({
                "top": y - 180,
                "opacity": 0
            }, 1500, function () {
                $i.remove();
            });
        });
    });
    var _hmt = _hmt || [];
})
