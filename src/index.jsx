import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {getForm, getTimePoint, getCurrentMonthLastDay, formatDate, getValueByType, getTimeValue} from './util';
import List from './list';

class TimePicker extends Component{
    constructor(props){
        super(props);
        let {show, minuteStep, value, currentTime, format} = props;
        let formats = this.formats = getForm(format);
        let curTime = currentTime || Date.now();
        let curFormatTime = this.curFormatTime = formatDate(curTime);

        let times = value || [curTime];
        times = times instanceof Array ? times : [times];
        let timearr = getTimePoint({times, formats, minuteStep, curTime : curFormatTime});

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
        let MaskNode;
        if(show){
            MaskNode = (
                <div className="c-timemask" onClick={self.close}></div>
            );
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
        }
        return (
            <div>
                <ReactCSSTransitionGroup component="div" transitionName="timemask" transitionEnterTimeout={300}  transitionLeaveTimeout={300}>
                    {MaskNode}
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup component="div" transitionName="timecont" transitionEnterTimeout={300}  transitionLeaveTimeout={300}>
                    {SelectNode}
                </ReactCSSTransitionGroup>
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
    show : PropTypes.bool
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
    show : false
}
export default TimePicker;