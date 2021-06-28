// HTML区域点击生成上浮文字
$(function () {
    var a_idx = 0,
        b_idx = 0;
        c_idx = 0;
    jQuery(document).ready(function ($) {
        $("html").click(function (e) {
            var a = ["欢迎你", "么么哒", "你真好", "雅蠛蝶", "棒棒哒", "真可爱", "你最美", "喜欢你", "真聪明", "爱你哦", "好厉害", "你真帅", "哈拉少"],
                b = ["#09ebfc", "#ff6651", "#ffb351", "#51ff65", "#5197ff", "#a551ff", "#ff51f7", "#ff518e", "#ff5163", "#efff51"],
                c = ["12", "14", "16", "18", "20"];
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
        ['One day someone will walk into your life,',
        'then you realize love was always worth waiting for.'],
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