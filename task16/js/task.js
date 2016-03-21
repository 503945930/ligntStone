/**
 * Created by little-wei on 2016/3/21.
 */

/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
*    "北京": 90,
*    "上海": 40
* };
 */
var aqiData = {};
var name;//城市名称
var value;//空气质量指数
/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    //获取值并去空格
    name = document.getElementById("aqi-city-input").value.trim();
    value = document.getElementById("aqi-value-input").value.trim();

    var r = /^[0-9]*[1-9][0-9]*$/　　 //正则表达示  正整数
    var re = /^[\u4e00-\u9fa5a-z]+$/gi;//正则表达示 只能输入汉字和英文字母

    if (re.test(name) == false) {
        alert("输入城市名称不合法，只能输入汉字和英文字母,请重新输入");
        document.getElementById("aqi-city-input").value = "";
        document.getElementById("aqi-city-input").focus();
        return;
    }
    if (r.test(value) == false) {
        alert("输入城市名称不合法，请重新输入正整数");
        document.getElementById("aqi-value-input").value = "";
        document.getElementById("aqi-value-input").focus();
        return;
    }


    aqiData[name] = value
    renderAqiList();
    // console.log(aqiData)

}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var tb = document.getElementById("aqi-table");

    /*for(var i=0;i<aqiData.length;i++){

     }*/
    var newTr = tb.insertRow();
    //添加列
    var newTd0 = newTr.insertCell();
    var newTd1 = newTr.insertCell();
    var newTd2 = newTr.insertCell();
    newTd0.innerHTML = name;
    newTd1.innerHTML = value;
    newTd2.innerHTML = '<button onclick="delBtnHandle(this,\''+name+'\')">删除</button>';
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();

}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(o,name) {
    //console.log(o)
// do sth.
    //删除行
    var t = document.getElementById("aqi-table");
    t.deleteRow(o.parentNode.parentNode.rowIndex)

    //删除对应的数据
    delete aqiData[name];

}

function init() {
    document.getElementById("add-btn").onclick = function () {
        addBtnHandle();
    }
    // renderAqiList();

// 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数

// 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数

}

init();
