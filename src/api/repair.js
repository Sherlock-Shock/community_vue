import {request} from 'utils/request.js';
import qs from 'qs';

export function getRepairListData(values){		
			return request({
					url: '/getRepairList',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function getRepairDetailData(values){		
			return request({
					url: '/getRepairDetail',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function getRepairedOne(values){		
			return request({
					url: '/getRepairOne',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function getRepairListByOwnerId(values){		
			return request({
					url: '/getRepairListByOwnerId',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}


export function updateRepair(values){		
			return request({
					url: '/updateRepair',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function addRepair(values){		
			return request({
					url: '/addRepair',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function addRepaired(values){		
			return request({
					url: '/addRepaired',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function finishRepair(values){		
			return request({
					url: '/finishRepair',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function deleteRepairs(val){	
	let param = new URLSearchParams()
	param.append('RepairNo', val)
	
	return request({
			url: '/deleteRepairs',
			method: 'post',
			data: param
			})
}

