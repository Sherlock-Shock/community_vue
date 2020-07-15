<template>
	<div>
		<div class="container">
			<el-form ref="cform" :model="adddata"  :rules="rules" label-width="120px">
				<el-form-item label="姓名" prop="complainter" >
					    <el-input v-model="adddata.complainter"></el-input>					    
				</el-form-item>
				<el-form-item label="房屋编号" prop="roomNo">
				    <el-input v-model="adddata.roomNo" placeholder="xx号楼xx单元xx室"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="comPhone">
					    <el-input v-model="adddata.comPhone"></el-input>					    
				</el-form-item>
				<el-form-item label="投诉内容" prop="comContent">
					    <el-input 
						type="textarea"
						:rows="3" v-model="adddata.comContent"></el-input>					    
				</el-form-item>
				<el-form-item label="">
				   <el-button type="primary" @click="saveAddRepair" >提交</el-button>
				   <el-button @click="resetForm('cform')">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import {addComplaint} from '../../../api/complaint.js'
	export default{
		name: 'usercomplaint',
		data() {
			return {
				adddata: {
					complainter: '',
					roomNo: '',
					comContent: '',
					comPhone: ''
				},
				rules: {
				         comPhone: [
				           { required: true, message: '请输入联系方式', trigger: 'blur' }				          
				         ],
				         comContent: [
				             { required: true, message: '请输入投诉内容', trigger: 'blur' }
				         ]
				       }
			}
		},
		methods: {
			saveAddRepair() {
				this.$refs.cform.validate((valid) => {
				         if (valid) {
				           this.$confirm('确定提交投诉信息?', '提示', {
				                     confirmButtonText: '确定',
				                     cancelButtonText: '取消',
				                     type: 'warning'
				                   }).then(() => {	
				                    addComplaint(this.adddata).then(res=>{
				                    	if(res>0){
				                    		this.$message.success('感谢您的反馈，我们已收到您的投诉信息');
				                    	}else{
				                    		this.$message.error('投诉失败');
				                    	}
				                    })
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
