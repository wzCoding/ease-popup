/**
 * popupOption对象，用于配置popup组件的选项。
 * @property {(object|string)} target -触发popup弹窗的元素，或者弹窗容器元素，默认值为 null，可取值为一个选择器字符串或者一个dom元素。
 * @property {(object|string)} popup -弹窗元素，默认值为 null ，可取值为一个选择器字符串或者一个dom元素。
 * @property {string} direction - popup显示的方向，默认值为 'bottom'，可取值为：'top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end','left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'。
 * @property {string} width - popup的宽度设置，默认值为 'auto'，可取值为：一个数字值、一个字符串值、'auto'
 * @property {string} content - popup中要显示的内容，默认值为 ''
 * @property {string} placement - popup的放置部位（位于目标元素的外部或者内部），默认值为 'outside'，可取值为：'outside','inside'
 * @property {boolean} needArrow - 是否需要箭头，默认值为 true。
 * @property {boolean} singleOpen - 是否同时只打开一个popup，默认值为 true。
 * @property {boolean} selfClick - 是否可以点击popup自身，默认值为 true。
 * @property {boolean} closeByOutSide - 是否在点击popup以外的区域时关闭popup，默认值为 true。
 * @property {boolean} fullScreen - 遮罩层是否全屏，默认值为 true，这个属性只在showModal时生效。
 * @property {boolean} container - target所在的容器，默认值为 'body，可取值为一个选择器字符串或者一个dom元素。
 * @property {(number|string)} targetGap - popup与目标元素（触发元素）的间距，默认值为 15px，可取值为：一个数字值、一个字符串值。
 * @property {(number|string)} boundryGap - popup与容器边缘的间距，默认值为 5px，可取值为：一个数字值、一个字符串值。
 * @property {number[]} offset - popup的偏移量，相对于所在方向的便宜了，默认值为[x = 0, y = 0]。
 * @property {(object|string)} theme - popup的主题，默认值为'light'，可取值为'light'，'dark'，自定义的theme对象{background:'',color:''}。
 */

const popupOption = {

    //触发popup弹窗的元素，或者弹窗容器元素
    target: null,

    //弹窗元素
    popup: null,

    //target所在的容器
    container: 'body',

    //方向
    direction: 'bottom',

    //popup宽度设置
    width: 'auto',

    //popup中要显示的内容
    content: '',

    //popup的放置部位（位于目标元素的外部或者内部）
    placement: 'outside',

    //是否需要小箭头   
    needArrow: true,

    //是否同时只打开一个popup
    singleOpen: true,

    //是否可以点击popup自身
    selfClick: true,

    //是否在点击popup以外的区域时关闭popup
    closeByOutSide: true,

    //是否全屏
    fullScreen: true,

    //popup与目标元素（触发元素）的间距
    targetGap: 15,

    //popup与容器边缘的间距
    boundryGap: 5,

    //popup的偏移量
    offset: [0, 0],

    //popup的主题（文字颜色与背景色）
    theme: 'light',

}
const popupName = 'ease-popup'
const arrowName = 'ease-popup-arrow'
const modalName = 'ease-popup-modal'

//popup的默认样式
const popupStyle = {
    popup: [
        `.${popupName}`,
        ["display", "none"],
        ["position", "absolute"],
        ["box-sizing", "border-box"],
        ["padding", "8px"],
        ["box-shadow", "0px 0px 6px rgba(0, 0, 0, 0.2)"],
        ["border-radius", "4px"],
        ["border", "none"],
        ["outline", "none"],
        ["margin", "0"],
        ["width", "max-content"]
    ],
    arrow: [
        `.${popupName} .${arrowName}`,
        ["display", "block"],
        ["position", "absolute"],
        ["width", "10px"],
        ["height", "10px"],
        ["background-color", " inherit"],
        ["box-shadow", "-1px 1px 1px rgba(0, 0, 0, 0.1)"]
    ],
    dialog: [
        "dialog[open]",
        ["display", "block", true],
        ["overflow", "initial"]
    ]
}
//popup的主题样式
const popupTheme = {
    'light': { 'background': '#ffffff', 'color': '#333333' },
    'dark': { 'background': '#333333', 'color': '#ffffff' },
}
//arrow箭头的配置
const arrowOption = {
    rotate: {
        top: -45,
        bottom: 135,
        left: 225,
        right: 45,
    },
    side: {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
    }
}
//popup的方向
const directions = {
    outside: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'],
    inside: ['left', 'left-start', 'left-end', 'right', 'right-start', 'right-end', 'center', 'center-start', 'center-end']
}

export {
    popupStyle,
    popupName,
    arrowName,
    modalName,
    popupTheme,
    popupOption,
    arrowOption,
    directions
}