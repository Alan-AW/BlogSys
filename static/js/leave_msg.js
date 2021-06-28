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
});

// back to top
$(function () {
    //先将#back-top隐藏
    $('#back-top').hide();
    //当滚动条的垂直位置距顶部300像素一下时，跳转链接出现，否则消失
    $(window).scroll(function () {
        if ($(window).scrollTop() > 300) {
            $('#back-top').fadeIn(1000);
            $("#navgation").css({
                "background-color": "rgba(10, 235, 235, .5)",
                "box-shadow": "2px 2px 2px 2px rgba(10, 235, 235, .2)",
                "border": "1px solid rgba(10, 235, 235, .1)"
            });
            $('.url').css("color", "whitesmoke");
        } else {
            $("#back-top").fadeOut(1000);
            $("#navgation").css({
                "background-color": "rgba(0, 0, 0, 0)",
                "box-shadow": "2px 2px 2px 2px rgba(0, 0, 0, .2)",
                "border": "1px solid rgba(0, 0, 0, .1)"
            });
            $('.url').css("color", "rgb(10,235,235)");
        }
    });
    //点击跳转链接，滚动条跳到0的位置，页面移动速度是1000
    $("#back-top").click(function () {
        $('html').animate({
            scrollTop: '0'
        }, 1000);
        return false; //防止默认事件行为
    })
});

// 提交留言
$('#submit_leave_button').click(function () {
    var need_nick_name = $(this).hasClass('not_signin');
    var csrf = $("[name='csrfmiddlewaretoken']").val();
    var nick_name = $('.set_nick_name').val();
    var content = $('#content').val();
    if (need_nick_name) {
        if (nick_name && content) {
            $.ajax({
                url: '',
                type: 'post',
                data: {
                    'csrfmiddlewaretoken': csrf,
                    'nick_name': nick_name,
                    'content': content
                },
                success: function (data) {
                    response = JSON.parse(data);
                    console.log(response);
                    var nick_name = response.nick_name;
                    var create_time = response.create_time;
                    var content = response.content;
                    var all_count = parseInt($('.all_count').text());
                    s = `<div class="one-of-leave">
                            <img class="img" src="/static/img/nav/about.jpg">
                            <p class="about_msg"><span class="username" style="color: orangered">${nick_name}:&nbsp;&nbsp;&nbsp;</span><span
                                        class="create_date">${create_time}时</span></p>
                            <p class="leave-content" style="color: deepskyblue"><b>${content}</b></p>
                        </div>`;
                    $('.showleavemsg').append(s);
                    $('.all_count').text(all_count + 1);
                    $('.leave-text').val('');
                    $('.set_nick_name').val('');
                }
            })
        } else {
            $('.error-tips').html('别害羞，爱要勇敢说出来😔');
            setTimeout(function () {
                $('.error-tips').html('咻的一下~');
            }, 2000);
        }
    } else {
        if (content) {
            $.ajax({
                url: '',
                type: 'post',
                data: {
                    'csrfmiddlewaretoken': csrf,
                    'nick_name': nick_name,
                    'content': content
                },
                success: function (data) {
                    response = JSON.parse(data);
                    console.log(response);
                    var nick_name = response.nick_name;
                    var create_time = response.create_time;
                    var content = response.content;
                    var all_count = parseInt($('.all_count').text());
                    s = `<div class="one-of-leave">
                            <img class="img" src="/static/img/nav/about.jpg">
                            <p class="about_msg"><span class="username" style="color: orangered">${nick_name}:&nbsp;&nbsp;&nbsp;</span><span
                                        class="create_date">${create_time}时</span></p>
                            <p class="leave-content" style="color: deepskyblue"><b>${content}</b></p>
                        </div>`;
                    $('.showleavemsg').append(s);
                    $('.all_count').text(all_count + 1);
                    $('.leave-text').val('');
                    $('.set_nick_name').val('');
                }
            })
        } else {
            $('.error-tips').html('别害羞，爱要勇敢说出来😔');
            setTimeout(function () {
                $('.error-tips').html('咻的一下~');
            }, 2000);
        }
    }
});

// 看板娘
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
            "opacityDefault": 1, // 透明度
            "opacityOnHover": 0.2
        }
    });



//    输入框打字冒光效果
(function () {
    function p() {
        window.requestAnimFrame(p), a = d(0, 360), s.globalCompositeOperation = "destination-out", s.fillStyle = "rgba(0, 0, 0, 0.5)", s.fillRect(0, 0, e, t), s.globalCompositeOperation = "source-over";
        var n = u.length;
        while (n--) u[n].draw(), u[n].update(n)
    }

    function d(e, t) {
        return Math.random() * (t - e) + e
    }

    function v() {
        i = $('<canvas width="' + e + '" height="' + t + '" />').appendTo(n).css({
            position: "absolute",
            left: -20,
            top: -44,
            zIndex: 999,
            pointerEvents: "none"
        }), s = i[0].getContext("2d"), r = $("<div />").appendTo(n).css({
            fontSize: "16px",
            fontFamily: "arial",
            height: 1,
            position: "absolute",
            left: 15,
            top: 50,
            zIndex: 0,
            visibility: "hidden",
            whiteSpace: "nowrap"
        })
    }

    if (/msie/i.test(navigator.userAgent)) return;
    var e = 600,
        t = 100,
        n = $("#header .form"),
        r = null,
        i = null,
        s = null,
        o = !1,
        u = [],
        a = 120,
        f = 8,
        l = 0,
        c = 0,
        h = function (e, t, n) {
            var r = this;
            r.x = e, r.y = t, r.dir = n, r.coord = {}, r.angle = d(0, -Math.PI), r.speed = d(2, 8), r.friction = .95, r.gravity = 1, r.hue = d(a - 10, a + 10), r.brightness = d(50, 80), r.alpha = 1, r.decay = d(.03, .05), r.init()
        };
    h.prototype = {
        init: function () {
            var e = this;
            e.coord = {
                x: e.x,
                y: e.y
            }
        },
        update: function (e) {
            var t = this;
            t.coord = {
                x: t.x,
                y: t.y
            }, t.speed *= t.friction, t.x += Math.cos(t.angle) * t.speed + t.dir, t.y += Math.sin(t.angle) * t.speed + t.gravity, t.alpha -= t.decay, t.alpha <= t.decay && u.splice(e, 1)
        },
        draw: function () {
            var e = this;
            s.fillStyle = "hsla(" + e.hue + ", 100%, " + e.brightness + "%, " + e.alpha + ")", s.beginPath(), s.arc(e.coord.x, e.coord.y, 2, 0, 2 * Math.PI, !0), s.closePath(), s.fill()
        }
    }, window.requestAnimFrame = function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || function (e) {
            window.setTimeout(e, 1e3 / 60)
        }
    }(), $(".input_key").on("focus", function () {
        o || (v(), o = !0, p());
        var e = $(this.form),
            t = -20,
            n = -44;
        i.appendTo(e), e.attr("name") == "f3" && ($("body").hasClass("layout1") ? t = 97 : t = -20), i.css({
            left: t,
            top: n
        })
    }).on("keydown", function (e) {
        var t = $(this.form);
        if (!(this.selectionStart >= 0 && r)) return;
        var n = this.selectionStart,
            i = this.value.substring(0, n).replace(/ /g, " "),
            s = r.html(i).width(),
            o = 0;
        i.length > c ? o = -2 : o = 2, c = i.length, s >= 500 && (s = 500);
        var a = f;
        while (a--) u.push(new h(s + 50, 60, o));
        t.css({
            "-webkit-transform": "translate(-1px, 1px)",
            "-moz-transform": "translate(-1px, 1px)",
            "-o-transform": "translate(-1px, 1px)",
            transform: "translate(-1px, 1px)"
        }), setTimeout(function () {
            t.css({
                "-webkit-transform": "none",
                "-moz-transform": "none",
                "-o-transform": "none",
                transform: "none"
            })
        }, 10)
    })
})();