<template>
  <div class="report-page">
    <div class="month-selector">
      <van-dropdown-menu>
        <van-dropdown-item v-model="currentYear" :options="yearOptions" />
        <van-dropdown-item v-model="currentMonth" :options="monthOptions" />
      </van-dropdown-menu>
    </div>

    <div class="summary">
      <div class="expense">
        <div class="label">月支出</div>
        <div class="amount">¥{{ monthlyExpense }}</div>
      </div>
      <div class="income">
        <div class="label">月收入</div>
        <div class="amount">¥{{ monthlyIncome }}</div>
      </div>
      <div class="other">
        <div class="label">其他</div>
        <div class="amount">¥{{ otherAmount }}</div>
      </div>
    </div>

    <div class="chart-container">
      <!-- 这里需要引入图表组件，比如 ECharts -->
      <div class="chart-placeholder">
        支出分类饼图
      </div>
    </div>

    <div class="category-list">
      <div v-for="category in categories" :key="category.name" class="category-item">
        <div class="category-info">
          <van-icon :name="category.icon" class="icon" :style="{ color: category.color }" />
          <span class="name">{{ category.name }}</span>
          <span class="percentage">{{ category.percentage }}%</span>
        </div>
        <div class="amount">¥{{ category.amount }}</div>
        <div class="progress-bar">
          <div class="progress" :style="{ width: category.percentage + '%', backgroundColor: category.color }"></div>
        </div>
        <div class="count">{{ category.count }}笔</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentYear = ref('2021')
const currentMonth = ref('3')

const yearOptions = [
  { text: '2021年', value: '2021' },
  { text: '2020年', value: '2020' }
]

const monthOptions = [
  { text: '3月', value: '3' },
  { text: '2月', value: '2' },
  { text: '1月', value: '1' }
]

const monthlyExpense = ref('4,706.11')
const monthlyIncome = ref('11,500.00')
const otherAmount = ref('0.00')

const categories = ref([
  {
    name: '餐饮',
    icon: 'food-o',
    color: '#FF6B81',
    percentage: 26,
    amount: '1,244.72',
    count: 47
  },
  {
    name: '住房',
    icon: 'home-o',
    color: '#FFD93D',
    percentage: 23,
    amount: '1,099.00',
    count: 2
  },
  {
    name: '购物',
    icon: 'shopping-cart-o',
    color: '#6C5CE7',
    percentage: 9,
    amount: '429.40',
    count: 5
  },
  {
    name: '其他',
    icon: 'more-o',
    color: '#A8A8A8',
    percentage: 26,
    amount: '1,258.88',
    count: 4
  }
])
</script>

<style scoped lang="less">
.report-page {
  background: #f7f8fa;
  min-height: 100vh;

  .month-selector {
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .summary {
    display: flex;
    padding: 20px;
    background: white;
    margin-bottom: 10px;

    .expense, .income, .other {
      flex: 1;
      text-align: center;

      .label {
        color: #666;
        font-size: 14px;
        margin-bottom: 5px;
      }

      .amount {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }

  .chart-container {
    background: white;
    margin: 10px 0;
    padding: 20px;

    .chart-placeholder {
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      border: 1px dashed #ddd;
      border-radius: 8px;
    }
  }

  .category-list {
    background: white;
    padding: 15px;

    .category-item {
      margin-bottom: 20px;

      .category-info {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .icon {
          font-size: 20px;
          margin-right: 10px;
        }

        .name {
          flex: 1;
        }

        .percentage {
          color: #666;
        }
      }

      .amount {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .progress-bar {
        height: 4px;
        background: #f5f5f5;
        border-radius: 2px;
        margin-bottom: 5px;

        .progress {
          height: 100%;
          border-radius: 2px;
        }
      }

      .count {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style> 