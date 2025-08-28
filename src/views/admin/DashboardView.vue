<script setup>
import Badge from "@/components/Badge.vue";
import formatCurrency from "@/lib/format-currency";
import { apiService } from '@/services/api'
import { ref, onMounted } from 'vue'

const data = [
    {
        title: "Total Investment Funds",
        total: 100000000,
    },
    {
        title: "Total Investor",
        total: 16,
    },
    {
        title: "Operational Cost",
        total: 100000,
    },
    {
        title: "Total Revenue",
        total: 150000000,
    },
    {
        title: "Dividend",
        total: 150000000,
    },
];

const transactions = ref([]);
const isLoading = ref(false)
const error = ref('')

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

        const response = await apiService.getAdminDashboard()

        if (response.success && response.data) {
            // Update data statistik

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
    <!-- Card Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div v-for="(item, index) in data" :key="index" class="bg-blue-800 text-white p-4 sm:p-5 rounded-xl shadow-lg">
            <p class="text-base sm:text-lg font-medium">{{ item.title }}</p>
            <span class="mt-4 block text-xl sm:text-2xl font-bold">
                {{ formatCurrency(item.total) }}
            </span>
        </div>
    </div>

    <!-- Table Section -->
    <div class="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-gray-800">
                <thead>
                    <tr class="bg-blue-800 text-white text-left">
                        <th class="px-6 py-3 font-semibold">No.</th>
                        <th class="px-6 py-3 font-semibold">Date</th>
                        <th class="px-6 py-3 font-semibold">Investor</th>
                        <th class="px-6 py-3 font-semibold">Type</th>
                        <th class="px-6 py-3 font-semibold">Amount</th>
                        <th class="px-6 py-3 font-semibold">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in transactions" :key="index"
                        class="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                        <td class="px-6 py-4 text-center">{{ index + 1 }}.</td>
                        <td class="px-4 py-3">
                            <div class="text-sm">
                                <div class="font-medium">
                                    {{ formatDate(item.date).split(' ').slice(0, 3).join(' ') }}
                                </div>
                                <div class="text-xs text-gray-500">
                                    {{ formatDate(item.date).split(' ').slice(3).join(' ') }}
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3">
                            <div>
                                <div class="font-medium">{{ item.investor }}</div>
                                <div class="text-xs text-gray-500">{{ item.investor_email }}</div>
                            </div>
                        </td>
                        <td class="px-4 py-3 capitalize">
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
