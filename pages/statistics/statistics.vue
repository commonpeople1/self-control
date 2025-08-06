<template>
  <view class="statistics-page">
    <view class="header">
      <text class="title">{{ t('statistics.title') }}</text>
    </view>
    
    <!-- 统计卡片 -->
    <view class="stats-cards">
      <view class="stat-card">
        <view class="stat-icon">📊</view>
        <view class="stat-content">
          <text class="stat-value">{{ currentSummary.totalScore }}</text>
          <text class="stat-label">{{ currentSummary.scoreLabel }}</text>
        </view>
      </view>
      <view class="stat-card">
        <view class="stat-icon">✅</view>
        <view class="stat-content">
          <text class="stat-value">{{ currentSummary.totalTasks }}</text>
          <text class="stat-label">{{ currentSummary.taskLabel }}</text>
        </view>
      </view>
      <view class="stat-card">
        <view class="stat-icon">📈</view>
        <view class="stat-content">
          <text class="stat-value">{{ currentSummary.averageScore }}</text>
          <text class="stat-label">{{ currentSummary.averageLabel }}</text>
        </view>
      </view>
      <view class="stat-card">
        <view class="stat-icon">🎯</view>
        <view class="stat-content">
          <text class="stat-value">{{ currentSummary.completionRate }}%</text>
          <text class="stat-label">{{ currentSummary.rateLabel }}</text>
        </view>
      </view>
    </view>
    
    <!-- 图表切换 -->
    <view class="chart-tabs">
      <view 
        v-for="tab in chartTabs" 
        :key="tab.key"
        class="tab-item"
        :class="{ active: currentTab === tab.key }"
        @click="currentTab = tab.key"
      >
        <text>{{ tab.name }}</text>
      </view>
    </view>
    
    <!-- 图表区域 -->
    <view class="chart-container">
      <!-- 本周汇总 -->
      <view v-if="currentTab === 'week'" class="chart-section">
        <view class="section-header">
          <text class="section-title">{{ t('statistics.weeklySummary') }}</text>
          <text class="section-subtitle">{{ t('statistics.averageDailyScore') }}: {{ weeklySummary.averageScore }} | {{ t('statistics.averageDailyTasks') }}: {{ weeklySummary.averageTasks }}</text>
        </view>
        
        <!-- 本周数据表格 -->
        <view class="week-table">
          <view class="table-header">
            <text class="header-cell">{{ t('statistics.date') }}</text>
            <text class="header-cell">{{ t('statistics.score') }}</text>
            <text class="header-cell">{{ t('statistics.completedTotal') }}</text>
            <text class="header-cell">{{ t('statistics.status') }}</text>
          </view>
          <view 
            v-for="day in weeklySummary.weekData" 
            :key="day.date"
            class="table-row"
            :class="{ 'completed': day.completed }"
          >
            <text class="table-cell">{{ day.dayName }}</text>
            <text class="table-cell score">{{ day.score }}</text>
            <text class="table-cell tasks">{{ day.completedTaskCount }}/{{ day.taskCount }}</text>
            <text class="table-cell status">
              <text v-if="day.completed" class="status-completed">✅</text>
              <text v-else class="status-empty">{{ t('statistics.empty') }}</text>
            </text>
          </view>
        </view>
        
        <!-- 本周汇总卡片 -->
        <view class="summary-cards">
          <view class="summary-card">
            <text class="card-title">{{ t('statistics.totalScore') }}</text>
            <text class="card-value">{{ weeklySummary.totalScore }}</text>
          </view>
          <view class="summary-card">
            <text class="card-title">{{ t('statistics.totalTasks') }}</text>
            <text class="card-value">{{ weeklySummary.totalTasks }}</text>
          </view>
          <view class="summary-card">
            <text class="card-title">{{ t('statistics.averageScore') }}</text>
            <text class="card-value">{{ weeklySummary.averageScore }}</text>
          </view>
          <view class="summary-card">
            <text class="card-title">{{ t('statistics.averageTasks') }}</text>
            <text class="card-value">{{ weeklySummary.averageTasks }}</text>
          </view>
        </view>
      </view>
      
      <!-- 本月汇总 -->
      <view v-if="currentTab === 'month'" class="chart-section">
        <view class="section-header">
          <text class="section-title">{{ t('statistics.monthlySummary') }}</text>
          <text class="section-subtitle">{{ t('statistics.totalScore') }}: {{ monthlySummary.totalScore }} | {{ t('statistics.totalTasks') }}: {{ monthlySummary.totalTasks }} | {{ t('statistics.completedDays') }}: {{ monthlySummary.daysCompleted }}</text>
        </view>
        
        <!-- 本月日历视图 -->
        <view class="month-calendar">
          <view class="calendar-header">
            <text v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day" class="calendar-day-header">{{ day }}</text>
          </view>
          <view class="calendar-grid">
            <view 
              v-for="day in monthlySummary.monthData" 
              :key="day.date"
              class="calendar-day"
              :class="{ 
                'completed': day.completed,
                'has-data': day.score > 0 || day.taskCount > 0
              }"
            >
              <text class="day-number">{{ day.day }}</text>
              <view v-if="day.score > 0 || day.taskCount > 0" class="day-stats">
                <text class="day-score">{{ day.score }}</text>
                <text class="day-tasks">{{ day.taskCount }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 近21天 -->
      <view v-if="currentTab === 'recent21'" class="chart-section">
        <view class="section-header">
          <text class="section-title">{{ t('statistics.recent21Days') }}</text>
          <text class="section-subtitle">{{ t('statistics.totalScore') }}: {{ recent21Days.totalScore }} | {{ t('statistics.totalTasks') }}: {{ recent21Days.totalTasks }} | {{ t('statistics.completedDays') }}: {{ recent21Days.completedDays }}/21</text>
        </view>
        
        <!-- 21天进度条 -->
        <view class="progress-section">
          <view class="progress-header">
            <text class="progress-title">{{ t('statistics.progressTitle') }}: {{ recent21Days.completionRate }}%</text>
            <text class="progress-subtitle">{{ recent21Days.completedDays }}/21 {{ t('statistics.progressSubtitle') }}</text>
          </view>
          <view class="progress-bar">
            <view 
              class="progress-fill" 
              :style="{ width: recent21Days.completionRate + '%' }"
            ></view>
          </view>
        </view>
        
        <!-- 21天详细数据 -->
        <view class="recent21-list">
          <view 
            v-for="(day, index) in recent21Days.recentData" 
            :key="day.date"
            class="day-item"
            :class="{ 'completed': day.completed }"
          >
            <view class="day-info">
              <text class="day-date">{{ day.dayName }}</text>
              <text class="day-number">{{ t('statistics.dayNumber', { day: day.dayNumber }) }}</text>
            </view>
            <view class="day-stats">
              <text class="day-score">{{ day.score }}{{ t('statistics.scoreUnit') }}</text>
              <text class="day-tasks">{{ day.completedTaskCount }}/{{ day.taskCount }}{{ t('statistics.taskUnit') }}</text>
              <text v-if="day.dailyCompletionRate > 0" class="day-rate">{{ day.dailyCompletionRate }}{{ t('statistics.rateUnit') }}</text>
            </view>
            <view class="day-status">
              <text v-if="day.completed" class="status-icon">✅</text>
              <text v-else class="status-icon empty">{{ t('statistics.empty') }}</text>
            </view>
          </view>
        </view>
        
        <!-- 21天汇总卡片 -->
        <view class="summary-cards">
          <view class="summary-card">
            <text class="card-title">{{ t('statistics.totalScore') }}</text>
            <text class="card-value">{{ recent21Days.totalScore }}</text>
          </view>
          <view class="summary-card">
            <text class="card-title">{{ t('statistics.totalTasks') }}</text>
            <text class="card-value">{{ recent21Days.totalTasks }}</text>
          </view>
          <view class="summary-card">
            <text class="card-title">{{ t('statistics.completedDays') }}</text>
            <text class="card-value">{{ recent21Days.completedDays }}/21</text>
          </view>
          <view class="summary-card">
            <text class="card-title">{{ t('statistics.completionRate') }}</text>
            <text class="card-value">{{ recent21Days.completionRate }}%</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="js">
import { ref, onMounted, computed } from 'vue';
import { useStatistics } from '@/composables/useStatistics.js';
import { useI18n } from '@/composables/useI18n.js';

const { t } = useI18n();

const { getWeeklySummary, getMonthlySummary, getRecent21Days } = useStatistics();

// 当前选中的图表类型
const currentTab = ref('week');

// 图表标签页
const chartTabs = computed(() => [
  { key: 'week', name: t('statistics.weeklySummary') },
  { key: 'month', name: t('statistics.monthlySummary') },
  { key: 'recent21', name: t('statistics.recent21Days') }
]);

// 统计数据
const weeklySummary = ref({
  weekData: [],
  totalScore: 0,
  totalTasks: 0,
  averageScore: 0,
  averageTasks: 0
});

const monthlySummary = ref({
  monthData: [],
  totalScore: 0,
  totalTasks: 0,
  averageScore: 0,
  averageTasks: 0,
  daysCompleted: 0
});

const recent21Days = ref({
  recentData: [],
  totalScore: 0,
  totalTasks: 0,
  averageScore: 0,
  averageTasks: 0,
  completedDays: 0,
  completionRate: 0
});

// 计算当前显示的汇总数据
const currentSummary = computed(() => {
  switch (currentTab.value) {
    case 'week':
      // 计算本周每天完成率的平均值
      const weekDailyRates = weeklySummary.value.weekData
        .filter(day => day.taskCount > 0) // 只考虑有任务的日期
        .map(day => (day.completedTaskCount / day.taskCount) * 100);
      const weekCompletionRate = weekDailyRates.length > 0 
        ? Math.round(weekDailyRates.reduce((sum, rate) => sum + rate, 0) / weekDailyRates.length)
        : 0;
      
      return {
        totalScore: weeklySummary.value.totalScore,
        totalTasks: weeklySummary.value.totalTasks,
        averageScore: weeklySummary.value.averageScore,
        completionRate: weekCompletionRate,
        scoreLabel: t('statistics.weeklyScore'),
        taskLabel: t('statistics.weeklyTasks'),
        averageLabel: t('statistics.averageScore'),
        rateLabel: t('statistics.completionRate')
      };
    case 'month':
      // 计算本月每天完成率的平均值
      const monthDailyRates = monthlySummary.value.monthData
        .filter(day => day.taskCount > 0) // 只考虑有任务的日期
        .map(day => (day.completedTaskCount / day.taskCount) * 100);
      const monthCompletionRate = monthDailyRates.length > 0 
        ? Math.round(monthDailyRates.reduce((sum, rate) => sum + rate, 0) / monthDailyRates.length)
        : 0;
      
      return {
        totalScore: monthlySummary.value.totalScore,
        totalTasks: monthlySummary.value.totalTasks,
        averageScore: monthlySummary.value.averageScore,
        completionRate: monthCompletionRate,
        scoreLabel: t('statistics.monthlyScore'),
        taskLabel: t('statistics.monthlyTasks'),
        averageLabel: t('statistics.averageScore'),
        rateLabel: t('statistics.completionRate')
      };
    case 'recent21':
      return {
        totalScore: recent21Days.value.totalScore,
        totalTasks: recent21Days.value.totalTasks,
        averageScore: recent21Days.value.averageScore,
        completionRate: recent21Days.value.completionRate,
        scoreLabel: t('statistics.days21Score'),
        taskLabel: t('statistics.days21Tasks'),
        averageLabel: t('statistics.averageScore'),
        rateLabel: t('statistics.completionRate')
      };
    default:
      return {
        totalScore: 0,
        totalTasks: 0,
        averageScore: 0,
        completionRate: 0,
        scoreLabel: t('score.score'),
        taskLabel: t('statistics.totalTasks'),
        averageLabel: t('statistics.averageScore'),
        rateLabel: t('statistics.completionRate')
      };
  }
});

// 加载统计数据
function loadStatistics() {
  console.log('重新加载统计数据');
  weeklySummary.value = getWeeklySummary();
  monthlySummary.value = getMonthlySummary();
  recent21Days.value = getRecent21Days();
}

// 监听页面显示，刷新数据
function onPageShow() {
  loadStatistics();
}

onMounted(() => {
  loadStatistics();
});

// 暴露刷新方法给父组件
defineExpose({
  refresh: loadStatistics
});
</script>

<style lang="scss" scoped>
.statistics-page {
  min-height: 100vh;
  background: #f7f8fa;
  
  .header {
    padding: 32rpx 24rpx 24rpx 24rpx;
    background: #fff;
    border-bottom: 2rpx solid #f0f0f0;
    
    .title {
      font-size: 44rpx;
      font-weight: bold;
      color: #222;
    }
  }
  
  .stats-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20rpx;
    padding: 24rpx;
    
    .stat-card {
      background: #fff;
      border-radius: 16rpx;
      padding: 32rpx 24rpx;
      box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
      display: flex;
      align-items: center;
      
      .stat-icon {
        font-size: 48rpx;
        margin-right: 20rpx;
      }
      
      .stat-content {
        flex: 1;
        
        .stat-value {
          font-size: 36rpx;
          font-weight: bold;
          color: #222;
          display: block;
          margin-bottom: 8rpx;
        }
        
        .stat-label {
          font-size: 24rpx;
          color: #888;
          display: block;
        }
      }
    }
  }
  
  .chart-tabs {
    display: flex;
    background: #fff;
    margin: 0 24rpx 24rpx 24rpx;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
    
    .tab-item {
      flex: 1;
      padding: 24rpx 16rpx;
      text-align: center;
      font-size: 28rpx;
      color: #888;
      transition: all 0.2s ease;
      
      &.active {
        background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
        color: #fff;
      }
    }
  }
  
  .chart-container {
    padding: 0 24rpx 24rpx 24rpx;
    
    .chart-section {
      background: #fff;
      border-radius: 16rpx;
      padding: 32rpx 24rpx;
      box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
      
      .section-header {
        margin-bottom: 32rpx;
        
        .section-title {
          font-size: 32rpx;
          font-weight: bold;
          color: #222;
          display: block;
          margin-bottom: 8rpx;
        }
        
        .section-subtitle {
          font-size: 24rpx;
          color: #888;
          display: block;
        }
      }
      
      // 本周表格样式
      .week-table {
        .table-header {
          display: flex;
          background: #f8f9fa;
          border-radius: 12rpx;
          margin-bottom: 16rpx;
          
          .header-cell {
            flex: 1;
            padding: 20rpx 16rpx;
            text-align: center;
            font-size: 26rpx;
            font-weight: bold;
            color: #666;
          }
        }
        
        .table-row {
          display: flex;
          border-bottom: 1rpx solid #f0f0f0;
          
          &.completed {
            background: rgba(76, 175, 80, 0.05);
          }
          
          .table-cell {
            flex: 1;
            padding: 20rpx 16rpx;
            text-align: center;
            font-size: 26rpx;
            color: #333;
            
            &.score {
              color: #4facfe;
              font-weight: bold;
            }
            
            &.tasks {
              color: #4caf50;
              font-weight: bold;
            }
            
            &.status {
              .status-completed {
                color: #4caf50;
              }
              
              .status-empty {
                color: #ccc;
              }
            }
          }
        }
      }
    }
    
    // 汇总卡片样式
    .summary-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20rpx;
      margin-top: 32rpx;
      
      .summary-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 16rpx;
        padding: 24rpx 20rpx;
        text-align: center;
        
        .card-title {
          font-size: 22rpx;
          color: rgba(255,255,255,0.8);
          display: block;
          margin-bottom: 8rpx;
        }
        
        .card-value {
          font-size: 32rpx;
          font-weight: bold;
          color: #fff;
          display: block;
        }
      }
    }
    
    // 本月日历样式
    .month-calendar {
      .calendar-header {
        display: flex;
        margin-bottom: 16rpx;
        
        .calendar-day-header {
          flex: 1;
          text-align: center;
          font-size: 24rpx;
          color: #888;
          padding: 12rpx 8rpx;
        }
      }
      
      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 8rpx;
        
        .calendar-day {
          aspect-ratio: 1;
          border: 1rpx solid #f0f0f0;
          border-radius: 8rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          
          &.completed {
            background: rgba(76, 175, 80, 0.1);
            border-color: #4caf50;
          }
          
          &.has-data {
            background: rgba(79, 172, 254, 0.05);
          }
          
          .day-number {
            font-size: 24rpx;
            color: #333;
            margin-bottom: 4rpx;
          }
          
          .day-stats {
            display: flex;
            flex-direction: column;
            align-items: center;
            
            .day-score {
              font-size: 18rpx;
              color: #4facfe;
              font-weight: bold;
            }
            
            .day-tasks {
              font-size: 16rpx;
              color: #4caf50;
            }
          }
        }
      }
    }
    
    // 进度条样式
    .progress-section {
      margin-bottom: 32rpx;
      
      .progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16rpx;
        
        .progress-title {
          font-size: 28rpx;
          font-weight: bold;
          color: #222;
        }
        
        .progress-subtitle {
          font-size: 24rpx;
          color: #888;
        }
      }
      
      .progress-bar {
        height: 16rpx;
        background: #f0f0f0;
        border-radius: 8rpx;
        overflow: hidden;
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
          border-radius: 8rpx;
          transition: width 0.3s ease;
        }
      }
    }
    
    // 21天列表样式
    .recent21-list {
      .day-item {
        display: flex;
        align-items: center;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #f0f0f0;
        
        &.completed {
          background: rgba(76, 175, 80, 0.05);
        }
        
        .day-info {
          flex: 1;
          
          .day-date {
            font-size: 28rpx;
            color: #222;
            display: block;
            margin-bottom: 4rpx;
          }
          
          .day-number {
            font-size: 22rpx;
            color: #888;
            display: block;
          }
        }
        
        .day-stats {
          display: flex;
          gap: 16rpx;
          margin-right: 20rpx;
          
          .day-score {
            font-size: 24rpx;
            color: #4facfe;
            font-weight: bold;
          }
          
          .day-tasks {
            font-size: 24rpx;
            color: #4caf50;
          }
          
          .day-rate {
            font-size: 20rpx;
            color: #ff9800;
            font-weight: bold;
          }
        }
        
        .day-status {
          .status-icon {
            font-size: 28rpx;
            color: #4caf50;
            
            &.empty {
              color: #ccc;
            }
          }
        }
      }
    }
  }
}
</style> 