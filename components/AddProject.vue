<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'flowbite';
import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';
import { useProjectStore } from '~/store/project';

//init stores from pinia
const projectStore = useProjectStore();

//call non reactive data here from store including functions
const { createProject } = projectStore;

//modal refs
const activator = ref(null);
const modal = ref(null);
const close = ref(null);

//loader
const isLoading = ref(false);

//ref that will hold project payload that will be passed in `createProject()` function
const projectPayload = ref({
    name: null,
    description: null
});

//rules for form validation
const rules = {
    name: {
        type: 'string',
        min: 2,
        required: true
    },
    description: {
        type: 'string',
        min: 2,
        required: true
    }
}

//use vue use integration for async validation
const { pass, errorFields } = useAsyncValidator(projectPayload, rules);

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

const create = async () => {
    //run `createProject()` then pass the `projectPayload` object
    isLoading.value = true;
    const transaction = await createProject(projectPayload);
    if (transaction.statusCode === 201) {
        //run functions if api return success
        // closeModal();
        isLoading.value = false;
        projectPayload.value.name = null;
        projectPayload.value.description = null;
    }
};

const closeModal = () => {
    //close modal using ref
    close.value.click();
}
</script>

<template>
    <div>
        <button ref="activator" type="button"
            class="text-white bg-blue-650 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-250 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">+
            Project</button>

        <div ref="modal" tabindex="-1" aria-hidden="true"
            class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
            <div class="relative w-full h-full max-w-2xl md:h-auto">
                <!-- Modal content -->
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <!-- Modal header -->
                    <div class="flex items-start justify-between p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
                            ADD PROJECT
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
                    <div class="p-6 space-y-6">
                        <div class="grid gap-4 mb-4 sm:grid-cols-2">
                            <div>
                                <label for="name"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                <input type="text" name="name" v-model="projectPayload.name" id="name"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Type project name" required="">
                                <p class="mt-1 text-sm text-red-600 dark:text-red-500" v-if="errorFields?.name?.length">
                                    <span class="font-small">{{ errorFields.name[0].message }}</span>
                                </p>
                            </div>
                            <div class="sm:col-span-2">
                                <label for="description"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                <textarea id="description" rows="4" v-model="projectPayload.description"
                                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Write project description here"></textarea>
                                <p class="mt-1 text-sm text-red-600 dark:text-red-500"
                                    v-if="errorFields?.description?.length">
                                    <span class="font-small">{{ errorFields.description[0].message }}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <!-- Modal footer -->
                    <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button type="button" @click="create()" v-if="!isLoading" :disabled="pass ? false : true"
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
                            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-250 rounded-lg border border-gray-200 text-xs font-medium px-3 py-1.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>