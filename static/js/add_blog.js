$('.suffix').click(function () {
    $('#edit_title').html('禁止修改!');
    setTimeout(function () {
        $('#edit_title').html('');
    }, 2000)
});

$('.edit_title').blur(function () {
    let this_val = $('.edit_title').val();
    if (!this_val) {
        $(this).next().html('必须要填哦~');
        setTimeout(function () {
            $('#title_error').html('');
        }, 2000)
    }
})

$('.edit_theme').blur(function () {
    let this_val = $('.edit_theme').val();
    if (!this_val) {
        $(this).next().html('必须要填哦~');
        setTimeout(function () {
            $('#theme_error').html('');
        }, 2000);
    }
})

$('.sub_massage').click(function () {
    let theme_val = $('.edit_theme').val();
    let title_val = $('.edit_title').val();
    if (theme_val && title_val) {
        $.ajax({
            url: '',
            type: 'post',
            data: {
                'theme': theme_val,
                'title': title_val,
                'csrfmiddlewaretoken': $("[name='csrfmiddlewaretoken']").val()
            },
            success: function (data) {
                var response = JSON.parse(data);
                if (response.pass) {
                    location.href = '/center_msg/';
                } else {
                    alert('上传失败，请稍后再试');
                }
            }
        })
    } else {
        alert('请填写完所有信息之后提交!');
    }
})