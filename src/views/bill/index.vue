<template>
  <div class="bill">
    <div class="month-selector">
      <van-dropdown-menu>
        <van-dropdown-item v-model="currentYear" :options="yearOptions" />
        <van-dropdown-item v-model="currentMonth" :options="monthOptions" />
      </van-dropdown-menu>
    </div>

    <div class="bill-summary">
      <div class="expense">
        <div class="label">月支出</div>
        <div class="amount">¥{{ monthlyExpense }}</div>
      </div>
      <div class="income">
        <div class="label">月收入</div>
        <div class="amount">¥{{ monthlyIncome }}</div>
      </div>
    </div>

    <div class="bill-list">
      <div v-for="(group, date) in billGroups" :key="date" class="bill-group">
        <div class="date-header">
          {{ group.date }}
          <span class="weekday">{{ group.weekday }}</span>
        </div>
        <div v-for="item in group.items" :key="item.id" class="bill-item">
          <div class="left">
            <van-icon :name="item.icon" class="icon" />
            <div class="info">
              <div class="category">{{ item.category }}</div>
              <div class="subcategory">{{ item.subcategory }}</div>
            </div>
          </div>
          <div class="amount" :class="{ 'income': item.type === 'income' }">
            {{ item.type === 'income' ? '+' : '-' }}¥{{ item.amount }}
          </div>
        </div>
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

const billGroups = ref([
  {
    date: '3月31日',
    weekday: '星期三',
    items: [
      {
        id: 1,
        icon: 'food-o',
        category: '餐饮',
        subcategory: '午餐',
        amount: '18.00',
        type: 'expense'
      }
    ]
  },
  {
    date: '3月30日',
    weekday: '星期二',
    items: [
      {
        id: 2,
        icon: 'food-o',
        category: '餐饮',
        subcategory: '午餐',
        amount: '18.00',
        type: 'expense'
      }
    ]
  }
])
</script>

<style scoped lang="less">
.bill {
  background: #f7f8fa;
  min-height: 100vh;

  .month-selector {
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .bill-summary {
    display: flex;
    padding: 20px;
    background: white;
    margin-bottom: 10px;

    .expense, .income {
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

  .bill-list {
    .bill-group {
      margin-bottom: 10px;
      background: white;

      .date-header {
        padding: 10px 15px;
        font-size: 14px;
        color: #999;
        border-bottom: 1px solid #f5f5f5;

        .weekday {
          margin-left: 10px;
        }
      }

      .bill-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px;
        border-bottom: 1px solid #f5f5f5;

        .left {
          display: flex;
          align-items: center;

          .icon {
            font-size: 24px;
            margin-right: 10px;
            color: #ff6b81;
          }

          .info {
            .category {
              font-size: 16px;
            }

            .subcategory {
              font-size: 12px;
              color: #999;
              margin-top: 2px;
            }
          }
        }

        .amount {
          font-weight: bold;
          color: #ff6b81;

          &.income {
            color: #4cd964;
          }
        }
      }
    }
  }
}
</style> 