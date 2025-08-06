<template>
  <view class="test-page">
    <view class="header">
      <text class="title">{{ t('task.title') }}</text>
      <text class="subtitle">当前语言: {{ locale }}</text>
    </view>
    
    <view class="content">
      <view class="section">
        <text class="section-title">测试翻译</text>
        <view class="test-items">
          <text class="test-item">{{ t('task.addTask') }}</text>
          <text class="test-item">{{ t('task.taskName') }}</text>
          <text class="test-item">{{ t('task.taskDetail') }}</text>
          <text class="test-item">{{ t('common.confirm') }}</text>
          <text class="test-item">{{ t('common.cancel') }}</text>
        </view>
      </view>
      
      <view class="section">
        <text class="section-title">语言切换</text>
        <view class="language-buttons">
          <button class="lang-btn" @click="changeLanguage('zh')" :class="{ active: locale === 'zh' }">
            中文
          </button>
          <button class="lang-btn" @click="changeLanguage('en')" :class="{ active: locale === 'en' }">
            English
          </button>
        </view>
      </view>
      
      <view class="section">
        <text class="section-title">响应式测试</text>
        <text class="test-text">这个文本会随着语言切换而改变: {{ t('statistics.title') }}</text>
        <text class="test-text">当前时间: {{ currentTime }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue'
import { useI18n } from '@/composables/useI18n.js'

const { t, locale, changeLocale } = useI18n()

const currentTime = ref('')

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString()
}

function changeLanguage(lang) {
  changeLocale(lang)
  uni.showToast({
    title: lang === 'zh' ? '已切换到中文' : 'Switched to English',
    icon: 'success'
  })
}
</script>

<style lang="scss" scoped>
.test-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding: 24rpx;
  
  .header {
    background: #fff;
    border-radius: 16rpx;
    padding: 32rpx 24rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
    
    .title {
      font-size: 44rpx;
      font-weight: bold;
      color: #222;
      display: block;
      margin-bottom: 16rpx;
    }
    
    .subtitle {
      font-size: 28rpx;
      color: #666;
      display: block;
    }
  }
  
  .content {
    .section {
      background: #fff;
      border-radius: 16rpx;
      padding: 32rpx 24rpx;
      margin-bottom: 24rpx;
      box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
      
      .section-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #222;
        display: block;
        margin-bottom: 24rpx;
      }
      
      .test-items {
        .test-item {
          display: block;
          font-size: 28rpx;
          color: #666;
          margin-bottom: 16rpx;
          padding: 16rpx;
          background: #f8f9fa;
          border-radius: 8rpx;
        }
      }
      
      .language-buttons {
        display: flex;
        gap: 20rpx;
        
        .lang-btn {
          flex: 1;
          height: 80rpx;
          border: 2rpx solid #e0e0e0;
          border-radius: 16rpx;
          background: #fff;
          color: #666;
          font-size: 28rpx;
          transition: all 0.3s ease;
          
          &.active {
            background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
            color: #fff;
            border-color: transparent;
          }
          
          &:active {
            transform: scale(0.98);
          }
        }
      }
      
      .test-text {
        display: block;
        font-size: 28rpx;
        color: #666;
        margin-bottom: 16rpx;
        line-height: 1.5;
      }
    }
  }
}
</style> 