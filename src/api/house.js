import {request} from 'utils/request.js';
import qs from 'qs';

export function getHouseData(values){		
	// let param = new URLSearchParams()
	// param.append('page', page1)
	// param.append('rows', rows1)	
			return request({
					url: '/getHouse',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function getHouseTotal(){		
			return request({
					url: '/getHouseTotal',
					method: 'post'
					})	
	
}

export function getHousePie(){		
			return request({
					url: '/getHousePie',
					method: 'post'
					})	
	
}
export function checkRoomNoIsExist(values){		
			return request({
					url: '/checkRoomNoIsExist',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}


export function getHouseAndOwnerData(values){		

			return request({
					url: '/getHouseAndOwner',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function deleteHouses(values){	
	let param = new URLSearchParams()
	param.append('houseId', values)

	return request({
			url: '/deleteHouses',
			method: 'post',
			data: param
			})
}

export function addHouse(values){	
	
	return request({
			url: '/addHouse',
			method: 'post',
			data: qs.stringify({
				...values
				})
			})
}



export function updateHouse(values){		
	return request({
			url: '/updateHouse',
			method: 'post',
			data: qs.stringify({
				...values
				})
			})
}

export function updateHouseOwner(values){		
	return request({
			url: '/updateHouseOwner',
			method: 'post',
			data: qs.stringify({
				...values
				})
			})
}

export function getBuildingNo(){		
			return request({
					url: '/getBuildingNo',
					method: 'get'
					})	
	
}

export function getUnitNo(){		
			return request({
					url: '/getUnitNo',
					method: 'get'
					})	
	
}

export function getBUNo(){		
			return request({
					url: '/getBUNo',
					method: 'get'
					})	
	
}
