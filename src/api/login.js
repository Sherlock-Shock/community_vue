import {request} from 'utils/request.js';

export function login(userid1,password1){
	
	let param = new URLSearchParams()
	param.append('userid', userid1)
	param.append('password', password1)
	
	return request({
			url: '/login',
			method: 'post',
			data: param
			})
}


