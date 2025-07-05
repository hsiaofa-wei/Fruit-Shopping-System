import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue' ;
import Category from '@/views/Category.vue';
import Cart from '@/views/Cart.vue';
import Login from '@/views/Login.vue';
import Favorites from '@/views/Favorites.vue';
import CustomerService from '@/views/CustomerService.vue';
import Settings from '@/views/Settings.vue';
import Orders from '@/views/Orders.vue';


const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/category',
    name: 'Category',
    component: Category,
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/customerService',
    name: 'CustomerService',
    component: CustomerService,
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings, 
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router