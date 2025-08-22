<script setup>
import Badge from "@/components/Badge.vue";
import formatCurrency from "@/lib/format-currency";
import { FileImage, Plus, Search, Trash } from "lucide-vue-next";
import { ref } from "vue";

const isModalOpen = ref(false);
const isModalCreateOpen = ref(false);
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

const openCreateModal = () => {
  isModalCreateOpen.value = true;
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
  <h1 class="text-2xl font-bold text-blue-800 mb-6">
    Here is your investor Withdrawal Transaction
  </h1>

  <section class="mt-4 relative z-0">
    <div class="relative w-fit">
      <input
        type="search"
        placeholder="Search..."
        class="w-64 h-9 ps-10 pe-3 border border-blue-900 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm transition duration-150"
      />
      <Search
        class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none"
      />
    </div>

    <div class="shadow-md mt-4 overflow-x-auto">
      <table class="min-w-full table-auto text-sm text-gray-800">
        <thead>
          <tr class="bg-blue-800 text-white text-left">
            <th class="px-4 py-3 font-semibold">No.</th>
            <th class="px-4 py-3 font-semibold max-md:min-w-[160px]">Date</th>
            <th class="px-4 py-3 font-semibold">Investor</th>
            <th class="px-4 py-3 font-semibold">Amount</th>
            <th class="px-4 py-3 font-semibold">Payment Proof</th>
            <th class="px-4 py-3 font-semibold">Status</th>
            <th class="px-4 py-3 font-semibold text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in dumyInvestor"
            :key="index"
            class="odd:bg-slate-50 even:bg-white hover:bg-blue-50 transition-colors duration-150"
          >
            <td class="px-4 py-3">{{ index + 1 }}.</td>
            <td class="px-4 py-3">{{ item.date }}</td>
            <td class="px-4 py-3">{{ item.investor }}</td>
            <td class="px-4 py-3">{{ formatCurrency(item.amount) }}</td>
            <td class="px-4 py-3">
              <div class="flex justify-center items-center">
                <FileImage />
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="inline-block w-full relative">
                <div
                  class="w-full py-1.5 rounded cursor-pointer flex items-center hover:bg-slate-100 transition"
                  @click="toggleDropdown(index)"
                >
                  <Badge :value="selectedStatus[index]" />
                </div>

                <!-- Dropdown -->
                <div
                  v-if="showDropdown[index]"
                  class="absolute left-0 z-100 mt-2 w-36 bg-white border border-slate-200 rounded-lg shadow-lg"
                >
                  <div
                    v-for="status in statuses"
                    :key="status"
                    @click="selectStatus(index, status)"
                    class="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm flex items-center justify-center"
                  >
                    <Badge :value="status" />
                  </div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="flex justify-center gap-2">
                <button
                  class="bg-red-500 hover:bg-red-600 transition text-white rounded-lg p-1 cursor-pointer"
                  @click="confirmDelete(index)"
                >
                  <Trash class="w-5 h-5" />
                </button>
                <button
                  class="bg-amber-500 hover:bg-amber-600 transition text-white rounded-lg p-1 cursor-pointer"
                  @click="openCreateModal"
                >
                  <Plus class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- Modal Delete -->
  <div
    v-if="isModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-md text-center">
      <h2 class="text-lg font-semibold mb-4">Confirm Deletion</h2>
      <p>Are you sure you want to delete this record?</p>
      <div class="mt-6 flex justify-center space-x-4">
        <button
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          @click="deleteInvestor"
        >
          Yes, Delete
        </button>
        <button
          class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          @click="cancelDelete"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>

  <!-- Modal Create -->
  <div
    v-if="isModalCreateOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-md relative">
      <h2 class="text-lg font-semibold mb-4">Whitdrawal Investor</h2>
      <span
        class="absolute top-6 right-6 text-xl cursor-pointer hover:text-red-500"
        @click="isModalCreateOpen = false"
        >&times;</span
      >
      <form class="space-y-4 mt-6">
        <div>
          <label class="block text-sm font-semibold text-blue-900 mb-1"
            >Ammount</label
          >
          <input
            type="text"
            class="w-full px-4 py-2 rounded-md focus:outline-none bg-white text-sm border border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none h-10 disabled:bg-slate-200"
            disabled
            :value="formatCurrency(100000)"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-blue-900 mb-1"
            >Payment Prof</label
          >
          <input
            type="file"
            class="w-full px-4 py-2 rounded-md focus:outline-none bg-white text-sm border border-blue-500 file:bg-slate-200 file:text-blue-800 file:p-1 file:text-xs h-10 file:rounded-lg"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          class="bg-blue-900 text-white px-6 py-2 rounded-md font-semibold w-full"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
</template>
