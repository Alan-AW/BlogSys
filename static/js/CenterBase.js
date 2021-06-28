// 导航的收缩展开
$(function(){
    // nav收缩展开
    $('.nav-item>a').on('click',function(){
        if (!$('.nav').hasClass('nav-mini')) {
            if ($(this).next().css('display') == "none") {
                //展开未展开
                $('.nav-item').children('ul').slideUp(300);
                $(this).next('ul').slideDown(300);
                $(this).parent('li').addClass('nav-show').siblings('li').removeClass('nav-show');
            }else{
                //收缩已展开
                $(this).next('ul').slideUp(300);
                $('.nav-item.nav-show').removeClass('nav-show');
            }
        }
    });
    //nav-mini切换
    $('#mini').on('click',function(){
        if (!$('.nav').hasClass('nav-mini')) {
            $('.nav-item.nav-show').removeClass('nav-show');
            $('.nav-item').children('ul').removeAttr('style');
            $('.nav').addClass('nav-mini');
        }else{
            $('.nav').removeClass('nav-mini');
        }
    });
});

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

// 看板娘
L2Dwidget.init({
        "model": {
            jsonPath: "https://unpkg.com/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json",
            "scale": 1
        },
        "display": {
            "position": "right",
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
            "opacityDefault": 1, // 透明度
            "opacityOnHover": 0.2
        }
    });
