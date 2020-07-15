import {request} from 'utils/request.js';
import qs from 'qs';

export function getParkingAreaData(values){		
			return request({
					url: '/getParkingArea',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function getParkingAreaId(){		
			return request({
					url: '/getParkingAreaId',
					method: 'post',					
					})		
}
export function checkParkingAreaNoIsExist(values){		
			return request({
					url: '/checkParkingAreaNoIsExist',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}


export function deleteParkingAreas(pids){	
	let param = new URLSearchParams()
	param.append('parkingAreaId', pids)
	
	return request({
			url: '/deleteParkingAreas',
			method: 'post',
			data: param
			})
}

export function updateParkingArea(values){		
			return request({
					url: '/updateParkingArea',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function addParkingArea(values){		
			return request({
					url: '/addParkingArea',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}