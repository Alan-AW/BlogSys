$('.sub_massage').click(function () {
    let cate_val = $('.edit_cate').val();
    if (cate_val) {
        $.ajax({
            url: '',
            type: 'post',
            data: {
                'title': cate_val,
                'csrfmiddlewaretoken': $("[name='csrfmiddlewaretoken']").val()
            },
            success: function (data) {
                var response = JSON.parse(data);
                if (response.pass) {
                    location.href = '/center_msg/';
                } else {
                    alert('上传失败，请稍后再试');
                    $('.edit_cate').val('');
                }
            }
        })
    } else {
        alert('请填写完所有信息之后提交!');
    }
})