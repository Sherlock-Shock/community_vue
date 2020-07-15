import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
//import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import VueCookies from 'vue-cookies'

Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(VueCookies);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

router.beforeEach((to, from, next) => {

    if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限

      if (router.app.$cookies.get('token')) {// 判断是否登录

        next()

      } else {// 没登录则跳转到登录界面

		router.app.$message.error('登录信息已过期,请重新登录');
		
        next({

          path: 'login',

          //query: {redirect: to.fullPath}

        })

      }

    } else {

      next()

    }

  })

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');
