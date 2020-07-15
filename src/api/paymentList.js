import {request} from 'utils/request.js';
import qs from 'qs';

export function getPaymentListData(values){		
			return request({
					url: '/getPaymentList',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function getOwnerPaymentListData(values){		
			return request({
					url: '/getOwnerPaymentList',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function addPaymentList(values){		
			return request({
					url: '/addPaymentList',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function addPLPaymentList(values){		
			return request({
					url: '/addPiLiangPaymentList',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function payPayment(values){		
			return request({
					url: '/payPayment',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}