module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./node_modules/tw-elements/dist/js/**/*.js",
        "./node_modules/flowbite.{js,ts}"
    ],
    theme: {
    },
    plugins: [
        require('flowbite'),
        require("tw-elements/dist/plugin.cjs")
    ],
}