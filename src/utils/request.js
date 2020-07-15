import axios from 'axios'
import qs from 'qs'

export function request(config) {

  // 1.创建axios的实例

  const instance = axios.create({

    baseURL: 'http://120.79.205.41:9002',

    timeout: 5000

  })

  // 2.axios的拦截器

  // 2.1.请求拦截的作用

  instance.interceptors.request.use(config => {
	  
	  let strCookie=document.cookie;
	  let arrCookie=strCookie.split("; ");
	  let token;
	  for(let i=0;i<arrCookie.length;i++){
	               let arr=arrCookie[i].split("=");
	               if("token"==arr[0]){
	                      token=arr[1];
	                      break;
	               }
	  }
	//cookie中如果存在token,就携带在头信息里  
	if(token){
		config.headers.Authorization = 'Bearer '+ token 
	}
	
    return config

  }, err => {

     console.log(err);

  })

  // 2.2.响应拦截

  instance.interceptors.response.use(res => {

	//console.log("前端拦截响应的login: " + res.data.data.code);
	 // const status = res.status
	 // if(status==403){
	 // 	this.$router.push('/index')
	 // }
	
    return res.data

  }, err => {

    // var code = err.response.status
    //      console.log('err' + error)// for debug
    //          Message({
    //            message: error.message,
    //            type: 'error',
    //            duration: 5 * 1000
    //          })
			 
		 return Promise.reject(error)

  })

  // 3.发送真正的网络请求

  return instance(config)

}