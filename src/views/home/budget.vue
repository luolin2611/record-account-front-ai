<template>
  <div class="budget">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="本月预算"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />

    <div class="content">
      <!-- 月预算部分 -->
      <div class="budget-section">
        <div class="section-title">月预算</div>
        <div class="month-budget">
          <div class="budget-circle">
            <van-circle
              :rate="budgetRate"
              :speed="100"
              size="200"
              :stroke-width="20"
              :color="gradientColor"
            >
              <div class="budget-info">
                <div class="label">月预算超支</div>
                <div class="amount">¥{{ monthlyOverBudget }}</div>
              </div>
            </van-circle>
          </div>

          <div class="budget-details">
            <div class="detail-item">
              <span class="label">本月消费</span>
              <span class="value" @click="goToMonthlyExpense">¥{{ monthlyExpense }}</span>
            </div>
            <div class="detail-item">
              <span class="label">月预算</span>
              <span class="value" @click="editMonthlyBudget">
                ¥{{ monthlyBudget }}
                <van-icon name="edit" />
              </span>
            </div>
            <div class="detail-item">
              <span class="label">剩余天数</span>
              <span class="value">{{ remainingDays }}</span>
            </div>
          </div>

          <div class="daily-stats">
            <div class="stat-item">
              <div class="label">本月日均消费</div>
              <div class="value">¥{{ dailyAverage }}</div>
            </div>
            <div class="stat-item">
              <div class="label">剩余每日可消费金额</div>
              <div class="value">¥{{ remainingDailyBudget }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分类预算部分 -->
      <div class="budget-section">
        <div class="section-title">分类预算</div>
        <div class="category-budgets">
          <div
            v-for="category in categoryBudgets"
            :key="category.id"
            class="category-item"
          >
            <div class="category-info">
              <van-icon :name="category.icon" :color="category.color" size="24" />
              <span class="name">{{ category.name }}</span>
            </div>
            <div class="budget-progress">
              <div class="amounts">
                <span class="over-budget" v-if="category.isOverBudget">
                  预算超支
                  <span class="amount">¥{{ category.overAmount }}</span>
                </span>
                <span class="remaining-budget" v-else>
                  剩余预算
                  <span class="amount">¥{{ category.remainingAmount }}</span>
                </span>
              </div>
              <div class="expense-info" @click="editCategoryBudget(category)">
                本月消费
                <span class="amount">¥{{ category.monthlyExpense }}</span>
                <van-icon name="edit" />
              </div>
            </div>
            <van-progress
              :percentage="category.percentage"
              :color="category.isOverBudget ? '#ee0a24' : '#07c160'"
              track-color="#e5e5e5"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showDialog } from 'vant'

const router = useRouter()

// 月预算数据
const monthlyExpense = ref(4706.11)
const monthlyBudget = ref(3000.00)
const remainingDays = ref(1)
const dailyAverage = ref(151.81)
const remainingDailyBudget = ref(0)

// 计算月预算超支金额
const monthlyOverBudget = computed(() => {
  return (monthlyExpense.value - monthlyBudget.value).toFixed(2)
})

// 计算预算使用率
const budgetRate = computed(() => {
  return Math.min((monthlyExpense.value / monthlyBudget.value) * 100, 100)
})

// 渐变色
const gradientColor = {
  '0%': '#ff9a9e',
  '100%': '#ee0a24',
}

// 分类预算数据
const categoryBudgets = ref([
  {
    id: 1,
    name: '餐饮',
    icon: 'food-o',
    color: '#ff9a9e',
    monthlyExpense: 1246.72,
    budget: 1200,
    isOverBudget: true,
    overAmount: 46.72,
    remainingAmount: 0,
    percentage: 103.89,
    transactions: 47
  },
  {
    id: 2,
    name: '住房',
    icon: 'home-o',
    color: '#ff9a9e',
    monthlyExpense: 1099.00,
    budget: 1080,
    isOverBudget: true,
    overAmount: 19.00,
    remainingAmount: 0,
    percentage: 101.76,
    transactions: 2
  },
  {
    id: 3,
    name: '交通',
    icon: 'logistics',
    color: '#ff9a9e',
    monthlyExpense: 30.00,
    budget: 350,
    isOverBudget: false,
    overAmount: 0,
    remainingAmount: 320.00,
    percentage: 8.57,
    transactions: 1
  },
  {
    id: 4,
    name: '理发',
    icon: 'smile-o',
    color: '#ff9a9e',
    monthlyExpense: 15.00,
    budget: 30,
    isOverBudget: false,
    overAmount: 0,
    remainingAmount: 15.00,
    percentage: 50,
    transactions: 1
  }
])

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 跳转到月度消费详情
const goToMonthlyExpense = () => {
  // TODO: 实现跳转到月度消费详情页面
}

// 编辑月预算
const editMonthlyBudget = () => {
  showDialog({
    title: '设置月预算',
    message: '请输入本月预算金额',
    showCancelButton: true,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    className: 'budget-dialog'
  })
}

// 编辑分类预算
const editCategoryBudget = (category: any) => {
  showDialog({
    title: `设置${category.name}预算`,
    message: '请输入预算金额',
    showCancelButton: true,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    className: 'budget-dialog'
  })
}
</script>

<style lang="less" scoped>
.budget {
  min-height: 100vh;
  background: #f7f8fa;
  padding-top: 46px;

  .content {
    padding: 16px;
  }

  .budget-section {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;

    .section-title {
      font-size: 16px;
      font-weight: 500;
      color: #323233;
      margin-bottom: 16px;
      position: relative;
      padding-left: 10px;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 16px;
        background: #ff9a9e;
        border-radius: 2px;
      }
    }
  }

  .month-budget {
    .budget-circle {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;

      .budget-info {
        text-align: center;

        .label {
          font-size: 14px;
          color: #969799;
          margin-bottom: 8px;
        }

        .amount {
          font-size: 24px;
          font-weight: 500;
          color: #ee0a24;
        }
      }
    }

    .budget-details {
      margin-bottom: 24px;

      .detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .label {
          color: #969799;
          font-size: 14px;
        }

        .value {
          color: #323233;
          font-size: 16px;
          font-weight: 500;
        }
      }
    }

    .daily-stats {
      background: #f7f8fa;
      border-radius: 4px;
      padding: 12px;

      .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          color: #969799;
          font-size: 14px;
        }

        .value {
          color: #323233;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
  }

  .category-budgets {
    .category-item {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      .category-info {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .name {
          margin-left: 8px;
          font-size: 14px;
          color: #323233;
        }
      }

      .budget-progress {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;

        .amounts {
          font-size: 12px;

          .over-budget {
            color: #ee0a24;

            .amount {
              font-weight: 500;
              margin-left: 4px;
            }
          }

          .remaining-budget {
            color: #07c160;

            .amount {
              font-weight: 500;
              margin-left: 4px;
            }
          }
        }

        .expense-info {
          font-size: 12px;
          color: #969799;

          .amount {
            color: #323233;
            font-weight: 500;
            margin: 0 4px;
          }
        }
      }
    }
  }
}

:deep(.van-nav-bar) {
  background: #fff;
}

:deep(.van-nav-bar__title) {
  color: #323233;
}

:deep(.van-nav-bar__text) {
  color: #323233;
}

:deep(.van-nav-bar__arrow) {
  color: #323233;
}

:deep(.van-icon) {
  vertical-align: -0.125em;
}

:deep(.budget-dialog) {
  .van-dialog__header {
    padding-top: 20px;
    font-weight: 500;
  }

  .van-dialog__message {
    padding: 16px;
  }
}
</style> 