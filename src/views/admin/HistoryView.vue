<script setup lang="ts">
import Badge from "@/components/Badge.vue";
import formatCurrency from "@/lib/format-currency";
import { Search } from "lucide-vue-next";

const statuses = ["Pending", "Rejected", "Successful"];

const dumyInvestor = Array(5)
  .fill(null)
  .map((_, i) => ({
    date: new Date().toISOString().split("T")[0],
    investor: `Abdi ${i + 1}`,
    amount: Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000,
    paymentProof: `https://www.google.com?q=${i + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    type: "Investmen",
  }));
</script>

<template>
  <h1 class="text-2xl font-bold text-blue-800 mb-6">Investment History</h1>

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

  <div class="mt-8 overflow-x-auto">
    <div class="min-w-[800px] sm:min-w-full shadow-md rounded-xl">
      <table class="min-w-full table-fixed text-sm text-gray-800">
        <thead>
          <tr class="bg-blue-800 text-white text-left">
            <th class="px-4 py-3 font-semibold whitespace-nowrap">No.</th>
            <th class="px-4 py-3 font-semibold whitespace-nowrap">Date</th>
            <th class="px-4 py-3 font-semibold whitespace-nowrap">investor</th>
            <th class="px-4 py-3 font-semibold whitespace-nowrap">Type</th>
            <th class="px-4 py-3 font-semibold whitespace-nowrap">Amount</th>
            <th class="px-4 py-3 font-semibold whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in dumyInvestor"
            :key="index"
            class="odd:bg-slate-50 even:bg-white hover:bg-blue-50 transition-colors duration-150"
          >
            <td class="px-4 py-3 text-center">{{ index + 1 }}.</td>
            <td class="px-4 py-3">
              {{ item.date }}
            </td>
            <td class="px-4 py-3 capitalize">
              {{ item.investor }}
            </td>
            <td class="px-4 py-3 capitalize">
              {{ item.type }}
            </td>
            <td class="px-4 py-3">
              {{ formatCurrency(item.amount) }}
            </td>
            <td class="px-4 py-3">
              <Badge :value="item.status" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
