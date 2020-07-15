<template>
	<div class="container">
		<el-container>
		  <el-header>最新公告
		  <div class="search">
			  <el-input  v-model="querydata.title" placeholder="搜索标题"></el-input>
			 <el-button type="primary" icon="el-icon-search" @click="handleSearch"></el-button>  
		  </div>		 
		  <el-divider></el-divider>
		  </el-header>		  
		  <el-main>
			  <div v-for="item in noticeData">
				   <el-link :href="'/notice?noticeId='+item.noticeId" target="_blank">{{item.title}}</el-link>
				   <span style="float: right;">{{dataFormat(item.publishTime)}}</span>
				   <div class="xuxian"></div>
			  </div>
			  <div class="pagination">
			      <el-pagination
			          background
			          layout="total, prev, pager, next"
			          :current-page="querydata.page"
			          :page-size="querydata.rows"
			          :total="pageTotal"
			          @current-change="handlePageChange"
			      ></el-pagination>
			  </div>
		  </el-main>
		</el-container>
	</div>
</template>

<script>
	import {getNoticeData} from '../../../api/notice.js'
	
	export default{
		name: 'userindex',
		data() {
			return {
				querydata: {
					page: 1,
					rows: 5,
					title: ''
				},
				noticeData: [],
				pageTotal: 0 
			}
		},
		created() {
			this.getData()
		},
		methods: {
			getData() {
				getNoticeData(this.querydata).then(res=>{
					this.noticeData = res.data;
					this.pageTotal = res.total;
				})	
			},
			dataFormat(val){
				let date=val.split(" ");
				return date[0]
			},
			handleSearch(){
				this.getData()
			},
			handlePageChange(val){
				this.$set(this.querydata, 'page', val);
				this.getData();
			}
		},
	}
</script>

<style>
	.search{
		float: right;
		width: 200px;
		display: flex;
	}
	.search el-input{
		flex: 1;
	}
	.xuxian {
		border-bottom:1px dashed #000; 
		height:1px;
		width:100%;
		opacity:0.1;
		margin-bottom: 6px;
		margin-top: 6px;
		} 
</style>
