# ease-popup
一个简单、方便、有用的 JavaScript 弹窗插件，基于 `floating-ui` 制作

## 介绍
1. 这是一个简单、方便、好用的 js 弹窗插件，可以作为 tooltip 提示框、dialog 对话框等使用，也可以在此基础上自由封装改造。
2. 本弹窗插件基于 [floating-ui] 制作，弹窗可选位置齐全，功能相对完善，配置简单。
3. 弹窗使用 html5 `dialog` 元素生成，也支持使用 `div` 元素，兼容性较好。
4. 弹窗只提供基础样式，不用引入额外的 CSS 文件，想要其他样式可以自行定义编写。
   
## 安装
推荐使用 npm包 的方式进行安装
```
npm install ease-popup
```
或者也可以使用 `<script>` 标签引入

```
<script src="https://cdn.jsdelivr.net/gh/wzCoding/ease-popup@v1.2.0/dist/EasePopup.min.js"></script>
```

## 使用
```
import EasePopup from 'ease-popup'

// 或者

const EasePopup = require('ease-popup')
```

## 示例
以下是插件的简单使用方式

HTML 部分
// 弹窗容器也可以换成 `<dialog>` 元素
```html

<button id="popupBtn">点我</button>
<div class="ease-popup"> 
    <div class="ease-popup-content">这是一个弹窗</div>
</div>

```
JavaScript 部分
```js

const btn = document.getElementById('popupBtn')
const popup = document.querySelector('.ease-popup')


const instance = new EasePopup({
    "target":btn,
    "popup":popup,
    "direction":"top",
})

instance.update() // 更新弹窗配置
instance.show() // 显示弹窗
instance.showModal() // 显示弹窗并显示layer层
instance.hide() // 隐藏弹窗（隐藏layer层）
instance.destroy() // 销毁弹窗

```
## options选项参数

| 参数名         | 类型           | 默认值    | 说明                                                                                                           |
| -------------- | -------------- | --------- | -------------------------------------------------------------------------------------------------------------- |
| target         | Element String | null      | 弹窗触发元素                                                                                                   |
| popup          | Element String | null      | 弹窗元素                                                                                                       |
| direction      | String         | 'bottom'  | 弹窗popup显示的方向，根据placement参数的不同而变化                                                             |
| placement      | String         | 'outside' | 弹窗popup的放置部位（位于目标元素的外部或者内部）                                                              |
| width          | Number String  | 'auto'    | 弹窗宽度                                                                                                       |
| content        | String         | ' '       | 弹窗popup中要显示的内容                                                                                        |
| container      | String Object  | 'body'    | 弹窗触发元素target所在的容器，确定容器可以防止popup溢出边界                                                    |
| theme          | String Object  | 'light'   | 弹窗popup的主题（设置文字与背景色，默认提供 'light' 与 'dark' 两种主题，也可以传入{background:'',color:''}对象 |
| targetGap      | Number         | 15        | 弹窗popup与目标元素（触发元素）的间距                                                                          |
| boundryGap     | Number         | 5         | 弹窗popup与容器边缘的间距                                                                                      |
| offset         | Array          | [0,0]     | 弹窗popup相对所在位置的偏移量 [x,y]                                                                            |
| needArrow      | Boolean        | true      | 弹窗popup是否需要小箭头                                                                                        |
| selfClick      | Boolean        | true      | 弹窗popup自身是否可以点击                                                                                      |
| closeByOutSide | Boolean        | true      | 是否在点击弹窗popup以外的区域时关闭popup                                                                       |
| singleOpen     | Boolean        | true      | 是否同时只打开一个弹窗popup                                                                                    |
| fullScreen     | Boolean        | false     | layer层是否全屏                                                                                                |
| onShow          | Function        | null      | 弹窗popup显示时的回调函数                                                                                    |
| onHide          | Function        | null      | 弹窗popup隐藏时的回调函数                                                                                    |
| onDestroy      | Function        | null      | 弹窗popup销毁时的回调函数                                                                                    |

插件只提供了基础的弹窗展示、隐藏、销毁功能，弹窗的触发方式、弹窗内部结构等可由使用者自行定义，更多的使用方法请参考[docs文档]

[floating-ui]:https://floating-ui.com/
[docs文档]: