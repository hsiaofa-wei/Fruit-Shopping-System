<template>
  <div class="home-container">
    <!-- 顶部logo -->
    <div class="logo-container">
      <div class="logo-box">
        <div class="logo-icon">
          <el-icon :size="30" color="#67C23A">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 0 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 0 0-54.272-54.336L457.6 600.064l-1.408-1.408v-0.064z"/>
            </svg>
          </el-icon>
        </div>
        <div class="logo-text">
          <span class="main-text">水果购物系统</span>
          <span class="sub-text">Fresh Fruit Shopping</span>
        </div>
      </div>
    </div> 
    <!-- 搜索框部分 -->
    <div class="search-container">
      <el-input
        v-model="searchText"
        placeholder="搜索新鲜水果"
        :prefix-icon="Search"
        clearable
      />
    </div>

    <!-- 轮播图部分 -->
    <el-carousel
      class="swiper"
      :interval="3000"
      height="180px"
      indicator-position="outside"
    >
      <el-carousel-item v-for="(item, index) in swiperList" :key="index">
        <img :src="item.imgUrl" class="carousel-image" />
      </el-carousel-item>
    </el-carousel>

    <!-- 系统公告部分 -->
    <el-alert
      :title="noticeText"
      type="info"
      :closable="false"
      show-icon
      class="notice-bar"
    />

    <!-- 水果分类展示 -->
    <div class="navs">
      <el-tag
        class="category-tag"
        v-for="(item, index) in categoryList"
        :key="index"
        size="large"
        effect="plain"
        @click="filterByCategory(item.type)"
      >
        <el-icon :size="20" style="margin-right:5px">
          <component :is="item.icon" />
        </el-icon>
        {{ item.name }}
      </el-tag>
    </div>

    <!-- 推荐水果部分 -->
    <h3 class="recommend-title">当季热卖</h3>
    <div class="fruit-list">
     <el-card
    class="fruit-card"
    v-for="(item, index) in filteredFruits"
    :key="index"
    shadow="hover"
  >
    <img :src="item.imgUrl" class="fruit-image" @click="showDetail(item)" />
    <div class="fruit-name">{{ item.name }}</div>
    <div class="price-container">
      <span class="current-price">￥{{ item.price }}<span v-if="item.originalPrice" class="original-price">
        ￥{{ item.originalPrice }}
      </span></span>
      <div class="action-buttons">
        <el-button 
          type="primary" 
          size="small" 
          class="add-cart-btn"
          @click.stop="addToCart(item)"
        >
          添加
        </el-button>
        <el-button 
          :type="store.isFavorite(item.id) ? 'danger' : 'info'" 
          size="small" 
          class="favorite-btn"
          @click.stop="toggleFavorite(item)"
        >
          {{ store.isFavorite(item.id) ? '已收藏' : '收藏' }}
        </el-button>
      </div>
    </div>
  </el-card>
    </div>

    <!-- 水果详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="selectedFruit.name"
      width="90%"
    >
      <div class="fruit-detail">
        <img :src="selectedFruit.imgUrl" class="detail-img" />
         <div class="detail-info">
          <p><strong>产地:</strong> {{ selectedFruit.origin }}</p>
          <p><strong>价格:</strong> ¥{{ selectedFruit.price }}/{{ selectedFruit.unit }}</p>
          <p><strong>甜度:</strong> {{ selectedFruit.sweetness }}</p>
          <p><strong>储存方式:</strong> {{ selectedFruit.storage }}</p>
          <p><strong>描述:</strong> {{ selectedFruit.description }}</p>
          <p><strong>营养价值:</strong> {{ selectedFruit.nutrition }}</p>
          <p><strong>食用建议:</strong> {{ selectedFruit.suggestion }}</p>
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
import { store } from '@/store/store'
import { 
  Search,
  Goods,
  Apple,
  Orange,
  Grape, 
  Watermelon 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchText = ref('')
const currentCategory = ref('all')
const dialogVisible = ref(false)
const selectedFruit = ref({})

const swiperList = ref([ 
  { imgUrl: '/src/img/5.png' },
  { imgUrl: '/src/img/7.png' },
  { imgUrl: '/src/img/12.png' },
  { imgUrl: '/src/img/17.png' },
  { imgUrl: '/src/img/22.png' }
])
const categoryList = ref([
  { name: '全部', type: 'all', icon: Goods },
  { name: '苹果类', type: 'apple', icon: Apple },
  { name: '柑橘类', type: 'citrus', icon: Orange },
  { name: '浆果类', type: 'berry', icon: Grape },
  { name: '热带水果', type: 'tropical', icon: Watermelon },   
])
const noticeText = ref('新鲜水果每日直达 全场满99元包邮')
const fruitList = ref([
  {
    id: 1,
    name: '新疆阿克苏冰糖心苹果',
    type: 'apple',
    imgUrl: '/src/img/1.png',
    price: '25.80',
    originalPrice: '32.90',
    origin: '新疆阿克苏',
    unit: '箱(约5斤)',
    sweetness: '高甜度(糖度14-16度)',
    storage: '阴凉通风处可保存15天，冷藏更佳',
    description: '新疆阿克苏核心产区，冰糖心明显，脆甜多汁，果皮薄，果肉细腻，甜度高，汁水丰富。',
    nutrition: '富含维生素C和膳食纤维，有助于消化和增强免疫力。每100克含维生素C约4毫克，膳食纤维2.4克。',
    suggestion: '直接食用最佳，也可制作苹果派或榨汁。建议冷藏后食用口感更佳。'
  },
  {
    id: 2,
    name: '日本阳光富士苹果',
    type: 'apple',
    imgUrl: '/src/img/2.png',
    price: '45.90',
    originalPrice: '59.90',
    origin: '日本青森',
    unit: '箱(6个装)',
    sweetness: '超高甜度(糖度16-18度)',
    storage: '冷藏保存20天',
    description: '日本顶级品种，全年超2000小时日照，蜜心明显，口感如蜜般清甜。',
    nutrition: '富含果胶和多酚，抗氧化能力是普通苹果的3倍。'
  },
  {
    id: 3,
    name: '甘肃花牛苹果',
    type: 'apple',
    imgUrl: '/src/img/3.png',
    price: '22.50',
    origin: '甘肃天水',
    unit: '箱(约8斤)',
    sweetness: '中甜度(糖度12-14度)',
    storage: '常温保存15天',
    description: '中国国家地理标志产品，果面鲜红有条纹，肉质松脆多汁，酸甜平衡。',
    nutrition: '维生素B族含量突出，有助于神经系统健康。'
  },
  {
    id: 4,
    name: '美国红地厘蛇果',
    type: 'apple',
    imgUrl: '/src/img/4.png',
    price: '38.80',
    originalPrice: '45.00',
    origin: '美国华盛顿',
    unit: '箱(12个装)',
    sweetness: '中高甜度(糖度14-16度)',
    storage: '冷藏保存30天',
    description: '经典蛇果品种，果形高桩五棱突出，肉质致密，香气浓郁持久。',
    nutrition: '富含槲皮素，有助于心血管健康。'
  }, 
  {
    id: 5,
    name: '山东红富士苹果',
    type: 'apple',
    imgUrl: '/src/img/5.png',
    price: '19.90',
    originalPrice: '25.90',
    origin: '山东烟台',
    unit: '箱(约10斤)',
    sweetness: '中高甜度(糖度13-15度)',
    storage: '阴凉通风处可保存1个月，冷藏更佳',
    description: '山东红富士苹果产自烟台优质产区，果形端正，色泽鲜艳，果肉细腻，汁水丰富，甜酸适口。烟台地区昼夜温差大，有利于糖分积累。',
    nutrition: '富含维生素C和果胶，有助于增强免疫力和降低胆固醇。每100克含维生素C约4毫克，果胶约0.8克。',
    suggestion: '直接食用或制作苹果派。表皮蜡质是天然保护层，可带皮食用。'
  },
  {
    id: 6,
    name: '美国新奇士橙',
    type: 'citrus',
    imgUrl: '/src/img/6.png',
    price: '35.90',
    originalPrice: '45.90',
    origin: '美国加州',
    unit: '箱(约8斤)',
    sweetness: '中甜度(糖度12-14度)',
    storage: '常温保存10-14天，冷藏可延长至3周',
    description: '美国新奇士橙果形饱满，色泽鲜艳，皮薄多汁，酸甜适中，带有独特香气。每个橙子都有Sunkist品牌标识。',
    nutrition: '富含维生素C和类黄酮，有助于增强免疫力和抗氧化。每100克含维生素C约53毫克，类黄酮含量丰富。',
    suggestion: '榨汁或直接食用最佳。表皮光滑有弹性表示新鲜度高。'
  },
  {
    id: 7,
    name: '广东砂糖橘',
    type: 'citrus',
    imgUrl: '/src/img/7.png',
    price: '15.90',
    origin: '广东四会',
    unit: '箱(约5斤)',
    sweetness: '高甜度(糖度15-17度)',
    storage: '常温保存10天',
    description: '皮薄易剥无籽，果肉脆嫩化渣，甜度纯正无酸味，春节必备年货。',
    nutrition: '维生素C含量是橙子的1.5倍。'
  },
  {
    id: 8,
    name: '以色列葡萄柚',
    type: 'citrus',
    imgUrl: '/src/img/8.png',
    price: '29.90',
    originalPrice: '36.00',
    origin: '以色列',
    unit: '箱(6个装)',
    sweetness: '低酸微苦(糖度10-12度)',
    storage: '冷藏保存14天',
    description: '红心品种，果肉深红多汁，富含花青素，适合减肥人群食用。',
    nutrition: '富含柚皮苷，有助于控制血糖。'
  },
  {
    id: 9,
    name: '云南褚橙',
    type: 'citrus',
    imgUrl: '/src/img/9.png',
    price: '49.90',
    origin: '云南哀牢山',
    unit: '箱(约10斤)',
    sweetness: '黄金甜酸比(糖度13-15度)',
    storage: '常温保存20天',
    description: '褚时健培育的明星品种，24:1黄金甜酸比，果肉细腻无渣。',
    nutrition: '富含类黄酮，抗氧化能力突出。'
  },
  {
    id: 10,
    name: '埃及橙',
    type: 'citrus',
    imgUrl: '/src/img/10.png',
    price: '36.90',
    origin: '埃及',
    unit: '箱(约8斤)',
    sweetness: '中高甜度(糖度13-15度)',
    storage: '常温保存30天',
    description: '尼罗河沿岸种植，皮薄多汁，酸甜平衡，带有独特花香。',
    nutrition: '维生素C含量是普通橙子的1.2倍。'
  },
  {
    id: 11,
    name: '澳洲手指青柠',
    type: 'citrus',
    imgUrl: '/src/img/11.png',
    price: '128.00',
    origin: '澳大利亚',
    unit: '盒(100g)',
    sweetness: '酸度突出(糖度6-8度)',
    storage: '冷藏保存10天',
    description: '米其林餐厅专用食材，果肉呈鱼子酱状爆珠，带有独特柑橘清香。',
    nutrition: '柠檬酸含量是普通柠檬的2倍。'
  },
  {
    id: 12,
    name: '澳洲无籽红提',
    type: 'berry',
    imgUrl: '/src/img/12.png',
    price: '69.90',
    originalPrice: '89.90',
    origin: '澳大利亚',
    unit: '箱(约2斤)',
    sweetness: '中甜度(糖度15-17度)',
    storage: '冷藏保存10-14天，食用前清洗',
    description: '澳洲无籽红提果实饱满，色泽鲜红，皮薄无籽，口感脆甜，带有淡淡玫瑰香气。果粉是果实自然分泌的保护层。',
    nutrition: '富含花青素和多种矿物质，有助于抗氧化和心血管健康。每100克含钾约191毫克，花青素含量丰富。',
    suggestion: '直接食用最佳，也可制作水果沙拉或装饰蛋糕。带皮食用营养价值更高。'
  },
  {
    id: 13,
    name: '智利进口车厘子',
    type: 'berry',
    imgUrl: '/src/img/13.png',
    price: '198.00',
    originalPrice: '258.00',
    origin: '智利',
    unit: '箱(约5斤)',
    sweetness: '中高甜度(糖度16-18度)',
    storage: '冷藏保存7-10天，食用前清洗',
    description: '智利车厘子产自南半球优质产区，果实饱满，色泽深红，果肉厚实，甜度高，口感脆爽。JJ级表示单果直径28-30mm。',
    nutrition: '富含花青素和铁元素，具有抗氧化作用，有助于美容养颜。每100克含铁约0.36毫克，花青素含量丰富。',
    suggestion: '直接食用最佳，也可制作水果拼盘或蛋糕装饰。冷藏后口感更脆甜。'
  },
  {
    id: 14,
    name: '辽宁蓝莓',
    type: 'berry',
    imgUrl: '/src/img/14.png',
    price: '45.00',
    origin: '辽宁丹东',
    unit: '盒(125g*6盒)',
    sweetness: '中甜度(糖度12-14度)',
    storage: '冷藏保存7天',
    description: '人工采摘筛选，果粉完整，颗粒饱满，爆浆口感明显。',
    nutrition: '花青素含量是普通水果的10倍以上。'
  },
  {
    id: 15,
    name: '江苏黑树莓',
    type: 'berry',
    imgUrl: '/src/img/15.png',
    price: '58.00',
    origin: '江苏溧水',
    unit: '盒(100g*8盒)',
    sweetness: '清甜微酸(糖度10-12度)',
    storage: '冷藏保存3天',
    description: '稀有品种，中空造型独特，果香浓郁，酸甜平衡。',
    nutrition: '鞣花酸含量高，具有抗癌特性。'
  },
  {
    id: 16,
    name: '云南黄金莓',
    type: 'berry',
    imgUrl: '/src/img/16.png',
    price: '65.00',
    origin: '云南大理',
    unit: '盒(150g*4盒)',
    sweetness: '蜜甜无酸(糖度16-18度)',
    storage: '冷藏保存5天',
    description: '高原种植品种，金黄色泽，皮薄无籽，蜂蜜般香甜。',
    nutrition: '富含叶黄素，有助于眼部健康。'
  },
  {
    id: 17,
    name: '海南金煌芒果',
    type: 'tropical',
    imgUrl: '/src/img/17.png',
    price: '39.90',
    originalPrice: '49.90',
    origin: '海南三亚',
    unit: '箱(约8斤)',
    sweetness: '超高甜度(糖度18-22度)',
    storage: '常温放置2-3天后熟，熟后冷藏保存3-5天',
    description: '海南金煌芒果是芒果中的优质品种，果形大，单果重可达1-2斤。果肉橙黄色，肉质细腻，纤维极少。',
    nutrition: '富含维生素A、C和胡萝卜素，有助于保护视力和皮肤健康。每100克含维生素A约1500IU，维生素C约23毫克。',
    suggestion: '制作芒果甜品、沙拉或直接食用。表皮出现黑点表示成熟可食用。'
  },
 
  {
    id: 18,
    name: '泰国金枕头榴莲',
    type: 'tropical',
    imgUrl: '/src/img/18.png',
    price: '159.00',
    originalPrice: '199.00',
    origin: '泰国',
    unit: '个(约3-4斤)',
    sweetness: '高甜度(糖度25-30度)',
    storage: '未开果常温保存，开果后冷藏并尽快食用',
    description: '泰国金枕头榴莲是榴莲中的优质品种，果肉金黄，口感细腻，甜度高，气味浓郁但不刺鼻。A级表示果肉饱满，出肉率高。',
    nutrition: '富含蛋白质、脂肪和多种维生素，热量较高，适量食用可补充能量。每100克含蛋白质约2.6克，脂肪约3.3克。',
    suggestion: '直接食用果肉，也可制作榴莲甜品。建议搭配山竹食用可降火。'
  }, 
  {
    id: 19,
    name: '越南红心火龙果',
    type: 'tropical',
    imgUrl: '/src/img/19.png',
    price: '29.90',
    originalPrice: '39.90',
    origin: '越南',
    unit: '箱(约4个)',
    sweetness: '中甜度(糖度13-15度)',
    storage: '阴凉处保存7天，冷藏可延长至2周',
    description: '越南红心火龙果果皮鲜红，果肉紫红色，富含天然色素，口感清甜多汁，籽粒细小可食用。红心火龙果的花青素含量高于白心品种。',
    nutrition: '富含花青素和膳食纤维，有助于抗氧化和肠道健康。每100克含膳食纤维约1.6克，花青素含量丰富。',
    suggestion: '对半切开用勺挖食，也可制作水果沙拉或榨汁。冷藏后口感更佳。'
  },
  {
    id: 20,
    name: '菲律宾菠萝蜜',
    type: 'tropical',
    imgUrl: '/src/img/20.png',
    price: '39.90',
    origin: '菲律宾',
    unit: '个(约8-10斤)',
    sweetness: '高甜度(糖度18-20度)',
    storage: '常温保存5天',
    description: '干苞品种，果肉金黄厚实，Q弹有嚼劲，带有焦糖香气。',
    nutrition: '富含植物蛋白和膳食纤维。'
  },
  {
    id: 21,
    name: '海南贵妃芒',
    type: 'tropical',
    imgUrl: '/src/img/21.png',
    price: '32.80',
    origin: '海南乐东',
    unit: '箱(约6斤)',
    sweetness: '蜜甜无丝(糖度20-22度)',
    storage: '常温催熟后冷藏',
    description: '红黄渐变果皮，果核薄如纸，果肉细腻无纤维，入口即化。',
    nutrition: 'β-胡萝卜素含量是普通芒果的3倍。'
  },
  {
    id: 22,
    name: '泰国椰皇',
    type: 'tropical',
    imgUrl: '/src/img/22.png',
    price: '15.90',
    origin: '泰国',
    unit: '个',
    sweetness: '清甜爽口(糖度8-10度)',
    storage: '冷藏保存7天',
    description: '老椰品种，椰肉厚实雪白，椰水清甜富含电解质。',
    nutrition: '富含月桂酸，具有抗菌作用。'
  },
  {
    id: 23,
    name: '台湾凤梨释迦',
    type: 'tropical',
    imgUrl: '/src/img/23.png',
    price: '79.90',
    originalPrice: '99.90',
    origin: '中国台湾',
    unit: '个(约1-1.5斤)',
    sweetness: '超高甜度(糖度20-25度)',
    storage: '常温放置变软后食用，熟后冷藏保存2-3天',
    description: '台湾凤梨释迦是释迦和凤梨的杂交品种，果肉Q弹，甜度高，带有凤梨香气，籽少肉多，口感独特。',
    nutrition: '富含维生素B群和矿物质，有助于新陈代谢和神经系统健康。每100克含维生素B1约0.1毫克，钾约250毫克。',
    suggestion: '对半切开用勺挖食，冷藏后口感像冰淇淋。表皮变软轻按有弹性表示成熟。'
  }
])

const filteredFruits = computed(() => {
  return fruitList.value.filter(fruit => {
    const matchCategory = currentCategory.value === 'all' || 
                         fruit.type === currentCategory.value
    const matchSearch = fruit.name.includes(searchText.value)
    return matchCategory && matchSearch
  })
})

function filterByCategory(type) {
  currentCategory.value = type
}

function addToCart(item) {
  store.addToCart({
    id: item.id,
    name: item.name,
    price: parseFloat(item.price),
    imageUrl: item.imgUrl,
    quantity: 1
  })
  ElMessage.success(`已添加 ${item.name} 到购物车`)
}

function showDetail(item) {
  selectedFruit.value = item
  dialogVisible.value = true
}

const toggleFavorite = (fruit) => {
  if (!store.isLoggedIn) {
    ElMessage.warning('请先登录后再收藏')
    return
  }
  const isFavorite = store.toggleFavorite(fruit)
  ElMessage.success(isFavorite ? '已添加到收藏' : '已取消收藏')
}

</script>
<style scoped>
.action-buttons {
  display: flex;
  gap: 5px;
  margin-top: 8px; 
}

.favorite-btn {
  margin-left: 5px;
}
.home-container {
  padding: 10px;
  padding-bottom: 60px; /* 为底部导航留出空间 */
  background-color: #f5f7fa;
  min-height: 100vh;   
}

/* 顶部logo */
.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  padding-top: 10px;
}

.logo-box {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%);
  padding: 10px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8f4ea;
  width: 100%;
}

.logo-icon {
  background-color: #67C23A;
  padding: 8px;
  border-radius: 50%;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.main-text {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  letter-spacing: 1px;
  background: linear-gradient(to right, #67C23A, #85ce61);
  background-clip: text; 
  -webkit-text-fill-color: transparent;
}

.sub-text {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
  letter-spacing: 1px;
}

/* 搜索框 */
.search-container {
  padding: 0 10px;
  margin-bottom: 15px;
}

/* 轮播图 */
.swiper {
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 公告栏 */
.notice-bar {
  margin-bottom: 15px;
  border-radius: 8px;
}

/* 分类导航 */
.navs {
  display: flex;
  overflow-x: auto;
  padding: 10px 5px;
  margin-bottom: 15px;
  gap: 8px;
  -webkit-overflow-scrolling: touch;
} 

.category-tag {
  flex-shrink: 0;
  cursor: pointer;
}

/* 推荐标题 */
.recommend-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 10px 15px;
  padding-left: 5px;
  border-left: 4px solid #67C23A;
}

/* 水果列表 */
.fruit-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 0 10px;
}

.fruit-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.fruit-card:hover {
  transform: translateY(-3px);
}

.fruit-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}
.fruit-name {
  margin: 8px 0;
  margin-left: -5px;
  font-size: 15px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price-container {
  margin-left: -8px;
  display: flex;
  flex-direction: column; /* 垂直布局保持不变 */
  margin-top: 10px;
}

.price-info {
  display: flex; 
  align-items: baseline; 
  flex-wrap: nowrap; /* 确保不换行 */
}

.current-price {
  color: #f56c6c;
  font-size: 16px;
  font-weight: bold; 
}

.original-price {
  text-decoration: line-through;
  color: #999;
  font-size: 12px; 
}

.action-buttons {
  display: flex;
  gap: 2px;
  margin-top: 10px; /* 保持与价格的间距 */
}

.add-cart-btn {
  padding: 8px 12px;
  font-size: 12px;
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
  object-fit: cover;
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