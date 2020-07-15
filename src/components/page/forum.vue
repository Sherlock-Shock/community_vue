<template>
<div>
	<div class="container"  >
		<el-container>
		  <el-header>
			  <el-row type="flex" justify="space-between">
			    <el-col :span="6"><h1>交流论坛</h1></el-col>
			    <el-col :span="6">
					 <div class="search">
					<el-input  v-model="querydata.title" placeholder="搜索标题"></el-input>
					<el-button type="primary" icon="el-icon-search" @click="handleSearch"></el-button>
					 </div>
				</el-col>
			    <el-col :span="6">
					<div>
						<el-button type="primary" icon="el-icon-edit" size="small" style="float: right;" round @click="post">发帖</el-button>
					</div>
				</el-col>
			  </el-row>
			  <el-divider></el-divider>
		  </el-header>
		  
		  <el-main>
			<div v-for="post in postdata" >
				<div align="center">
					<el-button type="text" @click="goPostDetail(post.postId)" class="titlebutton">
					{{post.title}}
					</el-button>
					<el-button type="danger" 
					v-if="$cookies.get('userrole').indexOf('ADMIN')!=-1"
					@click="handleDeletePost(post.postId)" style="float: right;">删除</el-button>
				</div>
				
				<div align="center" style="margin-top: 5px;color: #b7b7b7;font-size: 15px;">
					发表于{{dateFormat(post.postTime)}}
					<el-divider direction="vertical"></el-divider>
					{{post.views}}阅读
					<el-divider direction="vertical"></el-divider>
					{{post.comNum}}评论 					
				</div>
				<div v-html="post.content" style="margin:0 100px 60px 100px;"></div>
				<div style="float: right;display: flex;">
					<el-avatar :src="getUserPhotoUrl(post.photo)" size="small"></el-avatar>
					<span>{{post.userName}}</span>
					<span style="color: red;font-size: 5px;height: 5px;" 
					v-if="post.userRole=='ADMIN'">管理员</span>
					
				</div>
				<br />
				<el-divider></el-divider>
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
</div>
</template>

<script>
	import {getPosting} from '../../api/posting.js'
	import {deletePost} from '../../api/posting.js'
	
	
	export default{
		name: 'forum',
		data() {
			return {
				querydata: {
					page: 1,
					rows: 10,
					title: ''
				},
				postdata: [],
				pageTotal: 0,
				userPhotoUrl: 'http://localhost:9002/userphotos/'			
			}
		},
		created() {
			this.getData();			
		},
		methods: {
			getData(){
				getPosting(this.querydata).then(res=>{
					if(res.data!=''){						
						var newdata  = res.data.map(j=>{
							var index = j.content.indexOf("<!--more-->")
							if(index!=-1){
								j.content = j.content.substring(0,index)
							}
							return j
						})					
					}
					this.postdata = newdata;
					this.pageTotal = res.total;
				})	
			},
			handleDeletePost(postId){
				this.$confirm('确定要删除吗？', '提示', {
				    type: 'warning'
				})
				    .then(() => {
						deletePost(postId).then(res=>{
							if(res>0){
								this.$message.success('删除成功');
								this.getData();
							}else{
								this.$message.error('删除失败');
							}	
						})                   
				    })
				    .catch(() => {});
			},
			goPostDetail(postId){
				this.$router.push('/postDetail?postId='+postId)
			},
			dateFormat(val){
				let arr=val.split(" ");
				return arr[0];
			},
			getUserPhotoUrl(val){
				return this.userPhotoUrl+val
			},
			handleSearch(){
				this.getData()
			},
			post() {
				this.$router.push('/post');
			},
			handlePageChange(val){
				this.$set(this.querydata, 'page', val);
				this.getData();
			}
		},
	}
</script>

<style scoped>
	.search{		
		font-size: 100px;
		width: 200px;
		width: 100%;
		display: flex;
	}
	.titlebutton{
		font-size: 30px;
		color: #000000;
	}
	.titlebutton.hover{
		font-size: 30px;
		color: #07c4a8;
	}
	
</style>
