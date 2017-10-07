'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getTimeValue = exports.getValueByType = exports.getIndexByValue = exports.getTimePoint = exports.getForm = exports.getArrayByMinmax = exports.getCurrentMonthLastDay = exports.getTypeByKey = exports.SplitDate = exports.formatDate = undefined;
exports.resetMin = resetMin;
exports.resetMax = resetMax;
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
//重置min
function resetMin(_ref) {
    var type = _ref.type,
        minDate = _ref.minDate,
        firstType = _ref.firstType,
        firstValue = _ref.firstValue;

    var result = '';
    var isMin = minDate[firstType] == firstValue;
    switch (type) {
        case 'hour':
            result = isMin ? minDate.hour : 0;
            break;
        case 'minute':
            result = isMin ? minDate.minute : 0;
            break;
        case 'second':
            result = isMin ? minDate.second : 0;
            break;
        case 'month':
            result = isMin ? minDate.month : 1;
            break;
        case 'date':
            result = isMin ? minDate.date : 1;
            break;
        default:
            result = '';
            break;
    }
    return result;
}
//重置max
function resetMax(_ref2) {
    var type = _ref2.type,
        maxDate = _ref2.maxDate,
        firstType = _ref2.firstType,
        firstValue = _ref2.firstValue,
        dateMax = _ref2.dateMax;

    var result = '';
    var isMax = maxDate[firstType] == firstValue;
    switch (type) {
        case 'hour':
            result = isMax ? maxDate.hour : 23;
            break;
        case 'minute':
            result = isMax ? maxDate.minute : 59;
            break;
        case 'second':
            result = isMax ? maxDate.second : 59;
            break;
        case 'month':
            result = isMax ? maxDate.month : 12;
            break;
        case 'date':
            result = isMax ? maxDate.date : dateMax;
            break;
        default:
            result = '';
            break;
    }
    return result;
}
//根据type生成对应的min
function getMin(_ref3) {
    var type = _ref3.type,
        curTime = _ref3.curTime,
        yearRange = _ref3.yearRange,
        date = _ref3.date;

    type = getTypeByKey(type);
    var result = '';
    switch (type) {
        case 'hour':
            result = date ? date.hour : 0;
            break;
        case 'minute':
            result = date ? date.minute : 0;
            break;
        case 'second':
            result = date ? date.second : 0;
            break;
        case 'month':
            result = date ? date.month : 1;
            break;
        case 'date':
            result = date ? date.date : 1;
            break;
        case 'year':
            result = date ? date.year : curTime.year - yearRange;
            break;
        default:
            result = '';
            break;
    }
    return result;
}
//根据type生成对应的max
function getMax(_ref4) {
    var type = _ref4.type,
        curTime = _ref4.curTime,
        yearRange = _ref4.yearRange,
        date = _ref4.date;

    type = getTypeByKey(type);
    var result = '';
    switch (type) {
        case 'hour':
            result = date ? date.hour : 23;
            break;
        case 'minute':
            result = date ? date.minute : 59;
            break;
        case 'second':
            result = date ? date.second : 59;
            break;
        case 'month':
            result = date ? date.month : 12;
            break;
        case 'date':
            result = date ? date.date : getCurrentMonthLastDay(curTime.year, curTime.month);
            break;
        case 'year':
            result = date ? date.year : curTime.year + yearRange;
            break;
        default:
            result = '';
            break;
    }
    return result;
}
//根据min和max生成对应的数组
var getArrayByMinmax = exports.getArrayByMinmax = function getArrayByMinmax(_ref5) {
    var min = _ref5.min,
        max = _ref5.max,
        step = _ref5.step;

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
var getTimePoint = exports.getTimePoint = function getTimePoint(_ref6) {
    var times = _ref6.times,
        minuteStep = _ref6.minuteStep,
        yearRange = _ref6.yearRange,
        formats = _ref6.formats,
        curTime = _ref6.curTime,
        minDate = _ref6.minDate,
        maxDate = _ref6.maxDate;

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
                min: getMin({ type: formArr[j], curTime: curTime, yearRange: yearRange, date: minDate }),
                max: getMax({ type: formArr[j], curTime: curTime, yearRange: yearRange, date: maxDate }),
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