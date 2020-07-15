import {request} from 'utils/request.js';
import qs from 'qs';
export function getBuildingData(page1,rows1){		
	// let param = new URLSearchParams()
	// param.append('page', page1)
	// param.append('rows', rows1)		
	return request({
			url: '/getBuildings?page='+page1+'&rows='+rows1,
			method: 'get'
			})
}

export function getBuildingDataByNo(page1,rows1,buildingNo){			
	return request({
			url: '/getBuildingsByNo?page='+page1+'&rows='+rows1+'&buildingNo='+buildingNo,
			method: 'get'
			})
}

export function addBuilding(bno,bname){	
	let param = new URLSearchParams()
	param.append('bulidingno', bno)
	param.append('bulidingname', bname)		
	return request({
			url: '/addbuilding',
			method: 'post',
			data: param
			})
}

export function updateBuilding(bid,bno,bname){	
	let param = new URLSearchParams()
	param.append('bulidingid', bid)
	param.append('bulidingno', bno)
	param.append('bulidingname', bname)		
	return request({
			url: '/updateBuilding',
			method: 'post',
			data: param
			})
}
export function checkBuildingNoIsExist(bno){
	let param = new URLSearchParams()
	param.append('bulidingno', bno)
			return request({
					url: '/checkBuildingNoIsExist',
					method: 'post',
					data: param
					})	
	
}


export function deleteBuilding(bid){	
	let param = new URLSearchParams()
	param.append('bbuildingId', bid)
	
	return request({
			url: '/deleteBuilding',
			method: 'post',
			data: param
			})
}

export function deleteBuildings(bids){	
	let param = new URLSearchParams()
	param.append('bbuildingIds', bids)
	
	return request({
			url: '/deleteBuildings',
			method: 'post',
			data: param
			})
}

//unit
export function addUnit(bid,uno,floor,lift){	
	let param = new URLSearchParams()
	param.append('buildingId', bid)
	param.append('unitNo', uno)	
	param.append('floor', floor)
	param.append('lift', lift)	
	return request({
			url: '/addunit',
			method: 'post',
			data: param
			})
}