# 介绍
这是一个简单、方便、有用的 JavaScript 弹窗插件，插件基于 [floating-ui] 制作，在 floating-ui 提供的函数的基础上进行了改造封装，进一步开发了功能相对完善的弹窗插件。

:::tip

- 弹窗元素使用 html5 `dialog` 元素生成，也支持使用 `div` 元素，兼容性较好。
- 弹窗只提供基础功能与基础样式，无需引入额外的 CSS 文件，想要其他样式可以自行定义编写。

:::


# 安装
插件支持两种安装方式：**npm** 包安装和 **cdn** 引入。
### npm 
推荐使用 npm包 的方式进行安装

<CodeGroup copy=true>

  <CodeGroupItem title="npm" active>

```bash:no-line-numbers
npm install ease-popup
```

  </CodeGroupItem>

  <CodeGroupItem title="yarn">

```bash:no-line-numbers
yarn install ease-popup
```

  </CodeGroupItem>

  <CodeGroupItem title="pnpm" >

```bash:no-line-numbers
pnpm install ease-popup
```

  </CodeGroupItem>


</CodeGroup>

### cdn 
或者也可以使用 `<script>` 标签引入 cdn 链接

```bash:no-line-numbers copy
<script src="https://cdn.jsdelivr.net/gh/wzCoding/ease-popup@v1.0.1/dist/EasePopup.min.js"></script>
```

# 使用

当插件被引入到项目中后，就可以在项目中使用 `EasePopup` 类来创建弹窗了。

### 创建实例
```js
import EasePopup from 'ease-popup'
//或者
const EasePopup = require('ease-popup')
```

```js
const options = {......}
const instance = new EasePopup(options)
```
创建弹窗实例后，可以通过弹窗实例中提供的方法来控制弹窗：
- `instance.update()`  更新弹窗配置选项
- `instance.show()`  显示弹窗
- `instance.showModal()`  显示弹窗并显示 layer 层
- `instance.hide()`  隐藏弹窗（隐藏 layer 层）
- `instance.destroy()`  销毁弹窗实例

### 示例演示
<example></example>
  
以上介绍是弹窗插件的基本用法，如果想要更加灵活的控制弹窗插件，需要配合 `options` 选项一起使用。

# 配置选项
使用 `options` 配置选项可以更加灵活的控制弹窗插件，比如：将弹窗设置在目标元素上方作为 tooltip 提示使用，或者将弹窗设置在目标元素内部作为 message 消息使用。

下面开始介绍 `options` 配置项：

### target
* 类型：`String | Object`
  
* 默认值：`null`
  
* 说明：设置弹窗的触发元素，可以是页面上的 `dom` 元素，也可以是一个有效的选择器。
  
### popup
* 类型：`String | Object`
  
* 默认值：`null`
  
* 说明：设置弹窗元素，可以是页面上的 `dom` 元素，比如 `<dialog>`、`<div>` 等，也可以是一个有效的选择器。

### container
* 类型：`String | Object`
  
* 默认值：`document.body`

* 说明：设置弹窗的容器元素，，可以是页面上的 `dom` 元素，也可以是一个有效的选择器，按照以下规则取值：
  
    * 当 `placement` 选项的值为 **outside** 时，设置 `container` 属性可以限制弹窗边界，防止弹窗溢出容器之外，默认值是 `body`。
      
    * 当 `placement` 选项的值为 **inside** 时，这个选项是可选的，此时会将 `target` 视作 `container`。



### direction
* 类型：`String`
  
* 默认值：`'bottom'`

* 说明：设置弹窗的显示位置，按照以下规则取值：
    
    * 当 `placement` 选项的值为 **outside** 时，可取值有：`'top'`、`'top-start'`、`'top-end'`、`'bottom'`、`'bottom-start'`、`'bottom-end'`、`'left'`、`'left-start'`、`'left-end'`、`'right'`、`'right-start'`、`'right-end'`。
  
    *  当 `placement` 选项的值为 **inside** 时，可取值有：`'left'`、`'left-start'`、`'left-end'`、`'right'`、`'right-start'`、`'right-end'`、`'center'`、`'center-start'`、`'center-end'`。

### placement
* 类型：`String`

* 默认值：`'outside'`

* 说明：设置弹窗在目标元素的内部或外部，按照以下规则取值：
   
    * 当想要将弹窗的位置显示在触发元素（目标元素）外部时，可以将此选项的值设置为 **outside**。
   
    * 当想要将弹窗的位置显示在触发元素（容器元素）内部时，可以将此选项的值设置为 **inside**。

### width
* 类型：`Number | String`

* 默认值：`'auto'`

* 说明：设置弹窗的宽度。

### content
* 类型：`String`

* 默认值：`' '`

* 说明：设置弹窗的内容，可以是 `String` 类型的文本，也可以是一段安全的 `html` 字符内容，这个选项当在页面上没有作为 `popup` 的元素存在，由插件自动创建 `popup` 时会很有用。

### theme
* 类型：`String | Object`

* 默认值：`'light'`

* 说明：设置弹窗的主题，插件默认提供了 **light** 与 **dark** 两种主题，也可以传入自定义的主题颜色配置，格式为：`{ background:'xxx', color:'xxx' }`

### targetGap

* 类型：`Number`

* 默认值：`15(px)`

* 说明：设置弹窗与目标元素之间的间距，当 `placement` 选项的值为 **outside** 时会很有用。

### boundryGap
* 类型：`Number`

* 默认值：`5(px)`

* 说明：设置弹窗在要溢出容器边界时的安全间距。

### offset
* 类型：`Array`

* 默认值：`[0, 0]`

* 说明：设置弹窗在目标元素上的偏移量，取值方式为：`[x,y]`，`x` 代表水平位置的偏移量，`y` 代表垂直位置的偏移量。

### needArrow
* 类型：`Boolean`

* 默认值：`true`

* 说明：设置弹窗是否需要箭头，当 `placement` 选项的值为 **inside** 时，此选项的值会变成 `false`。

### selfClick
* 类型：`Boolean`

* 默认值：`true`

* 说明：设置弹窗是否可以点击自身，当此选项被设置为 `false` 时，点击弹窗自身弹窗将会关闭。

### closeByOutSide
* 类型：`Boolean`

* 默认值：`true`

* 说明：设置弹窗是否在点击自身以外的区域时关闭，当此选项被设置为 `false` 时，点击外部区域不会关闭弹窗。

### singleOpen
* 类型：`Boolean`

* 默认值：`true`

* 说明：设置弹窗是否只能同时打开一个，当此选项被设置为 `false` 时，可以同时打开多个弹窗。

### fullScreen
* 类型：`Boolean`

* 默认值：`false`

* 说明：设置弹窗的 `layer` 层是否全屏显示，当此选项被设置为 `true` 时，`layer` 层将会占满整个屏幕，此选项在 调用 `showModal` 方法时会很有用。

### onShow
* 类型：`Function`

* 默认值：`null`

* 说明：弹窗显示时的回调函数，此回调函数会在弹窗显示后执行。

### onHide
* 类型：`Function`

* 默认值：`null`

* 说明：弹窗隐藏时的回调函数，此回调函数会在弹窗隐藏后执行。

### onDestroy
* 类型：`Function`

* 默认值：`null`

* 说明：弹窗销毁时的回调函数，此回调函数会在弹窗销毁后执行。





[floating-ui]:https://floating-ui.com/