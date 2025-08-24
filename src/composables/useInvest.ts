import { ref, computed } from 'vue'
import { apiService } from '@/services/api'

interface ApiResponse<T = any> {
    success: boolean
    message: string
    data?: T
}

interface InvestForm {
    amount: string
    proof: File | null
}

interface InvestMessage {
    text: string
    type: 'success' | 'error' | 'warning'
}

export function useInvest() {
    const form = ref<InvestForm>({
        amount: '',
        proof: null
    })

    const message = ref<InvestMessage>({
        text: '',
        type: 'error'
    })

    const loading = ref(false)

    // Computed
    const messageClass = computed(() => {
        return {
            'bg-green-100 text-green-700 border border-green-300': message.value.type === 'success',
            'bg-red-100 text-red-700 border border-red-300': message.value.type === 'error',
            'bg-yellow-100 text-yellow-700 border border-yellow-300': message.value.type === 'warning'
        }
    })

    // Validation
    const validateForm = (form: InvestForm) => {
        if (!form.amount || String(form.amount).trim() === '') {
            return {
                isValid: false,
                error: 'Amount harus diisi'
            }
        }

        const amount = parseFloat(form.amount)
        
        if (isNaN(amount) || amount <= 0) {
            return {
                isValid: false,
                error: 'Amount harus berupa angka yang valid dan lebih dari 0'
            }
        }

        if (amount >= 10000000000) {
            return {
                isValid: false,
                error: 'Amount tidak boleh melebihi Rp 10.000.000.000'
            }
        }

        if (!form.proof) {
            return {
                isValid: false,
                error: 'Bukti pembayaran harus diupload'
            }
        }

        return { isValid: true }
    }

    const validateFile = (file: File) => {
        // Validasi file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return {
                isValid: false,
                error: 'File terlalu besar. Maksimal 5MB'
            }
        }
        
        // Validasi file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
            return {
                isValid: false,
                error: 'Hanya file gambar (JPEG, JPG, PNG, GIF) yang diperbolehkan'
            }
        }

        return { isValid: true }
    }

    // Methods
    const handleFileChange = (file: File | null) => {
        if (!file) {
            form.value.proof = null
            return { success: true }
        }

        const validation = validateFile(file)
        if (!validation.isValid) {
            message.value = {
                text: validation.error || 'File tidak valid',
                type: 'error'
            }
            return { success: false, message: validation.error }
        }
        
        form.value.proof = file
        message.value = { text: '', type: 'error' }
        return { success: true }
    }

    const submitInvestment = async () => {
        try {
            loading.value = true
            message.value = { text: '', type: 'error' }

            // Validasi form
            const validation = validateForm(form.value)
            if (!validation.isValid) {
                message.value = {
                    text: validation.error || 'Form tidak valid',
                    type: 'error'
                }
                return {
                    success: false,
                    message: validation.error || 'Form tidak valid'
                }
            }

            // Siapkan form data
            const formData = new FormData()
            formData.append('amount', form.value.amount)
            if (form.value.proof) {
                formData.append('proof', form.value.proof)
            }

            console.log('Submitting investment:', {
                amount: form.value.amount,
                proof: form.value.proof?.name
            })

            // Kirim request
            const response = await apiService.createInvestmentWithFile(formData) as unknown as ApiResponse<any>

            console.log('Investment response:', response)

            if (response.success) {
                message.value = {
                    text: 'Investasi berhasil dibuat! Notifikasi telah dikirim ke admin untuk verifikasi.',
                    type: 'success'
                }
                
                // Reset form setelah sukses
                form.value = {
                    amount: '',
                    proof: null
                }
                
                return {
                    success: true,
                    message: 'Investment submitted successfully',
                    data: response.data
                }
            } else {
                const errorMessage = response.message || 'Terjadi kesalahan'
                message.value = {
                    text: errorMessage,
                    type: 'error'
                }
                
                return {
                    success: false,
                    message: errorMessage
                }
            }

        } catch (error: any) {
            console.error('Submit investment error:', error)
            const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan saat mengirim investasi'
            
            message.value = {
                text: errorMessage,
                type: 'error'
            }
            
            return {
                success: false,
                message: errorMessage
            }
        } finally {
            loading.value = false
        }
    }

    const clearMessage = () => {
        message.value = { text: '', type: 'error' }
    }

    const resetForm = () => {
        form.value = {
            amount: '',
            proof: null
        }
        clearMessage()
    }

    return {
        // State
        form,
        message,
        loading,

        // Computed
        messageClass,

        // Methods
        handleFileChange,
        submitInvestment,
        validateForm,
        validateFile,
        clearMessage,
        resetForm
    }
}
