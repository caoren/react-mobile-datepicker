import React, {Component} from 'react';
import PropTypes from 'prop-types';
import iScroll from 'iscroll/build/iscroll-lite';
import ReactIScroll from 'react-iscroll';
import {getArrayByMinmax, getIndexByValue} from './util';
import {ITEMHEIGHT, HALFITEMHEIGHT} from './constant';
import ScrollItem from './item';

class List extends React.Component{
    constructor(props){
        super(props);
        let {min, max, step, options, value, type} = props;
        let list = getArrayByMinmax({min, max, step});
        let {startY, curIndex} = getIndexByValue(list, value);
        let coptions = {
            ...options
        };
        coptions.startY = startY;
        this.options = coptions;
        this.curIndex = curIndex;
        this.state = {
            list
        };
        this.scrollEnd = this.scrollEnd.bind(this);
    }
    scrollEnd(iScrollInstance){
        let {onSelect, scope, index, type} = this.props;
        let y = iScrollInstance.y;
        let spare = y % ITEMHEIGHT;
        let scrollY = y;
        if(spare != 0){
            scrollY = Math.abs(spare) > HALFITEMHEIGHT ? (y - spare - ITEMHEIGHT) : (y - spare);
            iScrollInstance.scrollTo(0,scrollY,100);
        }
        let cur = Math.abs(Math.round(scrollY/ITEMHEIGHT)) + 3;
        let value = this.state.list[cur];
        onSelect && onSelect({value, scope, index, type});
    }
    componentWillReceiveProps(nextProps){
        let {min, max, step, options, value, type} = nextProps;
        let list = getArrayByMinmax({min, max, step});
        if(list.length != this.state.list.length){
            this.setState({
                list
            });
        }
    }
    componentDidUpdate(){
        let {value} = this.props;
        let {list} = this.state;
        let {startY} = getIndexByValue(list, value);
        this.refs.iscroll.withIScroll(true,function(iScroll){
            if(iScroll.y != startY){
                iScroll.scrollTo(0,startY);
            }
        });
    }
    render(){
        let {options, index, value, suffix} = this.props;
        let {list} = this.state;
        let coptions = this.options;
        let curIndex = this.curIndex;
        return (
            <ReactIScroll ref="iscroll" className="c-timewrap" iScroll={iScroll} options={coptions} onScrollEnd={this.scrollEnd}>
                <ScrollItem suffix={suffix} list={list} cur={curIndex} index={index} />
                <div className="c-time-shade"></div>
                <div className="c-time-indicator"></div>
            </ReactIScroll>
        )
    }
}
export default List;