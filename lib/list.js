'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _iscrollLite = require('iscroll/build/iscroll-lite');

var _iscrollLite2 = _interopRequireDefault(_iscrollLite);

var _reactIscroll = require('react-iscroll');

var _reactIscroll2 = _interopRequireDefault(_reactIscroll);

var _util = require('./util');

var _constant = require('./constant');

var _item = require('./item');

var _item2 = _interopRequireDefault(_item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var List = function (_React$Component) {
    (0, _inherits3.default)(List, _React$Component);

    function List(props) {
        (0, _classCallCheck3.default)(this, List);

        var _this = (0, _possibleConstructorReturn3.default)(this, (List.__proto__ || (0, _getPrototypeOf2.default)(List)).call(this, props));

        var min = props.min,
            max = props.max,
            step = props.step,
            options = props.options,
            value = props.value,
            type = props.type;

        var list = (0, _util.getArrayByMinmax)({ min: min, max: max, step: step });

        var _getIndexByValue = (0, _util.getIndexByValue)(list, value),
            startY = _getIndexByValue.startY,
            curIndex = _getIndexByValue.curIndex;

        var coptions = (0, _extends3.default)({}, options);
        coptions.startY = startY;
        _this.options = coptions;
        _this.curIndex = curIndex;
        _this.state = {
            list: list
        };
        _this.scrollEnd = _this.scrollEnd.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(List, [{
        key: 'scrollEnd',
        value: function scrollEnd(iScrollInstance) {
            var _props = this.props,
                onSelect = _props.onSelect,
                scope = _props.scope,
                index = _props.index,
                type = _props.type;

            var y = iScrollInstance.y;
            var spare = y % _constant.ITEMHEIGHT;
            var scrollY = y;
            if (spare != 0) {
                scrollY = Math.abs(spare) > _constant.HALFITEMHEIGHT ? y - spare - _constant.ITEMHEIGHT : y - spare;
                iScrollInstance.scrollTo(0, scrollY, 100);
            }
            var cur = Math.abs(Math.round(scrollY / _constant.ITEMHEIGHT)) + 3;
            var value = this.state.list[cur];
            onSelect && onSelect({ value: value, scope: scope, index: index, type: type });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var min = nextProps.min,
                max = nextProps.max,
                step = nextProps.step,
                options = nextProps.options,
                value = nextProps.value,
                type = nextProps.type;

            var list = (0, _util.getArrayByMinmax)({ min: min, max: max, step: step });
            if (list.length != this.state.list.length) {
                this.setState({
                    list: list
                });
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            var value = this.props.value;
            var list = this.state.list;

            var _getIndexByValue2 = (0, _util.getIndexByValue)(list, value),
                startY = _getIndexByValue2.startY;

            this.refs.iscroll.withIScroll(true, function (iScroll) {
                if (iScroll.y != startY) {
                    iScroll.scrollTo(0, startY);
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                options = _props2.options,
                index = _props2.index,
                value = _props2.value,
                suffix = _props2.suffix;
            var list = this.state.list;

            var coptions = this.options;
            var curIndex = this.curIndex;
            return _react2.default.createElement(
                _reactIscroll2.default,
                { ref: 'iscroll', className: 'c-timewrap', iScroll: _iscrollLite2.default, options: coptions, onScrollEnd: this.scrollEnd },
                _react2.default.createElement(_item2.default, { suffix: suffix, list: list, cur: curIndex, index: index }),
                _react2.default.createElement('div', { className: 'c-time-shade' }),
                _react2.default.createElement('div', { className: 'c-time-indicator' })
            );
        }
    }]);
    return List;
}(_react2.default.Component);

exports.default = List;