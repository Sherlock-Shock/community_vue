<template>
	<div class="container">
		<h1 class="title">{{noticedata.title}}</h1>	
		<div class="msg">
			浏览次数：{{noticedata.views}} &nbsp;&nbsp;&nbsp;
			发布者：{{noticedata.publisher}} &nbsp;&nbsp;&nbsp;
			发布时间：{{noticedata.publishTime}}
		</div>
			<el-divider></el-divider>
				<div class="ql-editor" v-html="noticedata.content">
				</div>
		    		
	</div>
</template>

<script>
	import 'quill/dist/quill.core.css';
	import 'quill/dist/quill.snow.css';
	import 'quill/dist/quill.bubble.css';
				
	import {getOneNotice} from '../../api/notice.js';
	export default{
		name: '',
		data() {
			return {
				noticedata: {
					title: '',
					content: '',
					publisher: '',
					publishTime: '',
					views: ''
				}
			}			
		},
		created() {
			if(this.$route.query!=''){
				let noticeId = this.$route.query.noticeId;
				getOneNotice(noticeId).then(res=>{
					if(res!=''){
						this.noticedata = res;
					}else{
						this.$router.replace('/404')
					}				
				})
				
			}else{
				this.$router.push('/404')
			}
		},
		methods: {
			
		},
	}
</script>

<style scoped>
	.title{
		text-align: center;
		margin-bottom: 8px;
	}
	.msg{
		font-size: 17px;
		text-align: center;
		margin-bottom: 13px;
	}

</style>
