import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'

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
            (error) => {
                return Promise.reject(error)
            }
        )

        // Response interceptor to handle errors
        this.axiosInstance.interceptors.response.use(
            (response) => {
                return response.data
            },
            (error) => {
                const message = error.response?.data?.message || error.message || 'API call failed'
                console.error(`API Error:`, error)
                return Promise.reject(new Error(message))
            }
        )
    }

    // Auth endpoints
    async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
        return this.axiosInstance.post('/auth/login', { email, password })
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

    // Dashboard endpoints
    async getInvestorDashboard() {
        return this.axiosInstance.get('/dashboard/investor')
    }

    // Investment endpoints
    async getInvestments() {
        return this.axiosInstance.get('/invest')
    }

    async createInvestment(amount: number, proof?: string) {
        return this.axiosInstance.post('/invest', { amount, proof })
    }

    async createInvestmentWithFile(formData: FormData) {
        return this.axiosInstance.post('/invest', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    // Return endpoints
    async getReturns() {
        return this.axiosInstance.get('/return')
    }

    async requestReturn(amount: number) {
        return this.axiosInstance.post('/return', { amount })
    }

    // Withdrawal endpoints
    async getWithdrawals() {
        return this.axiosInstance.get('/withdrawal')
    }

    async createWithdrawal(amount: number) {
        return this.axiosInstance.post('/withdrawal', { amount })
    }

    // Admin endpoints
    async getUsers() {
        return this.axiosInstance.get('/admin/users')
    }

    async getAllInvestments() {
        return this.axiosInstance.get('/admin/investments')
    }

    async getAllReturns() {
        return this.axiosInstance.get('/admin/returns')
    }

    async getAllWithdrawals() {
        return this.axiosInstance.get('/admin/withdrawals')
    }

    async approveInvestment(investId: number) {
        return this.axiosInstance.put(`/admin/invest/${investId}/approve`)
    }

    async rejectInvestment(investId: number) {
        return this.axiosInstance.put(`/admin/invest/${investId}/reject`)
    }

    async approveReturn(returnId: number) {
        return this.axiosInstance.put(`/admin/return/${returnId}/approve`)
    }

    async rejectReturn(returnId: number) {
        return this.axiosInstance.put(`/admin/return/${returnId}/reject`)
    }

    async approveWithdrawal(withdrawalId: number) {
        return this.axiosInstance.put(`/admin/withdrawal/${withdrawalId}/approve`)
    }

    async rejectWithdrawal(withdrawalId: number) {
        return this.axiosInstance.put(`/admin/withdrawal/${withdrawalId}/reject`)
    }
}

export const apiService = new ApiService()
export default apiService
