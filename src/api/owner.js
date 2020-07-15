import {request} from 'utils/request.js';
import qs from 'qs';

export function getOwnerData(values){		
			return request({
					url: '/getOwner',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function getOwnerTotal(){		
			return request({
					url: '/getOwnerTotal',
					method: 'post'
					})	
	
}


export function getOwnerById(id){	
	let param = new URLSearchParams()
	param.append('ownerId', id)
			return request({
					url: '/getOwnerById',
					method: 'post',
					data: param
					})		
}

export function resetOwnerPassword(id){	
	let param = new URLSearchParams()
	param.append('ownerId', id)
			return request({
					url: '/resetOwnerPassword',
					method: 'post',
					data: param
					})		
}

export function getOwnerIdByPhone(phone){	
	let param = new URLSearchParams()
	param.append('phone', phone)
			return request({
					url: '/getOwnerIdByPhone',
					method: 'post',
					data: param
					})		
}
export function getOwnerMsgByPhone(phone){	
	let param = new URLSearchParams()
	param.append('phone', phone)
			return request({
					url: '/getOwnerMsgByPhone',
					method: 'post',
					data: param
					})		
}

export function getOwnerAllHouse(id){	
	let param = new URLSearchParams()
	param.append('ownerId', id)
			return request({
					url: '/getOwnerAllHouse',
					method: 'post',
					data: param
					})		
}

export function getOwnerAllParking(id){	
	let param = new URLSearchParams()
	param.append('ownerId', id)
			return request({
					url: '/getOwnerAllParking',
					method: 'post',
					data: param
					})		
}
export function dropParking(id){	
	let param = new URLSearchParams()
	param.append('parkId', id)
			return request({
					url: '/dropParking',
					method: 'post',
					data: param
					})		
}

export function dropHouse(id){	
	let param = new URLSearchParams()
	param.append('houseId', id)
			return request({
					url: '/dropHouse',
					method: 'post',
					data: param
					})		
}
export function addOwner(values){	
	
			return request({
					url: '/addOwner',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function deleteOwner(oids){	
	let param = new URLSearchParams()
	param.append('ownerId', oids)
	
	return request({
			url: '/deleteOwners',
			method: 'post',
			data: param
			})
}

export function uploadOwnerPhoto(param){	
	return request({
			url: '/uploadOwnerPhoto',
			headers: {'Content-Type': 'multipart/form-data'},
			method: 'post',
			data: param			
			})		
}

export function updateOwner(values){	
	return request({
			url: '/updateOwner',
			method: 'post',
			data: qs.stringify({
						...values
						})		
			})		
}
export function exportOwnerExcel(){	
	return request({
			url: '/exportOwnerExcel',
			method: 'get',
			responseType: "blob"
			})		
}
