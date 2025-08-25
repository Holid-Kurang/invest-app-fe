import { createRouter, createWebHistory } from "vue-router";

// Authentication guard
const requireAuth = (to: any, from: any, next: any) => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  
  if (!token || !user) {
    next('/')
    return
  }
  
  const userData = JSON.parse(user)
  
  // Check role-based access
  if (to.path.startsWith('/admin') && userData.role !== 'admin') {
    next('/')
    return
  }
  
  if (to.path.startsWith('/investor') && userData.role !== 'investor') {
    next('/')
    return
  }
  
  next()
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/investor",
      component: () => import("../views/investor/LayoutInvestor.vue"),
      beforeEnter: requireAuth,
      children: [
        {
          path: "",
          component: () => import("@/views/investor/DashboardView.vue"),
        },
        {
          path: "invest",
          component: () => import("@/views/investor/InvestView.vue"),
        },
        {
          path: "withdrawal",
          component: () => import("@/views/investor/WithDrawalView.vue"),
        },
        {
          path: "history",
          component: () => import("@/views/investor/HistoryView.vue"),
        },
      ],
    },
    {
      path: "/admin",
      component: () => import("../views/admin/LayoutAdmin.vue"),
      beforeEnter: requireAuth,
      children: [
        {
          path: "",
          component: () => import("@/views/admin/DashboardView.vue"),
        },
        {
          path: "investor",
          component: () => import("@/views/admin/InvestorView.vue"),
        },
        {
          path: "transaction",
          component: () => import("@/views/admin/TransactionView.vue"),
        },
        {
          path: "history",
          component: () => import("@/views/admin/HistoryView.vue"),
        },
        {
          path: "account",
          component: () => import("@/views/admin/AccountView.vue"),
        },
      ],
    },
  ],
});

export default router;
