<template>
  <div class="record">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      left-arrow
      @click-left="onClickLeft"
      fixed
    >
      <template #right>
        <van-icon name="cross" size="18" @click="onClickLeft" />
      </template>
    </van-nav-bar>

    <div class="content">
      <!-- 账单类型切换 -->
      <van-tabs v-model:active="activeTab" type="card">
        <van-tab title="流出" name="expense" />
        <van-tab title="流入" name="income" />
        <van-tab title="内部转账" name="transfer" />
      </van-tabs>

      <!-- 金额输入 -->
      <div class="amount-input">
        <div class="label">账单金额</div>
        <div class="amount">
          <span class="currency">¥</span>
          <span class="value">{{ amount }}</span>
        </div>
      </div>

      <!-- 分类选择 -->
      <div class="category-section">
        <van-swipe class="category-swipe" :loop="false" :width="375" :show-indicators="true">
          <van-swipe-item>
            <div class="category-grid">
              <div
                v-for="category in currentCategories"
                :key="category.id"
                class="category-item"
                :class="{ active: selectedCategory?.id === category.id }"
                @click="selectCategory(category)"
              >
                <van-icon :name="category.icon" :color="selectedCategory?.id === category.id ? '#ff9a9e' : '#969799'" />
                <span>{{ category.name }}</span>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>

      <!-- 日期选择 -->
      <div class="date-section">
        <van-icon name="calendar-o" />
        <span>今天</span>
        <span>午餐</span>
      </div>

      <!-- 报销标记 -->
      <div class="reimbursement-section">
        <van-icon name="clock-o" />
        <span>可报销</span>
      </div>

      <!-- 底部按钮 -->
      <div class="bottom-buttons">
        <van-button plain type="danger" block @click="onDelete">删除</van-button>
        <van-button type="danger" block @click="onSave">保存</van-button>
      </div>
    </div>

    <!-- 数字键盘 -->
    <van-number-keyboard
      v-model="amount"
      :show="true"
      :maxlength="10"
      @blur="onKeyboardBlur"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const activeTab = ref('expense')
const amount = ref('18')

// 分类数据
const expenseCategories = [
  { id: 1, name: '餐饮', icon: 'food-o' },
  { id: 2, name: '水果', icon: 'gift-o' },
  { id: 3, name: '购物', icon: 'shopping-cart-o' },
  { id: 4, name: '吃饭', icon: 'food-o' },
  { id: 5, name: '外汇', icon: 'balance-o' },
  { id: 6, name: '淘宝', icon: 'shopping-cart-o' },
  { id: 7, name: '服装', icon: 'shopping-cart-o' },
  { id: 8, name: '生活', icon: 'home-o' },
  { id: 9, name: '住房', icon: 'home-o' },
  { id: 10, name: '手续费', icon: 'balance-o' }
]

const selectedCategory = ref(expenseCategories[0])

// 根据当前标签页显示对应的分类
const currentCategories = computed(() => {
  switch (activeTab.value) {
    case 'expense':
      return expenseCategories
    case 'income':
      return [] // TODO: 添加收入分类
    case 'transfer':
      return [] // TODO: 添加转账分类
    default:
      return []
  }
})

// 选择分类
const selectCategory = (category: any) => {
  selectedCategory.value = category
}

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 键盘失焦
const onKeyboardBlur = () => {
  // TODO: 处理键盘失焦事件
}

// 删除记录
const onDelete = () => {
  // TODO: 实现删除功能
}

// 保存记录
const onSave = () => {
  if (!amount.value) {
    showToast('请输入金额')
    return
  }
  if (!selectedCategory.value) {
    showToast('请选择分类')
    return
  }
  // TODO: 实现保存功能
  showToast('保存成功')
  router.back()
}
</script>

<style lang="less" scoped>
.record {
  min-height: 100vh;
  background: #fff;
  padding-top: 46px;

  .content {
    padding: 16px;
  }

  .amount-input {
    padding: 20px 0;
    text-align: left;

    .label {
      font-size: 14px;
      color: #969799;
      margin-bottom: 8px;
    }

    .amount {
      font-size: 32px;
      color: #323233;
      font-weight: 500;

      .currency {
        font-size: 24px;
        margin-right: 4px;
      }
    }
  }

  .category-section {
    margin: 20px 0;

    .category-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;
      padding: 16px 0;

      .category-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;

        .van-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }

        span {
          font-size: 12px;
          color: #323233;
        }

        &.active {
          span {
            color: #ff9a9e;
          }
        }
      }
    }
  }

  .date-section,
  .reimbursement-section {
    display: flex;
    align-items: center;
    padding: 12px 0;
    font-size: 14px;
    color: #323233;

    .van-icon {
      margin-right: 8px;
      color: #969799;
    }

    span {
      margin-right: 16px;
    }
  }

  .bottom-buttons {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 16px;
    background: #fff;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);

    .van-button {
      height: 40px;
      border-radius: 20px;
    }
  }
}

:deep(.van-nav-bar) {
  background: #fff;
}

:deep(.van-tabs) {
  .van-tabs__wrap {
    height: 44px;
  }

  .van-tab {
    color: #323233;
    font-size: 14px;
  }

  .van-tab--active {
    color: #ff9a9e;
  }

  .van-tabs__line {
    background-color: #ff9a9e;
  }
}

:deep(.van-swipe__indicators) {
  bottom: -4px;

  .van-swipe__indicator {
    width: 6px;
    height: 6px;
    background-color: #dcdee0;
    opacity: 1;

    &--active {
      background-color: #ff9a9e;
    }
  }
}
</style> 