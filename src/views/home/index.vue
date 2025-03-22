<template>
  <div class="home">
    <div class="header">
      <div class="amount-info">
        <div class="amount-title">本月支出 (元)</div>
        <div class="amount">¥{{ monthlyExpense }}</div>
        <div class="sub-info">
          <div>本月收入 {{ monthlyIncome }}</div>
          <div>预算超支 {{ overBudget }}</div>
        </div>
      </div>
    </div>
    
    <div class="recent-records">
      <div class="title">近三日新增账单 {{ recentCount }}笔</div>
      <div class="record-list">
        <div v-for="record in recentRecords" :key="record.date" class="record-item">
          <div class="record-date">
            {{ record.date }}
            <span class="day-text">{{ record.dayText }}</span>
          </div>
          <div class="record-content">
            <van-icon name="shop" class="record-icon" />
            <span class="record-type">{{ record.type }}</span>
            <span class="record-category">{{ record.category }}</span>
            <span class="record-amount">¥{{ record.amount }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="add-record">
      <van-button type="primary" block round @click="onAddRecord">
        <van-icon name="records" />记一笔
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const monthlyExpense = ref('4,706.11')
const monthlyIncome = ref('11,500.00')
const overBudget = ref('1,706.11')
const recentCount = ref(7)

const recentRecords = ref([
  {
    date: '3月31日',
    dayText: '今天',
    type: '餐饮',
    category: '午餐',
    amount: '18.00'
  },
  {
    date: '3月30日',
    dayText: '星期二',
    type: '餐饮',
    category: '午餐',
    amount: '18.00'
  },
  {
    date: '3月29日',
    dayText: '星期一',
    type: '餐饮',
    category: '午餐',
    amount: '18.00'
  }
])

const onAddRecord = () => {
  router.push('/record')
}
</script>

<style scoped lang="less">
.home {
  min-height: 100vh;
  background: #f7f8fa;

  .header {
    background: linear-gradient(180deg, #2b3674 0%, #1a1f37 100%);
    padding: 20px;
    color: white;
    
    .amount-info {
      .amount-title {
        font-size: 14px;
        opacity: 0.8;
      }
      
      .amount {
        font-size: 32px;
        font-weight: bold;
        margin: 10px 0;
      }
      
      .sub-info {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        opacity: 0.8;
      }
    }
  }

  .recent-records {
    background: white;
    margin-top: 10px;
    padding: 15px;

    .title {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }

    .record-item {
      margin-bottom: 15px;

      .record-date {
        font-size: 14px;
        color: #999;
        margin-bottom: 10px;

        .day-text {
          margin-left: 10px;
        }
      }

      .record-content {
        display: flex;
        align-items: center;
        
        .record-icon {
          margin-right: 10px;
          color: #ff6b81;
        }

        .record-type {
          margin-right: 10px;
        }

        .record-category {
          color: #666;
          flex: 1;
        }

        .record-amount {
          color: #ff6b81;
        }
      }
    }
  }

  .add-record {
    position: fixed;
    bottom: 80px;
    left: 20px;
    right: 20px;
  }
}
</style> 