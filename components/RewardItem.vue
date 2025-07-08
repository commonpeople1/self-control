<template>
  <view class="reward-item">
    <image class="icon" :src="icon" mode="aspectFill" />
    <view class="info">
      <view class="name">{{ name }}</view>
      <view class="description">{{ description }}</view>
      <view class="price">{{ price }} 积分</view>
    </view>
    <button
      class="exchange-btn"
      :class="{ disabled: !canExchange }"
      @click="handleExchange"
      :disabled="!canExchange"
    >
      {{ canExchange ? '兑换' : '积分不足' }}
    </button>
  </view>
</template>

<script setup lang="js">
import { defineProps, defineEmits, computed } from 'vue';
import { useScore } from '@/composables/useScore.js';
import { useBackpack } from '@/composables/useBackpack.js';

const props = defineProps({
  id: [String, Number],
  icon: String,
  name: String,
  description: String,
  category: String,
  price: {
    type: [String, Number],
    default: 0
  }
});

const emit = defineEmits(['exchange']);

const { score, subtractScore } = useScore();
const { addToBackpack } = useBackpack();

// 计算是否可以兑换
const canExchange = computed(() => {
  return score.value >= Number(props.price);
});

function handleExchange() {
  if (!canExchange.value) return;
  uni.showModal({
    title: '确认兑换',
    content: `确定要兑换"${props.name}"吗？将消耗 ${props.price} 积分。`,
    success: (res) => {
      if (res.confirm) {
        subtractScore(Number(props.price));
        addToBackpack({
          id: props.id,
          icon: props.icon,
          name: props.name,
          description: props.description,
          price: props.price,
          category: props.category
        });
        uni.showToast({ title: '兑换成功', icon: 'success' });
        emit('exchange', { id: props.id, name: props.name, price: props.price });
      }
    }
  });
}
</script>

<style lang="scss" scoped>
.reward-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
  padding: 24rpx 20rpx;
  margin-bottom: 20rpx;
  transition: all 0.3s ease;
  
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
    .description {
      font-size: 24rpx;
      color: #888;
      line-height: 1.4;
      margin-bottom: 8rpx;
    }
    .price {
      font-size: 26rpx;
      color: #ff6b35;
      font-weight: 600;
    }
  }
  
  .exchange-btn {
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
    
    &.disabled,
    &:disabled {
      background: #eee;
      color: #ccc;
      border: 1rpx solid #ccc;
      cursor: not-allowed;
    }
  }
}
</style> 