<script setup>
import Badge from "@/components/Badge.vue";
import formatCurrency from "@/lib/format-currency";
import { FileImage, Trash } from "lucide-vue-next";
import { ref } from "vue";

const isModalOpen = ref(false);
const selectedIndex = ref(null);

const confirmDelete = (index) => {
    selectedIndex.value = index;
    isModalOpen.value = true;
};

const deleteInvestor = () => {
    if (selectedIndex.value !== null) {
        dumyInvestor.splice(selectedIndex.value, 1);
        isModalOpen.value = false;
        selectedIndex.value = null;
    }
};

const cancelDelete = () => {
    isModalOpen.value = false;
    selectedIndex.value = null;
};

const statuses = ["Pending", "Rejected", "Successful"];

const dumyInvestor = Array(5)
    .fill(null)
    .map((_, i) => ({
        date: new Date().toISOString().split("T")[0],
        investor: `Abdi ${i + 1}`,
        amount: Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000,
        paymentProof: `https://www.google.com?q=${i + 1}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
    }));

const showDropdown = ref(dumyInvestor.map(() => false));

const selectedStatus = ref(dumyInvestor.map((i) => i.status));

const toggleDropdown = (index) => {
    const wasOpen = showDropdown.value[index];
    showDropdown.value = showDropdown.value.map(() => false);
    showDropdown.value[index] = !wasOpen;
};

const selectStatus = (index, status) => {
    selectedStatus.value[index] = status;
    showDropdown.value[index] = false;
};
</script>

<template>
    <h1 class="text-2xl font-bold text-blue-800 mb-6">Here Your Investor</h1>

    <section>
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
                        <th class="px-4 py-3 font-semibold text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in dumyInvestor" :key="index"
                        class="odd:bg-slate-50 even:bg-white hover:bg-blue-50 transition-colors duration-150">
                        <td class="px-4 py-3 text-center">
                            {{ index + 1 }}
                        </td>
                        <td class="px-4 py-3">{{ item.date }}</td>
                        <td class="px-4 py-3">
                            {{ item.investor }}
                        </td>
                        <td class="px-4 py-3">
                            {{ formatCurrency(item.amount) }}
                        </td>
                        <td class="px-4 py-3">
                            <div class="flex justify-center items-center">
                                <FileImage />
                            </div>
                        </td>
                        <td class="px-4 py-3">
                            <div class="inline-block w-full relative">
                                <div class="w-full py-1.5 rounded cursor-pointer flex items-center hover:bg-slate-100 transition"
                                    @click="toggleDropdown(index)">
                                    <Badge :value="selectedStatus[index]" />
                                </div>

                                <!-- Dropdown -->
                                <div v-if="showDropdown[index]"
                                    class="absolute left-0 z-100 mt-2 w-36 bg-white border border-slate-200 rounded-lg shadow-lg">
                                    <div v-for="status in statuses" :key="status" @click="selectStatus(index, status)"
                                        class="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm flex items-center justify-center">
                                        <Badge :value="status" />
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-4 py-3 text-center">
                            <button
                                class="inline-flex items-center justify-center rounded-md bg-red-500 text-white w-8 h-8 hover:bg-red-600 transition-colors"
                                @click="confirmDelete(index)">
                                <Trash class="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-md text-center">
            <h2 class="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this record?</p>
            <div class="mt-6 flex justify-center space-x-4">
                <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" @click="deleteInvestor">
                    Yes, Delete
                </button>
                <button class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" @click="cancelDelete">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>
