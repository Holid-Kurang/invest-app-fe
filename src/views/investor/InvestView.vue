<script setup lang="ts">
import { useInvest } from '@/composables/useInvest'

const {
    form,
    message,
    loading,
    messageClass,
    handleFileChange,
    submitInvestment,
    clearMessage
} = useInvest()

const handleFileInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0] || null

    const result = handleFileChange(file)
    if (!result.success) {
        target.value = '' // Clear input if validation fails
    }
}

const handleSubmit = async (event: Event) => {
    event.preventDefault()
    clearMessage()

    try {
        const result = await submitInvestment()

        // Reset file input if successful
        if (result.success) {
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
            if (fileInput) fileInput.value = ''

            // Auto clear success message after 5 seconds
            setTimeout(() => {
                clearMessage()
            }, 5000)
        }
    } catch (error) {
        console.error('Submit investment error:', error)
    }
}
</script>

<template>
    <h1 class="text-2xl font-bold text-blue-800 mb-6">
        Start your Investment here
    </h1>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
            <div class="bg-slate-100 rounded-2xl shadow-sm p-6">
                <h2 class="text-xl font-bold text-blue-800 mb-2">Bank Account BCA</h2>
                <p class="text-lg font-semibold text-gray-800">675092</p>
                <p class="text-sm text-gray-600">Amde Advisor</p>
            </div>

            <form @submit="handleSubmit"
                class="space-y-4 mt-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <!-- Alert for messages -->
                <div v-if="message.text" :class="messageClass" class="p-3 rounded-md text-sm">
                    {{ message.text }}
                </div>

                <div>
                    <label class="block text-sm font-medium text-blue-900 mb-1">Amount</label>
                    <input v-model="form.amount" type="number" step="any" min="1" required :disabled="loading"
                        class="w-full h-10 px-4 py-2 text-sm border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:bg-gray-100"
                        placeholder="Enter your amount" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-blue-900 mb-1">Payment Proof</label>
                    <input @change="handleFileInput" type="file" accept="image/*" required :disabled="loading"
                        class="w-full h-10 px-4 py-2 text-sm border border-blue-500 rounded-md bg-white file:bg-slate-200 file:text-blue-800 file:p-1 file:text-xs file:rounded-lg disabled:bg-gray-100" />
                    <p class="text-xs text-gray-500 mt-1">Upload bukti pembayaran (JPEG, PNG, GIF. Max: 5MB)</p>
                </div>

                <button type="submit" :disabled="loading"
                    class="w-full py-2 bg-blue-900 text-white rounded-md font-semibold hover:bg-blue-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                    <span v-if="loading">Processing...</span>
                    <span v-else>Submit</span>
                </button>
            </form>
        </div>
    </section>
</template>