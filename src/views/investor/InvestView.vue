<template>
  <h1 class="text-2xl font-bold text-blue-800 mb-6">
    Start your Investment here
  </h1>

  <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div>
      <div class="bg-slate-100 rounded-2xl shadow-sm p-6">
        <h2 class="text-xl font-bold text-blue-800 mb-2">Bank Account BCA</h2>
        <p class="text-lg font-semibold text-gray-800">675092</p>
        <p class="text-sm text-gray-600">Amde Advisor</p>
      </div>

      <form
        class="space-y-4 mt-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
      >
        <div>
          <label class="block text-sm font-medium text-blue-900 mb-1"
            >Amount</label
          >
          <input
            type="number"
            class="w-full h-10 px-4 py-2 text-sm border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Enter your amount"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-blue-900 mb-1"
            >Payment Proof</label
          >
          <input
            type="file"
            class="w-full h-10 px-4 py-2 text-sm border border-blue-500 rounded-md bg-white file:bg-slate-200 file:text-blue-800 file:p-1 file:text-xs file:rounded-lg"
          />
        </div>

        <button
          type="submit"
          class="w-full py-2 bg-blue-900 text-white rounded-md font-semibold hover:bg-blue-800 transition"
        >
          Submit
        </button>
      </form>
    </div>
  </section>
</template>
