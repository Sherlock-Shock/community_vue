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
			            绑定业主车位
			        </el-breadcrumb-item>
			    </el-breadcrumb>			
		</div>
	<div class="container">
		
		<el-header> 
			<el-steps :active="active" finish-status="success">
				   <el-step title="选择停车场"></el-step>
				   <el-step title="选择车位"></el-step>
				   <el-step title="业主信息"></el-step>
				 </el-steps>
		</el-header>
		<el-main>
			  <div  v-show="active == 0">

			    <el-button  size="medium" type="primary" @click="selectePArea" icon="el-icon-circle-plus">选择停车场</el-button>	
				<div class="msg">
					<el-row>
					  <el-col :span="6"><div>已选择：</div></el-col>
					  <el-col :span="6"><div>停车场ID: {{pareamsg.parkingAreaId}}</div></el-col>
					  <el-col :span="6"><div>停车场编号: {{pareamsg.parkingAreaNo}}</div></el-col>
					  <el-col :span="6"><div>停车场类型: {{pareamsg.parkingType}}</div></el-col>
					</el-row>	
				</div>
				

			 	<el-dialog title="选择停车场" :visible.sync="PAreaVisible">
			 	  <el-table :data="pareaData">
			 	    <el-table-column prop="parkingAreaId" label="停车场ID" width="100" align="center"></el-table-column>
			 	    <el-table-column prop="parkingAreaNo" label="停车场编号"></el-table-column>
			 	    <el-table-column prop="parkingType" label="停车场类型"></el-table-column>
					 <el-table-column label="选择" width="180" align="center">
						<template slot-scope="scope">
						    <el-button
						        type="sucess"						        
						        @click="selectedPArea(scope.$index, scope.row)"
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
			 	<el-button  size="medium" type="primary" @click="selectParking" icon="el-icon-circle-plus">选择车位</el-button>
			 	<div class="msg">
			 		<el-row>
			 		  <el-col :span="6"><div>已选择：</div></el-col>
			 		  <el-col :span="6"><div>车位ID: {{parkingmsg.parkId}}</div></el-col>
			 		  <el-col :span="6"><div>车位编号: {{parkingmsg.parkingNo}}</div></el-col>
					  <el-col :span="6"><div>面积: {{parkingmsg.parkingAreal}}</div></el-col>				  
			 		</el-row>	
			 	</div>

			 
			 <el-dialog title="选择车位" :visible.sync="ParkingVisible">
			   <el-table :data="parkingData">

				 <el-table-column prop="parkId" label="车位ID"></el-table-column>
			     <el-table-column prop="parkingNo" label="车位编号"></el-table-column>
				 <el-table-column prop="parkingAreal" label="车位面积"></el-table-column>
			 	 <el-table-column label="选择" width="180" align="center">
			 		<template slot-scope="scope">
			 		    <el-button
			 		        type="sucess"						        
			 		        @click="selectedParking(scope.$index, scope.row)"
			 		    >选择</el-button>						   
			 		</template> 
			 	 </el-table-column> 
			   </el-table>
			   <div class="pagination">
			       <el-pagination
			           background
			           layout="total, prev, pager, next"
			           :current-page="queryparkingdata.page"
			           :page-size="queryparkingdata.rows"
			           :total="parkingPageTotal"
			           @current-change="handleParkingPageChange"
			       ></el-pagination>
			   </div>
			 </el-dialog>
			 </div>		 
			 
			 <div  v-show="active == 2">			 	
				<el-button  size="medium" type="primary" @click="selectOwner" icon="el-icon-circle-plus">选择业主</el-button>
					<div class="msg">
						<el-row>
						  <el-col :span="6"><div>已选择：</div></el-col>
						  <el-col :span="6"><div>业主ID: {{ownermsg.ownerId}}</div></el-col>
						  <el-col :span="6"><div>业主姓名: {{ownermsg.ownerName}}</div></el-col>
						  <el-col :span="6"><div>身份证号: {{ownermsg.idCard}}</div></el-col>				  
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
								
				<el-dialog
				  title="确认信息"
				  :visible.sync="postVisible"
				  width="30%"
				  center>
				  <el-form ref="form" :model="updatedata" label-width="110px">
					 <el-form-item label="停车场编号">
					   <span>{{pareamsg.parkingAreaNo}}</span>
					 </el-form-item>	 
				    <el-form-item label="车位编号">
				      <span>{{parkingmsg.parkingNo}}</span>
				    </el-form-item>
					<el-form-item label="业主姓名">
					  <span>{{ownermsg.ownerName}}</span>
					</el-form-item>
					<el-form-item label="绑定类型">
					  <el-select v-model="updatedata.type" placeholder="请选择绑定类型">
					      <el-option
					        v-for="item in options"
					        :key="item.value"
					        :label="item.label"
					        :value="item.value">
					      </el-option>
					    </el-select>
					</el-form-item>
					<el-form-item label="月份" v-if="updatedata.type=='1'">
					  <el-input v-model="updatedata.month"></el-input>
					</el-form-item>				
				  </el-form>				  
				  <span slot="footer" class="dialog-footer">
				    <el-button @click="postVisible = false">取 消</el-button>
				    <el-button type="primary" @click="handlePost">确 定</el-button>
				  </span>
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
import {getParkingAreaData} from '../../../api/parkingLot.js'
import {getParkingFree} from '../../../api/parking.js'
import {getOwnerData} from '../../../api/owner.js'
import {updateParkingOwnerBind} from '../../../api/parking.js'



	export default {
	    data() {
	      return {
	        active: 0,
			OwnerVisible: false,
			PAreaVisible: false,
			ParkingVisible: false,
			postVisible: false,
			pareaData: [],
			parkingData: [],
			ownerData: [],
			options: [{
			          value: '1',
			          label: '出租'
			        }, {
			          value: '2',
			          label: '出售'
			        }],
			querydata: {
				page: 1,
				rows: 5
			},
			queryparkingdata: {
				page: 1,
				rows: 5,
				parkingAreaId: '',
			},
			queryownerdata: {
				page: 1,
				rows: 5,
				ownerName: '',
				idCard: '',
				phone: ''
			},
			pageTotal: 0,
			parkingPageTotal: 0,
			ownerPageTotal: 0,
			pareamsg:{
				parkingAreaId: '',
				parkingAreaNo: '',
				parkingType: ''
			},
			parkingmsg:{
				parkId: '',
				parkingNo:'',
				parkingAreal:''
			},
			ownermsg:{
				ownerId:'',
				ownerName:'',
				idCard:'',
			},
			updatedata:{
				ownerId: '',
				parkId: '',
				month: '',
				type: ''
				
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
				if(this.pareamsg.parkingAreaId==''){
				this.$confirm('请选择停车场信息', '提示', {
				          confirmButtonText: '确定',
				          type: 'warning',
				          center: true
				        })	
				}else{
					this.active++ ; 
				}				
			  }else{
				 if(this.parkingmsg.parkId==''){
				 this.$confirm('请选择车位信息', '提示', {
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
		  selectePArea(){
			  this.PAreaVisible = true;
			  getParkingAreaData(this.querydata).then(res=>{
			  	this.pareaData = res.data;
			  	this.pageTotal = res.total;
			  });
		  },
		  selectedPArea(index,row){
			  this.PAreaVisible = false;
			  this.pareamsg.parkingAreaId = row.parkingAreaId;
			  this.pareamsg.parkingAreaNo = row.parkingAreaNo;
			  this.pareamsg.parkingType = row.parkingType;
		  },
		  selectParking(){
		  			  this.ParkingVisible = true;
					  this.queryparkingdata.parkingAreaId = this.pareamsg.parkingAreaId;
		  			  getParkingFree(this.queryparkingdata).then(res=>{
		  			  	this.parkingData = res.data;
		  			  	this.parkingPageTotal = res.total;
		  			  });
		  },
		  selectedParking(index,row){
		  			  this.ParkingVisible = false;
					  this.parkingmsg.parkId = row.parkId;
		  			  this.parkingmsg.parkingNo = row.parkingNo;
		  			  this.parkingmsg.parkingAreal = row.parkingAreal;
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
			  this.postVisible =true		
		  },
		  handlePost(){
			  if(this.updatedata.type=='1'&&this.updatedata.month==''){
				  this.$message.error('请输入月份数');
			  }else if(this.updatedata.type==''){
				   this.$message.error('请选择绑定类型');
			  }else{  
				  this.updatedata.parkId=this.parkingmsg.parkId;
				  this.updatedata.ownerId = this.ownermsg.ownerId;
				  updateParkingOwnerBind(this.updatedata).then(res=>{
					  if(res>0){
						  this.$message.success('绑定成功');
						  this.postVisible = false;
					  }else{
						  this.$message.error('绑定失败'); 
					  }
				  })
			  }
 
		  },
		  // 停车场分页导航
		  handlePageChange(val) {
		      this.$set(this.querydata, 'page', val);
		      getParkingAreaData(this.querydata).then(res=>{
		      	this.pareaData = res.data;
		      	this.pageTotal = res.total;
		      });
		  },
		  // 车位分页导航
		  handleParkingPageChange(val) {
		      this.$set(this.queryparkingdata, 'page', val);
		      getParkingFree(this.queryparkingdata).then(res=>{
		      	this.parkingData = res.data;
		      	this.parkingPageTotal = res.total;
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

<style>
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
