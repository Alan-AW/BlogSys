// 发送短信验证码的校验
$('#send_code').click(function () {
    if (this.sending_flag == true) {
        alert('看手机啊，还点什么点，短信不要钱啊？')
        return;
    }
    if ($('#tel').val() == '') {
        $('#tel').next().html('输入手机号');
    }

    $.ajax({
        url: '/SmsCodeChick/',
        type: 'post',
        data: {
            'tel': $('#tel').val(),
            csrfmiddlewaretoken: $("[name='csrfmiddlewaretoken']").val()
        },
        success: function (data) {
            pwd_resp = JSON.parse(data);
            if (pwd_resp.is_send) {
                $('#send_code').sending_flag = true;  // 发送之后就不能再点了
                // 倒计时60秒，60秒后允许用户再次点击发送短信验证码的按钮
                var num = 60;
                // 设置一个计时器
                var t = setInterval(() => {
                    if (num == 1) {
                        // 1.如果计时器到最后, 清除计时器对象
                        clearInterval(t);
                        // 2.将点击获取验证码的按钮展示的文本回复成原始文本
                        $('#send_code').val('发送验证码');
                        // 3.将点击按钮的click事件函数恢复回去
                        $('#send_code').sending_flag = false;
                    } else {
                        num -= 1;
                        // 展示倒计时信息
                        $('#send_code').val(num + '秒');
                    }
                }, 1000, 60)
            } else {
                alert(pwd_resp.error_msg)
            }
        }
    })
})

// 修改密码校验

$('#sub').click(function () {
    if ($('#user').val() == '') {
        $('#user').next().html('输入用户名');
        return;
    }
    if ($('#tel').val() == '') {
        $('#tel').next().html('输入手机号');
        return;
    } else {
        reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        if (!reg.test($('#tel').val())) {
            $('#tel').next().html('格式错误');
            return;
        }
    }
    if ($('#pwd').val() == '') {
        $('#pwd').next().html('输入新密码');
        return;
    } else {
        reg = /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,20}$/;
        if (!reg.test($('#pwd').val())) {
            $('#pwd').next().html('格式错误');
            return;
        }
    }
    if ($('#re_pwd').val() == '') {
        $('#re_pwd').next().html('输入新密码');
        return;
    } else {
        if ($('#pwd').val() != $('#re_pwd').val()) {
            $('#re_pwd').next().html('密码不一致');
            return;
        }
    }
    $.ajax({
        url: '',
        type: 'post',
        data: {// user\tel\pwd\re_pwd\sms_code
            'user': $('#user').val(),
            'tel': $('#tel').val(),
            'pwd': $('#pwd').val(),
            're_pwd': $('#re_pwd').val(),
            'sms_code': $('#sms_code').val(),
            'csrfmiddlewaretoken': $("[name='csrfmiddlewaretoken']").val()
        },
        success: function (data) {
            response = JSON.parse(data);
            if (response.flag) {
                alert('密码修改成功！');
                location.href = '/login/';
            }else{
                for (var i=0; i<=response.error_msg.length; i++){
                    if (response.error_msg[i] == 'not_all') {
                        alert('请填完所有的信息!');
                    }
                    if (response.error_msg[i] == 'user_none') {
                        $('#user').next().html('用户名不存在').css('color','red');
                    }
                    if (response.error_msg[i] == 'sms_code_error') {
                        $('#sms_code').next().html('验证码错误').css('color','red');
                    }
                    if (response.error_msg[i] == 'pwd2_error') {
                        $('#re_pwd').next().html('密码不一致').css('color','red');
                    }
                }
            }
        }
    })
})


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

//poetry
var p = [
        ['晓看天色暮看云', '行也思君，坐也思君~'],
        ['忽有故人心头过', '回首山河已是秋~'],
        ['山川皆无恙', '眉目不知秋~'],
        ['若非身上千斤担', '谁拿青春吃软饭~'],
        ['年少不知软饭香', '错把青春插稻秧~'],
        ['一世浮生一刹那', '一程山水一年华~'],
        ['若无闲事挂心头', '便是人间好时节~'],
        ['You no good,','but deep in my heart.'],
        ['此生若能幸福安稳', '谁又愿颠沛流离~'],
        ['手握日月摘星辰', '世间无我这般人~'],
        ['若非群玉山头见', '会向瑶台月下逢~'],
        ['Hans your smile,',
        'had been flurried my time passage.'],
        ['柳腰春风过', '白鸟随香走~'],
        ['借问酒家何处有', '牧童倒拔垂杨柳~'],
        ['中年心事浓如酒', '少女情怀总是诗~'],
        ['清风不问赶路人', '岁月不负有心人~'],
        ['桃李春风一杯酒', '江湖夜雨十年灯~'],
        ['山有木兮木有枝', '心悦君兮君不知~'],
        ['When it is already lost,',
        'brave to give up.'],
        ['云想衣裳花想容', '春风拂槛露华浓~'],
        ['春风十里扬州路', '卷上珠帘总不知~'],
        ['清风以北过南巷', '南巷故人不知归~'],
        ['Sometimes the end must have life,',
        'life in no time it.'],
        ['此生若能得幸福安稳', '谁又愿颠沛流离~'],
        ['何时杖尔看南雪', '我与梅花两白头~'],
        ['青瓦常忆旧时雨', '朱伞深巷无故人~'],
        ['If you can get happiness safe,',
        'who may displaced.'],
        ['风华是一指流砂！', '苍老是一段年华！'],
        ['寒炉煮酒，雪落梅章', '君在沧海，我在潇湘~'],
    ];
function RandomPoetyr() {
    var x = 0;
    var y = 29;
    var poetry = parseInt(Math.random() * (x - y + 1) + y);
    poetry_list = p[poetry];
    $("#first").html(poetry_list[0]);
    $("#sec").html(poetry_list[1]);
}

RandomPoetyr();