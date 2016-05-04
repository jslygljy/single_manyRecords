var LEFT_FLASH_TAB = {};
var RIGHT_FLASH_TAB = {};
var PLAY_TIME = 0;
var _address = 0;
var moive_path = 0;
var files = 0;
var state = "paues";

$.get("/public/player/timeline.json", function(data){
    data = eval('(' + data + ')');
    window.timestamp = data.timestamp;
    window.jsonobj = data.folder;
    window.jsonMoive = data.moive;

    window.single_init ={
        time_line : function(){
            //时间戳操作
            var $v_list = $('.video_time ul').on('click', 'li', function() {
                $(".video_time li").removeClass("choose");
                $(this).addClass("choose");
                var time_data = $(this).attr('data-time');
                control_Player("seek", time_data);
            });
            //时间戳加载
            var strHtml = '';
            var first = true;
            for (var key in window.timestamp) {
                strHtml += '<li ' + (first ? ' class="choose" ' : '') + ' data-time="' + key + '">' + "<label>"  + timestamp[key] + " </label>  <span> " + morephoto.arrive_timer_format(key) + "秒</span></li>";
                first = false;
            }
            $v_list.html(strHtml);
        },
        video_init : function(){
             //输入左边视频和右边vga画面
            var jsonleft = [];
            window.jsonright = [];
            for (var key in window.jsonMoive) {
                var c = key.split("_");
                jsonleft.push(c[0]);
                jsonright.push(c[1]);
            };
            for (var i = 1; i <= 3; i++) {
                var _i = i.toString();
                switch (jQuery.inArray(_i, jsonleft)) {
                    case 0:
                        right_One_param = {
                            skin: "/public/player/MinimaFlatCustomColorAll.swf",
                            volume: "0",
                            url:"/public/cars.mp4",
                            hidemenu : true
                        };
                        RIGHT_FLASH_TAB["video0"] = new FlvPlayer($class("flash_one")[0], "RIGHT_FLASH_TAB.video0", "/public/player/videoPlayer.swf", right_One_param);
                        break;
                    case 1:
                        left_param = {
                            skin: "/public/player/MinimaFlatCustomColorAll.swf",
                            hidemenu : true,
                            url:"/public/2191.flv"
                        };
                        LEFT_FLASH_TAB["video1"] = new FlvPlayer($class("video_left0")[0], "LEFT_FLASH_TAB.video1", "/public/player/videoPlayer.swf", left_param);
                        break;
                    case 2:
                        left_param = {
                            skin: "/public/player/MinimaFlatCustomColorAll.swf",
                            volume: "0",
                            url:"/public/cars.mp4",
                            hidemenu : true
                        };
                        LEFT_FLASH_TAB["video2"] = new FlvPlayer($class("video_left1")[0], "LEFT_FLASH_TAB.video2", "/public/player/videoPlayer.swf", left_param);
                        break;
                }
            }
        },
        video_Event : function(){
            //视频信息
            LEFT_FLASH_TAB["video1"].playerEvent.add("onPlaying", function() {
                time = arguments[0].message;
                PLAY_TIME = time / LEFT_FLASH_TAB["video1"].totalTime * 100;
                $class("mejs-time-handle")[0].style.left = Math.max(PLAY_TIME - 1, 1) + "%";
                $class("mejs-time-current")[0].style.width = Math.max(PLAY_TIME - 1, 1) + "%";
                $(".timer_play").html(morephoto.arrive_timer_format(Math.floor(time)));
                console.log(morephoto.arrive_timer_format(Math.floor(time)))
            });
            LEFT_FLASH_TAB["video1"].playerEvent.add("onMetadataReceived", function() {
                var totalTime = Math.floor(LEFT_FLASH_TAB["video1"].totalTime);
                $(".timer_all").html(morephoto.arrive_timer_format(totalTime));
                console.log(morephoto.arrive_timer_format(totalTime));
                $(".timer_all").attr("data-time", totalTime);
                var time_li_num = $('.video_time li');
                for (var f = 0; f < time_li_num.length;f++) {
                    var time_line_li = $('.video_time li:eq('+ f +')');
                    var time_line_label = $(".video_time li").eq(f).find("label").html();
                    var time_data = time_line_li.attr('data-time');
                    LEFT_FLASH_TAB["video1"].addCuePoint(time_data,time_line_label);
                };
            });
            LEFT_FLASH_TAB["video1"].playerEvent.add("onProgress",function(){
                    var prec = arguments[0].message;
                    $class("mejs-time-onProgress")[0].style.width = Math.min(prec*100, 100) + "%";
                });
        },
        allVideo : function(){
            //右边全分屏加载
            var jsonkey = [];
            for (var key in window.jsonMoive) {
                jsonkey.push(key);
                files = jsonkey.length;
            };
            $("body").attr("id", "body" + files);
            for (var right_num = 1; right_num <= files; right_num++) {
                Win.open({
                    container: $class("flash_all")[0],
                    id: "dialog_video" + right_num,
                    html: "",
                    title: window.jsonright[right_num - 1]
                });
                $("#dialog_video" + right_num).attr("style", "");
                right_param = {
                    url: window.jsonMoive[jsonkey[right_num-1]],
                    skin: "/public/player/MinimaFlatCustomColorAll.swf",
                    hidemenu : true
                };
                RIGHT_FLASH_TAB["video" + right_num] = new FlvPlayer($class("dialog_Body", $id("dialog_video" + right_num))[0], "RIGHT_FLASH_TAB.video" + right_num, "/public/player/videoPlayer.swf", right_param);
            };
            jsonkey = [];
        },
        movie_Flag : function () {
            data.mo
        }
    };
        
    function single_init(){
        var body_init =window.single_init;
        body_init.time_line();
        body_init.video_init();
        body_init.video_Event();
        //body_init.allVideo();

        $('.btnrect').on('click', function() {
            $(".video_left0,.flash_one").css("visibility", "visible");
            $(".video_left0,.video_left1").css("height", "130px");
            $(".flash_one").css("height", "535px");
            body_init.time_line();
            body_init.video_init();
            body_init.allVideo();
        });
    }
    single_init();
}, 'text');

//拖动事件
function changeRange(o, e, v, callback) {
    var w = o.parentNode.offsetWidth;
    if (!window.event) {
        e.preventDefault();
    }
    var tX = o.offsetLeft,
        dx = e.clientX,
        rat = null;
    events.addEvent(document, 'mousemove', mouseMove);
    events.addEvent(document, 'mouseup', mouseUp);

    function mouseMove() {
        var e = arguments[0] || window.event;
        var len = tX + e.clientX - dx + o.offsetWidth / 2;
        if (len >= 0 && len <= w - o.offsetWidth) {
            rat = len / w;
            o.style.left = rat * 100 + "%";
            v.style.width = rat * 100 + "%";
        }
        if (window.event) e.returnValue = false;
    }

    function mouseUp() {
        if (rat !== null) callback(rat);
        events.removeEvent(document, 'mousemove', mouseMove);
        events.removeEvent(document, 'mouseup', mouseUp);
    }
}

var morephoto = {
    //毫秒转换时分秒
    arrive_timer_format: function(s) {
        var h=0,i=0;
    if(s>60){
        i=parseInt(s/60);
        s=parseInt(s%60);
        if(i > 60) {
            h=parseInt(i/60);
            i = parseInt(i%60);
        }
    }
    // 补零
    var zero=function(v){
        return (v>>0)<10?"0"+v:v;
    };
    return [zero(h),zero(i),zero(s)].join(":");
    }
}


$('.stopfile').on('click', function() {
    control_Player("stopfile");
});

function pageHide(content){
    $(content).attr("style", "visibility:hidden");
}
function pageShow(content){
    $(content).attr("style", "visibility:visible");
}
//select 选择
$("#headerSelect").change(function() {
    if (this.value == "all") {
        pageHide(".video_left0");
        pageHide(".video_left1");
        pageHide(".flash_one");
        pageShow(".flash_all, .myDialog");
        control_Player("seek", PLAY_TIME);
    }
    if (this.value == 3) {
        //右边和左边第二个视频隐藏
        pageHide(".video_left1");
        pageHide(".myDialog");
        pageShow(".video_left0 .flash_one");
        control_Player("seek", PLAY_TIME);
    }
    if (this.value == 4) {
        pageHide(".myDialog");
        pageShow(".video_left0,.flash_one")
        $(".video_left1").attr("style","height:130px;visibility:visible");
        $(".video_time ul").css("margin-bottom","17px")
        control_Player("seek", PLAY_TIME);
    }
});
//视频控制方法
function control_Player(ways, num) {

   // RIGHT_FLASH_TAB.video0[ways](num);
    LEFT_FLASH_TAB.video1[ways](num);
   // LEFT_FLASH_TAB.video2[ways](num);

};
//播放控制
var vsButton = $(".mejs-playpause-button");
vsButton.click(function() {

    if (!vsButton.hasClass('mejs-pause')) {
        //播放
        vsButton.addClass('mejs-pause');
        control_Player("playFile");

    } else {
        vsButton.removeClass('mejs-pause');
        control_Player("pauseFile");
    }
});

//播放状态控制
function play_State() {
    var button_State = vsButton.attr("aria-controls");
    if (state == button_State) {
        state = "paues";
        vsButton.removeClass('mejs-pause');
        control_Player("pauseFile");
    } else {
        state = "play";
        vsButton.addClass('mejs-pause');
        control_Player("playFile");
    }
};
//音量
events.addEvent($class("mejs-horizontal-volume-handle")[0], 'mousedown', function() {
    var e = arguments[0] || window.event,
        target = e.srcElement || e.target;
    changeRange(target, e, $class("mejs-horizontal-volume-current")[0], function(rat) {
        var _t = rat * 1.3;
        control_Player("setVolume", _t);
        if (_t <= 0.1) {
            $('#vsvideo').addClass("volume-empty");
        } else {
            $('#vsvideo').removeClass("volume-empty");
        };

    })
});

//静音处理
$('#vsvideo').on('click', function() {
        control_Player("setVolume", 0);
        $(this).addClass("volume-empty");
        $(".mejs-horizontal-volume-handle").css("left", "1.35%");
        $(".mejs-horizontal-volume-current").css("width", "1.35%");
    })
    //视频控制
events.addEvent($class("mejs-time-handle")[0], 'mousedown', function() {
    var e = arguments[0] || window.event,
        target = e.srcElement || e.target;
    changeRange(target, e, $class("mejs-time-current")[0], function(rat) {
        var _t = rat * LEFT_FLASH_TAB.video1.totalTime;
        $(".timer_play").html(morephoto.arrive_timer_format(Math.floor(_t)));
        control_Player("seek", _t);
        control_Player("playFile");
        play_State();
    })
});