import { ref, watch } from 'vue'

const STORAGE_KEY = 'my_tasks'

export function useTaskList() {
  // 初始化时从本地读取
  const tasks = ref(uni.getStorageSync(STORAGE_KEY) || [])

  // 响应式监听，自动存储
  watch(tasks, (val) => {
    uni.setStorageSync(STORAGE_KEY, val)
  }, { deep: true })

  // 增删查改方法
  function addTask(task) {
    tasks.value.push(task)
  }
  function removeTasks(ids) {
    tasks.value = tasks.value.filter(task => !ids.includes(task.id))
  }
  function setTasks(newTasks) {
    tasks.value = newTasks
  }

  return {
    tasks,
    addTask,
    removeTasks,
    setTasks
  }
} 