<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Badge from "@/components/Badge.vue";
import formatCurrency from "@/lib/format-currency";
import { Search, ChevronLeft, ChevronRight } from "lucide-vue-next";
import { apiService } from '@/services/api'

interface Transaction {
    id: number
    date: string
    type: 'Investment' | 'Withdrawal'
    amount: number
    status: 'Pending' | 'Successful' | 'Rejected'
    investor: string
    investor_email: string
    id_user: number
    originalType: 'invest' | 'withdrawal'
    proof?: string | null
}

const isLoading = ref(false)
const allTransactions = ref<Transaction[]>([])
const error = ref('')
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 50

// Computed untuk filter transaksi berdasarkan search
const filteredTransactions = computed(() => {
    if (!searchQuery.value.trim()) {
        return allTransactions.value
    }

    const query = searchQuery.value.toLowerCase()
    return allTransactions.value.filter(transaction =>
        transaction.investor.toLowerCase().includes(query) ||
        transaction.investor_email.toLowerCase().includes(query) ||
        transaction.type.toLowerCase().includes(query) ||
        transaction.status.toLowerCase().includes(query)
    )
})

// Computed untuk pagination
const totalPages = computed(() => {
    return Math.ceil(filteredTransactions.value.length / itemsPerPage)
})

const paginatedTransactions = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredTransactions.value.slice(start, end)
})

const paginationRange = computed(() => {
    const range = []
    const total = totalPages.value
    const current = currentPage.value

    // Jika total halaman <= 7, tampilkan semua
    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
            range.push(i)
        }
        return range
    }

    // Jika current page dekat awal
    if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
            range.push(i)
        }
        range.push('...')
        range.push(total)
        return range
    }

    // Jika current page dekat akhir
    if (current >= total - 3) {
        range.push(1)
        range.push('...')
        for (let i = total - 4; i <= total; i++) {
            range.push(i)
        }
        return range
    }

    // Jika current page di tengah
    range.push(1)
    range.push('...')
    for (let i = current - 1; i <= current + 1; i++) {
        range.push(i)
    }
    range.push('...')
    range.push(total)
    return range
})

// Fungsi untuk memformat tanggal
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}

// Fungsi untuk mengambil semua data transaksi
const fetchAllTransactions = async () => {
    try {
        isLoading.value = true
        error.value = ''

        const response = await apiService.getAllTransactions() as any

        if (response.success && response.data) {
            allTransactions.value = response.data
        }
    } catch (err: any) {
        error.value = err.message || 'Gagal mengambil data transaksi'
        console.error('Fetch transactions error:', err)
    } finally {
        isLoading.value = false
    }
}

// Fungsi pagination
const goToPage = (page: number | string) => {
    if (typeof page === 'number' && page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

// Reset ke halaman 1 ketika search berubah
const onSearchChange = () => {
    currentPage.value = 1
}

// Load data saat komponen dimount
onMounted(() => {
    fetchAllTransactions()
})
</script>

<template>
    <h1 class="text-2xl font-bold text-blue-800 mb-6">All Transactions History</h1>

    <div class="relative w-fit">
        <input v-model="searchQuery" @input="onSearchChange" type="search"
            placeholder="Search by investor, email, type, or status..."
            class="w-80 h-9 ps-10 pe-3 border border-blue-900 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm transition duration-150" />
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-8 mt-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-2 text-gray-600">Loading transactions...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mt-8">
        {{ error }}
        <button @click="fetchAllTransactions" class="ml-2 underline">Retry</button>
    </div>

    <!-- Results Counter -->
    <div v-else class="mt-4 text-sm text-gray-600 flex justify-between items-center">
        <div>
            Showing {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredTransactions.length) }} -
            {{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }}
            of {{ filteredTransactions.length }} transactions
            <span v-if="searchQuery">(filtered from {{ allTransactions.length }} total)</span>
            <span class="ml-2 text-gray-400">• {{ itemsPerPage }} per page</span>
        </div>
        <div v-if="totalPages > 1" class="text-sm">
            Page {{ currentPage }} of {{ totalPages }}
        </div>
    </div>

    <div v-if="!isLoading && !error" class="mt-8 overflow-x-auto">
        <div class="min-w-[1000px] sm:min-w-full shadow-md rounded-xl">
            <table class="min-w-full table-fixed text-sm text-gray-800">
                <thead>
                    <tr class="bg-blue-800 text-white text-left">
                        <th class="px-4 py-3 font-semibold whitespace-nowrap w-16">No.</th>
                        <th class="px-4 py-3 font-semibold whitespace-nowrap w-48">Date</th>
                        <th class="px-4 py-3 font-semibold whitespace-nowrap w-48">Investor</th>
                        <th class="px-4 py-3 font-semibold whitespace-nowrap w-28">Type</th>
                        <th class="px-4 py-3 font-semibold whitespace-nowrap w-32">Amount</th>
                        <th class="px-4 py-3 font-semibold whitespace-nowrap w-28">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="paginatedTransactions.length === 0">
                        <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                            {{ searchQuery ? 'No transactions found matching your search' : 'No transactions found' }}
                        </td>
                    </tr>
                    <tr v-else v-for="(transaction, index) in paginatedTransactions"
                        :key="`${transaction.originalType}-${transaction.id}`"
                        class="odd:bg-slate-50 even:bg-white hover:bg-blue-50 transition-colors duration-150">
                        <td class="px-4 py-3 text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}.</td>
                        <td class="px-4 py-3">
                            <div class="text-sm">
                                <div class="font-medium">
                                    {{ formatDate(transaction.date).split(' ').slice(0, 3).join(' ') }}
                                </div>
                                <div class="text-xs text-gray-500">
                                    {{ formatDate(transaction.date).split(' ').slice(3).join(' ') }}
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3">
                            <div>
                                <div class="font-medium">{{ transaction.investor }}</div>
                                <div class="text-xs text-gray-500">{{ transaction.investor_email }}</div>
                            </div>
                        </td>
                        <td class="px-4 py-3 capitalize">
                            {{ transaction.type }}
                        </td>
                        <td class="px-4 py-3">
                            {{ formatCurrency(transaction.amount) }}
                        </td>
                        <td class="px-4 py-3">
                            <Badge :value="transaction.status" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-6 flex justify-center items-center gap-2">
            <!-- Previous Button -->
            <button @click="prevPage" :disabled="currentPage === 1"
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft class="w-4 h-4 mr-1" />
                Previous
            </button>

            <!-- Page Numbers -->
            <div class="flex gap-1">
                <template v-for="page in paginationRange" :key="page">
                    <button v-if="typeof page === 'number'" @click="goToPage(page)" :class="[
                        'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                        page === currentPage
                            ? 'text-white bg-blue-600 border border-blue-600'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                    ]">
                        {{ page }}
                    </button>
                    <span v-else class="px-3 py-2 text-sm font-medium text-gray-500">
                        {{ page }}
                    </span>
                </template>
            </div>

            <!-- Next Button -->
            <button @click="nextPage" :disabled="currentPage === totalPages"
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
                <ChevronRight class="w-4 h-4 ml-1" />
            </button>
        </div>
    </div>
</template>
