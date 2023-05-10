import { defineStore } from "pinia";

//define store name
export const useProjectStore = defineStore('project', () => {
    //init runtime config
    const config = useRuntimeConfig();

    //will store projects[]
    const projects = ref([]);

    //will store project
    const project = ref(null);

    //use $fetch for POST/PATCH/PUT reqs, use useFetch for GET reqs 

    //fetch API using get method the assign the response into projects 
    const findProjects = async () => {
        const { data, error }: any = await useFetch('/project', {
            baseURL: config.public.API_URL
        });
        if (!error.value) {
            projects.value = data.value;
        }
    }

    //for creating a project use PSOT method then pass into body 
    const createProject = async (payload: any) => {
        try {
            const res = await $fetch('/project', {
                baseURL: config.public.API_URL,
                method: 'POST',
                body: payload.value
            });
            await findProjects();
            return { statusCode: 201, data: res };
        } catch (err: any) {
            return err.data;
        }
    }

    //find a specific project via an id
    const findProject = async (id: string) => {
        const { data, error }: any = await useFetch(`/project/${id}`, {
            baseURL: config.public.API_URL
        });
        if (!error.value) {
            project.value = data.value;
        }
    }

    //return the const to use into your components
    return {
        projects,
        project,
        findProjects,
        createProject,
        findProject
    }
});