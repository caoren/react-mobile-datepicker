import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "../assets/index.less";
import DateView from '../src/index.jsx';

class Test extends Component{
    constructor(props){
        super(props);
        this.state = {
            text : ''
        }
        this.show = this.show.bind(this);
        this.save = this.save.bind(this);
    }
    save(result){
        let text = result.text;
        this.setState({
            text
        });
    }
    show(){
        this.date.show();
    }
    render(){
        let {text} = this.state;
        return(
            <div>
                <div>
                    <span onClick={this.show}>选择日期</span>
                </div>
                <p>
                    {text}
                </p>
                <DateView onDone={this.save} format="{YYYY}年{MM}月{DD}日 {hh}时{mm}分{ss}秒" ref={(ref) => {this.date = ref}} yearRange={3}></DateView>
            </div>
        )
    }
}

ReactDOM.render(
    <Test />,
    document.getElementById('J_wrap')
);