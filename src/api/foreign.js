import {request} from 'utils/request.js';
import qs from 'qs';

export function getForeignPeoData(values){		
			return request({
					url: '/getForeignPeople',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function deleteForeignPeos(values){		
	let param = new URLSearchParams()
	param.append('personNo', values)
			return request({
					url: '/deleteForeignPeos',
					method: 'post',
					data: param
					})	
	
}

export function addForeignPeo(values){		
			return request({
					url: '/addForeignPeo',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function leaveCommunity(values){		
			return request({
					url: '/leaveCommunity',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}