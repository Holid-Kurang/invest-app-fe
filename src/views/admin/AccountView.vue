<script setup>
import { Pencil, Plus, Trash } from "lucide-vue-next";
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

const dumyAccount = Array(5)
  .fill(null)
  .map((_, i) => ({
    date: new Date().toISOString().split("T")[0],
    investor: `Abdi ${i + 1}`,
    email: `abdi${i + 1}@gmail.com`,
    password: `password${i + 1}`,
  }));
</script>

<template>
  <h1 class="text-2xl font-bold text-blue-800 mb-6">Add Your Investor Here</h1>

  <router-link to="/admin/account/create">
    <button
      class="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 rounded-lg px-4 py-2 shadow-md cursor-pointer mt-4"
    >
      <Plus class="w-5 h-5" />
      <span class="font-medium">Add Investor</span>
    </button>
  </router-link>

  <section>
    <div class="mt-8 overflow-x-auto">
      <div class="min-w-[800px] sm:min-w-full shadow-md rounded-xl">
        <table class="min-w-full table-auto text-sm text-gray-800">
          <thead>
            <tr class="bg-blue-800 text-white text-left">
              <th class="px-4 py-3 font-semibold">No.</th>
              <th class="px-4 py-3 font-semibold">Date</th>
              <th class="px-4 py-3 font-semibold">Investor</th>
              <th class="px-4 py-3 font-semibold">Email</th>
              <th class="px-4 py-3 font-semibold">Password</th>
              <th class="px-4 py-3 font-semibold text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(item, index) in dumyAccount"
              :key="index"
              class="odd:bg-slate-50 even:bg-white hover:bg-blue-50 transition-colors duration-150"
            >
              <td class="px-4 py-3">{{ index + 1 }}.</td>
              <td class="px-4 py-3">{{ item.date }}</td>
              <td class="px-4 py-3">{{ item.investor }}</td>
              <td class="px-4 py-3">{{ item.email }}</td>
              <td class="px-4 py-3">
                {{ item.password }}
              </td>
              <td class="px-4 py-3">
                <div class="flex flex-row-reverse justify-center gap-2">
                  <button
                    class="bg-red-500 hover:bg-red-600 transition text-white rounded-lg p-2 cursor-pointer"
                    @click="confirmDelete(index)"
                  >
                    <Trash class="w-4 h-4" />
                  </button>
                  <router-link
                    :to="`/admin/account/${index}/edit`"
                    class="bg-yellow-500 hover:bg-yellow-600 transition text-white rounded-lg p-2 cursor-pointer"
                  >
                    <Pencil class="w-4 h-4" />
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
</template>
