# react-mobile-timepicker

> 移动端react的选择时间组件.

### version 1.0.0
### Used

```
npm install react-mobile-timepicker
import 'react-mobile-timepicker/assets/index.css';
import DateView from 'react-mobile-timepicker';
```
### DateView Properties

**props**

Name                | Type         | Default                            | Description
--------------------|--------------|------------------------------------|-------------------
[title]             | `string`     | 选择日期   | 标题
[format]            | `string`     |           | 格式，YYYY:年，MM:月,会自动补齐,9会输出09,后面同理,DD:日,hh:时,mm:分,ss:秒
[options]           | `object`     |           | iscroll的配置项
[minuteStep]        | `number`     |    1      | 分钟的间隔
[yearRange]         | `number`     |    10     | 年份前后的延伸
[show]              | `boolean`    |    false  | 是否初始化显示选择控件
[value]             | `number,array,number`   |          | 选中的值
[currentTime]       | `number,string` |`Date.now()` | 当前时间
[minDate]           | `number,string` |       | 最小时间
[maxDate]           | `number,string` |       | 最大时间
[onDone]            | `function`      |       | 选择时间后的调用，传入当前用户选择的时间，若返回false则会阻止选择器界面隐藏

## 预览
[点击查看demo](https://caoren.github.io/react-mobile-datepicker/demo/)

## License
Copyright (c) 2017 [Cao Ren](https://github.com/caoren) under the MIT License.
