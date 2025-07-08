<template>
  <view class="backpack-page">
    <view class="header">
      <text class="title">奖励背包</text>
    </view>
    <view class="content">
      <view v-if="!backpack.length" class="empty">暂无奖励，快去积分商城兑换吧！</view>
      <view v-for="item in backpack" :key="item.id" class="reward-item">
        <image :src="item.icon" class="icon" />
        <view class="info">
          <text class="name">{{ item.name }}</text>
          <text class="desc">{{ item.description }}</text>
          <text class="count">数量：{{ item.count }}</text>
        </view>
        <button class="use-btn" @click="handleUse(item.id)">使用</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="js">
import { useBackpack } from '@/composables/useBackpack.js'
const { backpack, useReward } = useBackpack()

function handleUse(id) {
  uni.showModal({
    title: '使用奖励',
    content: '确定要使用该奖励吗？',
    success: (res) => {
      if (res.confirm) {
        useReward(id)
        uni.showToast({ title: '已使用', icon: 'success' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.backpack-page {
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
  .content {
    padding: 24rpx;
    .empty {
      text-align: center;
      color: #bbb;
      font-size: 32rpx;
      margin-top: 120rpx;
    }
    .reward-item {
      display: flex;
      align-items: center;
      background: #fff;
      border-radius: 16rpx;
      box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
      padding: 24rpx 20rpx;
      margin-bottom: 20rpx;
      .icon {
        width: 64rpx;
        height: 64rpx;
        border-radius: 12rpx;
        margin-right: 20rpx;
        background: #f5f5f5;
      }
      .info {
        flex: 1;
        .name {
          font-size: 32rpx;
          font-weight: 600;
          color: #222;
          margin-bottom: 8rpx;
        }
        .desc {
          font-size: 24rpx;
          color: #888;
          margin-bottom: 8rpx;
        }
        .count {
          font-size: 26rpx;
          color: #4caf50;
        }
      }
      .use-btn {
        background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
        color: #fff;
        border: none;
        border-radius: 20rpx;
        padding: 12rpx 24rpx;
        font-size: 24rpx;
        margin-left: 16rpx;
        transition: all 0.2s ease;
        &:active {
          transform: scale(0.95);
        }
      }
    }
  }
}
</style> 