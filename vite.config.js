/**
* @type {import('vite').UserConfig}
*/
import {defineConfig} from 'vite';

export default defineConfig({
    base: '/island_picker/',
    build: {
        sourcemap: true,
    },
    server: {
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'https://jobfair.nordeus.com/jf24-fullstack-challenge/test', // Replace with the API's URL
                changeOrigin: true, // Makes it seem like the request is coming from the proxy server
                rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Adjust the path
                secure: false,
                headers: {
                    // Forward any necessary custom headers
                    'Access-Control-Allow-Origin': '*',
                },
            },
        },
    },
});

// export default{
//     defineConfig({
//         base: '/<repository>/', // Replace <repository> with your GitHub repository name
//     });
//     build: {
//         sourcemap: true,
//     },
//     server: {
//         host: '0.0.0.0',
//         proxy: {
//             '/api': {
//                 target: 'https://jobfair.nordeus.com/jf24-fullstack-challenge/test', // Replace with the API's URL
//                 changeOrigin: true, // Makes it seem like the request is coming from the proxy server
//                 rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Adjust the path
//                 secure: false,
//                 headers: {
//                     // Forward any necessary custom headers
//                     'Access-Control-Allow-Origin': '*',
//                 },
//             },
//         },
//     },
// }
