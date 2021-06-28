// 动态点赞
$('.up_down .digg').click(function () {
    var is_up = $(this).hasClass('to-up');
    var article_id = $('.article-desc-p').attr('article_id');
    var csrf = $('[name="csrfmiddlewaretoken"]').val();
    $count_obj = $(this).children('span');
    $.ajax({
        url: '/digg/',
        type: 'post',
        data: {
            'is_up': is_up,
            'article_id': article_id,
            'csrfmiddlewaretoken': csrf
        },
        success: function (data) {
            var success_obj = JSON.parse(data);
            if (success_obj.state) {
                var count = parseInt($count_obj.text());
                $count_obj.text(count + 1);
            } else {
                var tips = success_obj.handled ? '您已经赞过啦!' : '您已经踩过啦!'
                $('.error').html(tips);
                setTimeout(function () {
                    $('.error').html('');
                }, 1000);
            }
        }
    })
})

// 提交根评论
$('#default_comment_button').click(function () {
    var content = $('#content').val();
    var pk = $('.article-desc').attr('article_id');
    if (!content) {
        alert('请输入评论内容!');
        return;
    }
    $.ajax({
            url: '/default_comment/',
            type: 'post',
            data: {
                'csrfmiddlewaretoken': $("[name='csrfmiddlewaretoken']").val(),
                'article_id': pk,
                'content': content,
            },
            success: function (data) {
                response = JSON.parse(data);
                if (response.error) {
                    alert('评论失败，请稍后再试！');
                } else {
                    var create_time = response.create_time;
                    var user = response.username;
                    var content = response.content;
                    var comment_id = response.comment_id;
                    var all_count = parseInt($('#howmany').text());
                    var s = `<div class="one-of-comment-tree" self_id="${comment_id}">
                    <div class="show-avatar">
                        <img src="/static/img/bg_img/batterfly.jpg" id="show-avatar" alt="头像加载失败">
                    </div>
                    <p class="username" style="margin-bottom: 10px">${user}</p>
                    <p class="comment-time">${create_time}</p>
                    <p class="comment-desc" style="margin-top: 5px;margin-left: 60px">${content}</p>
                    <input type="button" class="replay" value="删除">
                    <input type="button" class="get_son_comment" value="......"
                           style="outline: none;border-radius: 20%;border: none;background-color: rgba(0,0,0,0);color: #0f0f0f">
                </div>`;
                    $('.show_comment').append(s);  // 添加该条根评论
                    $('#content').val('');  // 清空输入框
                    $('#howmany').text(all_count + 1);  // 总评论数+1
                }
            }
        }
    )
})

// 回复按钮点击状态
var is_click = true;  // 回复按钮点击状态
$('.replay').click(function () {
    // var parent_user = $(this).parent().attr('self_id').val();  // 父评论id
    var parent_user = 'xxj';
    if (is_click) {
        var s = `<textarea class="comment-text" id="replay_msg" rows="3" placeholder="@&nbsp;${parent_user}"></textarea>
            <input type="button" value="回复" class="sub_comment son_comment" id="replay_button">`;
        $(this).val('取消');
        $(this).parent().append(s);  // true 为允许点击并且生成回复输入框
        is_click = false;  // 修改允许点击状态
    } else {
        $('#replay_msg').remove();  // 再次点击时，清除回复输入接口
        $('.son_comment').remove();  // 再次点击时，清除回复提交按钮
        is_click = true;  // 修改回允许点击状态
        $(this).val('回复');  // 修改回复提示
    }
})

// 提交子评论
$('.son_comment').click(function () {
    alert('点击子评论提交');
    var csrf = $("[name='csrfmiddlewaretoken']").val();
    var content = $('#replay_msg').val();
    var parent_id = '';
    var article_id = $('.article-desc').attr('article_id');
    if (!msg) {
        alert('请输入评论内容');
    } else {
        $.ajax({
            url: '/submit_son_comment/',
            type: 'post',
            data: {
                'csrfmiddlewaretoken': csrf,
                'parent_id': parent_id,
                'content': content,
                'article_id': article_id,
            },
            success: function (data) {
                alert(data);
            }
        })
    }
})


// 显示更多子评论
var show_more_son_comment = true;
$('.get_son_comment').click(function () {
    if (show_more_son_comment) {
        $.ajax({
            url: '/get_son_comment/',
            type: 'post',
            data: {
                'parent_comment_id': $(this).parent().attr('self_id'),
                'csrfmiddlewaretoken': $('[name="csrfmiddlewaretoken"]').val()
            },
            success: function (data) {
                if (data == 'nothing') {
                    alert('么有更多评论了~');
                } else {
                    $.each(data, function (index, son_comment) {
                        var pk = son_comment.pk;
                        var article_id = son_comment.article_id;
                        var content = son_comment.content;
                        var parent_comment_id = son_comment.parent_comment_id;
                        var create_time = son_comment.create_time;
                        s = `<div class="one-of-comment-tree son-comment" self_id=${pk}>
                            <div class="show-avatar">
                                <img src="/static/img/bg_img/batterfly.jpg" id="show-avatar" alt="头像加载失败">
                            </div>
                            <p class="username" style="margin-bottom: 10px">${article_id}</p>
                            <p class="comment-time">${create_time}</p>
                            <p class="comment-desc" style="margin-top: 5px;margin-left: 60px">${content}</p>
                            </div>`;
                        $("[self_id=" + parent_comment_id + "]").append(s);
                        show_more_son_comment = false;
                    })
                }
            }
        })
    } else {
        show_more_son_comment = true;
        $('.son-comment').remove();
    }

})

// 美化代码块
function beautiful() {
    if (!$('pre').hasClass('line-numbers')) {
        $('pre').addClass('line-numbers').before($(
            '<figcaption class="line-numbers-head">' +
            '<div class="custom-carbon">' +
            '<div class="custom-carbon-dot custom-carbon-dot--red"></div>' +
            '<div class="custom-carbon-dot custom-carbon-dot--yellow"></div>' +
            '<div class="custom-carbon-dot custom-carbon-dot--green"></div>' +
            '</div>' +
            '</figcaption>'
        ));
    }
}

beautiful()
