<template>
  <view class="task-item" :class="{ completed: completed }" @dblclick="$emit('toggleComplete')">
    <checkbox-group @change="onCheck">
      <checkbox class="checkbox" :value="String(id)" :checked="checked" />
    </checkbox-group>
    <image class="icon" :src="icon" mode="aspectFill" />
    <view class="info">
      <view class="name">{{ name }}</view>
      <view class="detail">{{ detail }}</view>
    </view>
    <view class="score">+{{ score }}</view>
    <view class="badges">
      <view v-if="type === 'temporary'" class="temporary-badge">临时</view>
      <view v-if="completed" class="completed-badge">已完成</view>
    </view>
  </view>
</template>

<script setup lang="js">
import { defineProps, defineEmits } from 'vue';
const props = defineProps({
  id: [String, Number],
  icon: String,
  name: String,
  detail: String,
  score: Number,
  checked: Boolean,
  completed: Boolean,
  type: {
    type: String,
    default: 'permanent'
  }
});
const emit = defineEmits(['update:checked', 'toggleComplete']);
function onCheck(e) {
  // e.detail.value 是选中的value数组
  emit('update:checked', e.detail.value.length > 0);
}
</script>

<style lang="scss" scoped>
.task-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
  padding: 24rpx 20rpx;
  margin-bottom: 20rpx;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  
  &.completed {
    background: #f8f9fa;
    opacity: 0.7;
    
    .name {
      text-decoration: line-through;
      color: #999;
    }
    
    .detail {
      color: #bbb;
    }
    
    .score {
      color: #999;
    }
    
    .icon {
      opacity: 0.6;
    }
  }
  
  .checkbox {
    margin-right: 20rpx;
    transform: scale(0.9);
  }
  .icon {
    width: 64rpx;
    height: 64rpx;
    border-radius: 12rpx;
    margin-right: 20rpx;
    background: #f5f5f5;
    transition: opacity 0.3s ease;
  }
  .info {
    flex: 1;
    .name {
      font-size: 32rpx;
      font-weight: 600;
      color: #222;
      margin-bottom: 8rpx;
      transition: all 0.3s ease;
    }
    .detail {
      font-size: 24rpx;
      color: #888;
      transition: color 0.3s ease;
    }
  }
  .score {
    font-size: 32rpx;
    color: #4caf50;
    font-weight: bold;
    margin-left: 16rpx;
    transition: color 0.3s ease;
  }
  .badges {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    display: flex;
    flex-direction: column;
    gap: 4rpx;
    
    .temporary-badge {
      background: #ff9800;
      color: #fff;
      font-size: 20rpx;
      padding: 4rpx 8rpx;
      border-radius: 8rpx;
      opacity: 0.9;
      white-space: nowrap;
    }
    
    .completed-badge {
      background: #4caf50;
      color: #fff;
      font-size: 20rpx;
      padding: 4rpx 8rpx;
      border-radius: 8rpx;
      opacity: 0.8;
      white-space: nowrap;
    }
  }
}
</style> 