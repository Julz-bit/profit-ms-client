<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'flowbite'
import { useDateFormat } from '@vueuse/core';
import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';
import { useScopeStore } from '~/store/scope';

//init stores from pinia
const scopeStore = useScopeStore();

//call non reactive data here from store including functions
const { updateScope, findScopes } = scopeStore;

//recieve binded data here from parent component
const props = defineProps({
    data: Object
});

//modal refs
const activator = ref(null);
const modal = ref(null);
const close = ref(null);

//ref that will hold reactivity of assigned value
const scopePayload = ref(null);

//loader
const isLoading = ref(false);

//before mounting the component run this first using onMounted() hook
onMounted(() => {
    const $activator = activator.value;
    const $modalElement = modal.value;
    const $close = close.value;
    const modalOptions = {
        backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40'
    }
    if ($modalElement) {
        const modal = new Modal($modalElement, modalOptions);
        $activator.addEventListener('click', () => modal.toggle());
        $close.addEventListener('click', () => modal.hide());
    }
})

//use this function to bind it into other ref for editing. This will run after clicking `Edit` button
const assignValue = () => {
    //destructure data and assign 
    const { id, projectId, createdAt, updatedAt, ...rest } = props.data;
    //format date first before assigning into ref
    rest['startDate'] = dateFormat(rest['startDate']);
    rest['endDate'] = dateFormat(rest['endDate']);
    scopePayload.value = rest;
}

//format to MM/DD/YYYY
const dateFormat = (value) => {
    //convert value into real date
    const date = new Date(value);
    //use vue use core date formatter
    const format = ref('MM/DD/YYYY')
    const transform = useDateFormat(date, format);
    return transform.value;
}

//assign value to datePicker after emitting the data
const emitStartDate = (date) => {
    //scope payload is a ref. Use .value to access its properties
    scopePayload.value.startDate = date;
}

//assign value to datePicker after emitting the data
const emitEndDate = (date) => {
    //scope payload is a ref. Use .value to access its properties
    scopePayload.value.endDate = date;
}

//rules for form validation
const rules = {
    name: {
        type: 'string',
        min: 2,
        required: true
    },
    startDate: {
        type: 'string',
        min: 10,
        max: 10,
        required: true
    },
    endDate: {
        type: 'string',
        min: 10,
        max: 10,
        required: true
    },
    fee: {
        required: true
    }
}

//use vue use integration for async validation
const { pass, errorFields } = useAsyncValidator(scopePayload, rules);

//update function
const update = async () => {
    //set loader to true
    isLoading.value = true;
    //pass id in first param, pass object payload in second param
    const res = await updateScope(props.data.id, scopePayload.value);
    if (res['statusCode'] === 200) {
        //if success run the findScopes and `closeModal` function
        await findScopes(props.data.projectId);
        closeModal();
        //set loader to false
        isLoading.value = false;
    }
}

const closeModal = () => {
    //close modal using ref
    close.value.click();
}

</script>

<template>
    <div>
        <button ref="activator" type="button" @click="assignValue"
            class="text-white mr-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Edit</button>

        <div ref="modal" tabindex="-1" aria-hidden="true"
            class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
            <div class="relative w-full h-full max-w-2xl md:h-auto">
                <!-- Modal content -->
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <!-- Modal header -->
                    <div class="flex items-start justify-between p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
                            Edit ({{ props.data.name }})
                        </h3>
                        <button ref="close" type="button"
                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                    <!-- Modal body -->
                    <div class="p-5 space-y-3" v-if="scopePayload">
                        <div>
                            <label for="name"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <input type="text" id="name" v-model="scopePayload.name"
                                class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <p class="mt-1 text-sm text-red-600 dark:text-red-500" v-if="errorFields?.name?.length">
                                <span class="font-small">{{ errorFields.name[0].message }}</span>
                            </p>
                        </div>
                        <div class="grid gap-4 mb-4 sm:grid-cols-2">
                            <div>
                                <label for="startdate"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start Date</label>
                                <div class="relative max-w-sm">
                                    <DatePicker id="startdate" :value="scopePayload.startDate"
                                        @update:date="emitStartDate" />
                                </div>
                                <p class="mt-1 text-sm text-red-600 dark:text-red-500"
                                    v-if="errorFields?.startDate?.length">
                                    <span class="font-small">{{ errorFields.startDate[0].message }}</span>
                                </p>
                            </div>
                            <div>
                                <label for="enddate"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End Date</label>
                                <div class="relative max-w-sm">
                                    <DatePicker id="enddate" :value="scopePayload.endDate" @update:date="emitEndDate" />
                                </div>
                                <p class="mt-1 text-sm text-red-600 dark:text-red-500" v-if="errorFields?.endDate?.length">
                                    <span class="font-small">{{ errorFields.endDate[0].message }}</span>
                                </p>
                            </div>
                            <div>
                                <label for="priority"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Priority</label>
                                <select id="priority" v-model="scopePayload.priority"
                                    class="block w-full p-1.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                            <div>
                                <label for="status"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                                <select id="status" v-model="scopePayload.status"
                                    class="block w-full p-1.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="Pending">Pending</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                            <div>
                                <label for="payment"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Payment</label>
                                <select id="payment" v-model="scopePayload.payment"
                                    class="block w-full p-1.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="Unpaid">Unpaid</option>
                                    <option value="Paid">Paid</option>
                                </select>
                            </div>
                            <div>
                                <label for="fee"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Payment</label>
                                <input type="number" id="fee" v-model="scopePayload.fee"
                                    class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <p class="mt-1 text-sm text-red-600 dark:text-red-500" v-if="errorFields?.fee?.length">
                                    <span class="font-small">{{ errorFields.fee[0].message }}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <!-- Modal footer -->
                    <div
                        class="flex items-center justify-end p-3 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button type="button" @click="update()" v-if="!isLoading" :disabled="pass ? false : true"
                            :class="pass ? 'text-white bg-blue-650 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-250 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800' :
                                'text-gray-500 cursor-not-allowed bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-250 rounded-lg border border-gray-200 text-xs font-medium px-3 py-1.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600'">Save</button>

                        <button type="button" v-if="isLoading"
                            class="text-white bg-blue-650 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-250 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                            <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin"
                                viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="#E5E7EB" />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentColor" />
                            </svg>
                            Save</button>
                        <button type="button" @click="closeModal()"
                            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-1.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>