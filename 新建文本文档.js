var json = [{"id":"topId","name":"财务部","position":"存在以下多个顶点！","photos":"/Images/PER/bg_02.gif","pid":"","children":[{"id":"D0037","name":"何刚","position":"总账会计","photos":"/OrgChart/D0037.JPG","pid":"topId","children":[]},{"id":"D0038","name":"黄天翔","position":"总账会计","photos":"/OrgChart/D0038.JPG","pid":"topId","children":[]},{"id":"D0039","name":"阳秀云","position":"财务分析","photos":"/OrgChart/D0039.JPG","pid":"topId","children":[]},{"id":"D0040","name":"孙跃坤","position":"财务分析","photos":"/OrgChart/D0040.JPG","pid":"topId","children":[]},{"id":"D0041","name":"田秧","position":"出纳","photos":"/OrgChart/D0041.JPG","pid":"topId","children":[]},{"id":"D0042","name":"陈银强","position":"出纳","photos":"/OrgChart/D0042.JPG","pid":"topId","children":[]},{"id":"D0043","name":"梁瑞","position":"财务分析","photos":"/OrgChart/D0043.JPG","pid":"topId","children":[]},{"id":"D02038","name":"岳俊","position":"财务主管","photos":"/Images/PER/bg_02.gif","pid":"topId","children":[]},{"id":"D02041","name":"林志坤","position":"财务经理","photos":"/Images/PER/bg_02.gif","pid":"topId","children":[]},{"id":"D0001","name":"J ason","position":"(兼)财务经理","photos":"/OrgChart/D0001.JPG","pid":"topId","children":[]}]}]

$(function () {	
	$("#org").html(createList(json));
	$("#org>ul").jOrgChart({
		depth: -1,
		chartElement: '#chart',
	});
	initDraggableAndDroppable();
	$($($("#chart").children("div").get(0)).children("table").get(0)).prepend('<tr class="node-cells"><td height="30" colspan="500"><b>财务部</b></td></tr>') ;	
	
});

function initDraggableAndDroppable() {
	$('.node').draggable({
		proxy: 'clone',
		revert: true,
		cursor: 'move',
		onStartDrag: function () {
			$('.node').not(this).addClass("over");
		},
		onStopDrag: function () {
			$('.over').removeClass("over");
		}
	});
	$('.node').droppable({
		accept: '.node',
		onDragEnter: function (e, source) {
			$(source).draggable('options').cursor = 'auto';
			$(source).draggable('proxy').css('border', '1px solid red');
			$(this).addClass('over');
		},
		onDragLeave: function (e, source) {
			$(source).draggable('options').cursor = 'not-allowed';
			$(source).draggable('proxy').css('border', '1px solid #ccc');
			$(this).removeClass('over');
		},
		onDrop: function (e, source) {
			appendNode(json, $(this).text(), $(source).text());
		}
	});
}

function createList(jsonData) {
	var flag = "1";  //值为1显示员工照片，为空不显示
	var html = '<ul>';
	for (var i = 0; i < jsonData.length; i++) {
		var jsonDes = "<a title='"+jsonData[i].name+" "+jsonData[i].position+"' href='javascript:void(0)' onmouseup=detail('"+jsonData[i].id+"');><p>"+jsonData[i].name+"</p><p>"+jsonData[i].position+"</p></a>";
		if(jsonData[i].id == "topId"){
			jsonDes = "<p>"+jsonData[i].name+"</p><p>"+jsonData[i].position+"</p>";
		}
		if(flag == ""){
			html += "<li>"+jsonDes ;
		}
		else {
			html += "<li><img style='margin-bottom:4px;width:75;height:88' src='"+jsonData[i].photos+"'></img>"+jsonDes ;
		}
		if (jsonData[i].children) {
			html += createList(jsonData[i].children);
		}
		html += '</li>';
	}
	html += '</ul>';
	return html;
}

function appendNode(jsonData, parentName, childName) {
	var nodeChild = findNode(jsonData, childName);
	jsonData = removeNode(jsonData, childName);
	jsonData = insertNode(jsonData, parentName, nodeChild);
	$("#chart").hide();
	$("#chart").html('');
	$("#org").html(createList(jsonData));
	$("#org>ul").jOrgChart({
		depth: -1,
		chartElement: '#chart'
	});
	$("#chart").show();
	initDraggableAndDroppable();
	json = jsonData;
}

function insertNode(jsonData, parentName, childNode) {
	for (var i = 0; i < jsonData.length; i++) {
		var name = jsonData[i].name+jsonData[i].position;
		if (name == parentName) {
			if (jsonData[i].children) {
				jsonData[i].children.push(childNode);
			}else {
				var children = new Array();
				children.push(childNode);
				jsonData[i].children = children;
			}
		}else if (jsonData[i].children) {
			jsonData[i].children = insertNode(jsonData[i].children, parentName, childNode);
		}
	}
	return jsonData;
}

function removeNode(jsonData, nodeName) {
	for (var i = 0; i < jsonData.length; i++) {
		var name = jsonData[i].name+jsonData[i].position;
		if (name == nodeName) {
			jsonData.splice(i, 1);
		}else if (jsonData[i].children) {
			jsonData[i].children = removeNode(jsonData[i].children, nodeName);
		}
	}
	return jsonData;
}

function findNode(jsonData, nodeName) {
	for (var i = 0; i < jsonData.length; i++) {
		var name = jsonData[i].name+jsonData[i].position;
		if (name == nodeName) {
			return jsonData[i];
		}else if (jsonData[i].children) {
			var result = findNode(jsonData[i].children, nodeName);
			if (result) {
				return result;
			}
		}
	}
}