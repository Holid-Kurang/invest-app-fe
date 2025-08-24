import { ref, computed } from 'vue'
import { apiService } from '@/services/api'

interface ApiResponse<T = any> {
    success: boolean
    message: string
    data?: T
}

interface WithdrawalData {
    id: number
    id_user: number
    amount: number
    status: 'pending' | 'success' | 'rejected'
    date: string
}

interface WithdrawalForm {
    amount: string
}

interface WithdrawalMessage {
    text: string
    type: 'success' | 'error' | 'warning'
}

export function useWithdrawal() {
    const withdrawals = ref<WithdrawalData[]>([])
    const dashboardData = ref<any>(null)
    const loading = ref(false)
    const error = ref('')

    const form = ref<WithdrawalForm>({
        amount: ''
    })

    const message = ref<WithdrawalMessage>({
        text: '',
        type: 'error'
    })

    // Computed
    const messageClass = computed(() => {
        return {
            'bg-green-100 text-green-700 border border-green-300': message.value.type === 'success',
            'bg-red-100 text-red-700 border border-red-300': message.value.type === 'error',
            'bg-yellow-100 text-yellow-700 border border-yellow-300': message.value.type === 'warning'
        }
    })

    const pendingWithdrawals = computed(() => 
        withdrawals.value.filter(withdrawal => withdrawal.status === 'pending')
    )

    const successWithdrawals = computed(() => 
        withdrawals.value.filter(withdrawal => withdrawal.status === 'success')
    )

    const rejectedWithdrawals = computed(() => 
        withdrawals.value.filter(withdrawal => withdrawal.status === 'rejected')
    )

    const totalSuccessWithdrawals = computed(() => 
        successWithdrawals.value.reduce((sum, withdrawal) => sum + withdrawal.amount, 0)
    )

    // Get totalReturn from dashboard data
    const totalReturn = computed(() => {
        return dashboardData.value?.statistics?.totalReturns || 0
    })

    // Validation
    const validateForm = (form: WithdrawalForm) => {
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

        if (amount < 100000) {
            return {
                isValid: false,
                error: 'Amount minimal Rp 100.000'
            }
        }

        if (amount >= 10000000000) {
            return {
                isValid: false,
                error: 'Amount tidak boleh melebihi Rp 10.000.000.000'
            }
        }

        return { isValid: true }
    }

    // Methods
    const fetchDashboardData = async () => {
        try {
            const response = await apiService.getInvestorDashboard()
            dashboardData.value = response.data || null
        } catch (err: any) {
            console.error('Fetch dashboard error:', err)
        }
    }

    const fetchWithdrawals = async () => {
        try {
            loading.value = true
            error.value = ''
            
            // Fetch withdrawals and dashboard data
            const [withdrawalResponse] = await Promise.all([
                apiService.getWithdrawals(),
                fetchDashboardData()
            ])
            
            withdrawals.value = withdrawalResponse.data || []
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Gagal mengambil data withdrawals'
            console.error('Fetch withdrawals error:', err)
        } finally {
            loading.value = false
        }
    }

    const submitWithdrawal = async () => {
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

            console.log('Submitting withdrawal:', {
                amount: form.value.amount
            })

            // Kirim request
            const response = await apiService.createWithdrawal(parseFloat(form.value.amount)) as unknown as ApiResponse<any>

            console.log('Withdrawal response:', response)

            if (response.success) {
                message.value = {
                    text: 'Withdrawal berhasil dibuat! Menunggu persetujuan admin.',
                    type: 'success'
                }
                
                // Reset form setelah sukses
                form.value.amount = ''
                
                // Refresh data withdrawals
                await fetchWithdrawals()
                
                return {
                    success: true,
                    message: 'Withdrawal submitted successfully',
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
            console.error('Submit withdrawal error:', error)
            const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan saat mengirim withdrawal'
            
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
        error.value = ''
    }

    return {
        // State
        withdrawals,
        loading,
        error,
        form,
        message,

        // Computed
        messageClass,
        pendingWithdrawals,
        successWithdrawals,
        rejectedWithdrawals,
        totalSuccessWithdrawals,
        totalReturn,

        // Methods
        fetchWithdrawals,
        submitWithdrawal,
        validateForm,
        clearMessage
    }
}
