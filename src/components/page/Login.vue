<template>
<div style="background-color: #42B983;height: 100%;">

	<el-container >
	  <el-header style="background-color: white;height: 60px;color: #42b983;">
		   <h1 style="margin-top: 10px;margin-left: 170px;">{{showdata.cname}}</h1>
	  </el-header>
	  <el-main style="background-color: #42B983;">

		  <el-row >
		    <el-col :span="13" >
				<div align="center" style="margin-top: 100px;color: white;">
					<div style="width: 500px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{showdata.summary}}</div>
					<br /><br />
					<h2>地址：{{showdata.address}}({{showdata.landmark}})</h2>
					
				</div>
			</el-col>
		    <el-col :span="11">
				<div id="login">
					 <el-form :model="loginForm" ref="loginForm"  :rules="rules" label-width="0px" class="login-box">
					      <h3 class="login-title">欢 迎 登 录</h3>
					      <el-form-item  prop="userid"  >
					        <el-input type="text" placeholder="请输入账号" v-model="loginForm.userid"/>
					      </el-form-item>
					      <el-form-item  prop="password">
					        <el-input type="password" placeholder="请输入密码" v-model="loginForm.password"/>
					      </el-form-item>
						  <el-row>
						    <el-col :span="6">
								<div>
								<el-checkbox v-model="remember">记住我</el-checkbox>
								</div>
							</el-col>
						    <el-col :span="18"><div></div></el-col>
						  </el-row>
					      <el-form-item label="" >
					        <el-button type="primary" @click="onSubmit()" v-loading.fullscreen="fullscreenLoading" plain class="loginbutton" >登 录</el-button>
					      </el-form-item>
					  </el-form>
				</div>
			</el-col>
		  </el-row>
	
	  </el-main>
		  <el-footer style="text-align: center;color: #cccccc;background-color: white;">
			  
			  <h4 style="margin-top: 8px;">{{showdata.company}}
			  <el-divider direction="vertical"></el-divider>
			  联系电话：{{showdata.tell}}</h4>
			  
		  </el-footer>
	</el-container>
	

</div> 
	
</template>

<script>
	import {login} from 'api/login.js'
	import {getCommunityData} from '../../api/communityMsg.js'
	
	export default{
		name: 'login',
		data() {
			return{
				loginForm: {
					userid: '',
					password: ''	
					},
				rules: {
				          userid: [
				            {required: true, message: '账号不可为空', trigger: 'blur'}
				          ],
				          password: [
				            {required: true, message: '密码不可为空', trigger: 'blur'}
				          ]
				        },
				//dialogVisible: false,
				fullscreenLoading: false,
				remember: true,
				querydata: {
					communityId: 1
				},
				showdata: {
					cname: '',
					summary: '',
					company: '',
					address: '',
					landmark: '',
					tell: '',
				},
			}
		},
		created() {
			this.getData()
		},
		methods: {
			getData() {
				getCommunityData(this.querydata).then(res=>{
					this.showdata = res.data[0]
				})
			},	
			onSubmit(){
				this.$refs.loginForm.validate((valid) => {
				  if (valid) {
				this.fullscreenLoading = true;
				login(this.loginForm.userid,this.loginForm.password)
				.then(res=>{
						this.fullscreenLoading = false;
				    	console.log("res: " + res.code);
				    	//localStorage.setItem("token",res.data);
				    	//localStorage.setItem("userid",this.loginForm.userid);
						//1001--账号密码错误
						if(res.code!='1001'){
							if(this.remember){
								this.$cookies.set("userid",this.loginForm.userid,'5d')
								this.$cookies.set("userrole",res.data.userrole,'5d')
								this.$cookies.set("token",res.data.token,'5d')	
							}else{
								this.$cookies.set("userid",this.loginForm.userid,'session')
								this.$cookies.set("userrole",res.data.userrole,'session')
								this.$cookies.set("token",res.data.token,'session')								
							}
							if(res.data.userrole.indexOf("NORMAL") != -1){
								this.$router.push('/userindex')
							}else{
								this.$router.push('/adminindex')
							}
						}else{
							this.$message.error('账号或密码错误');
							//this.fullscreenLoading = false;		
						}				    	
				}).catch(e=>{				
				    	console.log(e)
						
				    })
				  } else {
				    return false;
				  }
				});	
			
				
			}
			
		},
	}
</script>

<style>
	 #login{
		 text-align: center;
		 background-color: #42B983;
		 /*background-color: #FF8198;*/
		 /*height: 100%;
		 width: 100%;*/
		 /*position: fixed*/
	 }
	 .login-box {
	    border: 1px solid #DCDFE6;
	    width: 350px;
		height: 300px;
	    margin: 180px auto;
		margin-top: 50px;
	    padding: 35px 35px 15px 35px;
	    border-radius: 10px;
	    -webkit-border-radius: 10px;
	    -moz-border-radius: 10px;
	    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		background-color: #FFFFFF;
	  }
	  .loginbutton{
		  width: 100%;
		  margin-top: 12px;
	  }
	  .login-title {
	    text-align: center;
	    margin: 0 auto 40px auto;
	    color: #303133;
	  }
</style>
