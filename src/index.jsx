import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';
import {getForm, getTimePoint, getCurrentMonthLastDay, formatDate, getValueByType, getTimeValue, resetMin, resetMax} from './util';
import List from './list';
const ENTERTIME = 300;
class TimePicker extends Component{
    constructor(props){
        super(props);
        let {show, minuteStep, yearRange, value, currentTime, format, minDate, maxDate} = props;
        let formats = this.formats = getForm(format);
        let curTime = currentTime || Date.now();
        let curFormatTime = this.curFormatTime = formatDate(curTime);
        let times = value || [curTime];
        times = times instanceof Array ? times : [times];
        let timeobj = {times, formats, minuteStep, yearRange, curTime : curFormatTime};
        if(minDate){
            this.minDate = formatDate(minDate);
            timeobj.minDate = this.minDate;
        }
        if(maxDate){
            this.maxDate = formatDate(maxDate);
            timeobj.maxDate = this.maxDate;
        }
        let timearr = getTimePoint(timeobj);

        this.close = this.close.bind(this);
        this.show = this.show.bind(this);
        this.save = this.save.bind(this);
        this.accept = this.accept.bind(this);
        this.state = {
            show : typeof show != 'undefined' ? show : false,
            times : timearr
        }
    }
    accept({value, scope, index, type}){
        let curFormatTime = this.curFormatTime;
        let {times} = this.state;
        times[scope][index].value = value;

        let dIndex = getValueByType(times[scope], 'date').index;
        /*
            选择的是年和月，需要处理日的最大值，如2月份可能是28或29，没有30和31
            且用户有配置天的选项
        */
        if(dIndex > -1 && (type == 'month' || type == 'year')){
            let year = getValueByType(times[scope], 'year').value || curFormatTime.year;
            let month = getValueByType(times[scope], 'month').value || curFormatTime.month;
            let max = getCurrentMonthLastDay(year, month);
            times[scope][dIndex].max = max;
            if(times[scope][dIndex].value > max){
                times[scope][dIndex].value = max;
            }
        }
        /*
            如果设置了minDate和maxDate，则需要处理边界日期
            先获取times数组中第一个type是什么，年或月，时或分
            如果数组长度小于2，不需要处理
        */
        let minDate = this.minDate;
        let maxDate = this.maxDate;
        let frarr = times[scope];
        if(minDate){
            if(frarr.length > 1){
                let firstType = frarr[0].type;
                let mIndex = getValueByType(frarr, type).index;
                let firstValue = type == firstType ? value : getValueByType(times[scope], firstType).value;
                for(let i=mIndex,len=frarr.length;i<len;i++){
                    if(frarr[i].type != firstType){
                        let minvl = resetMin({type : frarr[i].type, minDate, firstType, firstValue});
                        frarr[i].min = minvl;
                        if(frarr[i].value < minvl){
                            frarr[i].value = minvl;
                        }
                    }
                }
            }
        }
        if(maxDate){
            if(frarr.length > 1){
                let ayear = getValueByType(times[scope], 'year').value || curFormatTime.year;
                let amonth = getValueByType(times[scope], 'month').value || curFormatTime.month;
                let dateMax = getCurrentMonthLastDay(ayear, amonth);

                let firstType = frarr[0].type;
                let mIndex = getValueByType(frarr, type).index;
                let firstValue = type == firstType ? value : getValueByType(times[scope], firstType).value;
                for(let i=mIndex,len=frarr.length;i<len;i++){
                    if(frarr[i].type != firstType){
                        let maxvl = resetMax({type : frarr[i].type, maxDate, firstType, firstValue, dateMax});
                        frarr[i].max = maxvl;
                        if(frarr[i].value > maxvl){
                            frarr[i].value = maxvl;
                        }
                    }
                }
            }
        }
        //console.log(times);
        this.setState({
            times : times
        });
    }
    close(){
        this.setState({
            show : false
        });
    }
    show(){
        this.setState({
            show : true
        });
    }
    save(){
        let {onDone, format} = this.props;
        let {times} = this.state;
        let curFormatTime = this.curFormatTime;
        let result = [];
        for(let i=0,len=times.length;i<len;i++){
            result.push(getTimeValue(times[i], format, curFormatTime));
        }
        if(onDone){
            result = result.length == 1 ? result[0] : result;
            let immplement = onDone(result);
            immplement = typeof immplement != 'undefined' ? immplement : true;
            if(immplement){
                this.close();
            }
        }
        else{
            this.close();
        }
    }
    render(){
        let self = this;
        let {options, title} = self.props;
        let {times, show} = self.state;
        let SelectNode;
        let timeNode = times.map(function(citem,n){
            return citem.map(function(item,index){
                return (<List onSelect={self.accept} key={n +'_' + index} scope={n} index={index} options={options} {...item} />)
            })
        });
        SelectNode = (
            <div className="c-timeselect">
                <div className="c-timeopa">
                    <div className="c-timebton" onClick={self.close}>取消</div>
                    <div className="c-timetitle">{title}</div>
                    <div className="c-timebton" onClick={self.save}>确定</div>
                </div>
                <div className="c-timecont">
                    {timeNode}
                </div>
            </div>
        );
        return (
            <div>
                <CSSTransition in={show} classNames="timemask" timeout={ENTERTIME} mountOnEnter={true} unmountOnExit={true}>
                    <div className="c-timemask" onClick={self.close}></div>
                </CSSTransition>
                <CSSTransition in={show} classNames="timecont" timeout={ENTERTIME} mountOnEnter={true} unmountOnExit={true}>
                    {SelectNode}
                </CSSTransition>
            </div>
        )
    }
}
TimePicker.proptypes = {
    title : PropTypes.string,
    format : PropTypes.string,
    value : PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),
    options : PropTypes.object,
    currentTime : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    minuteStep : PropTypes.number,
    yearRange : PropTypes.number,
    show : PropTypes.bool,
    minDate : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    maxDate : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onDone : PropTypes.func
}
TimePicker.defaultProps = {
    title : '选择日期',
    format : '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}',
    options : {
        disablePointer : true,
        disableTouch : false,
        disableMouse : true,
        startX : 0,
        startY : 0
    },
    minuteStep : 1,
    yearRange : 10,
    show : false
}
export default TimePicker;