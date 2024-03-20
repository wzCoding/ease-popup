
const list = [
   '介绍',
   ['安装', 'npm', 'cdn'],
   ['使用', '创建实例', '示例演示'],
   ['配置选项','target','popup','container', 'direction', 'placement', 'width', 'content','theme', 'targetGap', 'boundryGap', 'offset', 'needArrow', 'selfClick', 'closeByOutSide', 'singleOpen', 'fullScreen','onShow','onHide','onDestroy'],
]

const sidebar = list.map(item => {
   return {
      text: typeof item === 'string' ? item : item[0],
      link: typeof item === 'string' ? `#${item}` : `#${item[0]}`,
      children: typeof item === 'string' ? [] : item.filter((_, index) => index > 0).map(child => { return { text: child, link: `#${child.toLowerCase()}` } })
   }
})

const navbar = [
   {
      text: 'Blog博客',
      link: 'https://wzcoding.github.io/blog/'
   }
]
export {
   sidebar,
   navbar
}