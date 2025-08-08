<template>
  <view class="test-page">
    <view class="header">
      <text class="title">TabBar国际化测试</text>
      <text class="subtitle">当前语言: {{ locale }}</text>
    </view>
    
    <view class="content">
      <view class="section">
        <text class="section-title">当前TabBar文本</text>
        <view class="test-items">
          <text class="test-item">任务列表: {{ currentTabBarTexts.taskList }}</text>
          <text class="test-item">积分商城: {{ currentTabBarTexts.scoreMall }}</text>
          <text class="test-item">个人中心: {{ currentTabBarTexts.profile }}</text>
        </view>
      </view>
      
      <view class="section">
        <text class="section-title">语言切换</text>
        <view class="language-buttons">
          <button class="lang-btn" @click="changeLanguage('zh')" :class="{ active: currentLocale === 'zh' }">
            中文
          </button>
          <button class="lang-btn" @click="changeLanguage('en')" :class="{ active: currentLocale === 'en' }">
            English
          </button>
        </view>
      </view>
      
      <view class="section">
        <text class="section-title">测试操作</text>
        <view class="test-buttons">
          <button class="test-btn" @click="testTabBarUpdate">手动更新TabBar</button>
          <button class="test-btn" @click="checkTabBarStatus">检查TabBar状态</button>
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
import { ref, computed } from 'vue'
import { useI18n } from '@/composables/useI18n.js'
import { updateTabBarTexts } from '@/utils/tabBarI18n.js'
import { setLocale } from '@/utils/i18n.js'

const { t, locale } = useI18n()

const currentLocale = computed(() => locale.value)

const currentTabBarTexts = computed(() => ({
  taskList: t('tabBar.taskList'),
  scoreMall: t('tabBar.scoreMall'),
  profile: t('tabBar.profile')
}))

function changeLanguage(lang) {
  console.log('切换语言到:', lang)
  
  // 设置语言
  setLocale(lang)
  
  // 延迟更新tabBar
  setTimeout(() => {
    console.log('开始更新tabBar...')
    updateTabBarTexts()
  }, 500)
  
  uni.showToast({
    title: lang === 'zh' ? '已切换到中文' : 'Switched to English',
    icon: 'success'
  })
}

function testTabBarUpdate() {
  console.log('手动测试tabBar更新')
  updateTabBarTexts()
  
  uni.showToast({
    title: '已尝试更新tabBar',
    icon: 'success'
  })
}

function checkTabBarStatus() {
  console.log('检查tabBar状态')
  
  // 尝试获取tabBar信息
  uni.getTabBarItem({
    index: 0,
    success: (res) => {
      console.log('tabBar[0] 当前文本:', res.text)
    },
    fail: (err) => {
      console.error('获取tabBar[0]失败:', err)
    }
  })
  
  uni.getTabBarItem({
    index: 1,
    success: (res) => {
      console.log('tabBar[1] 当前文本:', res.text)
    },
    fail: (err) => {
      console.error('获取tabBar[1]失败:', err)
    }
  })
  
  uni.getTabBarItem({
    index: 2,
    success: (res) => {
      console.log('tabBar[2] 当前文本:', res.text)
    },
    fail: (err) => {
      console.error('获取tabBar[2]失败:', err)
    }
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
    }
    
    .subtitle {
      font-size: 28rpx;
      color: #666;
      margin-top: 10rpx;
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
      
      .test-buttons {
        display: flex;
        gap: 20rpx;
        
        .test-btn {
          flex: 1;
          height: 80rpx;
          border: 2rpx solid #e0e0e0;
          border-radius: 16rpx;
          background: #fff;
          color: #666;
          font-size: 28rpx;
          transition: all 0.3s ease;
          
          &:active {
            transform: scale(0.98);
          }
        }
      }
      
      .test-text {
        display: block;
        font-size: 28rpx;
        color: #666;
        margin-top: 20rpx;
      }
    }
  }
}
</style> 