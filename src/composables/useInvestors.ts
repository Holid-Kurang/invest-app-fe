import { ref } from 'vue'
import { apiService } from '@/services/api'

interface Investor {
    id_user: number
    name: string
    email: string
    password: string
    role: string
    created_at: string
    updated_at: string
}

interface InvestorFormData {
    name: string
    email: string
    password: string
}

export function useInvestors() {
    const investors = ref<Investor[]>([])
    const loading = ref(false)
    const error = ref('')

    const fetchInvestors = async () => {
        try {
            loading.value = true
            error.value = ''
            const response = await apiService.getInvestors() as any

            if (response.success) {
                investors.value = response.data
            } else {
                error.value = response.message || 'Failed to fetch investors'
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch investors'
            console.error('Fetch investors error:', err)
        } finally {
            loading.value = false
        }
    }

    const createInvestor = async (investorData: InvestorFormData) => {
        try {
            loading.value = true
            error.value = ''
            const response = await apiService.createInvestor(investorData) as any

            if (response.success) {
                // Add new investor to list
                investors.value.unshift(response.data)
                return { success: true, message: response.message }
            } else {
                error.value = response.message || 'Failed to create investor'
                return { success: false, message: response.message }
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to create investor'
            return { success: false, message: err.message }
        } finally {
            loading.value = false
        }
    }

    const updateInvestor = async (id: number, investorData: { name: string; email: string; password?: string }) => {
        try {
            loading.value = true
            error.value = ''
            const response = await apiService.updateInvestor(id, investorData) as any

            if (response.success) {
                // Update investor in list
                const index = investors.value.findIndex(inv => inv.id_user === id)
                if (index !== -1) {
                    investors.value[index] = response.data
                }
                return { success: true, message: response.message }
            } else {
                error.value = response.message || 'Failed to update investor'
                return { success: false, message: response.message }
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to update investor'
            return { success: false, message: err.message }
        } finally {
            loading.value = false
        }
    }

    const deleteInvestor = async (id: number) => {
        try {
            loading.value = true
            error.value = ''
            const response = await apiService.deleteInvestor(id) as any

            if (response.success) {
                // Remove investor from list
                investors.value = investors.value.filter(inv => inv.id_user !== id)
                return { success: true, message: response.message }
            } else {
                error.value = response.message || 'Failed to delete investor'
                return { success: false, message: response.message }
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to delete investor'
            return { success: false, message: err.message }
        } finally {
            loading.value = false
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return {
        investors,
        loading,
        error,
        fetchInvestors,
        createInvestor,
        updateInvestor,
        deleteInvestor,
        formatDate
    }
}
