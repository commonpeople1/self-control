import { computed } from 'vue'
import { t, currentLocale, setLocale, getSupportedLocales } from '@/utils/i18n.js'

// 响应式i18n composable
export function useI18n() {
  // 响应式的翻译函数
  const translate = computed(() => {
    return (key, params = {}) => t(key, params)
  })

  // 响应式的当前语言
  const locale = computed(() => currentLocale.value)

  // 响应式的支持语言列表
  const supportedLocales = computed(() => getSupportedLocales())

  // 切换语言函数
  const changeLocale = (newLocale) => {
    setLocale(newLocale)
  }

  // 检查是否为指定语言
  const isLocale = (targetLocale) => {
    return currentLocale.value === targetLocale
  }

  return {
    t: translate.value,
    locale,
    changeLocale,
    isLocale,
    supportedLocales
  }
} 