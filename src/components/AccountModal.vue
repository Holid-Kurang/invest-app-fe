<script setup lang="ts">
import { ref, watch } from 'vue'

interface AccountData {
    id?: number
    date?: string
    name: string
    email: string
    password: string
}

interface Props {
    isOpen: boolean
    mode: 'create' | 'edit'
    accountData?: AccountData | null
}

interface Emits {
    (e: 'close'): void
    (e: 'save', data: AccountData): void
}

const props = withDefaults(defineProps<Props>(), {
    accountData: null
})

const emit = defineEmits<Emits>()

const form = ref<AccountData>({
    name: '',
    email: '',
    password: ''
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)

// Watch for props changes to populate form
watch(() => props.accountData, (newData) => {
    if (newData && props.mode === 'edit') {
        form.value = { ...newData }
    }
}, { immediate: true })

// Reset form when modal opens/closes
watch(() => props.isOpen, (isOpen) => {
    if (isOpen && props.mode === 'create') {
        form.value = {
            name: '',
            email: '',
            password: ''
        }
    }
    errors.value = {}
})

const validateForm = () => {
    errors.value = {}

    if (!form.value.name.trim()) {
        errors.value.name = 'Name is required'
    }

    if (!form.value.email.trim()) {
        errors.value.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = 'Please enter a valid email'
    }

    // Password is required for create mode, optional for edit mode
    if (props.mode === 'create') {
        if (!form.value.password.trim()) {
            errors.value.password = 'Password is required'
        } else if (form.value.password.length < 6) {
            errors.value.password = 'Password must be at least 6 characters'
        }
    } else if (form.value.password && form.value.password.length < 6) {
        errors.value.password = 'Password must be at least 6 characters'
    }

    return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
    if (!validateForm()) return

    loading.value = true

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        emit('save', { ...form.value })
        emit('close')
    } catch (error) {
        console.error('Error saving account:', error)
    } finally {
        loading.value = false
    }
}

const handleCancel = () => {
    emit('close')
}

const handleBackdropClick = (event: Event) => {
    if (event.target === event.currentTarget) {
        handleCancel()
    }
}
</script>

<template>
    <!-- Modal Backdrop -->
    <Transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center" @click="handleBackdropClick">
            <!-- Modal Content -->
            <Transition enter-active-class="transition-all duration-300"
                enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
                leave-active-class="transition-all duration-200" leave-from-class="opacity-100 scale-100 translate-y-0"
                leave-to-class="opacity-0 scale-95 translate-y-4">
                <div v-if="isOpen"
                    class="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 relative max-h-[90vh] overflow-y-auto"
                    @click.stop>
                    <!-- Close button -->
                    <button @click="handleCancel"
                        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <!-- Modal Header -->
                    <div class="mb-6">
                        <h2 class="text-2xl font-semibold text-blue-800">
                            {{ mode === 'create' ? 'Add New Investor' : 'Edit Investor' }}
                        </h2>
                        <p class="text-gray-600 mt-1">
                            {{ mode === 'create' ? 'Fill in the details below to create a new investor account' :
                            'Update the investor information below' }}
                        </p>
                    </div>

                    <!-- Form -->
                    <form @submit.prevent="handleSubmit" class="space-y-4">
                        <!-- Name -->
                        <div>
                            <label for="name" class="block text-sm font-medium text-blue-900 mb-1">
                                Name
                            </label>
                            <input id="name" v-model="form.name" type="text" :class="[
                                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
                                errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            ]" placeholder="Enter full name" :disabled="loading" />
                            <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
                        </div>

                        <!-- Email -->
                        <div>
                            <label for="email" class="block text-sm font-medium text-blue-900 mb-1">
                                Email
                            </label>
                            <input id="email" v-model="form.email" type="email" :class="[
                                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
                                errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            ]" placeholder="Enter email address" :disabled="loading" />
                            <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
                        </div>

                        <!-- Password -->
                        <div>
                            <label for="password" class="block text-sm font-medium text-blue-900 mb-1">
                                {{ mode === 'create' ? 'Password' : 'New Password' }}
                                <span v-if="mode === 'edit'" class="text-gray-500 text-xs">(leave empty to keep
                                    current)</span>
                            </label>
                            <input id="password" v-model="form.password" type="text" :class="[
                                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
                                errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            ]" :placeholder="mode === 'create' ? 'Enter password (min. 6 characters)' : 'Enter new password (optional)'"
                                :disabled="loading" />
                            <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
                        </div>

                        <!-- Form Actions -->
                        <div class="flex justify-end space-x-3 pt-4 border-t">
                            <button type="button" @click="handleCancel" :disabled="loading"
                                class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50">
                                Cancel
                            </button>
                            <button type="submit" :disabled="loading"
                                class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2">
                                <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                {{ loading ? 'Saving...' : (mode === 'create' ? 'Create' : 'Update') }}
                            </button>
                        </div>
                    </form>
                </div>
            </Transition>
        </div>
    </Transition>
</template>
