import {request} from 'utils/request.js';
import qs from 'qs';
export function getUnitData(page,rows,unitNo){		
	// let param = new URLSearchParams()
	// param.append('page', page1)
	// param.append('rows', rows1)	
		if(unitNo){
			return request({
					url: '/getUnits?page='+page+'&rows='+rows+'&unitNo='+unitNo,
					method: 'get'
					})	
		}else{
			return request({
					url: '/getUnits?page='+page+'&rows='+rows,
					method: 'get'
					})	
		}
	
}

export function deleteUnits(uids){	
	let param = new URLSearchParams()
	param.append('unitId', uids)
	
	return request({
			url: '/deleteUnits',
			method: 'post',
			data: param
			})
}

export function checkUnitNoIsExist(values){		
			return request({
					url: '/checkUnitNoIsExist',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function updateUnit(uid,uno,floor,lift){	
	let param = new URLSearchParams()
	param.append('unitId', uid)
	param.append('unitNo', uno)
	param.append('floor', floor)
	param.append('lift', lift)		
	return request({
			url: '/updateUnit',
			method: 'post',
			data: param
			})
}