<script setup>
import { storeToRefs } from "pinia";
import { useProjectStore } from '~/store/project';

//init store from pinia
const projectStore = useProjectStore();

//non reactive data from store including function
const { findProjects } = projectStore;

//reactive data from store ref or computed. Use storetoRefs so reactivity will not be affected
const { projects } = storeToRefs(projectStore);

//call function
await findProjects();
</script>

<template>
    <NuxtLayout>
        <div class="p-4 sm:ml-64">
            <div class="p-4 mt-14">
                <div class="grid grid-cols-4 gap-4 mb-4">
                    <div class="flex items-center justify-center" v-for="project in projects" :key="project.id">
                        <div
                            class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <div class="flex justify-end px-4 pt-4">
                                <button id="dropdownButton" data-dropdown-toggle="dropdown"
                                    class="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
                                    type="button">
                                    <span class="sr-only">Open dropdown</span>
                                    <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z">
                                        </path>
                                    </svg>
                                </button>
                                <!-- Dropdown menu -->
                                <div id="dropdown"
                                    class="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                    <ul class="py-2" aria-labelledby="dropdownButton">
                                        <li>
                                            <a href="#"
                                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="flex flex-col items-center pb-10">
                                <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{{ project.name }}</h5>
                                <span class="text-sm text-gray-500 dark:text-gray-400">{{ project.description }}</span>
                                <NuxtLink :to="`project/${project.id}`">
                                    <button type="button"
                                        class="text-white bg-blue-650 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-250 mt-2 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        OPEN PROJECT
                                        <svg aria-hidden="true" class="w-5 h-5 ml-2 -mr-1" fill="currentColor"
                                            viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd"
                                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                                clip-rule="evenodd"></path>
                                        </svg>
                                    </button>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

