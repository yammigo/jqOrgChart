/**
 * version:0.1
 * 2020/12/18 
 * author:fanjiantao (abbe)
 */

!(function(name, factory) {
    try {
        if ($) {}
    } catch (error) {
        console.warn(error + "【本项目需要依赖jquery库】");
        return
    }
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window[name] = factory();
    }

})("OkrTree", function() {
        /**模板区域**/
        var namespace = "OkrTree",
            dataArray = [],
            tagCalback = null,
            itemCallback = null,
            isdrop = true,
            dropDom = "", //当前正在拖动的dom
            //带有子节点的需要这条dom树
            lineDom = "<div class='line'><div class='left top'></div><div class='right top'></div><div style='clear:both'></div></div>",
            //左叶子树需要
            lineTop = function(left, right) {
                return "<div class='lineTop'><div class='line-left ".concat(left ? "" : "top", "'></div><div class='line-right ").concat(right ? "" : "top", "'></div></div>");
            },
            // lineTop = "<div class='lineTop'><div class='line-left top'></div><div class='line-right top'></div></div>",
            // leftDom = "<div class=leftWhite></div>",
            // rightDom = "<div class=rightWhite></div>",
            leftDom = "",
            rightDom = "",
            tagBox = function(data, path, last) {
                // console.log(last)
                return '<div class="tagBox" style="position:relative">' + (last ? '<div class="tagDownLine"></div>' : '') + '<div class="tagLeft" ' + (last && 'style="border:none"') + ' ><div class="noneLine"></div></div><div class="tagRight" ' + (last && 'style="border:none"') + ' ><div class="line"></div><div class="tagContent">' + (tagCalback && tagCalback(data)) + '</div><div class="noneLine"></div></div></div>'
            },
            expandBox = "<div class='expandIcon' title='折叠'>-</div>",
            itemTemplate = function(data) {
                if (itemCallback) { return itemCallback(data) };
                return ""
            };
        /**core code----------------------------------------------------------------------------------------------------------------**/
        function buildNode(data) {

            var template = function(data, vip, root, path, tag_index, zType) {
                    var s = "",
                        len = data.length,
                        parent = path || "";
                    $.each(data, function(index, item) {

                                var path = "",
                                    tag = "",
                                    zr = "",
                                    lastTag = item.children instanceof Array && item.children.length == 1 && item.children[0].type == "tag";
                                tagIndex = 0;
                                if (!parent) {
                                    path = index;
                                } else {
                                    path = parent + '-' + index;
                                }

                                /* 处理tag标记*/
                                item.children && $.each(item.children, function(index, item1) {

                                    if (item1.type && item1.type == "tag") {
                                        tag = tagBox(item1, path + '-' + index, lastTag);
                                        if (item.children.length > 1 && index == 0) {
                                            tagIndex = 1;
                                            zr = "left";
                                        } else {
                                            (item.children.length - 1 == index) && (tagIndex = item.children.length - 2, zr = "right")
                                        }
                                    }
                                })

                                if (item.type && item.type == "tag") return;
                                //s += "<div class=\"item\" data-z=\"".concat(zType, "\" data-path=").concat(path, ">").concat(vip ? rightDom : '').concat(index == 0 && !root || index == tag_index && zType == 'left' ? leftDom : index == len - 1 || index == tag_index && zType == 'right' ? rightDom : '').concat(root ? '' : lineTop, "<div class=\"content\"><div class=\"template\" draggable=\"").concat(isdrop, "\">").concat(itemTemplate(item), "</div></div>").concat(item.children && item.children.length > 0 && expandBox || "").concat(tag).concat((item.children && item.children.length > 0) ? "".concat(tag == "" ? lineDom : "", "<div class=\"row\">").concat(template(item.children, item.children.length == 1, false, parent + (parent && "-") + index, tagIndex, zr), "</div>") : '', "</div>");
                                s += `<div class="item" data-z="${zType}" data-path=${path}>${root?'':lineTop((index==0&&!root||(index==tag_index&&zType=='left')),(index==len-1||(index==tag_index&&zType=='right')))}<div class="content"><div class="template" draggable="${isdrop}">${itemTemplate(item)}</div></div>${item.children&&item.children.length>0&&expandBox||""}${tag}${(item.children&& item.children.length > 0)?`${tag==""?lineDom:""}<div class="row">${template(item.children,item.children.length==1,false,parent+(parent&&"-")+index,tagIndex,zr)}</div>`:''}</div>`;               
            })
            return s;
        };
        return "<div class='row'>" + template(data, false, true) + "</div>";
    }
    /**局部处理tag标记**/
    function reverseObject(object) {
        /**反转对象**/
        var newObject = {};
        var keys = [];
        for (var key in object) {
            keys.push(key);
        }
        for (var i = keys.length - 1; i >= 0; i--) {
            var value = object[keys[i]];
            newObject[keys[i]] = value;
        }
        return newObject;
    }

    function renderTagBox(contentWidth){
        // $("." + namespace + " .tagBox").each(function(index, item) {
        //     var tagContent = tagBox.find(".tagContent");
        //     var contentWidth = tagContent.outerWidth();

        //     tagBox.css({
        //         width: (contentWidth+50)*2 + "px"
        //     });
        // })
     
       
    }

    function renderLayout() {
        //待处理偏移量的元素;
        var walkList = [];
        //1.先处理宽度问题
        $("." + namespace + " .tagBox").each(function(index, item) {
            // var tagWidth = 170;
            var tagBox = $(item);
            var tagBoxwidth = $(item).outerWidth();
            var row = tagBox.siblings('.row');
            var tagContent = tagBox.find(".tagContent");
            var contentHeight = tagContent.outerHeight();
            var contentWidth = tagContent.outerWidth();
            tagBox.css({
                height: contentHeight + 60 + "px",
            })
            tagContent.css({
                marginTop: -(contentHeight / 2) + "px"
            })

            if (tagBoxwidth / 2 > (contentWidth + 50)) {
            
                return
            }
          
         
            tagBox.css({
                width: (contentWidth+50)*2 + "px"
            });
          
            //把暂存区元素注入队列，后续处理
            walkList.push({
                tag: tagBox,
                row: row, //row 元素
                items: row.children(".item") //子元素,
            });

        })
        $.each(walkList.reverse(), function(index, item) {
            function sumWidth(arr) {
                var s = 0;
                for (var i = arr.length - 1; i >= 0; i--) {
                    s += $(arr[i]).outerWidth();
                }
                return s;
            }
            console.log((sumWidth(item.items)) * item.items.length,"rowWidth");
            var diff = item.row.outerWidth() - (sumWidth(item.items));
            console.log(diff,"diff");
            if (diff > 0) {

                item.row.css({
                    'paddingLeft': diff / 2 + "px"
                });
              
                console.log('sadsada')

            } else {
                item.tag.find('.noneLine').remove();
                item.tag.css({
                    width: "auto"
                })
            }
            item.items.length == 1 && item.tag.children('div').css({
                'borderBottom': 'none'
            });

        })
        walkList = null;
    }

    function initEvent() {
        $(document.body).on('click', "div.expandIcon", function() {
            var parent = $(this).parent();
            if (parent.hasClass("expand")) {
                parent.removeClass("expand");
                $(this).nextAll().css({
                    visibility: '',
                    // display: ''
                }).end().text("-").attr("title", "折叠");
            } else {
                parent.addClass("expand");
                $(this).nextAll().css({
                    visibility: 'hidden',
                    // display:"none"
                }).end().text("+").attr('title', "展开");
            }
           
        });
        if (!isdrop) return;
        $("." + namespace).on('dragstart', '.template', function(e) {
            dropDom = $(this);
            dropDom && $("#orgTree .template").not(dropDom && dropDom.parent().parent().find(".template")).css({
                border: "dashed 1px black"
            });
        });
        $("." + namespace).on('dragover', ".template", function(e) {
            var e = e || window.event
            e.preventDefault();
            if ($(this)[0] !== dropDom[0]) {
                $(this).not(dropDom.parent().parent().find(".template")).css({
                    border: "dashed 1px red"
                })
            }
        });
        $("." + namespace).on('dragleave', ".template", function(e) {
            dropDom && $("#orgTree .template").not(dropDom && dropDom.parent().parent().find(".template")).css({
                border: "dashed 1px black"
            });
        });
        $("." + namespace).on('drop', '.template', function(e) {
            var e = e || window.event
            e.preventDefault();
            var to = $(this).parent().parent()[0],
                form = dropDom.parent().parent()[0];
            if ($.contains(form, to) || dropDom[0] == $(this)[0]) {
                //  console.log('不能执行自己的拖拽逻辑')
            } else {
                walkData($(to).attr('data-path'), $(form).attr("data-path"));
            }
        })
        $("." + namespace).on('dragend', function(e) {
            $("." + namespace + " .template").css({
                border: ""
            });
        })
    }
    /**拖拽节点后处理布局**/
    function walkData(toPath, formPath) {
        var formPatharrray = formPath.split("-");
        var toData = new Function("dataArray", "return dataArray" + "[" + toPath.split("-").join("].children[") + "]")(dataArray);
        var formData = new Function("dataArray", "return dataArray" + "[" + formPath.split("-").join("].children[") + "]")(dataArray);
        var popIndex = formPatharrray.pop();
        var formParent = new Function("dataArray", "return dataArray" + "[" + formPatharrray.join("].children[") + "]")(dataArray);
        if (toData.children) {
            toData.children.push(formData);
            formParent.children.splice(popIndex, 1);
        } else {
            toData.children = [formData];
            formParent.children.splice(popIndex, 1);
        }
        formParent.children.length == 0 && (formParent.children = "")
        $("." + namespace).html(buildNode(dataArray)); // 插入模板
        renderLayout(); // 渲染布局


    }

    function init() {
        $("." + namespace).html(buildNode(dataArray)); // 插入模板
        renderLayout(); // 渲染布局
        initEvent(); // 注册事件  
    }
    $.fn[namespace] = function(options) {
        var defaults = {
                version: "1.0",
                isdrop: true,
                data: [],
                css: {
                    lineColor: "black",
                    background: "#fff"
                },
                style: document.createElement('style'),

            },
            opts = $.extend({}, defaults, options),
            style = ".OkrTree .row {zoom: 1}.OkrTree .row::after {content: \" \";display: block;clear: both}.OkrTree .item {display: table-cell;position: relative;text-align: center;vertical-align: top;}.OkrTree .line {margin: auto;height: 20px}.OkrTree .line .left {width: 50%;height: 100%;float: left;box-sizing: border-box;border-right: solid 1px ".concat(opts.css.lineColor, ";}.OkrTree .line .right {width: 50%;height: 100%;float: left;box-sizing: border-box;border-left: solid 1px ").concat(opts.css.lineColor, ";}.OkrTree .row .item:first-child {margin-left: 0}.OkrTree .content {text-align: center;margin: auto;box-sizing: border-box;padding: 0 10px;border-radius: 4px;white-space: normal}.OkrTree .content>.template {width: auto;margin: auto;display: inline-block;border-radius: 4px;word-break: break-all;white-space: pre-wrap}.OkrTree .lineTop {height: 20px;margin: auto;position: relative;}.OkrTree .lineTop>.line-left {width: 50%;position: absolute;box-sizing: border-box;height: 100%;border-right: solid 1px ").concat(opts.css.lineColor, ";}.OkrTree .lineTop>.line-left.top {border-top: solid 2px ").concat(opts.css.lineColor, ";}.OkrTree .lineTop>.line-right.top {border-top: solid 2px ").concat(opts.css.lineColor, ";}.OkrTree .lineTop>.line-right {position: absolute;left: 50%;box-sizing: border-box;width: 50%;border-left: solid 1px ").concat(opts.css.lineColor, ";height: 100%;}.OkrTree .tagBox {overflow: hidden;min-height: 50px;box-sizing: border-box}.OkrTree .tagBox>div {float: left;width: 50%;height: 100%;box-sizing: border-box;}.OkrTree .tagBox div.tagLeft {border-right: solid 1px ").concat(opts.css.lineColor, ";position: relative}.OkrTree .tagBox>.tagDownLine {width: 0px;border-right: 2px solid ").concat(opts.css.lineColor, ";position: absolute;left: 50%;margin-left: -1px;height: 50%}.OkrTree .tagBox div.tagRight {border-left: solid 1px ").concat(opts.css.lineColor, ";position: relative}.OkrTree .tagBox div.tagRight>.line {width: 50px;height: 0;top: 50%;margin-top: -1px;border-bottom: solid 2px ").concat(opts.css.lineColor, ";position: absolute}.OkrTree .tagContent {position: absolute;top: 50%;left: 50px;width: auto;text-align: center;border-radius: 4px;}.OkrTree .tagBox div.tagRight .tagItem {height: 40px;background-color: green;position: absolute;right: 0;top: 50%;margin-top: -20px;border-radius: 2px;color: #fff;text-align: center;line-height: 40px}.OkrTree .expandIcon {display: inline-block;width: 20px;height: 20px;background-color: ").concat(opts.css.lineColor, ";color: #fff;font-size: 100%;line-height: 20px;text-align: center;border-radius: 50%;cursor: pointer;font-weight: bold}.OkrTree .template {border: solid 1px transparent;}");;
        this.addClass(namespace);
        opts.style.innerHTML = style;
        document.getElementsByTagName('head')[0].appendChild(opts.style);
        dataArray = opts.data instanceof Array && opts.data;
        typeof opts.itemTemplate == 'function' && (itemCallback = opts.itemTemplate);
        typeof opts.tagTemplate == 'function' && (tagCalback = opts.tagTemplate);
        typeof opts.isdrop == 'boolean' && (isdrop = opts.isdrop);
        init();
        return opts;
    }
})