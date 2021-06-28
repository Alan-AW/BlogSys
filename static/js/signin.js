//登录验证
$(".login-btn").click(function () {
    $.ajax({
        url: "",
        type: "post",
        data: {
            "csrfmiddlewaretoken": $("[name='csrfmiddlewaretoken']").val(),
            "user": $("#user").val(),
            "pwd": $("#pwd").val(),
            're_code': $("#re_code").val(),
        },
        success: function (data) {
            var sigin_response = JSON.parse(data);  // 解码后端json序列化传过来的参数
            if (sigin_response.next_page) {
                location.href = '/usercenter/';  // 跳转到下一个页面
            } else if (sigin_response.user) {
                location.href = '/home/';  // 跳转到首页
            } else {
                $("#error").html(sigin_response.error_msg).css('color', 'red');
                $("#re_code_img")[0].src += "?"
                setTimeout(function () {
                    $('#error').html('Try Again!')
                }, 2000)  // 错误提示信息2秒之后改变
            }
        },
    })
});

//验证码刷新
$("#re_code_img").click(function () {
    $(this)[0].src += "?"
});