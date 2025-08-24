<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    isOpen: boolean
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    confirmButtonClass?: string
    cancelButtonClass?: string
    type?: 'danger' | 'warning' | 'info' | 'success'
}

interface Emits {
    (e: 'confirm'): void
    (e: 'cancel'): void
    (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmButtonClass: 'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors',
    cancelButtonClass: 'px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors',
    type: 'danger'
})

const emit = defineEmits<Emits>()

const handleConfirm = () => {
    emit('confirm')
    emit('close')
}

const handleCancel = () => {
    emit('cancel')
    emit('close')
}

const handleBackdropClick = (event: Event) => {
    if (event.target === event.currentTarget) {
        handleCancel()
    }
}

const iconClass = computed(() => {
    switch (props.type) {
        case 'danger':
            return 'text-red-500'
        case 'warning':
            return 'text-yellow-500'
        case 'info':
            return 'text-blue-500'
        case 'success':
            return 'text-green-500'
        default:
            return 'text-red-500'
    }
})
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
                <div v-if="isOpen" class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 relative" @click.stop>
                    <!-- Close button -->
                    <button @click="handleCancel"
                        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <!-- Modal Header -->
                    <div class="text-center mb-4">
                        <!-- Icon based on type -->
                        <div class="mx-auto flex items-center justify-center w-12 h-12 rounded-full mb-4"
                            :class="type === 'danger' ? 'bg-red-100' : type === 'warning' ? 'bg-yellow-100' : type === 'info' ? 'bg-blue-100' : 'bg-green-100'">
                            <!-- Danger icon -->
                            <svg v-if="type === 'danger'" :class="iconClass" class="w-6 h-6" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <!-- Warning icon -->
                            <svg v-else-if="type === 'warning'" :class="iconClass" class="w-6 h-6" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <!-- Info icon -->
                            <svg v-else-if="type === 'info'" :class="iconClass" class="w-6 h-6" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <!-- Success icon -->
                            <svg v-else :class="iconClass" class="w-6 h-6" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 class="text-xl font-semibold text-gray-900">{{ title }}</h2>
                    </div>

                    <!-- Modal Body -->
                    <div class="text-center mb-6">
                        <p class="text-gray-600 leading-relaxed">{{ message }}</p>
                    </div>

                    <!-- Modal Footer -->
                    <div class="flex justify-center space-x-4">
                        <button :class="confirmButtonClass" @click="handleConfirm">
                            {{ confirmText }}
                        </button>
                        <button :class="cancelButtonClass" @click="handleCancel">
                            {{ cancelText }}
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    </Transition>
</template>
