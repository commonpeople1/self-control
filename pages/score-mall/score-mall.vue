<template>
  <view class="score-mall-page">
    <view class="header">
      <text class="title">积分商城</text>
      <view class="score-display">
        <text class="score-label">积分:</text>
        <text class="score-value">{{ score }}</text>
      </view>
    </view>
    
    <view class="content">
      <!-- 左侧分类导航 -->
      <view class="category-nav">
        <view class="nav-header">
          <text class="nav-title">奖励分类</text>
        </view>
        <scroll-view class="category-list" scroll-y>
          <view 
            v-for="category in categories" 
            :key="category"
            class="category-item"
            :class="{ active: selectedCategory === category }"
            @click="selectedCategory = category"
          >
            <text>{{ category }}</text>
          </view>
          <view v-if="!categories.length" class="empty-category">
            暂无分类，请到个人中心添加
          </view>
        </scroll-view>
      </view>
      
      <!-- 右侧奖励列表 -->
      <view class="reward-content">
        <view class="reward-header">
          <text class="reward-title">{{ selectedCategory || '请选择分类' }}</text>
        </view>
        <scroll-view class="reward-list" scroll-y>
          <RewardItem
            v-for="reward in currentRewards"
            :key="reward.id"
            :id="reward.id"
            :icon="reward.icon"
            :name="reward.name"
            :description="reward.description"
            :category="reward.category"
            :price="reward.price"
          />
          <view v-if="!currentRewards.length" class="empty-rewards">
            {{ selectedCategory ? '该分类下暂无奖励' : '请先选择分类' }}
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup lang="js">
import { ref, computed } from 'vue';
import { useRewards } from '@/composables/useRewards.js';
import { useScore } from '@/composables/useScore.js';
import RewardItem from '@/components/RewardItem.vue';

const iconCategoryList = [
  {
    category: '学习',
    icons: ['/static/icons/learn1.svg', '/static/svgs/sleep1.svg']
  },
  {
    category: '运动',
    icons: ['/static/icons/sport1.svg', '/static/svgs/lu1.svg']
  },
  {
    category: '休息',
    icons: ['/static/icons/sleep1.svg', '/static/icons/sleep2.svg']
  },
  {
    category: '其他',
    icons: ['/static/icons/icon4.png', '/static/icons/icon5.png']
  }
];

// 初始化积分和奖励管理
const { score } = useScore();
const { categories, getRewardsByCategory } = useRewards();

const selectedCategory = ref('');

// 计算当前分类的奖励项
const currentRewards = computed(() => {
  if (!selectedCategory.value) return [];
  return getRewardsByCategory(selectedCategory.value);
});

// 处理兑换事件
function handleExchange(rewardData) {
  uni.showModal({
    title: '确认兑换',
    content: `确定要兑换"${rewardData.name}"吗？将消耗 ${rewardData.price} 积分。`,
    success: (res) => {
      if (res.confirm) {
        // 这里可以添加兑换逻辑，比如扣除积分、记录兑换历史等
        uni.showToast({
          title: '兑换成功！',
          icon: 'success'
        });
      }
    }
  });
}
</script>

<style lang="scss" scoped>
.score-mall-page {
  min-height: 100vh;
  background: #f7f8fa;
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx 24rpx 24rpx 24rpx;
    background: #fff;
    border-bottom: 2rpx solid #f0f0f0;
    
    .title {
      font-size: 44rpx;
      font-weight: bold;
      color: #222;
    }
    
    .score-display {
      display: flex;
      align-items: center;
      background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
      padding: 12rpx 20rpx;
      border-radius: 20rpx;
      box-shadow: 0 2rpx 8rpx rgba(0,122,255,0.15);
      
      .score-label {
        font-size: 24rpx;
        color: #fff;
        margin-right: 8rpx;
      }
      
      .score-value {
        font-size: 32rpx;
        font-weight: bold;
        color: #fff;
      }
    }
  }
  
  .content {
    display: flex;
    height: calc(100vh - 120rpx);
    
    .category-nav {
      width: 240rpx;
      background: #fff;
      border-right: 2rpx solid #f0f0f0;
      
      .nav-header {
        padding: 24rpx 20rpx;
        border-bottom: 2rpx solid #f0f0f0;
        
        .nav-title {
          font-size: 28rpx;
          font-weight: bold;
          color: #222;
        }
      }
      
      .category-list {
        height: calc(100% - 88rpx);
        
        .category-item {
          padding: 20rpx;
          border-bottom: 1rpx solid #f0f0f0;
          transition: background 0.2s;
          
          &.active {
            background: #e3f2fd;
            color: #007aff;
          }
        }
        
        .empty-category {
          text-align: center;
          color: #bbb;
          font-size: 24rpx;
          padding: 40rpx 20rpx;
        }
      }
    }
    
    .reward-content {
      flex: 1;
      background: #f7f8fa;
      
      .reward-header {
        padding: 24rpx;
        background: #fff;
        border-bottom: 2rpx solid #f0f0f0;
        
        .reward-title {
          font-size: 32rpx;
          font-weight: bold;
          color: #222;
        }
      }
      
      .reward-list {
        height: calc(100% - 88rpx);
        padding: 24rpx;
        
        .empty-rewards {
          text-align: center;
          color: #bbb;
          font-size: 28rpx;
          margin-top: 80rpx;
        }
      }
    }
  }
}
</style> 