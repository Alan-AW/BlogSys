function title() {
    var d = new Date()
    var time = d.getHours()
    if (time < 24) {
        $('#title').html('♥Good evening!')
    }
    if (time < 19) {
        $('#title').html('♥Good afternoon!')
    }
    if (time < 12) {
        $('#title').html('♥Good morning!')
    }
    if (time < 5) {
        $('#title').html('♥Go to sleep!')
    }
}

title();

//poetry
var p = [
    ['晓看天色暮看云', '行也思君，坐也思君~'],
    ['忽有故人心头过', '回首山河已是秋~'],
    ['山川皆无恙', '眉目不知秋~'],
    ['年少不知软饭香', '错把青春插稻秧~'],
    ['一世浮生一刹那', '一程山水一年华~'],
    ['若无闲事挂心头', '便是人间好时节~'],
    ['You no good,', 'but deep in my heart.'],
    ['此生若能幸福安稳', '谁又愿颠沛流离~'],
    ['手握日月摘星辰', '世间无我这般人~'],
    ['若非群玉山头见', '会向瑶台月下逢~'],
    ['Hans your smile,',
        'had been flurried my time passage.'
    ],
    ['柳腰春风过', '白鸟随香走~'],
    ['借问酒家何处有', '牧童倒拔垂杨柳~'],
    ['中年心事浓如酒', '少女情怀总是诗~'],
    ['清风不问赶路人', '岁月不负有心人~'],
    ['桃李春风一杯酒', '江湖夜雨十年灯~'],
    ['山有木兮木有枝', '心悦君兮君不知~'],
    ['When it is already lost,',
        'brave to give up.'
    ],
    ['云想衣裳花想容', '春风拂槛露华浓~'],
    ['春风十里扬州路', '卷上珠帘总不知~'],
    ['清风以北过南巷', '南巷故人不知归~'],
    ['Sometimes the end must have life,',
        'life in no time it.'
    ],
    ['此生若能得幸福安稳', '谁又愿颠沛流离~'],
    ['何时杖尔看南雪', '我与梅花两白头~'],
    ['青瓦常忆旧时雨', '朱伞深巷无故人~'],
    ['If you can get happiness safe,',
        'who may displaced.'
    ],
    ['风华是一指流砂！', '苍老是一段年华！'],
    ['寒炉煮酒，雪落梅章', '君在沧海，我在潇湘~'],
];

function RandomPoetry() {
    var x = 0;
    var y = 29;
    var poetry = parseInt(Math.random() * (x - y + 1) + y);
    poetry_list = p[poetry];
    $("#first").html(poetry_list[0]);
    $("#second").html(poetry_list[1]);
}
RandomPoetry();

// 背景动态改变
var body = document.body;
var count = 0;
var url_change = [

	'url(/static/img/bg_img/1.jfif)',
	'url(/static/img/bg_img/2.jfif)',
    'url(/static/img/bg_img/3.jpg)',
	'url(/static/img/bg_img/4.jfif)',
    'url(/static/img/bg_img/5.jfif)',
	'url(/static/img/bg_img/6.jfif)',
	'url(/static/img/bg_img/bgbgbgbgbg.jpg)',
	'url(/static/img/bg_img/8.jfif)',
	'url(/static/img/bg_img/9.jfif)',
	'url(/static/img/bg_img/10.jfif)',
	'url(/static/img/bg_img/11.jfif)',

]

function change_img() {
    body.style.backgroundImage = url_change[count];
	RandomPoetry();
    count += 1;
    if (count > 11) {
        count = 0;
    }
}

// 计时器
var int = setInterval('change_img()',3000);  // 间隔3秒

$('.play').click(function (){
    window.clearInterval(int);
    $('video').css('display','block');
})

// 关于计时器
// setInterval(code,millsec,lang);
// 参数  code      必须，要调用的函数或者执行的代码串
	//   millisec  必须，周期性执行或者调用code之间的时间间隔，单位毫秒
	//   lang	   可选，JScript|VBScript|JavaScript
	// 启动
			// var int = setInterval('函数名',间隔时间(毫秒),...);
	// 删除
			// var int = window.clearInterval(int);

