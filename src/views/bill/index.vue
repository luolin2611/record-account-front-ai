<template>
  <div class="bill-page">
    <!-- 标题 -->
    <div class="header">
      <div class="title">账单</div>
      <van-icon name="ellipsis" size="24" />
    </div>

    <!-- 时间选择器 -->
    <div class="time-selector">
      <div class="year-month" @click="toggleTimeSelector">
        {{ currentYear }}年 {{ showYearBill ? '' : currentMonth + '月' }}
        <van-icon :name="showTimeSelector ? 'arrow-up' : 'arrow-down'" />
      </div>

      <!-- 时间选择下拉面板 -->
      <div v-show="showTimeSelector" class="time-dropdown">
        <div class="tabs">
          <span :class="{ active: !showYearBill }" @click="switchBillType(false)">月账单</span>
          <span :class="{ active: showYearBill }" @click="switchBillType(true)">年账单</span>
          <span class="custom">自定义</span>
        </div>

        <div class="selector-content">
          <template v-if="showYearBill">
            <div class="year-selector">
              <div class="year-nav">
                <van-icon name="arrow-left" @click="changeYearRange(-1)" />
                <div class="years-grid">
                  <div v-for="year in yearRange" :key="year" :class="{ active: currentYear === year.toString() }"
                    @click="selectYear(year)">
                    {{ year }}
                  </div>
                </div>
                <van-icon name="arrow-right" @click="changeYearRange(1)" />
              </div>
            </div>
          </template>
          <template v-else>
            <div class="month-selector">
              <div v-for="month in 12" :key="month" class="month-item" :class="{
                active: currentMonth === month.toString(),
                disabled: !isMonthSelectable(month)
              }" @click="selectMonth(month)">
                {{ month }}月
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 账单图表 -->
    <div class="bill-chart">
      <!-- 顶部统计数据 -->
      <div class="statistics">
        <div class="expense-section">
          <div class="dot expense-dot"></div>
          <span>{{ showYearBill ? '年' : '月' }}支出</span>
          <span class="amount expense-amount">¥{{ totalExpense }}</span>
        </div>
        <div class="income-section">
          <div class="dot income-dot"></div>
          <span>{{ showYearBill ? '年' : '月' }}收入</span>
          <span class="amount income-amount">¥{{ totalIncome }}</span>
        </div>
      </div>

      <!-- 选中日期的数据显示 -->
      <div v-if="selectedInfo" class="selected-info">
        {{ selectedInfo }}
      </div>

      <!-- 图表容器 -->
      <div ref="chartRef" class="chart-container"></div>
    </div>

    <!-- 账单列表 -->
    <div class="bill-list">
      <div class="list-header">
        <div class="title">账单明细</div>
        <div class="sort-btn" @click="toggleSort">
          {{ sortType === 'time' ? '按时间' : '按金额' }}
        </div>
      </div>
      <div class="list-content">
        <div v-for="(group, index) in sortedBillList" :key="index" class="bill-group">
          <div class="date-header">
            <span>{{ group.date }}</span>
            <span class="week-day">{{ group.weekDay }}</span>
          </div>
          <div v-for="item in group.items" :key="item.id" class="bill-item">
            <div class="left">
              <div class="icon-wrapper">
                <i :class="['iconfont', 'icon-' + item.iconName]"></i>
              </div>
              <div class="info">
                <div class="category">{{ item.classifyName }}</div>
                <div class="remark">{{ item.remark }}</div>
              </div>
            </div>
            <div class="amount" :class="{ income: item.classifyType === '1' }">
              {{ item.classifyType === '1' ? '+' : '-' }}¥{{ formatAmount(item.billMoney) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { use } from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import * as echarts from 'echarts/core'
import dayjs from 'dayjs'

// 注册 ECharts 组件
use([BarChart, LineChart, GridComponent, TooltipComponent, CanvasRenderer])

const showTimeSelector = ref(false)
const showYearBill = ref(false)
const currentYear = ref(dayjs().year().toString())
const currentMonth = ref(dayjs().month() + 1 + '')
const sortType = ref<'time' | 'amount'>('time')
const chartRef = ref<HTMLElement>()
const selectedInfo = ref('')
const totalExpense = ref('4,706.11')
const totalIncome = ref('11,500.00')
const yearRangeStart = ref(dayjs().year() - 5)

// 切换时间选择器显示
const toggleTimeSelector = () => {
  showTimeSelector.value = !showTimeSelector.value
}

// 计算年份范围
const yearRange = computed(() => {
  return Array.from({ length: 10 }, (_, i) => yearRangeStart.value + i)
})

// 改变年份范围
const changeYearRange = (direction: number) => {
  yearRangeStart.value += direction * 10
}

// 选择年份
const selectYear = (year: number) => {
  currentYear.value = year.toString()
  showTimeSelector.value = false
  initChart()
}

// 选择月份
const selectMonth = (month: number) => {
  if (!isMonthSelectable(month)) return
  currentMonth.value = month.toString()
  showTimeSelector.value = false
  initChart()
}

// 切换排序方式
const toggleSort = () => {
  sortType.value = sortType.value === 'time' ? 'amount' : 'time'
}

// 格式化金额
const formatAmount = (amount: number) => {
  return amount.toFixed(2)
}

// 模拟月度数据
const mockMonthData = {
  expense: Array.from({ length: 31 }, () => Math.random() * 1000),
  dates: Array.from({ length: 31 }, (_, i) => `${i + 1}`)
}

// 修改模拟年度数据的月份显示
const mockYearData = {
  expense: [2100, 3200, 3100, 1800, 2800, 2900, 2700, 4600, 2300, 3212.83, 2400, 3900],
  income: [8000, 8000, 8500, 8500, 8500, 8500, 8500, 10700, 8400, 8674, 8200, 11300],
  months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
}

// 修改月度图表配置
const getMonthChartOption = () => {
  return {
    grid: {
      top: '15%',
      left: '3%',
      right: '3%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0]
        return `${currentMonth.value}月${data.name}日 ¥${data.value.toFixed(2)}`
      }
    },
    xAxis: {
      type: 'category',
      data: mockMonthData.dates,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        interval: 14,
        formatter: (value: string) => `${currentMonth.value}-${value}`
      }
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [
      {
        type: 'bar',
        data: mockMonthData.expense,
        itemStyle: {
          color: '#ec6564',
          borderRadius: [2, 2, 0, 0]
        },
        barWidth: '60%'
      }
    ]
  }
}

// 修改图表初始化函数
const initChart = () => {
  if (!chartRef.value) return

  const chart = echarts.init(chartRef.value)

  // 根据不同类型显示不同图表
  if (showYearBill.value) {
    chart.setOption(getYearChartOption())
  } else {
    chart.setOption(getMonthChartOption())
  }

  // 修改点击事件处理
  chart.on('click', (params) => {
    if (showYearBill.value) {
      const monthIndex = params.dataIndex
      const income = mockYearData.income[monthIndex]
      const expense = mockYearData.expense[monthIndex]
      selectedInfo.value = `收入：¥${income.toFixed(2)} 支出：¥${expense.toFixed(2)}`
      
      // 更新选中月份的竖线
      const option = chart.getOption()
      option.xAxis[0].axisLine = {
        show: true,
        lineStyle: {
          color: '#E5E5E5'
        }
      }
      option.xAxis[0].data = mockYearData.months.map((month, index) => {
        if (index === monthIndex) {
          return {
            value: month,
            textStyle: {
              color: '#333333'
            }
          }
        }
        return month
      })
      chart.setOption(option)
    } else {
      const value = params.value as number
      selectedInfo.value = `${currentMonth.value}月${params.name}日 ¥${value.toFixed(2)}`
    }
  })

  // 添加窗口大小变化时的自适应
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 判断月份是否可选
const isMonthSelectable = (month: number) => {
  const now = dayjs()
  const currentYearNum = parseInt(currentYear.value)

  if (currentYearNum < now.year()) return true
  if (currentYearNum > now.year()) return false
  return month <= now.month() + 1
}

// 切换年/月账单时重新初始化图表
const switchBillType = (isYear: boolean) => {
  showYearBill.value = isYear
  // 清除选中信息
  selectedInfo.value = ''
  // 重新初始化图表
  initChart()
}

// 修改年度图表配置
const getYearChartOption = () => {
  return {
    grid: {
      top: '25%',
      left: '0',
      right: '0',
      bottom: '8%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const incomeData = params.find((item: any) => item.seriesName === '收入')
        const expenseData = params.find((item: any) => item.seriesName === '支出')
        return `收入：¥${incomeData?.value?.toFixed(2) || 0} 支出：¥${expenseData?.value?.toFixed(2) || 0}`
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: mockYearData.months,
      axisLine: { 
        show: true,
        lineStyle: {
          color: '#E5E5E5'
        }
      },
      axisTick: { show: false },
      axisLabel: {
        color: '#999999',
        fontSize: 12,
        interval: 0,
        formatter: (value: string) => {
          return value
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#F5F5F5',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'value',
      show: false,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#F5F5F5',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '支出',
        type: 'line',
        data: mockYearData.expense,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: true,
        itemStyle: {
          color: '#ec6564',
          borderWidth: 2,
          borderColor: '#FFFFFF'
        },
        lineStyle: {
          color: '#ec6564',
          width: 1.5
        },
        emphasis: {
          itemStyle: {
            symbolSize: 6,
            borderWidth: 2
          }
        }
      },
      {
        name: '收入',
        type: 'line',
        data: mockYearData.income,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: true,
        itemStyle: {
          color: '#07c160',
          borderWidth: 2,
          borderColor: '#FFFFFF'
        },
        lineStyle: {
          color: '#07c160',
          width: 1.5
        },
        emphasis: {
          itemStyle: {
            symbolSize: 6,
            borderWidth: 2
          }
        }
      }
    ]
  }
}

onMounted(() => {
  initChart()
})
</script>

<style lang="less" scoped>
.bill-page {
  min-height: 100vh;
  background: #f7f8fa;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: #373b62;
    color: #fff;

    .title {
      font-size: 18px;
      font-weight: 500;
    }
  }

  .time-selector {
    position: relative;
    padding: 16px;
    background: #373b62;
    color: #fff;

    .year-month {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 16px;
      cursor: pointer;
      color: #fff;
    }

    .time-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #fff;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      z-index: 100;

      .tabs {
        display: flex;
        padding: 12px 16px;
        border-bottom: 1px solid #f5f5f5;

        span {
          padding: 6px 12px;
          margin-right: 16px;
          border-radius: 4px;
          cursor: pointer;
          color: #333;

          &.active {
            background: #373b62;
            color: #fff;
          }

          &.custom {
            color: #999;
          }
        }
      }

      .selector-content {
        padding: 16px;

        .year-selector {
          .year-nav {
            display: flex;
            align-items: center;
            gap: 16px;

            .van-icon {
              font-size: 20px;
              color: #666;
              cursor: pointer;
              padding: 8px;

              &:hover {
                background: #f5f5f5;
                border-radius: 50%;
              }
            }

            .years-grid {
              flex: 1;
              display: grid;
              grid-template-columns: repeat(5, 1fr);
              gap: 8px;

              div {
                text-align: center;
                padding: 8px;
                cursor: pointer;
                border-radius: 4px;
                color: #333;

                &:hover {
                  background: #f5f5f5;
                }

                &.active {
                  background: #373b62;
                  color: #fff;
                }
              }
            }
          }
        }

        .month-selector {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          padding: 8px;

          .month-item {
            text-align: center;
            padding: 12px;
            cursor: pointer;
            border-radius: 4px;
            color: #333;

            &:hover:not(.disabled) {
              background: #f5f5f5;
            }

            &.active {
              background: #373b62;
              color: #fff;
            }

            &.disabled {
              color: #ccc;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }

  .bill-chart {
    background: #fff;
    padding: 16px;
    margin-bottom: 10px;

    .statistics {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;

      .expense-section,
      .income-section {
        display: flex;
        align-items: center;
        gap: 8px;

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .expense-dot {
          background-color: #ec6564;
        }

        .income-dot {
          background-color: #07c160;
        }

        .amount {
          font-size: 18px;
          font-weight: 500;
        }

        .expense-amount {
          color: #ec6564;
        }

        .income-amount {
          color: #07c160;
        }
      }
    }

    .selected-info {
      text-align: center;
      margin: 10px 0;
      color: #666;
      font-size: 14px;
    }

    .chart-container {
      height: 200px;
    }
  }

  .bill-list {
    background: #fff;

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #f5f5f5;

      .title {
        font-size: 16px;
        font-weight: 500;
      }

      .sort-btn {
        color: #666;
        cursor: pointer;
      }
    }

    .bill-group {
      .date-header {
        padding: 12px 16px;
        background: #f7f8fa;
        font-size: 14px;
        color: #666;

        .week-day {
          margin-left: 8px;
          color: #999;
        }
      }

      .bill-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #f5f5f5;

        .left {
          display: flex;
          align-items: center;
          gap: 12px;

          .icon-wrapper {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #f7f8fa;
            display: flex;
            align-items: center;
            justify-content: center;

            .iconfont {
              font-size: 24px;
              color: #ec6564;
            }
          }

          .info {
            .category {
              font-size: 16px;
              margin-bottom: 4px;
            }

            .remark {
              font-size: 12px;
              color: #999;
            }
          }
        }

        .amount {
          font-size: 16px;
          color: #ec6564;

          &.income {
            color: #07c160;
          }
        }
      }
    }
  }
}
</style>