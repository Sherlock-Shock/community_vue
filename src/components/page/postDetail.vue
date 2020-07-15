<template>
<div>
	<div class="container">
		<div style="text-align: center;">
			<h1>{{showdata.title}}</h1>
		</div>
		<div style="text-align: right;">
			<el-button type="danger"
			v-if="$cookies.get('userrole').indexOf('ADMIN')!=-1"
			@click="handleDeletePost(showdata.postId)" >删除</el-button>
		</div>	  
			 
			
		<div class="msg">
			<el-row>
			  <el-col :span="8">&nbsp;</el-col>
			  <el-col :span="8">
				  <div align="center" style="margin-top: 5px;color: #b7b7b7;font-size: 15px;">
				  	{{showdata.views}}阅读
				  	<el-divider direction="vertical"></el-divider>
				  	{{comNum}}评论
					<el-divider direction="vertical"></el-divider>
					<span>{{showdata.postTime}}</span>
				  </div>	
			  </el-col>
			  <el-col :span="8">
				  <div style="float: right;display: flex;">					  
				  	<el-avatar :src="showdata.photo"></el-avatar>
				  	<span>{{showdata.userName}}</span>
					<span style="color: red;font-size: 5px;height: 5px;"
					v-if="showdata.userRole=='ADMIN'">管理员</span>
					
				  </div>
			  </el-col>
			</el-row>
								
		</div>
		<div v-html="showdata.content"  style="margin:0 100px 60px 100px;"></div>	    		
	</div>
	<div class="container">
		<el-container>
		  <el-header>
			  <el-row>
			    <el-col :span="20"><h2>{{comNum}}条评论</h2></el-col>
			    <el-col :span="4">
					<div style="float: right;">
						<el-tabs v-model="activeName" @tab-click="handleClick">
						   <el-tab-pane label="按热度排序" name="stars"></el-tab-pane>
						   <el-tab-pane label="按时间排序" name="cTime"></el-tab-pane>
						 </el-tabs>
					</div>
				</el-col>
			  </el-row>
			  <el-row >
			    <el-col :span="1">
					<el-avatar :src="userPhotoUrl+currentUserPhoto"  style="float: right;"></el-avatar>
				</el-col>
			    <el-col :span="15">
					<el-input
					  type="textarea"
					  :rows="2"
					  placeholder="请遵守互联网的法律法规,严禁发布色情,暴力,反动内容"
					  v-model="addcomdata.content">
					</el-input>
				</el-col>
			    <el-col :span="8" >
					<el-button type="primary" @click="addPostCommont" style="font-size: 11px;">发&nbsp;表<br/><br/>评&nbsp;论</el-button>
				</el-col>
			  </el-row>			 
		  </el-header>
		  
		  <el-main style="margin-top: 40px;">
			  <el-divider></el-divider>
			  <div v-for="(com,index) in commentData" :key="index">
				  <el-avatar :src="userPhotoUrl+com.photo"></el-avatar>
				  {{com.userName}}
				  <span style="color: red;font-size: 5px;height: 5px;"
				  v-if="com.userRole=='ADMIN'">管理员</span>
				  ：{{com.content}} 		
					 <el-button style="margin-left: 10px;" type="text" icon="el-icon-lx-likefill" @click="giveStar(com.commentId,index)"></el-button>{{com.starNum}}
						  <span style="margin-left: 50px;"> {{dateStr(com.comTime)}}</span>
				  <div style="margin-left: 30px;">
					  <el-button  type="text" @click="replySomeOne(com.commentId,index)">回复</el-button>
					  <el-button v-if="com.beComNum!=0" type="text" @click="getInnerCommented(com.commentId,index)">{{com.beComNum}}条回复</el-button>		 
				  </div>
				  <div v-if="replyVisible[index]" style="background-color: #fffae8;margin-left: 20px;">
					  <div v-for="reply in totalReplyData[index]">
						  <el-avatar :src="userPhotoUrl+reply.photo" size="small"></el-avatar>
						  {{reply.userName}}
						  <span style="color: red;font-size: 5px;height: 5px;"
						  v-if="reply.userRole=='ADMIN'">管理员</span>
						  ：{{reply.content}}
						  <span style="margin-left: 20px;"> {{dateStr(reply.comTime)}}</span>						  
						 
					  </div>
				  </div>
				  <div v-if="replyVisible[index]" style="display: flex;margin:10px 0 10px 20px;">
					  <span >回复{{com.userName}}  </span>
					  <el-input v-model="replydata.content" style="width: 200px;"></el-input>
					  <el-button type="primary" @click="replyComment(com.commentId,index)">发表</el-button>
				  </div>
			  </div>
			  <div class="pagination">
			      <el-pagination
			          background
			          layout="total, prev, pager, next"
			          :current-page="querycomdata.page"
			          :page-size="querycomdata.rows"
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
	import {getPostDetail} from '../../api/posting.js'
	import {addComment} from '../../api/posting.js'
	import {getAllComment} from '../../api/posting.js'
	import {getCommentNum} from '../../api/posting.js'
	import {giveCommentStar} from '../../api/posting.js'
	import {getInnerComment} from '../../api/posting.js'
	import {deletePost} from '../../api/posting.js'
	
	export default{
		name: 'postDetail',
		data() {
			return {
				queryData: {
					postId: ''
				},
				querycomdata: {
					page: 1,
					rows: 5,
					postId: '',
					rankType: ''
				},
				showdata: {
					postId: '',
					userId: '',
					title: '',
					content: '',
					postTime: '',
					views: '',
					userName: '',
					photo: '',
					userRole: ''
				},
				addcomdata: {
					postId: '',
					userId: '',
					content: ''
				},
				replydata: {
					postId: '',
					userId: '',
					content: '',
					beCommentId: 0
				},
				innerCommontData:{
					photo: '',
					userName: '',
					content: '',
					comTime: ''
				},
				commentData: [],
				totalReplyData: [],
				userId: '',
				comNum: 0,
				pageTotal: 0,
				userPhotoUrl: 'http://localhost:9002/userphotos/',
				currentUserPhoto: this.$cookies.get('userid')+'.jpg',
				activeName: 'stars',
				replyVisible: [false,false,false,false,false]
			}
		},
		created() {
			this.userId = this.$cookies.get('userid');
			if(this.userId == '' || this.$route.query.postId ==''){
				this.$router.push('/404')
			}else{
				this.queryData.postId = this.$route.query.postId;
				this.querycomdata.rankType = this.activeName
				this.getData();
				this.getCommentData();
			}
			for(var i =0;i<this.querycomdata.rows;i++){
				this.totalReplyData.push(this.innerCommontData)
			}
			console.log(this.totalReplyData)
			//this.totalReplyData.length = 5;
			//this.replyVisible.push(false);			
		},
		methods: {
			getData() {
				getPostDetail(this.queryData).then(res=>{
					if(res==''){
						this.$router.push('/404')
					}
					this.showdata = res
					this.showdata.photo = this.userPhotoUrl+this.showdata.photo
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
							this.$router.push('/forum')
						}else{
							this.$message.error('删除失败');
						}	
					})                   
			    })
			    .catch(() => {});
			},
			getCommentData(){
				this.querycomdata.postId = this.$route.query.postId;
				getAllComment(this.querycomdata).then(res=>{
					this.commentData = res.data
					this.pageTotal = res.total
					//this.comNum = res.total
				})
				getCommentNum(this.querycomdata).then(res=>{
					this.comNum = res
				})	
			},
			addPostCommont(){
				if(this.addcomdata.content==''){
					
				}else{
					this.addcomdata.postId = this.$route.query.postId;
					this.addcomdata.userId = this.userId;
					addComment(this.addcomdata).then(res=>{
						if(res>0){
							this.$message.success('评论成功');
							this.addcomdata.content=''
							this.getCommentData();
							
						}else{
							this.$message.error('评论失败');
						}
					})	
				}		
			},
			replySomeOne(commentId,index){
				this.getInnerCommented(commentId,index);							
			},
			replyComment(commentId,index){
				if(this.replydata.content==''){
				}else{
					this.replydata.postId = this.$route.query.postId;
					this.replydata.userId = this.userId;
					this.replydata.beCommentId = commentId;
					addComment(this.replydata).then(res=>{
						if(res>0){
							this.$message.success('回复成功');
							this.replydata.content=''
							getInnerComment(commentId).then(res=>{								
								this.totalReplyData.splice(index,1,res)
							})
						}else{
							this.$message.error('回复失败');
						}
					})	
				}
			},
			getUserPhotoUrl(val){
				return this.userPhotoUrl+val
			},
			giveStar(commentId,index){
				//this.commentData[index].starNum +=1
				 giveCommentStar(commentId).then(res=>{
					this.commentData[index].starNum +=1
				 })
			},
			getInnerCommented(commentId,index){
				
				getInnerComment(commentId).then(res=>{
					if(this.replyVisible[index]==true){
						this.replyVisible.splice(index,1,false)
					}else{
						this.replyVisible.splice(index,1,true)
					}
					this.totalReplyData.splice(index,1,res)
				})
			},
			handleClick(tab, event) {
				this.querycomdata.rankType = tab.name
			    this.getCommentData();
			},
			handlePageChange(val){
				this.$set(this.querycomdata, 'page', val);
				 this.getCommentData();
			},
			dateStr(date){
			    //获取js 时间戳
			    var nowtime=new Date().getTime();
				var datetime = new Date(date).getTime();
			   var time=parseInt(nowtime-datetime)/1000;
			    var s;
			    if(time<60*10){//十分钟内
			        return '刚刚';
			    }else if((time<60*60)&&(time>=60*10)){
			        //超过十分钟少于1小时
			        s = Math.floor(time/60);
			        return  s+"分钟前";
			    }else if((time<60*60*24)&&(time>=60*60)){ 
			        //超过1小时少于24小时
			        s = Math.floor(time/60/60);
			        return  s+"小时前";
			    }else if((time<60*60*24*30)&&(time>=60*60*24)){ 
			        //超过1天少于30天内
			        s = Math.floor(time/60/60/24);
			        return s+"天前";
			    }else{ 
			        //超过30天ddd
			        return date;
			    }
			}
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
