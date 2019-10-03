import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/tablero',
    children: [{
      path: 'tablero',
      name: 'Tablero',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: 'Tablero',
        icon: 'dashboard'
      }
    }]
  },
  {
    path: '/reportes',
    component: Layout,
    redirect: '/reportes/table',
    name: 'Reportes',
    meta: {
      title: 'Reportes',
      icon: 'example'
    },
    children: [{
        path: 'produccion',
        name: 'Produccion',
        component: () => import('@/views/reportes/produccion/index'),
        meta: {
          title: 'Produccion',
          icon: 'pie-chart'
        }
      },
      {
        path: 'ventas',
        name: 'Ventas',
        component: () => import('@/views/reportes/ventas/index'),
        meta: {
          title: 'Ventas',
          icon: 'pie-chart'
        }
      },
      {
        path: 'cobranzas',
        name: 'Cobranzas',
        component: () => import('@/views/reportes/cobranzas/index'),
        meta: {
          title: 'Cobranzas',
          icon: 'pie-chart'
        }
      },
      {
        path: 'rrhh',
        name: 'RRHH',
        component: () => import('@/views/reportes/rrhh/index'),
        meta: {
          title: 'RRHH',
          icon: 'people'
        }
      },
      {
        path: 'todos',
        name: 'TODOS',
        component: () => import('@/views/reportes/todos/index'),
        meta: {
          title: 'TODOS',
          icon: 'people'
        }
      },
      {
        path: 'dolar',
        name: 'Dólar',
        component: () => import('@/views/reportes/dolar/index'),
        meta: {
          title: 'Dólar',
          icon: 'people'
        }
      },
      {
        path: 'riesgopais',
        name: 'Riesgo País',
        component: () => import('@/views/reportes/riesgopais/index'),
        meta: {
          title: 'Riesgo País',
          icon: 'people'
        }
      }
    ]
  },
  {
    path: '/meli',
    component: Layout,
    redirect: '/meli/table',
    name: 'Reportes',
    meta: {
      title: 'Mercado Libre',
      icon: 'exampe'
    },
    children: [{
      path: 'publicaciones',
      name: 'Publicaciones',
      component: () => import('@/views/meli/publicaciones/index'),
      meta: {
        title: 'Publicaciones',
        icon: 'pie-char'
      },
    }, {
      path: 'ventas',
      name: 'Ventas',
      component: () => import('@/views/meli/ventas/index'),
      meta: {
        title: 'Ventas',
        icon: 'pie-char'
      },
    }]
  }, {
    path: 'external-link',
    component: Layout,
    children: [{
      path: 'http://intranet.valot.com.ar/webmail',
      meta: {
        title: 'Webmail',
        icon: 'link'
      }
    }]
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
