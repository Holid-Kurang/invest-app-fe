<template>
  <div class="min-h-screen flex flex-col">
    <header
      class="flex justify-between px-4 md:px-8 bg-blue-800 text-white h-16 md:h-20 items-center sticky top-0 z-40"
    >
      <div class="flex items-center gap-4">
        <button @click="toggleSidebar" class="md:hidden" aria-label="Toggle sidebar">
          <Menu class="w-6 h-6" />
        </button>
        <h1 class="text-xl md:text-2xl font-semibold">Emdea Admin</h1>
      </div>
      <div
        class="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-3xl border-2 border-white text-md md:text-base"
      >
        {{ user?.email || 'Admin' }}
        <UserRound class="h-5 w-5 md:h-6 md:w-6" />
      </div>
    </header>

    <div class="flex flex-1 relative">
      <aside
        :class="[
          'bg-slate-100 w-60 transition-transform duration-300 md:mt-16 h-full',
          sidebarOpen
            ? 'fixed top-0 left-0 h-full max-md:z-50 translate-x-0'
            : 'fixed max-md:h-full top-0 max-md:z-50 -translate-x-full md:translate-x-0',
        ]"
      >
        <nav class="p-6 md:p-8 h-full sticky top-0 overflow-y-auto">
          <ul class="flex flex-col gap-4">
            <li v-for="nav in navItems" :key="nav.path">
              <router-link
                :to="nav.path"
                class="flex items-center gap-2 p-3 rounded-xl hover:bg-blue-900 font-medium text-md text-slate-600 hover:text-white transition-all duration-300"
                exact-active-class="bg-blue-900 text-white font-semibold"
                @click="closeSidebar"
              >
                <component :is="nav.icon" class="w-4 h-4" />
                <span>{{ nav.name }}</span>
              </router-link>
            </li>

            <!-- Logout -->
            <li
              @click="handleLogout"
              class="flex items-center cursor-pointer gap-2 p-3 rounded-xl hover:bg-red-700 font-medium text-md text-white transition-all duration-300 bg-red-600"
              role="button"
              aria-label="Logout"
            >
              <LogOut class="w-4 h-4" />
              <span>Logout</span>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- overlay for mobile when sidebar open -->
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/40 z-40 md:hidden"
        @click="closeSidebar"
      ></div>

      <main class="p-4 md:p-8 overflow-x-auto flex-1/2 md:ml-60">
        <div>
          <RouterView />
          <div class="h-100"></div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import {
  Gauge,
  Users,
  ReceiptText,
  ClipboardClock,
  CircleUser,
  LogOut,
  Menu,
  UserRound,
} from "lucide-vue-next";

import { ref, onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";

const { logout, user, initAuth } = useAuth();
const sidebarOpen = ref(false);

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}
function closeSidebar() {
  sidebarOpen.value = false;
}

function handleLogout() {
  logout();
}

onMounted(() => {
  initAuth();
});

const navItems = [
  { name: "Dashboard", path: "/admin", icon: Gauge },
  { name: "Investor", path: "/admin/investor", icon: Users },
  { name: "Transaction", path: "/admin/transaction", icon: ReceiptText },
  { name: "History", path: "/admin/history", icon: ClipboardClock },
  { name: "Account", path: "/admin/account", icon: CircleUser },
];
</script>

<style scoped>
.h-100 {
  height: 24rem;
}
</style>
