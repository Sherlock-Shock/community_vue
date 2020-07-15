import {request} from 'utils/request.js';
import qs from 'qs';

export function getParkingData(values){		
			return request({
					url: '/getParking',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function getParkingTotal(){		
			return request({
					url: '/getParkingTotal',
					method: 'post'
					})	
	
}

export function getParkingPie(){		
			return request({
					url: '/getParkingPie',
					method: 'post'
					})	
	
}

export function getParkingFree(values){		
			return request({
					url: '/getParkingFree',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function updateParkingOwnerBind(values){		
			return request({
					url: '/updateParkingOwnerBind',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function checkParkingNoIsExist(values){		
			return request({
					url: '/checkParkingNoIsExist',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function getParkingAndOwnerData(values){		
			return request({
					url: '/getParkingAndOwner',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function addParking(values){		
			return request({
					url: '/addParking',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function deleteParkings(pids){	
	let param = new URLSearchParams()
	param.append('parkId', pids)
	
	return request({
			url: '/deleteParkings',
			method: 'post',
			data: param
			})
}
export function updateParking(values){		
			return request({
					url: '/updateParking',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}