/**
 * popupOption对象，用于配置popup组件的选项。
 * @property {string} direction - popup显示的方向，默认值为 'top'，可取值为：'center','top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end','left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'。
 * @property {string} maxWidth - popup的最大宽度限制，默认值为 'auto'，可取值为：一个数字值、一个字符串值、'auto'
 * @property {string} placement - popup的放置部位（位于目标元素的外部或者内部），默认值为 'outside'，可取值为：'outside','inside'
 * @property {boolean} useCache - 是否使用样式缓存（使用缓存可以减少样式计算，提升性能）。
 * @property {boolean} needArrow - 是否需要箭头。
 * @property {number} arrowSize - 箭头尺寸。
 * @property {number} gap - popup与目标元素（触发元素）的间距。
 * @property {number[]} offset - popup与body边缘的间距，取值为 [x,y]，表示上下、左右距离边缘的间距，默认为 [10,10]。
 * @property {string,object} theme - popup的主题，默认值为'light'，可取值为'light'，'dark'，自定义的theme对象{background:'',color:''}。
 * @property {boolean} transition - popup的切换显隐时是否过渡，默认值为true。
 */

const popupOption = {
    //方向
    direction: 'top',

    //最大宽度限制
    maxWidth: 'auto',

    //popup的放置部位（位于目标元素的外部或者内部）
    placement: 'outside',

    //是否使用样式缓存（使用缓存可以减少样式计算，提升性能）
    useCache: false,

    //是否需要小箭头   
    needArrow: true,

    //箭头尺寸
    arrowSize: 10,

    //popup与目标元素（触发元素）的间距
    gap: 5,

    //popup与body边缘的间距
    offset: [10, 10],

    //popup的主题（文字颜色与背景色）
    theme: 'light',

    //popup切换显示与隐藏时是否使用过渡
    transition: {
        enter: 'animate__animated animate__fadeIn',
        leave: 'animate__animated animate__fadeOut'
    },

}

//popup的默认样式
const popupStyle = {
    popup: [
        ".popup",
        ["position", "absolute"],
        ["z-index", "2"],
        ["inset", "0 0 auto"],
        ["box-shadow", "0px 0px 6px rgba(0, 0, 0, 0.2)"],
        ["border-radius", "4px"],
        ["padding", "8px"],
        ["background-color", "var(--popup-background)"],
        ["color", "var(--popup-text)"],
        ["max-width", "var(--popup-width)"],
        ["display", "none"],
        ["transform", "translate(var(--popup-x), var(--popup-y))"],
        ["box-sizing","border-box"]
    ],
    arrow: [
        ".popup.arrow-popup::after",
        ["content", "''"],
        ["display", "block"],
        ["z-index", "-1"],
        ["position", "absolute"],
        ["left", "var(--arrow-x)"],
        ["top", "var(--arrow-y)"],
        ["background-color", "var(--popup-background)"],
        ["width", "var(--arrow-size)"],
        ["height", "var(--arrow-size)"],
        ["transform", " rotate(var(--arrow-rotate))"],
        ["box-shadow", "-1px 1px 1px rgba(0, 0, 0, 0.1)"]
    ]
}
//popup的主题样式
const popupTheme = {
    'light': { 'background': '#ffffff', 'color': '#333333' },
    'dark': { 'background': '#333333', 'color': '#ffffff' },
}
//根元素html宽度
const rootWidth = window.innerWidth
//根元素html高度
const rootHeight = window.innerHeight
//纵向方向
const verticals = ['top', 'top-start', 'top-end', 'center', 'bottom', 'bottom-start', 'bottom-end']
//横向方向
const horizontals = ['left', 'left-start', 'left-end', 'center', 'right', 'right-start', 'right-end']

export {
    rootWidth,
    rootHeight,
    verticals,
    horizontals,
    popupStyle,
    popupTheme,
    popupOption
}