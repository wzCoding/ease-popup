
const list = [
   '介绍',
   ['安装', 'npm', 'cdn'],
   ['使用', '创建实例', '参数说明'],
   ['options 配置', 'direction', 'placement', 'width', 'content', 'container', 'theme', 'targetGap', 'boundryGap', 'offset', 'needArrow', 'selfClick', 'closeByOutSide', 'singleOpen', 'fullScreen'],
]

const sidebar = list.map(item => {
   return {
      text: typeof item === 'string' ? item : item[0],
      link: typeof item === 'string' ? `#${item}` : `#${item[0]}`,
      collapsible: typeof item === 'string',
      children: typeof item === 'string' ? [] : item.filter((_, index) => index > 0).map(child => { return { text: child, link: `#${child}` } })
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