import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import ('../views/HomePage.vue')
  },
  {
    path: '/store-info',
    component: () => import ('../views/store/StorePage.vue')
  }, 
  {
    path: '/search',
    component: () => import ('../views/products/SearchPage.vue')
  },
  //checkout pages 
  {
    path: '/cart',
    component: () => import ('../views/checkout/CartPage.vue')
  },
  {
    path: '/gift',
    component: () => import ('../views/checkout/GiftPage.vue')
  },
  {
    path: '/confirm',
    component: () => import ('../views/checkout/ConfirmPage.vue')
  },
  {
    path: '/confirm/:order_uuid',
    component: () => import ('../views/checkout/ConfirmPage.vue')
  },
  //profile pages 
  {
    path: '/profile',
    component: () => import ('../views/profile/ProfilePage.vue')
  },
  {
    path: '/addresses',
    component: () => import ('../views/profile/address/AddressesPage.vue')
  },
  {
    path: '/address-form/:id',
    component: () => import ('../views/profile/address/AddressFormPage.vue')
  },
  {
    path: '/address-form',
    component: () => import ('../views/profile/address/AddressFormPage.vue')
  },
  {
    path: '/payment-success/:id',
    component: () => import ('../views/profile/order/OrderPage.vue')
  },
  {
    path: '/payment-success/:id/:payment_uuid',
    component: () => import ('../views/profile/order/OrderPage.vue')
  },
  {
    path: '/payment-failed/:id',
    component: () => import ('../views/profile/order/OrderPage.vue')
  },
  {
    path: '/order/:id',
    component: () => import ('../views/profile/order/OrderPage.vue')
  },
  {
    path: '/orders',
    component: () => import ('../views/profile/order/OrdersPage.vue')
  },
  //errors 
  {
    path: '/no-store',
    component: () => import ('../views/errors/NoStorePage.vue')
  },
  {
    path: '/404',
    component: () => import ('../views/errors/404Page.vue')
  },
  {
    path: '/500',
    component: () => import ('../views/errors/500Page.vue')
  },
  {
    path: '/app-error',
    component: () => import ('../views/errors/AppErrorPage.vue')
  },
  {
    path: '/no-internet',
    component: () => import ('../views/errors/NoInternetPage.vue')
  },
  //signup pages 
  {
    path: '/login',
    component: () => import ('../views/start-pages/LoginPage.vue')
  }, 
  {
    path: '/register',
    component: () => import ('../views/start-pages/RegisterPage.vue')
  }, 
  {
    path: '/email-login',
    component: () => import ('../views/start-pages/EmailLoginPage.vue')
  }, 
  {
    path: '/verify-email/:email/:code',
    component: () => import ('../views/start-pages/VerifyEmailPage.vue')
  }, 
  {
    path: '/verify-email/:email',
    component: () => import ('../views/start-pages/VerifyEmailPage.vue')
  }, 
  {
    path: '/forgot-password',
    component: () => import ('../views/start-pages/ForgotPassword.vue')
  }, 
  {
    path: '/update-password/:token',
    component: () => import ('../views/start-pages/UpdatePasswordPage.vue')
  }, 
  {
    path: '/category/:slug',
    component: () => import ('../views/products/CategoryPage.vue')
  }, 
  {
    path: '/item/:slug',
    component: () => import ('../views/products/DetailPage.vue')
  }, 
  {
    path: "/:catchAll(.*)",
    //path: "*",
    redirect: 'not-found'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
