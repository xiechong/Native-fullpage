(function (root, window, document, factory, undefined) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function () {
            root.fullpage = factory(window, document);
            return root.fullpage;
        });
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS.
        module.exports = factory(window, document);
    } else {
        // Browser globals.
        window.fullpage = factory(window, document);
    }
}(this, window, document, function (window, document, undefined) {
    'use strict';

    var fullpage;
    var options;   //配置选项

    var Height;   //存放当前文档的高度
    var ElementContain;  //存放大容器的DOM节点
    var ElementScroll;   //存放section容器的DOM节点
    var content;   //存放section的DOM节点

    var startTime = 0, //开始翻屏时间
        endTime = 0,  //翻屏结束时间
        now = 0;  //当前的top值

    function initialize(elementContain, elementScroll, elementItem, customOptions) {
        var defaults = {
            responseTime: 500,   //滚轮响应时间间隔
            transitionTime: 0.5, //过渡时间长度
            css3: true           //是否需要过渡效果
        }

        options = extend(defaults, customOptions);
        console.log(options);

        ElementContain = document.getElementById(elementContain);
        ElementScroll = document.getElementById(elementScroll);

        if (options.css3){
            var effect = "all " + options.transitionTime + 's';
            ElementScroll.style.transition = effect;
        }

        Height = window.innerHeight;
        ElementContain.style.height = Height + "px";

        content = document.getElementsByClassName('content');

        for (var i = 0; i < content.length; i++) {
            content[i].style.height = Height + "px";
        }

        if ((navigator.userAgent.toLowerCase().indexOf("firefox") != -1)) {
            //for firefox;
            document.addEventListener("DOMMouseScroll", scrollFun, false);
        }
        else if (document.addEventListener) {
            document.addEventListener("mousewheel", scrollFun, false);
        }
        else if (document.attachEvent) {
            document.attachEvent("onmousewheel", scrollFun);
        }
        else {
            document.onmousewheel = scrollFun;
        }

    }

    function extend(defaultOptions, options) {
        //creating the object if it doesnt exist
        if (typeof(options) !== 'object') {
            options = {};
        }
        for (var key in options) {
            if (defaultOptions.hasOwnProperty(key)) {
                defaultOptions[key] = options[key];
            }
        }
        return defaultOptions;
    }



    //滚动事件处理函数
    function scrollFun(event) {
        startTime = new Date().getTime();
        var delta = event.detail || (-event.wheelDelta);
        if ((endTime - startTime) < -options.responseTime) {
            if (delta > 0 && parseInt(ElementScroll.style.top) > -Height * ( content.length - 1)) { //向下翻页
                now += Height;
                turnPage(now);
            }
            if (delta < 0 && parseInt(ElementScroll.style.top) < 0) { //向上翻页
                now -= Height;
                turnPage(now);
            }
            endTime = new Date().getTime();
        }
        else {
            event.preventDefault();
        }
    }

    //翻页函数
    function turnPage(now) {
        ElementScroll.style.top = -now + "px";
    }

    function moveTo(sectionNum) {
        var currentPage = now / Height + 1;
        now -= (currentPage - sectionNum) * Height;
        turnPage(now);
    }

    fullpage = {
        initialize: initialize,
        moveTo: moveTo
    };

    return fullpage;
}));



