// 当前时间
function myDate() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var w;
    if (hours <= 12) {
        w = "AM";
    } else {
        w = "PM";
    }
    hours = hours > 12 ? hours - 12 : hours;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    var weekday = 0;
    switch (now.getDay()) {
        case 0:
            weekday = "星期日";
            break;
        case 1:
            weekday = "星期一";
            break;
        case 2:
            weekday = "星期二";
            break;
        case 3:
            weekday = "星期三";
            break;
        case 4:
            weekday = "星期四";
            break;
        case 5:
            weekday = "星期五";
            break;
        case 6:
            weekday = "星期六";
            break;
    }
    // document.getElementById("div").innerHTML=year+"年"+month+"月"+day+"日"+hours+"："+minutes+"："+seconds;
    document.getElementById("div").innerHTML = "<h4>" + year + "年" + month + "月" + day + "日 " + hours + "：" + minutes + "：" + seconds + " " + w + " " + weekday + "</h4>";
}

//  var mytime=setInterval("myDate()",1000);
setInterval(myDate, 1000);

// 文本编辑器
KindEditor.ready(function (K) {
    window.editor = K.create('#article_content', {
        items: [
            'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste',
            'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
            'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
            'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
            'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
            'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
            'flash', 'media', 'insertfile', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
            'anchor', 'link', 'unlink', '|', 'about'
        ],

        //关键所在，当失去焦点时执行this.sync()，同步输入的值到textarea中;
        afterBlur: function () {
            this.sync();
        },
        // 使用form表单直接进行提交KindEditor textarea 中的内容可以提交到controller中，
        // 使用ajax得加上上面这行代码，同步输入的值到textarea，问题解决。

        uploadJson: '/upload_article_files/',
        extraFileUploadParams: {
            csrfmiddlewaretoken: $('[name="csrfmiddlewaretoken"]').val()
        },
        filePostName: 'illustration',
        width: '100%',
        height: '380px',
        resizeType: 0,
    });
});

// 提交
$('.submit_article').click(function () {
    var title = $('#article_title').val();
    var cateId = $('#cateId').val();
    var tagsId = $('#tagsId').val();
    var content = $('#article_content').val();
    var csrf = $("[name='csrfmiddlewaretoken']").val();
    // 校验信息，过滤判断
    if (title && cateId && tagsId && content) {
        $.ajax({
            url: '',
            type: 'post',
            data: {
                'title': title,
                'cateId': cateId,
                'tagsId': tagsId,
                'content': content,
                'csrfmiddlewaretoken': csrf,
            },
            success: function (data) {
                var response = JSON.parse(data);
                if (response.pass) {
                    alert('发布成功!');
                    location.href = '/center_msg/';
                }
            }
        })
    } else if (!title) {
        $('#article_title').css('border', '2px solid red');
        setTimeout(function () {
            $('#article_title').css('border', '2px solid deepskyblue');
        }, 5000);
    } else if (!content) {
        alert('请写完你的文章再做提交!');
    }
})