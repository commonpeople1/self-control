<template>
  <view v-if="modelValue" class="icon-picker-dialog">
    <view class="mask" @click="$emit('update:modelValue', false)"></view>
    <view class="dialog">
      <view class="dialog-title">选择图标</view>
      <swiper class="category-swiper" :current="current" @change="onSwiperChange" circular>
        <swiper-item v-for="(cat, idx) in iconCategoryList" :key="cat.category">
          <view class="category-panel">
            <view class="category-name">{{ cat.category }}</view>
            <view class="icon-list">
              <view v-for="icon in cat.icons" :key="icon" class="icon-item" @click="selectIcon(icon)">
                <image :src="icon" mode="aspectFill" />
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
      <view class="category-tabs">
        <view v-for="(cat, idx) in iconCategoryList" :key="cat.category" class="tab" :class="{active: idx === current}" @click="current = idx">{{ cat.category }}</view>
      </view>
      <view class="dialog-actions">
        <button class="cancel" @click="$emit('update:modelValue', false)">取消</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="js">
import { defineProps, defineEmits, ref } from 'vue';
const props = defineProps({
  modelValue: Boolean,
  iconCategoryList: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(['update:modelValue', 'select']);
const current = ref(0);
function onSwiperChange(e) {
  current.value = e.detail.current;
}
function selectIcon(icon) {
  emit('select', icon);
  emit('update:modelValue', false);
}
</script>

<style lang="scss" scoped>
.icon-picker-dialog {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  z-index: 2000;
  .mask {
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.3);
  }
  .dialog {
    position: absolute;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 650rpx;
    background: #fff;
    border-radius: 24rpx;
    padding: 32rpx 24rpx 24rpx 24rpx;
    box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.18);
    .dialog-title {
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 24rpx;
      color: #222;
      text-align: center;
    }
    .category-swiper {
      height: 420rpx; // 增加高度
      margin-bottom: 16rpx;
      .category-panel {
        display: flex;
        flex-direction: column;
        align-items: center;
        .category-name {
          font-size: 28rpx;
          color: #007aff;
          margin-bottom: 12rpx;
        }
        .icon-list {
          display: flex;
          flex-wrap: wrap;
          gap: 24rpx;
          justify-content: center;
          max-height: 340rpx; // 限制高度
          overflow-y: auto; // 超出时滚动
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
            image {
              width: 56rpx;
              height: 56rpx;
            }
          }
        }
      }
    }
    .category-tabs {
      display: flex;
      justify-content: center;
      gap: 24rpx;
      margin-bottom: 12rpx;
      .tab {
        font-size: 26rpx;
        color: #888;
        padding: 8rpx 20rpx;
        border-radius: 20rpx;
        background: #f5f5f5;
        &.active {
          color: #fff;
          background: #007aff;
        }
      }
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 8rpx;
      .cancel {
        background: #f5f5f5;
        color: #888;
        border: none;
        border-radius: 28rpx;
        padding: 0 36rpx;
        height: 56rpx;
        font-size: 28rpx;
        box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
        transition: background 0.2s, color 0.2s;
        &:active {
          background: #e0eafc;
          color: #007aff;
        }
      }
    }
  }
}
</style> 