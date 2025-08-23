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

            <form @submit.prevent="submitInvestment" class="space-y-4 mt-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <!-- Alert for messages -->
                <div v-if="message.text" :class="messageClass" class="p-3 rounded-md text-sm">
                    {{ message.text }}
                </div>

                <div>
                    <label class="block text-sm font-medium text-blue-900 mb-1">Amount</label>
                    <input 
                        v-model="form.amount"
                        type="number"
                        step="any"
                        min="1"
                        required
                        :disabled="loading"
                        class="w-full h-10 px-4 py-2 text-sm border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:bg-gray-100"
                        placeholder="Enter your amount" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-blue-900 mb-1">Payment Proof</label>
                    <input 
                        @change="handleFileChange"
                        type="file"
                        accept="image/*"
                        required
                        :disabled="loading"
                        class="w-full h-10 px-4 py-2 text-sm border border-blue-500 rounded-md bg-white file:bg-slate-200 file:text-blue-800 file:p-1 file:text-xs file:rounded-lg disabled:bg-gray-100" />
                    <p class="text-xs text-gray-500 mt-1">Upload bukti pembayaran (JPEG, PNG, GIF. Max: 5MB)</p>
                </div>

                <button 
                    type="submit"
                    :disabled="loading"
                    class="w-full py-2 bg-blue-900 text-white rounded-md font-semibold hover:bg-blue-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                    <span v-if="loading">Processing...</span>
                    <span v-else>Submit</span>
                </button>
            </form>
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { api } = useAuth()

const form = ref({
    amount: '',
    proof: null
})

const message = ref({
    text: '',
    type: ''
})

const loading = ref(false)

const messageClass = computed(() => {
    return {
        'bg-green-100 text-green-700 border border-green-300': message.value.type === 'success',
        'bg-red-100 text-red-700 border border-red-300': message.value.type === 'error',
        'bg-yellow-100 text-yellow-700 border border-yellow-300': message.value.type === 'warning'
    }
})

const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        // Validasi file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            message.value = {
                text: 'File terlalu besar. Maksimal 5MB',
                type: 'error'
            }
            event.target.value = ''
            return
        }
        
        // Validasi file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
            message.value = {
                text: 'Hanya file gambar (JPEG, JPG, PNG, GIF) yang diperbolehkan',
                type: 'error'
            }
            event.target.value = ''
            return
        }
        
        form.value.proof = file
        message.value = { text: '', type: '' }
    }
}

const submitInvestment = async () => {
    try {
        loading.value = true
        message.value = { text: '', type: '' }

        // Validasi form
        if (!form.value.amount || parseFloat(form.value.amount) <= 0) {
            message.value = {
                text: 'Amount harus diisi dan lebih dari 0',
                type: 'error'
            }
            return
        }
        if (!form.value.proof) {
            message.value = {
                text: 'Bukti pembayaran harus diupload',
                type: 'error'
            }
            return
        }

        // Siapkan form data
        const formData = new FormData()
        formData.append('amount', form.value.amount)
        formData.append('proof', form.value.proof)

        // Kirim request
        const response = await api.post('/invest', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        console.log('Submit investment response:', response)
        if (response.success) {
            message.value = {
                text: 'Investasi berhasil dibuat! Notifikasi telah dikirim ke admin untuk verifikasi.',
                type: 'success'
            }
            
            // Reset form
            form.value = {
                amount: '',
                proof: null
            }
            
            // Reset file input
            const fileInput = document.querySelector('input[type="file"]')
            if (fileInput) fileInput.value = ''
        } else {
            message.value = {
                text: response.data.message || 'Terjadi kesalahan',
                type: 'error'
            }
        }

    } catch (error) {
        console.error('Submit investment error:', error)
        message.value = {
            text: error.response?.data?.message || 'Terjadi kesalahan saat mengirim investasi',
            type: 'error'
        }
    } finally {
        loading.value = false
    }
}
</script>
