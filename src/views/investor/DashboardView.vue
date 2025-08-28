<script setup>
import { ref, onMounted } from 'vue'
import Badge from "@/components/Badge.vue";
import formatCurrency from "@/lib/format-currency";
import { apiService } from '@/services/api'

const isLoading = ref(false)
const dashboardData = ref(null)
const error = ref('')

const data = ref([
    {
        title: "Total Investment Funds",
        total: 0,
    },
    {
        title: "Return Annual",
        total: 0,
    },
    {
        title: "Daily Return",
        total: 0,
    },
    {
        title: "Total Returns",
        total: 0,
        days: 0, // Tambahan untuk menampilkan hari
    },
    {
        title: "Dividend Earnings",
        total: 0,
    },
]);

const transactions = ref([]);

// Fungsi untuk memformat tanggal
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Fungsi untuk mengambil data dashboard
const fetchDashboardData = async () => {
    try {
        isLoading.value = true
        error.value = ''

        const response = await apiService.getInvestorDashboard()

        if (response.success && response.data) {
            dashboardData.value = response.data

            // Update data statistik
            data.value[0].total = response.data.statistics.totalInvestment
            data.value[1].total = response.data.statistics.annualReturn
            data.value[2].total = response.data.statistics.dailyReturn
            data.value[3].total = response.data.statistics.totalReturns
            data.value[3].days = response.data.statistics.totalDays // Update total hari
            data.value[4].total = response.data.statistics.dividendEarnings

            // Update data transaksi
            transactions.value = response.data.transactions
        }
    } catch (err) {
        error.value = err.message || 'Gagal mengambil data dashboard'
        console.error('Dashboard error:', err)
    } finally {
        isLoading.value = false
    }
}

// Load data saat komponen dimount
onMounted(() => {
    fetchDashboardData()
})
</script>

<template>
    <div v-if="isLoading" class="flex justify-center items-center py-8">
        <div class="text-gray-600">Loading dashboard data...</div>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
        <button @click="fetchDashboardData" class="ml-2 underline">Retry</button>
    </div>

    <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div v-for="(item, index) in data" :key="index" class="bg-blue-800 text-white p-5 rounded-xl shadow-lg">
                <p class="text-lg font-medium">{{ item.title }}</p>
                <!-- Tampilkan total hari jika ada -->
                <p v-if="item.days !== undefined" class="text-sm text-blue-200 ">
                    {{ item.days }} days
                </p>
                <span class="block text-2xl font-bold" :class="{ 'mt-6': item.title !== 'Total Returns' }">
                    {{ formatCurrency(item.total) }}
                </span>
            </div>
        </div>

        <div class="mt-8 overflow-x-auto">
            <div class="min-w-[600px] sm:min-w-full shadow-md rounded-xl">
                <table class="min-w-full table-auto text-sm text-gray-800">
                    <thead>
                        <tr class="bg-blue-800 text-white text-left">
                            <th class="px-4 py-3 font-semibold whitespace-nowrap">No.</th>
                            <th class="px-4 py-3 font-semibold whitespace-nowrap">Date</th>
                            <th class="px-4 py-3 font-semibold whitespace-nowrap">Type</th>
                            <th class="px-4 py-3 font-semibold whitespace-nowrap">Amount</th>
                            <th class="px-4 py-3 font-semibold whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="transactions.length === 0">
                            <td colspan="5" class="px-4 py-8 text-center text-gray-500">
                                Belum ada transaksi
                            </td>
                        </tr>
                        <tr v-else v-for="(item, index) in transactions" :key="`${item.originalType}-${item.id}`"
                            class="odd:bg-slate-50 even:bg-white hover:bg-blue-50 transition-colors duration-150">
                            <td class="px-4 py-3 text-center">{{ index + 1 }}.</td>
                            <td class="px-4 py-3">
                                <div class="text-sm">
                                    <div class="font-medium">
                                        {{
                                            formatDate(item.date).split(" ").slice(0, 3).join(" ")
                                        }}
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        {{
                                            formatDate(item.date).split(" ").slice(3).join(" ")
                                        }}
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-3 capitalize">{{ item.type }}</td>
                            <td class="px-4 py-3">{{ formatCurrency(item.amount) }}</td>
                            <td class="px-4 py-3">
                                <Badge :value="item.status" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
