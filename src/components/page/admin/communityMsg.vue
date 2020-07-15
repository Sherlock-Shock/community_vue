<template>
	<div>
		<div class="container" style="margin-bottom: 10px;">
			    <el-breadcrumb separator="/" style="font-size: 20px;">
					<el-breadcrumb-item :to="{ path: '/adminindex' }">
					   首页
					</el-breadcrumb-item>
					<el-breadcrumb-item>
					    小区管理
					</el-breadcrumb-item>
			        <el-breadcrumb-item>
			            小区信息
			        </el-breadcrumb-item>
			    </el-breadcrumb>			
		</div>
		<div class="container">
			<el-form :model="editdata" :rules="rules" ref="communityChange" label-width="130px"  class="msg" >
			  <el-form-item label="小区名称" prop="cname">
			    <el-input v-model="editdata.cname"></el-input>
			  </el-form-item>
			  <el-form-item label="概述" prop="summary">
			    <el-input type="textarea"
				:rows="2" v-model="editdata.summary"></el-input>
			  </el-form-item>	    
			  <el-form-item label="开发商" prop="company">
			    <el-input v-model="editdata.company"></el-input>
			  </el-form-item>	 
			  <el-form-item label="地址" prop="address">
			    <el-input v-model="editdata.address"></el-input>
			  </el-form-item>	 
			  <el-form-item label="地标">
			    <el-input v-model="editdata.landmark"></el-input>
			  </el-form-item>
			  <el-form-item label="联系电话" prop="tell">
			    <el-input v-model="editdata.tell"></el-input>
			  </el-form-item>	
			  <el-form-item>
			    <el-button type="primary" @click="submitForm()">保存修改</el-button>
			  </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import {getCommunityData} from '../../../api/communityMsg.js'
	import {updateCommunityMsg} from '../../../api/communityMsg.js'
	
	export default{
		name: 'communityMsg',
		data() {
			return {
				querydata: {
					communityId: 1
				},
				editdata: {
					communityId: 1,
					cname: '',
					summary: '',
					company: '',
					address: '',
					landmark: '',
					tell: '',
				},
				rules: {
				    cname: [
				      { required: true, message: '请输入小区名称', trigger: 'blur' },
				    ],
				    summary: [
				       { required: true, message: '请输入小区介绍', trigger: 'blur' },
				    ],
				    company: [
				       { required: true, message: '请输入开发商', trigger: 'blur' },
				    ],
				    address: [
				      { required: true, message: '请输入地址', trigger: 'blur' },
				    ],
				    tell: [
				     { required: true, message: '请输入联系电话', trigger: 'blur' },
				    ]
				  }
			}
		},
		created() {
			this.getData()
		},
		methods: {
			getData() {
				getCommunityData(this.querydata).then(res=>{
					this.editdata = res.data[0]
				})
			},
			submitForm(){
				this.$refs.communityChange.validate((valid) => {
				         if (valid) {
				           updateCommunityMsg(this.editdata).then(res=>{
								if(res>0){
									this.$message.success('修改成功');
									this.getData();
								}else{
									this.$message.error('修改失败');
								}
								})
				         } else {
				           console.log('error submit!!');
				           return false;
				         }
				       });
			}
		},
	}
</script>

<style>
	.msg{
		text-align: center;
		width: 70%;
		font-size: 100px;
	}
</style>
