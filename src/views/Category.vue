<template>
  <div class="category-container">
    <!-- 搜索框 -->
    <div class="search-box">
      <el-input
        v-model="searchText"
        placeholder="搜索水果..."
        class="search-input"
        :prefix-icon="Search"
        clearable
      />
    </div>

    <!-- 主内容区 -->
    <div class="main-wrapper">
      <!-- 左侧分类导航 -->
      <div class="nav-scroll">
        <el-menu
          :default-active="activeIndex.toString()"
          class="category-menu"
          @select="switchCategory"
        >
          <el-menu-item
            v-for="(category, index) in categories"
            :key="index"
            :index="index.toString()"
          >
            <span>{{ category.name }}</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 右侧水果展示 -->
      <div class="content-scroll">
        <!-- 分类介绍 -->
        <div class="category-header">
          <el-image
            :src="activeCategory.cover"
            class="cover-img"
            fit="cover"
          />
          <div class="category-info">
            <h2 class="title">{{ activeCategory.name }}</h2>
            <p class="subtitle">{{ activeCategory.description }}</p>
          </div>
        </div>

        <!-- 水果网格 -->
        <div class="fruit-grid">
          <el-card
    class="fruit-card"
    v-for="(fruit, index) in filteredFruits"
    :key="index"
    shadow="hover"
    @click="showFruitDetail(fruit)"
  >
    <el-image
      :src="fruit.image"
      class="fruit-img"
      fit="cover"
    />
   <div class="fruit-info">
  <div class="name-price-wrapper">
    <h3 class="fruit-name">{{ fruit.name }}</h3>
    <div class="price-wrapper">
      <span class="price-symbol">¥</span>
      <span class="fruit-price">{{ fruit.price }}</span>
    </div>
  </div>
  <p class="fruit-origin">{{ fruit.origin }}</p>
  
  <!-- 修改按钮容器为flex布局 -->
  <div class="fruit-actions">
    <el-button
      type="primary"
      size="small"
      @click.stop="addToCart(fruit)"
      class="add-btn"
    >
      添加
    </el-button>
    <el-button
      :type="store.isFavorite(fruit.id) ? 'danger' : 'info'"
      size="small"
      @click.stop="toggleFavorite(fruit)"
      class="favorite-btn"
    >
      {{ store.isFavorite(fruit.id) ? '已收藏' : '收藏' }}
    </el-button>
  </div>
</div>
  </el-card>
        </div>
      </div>
    </div>

    <!-- 水果详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="selectedFruit.name"
      width="90%"
    >
      <div class="fruit-detail">
        <el-image
          :src="selectedFruit.image"
          class="detail-img"
          fit="cover"
        />
        <div class="detail-info">
          <p><strong>产地:</strong> {{ selectedFruit.origin }}</p>
          <p><strong>价格:</strong> ¥{{ selectedFruit.price }}/{{ selectedFruit.unit }}</p>
          <p><strong>描述:</strong> {{ selectedFruit.description }}</p>
          <p><strong>营养价值:</strong> {{ selectedFruit.nutrition }}</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="addToCart(selectedFruit)"
        >
          加入购物车
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { store } from '@/store/store'
import { ElMessage } from 'element-plus'

// 水果数据
const categories = ref([
  {
    name: "苹果类",
    description: "精选全球优质苹果",
    cover: "/src/img/1.png",
    fruits: [
      {
        id: 1,
        name: "新疆阿克苏冰糖心苹果",
        origin: "新疆阿克苏",
        price: 25.80,
        originalPrice: 32.90,
        unit: "箱(约5斤)",
        image: "/src/img/1.png",
        description: "新疆阿克苏核心产区，冰糖心明显，脆甜多汁，果皮薄，果肉细腻，甜度高，汁水丰富。",
        nutrition: "富含维生素C和膳食纤维，有助于消化和增强免疫力。每100克含维生素C约4毫克，膳食纤维2.4克。",
        sweetness: "高甜度(糖度14-16度)",
        storage: "阴凉通风处可保存15天，冷藏更佳"
      },
      {
        id: 2,
        name: "日本阳光富士苹果",
        origin: "日本青森",
        price: 45.90,
        originalPrice: 59.90,
        unit: "箱(6个装)",
        image: "/src/img/2.png",
        description: "日本顶级品种，全年超2000小时日照，蜜心明显，口感如蜜般清甜。",
        nutrition: "富含果胶和多酚，抗氧化能力是普通苹果的3倍。",
        sweetness: "超高甜度(糖度16-18度)",
        storage: "冷藏保存20天"
      },
      {
        id: 3,
        name: "甘肃花牛苹果",
        origin: "甘肃天水",
        price: 22.50,
        unit: "箱(约8斤)",
        image: "/src/img/3.png",
        description: "中国国家地理标志产品，果面鲜红有条纹，肉质松脆多汁，酸甜平衡。",
        nutrition: "维生素B族含量突出，有助于神经系统健康。",
        sweetness: "中甜度(糖度12-14度)",
        storage: "常温保存15天"
      },
      {
        id: 4,
        name: "美国红地厘蛇果",
        origin: "美国华盛顿",
        price: 38.80,
        originalPrice: 45.00,
        unit: "箱(12个装)",
        image: "/src/img/4.png",
        description: "经典蛇果品种，果形高桩五棱突出，肉质致密，香气浓郁持久。",
        nutrition: "富含槲皮素，有助于心血管健康。",
        sweetness: "中高甜度(糖度14-16度)",
        storage: "冷藏保存30天"
      },
      {
        id: 5,
        name: "山东红富士苹果",
        origin: "山东烟台",
        price: 19.90,
        originalPrice: 25.90,
        unit: "箱(约10斤)",
        image: "/src/img/5.png",
        description: "山东红富士苹果产自烟台优质产区，果形端正，色泽鲜艳，果肉细腻，汁水丰富，甜酸适口。烟台地区昼夜温差大，有利于糖分积累。",
        nutrition: "富含维生素C和果胶，有助于增强免疫力和降低胆固醇。每100克含维生素C约4毫克，果胶约0.8克。",
        sweetness: "中高甜度(糖度13-15度)",
        storage: "阴凉通风处可保存1个月，冷藏更佳"
      }
    ]
  },
  {
    name: "柑橘类",
    description: "酸甜多汁的柑橘家族",
    cover: "/src/img/6.png",
    fruits: [
      {
        id: 6,
        name: "美国新奇士橙",
        origin: "美国加州",
        price: 35.90,
        originalPrice: 45.90,
        unit: "箱(约8斤)",
        image: "/src/img/6.png",
        description: "美国新奇士橙果形饱满，色泽鲜艳，皮薄多汁，酸甜适中，带有独特香气。每个橙子都有Sunkist品牌标识。",
        nutrition: "富含维生素C和类黄酮，有助于增强免疫力和抗氧化。每100克含维生素C约53毫克，类黄酮含量丰富。",
        sweetness: "中甜度(糖度12-14度)",
        storage: "常温保存10-14天，冷藏可延长至3周"
      },
      {
        id: 7,
        name: "广东砂糖橘",
        origin: "广东四会",
        price: 15.90,
        unit: "箱(约5斤)",
        image: "/src/img/7.png",
        description: "皮薄易剥无籽，果肉脆嫩化渣，甜度纯正无酸味，春节必备年货。",
        nutrition: "维生素C含量是橙子的1.5倍。",
        sweetness: "高甜度(糖度15-17度)",
        storage: "常温保存10天"
      },
      {
        id: 8,
        name: "以色列葡萄柚",
        origin: "以色列",
        price: 29.90,
        originalPrice: 36.00,
        unit: "箱(6个装)",
        image: "/src/img/8.png",
        description: "红心品种，果肉深红多汁，富含花青素，适合减肥人群食用。",
        nutrition: "富含柚皮苷，有助于控制血糖。",
        sweetness: "低酸微苦(糖度10-12度)",
        storage: "冷藏保存14天"
      },
      {
        id: 9,
        name: "云南褚橙",
        origin: "云南哀牢山",
        price: 49.90,
        unit: "箱(约10斤)",
        image: "/src/img/9.png",
        description: "褚时健培育的明星品种，24:1黄金甜酸比，果肉细腻无渣。",
        nutrition: "富含类黄酮，抗氧化能力突出。",
        sweetness: "黄金甜酸比(糖度13-15度)",
        storage: "常温保存20天"
      },
      {
        id: 10,
        name: "埃及橙",
        origin: "埃及",
        price: 36.90,
        unit: "箱(约8斤)",
        image: "/src/img/10.png",
        description: "尼罗河沿岸种植，皮薄多汁，酸甜平衡，带有独特花香。",
        nutrition: "维生素C含量是普通橙子的1.2倍。",
        sweetness: "中高甜度(糖度13-15度)",
        storage: "常温保存30天"
      },
      {
        id: 11,
        name: "澳洲手指青柠",
        origin: "澳大利亚",
        price: 128.00,
        unit: "盒(100g)",
        image: "/src/img/11.png",
        description: "米其林餐厅专用食材，果肉呈鱼子酱状爆珠，带有独特柑橘清香。",
        nutrition: "柠檬酸含量是普通柠檬的2倍。",
        sweetness: "酸度突出(糖度6-8度)",
        storage: "冷藏保存10天"
      }
    ]
  },
  {
    name: "浆果类",
    description: "精致小巧的营养宝库",
    cover: "/src/img/12.png",
    fruits: [
      {
        id: 12,
        name: "澳洲无籽红提",
        origin: "澳大利亚",
        price: 69.90,
        originalPrice: 89.90,
        unit: "箱(约2斤)",
        image: "/src/img/12.png",
        description: "澳洲无籽红提果实饱满，色泽鲜红，皮薄无籽，口感脆甜，带有淡淡玫瑰香气。果粉是果实自然分泌的保护层。",
        nutrition: "富含花青素和多种矿物质，有助于抗氧化和心血管健康。每100克含钾约191毫克，花青素含量丰富。",
        sweetness: "中甜度(糖度15-17度)",
        storage: "冷藏保存10-14天，食用前清洗"
      },
      {
        id: 13,
        name: "智利进口车厘子",
        origin: "智利",
        price: 198.00,
        originalPrice: 258.00,
        unit: "箱(约5斤)",
        image: "/src/img/13.png",
        description: "智利车厘子产自南半球优质产区，果实饱满，色泽深红，果肉厚实，甜度高，口感脆爽。JJ级表示单果直径28-30mm。",
        nutrition: "富含花青素和铁元素，具有抗氧化作用，有助于美容养颜。每100克含铁约0.36毫克，花青素含量丰富。",
        sweetness: "中高甜度(糖度16-18度)",
        storage: "冷藏保存7-10天，食用前清洗"
      },
      {
        id: 14,
        name: "辽宁蓝莓",
        origin: "辽宁丹东",
        price: 45.00,
        unit: "盒(125g*6盒)",
        image: "/src/img/14.png",
        description: "人工采摘筛选，果粉完整，颗粒饱满，爆浆口感明显。",
        nutrition: "花青素含量是普通水果的10倍以上。",
        sweetness: "中甜度(糖度12-14度)",
        storage: "冷藏保存7天"
      },
      {
        id: 15,
        name: "江苏黑树莓",
        origin: "江苏溧水",
        price: 58.00,
        unit: "盒(100g*8盒)",
        image: "/src/img/15.png",
        description: "稀有品种，中空造型独特，果香浓郁，酸甜平衡。",
        nutrition: "鞣花酸含量高，具有抗癌特性。",
        sweetness: "清甜微酸(糖度10-12度)",
        storage: "冷藏保存3天"
      },
      {
        id: 16,
        name: "云南黄金莓",
        origin: "云南大理",
        price: 65.00,
        unit: "盒(150g*4盒)",
        image: "/src/img/16.png",
        description: "高原种植品种，金黄色泽，皮薄无籽，蜂蜜般香甜。",
        nutrition: "富含叶黄素，有助于眼部健康。",
        sweetness: "蜜甜无酸(糖度16-18度)",
        storage: "冷藏保存5天"
      }
    ]
  },
  {
    name: "热带水果",
    description: "阳光充足的热带美味",
    cover: "/src/img/17.png",
    fruits: [
      {
        id: 17,
        name: "海南金煌芒果",
        origin: "海南三亚",
        price: 39.90,
        originalPrice: 49.90,
        unit: "箱(约8斤)",
        image: "/src/img/17.png",
        description: "海南金煌芒果是芒果中的优质品种，果形大，单果重可达1-2斤。果肉橙黄色，肉质细腻，纤维极少。",
        nutrition: "富含维生素A、C和胡萝卜素，有助于保护视力和皮肤健康。每100克含维生素A约1500IU，维生素C约23毫克。",
        sweetness: "超高甜度(糖度18-22度)",
        storage: "常温放置2-3天后熟，熟后冷藏保存3-5天"
      },
      {
        id: 18,
        name: "泰国金枕头榴莲",
        origin: "泰国",
        price: 159.00,
        originalPrice: 199.00,
        unit: "个(约3-4斤)",
        image: "/src/img/18.png",
        description: "泰国金枕头榴莲是榴莲中的优质品种，果肉金黄，口感细腻，甜度高，气味浓郁但不刺鼻。A级表示果肉饱满，出肉率高。",
        nutrition: "富含蛋白质、脂肪和多种维生素，热量较高，适量食用可补充能量。每100克含蛋白质约2.6克，脂肪约3.3克。",
        sweetness: "高甜度(糖度25-30度)",
        storage: "未开果常温保存，开果后冷藏并尽快食用"
      },
      {
        id: 19,
        name: "越南红心火龙果",
        origin: "越南",
        price: 29.90,
        originalPrice: 39.90,
        unit: "箱(约4个)",
        image: "/src/img/19.png",
        description: "越南红心火龙果果皮鲜红，果肉紫红色，富含天然色素，口感清甜多汁，籽粒细小可食用。红心火龙果的花青素含量高于白心品种。",
        nutrition: "富含花青素和膳食纤维，有助于抗氧化和肠道健康。每100克含膳食纤维约1.6克，花青素含量丰富。",
        sweetness: "中甜度(糖度13-15度)",
        storage: "阴凉处保存7天，冷藏可延长至2周"
      },
      {
        id: 20,
        name: "菲律宾菠萝蜜",
        origin: "菲律宾",
        price: 39.90,
        unit: "个(约8-10斤)",
        image: "/src/img/20.png",
        description: "干苞品种，果肉金黄厚实，Q弹有嚼劲，带有焦糖香气。",
        nutrition: "富含植物蛋白和膳食纤维。",
        sweetness: "高甜度(糖度18-20度)",
        storage: "常温保存5天"
      },
      {
        id: 21,
        name: "海南贵妃芒",
        origin: "海南乐东",
        price: 32.80,
        unit: "箱(约6斤)",
        image: "/src/img/21.png",
        description: "红黄渐变果皮，果核薄如纸，果肉细腻无纤维，入口即化。",
        nutrition: "β-胡萝卜素含量是普通芒果的3倍。",
        sweetness: "蜜甜无丝(糖度20-22度)",
        storage: "常温催熟后冷藏"
      },
      {
        id: 22,
        name: "泰国椰皇",
        origin: "泰国",
        price: 15.90,
        unit: "个",
        image: "/src/img/22.png",
        description: "老椰品种，椰肉厚实雪白，椰水清甜富含电解质。",
        nutrition: "富含月桂酸，具有抗菌作用。",
        sweetness: "清甜爽口(糖度8-10度)",
        storage: "冷藏保存7天"
      },
      {
        id: 23,
        name: "台湾凤梨释迦",
        origin: "中国台湾",
        price: 79.90,
        originalPrice: 99.90,
        unit: "个(约1-1.5斤)",
        image: "/src/img/23.png",
        description: "台湾凤梨释迦是释迦和凤梨的杂交品种，果肉Q弹，甜度高，带有凤梨香气，籽少肉多，口感独特。",
        nutrition: "富含维生素B群和矿物质，有助于新陈代谢和神经系统健康。每100克含维生素B1约0.1毫克，钾约250毫克。",
        sweetness: "超高甜度(糖度20-25度)",
        storage: "常温放置变软后食用，熟后冷藏保存2-3天"
      }
    ]
  }
])
const toggleFavorite = (fruit) => {
  if (!store.isLoggedIn) {
    ElMessage.warning('请先登录后再收藏')
    return
  }
  const isFavorite = store.toggleFavorite(fruit)
  ElMessage.success(isFavorite ? '已添加到收藏' : '已取消收藏')
}
// 状态管理
const activeIndex = ref(0)
const searchText = ref('')
const dialogVisible = ref(false)
const selectedFruit = ref({})

// 计算属性
const activeCategory = computed(() => categories.value[activeIndex.value] || {})
const filteredFruits = computed(() => {
  const fruits = activeCategory.value.fruits || []
  if (!searchText.value) return fruits
  return fruits.filter(fruit => 
    fruit.name.includes(searchText.value) || 
    fruit.origin.includes(searchText.value)
  )
})

// 方法
const switchCategory = (index) => {
  activeIndex.value = Number(index)
}

const showFruitDetail = (fruit) => {
  selectedFruit.value = fruit
  dialogVisible.value = true
}

const addToCart = (fruit) => {
  store.addToCart({
    id: fruit.id,
    name: fruit.name,
    price: fruit.price,
    imageUrl: fruit.image,
    quantity: 1
  })
  ElMessage.success(`已添加 ${fruit.name} 到购物车`)
}
</script>

<style scoped>
.category-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  padding-bottom: 60px; /* 为底部导航留出空间 */
}

/* 搜索框 */
.search-box {
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-input {
  width: 100%;
}

/* 主内容区 */
.main-wrapper {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左侧分类导航 */
.nav-scroll {
  width: 90px;
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  overflow-y: auto;
}

.category-menu {
  border-right: none;
}

.category-menu .el-menu-item {
  padding: 0 10px !important;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}

/* 右侧内容 */
.content-scroll {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

/* 分类介绍 */
.category-header {
  position: relative;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
}

.cover-img {
  width: 100%;
  height: 100%;
}

.category-info {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 15px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
}

.title {
  font-size: 18px;
  margin-bottom: 5px;
}

.subtitle {
  font-size: 12px;
  opacity: 0.9;
}

/* 水果网格 */
.fruit-grid { 
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 改为两列布局 */
  gap: 8px;
}

.fruit-card {
  cursor: pointer;
  transition: transform 0.3s;
  margin-bottom: 8px; 
} 
.fruit-img {
  width: 100%;
  height: 85px; /* 缩小图片高度 */
}

.fruit-info {
  padding: 8px;
}
.fruit-actions {
  margin-left: -8px;
  display: flex; 
  margin-right: -4px;
  gap: 0px; /* 按钮间距 */
  margin-top: 8px;
}
.fruit-actions .el-button {
  margin-right: -6px; /* 给按钮添加负的右边距 */
  padding: 2px 4px; /* 适当减小按钮内边距 */
}
.name-price-wrapper {
  display: flex;
  flex-direction: column; /* 改为垂直布局 */
  margin-bottom: 5px;
}

.fruit-name {
  font-size: 12px;
  font-weight: bold;
  margin: 0;
  margin-left: -8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 140%; 
}

.price-wrapper {
  display: flex;
  align-items: baseline;
  margin-top: 4px; /* 增加与名称的间距 */
}

.price-symbol {
  margin-left: -8px;
  font-size: 12px;
  color: #f56c6c;
  margin-right: 2px;
}

.fruit-price { 
  font-size: 12px;
  color: #f56c6c;
  font-weight: bold;
}

.fruit-origin {
  margin-left: -8px;
  font-size: 10px;
  color: #909399;
  margin-bottom: 10px;
}

/* 水果详情 */
.fruit-detail {
  display: flex;
  flex-direction: column;
  gap: 15px;
} 

.detail-img {
  width: 100%;
  height: 200px;
  border-radius: 8px;
}

.detail-info {
  flex: 1;
}

.detail-info p {
  margin-bottom: 10px;
  line-height: 1.6;
  font-size: 14px;
}
</style>