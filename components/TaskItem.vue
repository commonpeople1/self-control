<template>
  <view class="task-item">
    <checkbox-group @change="onCheck">
      <checkbox class="checkbox" :value="id" :checked="checked" />
    </checkbox-group>
    <image class="icon" :src="icon" mode="aspectFill" />
    <view class="info">
      <view class="name">{{ name }}</view>
      <view class="detail">{{ detail }}</view>
    </view>
    <view class="score">+{{ score }}</view>
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
  checked: Boolean
});
const emit = defineEmits(['update:checked']);
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
  transition: box-shadow 0.2s;
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
  }
  .info {
    flex: 1;
    .name {
      font-size: 32rpx;
      font-weight: 600;
      color: #222;
      margin-bottom: 8rpx;
    }
    .detail {
      font-size: 24rpx;
      color: #888;
    }
  }
  .score {
    font-size: 32rpx;
    color: #4caf50;
    font-weight: bold;
    margin-left: 16rpx;
  }
}
</style> 