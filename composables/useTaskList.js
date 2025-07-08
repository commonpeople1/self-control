import { ref, watch } from 'vue'

const STORAGE_KEY = 'my_tasks'
const LAST_RESET_KEY = 'last_reset_date'

// 创建单例实例
let instance = null

export function useTaskList(scoreManager) {
  // 如果已经存在实例，直接返回
  if (instance) {
    return instance
  }

  // 初始化时从本地读取
  const tasks = ref(uni.getStorageSync(STORAGE_KEY) || [])

  // 响应式监听，自动存储
  watch(tasks, (val) => {
    console.log('保存任务到本地存储:', val)
    uni.setStorageSync(STORAGE_KEY, val)
  }, { deep: true })

  // 检查是否需要每日重置
  function checkDailyReset() {
    const today = new Date().toDateString()
    const lastReset = uni.getStorageSync(LAST_RESET_KEY)
    
    if (lastReset !== today) {
      // 需要重置
      resetAllTasks()
      uni.setStorageSync(LAST_RESET_KEY, today)
    }
  }

  // 重置所有任务为未完成状态
  function resetAllTasks() {
    tasks.value.forEach(task => {
      task.completed = false
    })
  }

  // 增删查改方法
  function addTask(task) {
    console.log('添加任务:', task)
    tasks.value.push({
      ...task,
      completed: false // 默认未完成
    })
  }
  function removeTasks(ids) {
    console.log('删除任务:', ids)
    tasks.value = tasks.value.filter(task => !ids.includes(task.id))
  }
  function setTasks(newTasks) {
    tasks.value = newTasks
  }
  function toggleTaskComplete(taskId) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      const wasCompleted = task.completed
      task.completed = !task.completed
      
      // 处理积分变化
      if (scoreManager) {
        if (task.completed) {
          // 任务完成，增加积分
          scoreManager.addScore(task.score)
        } else {
          // 任务取消完成，减少积分
          scoreManager.subtractScore(task.score)
        }
      }
    }
  }

  // 初始化时检查是否需要重置
  checkDailyReset()

  // 创建实例对象
  instance = {
    tasks,
    addTask,
    removeTasks,
    setTasks,
    toggleTaskComplete,
    resetAllTasks,
    checkDailyReset
  }

  return instance
} 