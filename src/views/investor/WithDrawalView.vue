<script setup lang="ts">
import Badge from "@/components/Badge.vue";
import formatCurrency from "@/lib/format-currency";
</script>

<template>
  <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div>
      <div class="space-y-1">
        <span class="block text-lg font-semibold text-gray-700"
          >Total Return</span
        >
        <div
          class="py-3 px-6 bg-blue-700 text-white font-bold rounded-lg w-fit"
        >
          {{ formatCurrency(105752) }}
        </div>
        <span class="block text-sm text-gray-500">
          Return minimum {{ formatCurrency(100000) }}
        </span>
      </div>

      <form
        class="space-y-4 mt-6 w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200"
      >
        <div>
          <label class="block text-sm font-medium text-blue-900 mb-1"
            >Amount</label
          >
          <input
            type="number"
            class="w-full h-10 px-4 text-sm border border-blue-500 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Enter your amount"
          />
        </div>

        <button
          type="submit"
          class="w-full py-2 bg-blue-900 text-white rounded-md font-semibold hover:bg-blue-800 transition"
        >
          Submit
        </button>
      </form>

      <div class="mt-6 flex flex-wrap items-center gap-2 sm:gap-4">
        <span class="text-sm text-gray-700 font-medium"
          >Transaction Status:</span
        >
        <Badge value="Pending" />
      </div>
    </div>
  </section>
</template>
