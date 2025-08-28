<script setup>
import Badge from "@/components/Badge.vue";
import formatCurrency from "@/lib/format-currency";
import { FileImage, Trash, ChevronDown } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import { apiService } from "@/services/api";

const investments = ref([]);
const loading = ref(false);
const error = ref(null);

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

const getStatusBadgeValue = (status) => {
    switch (status) {
        case 'success': return 'Successful'
        case 'pending': return 'Pending'
        case 'rejected': return 'Rejected'
        default: return status
    }
}

const statuses = ["pending", "success", "rejected"];

// Fetch investments from API
const fetchInvestments = async () => {
    try {
        loading.value = true;
        error.value = null;
        const response = await apiService.getAllInvestments();
        
        if (response.success) {
            investments.value = response.data.map(investment => ({
                id: investment.id,
                date: new Date(investment.date).toISOString().split("T")[0],
                investor: investment.investor,
                investor_email: investment.investor_email,
                amount: investment.amount,
                paymentProof: investment.proofUrl,
                status: investment.status,
                hasProof: investment.hasProof
            }));
        }
    } catch (err) {
        console.error('Error fetching investments:', err);
        error.value = err.message || 'Failed to fetch investments';
    } finally {
        loading.value = false;
    }
};

// Update investment status
const updateStatus = async (investmentId, newStatus) => {
    try {
        const response = await apiService.updateInvestmentStatus(investmentId, newStatus);
        if (response.success) {
            // Update local data
            const investmentIndex = investments.value.findIndex(inv => inv.id === investmentId);
            if (investmentIndex !== -1) {
                investments.value[investmentIndex].status = newStatus;
            }
        }
    } catch (err) {
        console.error('Error updating investment status:', err);
        error.value = err.message || 'Failed to update status';
    }
};

const showDropdown = ref([]);
const selectedStatus = ref([]);

// Initialize dropdown states
const initializeDropdowns = () => {
    showDropdown.value = investments.value.map(() => false);
    selectedStatus.value = investments.value.map((inv) => inv.status);
};

const toggleDropdown = (index) => {
    const wasOpen = showDropdown.value[index];
    showDropdown.value = showDropdown.value.map(() => false);
    showDropdown.value[index] = !wasOpen;
};

const selectStatus = async (index, status) => {
    const investment = investments.value[index];
    selectedStatus.value[index] = status;
    showDropdown.value[index] = false;
    
    // Update status via API
    await updateStatus(investment.id, status);
};

// View payment proof
const viewPaymentProof = (proofUrl) => {
    if (proofUrl) {
        window.open(proofUrl, '_blank');
    }
};

onMounted(async () => {
    await fetchInvestments();
    initializeDropdowns();
});
</script>

<template>
    <h1 class="text-2xl font-bold text-blue-800 mb-6">Here Your Investor</h1>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-8">
        <div class="text-blue-600">Loading investments...</div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>Error:</strong> {{ error }}
        <button @click="fetchInvestments" class="ml-4 underline">Retry</button>
    </div>

    <!-- Data Table -->
    <section v-if="!loading">
        <div class="shadow-md">
            <table class="min-w-full table-auto text-sm text-gray-800 overflow-x-auto">
                <thead>
                    <tr class="bg-blue-800 text-white text-left">
                        <th class="px-4 py-3 font-semibold">No.</th>
                        <th class="px-4 py-3 font-semibold max-md:min-w-[160px]">Date</th>
                        <th class="px-4 py-3 font-semibold max-md:min-w-[200px]">Investor</th>
                        <th class="px-4 py-3 font-semibold">Amount</th>
                        <th class="px-4 py-3 font-semibold">Payment Proof</th>
                        <th class="px-4 py-3 font-semibold">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="investments.length === 0">
                        <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                            No investments found
                        </td>
                    </tr>
                    <tr v-for="(item, index) in investments" :key="item.id"
                        class="odd:bg-slate-50 even:bg-white hover:bg-blue-50 transition-colors duration-150">
                        <td class="px-4 py-3 text-center">
                            {{ index + 1 }}
                        </td>
                        <td class="px-4 py-3">
                            <div class="text-sm">
                                <div class="font-medium">
                                    {{
                                        formatDate(item.date).split(" ").slice(0, 3).join(" ")
                                    }}
                                </div>
                                <div class="text-xs text-gray-500">
                                    {{
                                        formatDate(item.date).split(" ").slice(3).join(" ")
                                    }}
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3">
                            <div>
                                <div class="font-medium">{{ item.investor }}</div>
                                <div class="text-xs text-gray-500">
                                    {{ item.investor_email }}
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3">
                            {{ formatCurrency(item.amount) }}
                        </td>
                        <td class="px-4 py-3">
                            <div class="flex justify-center items-center">
                                <FileImage 
                                    v-if="item.hasProof" 
                                    class="cursor-pointer text-blue-600 hover:text-blue-800" 
                                    @click="viewPaymentProof(item.paymentProof)"
                                    title="Click to view payment proof"
                                />
                                <span v-else class="text-gray-400 text-sm">No proof</span>
                            </div>
                        </td>
                        <td class="px-4 py-3">
                            <div class="inline-block w-full relative">
                                <div class="w-full py-1.5 rounded cursor-pointer flex items-center hover:bg-slate-100 transition"
                                    @click="toggleDropdown(index)">
                                    <Badge :value="getStatusBadgeValue(selectedStatus[index])" />
                                    <ChevronDown class="w-4 h-4 ml-2 transition-transform"
                                        :class="{ 'rotate-180': showDropdown[index] }" />
                                </div>

                                <!-- Dropdown -->
                                <div v-if="showDropdown[index]"
                                    class="absolute left-0 z-100 mt-2 w-36 bg-white border border-slate-200 rounded-lg shadow-lg">
                                    <div v-for="status in statuses" :key="status" @click="selectStatus(index, status)"
                                        class="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm flex items-center justify-center">
                                        <Badge :value="getStatusBadgeValue(status)" />
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
