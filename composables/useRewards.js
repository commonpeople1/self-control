import { ref, watch } from 'vue'

const REWARDS_STORAGE_KEY = 'user_rewards'
const CATEGORIES_STORAGE_KEY = 'reward_categories'

// 创建单例实例
let instance = null

export function useRewards() {
  // 如果已经存在实例，直接返回
  if (instance) {
    return instance
  }

  // 初始化时从本地读取奖励分类
  const categories = ref(uni.getStorageSync(CATEGORIES_STORAGE_KEY) || [])
  
  // 初始化时从本地读取奖励项
  const rewards = ref(uni.getStorageSync(REWARDS_STORAGE_KEY) || [])

  // 响应式监听，自动存储奖励分类
  watch(categories, (val) => {
    console.log('保存分类到本地存储:', val)
    uni.setStorageSync(CATEGORIES_STORAGE_KEY, val)
  }, { deep: true })

  // 响应式监听，自动存储奖励项
  watch(rewards, (val) => {
    console.log('保存奖励到本地存储:', val)
    uni.setStorageSync(REWARDS_STORAGE_KEY, val)
  }, { deep: true })

  // 添加奖励分类
  function addCategory(categoryName) {
    console.log('添加分类:', categoryName)
    if (!categories.value.includes(categoryName)) {
      categories.value.push(categoryName)
    }
  }

  // 删除奖励分类
  function removeCategory(categoryName) {
    console.log('删除分类:', categoryName)
    categories.value = categories.value.filter(cat => cat !== categoryName)
    // 同时删除该分类下的所有奖励项
    rewards.value = rewards.value.filter(reward => reward.category !== categoryName)
  }

  // 添加奖励项
  function addReward(reward) {
    if (!reward.category) {
      console.warn('添加奖励时未指定分类（category 字段），该奖励将被忽略');
      return;
    }
    rewards.value.push({
      id: Date.now(),
      price: reward.price || 0, // 确保有积分价格字段
      category: reward.category, // 强制写入分类字段
      icon: reward.icon,
      name: reward.name,
      description: reward.description
    })
  }

  // 删除奖励项
  function removeReward(rewardId) {
    console.log('删除奖励:', rewardId)
    rewards.value = rewards.value.filter(reward => reward.id !== rewardId)
  }

  // 获取指定分类的奖励项
  function getRewardsByCategory(category) {
    const result = rewards.value.filter(reward => reward.category === category)
    console.log(`获取分类"${category}"的奖励:`, result)
    return result
  }

  // 设置奖励分类
  function setCategories(newCategories) {
    categories.value = newCategories
  }

  // 设置奖励项
  function setRewards(newRewards) {
    rewards.value = newRewards
  }

  // 创建实例对象
  instance = {
    categories,
    rewards,
    addCategory,
    removeCategory,
    addReward,
    removeReward,
    getRewardsByCategory,
    setCategories,
    setRewards
  }

  return instance
} 