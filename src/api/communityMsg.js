import {request} from 'utils/request.js';
import qs from 'qs';

export function getCommunityData(values){		
			return request({
					url: '/getCommunityMsg',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function updateCommunityMsg(values){		
			return request({
					url: '/updateCommunityMsg',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}