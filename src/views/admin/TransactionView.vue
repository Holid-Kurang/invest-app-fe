<script setup>
import { ref, onMounted, computed } from "vue";
import Badge from "@/components/Badge.vue";
import formatCurrency from "@/lib/format-currency";
import { Search, ChevronDown } from "lucide-vue-next";
import { apiService } from "@/services/api";

const isLoading = ref(false);
const allWithdrawals = ref([]);
const error = ref("");
const searchQuery = ref("");
const successMessage = ref("");
const isModalOpen = ref(false);
const isModalCreateOpen = ref(false);
const selectedIndex = ref(null);

// Computed untuk filter withdrawal berdasarkan search
const filteredWithdrawals = computed(() => {
    if (!searchQuery.value.trim()) {
        return allWithdrawals.value;
    }

    const query = searchQuery.value.toLowerCase();
    return allWithdrawals.value.filter(
        (withdrawal) =>
            withdrawal.investor.toLowerCase().includes(query) ||
            withdrawal.investor_email.toLowerCase().includes(query) ||
            withdrawal.status.toLowerCase().includes(query),
    );
});

// Status options
const statuses = ["pending", "success", "rejected"];
const statusLabels = {
    pending: "Pending",
    success: "Successful",
    rejected: "Rejected",
};

// Dropdown state for each withdrawal
const showDropdown = ref([]);

// Fungsi untuk mengambil semua data withdrawal
const fetchAllWithdrawals = async () => {
    try {
        isLoading.value = true;
        error.value = "";

        const response = await apiService.getAllWithdrawals();

        if (response.success && response.data) {
            allWithdrawals.value = response.data;
            // Initialize dropdown state
            showDropdown.value = new Array(response.data.length).fill(false);
        }
    } catch (err) {
        error.value = err.message || "Gagal mengambil data withdrawal";
        console.error("Fetch withdrawals error:", err);
    } finally {
        isLoading.value = false;
    }
};

// Fungsi untuk memformat tanggal
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Fungsi dropdown
const toggleDropdown = (index) => {
    const wasOpen = showDropdown.value[index];
    showDropdown.value = showDropdown.value.map(() => false);
    showDropdown.value[index] = !wasOpen;
};

// Fungsi untuk update status
const updateStatus = async (withdrawalId, newStatus, index) => {
    try {
        const response = await apiService.updateWithdrawalStatus(
            withdrawalId,
            newStatus,
        );

        if (response.success) {
            // Update local data
            allWithdrawals.value[index].status = newStatus;
            showDropdown.value[index] = false;

            // Show success message
            successMessage.value = `Status withdrawal berhasil diupdate ke ${statusLabels[newStatus]}`;
            setTimeout(() => {
                successMessage.value = "";
            }, 3000);
        }
    } catch (err) {
        console.error("Update status error:", err);
        error.value = err.message || "Gagal mengupdate status";
        setTimeout(() => {
            error.value = "";
        }, 3000);
    }
};

// Modal functions (keeping existing functionality)
const confirmDelete = (index) => {
    selectedIndex.value = index;
    isModalOpen.value = true;
};

const deleteInvestor = () => {
    if (selectedIndex.value !== null) {
        allWithdrawals.value.splice(selectedIndex.value, 1);
        isModalOpen.value = false;
        selectedIndex.value = null;
    }
};

const cancelDelete = () => {
    isModalOpen.value = false;
    selectedIndex.value = null;
};

const openCreateModal = () => {
    isModalCreateOpen.value = true;
};

// Load data saat komponen dimount
onMounted(() => {
    fetchAllWithdrawals();
});
</script>

<template>
    <h1 class="text-2xl font-bold text-blue-800 mb-6">
        Withdrawal Transactions Management
    </h1>

    <section class="mt-4 relative z-0">
        <div class="relative w-fit">
            <input v-model="searchQuery" type="search" placeholder="Search by investor, email, or status..."
                class="w-80 h-9 ps-10 pe-3 border border-blue-900 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm transition duration-150" />
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-8 mt-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="ml-2 text-gray-600">Loading withdrawals...</span>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage"
            class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 mt-4">
            {{ successMessage }}
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mt-8">
            {{ error }}
            <button @click="fetchAllWithdrawals" class="ml-2 underline">Retry</button>
        </div>

        <!-- Results Counter -->
        <div v-if="!isLoading && !error" class="mt-4 text-sm text-gray-600">
            Showing {{ filteredWithdrawals.length }} of
            {{ allWithdrawals.length }} withdrawals
        </div>

        <div v-if="!isLoading && !error" class="shadow-md mt-4 overflow-x-auto">
            <table class="min-w-full table-auto text-sm text-gray-800">
                <thead>
                    <tr class="bg-blue-800 text-white text-left">
                        <th class="px-4 py-3 font-semibold">No.</th>
                        <th class="px-4 py-3 font-semibold max-md:min-w-[200px]">
                            Date
                        </th>
                        <th class="px-4 py-3 font-semibold max-md:min-w-[200px]">
                            Investor
                        </th>
                        <th class="px-4 py-3 font-semibold">Amount</th>
                        <th class="px-4 py-3 font-semibold">Status</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-if="filteredWithdrawals.length === 0">
                        <td colspan="5" class="px-4 py-8 text-center text-gray-500">
                            {{
                                searchQuery
                                    ? "No withdrawals found matching your search"
                                    : "No withdrawals found"
                            }}
                        </td>
                    </tr>
                    <tr v-else v-for="(withdrawal, index) in filteredWithdrawals" :key="withdrawal.id"
                        class="odd:bg-slate-50 even:bg-white hover:bg-blue-50 transition-colors duration-150">
                        <td class="px-4 py-3">{{ index + 1 }}.</td>
                        <td class="px-4 py-3">
                            <div class="text-sm">
                                <div class="font-medium">
                                    {{
                                        formatDate(withdrawal.date).split(" ").slice(0, 3).join(" ")
                                    }}
                                </div>
                                <div class="text-xs text-gray-500">
                                    {{
                                        formatDate(withdrawal.date).split(" ").slice(3).join(" ")
                                    }}
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3">
                            <div>
                                <div class="font-medium">{{ withdrawal.investor }}</div>
                                <div class="text-xs text-gray-500">
                                    {{ withdrawal.investor_email }}
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3">{{ formatCurrency(withdrawal.amount) }}</td>
                        <td class="px-4 py-3">
                            <div class="inline-block w-full relative">
                                <div class="w-full py-1.5 rounded cursor-pointer flex items-center  hover:bg-slate-100 transition"
                                    @click="toggleDropdown(index)">
                                    <Badge :value="statusLabels[withdrawal.status]" />
                                    <ChevronDown class="w-4 h-4 ml-2 transition-transform"
                                        :class="{ 'rotate-180': showDropdown[index] }" />
                                </div>

                                <!-- Dropdown -->
                                <div v-if="showDropdown[index]"
                                    class="absolute left-0 z-100 mt-2 w-36 bg-white border border-slate-200 rounded-lg shadow-lg">
                                    <div v-for="status in statuses" :key="status"
                                        @click="updateStatus(withdrawal.id, status, index)"
                                        class="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm flex items-center justify-center"
                                        :class="{ 'bg-blue-100': withdrawal.status === status }">
                                        <Badge :value="statusLabels[status]" />
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>
