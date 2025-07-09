<template>
  <view class="profile-page">
    <view class="header">
      <text class="title">个人中心</text>
    </view>
    
    <view class="menu-list">
      <view class="menu-item" @click="goToBackpack">
        <view class="menu-icon">🎒</view>
        <view class="menu-info">
          <text class="menu-title">奖励背包</text>
          <text class="menu-desc">查看和使用已兑换奖励</text>
        </view>
        <view class="menu-arrow">></view>
      </view>
      <view class="menu-item" @click="goToMallManage">
        <view class="menu-icon">🏪</view>
        <view class="menu-info">
          <text class="menu-title">商城管理</text>
          <text class="menu-desc">管理奖励分类和奖励项</text>
        </view>
        <view class="menu-arrow">></view>
      </view>
      
      <!-- 可以在这里添加更多菜单项 -->
      <view class="menu-item">
        <view class="menu-icon">⚙️</view>
        <view class="menu-info">
          <text class="menu-title">设置</text>
          <text class="menu-desc">应用设置和偏好</text>
        </view>
        <view class="menu-arrow">></view>
      </view>
      
      <view class="menu-item" @click="goToStatistics">
        <view class="menu-icon">📊</view>
        <view class="menu-info">
          <text class="menu-title">统计</text>
          <text class="menu-desc">查看任务完成统计</text>
        </view>
        <view class="menu-arrow">></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="js">
import { useScore } from '@/composables/useScore.js';

// 获取积分信息
const { score } = useScore();

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
        title: '页面跳转失败',
        icon: 'none'
      });
    }
  });
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