<template>
	<div>
		<div class="container">
			<el-container>
			    <el-aside width="200px">
					<el-image
						:lazy='true'
						style="width: 192px; height: 240px"
						:src="url"
					></el-image>
				</el-aside>
			    <el-main style="font-size: 20px;">
					<el-row>
					  <el-col :span="8">姓名：{{showdata.ownerName}}</el-col>
					  <el-col :span="8">性别：{{showdata.sex}}</el-col>
					  <el-col :span="8">身份证号：{{showdata.idCard}}</el-col>
					</el-row>
					<br /><br /><br />
					<el-row>
					  <el-col :span="8">联系电话：{{showdata.phone}}</el-col>
					  <el-col :span="8">邮箱：{{showdata.email}}</el-col>
					  <el-col :span="8">籍贯：{{showdata.address}}</el-col>
					</el-row>
				</el-main>
			</el-container>
		</div>
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
		       
		      </el-table-column>
		  </el-table>
		</el-card>
		
	</div>
</template>

<script>
	import {getOwnerMsgByPhone} from '../../../api/owner.js'
	import {getOwnerAllHouse} from '../../../api/owner.js'
	import {getOwnerAllParking} from '../../../api/owner.js'
	
	export default{
		name: 'baseMessage',
		data() {
			return {
				querydata: {
					phone: ''
				},
				showdata:{
					ownerName: '',
					sex: '',
					idCard: '',
					phone: '',
					photo: '',
					email: '',
					address: ''
				},
				ownerId: '',
				houseData: [],
				parkingData: [],
				url: "http://120.79.205.41:9002/ownerphotos/default.jpg"
			}
		},
		created() {
			getOwnerMsgByPhone(this.$cookies.get('userid')).then(res=>{
				this.showdata = res.data
				this.url = "http://120.79.205.41:9002/ownerphotos/"+res.data.photo
				
				getOwnerAllHouse(res.data.ownerId).then(res=>{
					this.houseData = res.data
				})
				getOwnerAllParking(res.data.ownerId).then(res=>{
					this.parkingData = res.data
				})
			})	
			
		},
		methods: {
			
		},
	}
</script>

<style>
</style>
