<template>
  <view class="language-page">
    <view class="header">
      <text class="title">{{ t('settings.language') }}</text>
    </view>
    
    <view class="language-list">
      <view 
        v-for="locale in supportedLocales" 
        :key="locale.code"
        class="language-item"
        :class="{ active: currentLocale === locale.code }"
        @click="selectLanguage(locale.code)"
      >
        <view class="language-info">
          <text class="language-name">{{ locale.nativeName }}</text>
          <text class="language-native">{{ locale.name }}</text>
        </view>
        <view class="language-status">
          <text v-if="currentLocale === locale.code" class="status-active">✓</text>
        </view>
      </view>
    </view>
    
    <view class="tip-section">
      <text class="tip-title">{{ t('settings.languageTip') }}</text>
      <text class="tip-content">{{ t('common.info') }}: {{ t('settings.languageTip') }}</text>
    </view>
  </view>
</template>

<script setup lang="js">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from '@/composables/useI18n.js'
import { getSupportedLocales, setLocale, currentLocale } from '@/utils/i18n.js'

const { t } = useI18n()

const supportedLocales = ref([])

onMounted(() => {
  supportedLocales.value = getSupportedLocales()
})

function selectLanguage(locale) {
  if (locale !== currentLocale.value) {
    setLocale(locale)
    
    uni.showToast({
      title: locale === 'zh' ? '语言已切换为中文' : 'Language changed to English',
      icon: 'success'
    })
    
    // 延迟返回上一页，让用户看到切换效果
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
.language-page {
  min-height: 100vh;
  background: #f7f8fa;
  
  .header {
    padding: 32rpx 24rpx 24rpx 24rpx;
    background: #fff;
    border-bottom: 2rpx solid #f0f0f0;
    
    .title {
      font-size: 44rpx;
      font-weight: bold;
      color: #222;
    }
  }
  
  .language-list {
    margin: 24rpx;
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
    
    .language-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32rpx 24rpx;
      border-bottom: 1rpx solid #f0f0f0;
      transition: all 0.3s ease;
      
      &:last-child {
        border-bottom: none;
      }
      
      &.active {
        background: rgba(79, 172, 254, 0.05);
        border-left: 4rpx solid #4facfe;
      }
      
      &:active {
        background: rgba(79, 172, 254, 0.1);
      }
      
      .language-info {
        flex: 1;
        
        .language-name {
          font-size: 32rpx;
          color: #222;
          font-weight: 600;
          display: block;
          margin-bottom: 8rpx;
        }
        
        .language-native {
          font-size: 24rpx;
          color: #888;
          display: block;
        }
      }
      
      .language-status {
        .status-active {
          font-size: 32rpx;
          color: #4facfe;
          font-weight: bold;
        }
      }
    }
  }
  
  .tip-section {
    margin: 24rpx;
    padding: 24rpx;
    background: #fff;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
    
    .tip-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #222;
      display: block;
      margin-bottom: 16rpx;
    }
    
    .tip-content {
      font-size: 24rpx;
      color: #888;
      line-height: 1.5;
      display: block;
    }
  }
}
</style> 