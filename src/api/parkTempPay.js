import {request} from 'utils/request.js';
import qs from 'qs';

export function getTPPaymentList(values){		
			return request({
					url: '/getTPPaymentList',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function addTPPaymentList(values){		
			return request({
					url: '/addTPPaymentList',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}