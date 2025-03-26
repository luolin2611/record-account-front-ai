<template>
  <div class="record">
    <!-- 顶部导航栏 -->
    <div class="header">
      <van-icon name="cross" size="20" @click="router.back()" />
      <div class="btns">
        <span :class="{ active: activeTab === '0' }" @click="switchTab('0')">流出</span>
        <span :class="{ active: activeTab === '1' }" @click="switchTab('1')">流入</span>
      </div>
    </div>

    <div class="content">
      <!-- 金额输入 -->
      <div class="amount-input">
        <div class="label">账单金额</div>
        <div class="amount" @click="showKeyboard = true">
          <span class="currency">¥</span>
          <span class="value">{{ formattedAmount }}</span>
        </div>
      </div>

      <!-- 分类选择 -->
      <div class="category-section">
        <van-swipe class="category-swipe" :loop="false" style="padding-bottom: 25px;" indicator-color="#3f465a"
          :show-indicators="true">
          <van-swipe-item v-for="(page, pageIndex) in categoryPages" :key="pageIndex">
            <div class="category-grid">
              <div v-for="category in page" :key="category.id" class="category-item"
                :class="{ active: selectedCategory?.id === category.id }" @click="selectCategory(category)">
                <div class="icon-wrapper" :class="{ active: selectedCategory?.id === category.id }">
                  <i :class="['iconfont', 'icon-' + category.iconName]"></i>
                </div>
                <span>{{ category.classifyName }}</span>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>

      <!-- 日期和备注 -->
      <div class="date-remark">
        <div class="date-input" @click="showDatePicker = true">
          <van-icon name="calendar-o" />
          <span>{{ formatDate(selectedDate) }}</span>
        </div>
        <div class="remark-input">
          <van-field v-model="remark" placeholder="请输入备注信息（最多140字）" maxlength="140" />
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="bottom-buttons">
        <van-button plain type="danger" block @click="onDelete">删除</van-button>
        <van-button type="danger" block @click="onSave">保存</van-button>
      </div>
    </div>

    <!-- 数字键盘 -->
    <number-keyboard v-model:show="showKeyboard" @input="onInput" @delete="onDelete" @confirm="onConfirm" />

    <!-- 日期选择器 -->
    <van-calendar v-model:show="showDatePicker" :min-date="minDate" :max-date="maxDate" @confirm="onDateConfirm"
      color="#ff9a9e" :show-confirm="true" title="选择日期" position="bottom" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import dayjs from 'dayjs'
import NumberKeyboard from '@/components/NumberKeyboard.vue'
import { getClassifyList } from '@/api/common'
import type { ClassifyItem } from '@/api/types'
import { recordBill } from '@/api/home'

const router = useRouter()
const activeTab = ref('0') // 默认支出
const amount = ref('')
const showKeyboard = ref(false)
const remark = ref('')
const showDatePicker = ref(false)
const selectedDate = ref(new Date())
const categories = ref<ClassifyItem[]>([])
const selectedCategory = ref<ClassifyItem | null>(null)

// 日期选择器的最小和最大日期
const maxDate = new Date()
const minDate = dayjs().subtract(1, 'year').toDate() // 最多可以选择一年前的日期

// 每页显示的分类数量
const ITEMS_PER_PAGE = 10

// 获取分类列表
const fetchCategories = async (type: string) => {
  const res = await getClassifyList(type)
  if (res) {
    categories.value = res
    selectedCategory.value = res[0] || null
  }
}

// 切换收支类型
const switchTab = async (type: string) => {
  activeTab.value = type
  await fetchCategories(type)
}

// 将分类数据分页
const categoryPages = computed(() => {
  const pages = []
  for (let i = 0; i < categories.value.length; i += ITEMS_PER_PAGE) {
    pages.push(categories.value.slice(i, i + ITEMS_PER_PAGE))
  }
  return pages
})

// 选择分类
const selectCategory = (category: ClassifyItem) => {
  selectedCategory.value = category
}

// 格式化日期显示
const formatDate = (date: Date) => {
  return dayjs(date).format('MM月DD日')
}

// 格式化金额显示
const formattedAmount = computed(() => {
  if (!amount.value) return '0.00'
  if (amount.value.includes('.')) {
    const [integer, decimal] = amount.value.split('.')
    return `${integer}.${decimal.padEnd(2, '0')}`
  }
  return `${amount.value}.00`
})

// 输入金额
const onInput = (value: string) => {
  // 如果已经有小数点且输入的是小数点，则忽略
  if (amount.value.includes('.') && value === '.') {
    return
  }

  // 如果已经有小数点，检查小数位数
  if (amount.value.includes('.')) {
    const [, decimal] = amount.value.split('.')
    if (decimal.length >= 2) {
      return
    }
  }

  // 如果是第一个字符且是小数点，自动补0
  if (amount.value === '' && value === '.') {
    amount.value = '0.'
    return
  }

  // 如果整数部分以0开头且不是小数点，则替换0
  if (amount.value === '0' && value !== '.') {
    amount.value = value
    return
  }

  amount.value = amount.value + value
}

// 删除金额
const onDelete = () => {
  amount.value = amount.value.slice(0, -1)
}

// 确认输入金额
const onConfirm = () => {
  showKeyboard.value = false
}

// 确认日期选择
const onDateConfirm = (value: Date) => {
  selectedDate.value = value
  showDatePicker.value = false
}

// 保存记录
const onSave = async () => {
  if (!amount.value) {
    showToast('请输入金额')
    return
  }
  if (!selectedCategory.value) {
    showToast('请选择分类')
    return
  }

  // 构建保存的数据
  const data = {
    billMoney: parseFloat(amount.value),
    classifyId: selectedCategory.value.id,
    classifyName: selectedCategory.value.classifyName,
    classifyType: activeTab.value, // '0'-支出，'1'-收入
    recordTime: dayjs(selectedDate.value).format('YYYY-MM-DD'),
    remark: remark.value || '' // 备注可以为空
  }

  // 调用记账接口
  await recordBill(data)
  showToast('记账成功')
  router.back()
}

onMounted(() => {
  fetchCategories('0') // 默认加载支出分类
})
</script>

<style lang="less" scoped>
.record {
  min-height: 100vh;
  background: #ffffff;

  .content {
    padding: 16px;
  }

  .header {
    display: flex;
    align-items: center;
    background: white;
    border-bottom: 1px solid #f7f8fa;
    padding: 10px 20px;

    .btns {
      flex: 1;
      display: flex;
      justify-content: center;
      height: 32px;
      line-height: 32px;

      &>span {
        cursor: pointer;

        &:first-child {
          background: transparent;
          color: #404659;
          border: 1px solid #404659;

          &.active {
            background: #ec6564;
            color: #fff;
            border: none;
          }
        }

        &:last-child {
          background: transparent;
          color: #404659;
          border: 1px solid #404659;

          &.active {
            background: #66d69a;
            color: #fff;
            border: none;
          }
        }
      }
    }
  }

  .type-tabs {
    margin: -16px -16px 0;

    :deep(.van-tabs__wrap) {
      padding: 0 16px;
      background: #fff;
    }

    :deep(.van-tab) {
      flex: 1;
      font-size: 14px;
    }

    :deep(.van-tabs__nav--card) {
      border: none;
      margin: 0;

      .van-tab {
        border: none;
        color: #323233;
        background: transparent;

        &--active {
          color: #fff;
          background: #445066;
        }
      }
    }
  }

  .amount-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    background: #fff;
    margin: 16px -16px;
    padding: 16px;

    .label {
      font-size: 16px;
      font-weight: bold;
      color: #323233;
      margin-bottom: 8px;
    }

    .amount {
      display: flex;
      align-items: baseline;
      font-size: 32px;
      color: #ff9a9e;
      cursor: pointer;

      .currency {
        font-size: 24px;
        margin-right: 4px;
      }

      .value {
        min-width: 120px;
        text-align: right;
      }
    }
  }

  .category-section {
    margin: 16px -16px;
    background: #fff;
    padding: 16px;

    .category-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(2, auto);
      gap: 16px;
      padding: 8px 0;

      .category-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        .icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #f7f8fa;
          display: flex;
          align-items: center;
          justify-content: center;

          &.active {
            background: #ec6564;

            .iconfont {
              color: #fff;
            }
          }

          .iconfont {
            font-size: 24px;
            color: #969799;
          }
        }

        span {
          font-size: 12px;
          color: #323233;
        }

        &.active span {
          color: #ff9a9e;
        }
      }
    }
  }

  .date-remark {
    background: #fff;
    margin: 16px -16px;
    padding: 16px;
    display: flex;
    align-items: center;

    .date-input {
      flex: none;
      display: flex;
      align-items: center;
      gap: 8px;
      padding-right: 16px;
      border-right: 1px solid #ebedf0;
      cursor: pointer;

      .van-icon {
        color: #969799;
      }

      span {
        font-size: 14px;
        color: #323233;
      }
    }

    .remark-input {
      flex: 1;
      margin-left: 16px;

      :deep(.van-field) {
        padding: 0;

        .van-field__control {
          height: 20px;
          min-height: 20px;
        }
      }
    }
  }

  .reimbursement {
    background: #fff;
    margin: 16px -16px;
    padding: 16px;

    :deep(.van-checkbox__label) {
      display: flex;
      align-items: center;
      gap: 8px;

      .van-icon {
        color: #969799;
      }

      span {
        font-size: 14px;
        color: #323233;
      }
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
      border-radius: 4px;

      &--danger {
        background: #ec6564;
        border-color: #ec6564;
      }
    }
  }
}

:deep(.van-nav-bar) {
  background: #fff;

  .van-icon {
    color: #323233;
  }
}

:deep(.van-field__control) {
  font-size: 14px;

  &::placeholder {
    color: #969799;
  }
}

// 收入状态下的样式
.record[data-type="1"] {
  .category-section {
    .category-item {
      .icon-wrapper {
        &.active {
          background: #66d69a !important;
        }
      }
    }
  }
}
</style>
