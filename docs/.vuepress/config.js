import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { getDirname, path } from 'vuepress/utils'
import { sidebar,navbar } from './bar'

export default defineUserConfig({
    bundler: viteBundler(),
    theme: defaultTheme({
        logo: '/head.png',
        repo: 'https://github.com/wzCoding/ease-popup',
        docsRepo: 'https://github.com/wzCoding/ease-popup/',
        sidebar,
        navbar
    }),
    base: '/ease-popup/',
    lang: 'zh-CN',
    title: 'esae-popup',
    description: 'esae-popup 文档',
    clientConfigFile: path.resolve(getDirname(import.meta.url), 'client.js'),
})