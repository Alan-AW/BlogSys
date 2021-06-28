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

// HTML区域点击生成上浮文字
$(function () {
    var a_idx = 0,
        b_idx = 0;
    c_idx = 0;
    jQuery(document).ready(function ($) {
        $("html").click(function (e) {
            var a = ["欢迎你", "么么哒", "你真好", "雅蠛蝶", "棒棒哒", "真可爱", "你最美", "喜欢你", "真聪明", "爱你哦", "好厉害", "你真帅", "哈拉少"],
                b = ["#09ebfc", "#ff6651", "#ffb351", "#51ff65", "#5197ff", "#a551ff", "#ff51f7", "#ff518e", "#ff5163", "#efff51"],
                c = ["12", "14", "16", "18", "20"];
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

// back to top
 $(function() {
     //先将#back-top隐藏
     $('#back-top').hide();
     //当滚动条的垂直位置距顶部100像素一下时，跳转链接出现，否则消失
     $(window).scroll(function() {
         if ($(window).scrollTop() > 750) {
             $('#back-top').fadeIn(1000);
             $("#navgation").css({"background-color":"rgba(10,10,10,.8)"});
         } else {
             $("#back-top").fadeOut(1000);
             $("#navgation").css({"background-color":"rgba(245,245,245,0)"});
         }
     });
     //点击跳转链接，滚动条跳到0的位置，页面移动速度是1000
     $("#back-top").click(function() {
         $('html').animate({
             scrollTop: '0'
         }, 1000);
         return false; //防止默认事件行为
     })
 })


// background-change
// function bg_change() {
// 	var x = 0;
// 	var y = 10;
// 	var z = parseInt(Math.random() * (x - y + 1) + y);
// 	var url_change = [
// 		'url(/static/img/bg_img/3.jpg)',
// 		'url(/static/img/bg_img/4.jfif)',
// 		]
// 	$('#head').style.backgroundImage = url_change[z];
// }
var poetry_list = [
		['帘外海棠,','锦屏鸳鸯。','庭院春深,','咫尺画堂。'],
		['与子偕老,','隐匿八荒。','浮云易老,','陌路沧桑。'],
		['可人如玉,','与子偕臧。','长亭远望,','夜色微凉。'],
		['水静莲香,','惠风和畅。','云遮薄月,','清露如霜。'],
		['赋尽高唐,','三生石上。','君居淄右,','妾家河阳。'],
		['寒庐煮酒,','雪落梅章。','君在沧海,','我在潇湘。'],
		['伊人窈窕,','寤寐思之费思量。','一寸相思,','化作十万秋水长。'],
	]

var chicken_soup = [
    '你所看到的所有惊艳，都曾经被平庸历练，不一定逆风翻盘，但一定要向阳而生!',
    '放弃固然容易，但是坚持一定很酷，生活本就沉闷，然而跑起来才会有风!',
    '每一个不曾起舞的日子都是对未来的放逐，对生命的辜负!',
    '愿以诚挚之心，领岁月之教诲，经历风雨人间，努力做自己的太阳，无需借谁的光!',
    '天黑暗到一定程度，星辰才会熠熠生辉，无人问津的日子，希望你暗自努力!',
    '看似不起眼的日复一日，会在将来的某一天让你看到坚持的意义，不要否定自己的未来，因为你正在路上!',
    '先努力让自己发光，对的人才能迎光而来，错过落日的余晖，还有满天星辰和黎明前的日出!',
    '所谓生活：有所谓，有所爱，有所期待!',
]

function get_rundom_code(x,y) {
    rundom_code = parseInt(Math.random() * (x - y + 1) + y);
    return rundom_code;
}

// poetry
function poetry_show(){
	var ipt = get_rundom_code(0,6)
	$('.one').html(poetry_list[ipt][0]);
	$('.two').html(poetry_list[ipt][1]);
	$('.thr').html(poetry_list[ipt][2]);
	$('.fou').html(poetry_list[ipt][3]);
}
poetry_show();

// left tack
function left_show() {
    var showId = get_rundom_code(0,7);
    $('.left_show').html(chicken_soup[showId])
}

left_show();


// models
L2Dwidget.init({
        "model": {
            jsonPath: "https://unpkg.com/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json",
            "scale": 1
        },
        "display": {
            "position": "left",
            "width": 100,
            "height": 150,
            "hOffset": 0,
            "vOffset": -20
        },
        "mobile": {
            "show": true,
            "scale": 0.5
        },
        "react": {
            "opacityDefault": 1,  // 透明度
            "opacityOnHover": 0.2
        }
    });
