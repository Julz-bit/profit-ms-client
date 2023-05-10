<script setup>
import { ref, onMounted, watchEffect } from 'vue';
//I use tailwind-elements services here and serve as component `iq level 10000 X unlimited` :)
import { initTE, Datepicker, Input } from "tw-elements";

//recieve binded data here from parent component
const props = defineProps({
    value: String
})

onMounted(() => {
    initTE({ Datepicker, Input });
});

//compiler built-in `defineEmits` register `update:date` as an event
const emit = defineEmits(['update:date']);

//assign default value of props
const date = ref(props.value);

//watch `const date` if has changes. This will automatically run everytime every changes in referred ref
watchEffect(() => {
    //if has a changes run this `function emitDate`
    emitDate();
});

function emitDate() {
    //emit the event then pass the value
    emit('update:date', date.value);
}
</script>

<template>
    <!-- single date picker -->
    <div data-te-datepicker-init data-te-format="mm/dd/yyyy">
        <input type="text" ref="datepicker" v-model="date"
            class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    </div>
</template>
