# 轻量级i18n国际化方案

## 为什么选择轻量级方案？

`vue-i18n@next` 在uni-app打包安卓后可能存在兼容性问题，因此我们采用了专门为uni-app设计的轻量级国际化方案。

## 优势

✅ **完全兼容uni-app** - 无需额外依赖，避免打包问题  
✅ **轻量级** - 文件大小小，加载速度快  
✅ **简单易用** - API简洁，学习成本低  
✅ **跨平台支持** - 支持H5、小程序、App等所有uni-app平台  
✅ **持久化存储** - 语言设置自动保存  

## 文件结构

```
utils/
└── i18n.js              # 轻量级i18n工具
pages/profile/
└── language.vue         # 语言设置页面
```

## 使用方法

### 1. 在模板中使用

```vue
<template>
  <text>{{ t('task.title') }}</text>
  <text>{{ t('common.confirm') }}</text>
</template>

<script setup>
import { t } from '@/utils/i18n.js'
</script>
```

### 2. 在脚本中使用

```javascript
import { t, setLocale, getCurrentLocale } from '@/utils/i18n.js'

// 获取翻译
console.log(t('task.title'))

// 切换语言
setLocale('en')

// 获取当前语言
const currentLang = getCurrentLocale()
```

### 3. 语言切换

```javascript
import { setLocale } from '@/utils/i18n.js'

// 切换到英文
setLocale('en')

// 切换到中文
setLocale('zh')
```

## 语言包结构

语言包按功能模块组织：

- `common`: 通用文本
- `nav`: 导航相关
- `task`: 任务相关
- `statistics`: 统计相关
- `score`: 积分相关
- `mall`: 商城相关
- `backpack`: 背包相关
- `profile`: 个人中心
- `settings`: 设置相关

## 添加新翻译

1. 在 `utils/i18n.js` 的 `messages` 对象中添加翻译
2. 在代码中使用 `t('key')` 引用

示例：
```javascript
// 在messages.zh中添加
zh: {
  newFeature: {
    title: '新功能',
    description: '功能描述'
  }
}

// 在messages.en中添加
en: {
  newFeature: {
    title: 'New Feature',
    description: 'Feature description'
  }
}

// 在代码中使用
{{ t('newFeature.title') }}
```

## 语言设置页面

用户可以通过以下路径访问语言设置：
1. 个人中心 → 语言设置
2. 选择中文或英文
3. 应用会立即切换并保存设置

## 响应式更新

语言切换后，页面会自动更新显示新语言的文本。

## 错误处理

- 如果翻译键不存在，会显示键名并输出警告
- 存储失败时会输出错误信息但不会中断应用

## 与vue-i18n的区别

| 特性 | 轻量级方案 | vue-i18n@next |
|------|------------|---------------|
| 文件大小 | 小 | 大 |
| 兼容性 | 完全兼容 | 可能有兼容问题 |
| 依赖 | 无 | 需要安装 |
| 学习成本 | 低 | 中等 |
| 功能 | 基础完整 | 功能丰富 |

## 注意事项

1. 确保翻译键在两种语言中都存在
2. 语言切换后可能需要重启应用才能完全生效
3. 建议在开发时先添加中文翻译，再添加英文翻译

## 故障排除

如果遇到问题：

1. 检查 `utils/i18n.js` 文件是否存在
2. 确认翻译键是否正确
3. 检查控制台是否有错误信息
4. 清除本地存储重新设置语言

## 扩展支持

如需支持更多语言，只需在 `messages` 对象中添加新的语言包即可。 