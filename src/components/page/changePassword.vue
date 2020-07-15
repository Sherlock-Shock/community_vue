<template>
	<div class="container">
		<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
		  <el-form-item label="新密码" prop="pass">
		    <el-input type="password" v-model="ruleForm.pass" autocomplete="off" style="width: 25%;"></el-input>
		  </el-form-item>
		  <el-form-item label="确认密码" prop="checkPass">
		    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" style="width: 25%;"></el-input>
		  </el-form-item>
		  <el-form-item>
			  <br />
		    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
		    <el-button @click="resetForm('ruleForm')">重置</el-button>
		  </el-form-item>
		</el-form>
	</div>
</template>

<script>
	import {updatePassword} from '../../api/user.js'
	export default{
		name: 'changePassword',
		data() {
			var validatePass = (rule, value, callback) => {
			        if (value === '') {
			          callback(new Error('请输入密码'));
			        } else {
			          if (this.ruleForm.checkPass !== '') {
			            this.$refs.ruleForm.validateField('checkPass');
			          }
			          callback();
			        }
			      };
			var validatePass2 = (rule, value, callback) => {
			  if (value === '') {
			    callback(new Error('请再次输入密码'));
			  } else if (value !== this.ruleForm.pass) {
			    callback(new Error('两次输入密码不一致!'));
			  } else {
			    callback();
			  }
			};
			return {
				updatedata: {
					userid: '',
					password: ''
				},
				ruleForm: {
				          pass: '',
				          checkPass: ''
				        },
				rules: {
				  pass: [
				    { validator: validatePass, trigger: 'blur' }
				  ],
				  checkPass: [
				    { validator: validatePass2, trigger: 'blur' }
				  ]
				}
			}
		},
		methods: {
			submitForm(formName) {
			        this.$refs[formName].validate((valid) => {
			          if (valid) {
			            this.$confirm('确定修改密码?', '提示', {
			                      confirmButtonText: '确定',
			                      cancelButtonText: '取消',
			                      type: 'warning'
			                    }).then(() => {
									if(this.$cookies.get('userid')!='' || this.$cookies.get('userid')!=null){
										this.updatedata.userid = this.$cookies.get('userid');
										 this.updatedata.password = this.ruleForm.pass;
										 updatePassword(this.updatedata).then(res=>{
											 if(res>0){
											 	this.$message.success('修改密码成功');
											 }else{
											 	this.$message.error('修改密码失败');
											 }
										 })
									}
			                    }).catch(() => {
			                      this.$message({
			                        type: 'info',
			                        message: '已取消'
			                      });          
			                    });
			          } else {
			            console.log('error submit!!');
			            return false;
			          }
			        });
			      },
			      resetForm(formName) {
			        this.$refs[formName].resetFields();
			 }
		},
	}
</script>

<style>
</style>
