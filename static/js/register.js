$('#user').blur(function () {
    $(this).next().html('');
    if ($(this).val() == '') {
        $(this).next().html('不能为空!');
        return
    } else if ($(this).val().length < 3) {
        $(this).next().html('最短3个字!');
        return
    }
    $.ajax({
        url: "/merge_user/",
        type: "post",
        data: {
            'user': $('#user').val(),
            'csrfmiddlewaretoken': $('[name="csrfmiddlewaretoken"]').val()
        },
        success: function (data) {
            var valid_user = JSON.parse(data);
            if (valid_user.is_reg) {
                $('#user').next().html('已被注册!');
            } else {
                $('#user').next().html('昵称可用!').css('color', 'green');
            }
        }
    })
});

// 格式校验
$('#email').blur(function () {
    $(this).next().html('');
    if ($(this).val() == '') {
        $(this).next().html('不能为空!');
    } else {
        reg = /^[0-9a-zA-Z_]{0,19}@[0-9a-zA-Z]{1,13}\.[a-zA-Z]{2,3}$/;
        if (!reg.test($(this).val())) {
            $(this).next().html('格式错误!');
        } else {
            $(this).next().html('邮箱可用!').css('color', 'green');
        }
    }
});

// 密码强度验证
$('#pwd').keyup(function () {
    $(this).css('border-color', '');
    $(this).next().html('').css('color', 'red');
    var regxs = [];
    regxs[0] = /[^a-zA-Z0-9]/g;
    regxs[1] = /[a-zA-Z]/g;
    regxs[2] = /[0-9]/g;
    var len = $(this).val().length;
    var sec = 0;
    if (len >= 8) {
        for (var i = 0; i < regxs.length; i++) {
            if (regxs[i].test($(this).val())) {
                sec++;
            }
        }
    } else {
        $(this).next().html('最少8位!');
    }
    if (sec == 0) {
        $(this).css('border-color', 'red');
    } else if (sec == 1) {
        $(this).css('border-color', 'red');
        $(this).next().html('密码简单').css('color', 'red');
    } else if (sec == 2) {
        $(this).css('border-color', 'blue');
        $(this).next().html('密码较强').css('color', 'blue');
    } else if (sec == 3) {
        $(this).css('border-color', 'green');
        $(this).next().html('密码很强').css('color', 'green');
    }
});

$('#pwd').blur(function () {
    $(this).next().html('');
    if ($(this).val() == '') {
        $(this).next().html('不能为空!');
    } else {
        var reg = /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,20}$/;
        if (!reg.test($(this).val())) {
            $(this).next().html('格式错误!');
        } else {
            $(this).next().html('密码可用!').css('color', 'green');
        }
    }
});

$('#re_pwd').blur(function () {
    $(this).next().html('');
    if ($(this).val() == '') {
        $(this).next().html('不能为空!');
    } else {
        if ($(this).val() != $('#pwd').val()) {
            $(this).css('border-color', 'red');
            $(this).next().html('密码错误!');
        } else {
            $('#re_pwd').next().html('密码正确!').css('color', 'green');
        }
    }
});

$('#tel').blur(function () {
    $(this).next().html('');
    if ($(this).val() == '') {
        $(this).next().html('不能为空!');
    } else {
        reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        if (!reg.test($('#tel').val())) {
            $(this).next().html('格式错误!');
        } else {
            $(this).next().html('格式正确!').css('color', 'green');
        }
    }
});

// 发送验证码的校验
$('#send_sms_code').click(function () {
    if (this.sending_flag == true) {
        alert('看手机啊，还点什么点，短信不要钱啊？')
        return;
    }
    if ($('#tel').val() == '') {
        alert('请输入手机号')
            return
    }
    $.ajax({
        url: "/SmsCodeChick/",
        type: 'post',
        data: {
            'csrfmiddlewaretoken': $("[name='csrfmiddlewaretoken']").val(),
            'tel': $('#tel').val()
        },
        success: function (data) {
            sms_code_res = JSON.parse(data);
            if (sms_code_res.is_send) {
                $('#send_sms_code').sending_flag = true;  // 发送之后就不能再点了
                // 倒计时60秒，60秒后允许用户再次点击发送短信验证码的按钮
                var num = 60;
                // 设置一个计时器
                var t = setInterval(() => {
                    if (num == 1) {
                        // 1.如果计时器到最后, 清除计时器对象
                        clearInterval(t);
                        // 2.将点击获取验证码的按钮展示的文本回复成原始文本
                        $('#send_sms_code').val('发送验证码');
                        // 3.将点击按钮的click事件函数恢复回去
                        $('#send_sms_code').sending_flag = false;
                    } else {
                        num -= 1;
                        // 展示倒计时信息
                        $('#send_sms_code').val(num + '秒');
                    }
                }, 1000, 60)
            } else {
                alert(sms_code_res.error_msg)
            }
        }
    })
})

// ajax提交
$('.sub').click(function () {
    if ($('#sms_code').val() == '') {
        alert('请输入短信验证码!')
        return
    }
    $.ajax({
        url: '',
        type: 'post',
        data: {
            'csrfmiddlewaretoken': $("[name='csrfmiddlewaretoken']").val(),
            'user': $('#user').val(),
            'email': $('#email').val(),
            'pwd': $('#pwd').val(),
            're_pwd': $('#re_pwd').val(),
            'tel': $('#tel').val(),
            'sms_code': $('#sms_code').val()
        },
        success: function (data) {
            var register_obj = JSON.parse(data);
            // 解析出返回值做跳转验证...
            if (register_obj.user) {  // 不存在错误信息
                alert('注册成功!')
                location.href = "/login/";
            } else {
                console.log(register_obj.error_msg);
                for (var i = 0; i < register_obj.error_msg.length; i++) {
                    if (register_obj.error_msg[i] == 'user_error') {
                        $('#user').next().html('昵称不可用!');
                    }
                    if (register_obj.error_msg[i] == 'email_error') {
                        $('#email').next().html('邮箱不可用!');
                    }
                    if (register_obj.error_msg[i] == 'pwd_error') {
                        $('#pwd').next().html('密码不可用!');
                    }
                    if (register_obj.error_msg[i] == 're_pwd_error') {
                        $('#re_pwd').next().html('与密码不一致!');
                    }
                    if (register_obj.error_msg[i] == 'tel_error') {
                        $('#tel').next().html('电话不可用!').css('color', 'red');
                    }
                    if (register_obj.error_msg[i] == 'sms_code_error') {
                        alert('短信验证码错误!');
                    }
                }
            }
        }
    })
});

