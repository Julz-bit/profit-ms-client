<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'flowbite'
import { useScopeStore } from '~/store/scope';

//init stores from pinia
const scopeStore = useScopeStore();

//call non reactive data here from store including functions
const { removeScope, findScopes } = scopeStore;

//recieve binded data here from parent component
const props = defineProps({
    data: Object
});

const activator = ref(null);
const modal = ref(null);
const close = ref(null);

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

//remove function
const remove = async () => {
    //pass id 
    const res = await removeScope(props.data.id);
    if (res['statusCode'] === 200) {
        //if success run the findScopes and `closeModal` function
        closeModal();
        await findScopes(props.data.projectId);
    }
}

function closeModal() {
    close.value.click();
}

</script>

<template>
    <div>
        <button ref="activator" type="button"
            class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Delete</button>

        <div ref="modal" tabindex="-1" aria-hidden="true"
            class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
            <div class="relative w-full h-full max-w-2xl md:h-auto">
                <!-- Modal content -->
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <!-- Modal header -->
                    <div class="flex items-start justify-between p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
                            Delete {{ props.data.name }} ?
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
                    <!-- Modal footer -->
                    <div
                        class="flex items-center justify-end p-3 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button type="button" @click="remove()"
                            class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-1.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Yes,
                            delete it</button>
                        <button type="button" @click="closeModal()"
                            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-1.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>