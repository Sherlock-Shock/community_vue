<template>
	<div>
		<div class="container" style="margin-bottom: 10px;">
			    <el-breadcrumb separator="/" style="font-size: 20px;">
					<el-breadcrumb-item :to="{ path: '/adminindex' }">
					   首页
					</el-breadcrumb-item>
					<el-breadcrumb-item>
					    业主管理
					</el-breadcrumb-item>
			        <el-breadcrumb-item>
			            业主详情
			        </el-breadcrumb-item>
			    </el-breadcrumb>			
		</div>
		<el-card>
			<el-row >
			  <el-col :span="10" style="text-align: center;">
				<div>
					<el-dialog
					  title="拍照"
					  :visible.sync="centerDialogVisible"
					  width="46%"
					  center
					  style="text-align: center;">
					 
					 <!--图片展示-->
					 <video ref="video" width="640" height="480" autoplay></video>
					 
					  <span slot="footer" class="dialog-footer">
					    <el-button @click="handlecancel">取 消</el-button>
					    <el-button type="primary" @click="takePhoto">确 定</el-button>
					  </span>
					</el-dialog>
					
					<div class="photo">
						<!--canvas截取流-->
						<el-image
							v-if="isshow"
						      style="width: 192px; height: 240px"
						      :src="url"
						      ></el-image>
						<canvas v-else ref="canvas" width="192" height="240"></canvas>
						<br />
						<br />
						<!--开启摄像头-->
						<el-button  icon="el-icon-camera" @click="callCamera">点击拍照</el-button>
						<el-button @click="handleUpdata">上传</el-button>
																		
					</div>
				   
				</div>				 
			  </el-col>
			  <el-col :span="14">
					<el-form label-position="top" label-width="80px" :model="ownermsg" :rules="rules" ref="ownermsg">
					  <el-form-item label="姓名" prop="ownerName">
					    <el-input v-model="ownermsg.ownerName"></el-input>
					  </el-form-item>
					  <el-form-item label="性别" prop="sex" >
					     <el-select v-model="ownermsg.sex" placeholder="请选择">
					         <el-option				        
					           label="男"
					           value="男">
					         </el-option>
					  	   <el-option
					  	     label="女"
					  	     value="女">
					  	   </el-option>
					       </el-select>
					  </el-form-item>
					  <el-form-item label="身份证号" prop="idCard">
					    <el-input v-model="ownermsg.idCard"></el-input>
					  </el-form-item>
					  <el-form-item label="籍贯" >
					    <el-input v-model="ownermsg.address"></el-input>
					  </el-form-item>
					  <el-form-item label="联系电话" prop="phone">
					    <el-input v-model="ownermsg.phone"></el-input>
					  </el-form-item>
					  <el-form-item label="邮箱" prop="email">
					    <el-input v-model="ownermsg.email"></el-input>
					  </el-form-item>					  
					</el-form>
					<div style="float: right;display: flex;">
						<el-button type="danger" size="medium"  @click="resetPassword">重置密码</el-button>
						<el-button type="primary" size="medium" @click="updateOwner">保存</el-button>
					</div>
					
			  </el-col>	
			</el-row>
		</el-card>
		
		<el-card class="propertyCard" shadow="hover">
		  <div slot="header" class="clearfix">
		    <span>房产信息</span>
		  </div>
		  <el-table
		      :data="houseData"  
		  >
		      <el-table-column prop="houseId" label="房屋ID" width="100" ></el-table-column>
		  	<el-table-column prop="bulidingNo" label="楼栋编号"></el-table-column>
		  	<el-table-column prop="unitNo" label="单元编号"></el-table-column>
		  	<el-table-column prop="roomNo" label="房屋编号"></el-table-column>
		      <el-table-column prop="houseStatus" label="房屋状态"></el-table-column>
		  	<el-table-column prop="houseAreal" label="面积"></el-table-column>
		  	<el-table-column prop="rate" label="单价"></el-table-column>
		             
		      <el-table-column label="操作" width="180" align="center">
		          <template slot-scope="scope">					  
		             <el-button
						 type="warning"
		                 @click="deleteHouse(scope.$index, scope.row)"
		             >解绑</el-button>		             
		          </template>
		      </el-table-column>
		  </el-table>
		</el-card>
		
		<el-card class="propertyCard" shadow="hover">
		  <div slot="header" class="clearfix">
		    <span>车位信息</span>
		  </div>
		  <el-table
		      :data="parkingData"  
		  >
		      <el-table-column prop="parkId" label="车位ID" width="100" align="center" sortable></el-table-column>
		      <el-table-column prop="parkingAreaNo" label="停车场编号"></el-table-column>
		      <el-table-column prop="parkingNo" label="车位编号"></el-table-column>
		      <el-table-column prop="parkStatus" label="车位状态" ></el-table-column>
		      <el-table-column prop="parkingAreal" label="面积" ></el-table-column>	
			  <el-table-column prop="overTime" label="过期时间" ></el-table-column>					   
		      <el-table-column label="操作" width="180" align="center">
		          <template slot-scope="scope">
		             <el-button
					  type="warning"
		                 @click="deleteParking(scope.$index, scope.row)"
		             >解绑</el-button>		             
		          </template>
		      </el-table-column>
		  </el-table>
		</el-card>
				
	</div>
</template>

<script>
	import camera from 'components/page/admin/camera.vue'
	
	import {uploadOwnerPhoto} from '../../../api/owner.js'
	import {getOwnerById} from '../../../api/owner.js'
	import {updateOwner} from '../../../api/owner.js'
	import {getOwnerAllHouse} from '../../../api/owner.js'
	import {getOwnerAllParking} from '../../../api/owner.js'
	import {dropParking} from '../../../api/owner.js'
	import {dropHouse} from '../../../api/owner.js'
	import {resetOwnerPassword} from '../../../api/owner.js'
	
	
    export default{
		name: 'ownerDetail',
		data() {
			return {
				centerDialogVisible: false,
				imgSrc : '',
				isshow: true,
				url: "http://120.79.205.41:9002/ownerphoto/default.jpg",
				ownermsg: {
					ownerId: '',
				    ownerName: '',
				    sex: '',
				    idCard: '',
					phone: '',
					address: '',
					email: '',
					photo: ''
				    },
				rules:{
					"ownerName" : [
					       { required: true, message: '请输入姓名', trigger: 'blur' },
					      ],
					"sex" : [
					       { required: true, message: '请选择性别', trigger: 'change' },
					      ],
					"idCard" : [
					       { required: true, message: '请输入身份证号', trigger: 'blur' },
						   { min: 18, max: 18, message: '请输入正确的身份证号', trigger: 'blur' }
					      ],
					"phone" : [
					       { required: true, message: '请输入联系电话', trigger: 'blur' },
						   { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' }
					      ],
					"email" : [
							 { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
						  ]
											
				},
				houseData: [],
				parkingData: []
			}
		},
		components:{
			Camera: camera
		},
		created(){
			this.getOwnerMsg()
		},methods: {
			getOwnerMsg(){
				getOwnerById(this.$route.query.ownerId).then(res=>{
					this.ownermsg = res
					if(res.photo!=''){
						this.url = res.photo	
					}
				})
				getOwnerAllHouse(this.$route.query.ownerId).then(res=>{
					this.houseData = res.data
				})
				getOwnerAllParking(this.$route.query.ownerId).then(res=>{
					this.parkingData = res.data
				})
			},
			deleteParking(index,row){
			   this.$confirm('此操作将解绑车位, 是否继续?', '提示', {
			     confirmButtonText: '确定',
			     cancelButtonText: '取消',
			     type: 'warning'
			   }).then(() => {
					dropParking(row.parkId).then(res=>{
						if(res>0){
							this.$notify({
							          title: '成功',
							          message: '成功解绑',
							          type: 'success'
							        });
						}else{
							this.$notify.error({
							          title: '失败',
							          message: '解绑失败'
							        });
						}
					})
			   }).catch(() => {
			     this.$message({
			       type: 'info',
			       message: '已取消解绑'
			     });          
			   })					
			},
			deleteHouse(index,row){
				this.$confirm('此操作将解绑房屋, 是否继续?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
					dropHouse(row.houseId).then(res=>{
						if(res>0){
							this.$notify({
							          title: '成功',
							          message: '成功解绑',
							          type: 'success'
							        });
						}else{
							this.$notify.error({
							          title: '失败',
							          message: '解绑失败'
							        });
						}
					})
				}).catch(() => {
				  this.$message({
				    type: 'info',
				    message: '已取消解绑'
				  });          
				})	
			},
			resetPassword(){
				if(this.$route.query.ownerId!='')
				{
					resetOwnerPassword(this.$route.query.ownerId).then(res=>{
						if(res>0){
							this.$message.success('密码已重置');
						}else{
							this.$message.error('重置失败');
						}
					})
				}		
			},
			updateOwner(){
				this.$refs.ownermsg.validate((valid) => {
				         if (valid) {
				          this.$confirm('是否保存修改?', '提示', {
				                   confirmButtonText: '保存',
				                   cancelButtonText: '取消',
				                   type: 'warning',
				                   center: true
				                 }).then(() => {
				                  updateOwner(this.ownermsg).then(res=>{
				                  	if(res>0){
				                  		this.$message.success('业主信息已更新');
				                  		this.getOwnerMsg()
				                  	}else{
				                  		this.$message.error('更新失败');
				                  	}
				                  })
				                 }).catch(() => {
				                   this.$message({
				                     type: 'info',
				                     message: '操作已取消'
				                   });
				                 });
				         } else {
				           console.log('error submit!!');
				           return false;
				         }
				       });
			},
		// 调用摄像头
		    callCamera () {	
			this.isshow = false;
			this.centerDialogVisible = true;
		      // H5调用电脑摄像头API
		      navigator.mediaDevices.getUserMedia({
		        video: true
		      }).then(success => {
		        // 摄像头开启成功
		        this.$refs['video'].srcObject = success
		        // 实时拍照效果
		        this.$refs['video'].play()
		      }).catch(error => {
		        console.error('摄像头开启失败，请检查摄像头是否可用！')
				 console.error(error)
		      })
		    },
			// 关闭摄像头
			closeCamera () {
			  if (!this.$refs['video'].srcObject) return
			  let stream = this.$refs['video'].srcObject
			  stream.getTracks()[0].stop()  
			  this.$refs['video'].srcObject = null
			},
		    // 拍照
		    photograph () {
			 
		      let ctx = this.$refs['canvas'].getContext('2d')
		      // 把当前视频帧内容渲染到canvas上
		      ctx.drawImage(this.$refs['video'], 128, 0, 384, 480,0,0,192,240)
		      // 转base64格式、图片格式转换、图片质量压缩
		      let imgBase64 = this.$refs['canvas'].toDataURL('image/jpeg', 0.7)
		      this.imgSrc = this.$refs['canvas'].toDataURL('image/jpeg', 0.7)
		　　　 // 由字节转换为KB 判断大小
		      let str = imgBase64.replace('data:image/jpeg;base64,', '')
		      let strLength = str.length
		      let fileLength = parseInt(strLength - (strLength / 8) * 2)
		　　　 // 图片尺寸  用于判断
		      let size = (fileLength / 1024).toFixed(2)
		      console.log(size)
			
		 　　  // 上传拍照信息  调用接口上传图片 .........
		
		      // 保存到本地
		      // let ADOM = document.createElement('a')
		      // ADOM.href = this.headImgSrc
		      // ADOM.download = new Date().getTime() + '.jpeg'
		      // ADOM.click()
		    },
			takePhoto(){
				this.photograph();
				this.closeCamera();
				this.centerDialogVisible = false;
			},
			handlecancel(){
				this.closeCamera();
				this.centerDialogVisible = false;
				this.isshow = true;
			},
			//base64转文件流
			dataURLtoFile (dataurl, filename) {	
			        var arr = dataurl.split(',');	
			        var mime = arr[0].match(/:(.*?);/)[1];	
			        var bstr = atob(arr[1]);	
			        var n = bstr.length;	
			        var u8arr = new Uint8Array(n);	
			        while (n--) {	
			          u8arr[n] = bstr.charCodeAt(n)	
			        }	
			        return new File([u8arr], filename, { type: mime })	
			}, 
			 handleUpdata(){//已form提交	 
			         if (this.imgSrc!==''){	 
			           let file = this.imgSrc; // 把整个base64给file	 
			           let type = "image/jpeg"; // 定义图片类型（canvas转的图片一般都是png，也可以指定其他类型）	 
			           let time=(new Date()).valueOf();//生成时间戳	 
			           let name = this.ownermsg.ownerId + ".jpg"; // 定义文件名字（例如：abc.png ， cover.png）							
			           let conversions = this.dataURLtoFile(file, name); // 调用base64转图片方法	 
			           let parms=new FormData();	 
			           parms.append('file',conversions);	 
			           //let url='http://localhost:8080/uploadOwnerPhoto';//你的接口	 
			           uploadOwnerPhoto(parms).then(res=>{	 
						   if(res=='1'){
							   this.$message.success('上传成功')
						   }else{
							   this.$message.error('上传失败')
						   }	 
			             console.log(res);	 
			            // this.ImgFile=res.data;	 
			           }).catch(err=>{	 
			             this.$message.error({	 
			               title: '上传失败',	 
			               message: err.msg	 
			             });	 
			           })	 
			         }else{
						 this.$message.warning('请先拍照')
					 }	 
			}
		}
	}
</script>

<style>
	.photo{
		text-align: center;
		margin-top: 80px;
	}
	.propertyCard{
		margin-top: 30px;
		margin-bottom: 20px;
	}
</style>
