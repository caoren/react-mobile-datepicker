'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getTimeValue = exports.getValueByType = exports.getIndexByValue = exports.getTimePoint = exports.getForm = exports.getArrayByMinmax = exports.getCurrentMonthLastDay = exports.getTypeByKey = exports.SplitDate = exports.formatDate = undefined;
exports.getMin = getMin;
exports.getMax = getMax;

var _constant = require('./constant');

function polishNum(num) {
    var tnum = '00' + num;
    tnum = tnum.slice(-2);
    return tnum;
}
//格式化时间
var formatDate = exports.formatDate = function formatDate(time) {
    time = typeof time !== 'number' ? parseInt(time, 10) : time;
    var cdate = time ? new Date(time) : new Date();
    return {
        year: cdate.getFullYear(),
        month: cdate.getMonth() + 1,
        date: cdate.getDate(),
        hour: cdate.getHours(),
        minute: cdate.getMinutes(),
        second: cdate.getSeconds()
    };
};
//拆分时间
var SplitDate = exports.SplitDate = function SplitDate(time) {
    var cDate = formatDate(time);
    var year = cDate.year;
    var month = cDate.month;
    var ndate = cDate.date;
    var hour = cDate.hour;
    var minute = cDate.minute;
    var second = cDate.second;
    //
    var dmonth = polishNum(month);
    var ddate = polishNum(ndate);
    var dhour = polishNum(hour);
    var dminute = polishNum(minute);
    var dsecond = polishNum(second);
    return {
        'YYYY': year,
        'YY': year.toString().slice(-2),
        'MM': dmonth,
        'M': month,
        'DD': ddate,
        'D': ndate,
        'hh': dhour,
        'h': hour,
        'mm': dminute,
        'm': minute,
        'ss': dsecond,
        's': second
    };
};
//映射year,month
var getTypeByKey = exports.getTypeByKey = function getTypeByKey(key) {
    var result = '';
    switch (key) {
        case 'YYYY':case 'YY':
            result = 'year';
            break;
        case 'MM':case 'M':
            result = 'month';
            break;
        case 'DD':case 'D':
            result = 'date';
            break;
        case 'hh':case 'h':
            result = 'hour';
            break;
        case 'mm':case 'm':
            result = 'minute';
            break;
        case 'ss':case 's':
            result = 'second';
            break;
        default:
            result = '';
            break;
    }
    return result;
};
//获取当月的最后一天,month本身已经增加了1
var getCurrentMonthLastDay = exports.getCurrentMonthLastDay = function getCurrentMonthLastDay(year, month) {
    var cdate = new Date(year, month, 1, 0, 0, 0);
    var lastDate = new Date(cdate.getTime() - _constant.ONEDAY);
    return lastDate.getDate();
};
//根据type生成对应的min
function getMin(type, curTime) {
    type = getTypeByKey(type);
    var result = '';
    switch (type) {
        case 'hour':
        case 'minute':
        case 'second':
            result = 0;
            break;
        case 'month':
            result = 1;
            break;
        case 'date':
            result = 1;
            break;
        case 'year':
            result = curTime.year - 10;
            break;
        default:
            result = '';
            break;
    }
    return result;
}
//根据type生成对应的max
function getMax(type, curTime) {
    type = getTypeByKey(type);
    var result = '';
    switch (type) {
        case 'hour':
            result = 23;
            break;
        case 'minute':
        case 'second':
            result = 59;
            break;
        case 'month':
            result = 12;
            break;
        case 'date':
            result = getCurrentMonthLastDay(curTime.year, curTime.month);
            break;
        case 'year':
            result = curTime.year + 10;
            break;
        default:
            result = '';
            break;
    }
    return result;
}
//根据min和max生成对应的数组
var getArrayByMinmax = exports.getArrayByMinmax = function getArrayByMinmax(_ref) {
    var min = _ref.min,
        max = _ref.max,
        step = _ref.step;

    var arr = _constant.EMPTY.concat();
    step = step || 1;
    for (var i = min; i <= max; i += step) {
        arr.push(i);
    }
    arr = arr.concat(_constant.EMPTY);
    return arr;
};
var FORMAT_REG = /\{\w+?\}/gi;
var FORMAT_GAP = /\}(.?)\{?/gi;
var GAPTYPE_REG = /[\u4e00-\u9fa5a-zA-Z]/gi;
//根据format解析时间格式,例如{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}
var getForm = exports.getForm = function getForm(format) {
    var formarr = format.match(FORMAT_REG);
    if (formarr != null) {
        formarr = formarr.map(function (item, n) {
            return item.slice(1, -1);
        });
    }
    var textarr = format.match(FORMAT_GAP);
    if (textarr != null) {
        textarr = textarr.map(function (item, n) {
            var tmp = item.slice(1, item.length);
            tmp = tmp.match(GAPTYPE_REG);
            return tmp != null ? tmp[0] : '';
        });
    }
    return {
        text: textarr,
        form: formarr
    };
};
//根据format格式输出对应的数组
var getTimePoint = exports.getTimePoint = function getTimePoint(_ref2) {
    var times = _ref2.times,
        minuteStep = _ref2.minuteStep,
        formats = _ref2.formats,
        curTime = _ref2.curTime;

    var arr = [];
    for (var i = 0, len = times.length; i < len; i++) {
        var temp = SplitDate(times[i]);
        var tarr = [];
        var formArr = formats.form;
        var textArr = formats.text;
        for (var j = 0, lenj = formArr.length; j < lenj; j++) {
            var ttype = getTypeByKey(formArr[j]);
            tarr.push({
                value: temp[formArr[j]],
                min: getMin(formArr[j], curTime),
                max: getMax(formArr[j], curTime),
                step: ttype == 'minute' ? minuteStep : 1,
                suffix: textArr[j] || '',
                type: ttype
            });
        }
        arr.push(tarr);
    }
    return arr;
};
//根据value找出数组中的位置
var getIndexByValue = exports.getIndexByValue = function getIndexByValue(list, value) {
    var curIndex = 3;
    for (var i = 0, len = list.length; i < len; i++) {
        if (list[i] == value) {
            curIndex = i;
            break;
        }
    }
    var startY = -(curIndex - 3) * _constant.ITEMHEIGHT;
    return {
        curIndex: curIndex,
        startY: startY
    };
};
//根据type找出数组中的值
var getValueByType = exports.getValueByType = function getValueByType(arr, type) {
    arr = arr || [];
    var value = void 0;
    var index = -1;
    for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i].type == type) {
            value = arr[i].value;
            index = i;
            break;
        }
    }
    return { value: value, index: index };
};
//计算text
function transDate(time, format) {
    if (!time || !format) {
        return '';
    }
    var dateobj = SplitDate(time);
    var farr = format.match(FORMAT_REG);
    if (!farr) {
        return format;
    }
    var nstr = format;
    for (var i = 0, len = farr.length; i < len; i++) {
        var tstr = farr[i].slice(1, -1);
        nstr = nstr.replace(farr[i], dateobj[tstr]);
    }
    return nstr;
}
//返回数据
var getTimeValue = exports.getTimeValue = function getTimeValue(arr, format, curtime) {
    var year = getValueByType(arr, 'year').value || curtime.year;
    var month = getValueByType(arr, 'month').value || curtime.month;
    var ndate = getValueByType(arr, 'date').value || curtime.date;
    var hour = getValueByType(arr, 'hour').value || 0;
    var minute = getValueByType(arr, 'minute').value || 0;
    var second = getValueByType(arr, 'second').value || 0;
    var cDate = new Date(year, month - 1, ndate, hour, minute, second);
    var value = cDate.getTime();
    return {
        text: transDate(value, format),
        value: value
    };
};