<template>
  <view class="task-list-page">
    <view class="header">
      <text class="title">{{ t('task.title') }}</text>
      <view class="header-actions">
        <button class="add-btn" @click="showAdd = true">{{ t('task.addTask') }}</button>
      </view>
    </view>
    
    <!-- 其他内容保持不变 -->
    <view class="content">
      <view class="actions">
        <button class="action-btn" @click="handleDeleteTasks" :disabled="!checkedIds.length">
          {{ t('task.deleteSelected') }}
        </button>
        <button class="action-btn" @click="handleResetTasks">{{ t('task.resetAll') }}</button>
      </view>
      
      <view class="task-list">
        <TaskItem
          v-for="task in tasks"
          :key="task.id"
          :id="task.id"
          :icon="task.icon"
          :name="task.name"
          :detail="task.detail"
          :score="task.score"
          :type="task.type"
          :checked="checkedIds.includes(task.id)"
          :completed="task.completed"
          @update:checked="(checked) => toggleCheck(task.id, checked)"
          @toggleComplete="handleToggleComplete(task.id)"
        />
        <view v-if="!tasks.length" class="empty-state">
          <text>{{ t('task.emptyTask') }}</text>
        </view>
      </view>
    </view>
    
    <!-- 添加任务弹窗 -->
    <view v-if="showAdd" class="mask" @click="showAdd = false"></view>
    <view v-if="showAdd" class="add-dialog">
      <text class="dialog-title">{{ t('task.addTask') }}</text>
      
      <view class="form-row">
        <text class="label">{{ t('task.chooseIcon') }}</text>
        <button class="choose-icon-btn" @click="showIconPicker = true">
          <image v-if="form.icon" :src="form.icon" class="icon-preview" />
          <span v-else>{{ t('task.chooseIcon') }}</span>
        </button>
      </view>
      
      <view class="form-row">
        <text class="label">{{ t('task.taskName') }}</text>
        <input v-model="form.name" :placeholder="t('task.taskName')" />
      </view>
      
      <view class="form-row">
        <text class="label">{{ t('task.taskDetail') }}</text>
        <textarea v-model="form.detail" :placeholder="t('task.taskDetail')" />
      </view>
      
      <view class="form-row">
        <text class="label">{{ t('task.taskScore') }}</text>
        <input v-model="form.score" type="number" :placeholder="t('task.taskScore')" />
      </view>
      
      <view class="form-row">
        <text class="label">{{ t('task.taskType') }}</text>
        <view class="task-type-buttons">
          <button 
            class="type-btn" 
            :class="{ active: form.type === 'permanent' }"
            @click="form.type = 'permanent'"
          >
            {{ t('task.permanent') }}
          </button>
          <button 
            class="type-btn" 
            :class="{ active: form.type === 'temporary' }"
            @click="form.type = 'temporary'"
          >
            {{ t('task.temporary') }}
          </button>
        </view>      
      </view>
      <text class="type-tip">{{ t('task.temporaryTip') }}</text>
      
      <view class="dialog-actions">
        <button class="cancel" @click="showAdd = false">{{ t('common.cancel') }}</button>
        <button class="confirm" :disabled="!form.name || !form.icon" @click="handleAddTask">
          {{ t('common.confirm') }}
        </button>
      </view>
    </view>
    
    <IconPickerDialog v-model="showIconPicker" :iconCategoryList="iconCategoryList" @select="onSelectIcon" />
  </view>
</template>

<script setup lang="js">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useTaskList } from '@/composables/useTaskList.js';
import { useScore } from '@/composables/useScore.js';
import TaskItem from '@/components/TaskItem.vue';
import IconPickerDialog from '@/components/IconPickerDialog.vue';
import { useI18n } from '@/composables/useI18n.js';
import { forceUpdateTabBar } from '@/utils/tabBarI18n.js';

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

// 初始化积分管理
const { score, addScore, subtractScore } = useScore();

// 初始化任务列表，传入积分管理器
const { tasks, addTask, removeTasks, toggleTaskComplete, resetAllTasks } = useTaskList({ addScore, subtractScore });

const checkedIds = ref([]);
const showAdd = ref(false);
const showIconPicker = ref(false);
const form = reactive({
  icon: '',
  name: '',
  detail: '',
  score: 1,
  type: 'permanent' // 默认为长期任务
});

// 监听语言变化事件
let localeChangeHandler = null;

onMounted(() => {
  // 监听语言变化事件
  localeChangeHandler = (locale) => {
    console.log('任务列表页面收到语言变化事件:', locale);
    // 延迟更新tabBar，确保语言切换完成
    setTimeout(() => {
      forceUpdateTabBar();
    }, 100);
    // 更新页面标题
    setTimeout(() => {
      uni.setNavigationBarTitle({
        title: t('task.title')
      });
    }, 150);
  };
  
  uni.$on('localeChanged', localeChangeHandler);
  
  // 设置页面标题
  uni.setNavigationBarTitle({
    title: t('task.title')
  });
});

onUnmounted(() => {
  // 清理事件监听
  if (localeChangeHandler) {
    uni.$off('localeChanged', localeChangeHandler);
  }
});

function toggleCheck(id, checked) {
  // 将id转换为数字类型进行比较，因为任务ID在数据中是数字类型
  const taskId = typeof id === 'string' ? parseInt(id) : id;
  if (checked) {
    if (!checkedIds.value.includes(taskId)) checkedIds.value.push(taskId);
  } else {
    checkedIds.value = checkedIds.value.filter(i => i !== taskId);
  }
}

function handleAddTask() {
  addTask({
    id: Date.now(),
    icon: form.icon,
    name: form.name,
    detail: form.detail,
    score: form.score,
    type: form.type
  });
  showAdd.value = false;
  Object.assign(form, { icon: '', name: '', detail: '', score: 1, type: 'permanent' });
}

function handleDeleteTasks() {
  removeTasks(checkedIds.value);
  checkedIds.value = [];
}

function onSelectIcon(icon) {
  form.icon = icon;
}

function handleToggleComplete(taskId) {
  toggleTaskComplete(taskId);
}

function handleResetTasks() {
  uni.showModal({
    title: t('task.confirmReset'),
    content: t('task.resetConfirmText'),
    success: (res) => {
      if (res.confirm) {
        resetAllTasks();
        uni.showToast({
          title: t('task.taskReset'),
          icon: 'success'
        });
      }
    }
  });
}

</script>

<style lang="scss" scoped>
.task-list-page {
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
    
    .header-actions {
      display: flex;
      gap: 16rpx;
      
      .add-btn {
        background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
        color: #fff;
        border: none;
        border-radius: 20rpx;
        padding: 12rpx 24rpx;
        font-size: 28rpx;
      }
      
      .test-tabbar-btn {
        background: #ff6b35;
        color: #fff;
        border: none;
        border-radius: 20rpx;
        padding: 12rpx 24rpx;
        font-size: 28rpx;
      }
    }
  }
  
  .content {
    padding: 24rpx;
    
    .actions {
      display: flex;
      gap: 16rpx;
      margin-bottom: 24rpx;
      
      .action-btn {
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
    
    .task-list {
      .empty-state {
        text-align: center;
        color: #bbb;
        font-size: 32rpx;
        margin-top: 120rpx;
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
      
      input, textarea {
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
      
      .task-type-buttons {
        display: flex;
        gap: 16rpx;
        flex: 1;
        
        .type-btn {
          flex: 1;
          padding: 12rpx 16rpx;
          border: 2rpx solid #e0e0e0;
          border-radius: 16rpx;
          background: #fff;
          color: #666;
          font-size: 24rpx;
          transition: all 0.3s ease;
          
          &.active {
            background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
            color: #fff;
            border-color: transparent;
          }
        }
      }
      
     
    }
    .type-tip {
        font-size: 20rpx;
        color: #999;
        margin-top: 8rpx;
        display: block;
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
}
</style> 