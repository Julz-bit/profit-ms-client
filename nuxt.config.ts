// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@vueuse/nuxt'
    ],
    runtimeConfig: {
        public: {
            API_URL: process.env.API_URL
        }
    }
})
