import {request} from 'utils/request.js';
import qs from 'qs';

export function getNoticeData(values){		
			return request({
					url: '/getNotice',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function getOneNotice(noticeId){
	
	let param = new URLSearchParams()
	param.append('noticeId', noticeId)
	
			return request({
					url: '/getOneNotice',
					method: 'post',
					data: param
					})	
	
}

export function addNotice(values){	
			return request({
					url: '/addNotice',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function deleteNotice(ids){	
	let param = new URLSearchParams()
	param.append('noticeId', ids)
	
	return request({
			url: '/deleteNotice',
			method: 'post',
			data: param
			})
}