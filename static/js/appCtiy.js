
//地图容器
var chart = echarts.init(document.getElementById('main'));


//34个省、市、自治区的名字拼音映射数组
var provinces = {
	//23个省
	// "江苏": "jiangsu",

	"台湾": "taiwan",
	"河北": "hebei",
	"山西": "shanxi",
	"辽宁": "liaoning",
	"吉林": "jilin",
	"黑龙江": "heilongjiang",
	"江苏": "jiangsu",
	"浙江": "zhejiang",
	"安徽": "anhui",
	"福建": "fujian",
	"江西": "jiangxi",
	"山东": "shandong",
	"河南": "henan",
	"湖北": "hubei",
	"湖南": "hunan",
	"广东": "guangdong",
	"海南": "hainan",
	"四川": "sichuan",
	"贵州": "guizhou",
	"云南": "yunnan",
	"陕西": "shanxi1",
	"甘肃": "gansu",
	"青海": "qinghai",
	//5个自治区
	"新疆": "xinjiang",
	"广西": "guangxi",
	"内蒙古": "neimenggu",
	"宁夏": "ningxia",
	"西藏": "xizang",
	//4个直辖市
	"北京": "beijing",
	"天津": "tianjin",
	"上海": "shanghai",
	"重庆": "chongqing",
	//2个特别行政区
	"香港": "xianggang",
	"澳门": "aomen"
};

//直辖市和特别行政区-只有二级地图，没有三级地图
var special = ["北京", "天津", "上海", "重庆", "香港", "澳门"];
var mapdata = [];
//绘制全国地图
// $.getJSON('static/map/china.json', function(data) {
// 	d = [];
// 	for (var i = 0; i < data.features.length; i++) {
// 		d.push({
// 			name: data.features[i].properties.name
// 		})
// 	}
// 	mapdata = d;
// 	//注册地图
// 	echarts.registerMap('china', data);
// 	//绘制地图
// 	renderMap('china', d);
// 	
// });

var paramsValue = {
	name: "江苏",
	seriesIndex: 0,
	seriesName: "china",
	seriesType: "map",
	type: "click",
	value: NaN,
}

getCity(paramsValue);


//地图点击事件
chart.on('click', function(params) {
	var colorS = "";
	console.log(params);
	if (params.name in provinces) {
		//如果点击的是34个省、市、自治区，绘制选中地区的二级地图
		$.getJSON('./static/map/province/' + provinces[params.name] + '.json', function(data) {
			echarts.registerMap(params.name, data);
			var d = [];
			for (var i = 0; i < data.features.length; i++) {
				d.push({
					name: data.features[i].properties.name
				})
			}
			colorS = "";
			renderMap(params.name, d,colorS);
		});
	} else if (params.seriesName in provinces) {
		//如果是【直辖市/特别行政区】只有二级下钻
		if (special.indexOf(params.seriesName) >= 0) {
			renderMap('china', mapdata);
		} else {
			//显示县级地图
			$.getJSON('./static/map/city/' + cityMap[params.name] + '.json', function(data) {
				echarts.registerMap(params.name, data);
				var d = [];
				for (var i = 0; i < data.features.length; i++) {
					d.push({
						name: data.features[i].properties.name
					})
				}
				colorS = "";
				renderMap(params.name, d,colorS);
			});
		}
	} else {
		// renderMap('china', mapdata);
		getCity(paramsValue);
	}
});

//初始化绘制全国地图配置
var option = {
	backgroundColor: '#FFF',
	title: {
		text: '',
		subtext: '三级下钻',
		link: '',
		left: 'center',
// 		textStyle: {
// 			color: '#000',
// 			fontSize: 16,
// 			fontWeight: 'normal',
// 			fontFamily: "Microsoft YaHei"
// 		},
// 		subtextStyle: {
// 			color: '#ccc',
// 			fontSize: 13,
// 			fontWeight: 'normal',
// 			fontFamily: "Microsoft YaHei"
// 		}
	},
	tooltip: {
		trigger: 'item',
		formatter: '{b}'
	},
	toolbox: {
		show: true,
		orient: 'vertical',
		left: 'right',
		top: 'center',
		feature: {
// 			dataView: {
// 				readOnly: false
// 			},
			// restore: {},
			// saveAsImage: {}
		},
		iconStyle: {
			normal: {
				color: '#fff'
			}
		}
	},
	// animationDuration: 1000,
	// animationEasing: 'cubicOut',
	// animationDurationUpdate: 1000

};
var i = 0 ;
var coloresj = [
	"#FFFAE8",
	"#01CC34",
	"#7AD2F6",
	"#FF676A",
	"#FFCB65",
	"#FFCCCB",
	"#33D99B",
	"#3398CC",
	"#9A99FF",
	"#32D79B",
	"#FFCC66",
	"#A0CC7F",
	"#4EB65D",
]
function renderMap(map, data) {
	console.log(data);
	var datas = [];
	console.log(i ++)
	$.each(data,function(idnex,values){
		if(idnex > 12){
			idnex = 1;
		}
		var areaColor  = coloresj[idnex];
		datas.push({
			"name":values.name,
			"itemStyle":{
				normal: {
					areaColor:areaColor,
					borderColor: 'dodgerblue'
				},
			},
		})
	})
	console.log(datas);
	option.title.subtext = map;
	option.series = [{
		name: map,
		type: 'map',
		mapType: map,
		roam: false,
		nameMap: {
			'china': '中国'
		}, 
		label: {
			normal: {// w未选中下
				show: true,
				textStyle: {
					color: '#000',
					fontSize: 13
				}
			},
			emphasis: {// 选中下
				show: true,
				textStyle: {
					color: '#fff',
					fontSize: 13
				}
			}
		},
		itemStyle: {
			normal: {
				// areaColor: '#fff',
				borderColor: 'dodgerblue'
			},
			emphasis: {
				areaColor: 'darkorange'
			}
		},
		data:datas
	}];
	//渲染地图
	console.log(option);
	chart.setOption(option);
}

/**
 * 
 */
function getCity(params) {
	if (params.name in provinces) {
		//如果点击的是34个省、市、自治区，绘制选中地区的二级地图
		$.getJSON('./static/map/province/' + provinces[params.name] + '.json', function(data) {
			echarts.registerMap(params.name, data);
			var d = [];
			for (var i = 0; i < data.features.length; i++) {
				d.push({
					name: data.features[i].properties.name
				})
			}
			renderMap(params.name, d);
		});
	} else if (params.seriesName in provinces) {
		//如果是【直辖市/特别行政区】只有二级下钻
		if (special.indexOf(params.seriesName) >= 0) {
			renderMap('china', mapdata);
		} else {
			//显示县级地图
			$.getJSON('./static/map/city/' + cityMap[params.name] + '.json', function(data) {
				echarts.registerMap(params.name, data);
				var d = [];
				for (var i = 0; i < data.features.length; i++) {
					d.push({
						name: data.features[i].properties.name
					})
				}
				renderMap(params.name, d);
			});
		}
	} else {
		renderMap('china', mapdata);
	}
}
