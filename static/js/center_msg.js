
// 修改基本信息
function submit(edit) {
    var input_msg = $('#enter_edit_msg').val();
    if (input_msg == '') {
        alert('宝~你得告诉我你要改个啥呀!');
    } else {
        should = confirm('确定修改' + '"' + edit + '"' + '为' + '"' + input_msg + '"' + '么？');
        if (should) {
            $.ajax({
                url: '',
                type: 'post',
                data: {
                    'msg': input_msg,
                    'edit': edit,
                    'csrfmiddlewaretoken': $('[name="csrfmiddlewaretoken"]').val()
                },
                success: function (data) {
                    success_obj = JSON.parse(data);
                    if (success_obj.success) {
                        var operation = success_obj.edit_name;
                        $('#enter_edit_msg').val('');
                        if (operation == 'nick_name') {
                            $('#nickname').html(success_obj.edit_msg);
                        } else if (operation == 'email') {
                            $('#email').html(success_obj.edit_msg);
                        } else if (operation == 'tel') {
                            $('#tel').html(success_obj.edit_msg);
                        } else if (operation == 'goal') {
                            $('.goal_desc').html(success_obj.edit_msg);
                        } else if (operation == 'signature') {
                            $('.signature_desc').html(success_obj.edit_msg);
                        }
                        alert('修改成功!');
                    } else {
                        alert(success_obj.error_msg);
                        $('#enter_edit_msg').val('');
                    }
                }
            })
        } else {
            $('#enter_edit_msg').val('');
        }
    }
}

// 动态修改头像的显示问题
function avatar_c() {
    var avatar_href = document.getElementById("avatar").src;
    var img = document.getElementById("avatar");
    var image = new Image();
    var realWidth = 0;//储存图片实际宽度
    var realHeight = 0;//储存图片实际高度
    //获取图片的宽高
    image.src = avatar_href;
    //加载成功的处理
    image.onload = function () {
        realWidth = image.width;//获取图片实际宽度
        realHeight = image.height;//获取图片实际高度
        //让img的宽高相当于图片实际宽高的等比缩放，然后再偏移
        if (realWidth > realHeight) {
            img.width = (200 / realHeight) * realWidth;//等比缩放宽度
            img.height = 200;//跟div高度一致
            img.style.left = '-' + ((200 / realHeight) * realWidth - 200) / 2 + 'px';//设置图片相对自己位置偏移为img标签的宽度-高度的一半
        } else if (realWidth < realHeight) {
            img.width = 200;//跟div高度一致
            img.height = (200 / realWidth) * realHeight;//等比缩放高度
            img.style.top = '-' + ((200 / realWidth) * realHeight - 200) / 2 + 'px';//设置图片相对自己位置偏移为img标签的高度-宽度的一半
        } else {
            img.width = 200;
            img.height = 200;
        }
    };
    //图片加载失败的处理
    img.onerror = function () {
        img.src = "/static/img/home-bg.jpg";
        img.width = 280;
        img.height = 280;
    }
}

avatar_c();

// 实现预览头像并上传
/*
$('#avatar-change').change(function () {
    var objUrl = getObjectURL(this.files[0]);
    // $('#change-avatar').css('display', 'block');
    $('#big_avatar').attr("src", objUrl);

});*/

// 修改头像
$('#avatar-change').change(function () {
    var choose_files = $(this)[0].files[0];
    var reader = new FileReader();  // 选中文件
    reader.readAsDataURL(choose_files);  // 读取器读取到文件路径
    // $('#big_avatar').attr('src', reader.result);  // 拼接出选中的文件的路径  覆盖掉原路径
    //  jQuery用attr方法  原生Dom js用get方法
    reader.onload = function () {
        $('#avatar').attr('src', this.result);
    }
    var formdata = new FormData();
    formdata.append("avatar", $('#avatar-change')[0].files[0]);
    formdata.append("csrfmiddlewaretoken", $("[name='csrfmiddlewaretoken']").val());
    $.ajax({
        url: "/avatarchange/",
        type: "post",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            avatar_change = JSON.parse(data);
            if (avatar_change.is_change) {
                // $('#change-avatar').css('display', 'none');
                $('#avatar').href += '?'  // 局部刷新头像的显示
                avatar_c();
                alert('头像修改成功!');
            } else {
                alert(avatar_change.error_msg);
                // $('#change-avatar').css('display', 'none');
            }
        }
    })
});

// 删除/修改文章
$('.article .ed').click(function () {
    var del = $(this).hasClass('delete');
    if (del) {
        sure = confirm('您确定要删除这篇文章嘛?');
        operation = 'delete';
        if (sure) {
            $(this).parent().remove();
            var article_id = $(this).parent().attr('article_id');
            $.ajax({
                url: '',
                type: 'post',
                data: {
                    'article_id': article_id,
                    'operation': operation,
                    'csrfmiddlewaretoken': $("[name='csrfmiddlewaretoken']").val()
                },
                success: function (data) {
                    var success_obj = JSON.parse(data);
                    if (success_obj.pass) {
                        alert('删除成功!');
                    } else {
                        alert(success_obj.error);
                    }
                }
            })
        }
    }
});


// 音乐播放器
var song = new Audio;
var isStopped = true;
var currentSong = 0;
var playlist = [
    fileUrl = "/static/music/郁可唯 - 独家记忆.flac",
    fileUrl = "/static/music/华晨宇 - 国王与乞丐.flac",
    fileUrl = "/static/music/周笔畅 - 最美的期待.flac",
    fileUrl = "/static/music/李巍V仔 - 爱就一个字.flac",
    fileUrl = "/static/music/张国荣 - 当爱已成往事.flac",
    fileUrl = "/static/music/薛之谦 - 遗憾.mp3",
    fileUrl = "/static/music/迪克牛仔 - 有多少爱可以重来.flac",
];

var songFile = ['致--我的独家记忆',  // tyc 十七八岁的美好，永远留在这里吧。
    '彼时我们就像国王与乞丐', '你是我最美的期待', '爱就一个字你只说亿次',
    '当爱已成往事', '才懂你最珍贵', '可是啊，有多少爱可以重来',];
var playlistVisible = false;

function skip(to) {
    if (to == 'prev') {
        stop();
        currentSong = (--currentSong) % playlist.length;
        if (currentSong < 0) {
            currentSong += playlist.length;
        }
        playpause();
    } else if (to == 'next') {
        stop();
        currentSong = (++currentSong) % playlist.length;
        playpause();
    }
}

function playpause() {
    if (!song.paused) {
        song.pause();
        document.getElementById("glow").classList.add("disable-animation");
    } else {
        if (isStopped) {
            song.src = playlist[currentSong];
        }
        song.play();
        songName = document.getElementById("songName");
        for (var s = 0; s < songFile.length; s++) {
            if (currentSong == s) {
                songName.innerHTML = songFile[s];
            }
        }
        document.getElementById("glow").classList.remove("disable-animation");
        isStopped = false;
    }
}

function stop() {
    song.pause();
    document.getElementById("glow").classList.add("disable-animation");
    song.currentTime = 0;
    document.getElementById("seek").value = 0;
    isStopped = true;
    document.getElementById("songName").innerHTML = "Coding and Stuff";
}

function setPos(pos) {
    song.currentTime = pos;
}

function mute() {
    if (song.muted) {
        song.muted = false;
        document.getElementById('mute').className = "fa fa-volume-up";
    } else {
        song.muted = true;
        document.getElementById('mute').className = "fa fa-volume-off";
    }
}

function setVolume(volume) {
    song.volume = volume;
}

function togglePlaylist() {
    if (playlistVisible) {
        document.getElementById('playlist').className = "hide";
        document.getElementById('player').className = "";
        playlistVisible = false;
    } else {
        document.getElementById('player').className = "hide";
        document.getElementById('playlist').className = "";
        playlistVisible = true;
    }
}

function addList() {
    sourceUrl = document.getElementById('sourceUrl').value;
    sourceUrl.split(",").forEach((file) => {
        fileUrl = file.trim();
        if (fileUrl != "" && playlist.indexOf(fileUrl) == -1) {
            parent = document.getElementById('list');
            listItem = document.createElement('div');
            listItem.setAttribute('class', 'list-item');

            wrapper = document.createElement('div');
            wrapper.setAttribute('class', 'wrap-text');

            span = document.createElement('span');
            span.innerHTML = fileUrl;

            wrapper.appendChild(span);
            listItem.appendChild(wrapper);

            btn = document.createElement('button');
            btn.setAttribute('onclick', 'removeList(this)');
            btn.innerHTML = '×';

            listItem.appendChild(btn);
            parent.appendChild(listItem);
            playlist.push(fileUrl);
            document.getElementById('sourceUrl').value = '';
        }
    });
}

function removeList(item) {
    index = playlist.indexOf(item.parentElement.firstChild.innerText);
    if (index != -1) {
        playlist.splice(index, 1);
        item.parentElement.remove();
    }
}

song.addEventListener('error', function () {
    stop();
    document.getElementById("songName").innerHTML = "Error Loading Audio";
});

song.addEventListener('timeupdate', function () {
    curtime = parseInt(song.currentTime, 10);
    document.getElementById('seek').max = song.duration;
    document.getElementById('seek').value = curtime;
});

song.addEventListener("ended", function () {
    song.pause();
    song.currentTime = 0;
    document.getElementById('seek').value = 0;
    if ((currentSong + 1) >= playlist.length) {
        currentSong = 0;
    } else {
        currentSong++;
    }
    stop();
    song.src = playlist[currentSong];
    playpause();
});

var input = document.getElementById("sourceUrl");
input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        addList();
    }
});

