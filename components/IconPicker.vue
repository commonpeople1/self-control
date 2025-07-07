<template>
  <view class="icon-picker">
    <view class="icon-list">
      <view v-for="(icon, idx) in icons" :key="icon" class="icon-item" :class="{selected: icon === modelValue}" @click="$emit('update:modelValue', icon)">
        <image :src="icon" mode="aspectFill" />
      </view>
    </view>
  </view>
</template>

<script setup lang="js">
import { defineProps } from 'vue';
const props = defineProps({
  icons: {
    type: Array,
    default: () => []
  },
  modelValue: String
});
</script>

<style lang="scss" scoped>
.icon-picker {
  padding: 16rpx 0;
  .icon-list {
    display: flex;
    flex-wrap: wrap;
    gap: 24rpx;
    .icon-item {
      width: 80rpx;
      height: 80rpx;
      border-radius: 16rpx;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2rpx solid transparent;
      transition: border-color 0.2s;
      &.selected {
        border-color: #007aff;
        background: #e3f2fd;
      }
      image {
        width: 56rpx;
        height: 56rpx;
      }
    }
  }
}
</style> 