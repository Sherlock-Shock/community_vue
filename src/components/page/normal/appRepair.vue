<template>
	<div>	
			  <div class="container" >
				  <el-form ref="repairForm" :model="adddata" :rules="rules" label-width="120px">				  	
				  	<el-form-item label="房屋编号" prop="roomNo">
				  	    <el-input v-model="adddata.roomNo" placeholder="xx号楼xx单元xx室"></el-input>
				  	</el-form-item>
				  	<el-form-item label="预约时间" prop="appTime">
				  	    <div class="block">
				  	        <el-date-picker
				  	          v-model="adddata.appTime"
				  	          type="datetime"
				  	    	  value-format="yyyy-MM-dd HH:mm:ss"
				  	          placeholder="选择预约时间">
				  	        </el-date-picker>
				  	      </div>
				  	</el-form-item>
				  	<el-form-item label="联系电话" prop="phone">
				  	    <el-input v-model="adddata.phone"></el-input>
				  	</el-form-item>
				  	<el-form-item label="报修事项" prop="reason">
				  	   <el-input type="textarea"
				  	   	:rows="3" v-model="adddata.reason"></el-input>
				  	</el-form-item>
					<el-form-item label="">
					   <el-button type="primary" @click="saveAddRepair" >提交</el-button>
					   <el-button @click="resetForm('repairForm')">重置</el-button>
					</el-form-item>
				    </el-form>
				  	
			  </div>			  
	</div>
</template>

<script>
	import {addRepair} from '../../../api/repair.js'
	import {getOwnerIdByPhone} from '../../../api/owner.js'
	
	export default{
		name: 'appRepair',
		data() {
			return {
				adddata: {
					ownerId: '',
					roomNo: '',
					appTime: '',
					phone: '',
					reason: ''
				},
				 rules: {
				          roomNo: [
				            { required: true, message: '请输入具体房屋编号', trigger: 'blur' }				          
				          ],
				          phone: [
				              { required: true, message: '请输入联系电话', trigger: 'blur' }
				          ],
				          reason: [
				             { required: true, message: '请输入报修事项', trigger: 'blur' }	
				          ],
				          appTime: [
				            {  required: true, message: '请选择预约时间', trigger: 'change' }
				          ]
				        }
				
			}
		},
		created(){
			getOwnerIdByPhone(this.$cookies.get('userid')).then(res=>{
				this.adddata.ownerId = res.data
			})	
			
		},
		methods: {
			saveAddRepair() {
				 this.$refs.repairForm.validate((valid) => {
				          if (valid) {
				            this.$confirm('确定提交报修信息?', '提示', {
				                      confirmButtonText: '确定',
				                      cancelButtonText: '取消',
				                      type: 'warning'
				                    }).then(() => {	
				                     addRepair(this.adddata).then(res=>{
				                     	if(res>0){
				                     		this.$message.success('报修成功');
				                     	}else{
				                     		this.$message.error('报修失败');
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
