'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ScrollItem(_ref) {
    var list = _ref.list,
        suffix = _ref.suffix;

    return _react2.default.createElement(
        'ul',
        { className: 'c-time-ul' },
        list.map(function (item, n) {
            return _react2.default.createElement(
                'li',
                { className: 'c-time-li', key: 'scroll_' + n },
                item,
                item || item === 0 ? suffix : ''
            );
        })
    );
}
exports.default = ScrollItem;