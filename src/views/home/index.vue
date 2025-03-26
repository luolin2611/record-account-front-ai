<template>
  <div class="home-page">
    <!-- 顶部卡片 -->
    <div class="overview-card">
      <div class="expense">
        <div class="label">本月支出（元）</div>
        <div class="amount">¥{{ statistics.monthExpense.toFixed(2) }}</div>
      </div>
      <div class="bottom-info">
        <div class="income">
          本月收入 <span>{{ statistics.monthIncome.toFixed(2) }}</span>
        </div>
        <div class="budget-over" @click="router.push('/home/budget')">
          预算超支 <span>{{ statistics.budgetOverspend.toFixed(2) }}</span>
        </div>
      </div>
      <div class="eye-icon">
        <van-icon name="eye-o" color="#fff" size="20" />
      </div>
    </div>

    <!-- 记账和添加资产按钮 -->
    <div class="action-buttons">
      <van-button block type="primary" icon="edit" class="record-btn" @click="goToRecord">
        记一笔
      </van-button>
    </div>

    <!-- 近三日账单 -->
    <div class="recent-bills">
      <div class="section-header">
        <div class="title">
          近三日新增账单
          <span class="count">{{ totalRecords }}笔</span>
        </div>
        <van-icon name="more-o" size="18" color="#969799" />
      </div>

      <!-- 账单列表 -->
      <div class="bill-list">
        <!-- 按日期分组 -->
        <div class="date-group" v-for="(group, index) in statistics.recentRecords" :key="index">
          <div class="date-header">
            {{ group.date }}
            <span class="week-day">{{ getWeekDay(group.date) }}</span>
          </div>

          <!-- 当日账单列表 -->
          <div class="bill-item" v-for="record in group.records" :key="record.id">
            <div class="category-icon">
              <i :class="['iconfont', 'icon-' + record.iconName]"></i>
            </div>
            <div class="bill-info">
              <div class="category-name">{{ record.classifyName }}</div>
              <div class="bill-time">{{ record.remark }}</div>
            </div>
            <div class="bill-amount" :class="{ 'expense': record.classifyType === '0' }">
              ¥{{ record.amount.toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getHomeStatistics } from '@/api/home'
import type { HomeStatistics } from '@/types/home'
import { showToast } from 'vant'

const router = useRouter()

// 统计数据
const statistics = ref<HomeStatistics>({
  monthExpense: 0,
  monthIncome: 0,
  monthBudget: 0,
  budgetOverspend: 0,
  recentRecords: []
})

// 计算总记录数
const totalRecords = computed(() => {
  return statistics.value.recentRecords.reduce((total, group) => {
    return total + group.records.length
  }, 0)
})

// 获取星期几
const getWeekDay = (dateStr: string) => {
  const today = new Date()
  const date = new Date(dateStr)

  if (date.toDateString() === today.toDateString()) {
    return '今天'
  }

  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return weekDays[date.getDay()]
}

// 跳转到记账页面
const goToRecord = () => {
  router.push('/record')
}

// 获取首页数据
const fetchHomeData = async () => {
  const res = await getHomeStatistics()
  if (res) {
    statistics.value = res
  }
}

onMounted(() => {
  fetchHomeData()
})
</script>

<style lang="less" scoped>
.home-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 50px;

  .overview-card {
    position: relative;
    background: linear-gradient(135deg, #373B62, #252A4A);
    color: #fff;
    padding: 80px 24px 24px 24px;
    margin-bottom: 16px;

    .expense {
      margin-bottom: 24px;

      .label {
        font-size: 14px;
        opacity: 0.8;
        margin-bottom: 8px;
      }

      .amount {
        font-size: 32px;
        font-weight: 500;
      }
    }

    .bottom-info {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      opacity: 0.8;

      span {
        margin-left: 8px;
      }
    }

    .eye-icon {
      position: absolute;
      top: 24px;
      right: 24px;
    }
  }

  .action-buttons {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    padding: 0 16px;
    margin-bottom: 24px;

    .record-btn {
      height: 44px;
      border-radius: 5px;
      background: linear-gradient(13deg, #eb5e74, #eb6160);
      border: none;

      :deep(.van-button__icon) {
        font-size: 18px;
        margin-right: 4px;
      }
    }

    .asset-btn {
      height: 44px;
      border-radius: 22px;
      border-color: #ec6564;
      color: #ec6564;
      padding: 0 20px;
    }
  }

  .recent-bills {
    background: #fff;
    padding: 16px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .title {
        font-size: 16px;
        font-weight: 500;
        color: #323233;

        .count {
          font-size: 14px;
          color: #969799;
          margin-left: 8px;
          font-weight: normal;
        }
      }
    }

    .date-group {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      .date-header {
        font-size: 14px;
        color: #969799;
        margin-bottom: 12px;

        .week-day {
          margin-left: 8px;
        }
      }

      .bill-item {
        display: flex;
        align-items: center;
        padding: 12px 0;

        .category-icon {
          width: 40px;
          height: 40px;
          background: #f7f8fa;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;

          .iconfont {
            font-size: 24px;
            color: #ec6564;
          }
        }

        .bill-info {
          flex: 1;

          .category-name {
            font-size: 16px;
            color: #323233;
            margin-bottom: 4px;
          }

          .bill-time {
            font-size: 12px;
            color: #969799;
          }
        }

        .bill-amount {
          font-size: 16px;
          font-weight: 500;
          color: #07c160;

          &.expense {
            color: #ec6564;
          }
        }
      }
    }
  }
}
</style>
