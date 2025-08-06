import { ref, computed } from 'vue'

const TASK_HISTORY_KEY = 'task_completion_history'

// 创建单例实例
let instance = null

export function useStatistics() {
  // 如果已经存在实例，直接返回
  if (instance) {
    return instance
  }

  // 获取任务完成历史记录
  function getTaskHistory() {
    return uni.getStorageSync(TASK_HISTORY_KEY) || []
  }

  // 保存任务完成历史记录
  function saveTaskHistory(history) {
    uni.setStorageSync(TASK_HISTORY_KEY, history)
  }

  // 清理旧数据（保留最近90天）
  function cleanOldData() {
    const history = getTaskHistory()
    const today = new Date()
    const cutoffDate = new Date(today)
    cutoffDate.setDate(today.getDate() - 90) // 保留最近90天
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0]
    
    const cleanedHistory = history.filter(record => record.date >= cutoffDateStr)
    
    if (cleanedHistory.length < history.length) {
      console.log(`清理了 ${history.length - cleanedHistory.length} 条旧数据`)
      saveTaskHistory(cleanedHistory)
    }
  }

  // 记录任务完成
  function recordTaskCompletion(taskId, taskName, score, completed) {
    const history = getTaskHistory()
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD格式
    
    // 查找今天的记录
    let todayRecord = history.find(record => record.date === today)
    
    if (!todayRecord) {
      todayRecord = {
        date: today,
        completedTasks: [],
        totalScore: 0,
        taskCount: 0
      }
      history.push(todayRecord)
    }
    
    // 更新任务完成状态
    const existingTask = todayRecord.completedTasks.find(task => task.id === taskId)
    if (existingTask) {
      existingTask.completed = completed
      existingTask.score = score
    } else {
      todayRecord.completedTasks.push({
        id: taskId,
        name: taskName,
        score: score,
        completed: completed
      })
    }
    
    // 重新计算今日统计
    todayRecord.totalScore = todayRecord.completedTasks
      .filter(task => task.completed)
      .reduce((sum, task) => sum + task.score, 0)
    
    // 总任务数应该是当天所有任务的数量，不是已完成的数量
    todayRecord.taskCount = todayRecord.completedTasks.length
    
    saveTaskHistory(history)
    
    // 定期清理旧数据
    cleanOldData()
    
    console.log(`记录任务完成: ${taskName}, 完成状态: ${completed}, 积分: ${score}`)
  }

  // 获取本周汇总数据
  function getWeeklySummary() {
    const history = getTaskHistory()
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay()) // 设置为本周第一天（周日）
    
    const weekData = []
    let totalScore = 0
    let totalTasks = 0
    
    // 生成本周7天的数据
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayRecord = history.find(record => record.date === dateStr)
      const dayData = {
        date: dateStr,
        dayName: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][i],
        score: dayRecord ? dayRecord.totalScore : 0,
        taskCount: dayRecord ? dayRecord.taskCount : 0,
        completedTaskCount: dayRecord ? dayRecord.completedTasks.filter(task => task.completed).length : 0,
        completed: dayRecord ? dayRecord.completedTasks.length > 0 : false
      }
      
      weekData.push(dayData)
      totalScore += dayData.score
      totalTasks += dayData.taskCount
    }
    
    return {
      weekData,
      totalScore,
      totalTasks,
      averageScore: Math.round(totalScore / 7 * 10) / 10,
      averageTasks: Math.round(totalTasks / 7 * 10) / 10
    }
  }

  // 获取本月汇总数据
  function getMonthlySummary() {
    const history = getTaskHistory()
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    
    const monthData = []
    let totalScore = 0
    let totalTasks = 0
    
    // 生成本月每天的数据
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayRecord = history.find(record => record.date === dateStr)
      const dayData = {
        date: dateStr,
        day: i,
        score: dayRecord ? dayRecord.totalScore : 0,
        taskCount: dayRecord ? dayRecord.taskCount : 0,
        completedTaskCount: dayRecord ? dayRecord.completedTasks.filter(task => task.completed).length : 0,
        completed: dayRecord ? dayRecord.completedTasks.length > 0 : false
      }
      
      monthData.push(dayData)
      totalScore += dayData.score
      totalTasks += dayData.taskCount
    }
    
    return {
      monthData,
      totalScore,
      totalTasks,
      averageScore: Math.round(totalScore / endOfMonth.getDate() * 10) / 10,
      averageTasks: Math.round(totalTasks / endOfMonth.getDate() * 10) / 10,
      daysCompleted: monthData.filter(day => day.completed).length
    }
  }

  // 获取近21天任务完成情况
  function getRecent21Days() {
    const history = getTaskHistory()
    const today = new Date()
    const recentData = []
    
    // 从21天前到今天，按时间顺序排列
    for (let i = 20; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i) // 从今天往前推i天
      const dateStr = date.toISOString().split('T')[0]
      
      // 调试信息：显示日期范围
      if (i === 20) {
        console.log('21天统计开始日期:', dateStr)
      }
      if (i === 0) {
        console.log('21天统计结束日期:', dateStr)
      }
      
      const dayRecord = history.find(record => record.date === dateStr)
      
      // 计算当天的完成率（如果有任务的话）
      let dailyCompletionRate = 0
      if (dayRecord && dayRecord.completedTasks.length > 0) {
        const totalTasks = dayRecord.completedTasks.length
        const completedTasks = dayRecord.completedTasks.filter(task => task.completed).length
        dailyCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
      }
      
      const dayData = {
        date: dateStr,
        dayName: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()],
        score: dayRecord ? dayRecord.totalScore : 0,
        taskCount: dayRecord ? dayRecord.taskCount : 0, // 总任务数
        completedTaskCount: dayRecord ? dayRecord.completedTasks.filter(task => task.completed).length : 0, // 已完成任务数
        completed: dayRecord ? dayRecord.completedTasks.length > 0 : false,
        dayNumber: 21 - i, // 第几天（1-21）
        dailyCompletionRate: Math.round(dailyCompletionRate)
      }
      
      recentData.push(dayData)
    }
    
    // 倒序排列，让第21天（今天）显示在最上面
    const sortedData = recentData.reverse()
    
    const totalScore = sortedData.reduce((sum, day) => sum + day.score, 0)
    const totalTasks = sortedData.reduce((sum, day) => sum + day.taskCount, 0)
    
    // 计算平均完成率（只考虑有任务的日期）
    const daysWithTasks = sortedData.filter(day => day.taskCount > 0)
    const averageCompletionRate = daysWithTasks.length > 0 
      ? Math.round(daysWithTasks.reduce((sum, day) => sum + day.dailyCompletionRate, 0) / daysWithTasks.length)
      : 0
    
    return {
      recentData: sortedData,
      totalScore,
      totalTasks,
      averageScore: Math.round(totalScore / 21 * 10) / 10,
      averageTasks: Math.round(totalTasks / 21 * 10) / 10,
      completedDays: daysWithTasks.filter(day => day.completed).length,
      completionRate: averageCompletionRate
    }
  }

  // 创建实例对象
  instance = {
    recordTaskCompletion,
    getWeeklySummary,
    getMonthlySummary,
    getRecent21Days
  }

  return instance
} 