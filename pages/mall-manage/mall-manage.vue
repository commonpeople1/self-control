<template>
  <view class="mall-manage-page">
    <view class="header">
      <view class="header-top">
        <text class="title">{{ t('mall.title') }}</text>
        <view class="score-display">
          <text class="score-label">{{ t('score.scoreLabel') }}</text>
          <text class="score-value">{{ score }}</text>
        </view>
      </view>
      <view class="actions">
        <button class="add-category-btn" @click="showAddCategory = true">{{ t('mall.addCategory') }}</button>
        <button class="add-reward-btn" @click="showAddReward = true" :disabled="!categories.length">{{ t('mall.addReward') }}</button>
      </view>
    </view>
    <view class="content">
      <view class="category-list">
        <view 
          v-for="category in categories" 
          :key="category"
          class="category-item"
        >
          <view class="category-info">
            <text class="category-name">{{ category }}</text>
            <text class="reward-count">{{ getRewardsByCategory(category).length }} {{ t('mall.rewardCount') }}</text>
          </view>
          <view class="category-actions">
            <button class="view-rewards-btn" @click="viewCategoryRewards(category)">{{ t('mall.rewardList') }}</button>
            <button class="edit-btn" @click="handleEditCategory(category)">{{ t('mall.editCategory') }}</button>
            <button class="delete-btn" @click="handleDeleteCategory(category)">{{ t('mall.deleteCategory') }}</button>
          </view>
        </view>
        <view v-if="!categories.length" class="empty-category">
          <text class="empty-text">{{ t('mall.noCategoryYet') }}</text>
          <text class="empty-desc">{{ t('mall.clickToAddCategory') }}</text>
        </view>
      </view>
    </view>
    <!-- 添加分类弹窗 -->
    <view v-if="showAddCategory" class="mask" @click="showAddCategory = false"></view>
    <view v-if="showAddCategory" class="add-dialog">
      <text class="dialog-title">{{ isEditing ? t('mall.editCategory') : t('mall.addCategory') }}</text>
      <view class="form-row">
        <text class="label">{{ t('mall.categoryName') }}</text>
        <input v-model="categoryForm.name" :placeholder="t('mall.pleaseEnterCategoryName')" />
      </view>
      <view class="form-row">
        <text class="label">{{ t('mall.chooseIcon') }}</text>
        <button class="choose-icon-btn" @click="showIconPicker = true">
          <image v-if="categoryForm.icon" :src="categoryForm.icon" class="icon-preview" />
          <span v-else>{{ t('mall.chooseIcon') }}</span>
        </button>
      </view>
      <view class="dialog-actions">
        <button class="cancel" @click="cancelEdit">{{ t('common.cancel') }}</button>
        <button class="confirm" :disabled="!categoryForm.name" @click="handleAddCategory">{{ t('common.confirm') }}</button>
      </view>
    </view>
    <!-- 添加奖励弹窗 -->
    <view v-if="showAddReward" class="mask" @click="showAddReward = false"></view>
    <view v-if="showAddReward" class="add-dialog">
      <text class="dialog-title">{{ isEditingReward ? t('mall.editReward') : t('mall.addReward') }}</text>
      <view class="form-row">
        <text class="label">{{ t('mall.categoryName') }}</text>
        <picker :value="rewardForm.categoryIndex" :range="categories" @change="onCategoryChange">
          <view class="picker">
            {{ rewardForm.categoryIndex >= 0 ? categories[rewardForm.categoryIndex] : t('mall.pleaseSelectCategory') }}
          </view>
        </picker>
      </view>
      <view class="form-row">
        <text class="label">{{ t('mall.chooseIcon') }}</text>
        <button class="choose-icon-btn" @click="showIconPicker = true">
          <image v-if="rewardForm.icon" :src="rewardForm.icon" class="icon-preview" />
          <span v-else>{{ t('mall.chooseIcon') }}</span>
        </button>
      </view>
      <view class="form-row">
        <text class="label">{{ t('mall.rewardName') }}</text>
        <input v-model="rewardForm.name" :placeholder="t('mall.pleaseEnterRewardName')" />
      </view>
      <view class="form-row">
        <text class="label">{{ t('mall.rewardDescription') }}</text>
        <textarea v-model="rewardForm.description" :placeholder="t('mall.pleaseEnterRewardDescription')" />
      </view>
      <view class="form-row">
        <text class="label">{{ t('mall.rewardPrice') }}</text>
        <input v-model="rewardForm.price" type="number" :placeholder="t('mall.pleaseEnterRewardPrice')" />
      </view>
      <view class="dialog-actions">
        <button class="cancel" @click="cancelRewardEdit">{{ t('common.cancel') }}</button>
        <button class="confirm" :disabled="!rewardForm.name || !rewardForm.icon || rewardForm.categoryIndex < 0 || !rewardForm.price" @click="handleAddReward">{{ t('common.confirm') }}</button>
      </view>
    </view>
    <!-- 查看分类奖励弹窗 -->
    <view v-if="showRewardsList" class="mask" @click="showRewardsList = false"></view>
    <view v-if="showRewardsList" class="rewards-dialog">
      <view class="dialog-header">
        <text class="dialog-title">{{ selectedCategory }} - {{ t('mall.rewardList') }}</text>
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
              <text class="reward-price">{{ reward.price }} {{ t('score.score') }}</text>
            </view>
          </view>
          <view class="reward-actions">
            <button class="edit-reward-btn" @click="handleEditReward(reward)">{{ t('mall.editReward') }}</button>
            <button class="delete-reward-btn" @click="handleDeleteReward(reward.id)">{{ t('mall.deleteReward') }}</button>
          </view>
        </view>
        <view v-if="!currentCategoryRewards.length" class="empty-rewards">
          <text>{{ t('mall.emptyRewards') }}</text>
        </view>
      </scroll-view>
    </view>
    <IconPickerDialog v-model="showIconPicker" :iconCategoryList="iconCategoryList" @select="onSelectIcon" />
  </view>
</template>

<script setup lang="js">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRewards } from '@/composables/useRewards.js';
import { useScore } from '@/composables/useScore.js';
import IconPickerDialog from '@/components/IconPickerDialog.vue';
import { useI18n } from '@/composables/useI18n.js';

const { t } = useI18n();

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

const categoryForm = reactive({ name: '', icon: '' });
const rewardForm = reactive({ categoryIndex: -1, icon: '', name: '', description: '', price: '' });

const currentCategoryRewards = computed(() => {
  if (!selectedCategory.value) return [];
  return getRewardsByCategory(selectedCategory.value);
});

onMounted(() => {
  // 设置页面标题
  uni.setNavigationBarTitle({
    title: t('mallManage.title')
  });
  
  // 监听语言变化事件
  uni.$on('localeChanged', (locale) => {
    console.log('商城管理页面收到语言变化事件:', locale);
    // 更新页面标题
    setTimeout(() => {
      uni.setNavigationBarTitle({
        title: t('mallManage.title')
      });
    }, 150);
  });
});

function handleAddCategory() {
  if (categoryForm.name.trim()) {
    if (isEditing.value) {
      const oldRewards = getRewardsByCategory(editingCategory.value);
      removeCategory(editingCategory.value);
      addCategory(categoryForm.name.trim());
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
      addCategory(categoryForm.name.trim());
    }
    categoryForm.name = '';
    categoryForm.icon = '';
    showAddCategory.value = false;
    uni.showToast({ title: isEditing.value ? t('mall.categoryEdited') : t('mall.categoryAdded'), icon: 'success' });
  }
}
function handleEditCategory(categoryName) {
  isEditing.value = true;
  editingCategory.value = categoryName;
  categoryForm.name = categoryName;
  showAddCategory.value = true;
}
function handleDeleteCategory(categoryId) {
  uni.showModal({
    title: t('common.confirm'),
    content: t('mall.confirmDeleteCategory', { name: categoryId }),
    success: (res) => {
      if (res.confirm) {
        removeCategory(categoryId);
        uni.showToast({ title: t('mall.categoryDeleted'), icon: 'success' });
      }
    }
  });
}
function cancelEdit() {
  isEditing.value = false;
  editingCategory.value = '';
  categoryForm.name = '';
  categoryForm.icon = '';
  showAddCategory.value = false;
}
function viewCategoryRewards(categoryName) {
  selectedCategory.value = categoryName;
  showRewardsList.value = true;
}
function handleAddReward() {
  if (rewardForm.categoryIndex >= 0 && rewardForm.name.trim() && rewardForm.icon && rewardForm.price) {
    const category = categories.value[rewardForm.categoryIndex];
    const rewardObj = {
      category: category,
      icon: rewardForm.icon,
      name: rewardForm.name.trim(),
      description: rewardForm.description.trim(),
      price: rewardForm.price
    };
    if (isEditingReward.value) {
      removeReward(editingRewardId.value);
    }
    addReward(rewardObj);
    Object.assign(rewardForm, { categoryIndex: -1, icon: '', name: '', description: '', price: '' });
    const wasEditing = isEditingReward.value;
    isEditingReward.value = false;
    editingRewardId.value = '';
    showAddReward.value = false;
    uni.showToast({ title: wasEditing ? t('mall.rewardEdited') : t('mall.rewardAdded'), icon: 'success' });
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
    title: t('common.confirm'),
    content: t('mall.confirmDeleteReward'),
    success: (res) => {
      if (res.confirm) {
        removeReward(rewardId);
        uni.showToast({ title: t('mall.rewardDeleted'), icon: 'success' });
      }
    }
  });
}
function cancelRewardEdit() {
  isEditingReward.value = false;
  editingRewardId.value = '';
  Object.assign(rewardForm, { categoryIndex: -1, icon: '', name: '', description: '', price: '' });
  showAddReward.value = false;
}
function onCategoryChange(e) {
  rewardForm.categoryIndex = e.detail.value;
}
function onSelectIcon(icon) {
  if (showAddCategory.value) {
    categoryForm.icon = icon;
  } else if (showAddReward.value) {
    rewardForm.icon = icon;
  }
}
</script>

<style lang="scss" scoped>
.mall-manage-page {
  min-height: 100vh;
  background: #f7f8fa;
  .header {
    padding: 32rpx 24rpx 24rpx 24rpx;
    background: #fff;
    border-bottom: 2rpx solid #f0f0f0;
    .header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24rpx;
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
    .actions {
      display: flex;
      gap: 16rpx;
      .add-category-btn, .add-reward-btn {
        background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
        color: #fff;
        border: none;
        border-radius: 20rpx;
        padding: 12rpx 24rpx;
        font-size: 28rpx;
        &:disabled {
          background: #eee;
          color: #ccc;
        }
      }
    }
  }
  .content {
    padding: 24rpx;
    .category-list {
      .category-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fff;
        border-radius: 16rpx;
        padding: 32rpx 24rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
        .category-info {
          flex: 1;
          .category-name {
            font-size: 32rpx;
            font-weight: 600;
            color: #222;
            margin-bottom: 8rpx;
            display: block;
          }
          .reward-count {
            font-size: 24rpx;
            color: #888;
            display: block;
          }
        }
        .category-actions {
          display: flex;
          gap: 16rpx;
          .view-rewards-btn, .edit-btn, .delete-btn {
            padding: 8rpx 16rpx;
            border-radius: 16rpx;
            font-size: 24rpx;
            border: none;
          }
          .view-rewards-btn {
            background: #e8f5e8;
            color: #4caf50;
          }
          .edit-btn {
            background: #e3f2fd;
            color: #007aff;
          }
          .delete-btn {
            background: #fff0f0;
            color: #f44336;
          }
        }
      }
      .empty-category {
        text-align: center;
        padding: 80rpx 24rpx;
        .empty-text {
          font-size: 32rpx;
          color: #bbb;
          margin-bottom: 16rpx;
          display: block;
        }
        .empty-desc {
          font-size: 24rpx;
          color: #ccc;
          display: block;
        }
      }
    }
  }
  .mask {
    position: fixed;
    left: 0; top: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.3);
    z-index: 1000;
  }
  .add-dialog {
    position: fixed;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 600rpx;
    background: #fff;
    border-radius: 24rpx;
    padding: 40rpx 32rpx 32rpx 32rpx;
    z-index: 1001;
    box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.18);
    .dialog-title {
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 32rpx;
      color: #222;
      text-align: center;
    }
    .form-row {
      display: flex;
      align-items: center;
      margin-bottom: 28rpx;
      .label {
        width: 100rpx;
        color: #666;
        font-size: 28rpx;
        margin-right: 16rpx;
      }
      input, textarea, .picker {
        flex: 1;
        border: none;
        border-bottom: 2rpx solid #eee;
        font-size: 28rpx;
        padding: 12rpx 0;
        background: transparent;
        outline: none;
      }
      textarea {
        min-height: 80rpx;
        resize: none;
      }
      .picker {
        color: #222;
      }
      .choose-icon-btn {
        display: flex;
        align-items: center;
        border: none;
        background: linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%);
        border-radius: 16rpx;
        padding: 0 32rpx;
        height: 64rpx;
        font-size: 28rpx;
        color: #007aff;
        box-shadow: 0 2rpx 8rpx rgba(0,122,255,0.08);
        .icon-preview {
          width: 48rpx;
          height: 48rpx;
          margin-right: 12rpx;
          border-radius: 8rpx;
          background: #fff;
          border: 2rpx solid #e0eafc;
        }
      }
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 24rpx;
      margin-top: 24rpx;
      .cancel, .confirm {
        padding: 0 36rpx;
        height: 56rpx;
        border-radius: 28rpx;
        font-size: 28rpx;
        border: none;
        outline: none;
      }
      .cancel {
        background: #f5f5f5;
        color: #888;
      }
      .confirm {
        background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
        color: #fff;
        &:disabled {
          background: #eee;
          color: #ccc;
        }
      }
    }
  }
  .rewards-dialog {
    position: fixed;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 700rpx;
    max-height: 80vh;
    background: #fff;
    border-radius: 24rpx;
    z-index: 1001;
    box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.18);
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 32rpx;
      border-bottom: 2rpx solid #f0f0f0;
      .dialog-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #222;
      }
      .close-btn {
        background: none;
        border: none;
        font-size: 40rpx;
        color: #999;
        padding: 0;
        width: 40rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .rewards-list {
      max-height: 60vh;
      padding: 24rpx;
      .reward-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24rpx;
        border-bottom: 1rpx solid #f0f0f0;
        .reward-info {
          display: flex;
          align-items: center;
          flex: 1;
          .reward-icon {
            width: 80rpx;
            height: 80rpx;
            border-radius: 16rpx;
            margin-right: 20rpx;
            background: #f5f5f5;
          }
          .reward-details {
            flex: 1;
            .reward-name {
              font-size: 28rpx;
              font-weight: 600;
              color: #222;
              margin-bottom: 8rpx;
              display: block;
            }
            .reward-desc {
              font-size: 24rpx;
              color: #888;
              display: block;
              margin-bottom: 8rpx;
            }
            .reward-price {
              font-size: 26rpx;
              color: #ff6b35;
              font-weight: 600;
              display: block;
            }
          }
        }
        .reward-actions {
          display: flex;
          gap: 12rpx;
          .edit-reward-btn, .delete-reward-btn {
            padding: 8rpx 16rpx;
            border-radius: 16rpx;
            font-size: 24rpx;
            border: none;
          }
          .edit-reward-btn {
            background: #e3f2fd;
            color: #007aff;
          }
          .delete-reward-btn {
            background: #fff0f0;
            color: #f44336;
          }
        }
      }
      .empty-rewards {
        text-align: center;
        color: #bbb;
        font-size: 28rpx;
        padding: 80rpx 24rpx;
      }
    }
  }
}
</style> 