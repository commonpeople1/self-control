<template>
  <view class="task-list-page">
    <view class="header">
      <view class="header-top">
        <text class="title">任务列表</text>
        <view class="score-display">
          <text class="score-label">积分:</text>
          <text class="score-value">{{ score }}</text>
        </view>
      </view>
      <view class="actions">
        <button class="add-btn" @click="showAdd = true">添加任务</button>
        <button class="reset-btn" @click="handleResetTasks">重置任务</button>
        <button class="delete-btn" :disabled="!checkedIds.length" @click="handleDeleteTasks">删除</button>
      </view>
    </view>
    <view class="list">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :id="task.id"
        :icon="task.icon"
        :name="task.name"
        :detail="task.detail"
        :score="task.score"
        :checked="checkedIds.includes(task.id)"
        :completed="task.completed"
        @update:checked="val => toggleCheck(task.id, val)"
        @toggleComplete="handleToggleComplete(task.id)"
      />
      <view v-if="!tasks.length" class="empty">暂无任务，请添加</view>
    </view>
    <!-- 自定义弹窗和遮罩 -->
    <view v-if="showAdd" class="mask" @click="showAdd = false"></view>
    <view v-if="showAdd" class="add-dialog">
      <text class="dialog-title">新建任务</text>
      <view class="form-row">
        <text class="label">图标</text>
        <button class="choose-icon-btn" @click="showIconPicker = true">
          <image v-if="form.icon" :src="form.icon" class="icon-preview" />
          <span v-else>选择图标</span>
        </button>
      </view>
      <view class="form-row">
        <text class="label">名称</text>
        <input v-model="form.name" placeholder="请输入任务名称" />
      </view>
      <view class="form-row">
        <text class="label">详情</text>
        <input v-model="form.detail" placeholder="请输入任务详情" />
      </view>
      <view class="form-row">
        <text class="label">得分</text>
        <input v-model.number="form.score" type="number" placeholder="请输入得分" />
      </view>
      <view class="dialog-actions">
        <button class="cancel" @click="showAdd = false">取消</button>
        <button class="confirm" :disabled="!form.name || !form.icon" @click="handleAddTask">确定</button>
      </view>
    </view>
    <IconPickerDialog v-model="showIconPicker" :iconCategoryList="iconCategoryList" @select="onSelectIcon" />
  </view>
</template>

<script setup lang="js">
import { ref, reactive } from 'vue';
import { useTaskList } from '@/composables/useTaskList.js';
import { useScore } from '@/composables/useScore.js';
import TaskItem from '@/components/TaskItem.vue';
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
  score: 1
});

function toggleCheck(id, checked) {
  if (checked) {
    if (!checkedIds.value.includes(id)) checkedIds.value.push(id);
  } else {
    checkedIds.value = checkedIds.value.filter(i => i !== id);
  }
}

function handleAddTask() {
  addTask({
    id: Date.now(),
    icon: form.icon,
    name: form.name,
    detail: form.detail,
    score: form.score,
  });
  showAdd.value = false;
  Object.assign(form, { icon: '', name: '', detail: '', score: 1 });
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
    title: '确认重置',
    content: '确定要重置所有任务状态吗？此操作不会影响积分。',
    success: (res) => {
      if (res.confirm) {
        resetAllTasks();
        uni.showToast({
          title: '任务已重置',
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
    padding: 32rpx 24rpx 0 24rpx;
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
      gap: 20rpx;
      .add-btn, .delete-btn, .reset-btn {
        padding: 0 32rpx;
        height: 64rpx;
        border-radius: 32rpx;
        font-size: 28rpx;
        border: none;
        outline: none;
      }
      .add-btn {
        background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
        color: #fff;
      }
      .reset-btn {
        background: #fff3e0;
        color: #ff9800;
        border: 2rpx solid #ff9800;
      }
      .delete-btn {
        background: #fff0f0;
        color: #f44336;
        border: 2rpx solid #f44336;
        &:disabled {
          color: #ccc;
          border-color: #eee;
          background: #fafafa;
        }
      }
    }
  }
  .list {
    padding: 32rpx 24rpx 0 24rpx;
    .empty {
      text-align: center;
      color: #bbb;
      font-size: 32rpx;
      margin-top: 80rpx;
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
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
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
    input {
      flex: 1;
      border: none;
      border-bottom: 2rpx solid #eee;
      font-size: 28rpx;
      padding: 12rpx 0;
      background: transparent;
      outline: none;
    }
  }
  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 24rpx;
    margin-top: 24rpx;
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
    .confirm {
      background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
      color: #fff;
      border: none;
      border-radius: 28rpx;
      padding: 0 36rpx;
      height: 56rpx;
      font-size: 28rpx;
      box-shadow: 0 2rpx 8rpx rgba(0,122,255,0.08);
      transition: background 0.2s;
      &:disabled {
        background: #eee;
        color: #ccc;
      }
      &:active {
        background: linear-gradient(90deg, #00f2fe 0%, #4facfe 100%);
      }
    }
  }
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
  cursor: pointer;
  transition: background 0.2s;
  .icon-preview {
    width: 48rpx;
    height: 48rpx;
    margin-right: 12rpx;
    border-radius: 8rpx;
    background: #fff;
    border: 2rpx solid #e0eafc;
  }
  &:active {
    background: linear-gradient(90deg, #cfdef3 0%, #e0eafc 100%);
  }
}
</style> 