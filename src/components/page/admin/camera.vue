<template>
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
			<!--开启摄像头-->
			<el-button  icon="el-icon-camera" @click="callCamera">点击拍照</el-button>
			<el-button @click="handleUpdata">上传</el-button>
			<el-button @click="testimg">测试</el-button>
			
			<br />
			
			<img src="http://localhost:8888/ownerphoto/111.jpg" style="width: 192px; height: 240px;display:none"  id='myphoto' />
		</div>
       
    </div>
</template>   
<script>
	
import {uploadOwnerPhoto} from '../../../api/owner.js'
	
export default {
	name: 'Camera',
  data () {
    return {
	  centerDialogVisible: false,
	  imgSrc : '',
	  isshow: true,
	  url: "http://localhost:8888/ownerphoto/default.jpg",
	  ownerId: ""
    }
  },
  props: ['imgurl'],
  created() {
  	//alert(this.imgurl)
	if(this.imgurl!=''){
	this.url = this.imgurl	
	}	
  },
  methods: {
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
	           let name = time + ".jpg"; // 定义文件名字（例如：abc.png ， cover.png）	 
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
	         }	 
	},
	testimg(){	
		this.url = this.imgurl;
			//alert(this.imgurl)
		let ctx = this.$refs['canvasimg'].getContext('2d');
		var img = new Image();
		img.src = "http://localhost:8888/ownerphoto/111.jpg";
		// 等待加载完成再绘制
		img.onload = function(){
		   ctx.drawImage(img, 0,0,192,240);
		}
		console.log("path is "+img.src)

		//let ctx = this.$refs['canvas'].getContext('2d');
		//var img = document.getElementById("myphoto");
		//ctx.drawImage(img,500,500);
		//console.log(img)
	}


		
		
    
  }
}
</script>

<style>
	.photo{
		text-align: center;
		margin-top: 80px;
	}
</style>