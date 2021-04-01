var data = [{
    name: 'fanjiantao',
    children: [{
            name: "1",
            children: [{
                name: "1-1"
            }]
        },
        {
            name: "2",
            children: [{
                    name: "2-1"
                },
                {
                    name: "2-2",
                    children: [{
                            name: "2-2-1"
                        }, {
                            name: "3-1-1"
                        }, {
                            name: "3-1-2"
                        },
                        {
                            name: "3-1-1"
                        }, {
                            name: "3-1-2"
                        },
                        {
                            name: "3-1-1"
                        }, {
                            name: "3-1-2"
                        }
                    ]
                }
            ]
        },
        {
            name: "3",
            children: [{
                name: "3-1",
                children: [{
                        name: "3-1-1"
                    }, {
                        name: "3-1-2"
                    },
                    {
                        name: "3-1-1"
                    }, {
                        name: "3-1-2"
                    },
                    {
                        name: "3-1-1"
                    }, {
                        name: "3-1-2"
                    }
                ]
            }]
        }
    ]
}]

// function buildNode(data) {
//     var template = function(data, root) {
//             var s = "",
//                 len = data.length;
//             $.each(data, function(index, item) {
//                         s += `<tr><td class="nodes"><div class="lines" ${root&&"style=display:none"}><div class="line-top${index==0&&" node-first"||""}"></div><div class="line-bottom${index==len-1&&" node-last"||""}"></div></div><div class="node">${item.name}<b style="color:red"></b></div></td>${item.children&&`<td class="expandIcon"><div title="收起">-</div></td><td><div class="line-down"></div></td><td class="node-childrens"><table cellpadding="0" cellspacing="0"><tbody>${template(item.children)}</tbody></table></td>`||""}</tr>`
//             })
//         return s;
//     };
//     return `<table cellpadding="0" cellspacing="0"><tbody>${template(data,true)}</tbody></table>`;
// }
// $(".container").html(buildNode(data))
// $(".expandIcon>div").on('click',function(){
//     if($(this).text()=="+"){
//         $(this).text("-")
//     }else {
//         $(this).text("+")
//     }
//      $(this).parent().nextAll().toggle(300);
// })


// function buildNode(data) {
//     var template = function(data, root) {
//         var s = "",
//             len = data.length;
//         $.each(data, function(index, item) {
//             s += "<tr><td class=\"nodes\"><div class=\"lines\" ".concat(root && "style=display:none", "><div class=\"line-top").concat(index == 0 && " node-first" || "", "\"></div><div class=\"line-bottom").concat(index == len - 1 && " node-last" || "", "\"></div></div><div class=\"node\">").concat(item.name, "<b style=\"color:red\"></b></div></td>").concat(item.children && "<td class=\"expandIcon\"><div title=\"\u6536\u8D77\">-</div></td><td><div class=\"line-down\"></div></td><td class=\"node-childrens\"><table cellpadding=\"0\" cellspacing=\"0\"><tbody>".concat(template(item.children), "</tbody></table></td>") || "", "</tr>");
//         });
//         return s;
//     };

//     return "<table cellpadding=\"0\" cellspacing=\"0\"><tbody>".concat(template(data, true), "</tbody></table>");
// }

// $(".container").html(buildNode(data));
// $(".expandIcon>div").on('click', function() {
//     if ($(this).text() == "+") {
//         $(this).text("-");
//     } else {
//         $(this).text("+");
//     }

//     $(this).parent().nextAll().toggle(300);
// });