<template>
  <view class="profile-page">
    <view class="header">
      <text class="title">{{ t('profile.title') }}</text>
    </view>
    
    <view class="menu-list">
      <view class="menu-item" @click="goToBackpack">
        <view class="menu-icon">🎒</view>
        <view class="menu-info">
          <text class="menu-title">{{ t('backpack.title') }}</text>
          <text class="menu-desc">{{ t('backpack.title') }}</text>
        </view>
        <view class="menu-arrow">></view>
      </view>
      <view class="menu-item" @click="goToMallManage">
        <view class="menu-icon">🏪</view>
        <view class="menu-info">
          <text class="menu-title">{{ t('mall.title') }}</text>
          <text class="menu-desc">{{ t('mall.title') }}</text>
        </view>
        <view class="menu-arrow">></view>
      </view>
      
      <view class="menu-item" @click="goToLanguage">
        <view class="menu-icon">🌐</view>
        <view class="menu-info">
          <text class="menu-title">{{ t('settings.language') }}</text>
          <text class="menu-desc">{{ t('settings.languageTip') }}</text>
        </view>
        <view class="menu-arrow">></view>
      </view>
      
      <view class="menu-item">
        <view class="menu-icon">⚙️</view>
        <view class="menu-info">
          <text class="menu-title">{{ t('settings.title') }}</text>
          <text class="menu-desc">{{ t('settings.general') }}</text>
        </view>
        <view class="menu-arrow">></view>
      </view>
      
      <view class="menu-item" @click="goToStatistics">
        <view class="menu-icon">📊</view>
        <view class="menu-info">
          <text class="menu-title">{{ t('statistics.title') }}</text>
          <text class="menu-desc">{{ t('statistics.title') }}</text>
        </view>
        <view class="menu-arrow">></view>
      </view>
      
      <!-- 测试tabBar更新按钮 -->
      <view class="menu-item" @click="testTabBarUpdate">
        <view class="menu-icon">🧪</view>
        <view class="menu-info">
          <text class="menu-title">测试TabBar更新</text>
          <text class="menu-desc">点击测试tabBar文本更新</text>
        </view>
        <view class="menu-arrow">></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="js">
import { onMounted, onUnmounted } from 'vue';
import { useScore } from '@/composables/useScore.js';
import { useI18n } from '@/composables/useI18n.js';
import { forceUpdateTabBar } from '@/utils/tabBarI18n.js';

const { t } = useI18n();

// 获取积分信息
const { score } = useScore();

// 监听语言变化事件
let localeChangeHandler = null;

onMounted(() => {
  // 监听语言变化事件
  localeChangeHandler = (locale) => {
    console.log('个人中心页面收到语言变化事件:', locale);
    // 延迟更新tabBar，确保语言切换完成
    setTimeout(() => {
      forceUpdateTabBar();
    }, 100);
    // 更新页面标题
    setTimeout(() => {
      uni.setNavigationBarTitle({
        title: t('profile.title')
      });
    }, 150);
  };
  
  uni.$on('localeChanged', localeChangeHandler);
  
  // 设置页面标题
  uni.setNavigationBarTitle({
    title: t('profile.title')
  });
});

onUnmounted(() => {
  // 清理事件监听
  if (localeChangeHandler) {
    uni.$off('localeChanged', localeChangeHandler);
  }
});

function goToBackpack() {
  uni.navigateTo({
    url: '/pages/backpack/backpack'
  });
}

function goToMallManage() {
  uni.navigateTo({
    url: '/pages/mall-manage/mall-manage'
  });
}

function goToLanguage() {
  uni.navigateTo({
    url: '/pages/profile/language'
  });
}

function goToStatistics() {
  console.log('点击统计按钮');
  uni.navigateTo({
    url: '/pages/statistics/statistics',
    success: () => {
      console.log('跳转成功');
    },
    fail: (err) => {
      console.error('跳转失败:', err);
      uni.showToast({
        title: t('error.operationFailed'),
        icon: 'none'
      });
    }
  });
}

// 测试tabBar更新
function testTabBarUpdate() {
  console.log('测试tabBar更新')
  forceUpdateTabBar()
  
  uni.showToast({
    title: '已尝试更新tabBar',
    icon: 'success'
  })
}
</script>

<style lang="scss" scoped>
.profile-page {
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
  
  .menu-list {
    padding: 24rpx;
    
    .menu-item {
      display: flex;
      align-items: center;
      background: #fff;
      border-radius: 16rpx;
      padding: 32rpx 24rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
      transition: all 0.2s ease;
      
      &:active {
        transform: scale(0.98);
        box-shadow: 0 1rpx 6rpx rgba(0,0,0,0.08);
      }
      
      .menu-icon {
        font-size: 48rpx;
        margin-right: 24rpx;
      }
      
      .menu-info {
        flex: 1;
        
        .menu-title {
          font-size: 32rpx;
          font-weight: 600;
          color: #222;
          margin-bottom: 8rpx;
          display: block;
        }
        
        .menu-desc {
          font-size: 24rpx;
          color: #888;
          display: block;
        }
      }
      
      .menu-arrow {
        font-size: 32rpx;
        color: #ccc;
        margin-left: 16rpx;
      }
    }
  }
}
</style> 