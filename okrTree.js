!(function(name, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {

        define(factory);
    } else {

        window[name] = factory();
    }

})("jqOrgTree", function() {
        /**模板区域**/
        var namespace = "jqOrgTree",
            jqOrgTree = {},
            dropDom = "", //当前正在拖动的dom
            //带有子节点的需要这条dom树
            lineDom = "<div class='line'><div class='left top'></div><div class='right top'></div><div style='clear:both'></div></div>",
            //左叶子树需要
            lineTop = "<div class='lineTop'></div>",
            leftDom = "<div class=leftWhite></div>",
            rightDom = "<div class=rightWhite></div>",
            tagBox = function() {
                // console.log(arguments)
                return '<div class="tagBox"><div class="tagLeft"><div class="noneLine"></div></div><div class="tagRight"><div class="line"></div><div class="tagContent">' + arguments[1] + '</div><div class="noneLine"></div></div></div>'
            },
            expandBox = "<div class='expandIcon' title='折叠'>-</div>";
        template = function() {
            var ltemList = "";
            return itemList;
        };
        /**开始疯狂编码----------------------------------------------------------------------------------------------------------------**/
        jqOrgTree[namespace] = function() {
            this.init = init;
        };
        // var tagList = {};
        function buildNode(data) {
            var str = "";
            var template = function(data, vip, root, path, tag_index, zType) {
                    // $.each(data, function(index, item) {
                    //     if (item && item.hasOwnProperty("type") && item.type == "tag") {
                    //         tagList[path] = data.splice(index, 1)[0];
                    //         tagList[path].path = path + "-" + index;
                    //     }
                    // })
                    var s = "",
                        len = data.length,
                        parent = path || "";
                    $.each(data, function(index, item) {

                                var path = "",
                                    tag = "";
                                zr = ""
                                tagIndex = 0;
                                if (!parent) {
                                    path = index;
                                } else {
                                    path = parent + '-' + index;
                                }
                                /* 处理tag标记*/
                                item.children && $.each(item.children, function(index, item1) {
                                    if (item1.type && item1.type == "tag") {
                                        tag = tagBox(item1, path + '-' + index);
                                        if (item.children.length > 1 && index == 0) {
                                            tagIndex = 1;
                                            zr = "left";
                                        } else {
                                            (item.children.length - 1 == index) && (tagIndex = item.children.length - 2, zr = "right")
                                        }
                                    }
                                })

                                if (item.type && item.type == "tag") return;
                                //s += "<div class=\"item\" data-z=\"".concat(zType, "\" data-path=").concat(path, ">").concat(vip ? rightDom : '').concat(index == 0 && !root || index == tag_index && zType == 'left' ? leftDom : index == len - 1 || index == tag_index && zType == 'right' ? rightDom : '').concat(root ? '' : lineTop, "<div class=\"content\"><div class=\"template\" draggable=\"true\">").concat(item.name + '<b style=color:red>' + path + '</b>', "</div></div>").concat(item.children && expandBox || "").concat(tag).concat(item.children ? "".concat(tag == "" ? lineDom : "", "<div class=\"row\">").concat(template(item.children, item.children.length == 1, false, parent + (parent && "-") + index, tagIndex, zr), "</div>") : '', "</div>");
                                s += `<div class="item" data-z="${zType}" data-path=${path}>${vip?rightDom:''}${(index==0&&!root||(index==tag_index&&zType=='left'))?leftDom:(index==len-1||(index==tag_index&&zType=='right'))?rightDom:''}${root?'':lineTop}<div class="content"><div class="template" draggable="true">${item.name+'<b style=color:red>'+path+'</b>'}</div></div>${item.children&&expandBox||""}${tag}${item.children?`${tag==""?lineDom:""}<div class="row">${template(item.children,item.children.length==1,false,parent+(parent&&"-")+index,tagIndex,zr)}</div>`:''}</div>`;
                                //s += `<div class="item" data-path=${path}>${vip?rightDom:''}${index==0&&!root?leftDom:index==len-1?rightDom:''}${root?'':lineTop}<div class="content"><div class="template">${item.name+'<b style=color:red>'+path+'</b>'}</div></div>${tag}${item.children?`${lineDom}<div class="row">${template(item.children,item.children.length==1,false,parent+(parent&&"-")+index)}</div>`:''}</div>`;
                                // s += "<div class=\"item\" data-path=".concat(path, ">").concat(vip ? rightDom : '').concat(index == 0 && !root ? leftDom : index == len - 1 ? rightDom : '').concat(root ? '' : lineTop, "<div class=\"content\"><div class=\"template\">").concat(item.name + '<b style=color:red>' + path + '</b>', "</div></div>").concat(item.children ? "".concat(lineDom, "<div class=\"row\">").concat(template(item.children, item.children.length == 1, false, parent + (parent && "-") + index), "</div>") : '', "</div>");
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

    function renderLayout() {
        //待处理偏移量的元素;
        var walkList = [];
        //1.先处理宽度问题
        $("#orgTree .tagBox").each(function(index, item) {
            // var tagWidth = 170;
            var tagBox = $(item);
            var tagBoxwidth = $(item).outerWidth();
            var row = tagBox.siblings('.row');
            // var parentItem = tagBox.parent().parent();
            tagBox.css({
                    height: tagBox.find(".tagContent").outerHeight() + 60 + "px",
                })
            if (tagBoxwidth / 2 > 170) {
                tagBox.find("div").find('.noneLine').remove();
                row.children('.item').length == 1 && tagBox.children('div').css({
                    'borderBottom': 'none'
                });
    
                return
            }
            if (row.children(".item").length == 1) {
                row.children(".item").eq(0).children(".lineTop,.leftWhite,.rightWhite").remove();
            } else {

            }
            tagBox.css({
                width: tagBoxwidth + 170*2 + "px",
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
            var diff = item.row.outerWidth() - (sumWidth(item.items)) * item.items.length;
            
            if (diff > 0) {
              
                item.row.css({
                    'paddingLeft': 170 + "px"
                });
                item.tag.find('.noneLine').eq(0).css({
                    width: item.tag.find('.tagLeft').outerWidth() - item.items.eq(0).outerWidth()
                })
                item.tag.find('.noneLine').eq(1).css({
                    width: item.tag.find('.tagLeft').outerWidth() - item.items.eq(item.items.length - 1).outerWidth()
                })

            } else {
                item.tag.find('.noneLine').remove();
                item.tag.css({
                    width:"auto"
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
                    visibility: ''
                }).end().text("-").attr("title", "折叠");
            } else {
                parent.addClass("expand");
                $(this).nextAll().css({
                    visibility: 'hidden'
                }).end().text("+").attr('title', "展开");
            }
        });
        $("#orgTree").on('dragstart', '.template', function(e) {
            dropDom = $(this);
            dropDom && $("#orgTree .template").not(dropDom && dropDom.parent().parent().find(".template")).css({
                border: "dashed 1px black"
            });
        });
        $("#orgTree").on('dragover', ".template", function(e) {
            e.preventDefault();
            if ($(this)[0] !== dropDom[0]) {
                $(this).not(dropDom.parent().parent().find(".template")).css({
                    border: "dashed 1px red"
                })
            }
        });
        $("#orgTree").on('dragleave', ".template", function(e) {
            dropDom && $("#orgTree .template").not(dropDom && dropDom.parent().parent().find(".template")).css({
                border: "dashed 1px black"
            });
        });
        $("#orgTree").on('drop', '.template', function(e) {
            event.preventDefault();
            var to = $(this).parent().parent()[0],
                form = dropDom.parent().parent()[0];
            if ($.contains(form, to) || dropDom[0] == $(this)[0]) {
                //  console.log('不能执行自己的拖拽逻辑')
            } else {
                walkData($(to).attr('data-path'), $(form).attr("data-path"));
            }
        })
        $("#orgTree").on('dragend', function(e) {
            $("#orgTree .template").css({
                border: ""
            });
        })
    }
    /**拖拽节点后处理布局**/
    function walkData(toPath, formPath) {
        var formPatharrray = formPath.split("-");
        var toData = new Function("return dataArray" + "[" + toPath.split("-").join("].children[") + "]")();
        var formData = new Function("return dataArray" + "[" + formPath.split("-").join("].children[") + "]")();
        var popIndex = formPatharrray.pop();
        var formParent = new Function("return dataArray" + "[" + formPatharrray.join("].children[") + "]")();
        if (toData.children) {
            toData.children.push(formData);
            formParent.children.splice(popIndex, 1);
        } else {
            toData.children = [formData];
            formParent.children.splice(popIndex, 1);
        }
        formParent.children.length == 0 && (formParent.children = "")
        $("#orgTree").html(buildNode(dataArray)); // 注册dom
        renderLayout(); // 渲染布局
    }
    function init() {
        $("#orgTree").html(buildNode(dataArray)); // 注册dom
        renderLayout(); // 渲染布局
        initEvent(); // 注册事件  
    }
    init();
})