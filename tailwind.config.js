/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'darkblue': '#0d121a',
                'blue': '#3f96c8',
                'lightblue': '#202937',
                'lighterblue': '#2e3c54',
                'green': '#61d588'
            }
        }
    },
    plugins: [],
}