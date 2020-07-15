import {request} from 'utils/request.js';
import qs from 'qs';

export function updatePassword(values){		
			return request({
					url: '/updatePassword',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function uploadUserPhoto(values){		
			return request({
					url: '/uploadUserPhoto',
					headers: {'Content-Type': 'multipart/form-data'},
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}