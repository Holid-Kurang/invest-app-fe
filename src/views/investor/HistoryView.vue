<script setup>
import { ref, onMounted } from 'vue'
import Badge from "@/components/Badge.vue";
import formatCurrency from "@/lib/format-currency";
import { apiService } from '@/services/api'

const isLoading = ref(false)
const allTransactions = ref([])
const error = ref('')

// Fungsi untuk memformat tanggal
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID')
}

// Fungsi untuk mengambil semua data transaksi
const fetchHistoryData = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    const response = await apiService.getInvestorDashboard()
    
    if (response.success && response.data) {
      // Ambil semua transaksi (tidak hanya 10 terbaru)
      allTransactions.value = response.data.allTransactions || []
    }
  } catch (err) {
    error.value = err.message || 'Gagal mengambil data history'
    console.error('History error:', err)
  } finally {
    isLoading.value = false
  }
}

// Load data saat komponen dimount
onMounted(() => {
  fetchHistoryData()
})
</script>

<template>
  <h1 class="text-2xl font-bold text-blue-800">Your History Investment</h1>

  <div v-if="isLoading" class="flex justify-center items-center py-8">
    <div class="text-gray-600">Loading history data...</div>
  </div>

  <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mt-4">
    {{ error }}
    <button @click="fetchHistoryData" class="ml-2 underline">Retry</button>
  </div>

  <div v-else class="mt-8 overflow-x-auto">
    <div class="min-w-[600px] sm:min-w-full shadow-md rounded-xl">
      <table class="min-w-full table-auto text-sm text-gray-800">
        <thead>
          <tr class="bg-blue-800 text-white text-left">
            <th class="px-4 py-3">No.</th>
            <th class="px-4 py-3">Date</th>
            <th class="px-4 py-3">Type</th>
            <th class="px-4 py-3">Amount</th>
            <th class="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="allTransactions.length === 0">
            <td colspan="5" class="px-4 py-8 text-center text-gray-500">
              Belum ada transaksi
            </td>
          </tr>
          <tr
            v-else
            v-for="(item, index) in allTransactions"
            :key="`${item.originalType}-${item.id}`"
            class="odd:bg-slate-50 hover:bg-slate-200 transition-colors text-left"
          >
            <td class="px-4 py-3 font-medium">{{ index + 1 }}.</td>
            <td class="px-4 py-3">
              {{ formatDate(item.date) }}
            </td>
            <td class="px-4 py-3">
              {{ item.type }}
            </td>
            <td class="px-4 py-3">
              {{ formatCurrency(item.amount) }}
            </td>
            <td class="px-4 py-3">
              <Badge :value="item.status" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
