<script setup lang="ts">
import { Pencil, Plus, Trash } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AccountModal from "@/components/AccountModal.vue";
import { useInvestors } from "@/composables/useInvestors";

interface AccountData {
    id?: number
    date?: string
    name: string
    email: string
    password: string
}

const {
    investors,
    loading,
    error,
    fetchInvestors,
    createInvestor,
    updateInvestor,
    deleteInvestor,
    formatDate
} = useInvestors();

const isDeleteModalOpen = ref(false);
const isAccountModalOpen = ref(false);
const accountModalMode = ref<'create' | 'edit'>('create');
const selectedIndex = ref<number | null>(null);
const selectedAccount = ref<AccountData | null>(null);
const selectedInvestorId = ref<number | null>(null);

onMounted(() => {
    fetchInvestors();
});

const confirmDelete = (index: number) => {
    selectedIndex.value = index;
    selectedInvestorId.value = investors.value[index].id_user;
    isDeleteModalOpen.value = true;
};

const handleConfirmDelete = async () => {
    if (selectedInvestorId.value !== null) {
        const result = await deleteInvestor(selectedInvestorId.value);
        if (result.success) {
            console.log('Investor deleted successfully');
        } else {
            console.error('Failed to delete investor:', result.message);
        }
        selectedIndex.value = null;
        selectedInvestorId.value = null;
    }
    isDeleteModalOpen.value = false;
};

const handleCancelDelete = () => {
    selectedIndex.value = null;
    selectedInvestorId.value = null;
    isDeleteModalOpen.value = false;
};

const openCreateModal = () => {
    accountModalMode.value = 'create';
    selectedAccount.value = null;
    isAccountModalOpen.value = true;
};

const openEditModal = (index: number) => {
    accountModalMode.value = 'edit';
    selectedIndex.value = index;
    const investor = investors.value[index];
    selectedAccount.value = {
        id: investor.id_user,
        name: investor.name,
        email: investor.email,
        password: investor.password,
        date: formatDate(investor.created_at)
    };
    isAccountModalOpen.value = true;
};

const handleSaveAccount = async (accountData: AccountData) => {
    if (accountModalMode.value === 'create') {
        // Create new investor
        const result = await createInvestor({
            name: accountData.name,
            email: accountData.email,
            password: accountData.password
        });

        if (result.success) {
            console.log('Investor created successfully');
        } else {
            console.error('Failed to create investor:', result.message);
        }
    } else if (selectedAccount.value?.id) {
        // Update existing investor
        const updateData: { name: string; email: string; password?: string } = {
            name: accountData.name,
            email: accountData.email
        };

        if (accountData.password) {
            updateData.password = accountData.password;
        }

        const result = await updateInvestor(selectedAccount.value.id, updateData);

        if (result.success) {
            console.log('Investor updated successfully');
        } else {
            console.error('Failed to update investor:', result.message);
        }
    }

    // Reset selection
    selectedIndex.value = null;
    selectedAccount.value = null;
};

const handleCloseAccountModal = () => {
    isAccountModalOpen.value = false;
    selectedIndex.value = null;
    selectedAccount.value = null;
};
</script>

<template>
    <h1 class="text-2xl font-bold text-blue-800 mb-6">Add Your Investor Here</h1>

    <button @click="openCreateModal"
        class="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 rounded-lg px-4 py-2 shadow-md cursor-pointer mt-4">
        <Plus class="w-5 h-5" />
        <span class="font-medium">Add Investor</span>
    </button>

    <section>
        <!-- Loading State -->
        <div v-if="loading" class="mt-8 text-center">
            <div
                class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-500 bg-blue-100">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                Loading investors...
            </div>
        </div>

        <!-- Error State -->
        <div v-if="error && !loading" class="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{{ error }}</p>
            <button @click="fetchInvestors"
                class="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm">
                Retry
            </button>
        </div>

        <!-- Table -->
        <div v-if="!loading && !error" class="mt-8 overflow-x-auto">
            <div class="min-w-[800px] sm:min-w-full shadow-md rounded-xl">
                <table class="min-w-full table-auto text-sm text-gray-800">
                    <thead>
                        <tr class="bg-blue-800 text-white text-left">
                            <th class="px-4 py-3 font-semibold">No.</th>
                            <th class="px-4 py-3 font-semibold">Date</th>
                            <th class="px-4 py-3 font-semibold">Name</th>
                            <th class="px-4 py-3 font-semibold">Email</th>
                            <th class="px-4 py-3 font-semibold">Status</th>
                            <th class="px-4 py-3 font-semibold text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(item, index) in investors" :key="item.id_user"
                            class="odd:bg-slate-50 even:bg-white hover:bg-blue-50 transition-colors duration-150">
                            <td class="px-4 py-3">{{ index + 1 }}.</td>
                            <td class="px-4 py-3">{{ formatDate(item.created_at) }}</td>
                            <td class="px-4 py-3">{{ item.name }}</td>
                            <td class="px-4 py-3">{{ item.email }}</td>
                            <td class="px-4 py-3">
                                <span
                                    :class="item.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'"
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                    {{ item.role }}
                                </span>
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex flex-row-reverse justify-center gap-2">
                                    <button
                                        class="bg-red-500 hover:bg-red-600 transition text-white rounded-lg p-2 cursor-pointer"
                                        @click="confirmDelete(index)">
                                        <Trash class="w-4 h-4" />
                                    </button>
                                    <button @click="openEditModal(index)"
                                        class="bg-yellow-500 hover:bg-yellow-600 transition text-white rounded-lg p-2 cursor-pointer">
                                        <Pencil class="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Empty State -->
                <div v-if="investors.length === 0" class="text-center py-8 bg-gray-50">
                    <p class="text-gray-500">No investors found</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Account Create/Edit Modal -->
    <AccountModal :is-open="isAccountModalOpen" :mode="accountModalMode" :account-data="selectedAccount"
        @save="handleSaveAccount" @close="handleCloseAccountModal" />

    <!-- Confirm Delete Modal -->
    <ConfirmModal :is-open="isDeleteModalOpen" type="danger" title="Confirm Deletion"
        message="Are you sure you want to delete this investor record? This action cannot be undone."
        confirm-text="Yes, Delete" cancel-text="Cancel"
        confirm-button-class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        cancel-button-class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
        @confirm="handleConfirmDelete" @cancel="handleCancelDelete" @close="handleCancelDelete" />
</template>
