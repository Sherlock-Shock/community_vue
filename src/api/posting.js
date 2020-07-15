import {request} from 'utils/request.js';
import qs from 'qs';

export function getPosting(values){		
			return request({
					url: '/getPosting',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function addPosting(values){		
			return request({
					url: '/addPosting',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function getPostDetail(values){		
			return request({
					url: '/getPostDetail',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function addComment(values){		
			return request({
					url: '/addComment',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}
export function getAllComment(values){		
			return request({
					url: '/getAllComment',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}



export function getCommentNum(values){		
			return request({
					url: '/getCommentNum',
					method: 'post',
					data: qs.stringify({
						...values
						})
					})	
	
}

export function giveCommentStar(cid){	
	let param = new URLSearchParams()
	param.append('commentId', cid)
			return request({
					url: '/giveCommentStar',
					method: 'post',
					data: param
					})	
	
}

export function deletePost(pid){	
	let param = new URLSearchParams()
	param.append('postId', pid)
			return request({
					url: '/deletePost',
					method: 'post',
					data: param
					})	
	
}

export function getInnerComment(cid){	
	let param = new URLSearchParams()
	param.append('commentId', cid)
			return request({
					url: '/getInnerComment',
					method: 'post',
					data: param
					})	
	
}
export function getBeComNum(cid){	
	let param = new URLSearchParams()
	param.append('beCommentId', cid)
			return request({
					url: '/getBeComNum',
					method: 'post',
					data: param
					})	
	
}

export function uploadPostPicture(values){	
	return request({
			url: '/uploadPostPicture',
			headers: {'Content-Type': 'multipart/form-data'},
			method: 'post',
			data: values	
			})		
}


