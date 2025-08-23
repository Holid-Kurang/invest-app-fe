import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api'

interface User {
    id_user: number
    email: string
    role: 'admin' | 'investor'
}

interface LoginData {
    email: string
    password: string
}

// Reactive state
const user = ref<User | null>(null)
const token = ref<string | null>(null)
const isLoading = ref(false)

// Computed
const isAuthenticated = computed(() => !!token.value && !!user.value)
const isAdmin = computed(() => user.value?.role === 'admin')
const isInvestor = computed(() => user.value?.role === 'investor')

export function useAuth() {
    const router = useRouter()

    // Initialize auth state from localStorage
    const initAuth = () => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
            token.value = storedToken
            user.value = JSON.parse(storedUser)
        }
    }

    // Login function
    const login = async (loginData: LoginData) => {
        isLoading.value = true

        try {
            const result = await apiService.login(loginData.email, loginData.password)

            // Store auth data
            if (result.data) {
                token.value = result.data.token
                user.value = result.data.user

                localStorage.setItem('token', result.data.token)
                localStorage.setItem('user', JSON.stringify(result.data.user))
            }

            return result
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // Logout function
    const logout = () => {
        user.value = null
        token.value = null

        localStorage.removeItem('token')
        localStorage.removeItem('user')

        router.push('/')
    }

    // Redirect based on role
    const redirectByRole = () => {
        if (user.value?.role === 'admin') {
            router.push('/admin')
        } else if (user.value?.role === 'investor') {
            router.push('/investor')
        }
    }

    return {
        // State
        user: computed(() => user.value),
        token: computed(() => token.value),
        isLoading: computed(() => isLoading.value),

        // Computed
        isAuthenticated,
        isAdmin,
        isInvestor,

        // Methods
        initAuth,
        login,
        logout,
        redirectByRole,

        // API instance
        api: apiService
    }
}
