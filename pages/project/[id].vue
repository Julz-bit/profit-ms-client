<script setup>
import { ref } from 'vue';
import { useDateFormat } from '@vueuse/core';
import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator';
import { storeToRefs } from "pinia";
import { useProjectStore } from '~/store/project';
import { useScopeStore } from '~/store/scope';

//init stores from pinia
const projectStore = useProjectStore();
const scopeStore = useScopeStore();

//init vue router
const route = useRoute();

//non reactive data from store including function
const { findProject } = projectStore;
const { findScopes, createScopes, updateScope } = scopeStore;

//reactive data from store ref or computed. Use storetoRefs so reactivity will not be affected
const { project } = storeToRefs(projectStore);
const { scopes } = storeToRefs(scopeStore);

//use reactive for nested object/array
const scopesPayload = reactive([]);

//const field errors
const fieldsError = reactive([]);

//run useFetch from store to
await findProject(route.params.id);
await findScopes(route.params.id);

//format date into 
const dateFormatter = (value) => {
    //convert value into real date
    const date = new Date(value);
    //use vue use core date formatter
    const format = ref('MMM DD, YYYY')
    const transform = useDateFormat(date, format);
    return transform.value;
}

//check if decimal or not
const setFee = (value) => {
    return value % 1 != 0 ? `${value}` : `${value}.00`;
}

//push new object into array
const addElement = () => {
    scopesPayload.push({
        name: null,
        startDate: null,
        endDate: null,
        priority: 'Low',
        status: 'Pending',
        payment: 'Paid',
        fee: 400
    });
}

//remove element from array using splice
const removeElement = (index) => {
    //first param index, next param lenght that will be removed
    scopesPayload.splice(index, 1);
}

//assign value to datePicker after emitting the data
const emitStartDate = (i, date) => {
    scopesPayload[i].startDate = date;
}


//assign value to datePicker after emitting the data
const emitEndDate = (i, date) => {
    scopesPayload[i].endDate = date;
}

//compute scopes fee via for loop
const totalProfit = () => {
    //will hold total. Add every loop iteration
    let total = 0;
    //scopes is a ref need to use .value to access the real array value
    const deepValue = scopes.value;

    for (let i = 0; i < deepValue.length; i++) {
        //get the fee every i/index
        const fee = deepValue[i]['fee'];
        //call the current value of `let total` and use `+=` operation to add the `const fee` into current value of `let total`.
        //`const fee` is serve as a string use `+fee` to parse or convert it into integer
        total += +fee;
    }

    return total;
}

//use vue use integration for async validation
// const { pass, errorFields } = useAsyncValidator(scopesPayload, rules);

//validate first before calling API
const validate = async () => {
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
            type: 'number',
            required: true
        }
    }

    //check fieldsError has a value
    if (fieldsError.length > 0) {
        //if has value remove current value
        fieldsError.splice(0, fieldsError.length);
    }

    //will hold each validation value
    let results = [];

    //iterate each scopesPayload element
    for (let i = 0; i < scopesPayload.length; i++) {
        //use validator in each iteration
        const { pass, errorFields } = await useAsyncValidator(scopesPayload[i], rules);
        //if has an error store it into `fieldsError`
        fieldsError.push(errorFields.value);
        //store the validation results in an `results` array value must be `true or false`
        results.push(pass.value);
    }

    //if all validation passed call `create` function
    if (!results.includes(false)) {
        create();
    }
}

//create scope after listining to @click event
const create = async () => {
    //call the function in store which are desctrutered here `const { findScopes, createScopes, updateScope } = scopeStore;`
    const res = await createScopes({ scopes: scopesPayload, projectId: route.params.id });
    if (res['statusCode'] === 201) {
        //if success remove all array current value
        scopesPayload.splice(0, scopesPayload.length);
    }
}

//update scope 
const update = async (item) => {
    //use object destructuring to remove un necessary property
    const { id, createdAt, updatedAt, ...rest } = item;
    //pass id and object data for updating values
    const res = await updateScope(id, rest);
}

</script>

<template>
    <NuxtLayout>
        <div class="p-4 sm:ml-64">
            <div class="p-4 mt-14">
                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div class="flex justify-between text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                        <caption class="p-5 text-lg font-semibold text-left">
                            {{ project.name }} - {{ setFee(totalProfit()) }}
                        </caption>
                        <div class="order-last mt-4 mr-8">
                            <button type="button" @click="addElement"
                                class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center mr-2 mb-2">ADD</button>
                            <button type="button" @click="validate" v-if="scopesPayload.length > 0"
                                class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center mr-2 mb-2">SAVE</button>
                        </div>
                    </div>
                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Start Date
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    End Date
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Priority
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Payment
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Fee
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                v-for="(payload, i) in scopesPayload" :key="i">
                                <th scope="row"
                                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <input type="text" id="small-input" v-model="payload.name"
                                        class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <p class="mt-1 text-sm text-red-600 dark:text-red-500"
                                        v-if="fieldsError[i]?.name?.length">
                                        <span class="font-small">{{ fieldsError[i].name[0].message }}</span>
                                    </p>
                                </th>
                                <td class="px-6 py-4">
                                    <div class="relative max-w-sm">
                                        <DatePickers :index="i" @update:date="emitStartDate" />
                                    </div>
                                    <p class="mt-1 text-sm text-red-600 dark:text-red-500"
                                        v-if="fieldsError[i]?.startDate?.length">
                                        <span class="font-small">{{ fieldsError[i].startDate[0].message }}</span>
                                    </p>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="relative max-w-sm">
                                        <DatePickers :index="i" @update:date="emitEndDate" />
                                    </div>
                                    <p class="mt-1 text-sm text-red-600 dark:text-red-500"
                                        v-if="fieldsError[i]?.endDate?.length">
                                        <span class="font-small">{{ fieldsError[i].endDate[0].message }}</span>
                                    </p>
                                </td>
                                <td class="px-6 py-4">
                                    <select id="priority" v-model="payload.priority"
                                        class="block w-full p-1.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Urgent">Urgent</option>
                                    </select>
                                </td>
                                <td class="px-6 py-4">
                                    <select id="status" v-model="payload.status"
                                        class="block w-full p-1.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value="Pending">Pending</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </td>
                                <td class="px-6 py-4">
                                    <select id="payment" v-model="payload.payment"
                                        class="block w-full p-1.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value="Unpaid">Unpaid</option>
                                        <option value="Paid">Paid</option>
                                    </select>
                                </td>
                                <td class="px-6 py-4">
                                    <input type="text" id="small-input" v-model="payload.fee"
                                        class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <p class="mt-1 text-sm text-red-600 dark:text-red-500"
                                        v-if="fieldsError[i]?.fee?.length">
                                        <span class="font-small">{{ fieldsError[i].fee[0].message }}</span>
                                    </p>
                                </td>
                                <td class="px-6 py-4">
                                    <button type="button" @click="removeElement(i)"
                                        class="text-white bg-blue-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            class="h-5 w-5 text-white hover:text-white-500 cursor-pointer" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" v-for="scope in scopes">
                                <th scope="row"
                                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {{ scope.name }}
                                </th>
                                <td class="px-6 py-4">
                                    {{ dateFormatter(scope.startDate) }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ dateFormatter(scope.endDate) }}
                                </td>
                                <td class="px-6 py-4">
                                    <select id="priority" v-model="scope.priority" @change="update(scope)"
                                        class="block w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Urgent">Urgent</option>
                                    </select>
                                </td>
                                <td class="px-6 py-4">
                                    <select id="status" v-model="scope.status" @change="update(scope)"
                                        class="block w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value="Pending">Pending</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </td>
                                <td class="px-6 py-4">
                                    <select id="payment" v-model="scope.payment" @change="update(scope)"
                                        class="block w-full p-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value="Unpaid">Unpaid</option>
                                        <option value="Paid">Paid</option>
                                    </select>
                                </td>
                                <td class="px-6 py-4">
                                    {{ setFee(scope.fee) }}
                                </td>
                                <td>
                                    <div class="flex">
                                        <EditScope :data="scope" />
                                        <DeleteScope :data="scope" />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>
