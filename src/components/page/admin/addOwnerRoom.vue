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
			            绑定业主房屋
			        </el-breadcrumb-item>
			    </el-breadcrumb>			
		</div>
	<div class="container">
		
		<el-header> 
			<el-steps :active="active" finish-status="success">
				   <el-step title="选择楼栋"></el-step>
				   <el-step title="选择房屋"></el-step>
				   <el-step title="业主信息"></el-step>
				 </el-steps>
		</el-header>
		<el-main>
			  <div  v-show="active == 0">

			    <el-button  size="medium" type="primary" @click="selectBuilding" icon="el-icon-circle-plus">选择楼栋</el-button>	
				<div class="msg">
					<el-row>
					  <el-col :span="6"><div>已选择：</div></el-col>
					  <el-col :span="6"><div>楼ID: {{buildingmsg.buildingId}}</div></el-col>
					  <el-col :span="6"><div>楼编号: {{buildingmsg.buildingNo}}</div></el-col>
					  <el-col :span="6"><div>楼名称: {{buildingmsg.buildingName}}</div></el-col>
					</el-row>	
				</div>
				

			 	<el-dialog title="选择楼栋" :visible.sync="BuildingVisible">
			 	  <el-table :data="buildingData">
			 	    <el-table-column prop="bulidingid" label="楼栋ID" width="100" align="center"></el-table-column>
			 	    <el-table-column prop="bulidingno" label="楼栋编号"></el-table-column>
			 	    <el-table-column prop="bulidingname" label="楼栋名称"></el-table-column>
					 <el-table-column label="选择" width="180" align="center">
						<template slot-scope="scope">
						    <el-button
						        type="sucess"						        
						        @click="selectedBuilding(scope.$index, scope.row)"
						    >选择</el-button>						   
						</template> 
					 </el-table-column> 
			 	  </el-table>
				  <div class="pagination">
				      <el-pagination
				          background
				          layout="total, prev, pager, next"
				          :current-page="querydata.page"
				          :page-size="querydata.rows"
				          :total="pageTotal"
				          @current-change="handlePageChange"
				      ></el-pagination>
				  </div>
			 	</el-dialog>
			 </div>
			 
			 
			 <div  v-show="active == 1">
			 	<el-button  size="medium" type="primary" @click="selectRoom" icon="el-icon-circle-plus">选择房屋</el-button>
			 	<div class="msg">
			 		<el-row>
			 		  <el-col :span="6"><div>已选择：</div></el-col>
			 		  <el-col :span="6"><div>楼栋编号: {{roommsg.buildingNo}}</div></el-col>
			 		  <el-col :span="6"><div>单元编号: {{roommsg.unitNo}}</div></el-col>
					  <el-col :span="6"><div>房屋编号: {{roommsg.roomNo}}</div></el-col>				  
			 		</el-row>	
			 	</div>

			 
			 <el-dialog title="选择房屋" :visible.sync="RoomVisible">
			   <el-table :data="roomData">

				 <el-table-column prop="houseId" label="房屋ID"></el-table-column>
			     <el-table-column prop="bulidingNo" label="楼栋编号"></el-table-column>
				 <el-table-column prop="unitNo" label="单元编号"></el-table-column>
				 <el-table-column prop="roomNo" label="房屋编号"></el-table-column>
			 	 <el-table-column label="选择" width="180" align="center">
			 		<template slot-scope="scope">
			 		    <el-button
			 		        type="sucess"						        
			 		        @click="selectedRoom(scope.$index, scope.row)"
			 		    >选择</el-button>						   
			 		</template> 
			 	 </el-table-column> 
			   </el-table>
			   <div class="pagination">
			       <el-pagination
			           background
			           layout="total, prev, pager, next"
			           :current-page="queryroomdata.page"
			           :page-size="queryroomdata.rows"
			           :total="roomPageTotal"
			           @current-change="handleRoomPageChange"
			       ></el-pagination>
			   </div>
			 </el-dialog>
			 </div>		 
			 
			 <div  v-show="active == 2">			 	
				<el-button  size="medium" type="primary" @click="selectOwner" icon="el-icon-circle-plus">选择业主</el-button>
					<div class="msg">
						<el-row>
						  <el-col :span="3"><div>已选择：</div></el-col>
						  <el-col :span="7"><div>业主ID: {{ownermsg.ownerId}}</div></el-col>
						  <el-col :span="7"><div>业主姓名: {{ownermsg.ownerName}}</div></el-col>
						  <el-col :span="7"><div>身份证号: {{ownermsg.idCard}}</div></el-col>				  
						</el-row>	
					</div>
				
				<el-dialog title="选择业主" :visible.sync="OwnerVisible">
					<div>
					<el-input v-model="queryownerdata.ownerName" placeholder="姓名" class="handle-input mr10" style="width: 88%;margin-bottom: 12px;"></el-input>
					<el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>	
					</div>
					
				  <el-table :data="ownerData">	
					<el-table-column prop="ownerId" label="业主ID"></el-table-column>
				    <el-table-column prop="ownerName" label="业主姓名"></el-table-column>
					<el-table-column prop="idCard" label="身份证号"></el-table-column>
					<el-table-column prop="phone" label="联系电话"></el-table-column>
					 <el-table-column label="选择" width="180" align="center">
						<template slot-scope="scope">
						    <el-button
						        type="sucess"						        
						        @click="selectedOwner(scope.$index, scope.row)"
						    >选择</el-button>						   
						</template> 
					 </el-table-column> 
				  </el-table>
				  <div class="pagination">
				      <el-pagination
				          background
				          layout="total, prev, pager, next"
				          :current-page="queryownerdata.page"
				          :page-size="queryownerdata.rows"
				          :total="ownerPageTotal"
				          @current-change="handleOwnerPageChange"
				      ></el-pagination>
				  </div>
				</el-dialog>
				
				
				
			 </div>
			 
					 
		</el-main>
		
		<el-footer>
			  <el-button type="primary" style="margin-top: 12px;" @click="previous" :disabled="active==0">上一步</el-button>	
			 <el-button type="primary" style="margin-top: 12px;" @click="next" :disabled="active==2">下一步</el-button>	
			 <el-button type="primary" style="margin-top: 12px;" @click="postmsg"  v-show="active==2">确定提交</el-button>
		</el-footer>
			
			 
			 
			 
			 
			  
	</div>
	
	
	</div>
</template>

<script>
import {getBuildingData} from '../../../api/building.js'
import {getHouseData} from '../../../api/house.js'
import {getOwnerData} from '../../../api/owner.js'
import {updateHouseOwner} from '../../../api/house.js'


	export default {
	    data() {
	      return {
	        active: 0,
			isselectbuilding: false,
			BuildingVisible: false,
			RoomVisible:false,
			OwnerVisible: false,
			buildingData: [],
			roomData: [],
			ownerData: [],
			querydata: {
				page: 1,
				rows: 5
			},
			queryroomdata: {
				page: 1,
				rows: 5,
				bulidingNo: '',
				houseStatus: '闲置'
			},
			queryownerdata: {
				page: 1,
				rows: 5,
				ownerName: '',
				idCard: '',
				phone: ''
			},
			pageTotal: 0,
			roomPageTotal: 0,
			ownerPageTotal: 0,
			buildingmsg:{
				buildingId:'',
				buildingNo:'',
				buildingName:'',
			},
			roommsg:{
				houseId: '',
				buildingNo:'',
				unitNo:'',
				roomNo:'',
			},
			ownermsg:{
				ownerId:'',
				ownerName:'',
				idCard:'',
			},
			updatedata:{
				ownerId: '',
				houseId: ''
			}
	      };
	    },
		created() {
			if(this.$route.query!=''){
				this.ownermsg.ownerId = this.$route.query.ownerId;
				this.ownermsg.ownerName = this.$route.query.ownerName;
				this.ownermsg.idCard = this.$route.query.idCard;
			}
		},
	    methods: {
	      next() {
			  if(this.active==0){
				if(this.buildingmsg.buildingId==''){
				this.$confirm('请选择楼栋信息', '提示', {
				          confirmButtonText: '确定',
				          type: 'warning',
				          center: true
				        })	
				}else{
					this.active++ ; 
				}				
			  }else{
				 if(this.roommsg.roomNo==''){
				 this.$confirm('请选择房屋信息', '提示', {
				           confirmButtonText: '确定',
				           type: 'warning',
				           center: true
				         })	
				 }else{
				 	this.active++ ; 
				 }
			  }

	      },
		  previous() {
		    if (this.active-- > 2) this.active = 0;
		  },
		  selectBuilding(){
			  this.BuildingVisible = true;
			  getBuildingData(this.querydata.page,this.querydata.rows).then(res=>{
			  	this.buildingData = res.data;
			  	this.pageTotal = res.total;
			  });
		  },
		  selectedBuilding(index,row){
			  this.BuildingVisible = false;
			  this.buildingmsg.buildingId = row.bulidingid;
			  this.buildingmsg.buildingNo = row.bulidingno;
			  this.buildingmsg.buildingName = row.bulidingname;
		  },
		  selectRoom(){
		  			  this.RoomVisible = true;
					  this.queryroomdata.bulidingNo = this.buildingmsg.buildingNo;
		  			  getHouseData(this.queryroomdata).then(res=>{
		  			  	this.roomData = res.data;
		  			  	this.roomPageTotal = res.total;
		  			  });
		  },
		  selectedRoom(index,row){
		  			  this.RoomVisible = false;
					  this.roommsg.houseId = row.houseId;
		  			  this.roommsg.buildingNo = row.bulidingNo;
		  			  this.roommsg.unitNo = row.unitNo;
		  			  this.roommsg.roomNo = row.roomNo;
		  },
		  selectOwner(){
			 // alert(this.$route.query.ownerId);
		  			  this.OwnerVisible = true;
		  			  getOwnerData(this.queryownerdata).then(res=>{
		  			  	this.ownerData = res.data;
		  			  	this.ownerPageTotal = res.total;
		  			  });
		  },
		  selectedOwner(index,row){
		  			  this.OwnerVisible = false;
		  			  this.ownermsg.ownerId = row.ownerId;
		  			  this.ownermsg.ownerName = row.ownerName;
		  			  this.ownermsg.idCard = row.idCard;
		  },
		  // 触发搜索按钮
		  handleSearch() {
		      //this.$set(this.query, 'pageIndex', 1);
		  	getOwnerData(this.queryownerdata).then(res=>{
		  		console.log('前端接收的结果：'+res)
		  		this.ownerData = res.data;
		  		this.ownerPageTotal = res.total;
		  	});	
		  },
		  postmsg(){
			  this.$confirm('确认信息, 是否提交?<br/><br/>楼栋编号：'+this.buildingmsg.buildingNo+
							'<br/><br/>房屋编号：'+this.roommsg.roomNo+
							'<br/><br/>业主姓名：'+this.ownermsg.ownerName, 
					    '提示', {
			            confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning',
			            center: true,
						dangerouslyUseHTMLString: true
			          }).then(() => {
						  this.updatedata.houseId = this.roommsg.houseId;
						  this.updatedata.ownerId = this.ownermsg.ownerId;
			            updateHouseOwner(this.updatedata).then(res=>{
							if(res>0){
								this.$message.success('绑定成功');
							}else{
								this.$message.error('绑定失败');
							}
						})
			          }).catch(() => {
			            this.$message({
			              type: 'info',
			              message: '操作已取消'
			            });
			          });
		  },
		  // 楼栋分页导航
		  handlePageChange(val) {
		      this.$set(this.querydata, 'page', val);
		      getBuildingData(this.querydata.page,this.querydata.rows).then(res=>{
		      	this.buildingData = res.data;
		      	this.pageTotal = res.total;
		      });
		  },
		  // 房屋分页导航
		  handleRoomPageChange(val) {
		      this.$set(this.queryroomdata, 'page', val);
		      getHouseData(this.queryroomdata).then(res=>{
		      	this.roomData = res.data;
		      	this.roomPageTotal = res.total;
		      });
		  },
		  // 业主分页导航
		  handleOwnerPageChange(val) {
		      this.$set(this.queryownerdata, 'page', val);
		      getOwnerData(this.queryownerdata).then(res=>{
		      	this.ownerData = res.data;
		      	this.ownerPageTotal = res.total;
		      });
		  }
	    }
	  }
</script>

<style scoped="scoped">
      .el-footer {
	    text-align: right;
	    line-height: 60px;
	  }	  
	  
	  .el-main {

	  }
	  .msg{
		  margin-top: 40px;
		  margin-bottom: 40px;
		  font-size: 20px;
		  color: red;
	  }

</style>
