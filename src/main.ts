import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { 
  Button,
  Cell,
  CellGroup,
  Image as VanImage,
  Icon,
  Tabbar,
  TabbarItem,
  SwipeCell,
  FloatingBubble,
  Toast,
  ConfigProvider,
  NavBar,
  Form,
  Field,
  Dialog,
  Uploader,
  Search
} from 'vant'

// 引入全局样式
import 'vant/lib/index.css'

const app = createApp(App)

// 注册 Vant 组件
app.use(ConfigProvider)
app.use(Button)
app.use(Cell)
app.use(CellGroup)
app.use(VanImage)
app.use(Icon)
app.use(Tabbar)
app.use(TabbarItem)
app.use(SwipeCell)
app.use(FloatingBubble)
app.use(Toast)
app.use(NavBar)
app.use(Form)
app.use(Field)
app.use(Dialog)
app.use(Uploader)
app.use(Search)

// 使用路由
app.use(router)

app.use(createPinia())

app.mount('#app') 