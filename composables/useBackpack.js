import { ref, watch } from 'vue'

const BACKPACK_KEY = 'user_backpack'

const instance = {
  backpack: ref(uni.getStorageSync(BACKPACK_KEY) || []),
  addToBackpack(reward) {
    // 查找是否已存在该奖励
    const idx = instance.backpack.value.findIndex(item => item.id === reward.id)
    if (idx > -1) {
      instance.backpack.value[idx].count += 1
    } else {
      instance.backpack.value.push({ ...reward, count: 1 })
    }
  },
  useReward(rewardId) {
    const idx = instance.backpack.value.findIndex(item => item.id === rewardId)
    if (idx > -1) {
      instance.backpack.value[idx].count -= 1
      if (instance.backpack.value[idx].count <= 0) {
        instance.backpack.value.splice(idx, 1)
      }
    }
  },
  removeReward(rewardId) {
    instance.backpack.value = instance.backpack.value.filter(item => item.id !== rewardId)
  }
}

watch(instance.backpack, (val) => {
  uni.setStorageSync(BACKPACK_KEY, val)
}, { deep: true })

export function useBackpack() {
  return instance
} 