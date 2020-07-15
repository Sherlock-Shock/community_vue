module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
	configureWebpack: {
		resolve: {
			alias: {
				'assets': '@/assets',
				'common': '@/common',
				'components': '@/components',
				'api': '@/api',
				'views': '@/views',
				'utils': '@/utils'
			}
		}
	}
    // devServer: {
    //     proxy: {
    //         '/api':{
    //             target:'http://jsonplaceholder.typicode.com',
    //             changeOrigin:true,
    //             pathRewrite:{
    //                 '/api':''
    //             }
    //         }
    //     }
    // }
	// proxyTable: {
	//         '/api':{
	//             target:'http://127.0.0.1',
	//             changeOrigin:true,
	//             pathRewrite:{
	//                 '/api':''
	//             }
	//         }
	//     }
}