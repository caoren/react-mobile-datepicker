import {ONEDAY, EMPTY, ITEMHEIGHT} from './constant';
function polishNum(num){
    let tnum = '00' + num;
    tnum = tnum.slice(-2);
    return tnum;
}
//格式化时间
export const formatDate = (time) => {
    time = typeof time !== 'number' ? parseInt(time,10) : time; 
    let cdate = time ? new Date(time) : new Date();
    return {
        year : cdate.getFullYear(),
        month : cdate.getMonth() + 1,
        date : cdate.getDate(),
        hour : cdate.getHours(),
        minute : cdate.getMinutes(),
        second : cdate.getSeconds()
    }
}
//拆分时间
export const SplitDate = (time) => {
    let cDate = formatDate(time);
    let year = cDate.year;
    let month = cDate.month;
    let ndate = cDate.date;
    let hour = cDate.hour;
    let minute = cDate.minute;
    let second = cDate.second;
    //
    let dmonth = polishNum(month);
    let ddate = polishNum(ndate);
    let dhour = polishNum(hour);
    let dminute = polishNum(minute);
    let dsecond = polishNum(second);
    return{
        'YYYY' : year,
        'YY' : year.toString().slice(-2),
        'MM' : dmonth,
        'M' : month,
        'DD' : ddate,
        'D' : ndate,
        'hh' : dhour,
        'h' : hour,
        'mm' : dminute,
        'm' : minute,
        'ss' : dsecond,
        's' : second
    }
}
//映射year,month
export const getTypeByKey = (key) => {
    let result = '';
    switch(key){
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
}
//获取当月的最后一天,month本身已经增加了1
export const getCurrentMonthLastDay = (year, month) => {
    let cdate = new Date(year, month, 1, 0, 0, 0);
    let lastDate = new Date(cdate.getTime() - ONEDAY);
    return lastDate.getDate();
}
//根据type生成对应的min
export function getMin(type, curTime){
    type = getTypeByKey(type);
    let result = '';
    switch(type){
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
export function getMax(type, curTime){
    type = getTypeByKey(type);
    let result = '';
    switch(type){
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
export const getArrayByMinmax = ({min, max, step}) => {
    let arr = EMPTY.concat();
    step = step || 1;
    for(let i=min;i<=max;i+=step){
        arr.push(i);
    }
    arr = arr.concat(EMPTY);
    return arr;
}
const FORMAT_REG = /\{\w+?\}/gi;
const FORMAT_GAP = /\}(.?)\{?/gi;
const GAPTYPE_REG = /[\u4e00-\u9fa5a-zA-Z]/gi;
//根据format解析时间格式,例如{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}
export const getForm = (format) => {
    let formarr = format.match(FORMAT_REG);
    if(formarr != null){
        formarr = formarr.map(function(item, n){
            return item.slice(1, -1);
        });
    }
    let textarr = format.match(FORMAT_GAP);
    if(textarr != null){
        textarr = textarr.map(function(item, n){
            let tmp = item.slice(1, item.length);
            tmp = tmp.match(GAPTYPE_REG);
            return tmp != null ? tmp[0] : '';
        });
    }
    return {
        text : textarr,
        form : formarr
    }
}
//根据format格式输出对应的数组
export const getTimePoint = ({times, minuteStep, formats, curTime}) => {
    let arr = [];
    for(let i=0,len=times.length;i<len;i++){
        let temp = SplitDate(times[i]);
        let tarr = [];
        let formArr = formats.form;
        let textArr = formats.text;
        for(var j=0,lenj=formArr.length;j<lenj;j++){
            let ttype = getTypeByKey(formArr[j]);
            tarr.push({
                value : temp[formArr[j]],
                min : getMin(formArr[j], curTime),
                max : getMax(formArr[j], curTime),
                step : ttype == 'minute' ? minuteStep : 1,
                suffix : textArr[j] || '',
                type : ttype
            });
        }
        arr.push(tarr);
    }
    return arr;
}
//根据value找出数组中的位置
export const getIndexByValue = (list, value) => {
    let curIndex = 3;
    for(let i=0,len=list.length;i<len;i++){
        if(list[i] == value){
            curIndex = i;
            break;
        }
    }
    let startY = -(curIndex - 3) * ITEMHEIGHT;
    return{
        curIndex,
        startY
    }
}
//根据type找出数组中的值
export const getValueByType = (arr, type) => {
    arr = arr || [];
    let value;
    let index = -1;
    for(let i=0,len=arr.length;i<len;i++){
        if(arr[i].type == type){
            value = arr[i].value;
            index = i;
            break;
        }
    }
    return {value, index};
}
//计算text
function transDate(time, format){
    if(!time || !format){
        return '';
    }
    let dateobj = SplitDate(time)
    let farr = format.match(FORMAT_REG);
    if(!farr){
        return format;
    }
    let nstr = format;
    for(let i=0,len=farr.length;i<len;i++){
        let tstr = farr[i].slice(1,-1);
        nstr = nstr.replace(farr[i],dateobj[tstr]);
    }
    return nstr;
}
//返回数据
export const getTimeValue = (arr, format, curtime) => {
    let year = getValueByType(arr, 'year').value || curtime.year;
    let month = getValueByType(arr, 'month').value || curtime.month;
    let ndate = getValueByType(arr, 'date').value || curtime.date;
    let hour = getValueByType(arr, 'hour').value || 0;
    let minute = getValueByType(arr, 'minute').value || 0;
    let second = getValueByType(arr, 'second').value || 0;
    let cDate = new Date(year, month - 1, ndate, hour, minute, second);
    let value = cDate.getTime();
    return {
        text : transDate(value, format),
        value : value
    }
}

