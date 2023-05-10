import { defineStore } from "pinia";

interface createScope {
    projectId: string,
    scopes: []
}

interface updateScope {
    name: string,
    startDate: string,
    endDate: string,
    priority: string,
    status: string,
    payment: string,
    fee: string
}

export const useScopeStore = defineStore('scope', () => {
    const config = useRuntimeConfig();

    const scopes = ref([]);

    const findScopes = async (id: string) => {
        const { data, error }: any = await useFetch(`/scope/collection/${id}`, {
            baseURL: config.public.API_URL,
            method: 'GET'
        })

        if (!error.value) {
            scopes.value = data.value;
        }
    }

    const createScopes = async (payload: createScope) => {
        try {
            const res = await $fetch('/scope', {
                baseURL: config.public.API_URL,
                method: 'POST',
                body: payload
            });
            await findScopes(payload['projectId']);
            return { statusCode: 201, data: res };
        } catch (err: any) {
            return err.data;
        }
    }

    const updateScope = async (id: number, payload: updateScope) => {
        try {
            const res = await $fetch(`/scope/${id}`, {
                baseURL: config.public.API_URL,
                method: 'PATCH',
                body: payload
            });

            return { statusCode: 200, data: res };
        } catch (err: any) {
            return err.data;
        }
    }

    const removeScope = async (id: number) => {
        try {
            const res = await $fetch(`/scope/${id}`, {
                baseURL: config.public.API_URL,
                method: 'DELETE'
            });
            console.log(res)

            return { statusCode: 200, data: res }
        } catch (err: any) {
            return err.data;
        }
    }

    return {
        scopes,
        findScopes,
        createScopes,
        updateScope,
        removeScope
    }
})