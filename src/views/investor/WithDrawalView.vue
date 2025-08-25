<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWithdrawal } from '@/composables/useWithdrawal'
import Badge from "@/components/Badge.vue";
import formatCurrency from "@/lib/format-currency";

const {
    withdrawals,
    loading,
    error,
    form,
    message,
    messageClass,
    pendingWithdrawals,
    successWithdrawals,
    totalSuccessWithdrawals,
    totalReturn,
    dividedEaring,
    fetchWithdrawals,
    submitWithdrawal,
    clearMessage
} = useWithdrawal()

// Methods
const handleSubmit = async (event: Event) => {
    event.preventDefault()
    clearMessage()

    try {
        await submitWithdrawal()

        // Auto clear success message after 3 seconds
        if (message.value.type === 'success') {
            setTimeout(() => {
                clearMessage()
            }, 3000)
        }
    } catch (error) {
        console.error('Submit withdrawal error:', error)
    }
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const getStatusBadgeValue = (status: string) => {
    switch (status) {
        case 'success': return 'Successful'
        case 'pending': return 'Pending'
        case 'rejected': return 'Rejected'
        default: return status
    }
}

// Load data on mount
onMounted(async () => {
    await fetchWithdrawals()
})
</script>

<template>
    <div class="space-y-6">
        <!-- Header -->
        <h1 class="text-2xl font-bold text-blue-800">
            Withdrawal Management
        </h1>

        <!-- Loading State -->
        <div v-if="loading && withdrawals.length === 0" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="ml-2 text-gray-600">Loading withdrawal data...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
            <button @click="fetchWithdrawals" class="ml-2 underline">Retry</button>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left Column - Form and Info -->
            <div class="lg:col-span-1 space-y-6">
                <!-- Total Return -->
                <!-- <div class="space-y-1">
                    <span class="block text-lg font-semibold text-gray-700">Total Returns</span>
                    <div class="py-3 px-6 bg-blue-700 text-white font-bold rounded-lg w-fit">
                        {{ formatCurrency(totalReturn) }}
                    </div>
                </div> -->

                <!-- Total Withdrawals Info -->
                <div class="space-y-1">
                    <span class="block text-lg font-semibold text-gray-700">Total Withdrawals</span>
                    <div class="py-3 px-6 bg-green-700 text-white font-bold rounded-lg w-fit">
                        {{ formatCurrency(dividedEaring) }}
                    </div>
                </div>

                <!-- Available for Withdrawal -->
                <div class="space-y-1">
                    <span class="block text-lg font-semibold text-gray-700">Available for Withdrawal</span>
                    <div class="py-3 px-6 bg-blue-700 text-white font-bold rounded-lg w-fit">
                        {{ formatCurrency(totalReturn - dividedEaring) }}
                    </div>
                    <span class="block text-sm text-gray-500">
                        Minimum withdrawal {{ formatCurrency(100000) }}
                    </span>
                    <span v-if="totalReturn - dividedEaring < 100000" class="block text-sm text-red-600 font-medium">
                        Total returns harus minimal {{ formatCurrency(100000) }} untuk dapat melakukan withdrawal
                    </span>
                </div>

                <!-- Withdrawal Form -->
                <form @submit="handleSubmit"
                    class="w-full bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                    <h2 class="text-xl font-semibold text-blue-800 mb-4">Request Withdrawal</h2>

                    <!-- Warning if total return < 100000 -->
                    <div v-if="totalReturn - dividedEaring < 100000" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-sm">
                        <strong>Peringatan:</strong> Total returns Anda masih kurang dari {{ formatCurrency(100000) }}. 
                        Withdrawal akan diaktifkan setelah total returns mencapai minimal {{ formatCurrency(100000) }}.
                    </div>

                    <!-- Message -->
                    <div v-if="message.text" :class="messageClass" class="p-3 rounded text-sm">
                        {{ message.text }}
                    </div>

                    <div>
                        <label for="amount" class="block text-sm font-medium text-blue-900 mb-1">Amount</label>
                        <input id="amount" v-model="form.amount" type="number" step="1000" min="100000" 
                            :max="Math.floor(Math.max(0, totalReturn - dividedEaring))"
                            :disabled="loading || totalReturn < 100000"
                            class="w-full h-10 px-4 text-sm border border-blue-500 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:bg-gray-100"
                            placeholder="Enter withdrawal amount" required />
                        <p class="text-xs text-gray-500 mt-1">
                            Minimum: {{ formatCurrency(100000) }} | 
                            Maximum: {{ formatCurrency(Math.max(0, totalReturn - dividedEaring)) }}
                        </p>
                    </div>

                    <button type="submit" :disabled="loading || totalReturn - dividedEaring < 100000"
                        class="w-full py-2 bg-blue-900 text-white rounded-md font-semibold hover:bg-blue-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                        <span v-if="loading">Processing...</span>
                        <span v-else-if="totalReturn - dividedEaring < 100000">Withdrawal Not Available</span>
                        <span v-else>Submit Withdrawal</span>
                    </button>
                </form>

                <!-- Quick Status Info -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-gray-700 mb-2">Quick Status</h3>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>Pending:</span>
                            <span class="font-medium">{{ pendingWithdrawals.length }} requests</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Successful:</span>
                            <span class="font-medium text-green-600">{{ successWithdrawals.length }} withdrawals</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column - Withdrawal History -->
            <div class="lg:col-span-2">
                <div class="bg-white rounded-lg shadow-md">
                    <div class="p-6 border-b">
                        <h2 class="text-xl font-semibold">Withdrawal History</h2>
                    </div>

                    <div v-if="withdrawals.length === 0" class="p-6 text-center text-gray-500">
                        No withdrawal requests found. Make your first withdrawal request!
                    </div>

                    <div v-else class="divide-y">
                        <div v-for="withdrawal in withdrawals" :key="withdrawal.id"
                            class="p-6 hover:bg-gray-50 transition-colors">
                            <div class="flex justify-between items-start">
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 mb-2">
                                        <h3 class="font-semibold">
                                            Withdrawal #{{ withdrawal.id }}
                                        </h3>
                                        <Badge :value="getStatusBadgeValue(withdrawal.status)" />
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                        <div>
                                            <span class="font-medium">Amount:</span>
                                            <p class="text-lg font-semibold text-gray-900">
                                                {{ formatCurrency(withdrawal.amount) }}
                                            </p>
                                        </div>
                                        <div>
                                            <span class="font-medium">Date:</span>
                                            <p>{{ formatDate(withdrawal.date) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
