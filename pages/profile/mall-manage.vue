<template>
  <view class="mall-manage-page">
    <view class="header">
      <view class="header-top">
        <text class="title">商城管理</text>
        <view class="score-display">
          <text class="score-label">积分:</text>
          <text class="score-value">{{ score }}</text>
        </view>
      </view>
      <view class="actions">
        <button class="add-category-btn" @click="showAddCategory = true">添加分类</button>
        <button class="add-reward-btn" @click="showAddReward = true" :disabled="!categories.length">添加奖励</button>
      </view>
    </view>
    
    <view class="content">
      <!-- 调试信息 -->
      <view class="debug-info" style="background: #f0f0f0; padding: 20rpx; margin-bottom: 20rpx; border-radius: 16rpx;">
        <text style="font-size: 24rpx; color: #666;">调试信息：</text>
        <text style="font-size: 24rpx; color: #666; display: block;">分类数量: {{ categories.length }}</text>
        <text style="font-size: 24rpx; color: #666; display: block;">奖励总数: {{ rewards.length }}</text>
        <text style="font-size: 24rpx; color: #666; display: block;">存储的分类: {{ JSON.stringify(categories) }}</text>
        <text style="font-size: 24rpx; color: #666; display: block;">存储的奖励: {{ JSON.stringify(rewards) }}</text>
      </view>
      
      <view class="category-list">
        <view 
          v-for="category in categories" 
          :key="category"
          class="category-item"
        >
          <view class="category-info">
            <text class="category-name">{{ category }}</text>
            <text class="reward-count">{{ getRewardsByCategory(category).length }} 个奖励</text>
          </view>
          <view class="category-actions">
            <button class="view-rewards-btn" @click="viewCategoryRewards(category)">查看奖励</button>
            <button class="edit-btn" @click="handleEditCategory(category)">编辑</button>
            <button class="delete-btn" @click="handleDeleteCategory(category)">删除</button>
          </view>
        </view>
        
        <view v-if="!categories.length" class="empty-category">
          <text class="empty-text">暂无奖励分类</text>
          <text class="empty-desc">点击上方"添加分类"按钮开始创建</text>
        </view>
      </view>
    </view>
    
    <!-- 添加分类弹窗 -->
    <view v-if="showAddCategory" class="mask" @click="showAddCategory = false"></view>
    <view v-if="showAddCategory" class="add-dialog">
      <text class="dialog-title">{{ isEditing ? '编辑分类' : '添加分类' }}</text>
      <view class="form-row">
        <text class="label">分类名称</text>
        <input v-model="categoryForm.name" placeholder="请输入分类名称" />
      </view>
      <view class="dialog-actions">
        <button class="cancel" @click="cancelEdit">取消</button>
        <button class="confirm" :disabled="!categoryForm.name" @click="handleAddCategory">确定</button>
      </view>
    </view>
    
    <!-- 添加奖励弹窗 -->
    <view v-if="showAddReward" class="mask" @click="showAddReward = false"></view>
    <view v-if="showAddReward" class="add-dialog">
      <text class="dialog-title">{{ isEditingReward ? '编辑奖励' : '添加奖励' }}</text>
      <view class="form-row">
        <text class="label">分类</text>
        <picker :value="rewardForm.categoryIndex" :range="categories" @change="onCategoryChange">
          <view class="picker">
            {{ rewardForm.categoryIndex >= 0 ? categories[rewardForm.categoryIndex] : '请选择分类' }}
          </view>
        </picker>
      </view>
      <view class="form-row">
        <text class="label">图标</text>
        <button class="choose-icon-btn" @click="showIconPicker = true">
          <image v-if="rewardForm.icon" :src="rewardForm.icon" class="icon-preview" />
          <span v-else>选择图标</span>
        </button>
      </view>
      <view class="form-row">
        <text class="label">名称</text>
        <input v-model="rewardForm.name" placeholder="请输入奖励名称" />
      </view>
      <view class="form-row">
        <text class="label">描述</text>
        <textarea v-model="rewardForm.description" placeholder="请输入奖励描述" />
      </view>
      <view class="form-row">
        <text class="label">积分价格</text>
        <input v-model="rewardForm.price" type="number" placeholder="请输入积分价格" />
      </view>
      <view class="dialog-actions">
        <button class="cancel" @click="cancelRewardEdit">取消</button>
        <button class="confirm" :disabled="!rewardForm.name || !rewardForm.icon || rewardForm.categoryIndex < 0 || !rewardForm.price" @click="handleAddReward">确定</button>
      </view>
    </view>
    
    <!-- 查看分类奖励弹窗 -->
    <view v-if="showRewardsList" class="mask" @click="showRewardsList = false"></view>
    <view v-if="showRewardsList" class="rewards-dialog">
      <view class="dialog-header">
        <text class="dialog-title">{{ selectedCategory }} - 奖励列表</text>
        <button class="close-btn" @click="showRewardsList = false">×</button>
      </view>
      <scroll-view class="rewards-list" scroll-y>
        <view 
          v-for="reward in currentCategoryRewards" 
          :key="reward.id"
          class="reward-item"
        >
          <view class="reward-info">
            <image :src="reward.icon" class="reward-icon" />
                      <view class="reward-details">
            <text class="reward-name">{{ reward.name }}</text>
            <text class="reward-desc">{{ reward.description }}</text>
            <text class="reward-price">{{ reward.price }} 积分</text>
          </view>
          </view>
          <view class="reward-actions">
            <button class="edit-reward-btn" @click="handleEditReward(reward)">编辑</button>
            <button class="delete-reward-btn" @click="handleDeleteReward(reward.id)">删除</button>
          </view>
        </view>
        <view v-if="!currentCategoryRewards.length" class="empty-rewards">
          <text>该分类下暂无奖励</text>
        </view>
      </scroll-view>
    </view>
    
    <IconPickerDialog v-model="showIconPicker" :iconCategoryList="iconCategoryList" @select="onSelectIcon" />
  </view>
</template>

<script setup lang="js">
import { ref, reactive, computed } from 'vue';
import { useRewards } from '@/composables/useRewards.js';
import { useScore } from '@/composables/useScore.js';
import IconPickerDialog from '@/components/IconPickerDialog.vue';

const iconCategoryList = [
  {
    category: '学习',
    icons: ['/static/icons/learn1.svg', '/static/icons/learn2.svg']
  },
  {
    category: '运动',
    icons: ['/static/icons/sport1.svg', '/static/icons/sport2.svg']
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
const { categories, rewards, addCategory, removeCategory, addReward, removeReward, getRewardsByCategory } = useRewards();

const showAddCategory = ref(false);
const showAddReward = ref(false);
const showRewardsList = ref(false);
const showIconPicker = ref(false);
const isEditing = ref(false);
const isEditingReward = ref(false);
const editingCategory = ref('');
const editingRewardId = ref('');
const selectedCategory = ref('');

const categoryForm = reactive({
  name: ''
});

const rewardForm = reactive({
  categoryIndex: -1,
  icon: '',
  name: '',
  description: '',
  price: ''
});

// 计算当前分类的奖励项
const currentCategoryRewards = computed(() => {
  if (!selectedCategory.value) return [];
  return getRewardsByCategory(selectedCategory.value);
});

function handleAddCategory() {
  if (categoryForm.name.trim()) {
    if (isEditing.value) {
      // 编辑模式：删除旧分类，添加新分类
      const oldRewards = getRewardsByCategory(editingCategory.value);
      removeCategory(editingCategory.value);
      addCategory(categoryForm.name.trim());
      
      // 重新添加该分类下的奖励项
      oldRewards.forEach(reward => {
        addReward({
          category: categoryForm.name.trim(),
          icon: reward.icon,
          name: reward.name,
          description: reward.description,
          price: reward.price
        });
      });
      
      isEditing.value = false;
      editingCategory.value = '';
    } else {
      // 添加模式
      addCategory(categoryForm.name.trim());
    }
    
    categoryForm.name = '';
    showAddCategory.value = false;
    uni.showToast({
      title: isEditing.value ? '分类编辑成功' : '分类添加成功',
      icon: 'success'
    });
  }
}

function handleEditCategory(categoryName) {
  isEditing.value = true;
  editingCategory.value = categoryName;
  categoryForm.name = categoryName;
  showAddCategory.value = true;
}

function handleDeleteCategory(categoryName) {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除分类"${categoryName}"吗？该分类下的所有奖励也会被删除。`,
    success: (res) => {
      if (res.confirm) {
        removeCategory(categoryName);
        uni.showToast({
          title: '分类删除成功',
          icon: 'success'
        });
      }
    }
  });
}

function handleAddReward() {
  if (rewardForm.categoryIndex >= 0 && rewardForm.name.trim() && rewardForm.icon && rewardForm.price) {
    const category = categories.value[rewardForm.categoryIndex];
    const rewardObj = {
      category, // 分类
      icon: rewardForm.icon,
      name: rewardForm.name.trim(),
      description: rewardForm.description.trim(),
      price: rewardForm.price
    };
    if (isEditingReward.value) {
      removeReward(editingRewardId.value);
    }
    addReward(rewardObj);
    // 重置表单
    Object.assign(rewardForm, {
      categoryIndex: -1,
      icon: '',
      name: '',
      description: '',
      price: ''
    });
    const wasEditing = isEditingReward.value;
    isEditingReward.value = false;
    editingRewardId.value = '';
    showAddReward.value = false;
    uni.showToast({
      title: wasEditing ? '奖励编辑成功' : '奖励添加成功',
      icon: 'success'
    });
  }
}

function handleEditReward(reward) {
  isEditingReward.value = true;
  editingRewardId.value = reward.id;
  rewardForm.categoryIndex = categories.value.indexOf(reward.category);
  rewardForm.icon = reward.icon;
  rewardForm.name = reward.name;
  rewardForm.description = reward.description;
  rewardForm.price = reward.price || '';
  showAddReward.value = true;
  showRewardsList.value = false;
}

function handleDeleteReward(rewardId) {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个奖励吗？',
    success: (res) => {
      if (res.confirm) {
        removeReward(rewardId);
        uni.showToast({
          title: '奖励删除成功',
          icon: 'success'
        });
      }
    }
  });
}

function viewCategoryRewards(categoryName) {
  selectedCategory.value = categoryName;
  showRewardsList.value = true;
}

function onCategoryChange(e) {
  rewardForm.categoryIndex = e.detail.value;
}

function onSelectIcon(icon) {
  rewardForm.icon = icon;
}

function cancelEdit() {
  isEditing.value = false;
  editingCategory.value = '';
  categoryForm.name = '';
  showAddCategory.value = false;
}

function cancelRewardEdit() {
  isEditingReward.value = false;
  editingRewardId.value = '';
  Object.assign(rewardForm, {
    categoryIndex: -1,
    icon: '',
    name: '',
    description: '',
    price: ''
  });
  showAddReward.value = false;
}
</script>

<style lang="scss" scoped>
// ...原样式内容... 
</style> 