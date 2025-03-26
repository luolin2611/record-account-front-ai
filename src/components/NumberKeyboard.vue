<template>
  <van-popup
    :show="modelValue"
    position="bottom"
    :overlay="false"
    class="number-keyboard"
    @update:show="$emit('update:modelValue', $event)"
  >
    <div class="keyboard-content">
      <div class="number-part">
        <div class="key-row">
          <div class="key" @click="onInput('1')">1</div>
          <div class="key" @click="onInput('2')">2</div>
          <div class="key" @click="onInput('3')">3</div>
          <div class="key delete" @click="onDelete">
            <van-icon name="delete-o" size="24" />
          </div>
        </div>
        <div class="key-row">
          <div class="key" @click="onInput('4')">4</div>
          <div class="key" @click="onInput('5')">5</div>
          <div class="key" @click="onInput('6')">6</div>
          <div class="key plus" @click="onInput('+')">+</div>
        </div>
        <div class="key-row">
          <div class="key" @click="onInput('7')">7</div>
          <div class="key" @click="onInput('8')">8</div>
          <div class="key" @click="onInput('9')">9</div>
          <div class="key confirm" @click="onConfirm">确定</div>
        </div>
        <div class="key-row">
          <div class="key currency">¥</div>
          <div class="key" @click="onInput('0')">0</div>
          <div class="key" @click="onInput('.')">.</div>
          <div class="key" @click="onConfirm">取消</div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script lang="ts">
export default {
  name: 'NumberKeyboard'
}
</script>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'input', 'delete', 'confirm'])

const onInput = (value: string) => {
  emit('input', value)
}

const onDelete = () => {
  emit('delete')
}

const onConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<style lang="less" scoped>
.number-keyboard {
  user-select: none;
  
  .keyboard-content {
    
    .number-part {
      .key-row {
        display: flex;

        .key {
          flex: 1;
          height: 78px;
          background: #3f4552;
          border: .5px solid #353946;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 500;
          color: #fff;
          cursor: pointer;
          
          &:last-child {
            margin-right: 0;
          }
          
          &:active {
            opacity: 0.7;
          }
          
          &.delete {
            background: #3f4552;
            .van-icon {
              color: #fff;
            }
          }
          
          &.plus {
            background: #3f4552;
            font-size: 24px;
          }
          
          &.confirm {
            background: #ec6564;
            border: none;
            font-size: 16px;
          }
          
          &.currency {
            color: #969799;
            font-size: 16px;
          }
        }
      }
    }
  }
}

// 修复 van-popup 的默认样式
:deep(.van-popup) {
  background: transparent;
}
</style> 