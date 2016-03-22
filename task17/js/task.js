/**
 * Created by little-wei on 2016/3/21.
 */

/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = ''
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = aqiSourceData["北京"];//默认北京的数据

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: "北京",//默认为北京
    nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
    if (pageState.nowGraTime == "day") {
        var data_time = [];//横坐标时间
        for (var i = 1; i < 92; i++) {
            data_time.push(i);
        }
        var data_value = [];//纵坐标空气指数
        //var currnt = pageState.nowSelectCity;
        for (var item in chartData) {
            /*  if(item=="")/!**!/*/
            //console.log(aqiSourceData[currnt][item])
            data_value.push(chartData[item]);
        }


    } else if (pageState.nowGraTime == "week") {

        
        var jan = [3, 7, 7, 7, 7];//一月星期分布
        var feb = [7, 7, 7, 7, 1];//二月星期分布
        var mar = [6, 7, 7, 7, 4];//二月星期分布
        var ayyay = [3, 7, 7, 7, 7, 7, 7, 7, 7, 1, 6, 7, 7, 7, 4]; //上面拼接起来
        /*if(7-Number(start)>0){
         console.log(j, item)
         }*/
        var total = jan.length + feb.length + mar.length
        var data_time = [];//横坐标时间
        for (var i = 1; i < total + 1; i++) {
            data_time.push(i);
        }
        var data_value = [];//纵坐标空气指数

        //var currnt = pageState.nowSelectCity;

        var ayyay_total = 0;
        var copy_Data = clone(chartData);
        for (var j = 0; j < ayyay.length; j++) {
            var week_ = 0;
            ayyay_total += ayyay[j];
            for (var item in copy_Data) {
                console.log(getNewDay("2016-01-01", 91));
                var week_last = getNewDay("2016-01-01", ayyay_total)
                //最后一周另外处理
                if (getNewDay("2016-01-01", ayyay_total) == "2016-04-01") {
                    week_last = "2016-03-31"
                }
                if (item == week_last) {
                    data_value.push(Math.ceil(week_ / ayyay[j]));
                    break;
                }
                week_ += copy_Data[item];
                delete  copy_Data[item]; //累加后，删除，避免重复添加
                //console.log(copy_Data)
                // data_value.push(chartData[item]);
                //console.log(aqiSourceData[currnt][item])
            }
        }


    } else if (pageState.nowGraTime == "month") {
        var data_time = [];//横坐标时间
        for (var i = 1; i < 4; i++) {
            data_time.push(i);
        }
        var data_value = [];//纵坐标空气指数
        //var currnt = pageState.nowSelectCity;
        var monthtotal_01 = 0;
        var monthtotal_02 = 0;
        var monthtotal_03 = 0;
        for (var item in chartData) {

            //截取字符
            if (item.split("-")[1] == "01") {
                monthtotal_01 += chartData[item];
            }
            if (item.split("-")[1] == "02") {
                monthtotal_02 += chartData[item];
            }
            if (item.split("-")[1] == "03") {
                monthtotal_03 += chartData[item];
            }
            //console.log(aqiSourceData[currnt][item])
        }
        data_value.push(Math.ceil(monthtotal_01 / 31));
        data_value.push(Math.ceil(monthtotal_01 / 29));
        data_value.push(Math.ceil(monthtotal_01 / 31));
    }


// 路径配置
    require.config({
        paths: {
            echarts: './js/echarts-2.2.7/build/dist'
        }
    });

// 使用
    require(
        [
            'echarts',
            'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
        ],
        function (ec) {
            // 基于准备好的dom，初始化echarts图表
            var myChart = ec.init(document.getElementById('aqi-chart-wrap'));

            var option = {
                title: {
                    text: pageState.nowSelectCity + '空气质量统计',
                    subtext: '纯属虚构'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['空气质量指数']
                },
                /*toolbox: {
                 show: true,
                 feature: {
                 mark: {show: true},
                 dataView: {show: true, readOnly: false},
                 magicType: {show: true, type: ['line', 'bar']},
                 restore: {show: true},
                 saveAsImage: {show: true}
                 }
                 },*/
                calculable: true,
                xAxis: [
                    {
                        name: "时间",
                        type: 'category',
                        data: data_time
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '空气质量指数',
                        type: 'bar',
                        data: data_value,
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        }
                    }
                ]
            };

            // 为echarts对象加载数据
            myChart.setOption(option);
        }
    );
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    var radio_list = document.getElementsByName("gra-time");
    for (var i = 0; i < radio_list.length; i++) {
        var someRadio = radio_list[i];
        if (someRadio.checked) {
            pageState.nowGraTime = someRadio.value;
            console.log(someRadio.value)
            break;
        }
    }
    renderChart();
    // 确定是否选项发生了变化

    // 设置对应数据

    // 调用图表渲染函数
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {

    // 确定是否选项发生了变化

    // 设置对应数据

    // 调用图表渲染函数

    //console.log("change");
    var select = document.getElementById("city-select")
    var index = select.selectedIndex; //序号，取当前选中选项的序号
    var val = select.options[index].value;
    //console.log(val);
    initAqiChartData(val, aqiSourceData[val]);
    console.log(val)
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var radio_list = document.getElementsByName("gra-time");
    for (var i = 0; i < radio_list.length; i++) {
        radio_list[i].onclick = graTimeChange;
        /*  var someRadio = radio_list[i];*/
        /*if (someRadio.checked) {
         someRadio.
         break;
         }*/
    }
    //console.log(radio_list)

}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    var select = document.getElementById("city-select")
    for (var item in aqiSourceData) {
        //添加一个选项
        //select.add(new Option(item, item));    //这个只能在IE中有效
        select.options.add(new Option(item, item)); //这个兼容IE与firefox
        //console.log(item)
    }
    select.onchange = citySelectChange
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项

    // 给select设置事件，当选项发生变化时调用函数citySelectChange

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData(name, value) {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    //console.log("pageState", pageState)
    chartData = value;
    pageState.nowSelectCity = name
    //console.log(pageState);
}

/**
 传入时间，返回是星期几

 **/
function week(date) {
    var a = new Array("7", "1", "2", "3", "4", "5", "6");
    var week = new Date(date).getDay();
    console.log();
    return a[week]
}
//日期加上天数得到新的日期
//dateTemp 需要参加计算的日期，days要添加的天数，返回新的日期，日期格式：YYYY-MM-DD
function getNewDay(dateTemp, days) {
    var dateTemp = dateTemp.split("-");
    var nDate = new Date(dateTemp[1] + '-' + dateTemp[2] + '-' + dateTemp[0]); //转换为MM-DD-YYYY格式
    var millSeconds = Math.abs(nDate) + (days * 24 * 60 * 60 * 1000);
    var rDate = new Date(millSeconds);
    var year = rDate.getFullYear();
    var month = rDate.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var date = rDate.getDate();
    if (date < 10) date = "0" + date;
    return (year + "-" + month + "-" + date);
}

/**
 * 复制一个对象
 * @param obj
 * @returns {*}
 */
function clone(obj) {
    if (obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
        return obj;

    if (obj instanceof Date)
        var temp = new obj.constructor(); //or new Date(obj);
    else
        var temp = obj.constructor();

    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj['isActiveClone'] = null;
            temp[key] = clone(obj[key]);
            delete obj['isActiveClone'];
        }
    }

    return temp;
}


/**
 * 初始化函数
 */
function init() {
    initGraTimeForm()
    initCitySelector();
    renderChart()
    //initAqiChartData();
}

init();


//console.log(week("2016-01-01"))






