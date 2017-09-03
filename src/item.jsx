import React, {Component} from 'react';
import PropTypes from 'prop-types';

function ScrollItem({list, suffix}){
    return (
        <ul className="c-time-ul">
            {
                list.map(function(item, n){
                    return (<li className="c-time-li" key={'scroll_' + n}>{item}{(item || item === 0)? suffix : ''}</li>);
                })
            }
        </ul>
    )
}
export default ScrollItem;