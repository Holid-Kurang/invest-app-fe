<template>
  <h1 class="text-2xl font-bold text-blue-800 mb-6">Add Your Investor Here</h1>

  <form class="space-y-4 max-w-sm mt-6">
    <div>
      <label class="block text-sm font-semibold text-blue-900 mb-1"
        >Email</label
      >
      <input
        type="email"
        class="w-full px-4 py-2 rounded-md focus:outline-none bg-white text-sm border"
        placeholder="Enter your email"
      />
    </div>

    <div>
      <label class="block text-sm font-semibold text-blue-900 mb-1"
        >Password</label
      >
      <input
        type="password"
        class="w-full px-4 py-2 rounded-md focus:outline-none bg-white text-sm border"
        placeholder="Enter your password"
      />
    </div>

    <button
      type="submit"
      class="bg-blue-900 text-white px-6 py-2 rounded-md font-semibold w-full"
    >
      Create
    </button>
  </form>
</template>
