import { ref, watch } from 'vue'

const SCORE_STORAGE_KEY = 'user_score'

// 创建单例实例
let instance = null

export function useScore() {
  // 如果已经存在实例，直接返回
  if (instance) {
    return instance
  }

  // 初始化时从本地读取积分，默认为0
  const score = ref(uni.getStorageSync(SCORE_STORAGE_KEY) || 0)

  // 响应式监听，自动存储积分变化
  watch(score, (val) => {
    console.log('保存积分到本地存储:', val)
    uni.setStorageSync(SCORE_STORAGE_KEY, val)
  })

  // 增加积分
  function addScore(points) {
    console.log('增加积分:', points)
    score.value += points
  }

  // 减少积分
  function subtractScore(points) {
    console.log('减少积分:', points)
    score.value = Math.max(0, score.value - points) // 积分不能为负数
  }

  // 设置积分
  function setScore(newScore) {
    console.log('设置积分:', newScore)
    score.value = Math.max(0, newScore)
  }

  // 获取当前积分
  function getScore() {
    return score.value
  }

  // 创建实例对象
  instance = {
    score,
    addScore,
    subtractScore,
    setScore,
    getScore
  }

  return instance
} 