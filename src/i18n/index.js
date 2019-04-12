import VueI18n from 'vue-i18n'
import Vue from 'vue'

import en from '@/i18n/en'
import zh from '@/i18n/zh-CN'

Vue.use(VueI18n)
var lang  = navigator.language || navigator.userLanguage;

const  messages = {
    'en': en,
    'zh-CN': zh
}
const i18n = new VueI18n({
    locale:lang, // 语言标识
    messages
})
export default i18n