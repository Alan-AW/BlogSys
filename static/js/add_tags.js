$('.sub_massage').click(function () {
    let tag_val = $('.edit_tags').val();
    if (tag_val) {
        $.ajax({
            url: '',
            type: 'post',
            data: {
                'title': tag_val,
                'csrfmiddlewaretoken': $("[name='csrfmiddlewaretoken']").val()
            },
            success: function (data) {
                var response = JSON.parse(data);
                if (response.pass) {
                    location.href = '/center_msg/';
                } else {
                    alert('上传失败，请稍后再试');
                    $('.edit_tags').val('');
                }
            }
        })
    } else {
        alert('请填写完所有信息之后提交!');
    }
})