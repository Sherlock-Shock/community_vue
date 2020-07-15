import {request} from 'utils/request.js';
import qs from 'qs';

export function getComplaintData(values){		
			return request({
					url: '/getComplaint',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function updateComplaint(values){		
			return request({
					url: '/updateComplaint',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function deleteComplaint(values){		
	let param = new URLSearchParams()
	param.append('complaintId', values)
			return request({
					url: '/deleteComplaint',
					method: 'post',
					data: param
					})	
	
}
export function addComplaint(values){		
			return request({
					url: '/addComplaint',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function reviewComplaint(values){		
			return request({
					url: '/reviewComplaint',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

