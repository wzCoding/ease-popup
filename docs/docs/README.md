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
```js
import EasePopup from 'ease-popup'
//或者
const EasePopup = require('ease-popup')
```

### 创建实例
弹窗插件通过 `EasePopup` 类来创建实例。
```js
const instance = new EasePopup(
    target, // 弹窗触发元素
    popup, // 弹窗元素
    options // options 配置
)
```
创建弹窗实例后，可以通过弹窗实例中提供的方法来控制弹窗：

- `instance.show()`  显示弹窗
- `instance.showModal()`  显示弹窗并显示 layer 层
- `instance.hide()`  隐藏弹窗（隐藏 layer 层）
- `instance.destroy()`  销毁弹窗实例

#### 示例
```html
<button class='popup-btn'>打开弹窗</button>
<dialog class='ease-popup'>
  <p class='ease-popup-content'>这是一个弹窗</p>
</dialog>
```
```js
const target = document.getElementByClassName('popup-btn')[0]
const popup = document.getElementByClassName('ease-popup')[0]
const instance = new EasePopup(
    target,  // 弹窗触发元素
    popup, // 弹窗元素
    {
        direction:'left'  // options 配置
    }
)

target.addEventListener('click', () => {
    instance.popup.open ? instance.hide() : instance.show()
})
```
<example direction='right'></example>


### 参数说明
上面的示例代码简单演示了弹窗插件的用法，在使用 `EasePopup` 类创建实例时，需要传入三个参数：
- `target`：（**必需**）弹窗触发元素，可以是页面上的 `dom` 元素，也可以是一个有效的选择器。
  
- `popup`：（可选）弹窗元素，可以是页面上的 `dom` 元素，比如 `<dialog>`、`<div>` 等，也可以是一个有效的选择。如果不传递此参数，插件会自动创建一个 `<dialog>` 元素到页面上。
  
- `options`：（可选）弹窗配置项，可以配置弹窗的显示位置、宽度等。如果不传递此参数，插件会使用默认的 `options` 配置。

以上介绍是弹窗插件的基本用法，如果想要更加灵活的控制弹窗插件，需要配合 `options` 选项一起使用。

# options 配置
使用 `options` 选项可以更加灵活的控制弹窗插件，比如：将弹窗设置在目标元素上方作为 tooltip 提示使用，或者将弹窗设置在目标元素内部作为 message 消息使用。

下面开始介绍 `options` 配置项：

### direction
* 类型：`String`
  
* 默认值：`'bottom'`

* 说明：设置弹窗的显示位置，按照以下规则取值：
    
    * 当 `placement` 选项的值为 **outside** 时，可取值有：`'top'`、`'top-start'`、`'top-end'`、`'bottom'`、`'bottom-start'`、`'bottom-end'`、`'left'`、`'left-start'`、`'left-end'`、`'right'`、`'right-start'`、`'right-end'`。
  
    *  当 `placement` 选项的值为 **inside** 时，可取值有：`'left'`、`'left-start'`、`'left-end'`、`'right'`、`'right-start'`、`'right-end'`、`'center'`、`'center-start'`、`'center-end'`。


<e-select></e-select>

[floating-ui]:https://floating-ui.com/