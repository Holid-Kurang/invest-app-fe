import axios from 'axios'
import type { AxiosInstance } from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

interface ApiResponse<T = any> {
    success: boolean
    message: string
    data?: T
}

interface LoginResponse {
    user: {
        id_user: number
        email: string
        role: 'admin' | 'investor'
    }
    token: string
}

class ApiService {
    private axiosInstance: AxiosInstance

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        })

        // Request interceptor to add auth token
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token')
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            },
            (error) => Promise.reject(error)
        )

        // Response interceptor to handle errors
        this.axiosInstance.interceptors.response.use(
            (response) => response.data,
            (error) => {
                const message = error.response?.data?.message || error.message || 'API call failed'
                console.error(`API Error:`, error)
                return Promise.reject(new Error(message))
            }
        )
    }

    // Generic HTTP methods
    async get(url: string, config?: any) {
        return this.axiosInstance.get(url, config)
    }

    async post(url: string, data?: any, config?: any) {
        return this.axiosInstance.post(url, data, config)
    }

    async put(url: string, data?: any, config?: any) {
        return this.axiosInstance.put(url, data, config)
    }

    async delete(url: string, config?: any) {
        return this.axiosInstance.delete(url, config)
    }

    // Auth
    async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
        return this.post('/auth/login', { email, password }) as unknown as Promise<ApiResponse<LoginResponse>>
    }

    // Dashboard
    async getInvestorDashboard() {
        return this.get('/dashboard/investor')
    }
    async getAdminDashboard() {
        return this.get('/dashboard/admin')
    }

    // Investments
    async getInvestments() {
        return this.get('/invest')
    }

    async createInvestmentWithFile(formData: FormData) {
        return this.post('/invest', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    }

    // Withdrawals
    async getWithdrawals() {
        return this.get('/withdrawal')
    }

    async createWithdrawal(amount: number) {
        return this.post('/withdrawal', { amount })
    }

    // Admin - Investors
    async getInvestors() {
        return this.get('/admin/investors')
    }

    async createInvestor(investorData: { name: string; email: string; password: string }) {
        return this.post('/admin/investors', investorData)
    }

    async updateInvestor(id: number, investorData: { name: string; email: string; password?: string }) {
        return this.put(`/admin/investors/${id}`, investorData)
    }

    async deleteInvestor(id: number) {
        return this.delete(`/admin/investors/${id}`)
    }

    // Admin - All Transactions History
    async getAllTransactions() {
        return this.get('/admin/transactions')
    }

    // Admin - All Withdrawals
    async getAllWithdrawals() {
        return this.get('/withdrawal/admin/all')
    }

    // Admin - Update Withdrawal Status
    async updateWithdrawalStatus(id: number, status: string) {
        return this.put(`/withdrawal/${id}/status`, { status })
    }

    // Admin - Update Investment Status
    async updateInvestmentStatus(id: number, status: string) {
        return this.put(`/invest/${id}/status`, { status })
    }

    // Admin - Get All Investments
    async getAllInvestments() {
        return this.get('/invest/admin/all')
    }
}

export const apiService = new ApiService()
export default apiService
