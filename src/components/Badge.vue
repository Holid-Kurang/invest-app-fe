<template>
  <span
    :class="[
      'px-4 py-1 rounded-full text-white text-sm font-semibold inline-block text-center',
      statusColor,
    ]"
  >
    {{ value }}
  </span>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  value: String,
});

const statusColor = computed(() => {
  switch (props.value?.toLowerCase()) {
    case "rejected":
      return "bg-red-500";
    case "pending":
      return "bg-yellow-400 text-white";
    case "successful":
      return "bg-green-400";
    default:
      return "bg-gray-400";
  }
});
</script>
