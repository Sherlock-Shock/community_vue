import {request} from 'utils/request.js';
import qs from 'qs';

export function getParkRecordData(values){		
			return request({
					url: '/getParkRecord',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function deleteParkRecord(values){
	let param = new URLSearchParams()
	param.append('parkRecordId', values)
	
			return request({
					url: '/deleteParkRecord',
					method: 'post',
					data: param
					})	
	
}

export function addParkRecords(values){		
			return request({
					url: '/addParkRecord',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function leaveParkRecord(values){		
			return request({
					url: '/leaveParkRecord',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}