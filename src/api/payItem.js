import {request} from 'utils/request.js';
import qs from 'qs';

export function getPayItemData(values){		
			return request({
					url: '/getPayItem',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function addPayItem(values){		
			return request({
					url: '/addPayItem',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function deletePayItem(values){		
	let param = new URLSearchParams()
	param.append('payItemId', values)
			return request({
					url: '/deletePayItem',
					method: 'post',
					data: param
					})	
	
}

export function updatePayItem(values){		
			return request({
					url: '/updatePayItem',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}