// 下拉菜单
// $(function () {
//     $(".select-1 p").click(function () {
//         var ul = $(".new");
//         if (ul.css("display") == "none") {
//             ul.slideDown();
//         } else {
//             ul.slideUp();
//         }
//     });
//
//     $(".set").click(function () {
//         var _name = $(this).attr("name");
//         if ($("[name=" + _name + "]").length > 1) {
//             $("[name=" + _name + "]").removeClass("select");
//             $(this).addClass("select");
//         } else {
//             if ($(this).hasClass("select")) {
//                 $(this).removeClass("select");
//             } else {
//                 $(this).addClass("select");
//             }
//         }
//     });
//
//     $(".select-1 li").click(function () {
//         var li = $(this).text();
//         $(".select-1 p").html(li);
//         $(".new").hide();
//         /*$(".set").css({background:'none'});*/
//         $("p").removeClass("select");
//     });
// })

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
        uploadJson: '/upload_article_files/',
        extraFileUploadParams: {
            csrfmiddlewaretoken: $('[name="csrfmiddlewaretoken"]').val()
        },
        filePostName: 'illustration',
        width: '100%',
        height: '300px',
        resizeType: 0,
    });
});


// 提交
// $('.submit').click(function () {
//     sure = confirm('确认要发表文章吗?');
//     if (sure) {
//         var article_title = $('#article_title').val();
//         if ($('#zdy').val() == '') {
//             var article_category = $('#article_category').html();
//         } else {
//             var article_category = $('#zdy').val();
//         }
//         var article_tag = $('#article_tag').val();
//         var content = CKEDITOR.
//         alert(content);
//         $.ajax({
//             url: '',
//             type: 'post',
//             data: {
//                 'article_title': article_title,
//                 'article_category': article_category,
//                 'article_tag': article_tag,
//                 'content': content,
//                 'csrfmiddlewaretoken': $("[name='csrfmiddlewaretoken']").val()
//             },
//             success: function (data) {
//                 success_obj = JSON.parse(data);
//                 if (success_obj.pass) {
//                     alert('从此江湖有了你的传说!');
//                     location.href = '/usercenter/';
//                 } else {
//                     if (success_obj.error_msg == 'not_all') {
//                         alert('参数不全，请填写所有文章信息!');
//                     } else {
//                         alert(success_obj.error_msg);
//                     }
//                 }
//             }
//         });
//     } else {
//         alert('果然深思熟虑...');
//     }
//
// });