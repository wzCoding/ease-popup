/**
 * popupOption对象，用于配置popup组件的选项。
 * @property {string} direction - popup显示的方向，默认值为 'top'，可取值为：'center','top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end','left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'。
 * @property {string} trigger - popup的打开方式，默认值为 'click'，可取值为 'click','hover'
 * @property {string} width - popup的宽度设置，默认值为 'auto'，可取值为：一个数字值、一个字符串值、'auto'
 * @property {string} placement - popup的放置部位（位于目标元素的外部或者内部），默认值为 'outside'，可取值为：'outside','inside'
 * @property {boolean} useCache - 是否使用样式缓存（使用缓存可以减少样式计算，提升性能）。
 * @property {boolean} needArrow - 是否需要箭头。
 * @property {number} arrowSize - 箭头尺寸。
 * @property {number} gap - popup与目标元素（触发元素）的间距。
 * @property {number[]} offset - popup与body边缘的间距，取值为 [x,y]，表示上下、左右距离边缘的间距，默认为 [10,10]。
 * @property {(Object|string)} theme - popup的主题，默认值为'light'，可取值为'light'，'dark'，自定义的theme对象{background:'',color:''}。
 * @property {boolean} transition - popup的切换显隐时是否过渡，默认值为true。
 */

const popupOption = {
    //方向
    direction: 'top',
    
    //popup的打开方式
    trigger: 'click',

    //popup宽度设置
    width: 'auto',

    //popup的放置部位（位于目标元素的外部或者内部）
    placement: 'outside',

    //是否使用样式缓存（使用缓存可以减少样式计算，提升性能）
    useCache: false,

    //是否需要小箭头   
    needArrow: true,

    //箭头尺寸
    arrowSize: 10,

    //popup与目标元素（触发元素）的间距
    targetGap: 5,

    //popup与body边缘的间距
    boundryGap: [10, 10],

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
        ["display", "none"],
        ["position", "absolute"],
        ["box-sizing", "border-box"],
        ["left","var(--popup-x)"],
        ["top","var(--popup-y)"],
        ["width", "var(--popup-width)"],
        ["padding", "8px"],
        ["color", "var(--popup-color)"],
        ["background-color", "var(--popup-background)"],
        ["box-shadow", "0px 0px 6px rgba(0, 0, 0, 0.2)"],
        ["border-radius", "4px"],
        ["z-index", "2"],  
    ],
    arrow: [
        ".popup.arrow::after",
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
//纵向方向
const verticals = ['top', 'top-start', 'top-end', 'center', 'bottom', 'bottom-start', 'bottom-end']
//横向方向
const horizontals = ['left', 'left-start', 'left-end', 'center', 'right', 'right-start', 'right-end']

export {
    verticals,
    horizontals,
    popupStyle,
    popupTheme,
    popupOption
}