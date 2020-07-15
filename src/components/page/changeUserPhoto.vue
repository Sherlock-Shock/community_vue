<template>
	<div class="container">
		<el-upload
		  class="avatar-uploader"
		  action="http://127.0.0.1:9002/uploadUserPhoto/"
		  :headers="headers"
		  :show-file-list="false"
		  :on-success="handleAvatarSuccess"
		  :before-upload="beforeAvatarUpload">
		  <img v-if="imageUrl" :src="imageUrl" class="avatar">
		  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
		</el-upload>
		<br />
		<div>点击图片即可上传，图片格式为jpg，大小不能超过2m</div>
	</div>
</template>

<script>
	import {uploadUserPhoto} from '../../api/user.js'
	export default{
		name: 'changeUserPhoto',
		data() {
		      return {
		        imageUrl: 'http://localhost:9002/userphotos/'+this.$cookies.get('userid')+'.jpg',
				headers: {
				  Authorization : 'Bearer '+this.$cookies.get('token')  
				}
		      };
		    },
		    methods: {		  
		      handleAvatarSuccess(res, file) {
				  if(res>0){
					  this.$message.success('上传成功');
				  }else{
					  this.$message.error('上传失败');
				  }				 
		        this.imageUrl = URL.createObjectURL(file.raw);
		      },
		      beforeAvatarUpload(file) {
		        const isJPG = file.type === 'image/jpeg';
		        const isLt2M = file.size / 1024 / 1024 < 2;
		
		        if (!isJPG) {
		          this.$message.error('上传头像图片只能是 JPG 格式!');
		        }
		        if (!isLt2M) {
		          this.$message.error('上传头像图片大小不能超过 2MB!');
		        }
		        return isJPG && isLt2M;
		      }
		    }
	}
</script>

<style>
	  .avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	  }
	  .avatar-uploader .el-upload:hover {
	    border-color: #409EFF;
	  }
	  .avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 178px;
	    height: 178px;
	    line-height: 178px;
	    text-align: center;
	  }
	  .avatar {
	    width: 178px;
	    height: 178px;
	    display: block;
	  }
</style>
