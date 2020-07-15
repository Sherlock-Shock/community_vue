<template>
	<div>
		<div class="container" style="margin-bottom: 10px;">
			    <el-breadcrumb separator="/" style="font-size: 20px;">
					<el-breadcrumb-item :to="{ path: '/adminindex' }">
					   首页
					</el-breadcrumb-item>
					<el-breadcrumb-item>
					    收费管理
					</el-breadcrumb-item>
			        <el-breadcrumb-item>
			            车位收费
			        </el-breadcrumb-item>
			    </el-breadcrumb>			
		</div>
		<div class="container">
			<div class="handle-box">
							 查询：
			    <el-input v-model="querydata.parkingNo" placeholder="车位编号" class="handle-input mr10"></el-input>
				<el-input v-model="querydata.ownerName" placeholder="业主名称" class="handle-input mr10"></el-input>
			    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>	
				<el-button type="primary" icon="el-icon-plus" @click="addTempParking">创建临时停车费用</el-button>
			</div>
			<el-table
				v-loading="loading"
			    :data="tableData"
			    stripe
			    class="table"
			    ref="multipleTable"
			    header-cell-class-name="table-header"
			>
			    <el-table-column prop="parkId" label="车位ID" width="100" ></el-table-column>
				<el-table-column prop="parkingNo" :formatter="numFormatter" label="车位编号"></el-table-column>
			    <el-table-column prop="ownerId" label="业主ID"></el-table-column>
				<el-table-column prop="ownerName" label="业主姓名"></el-table-column>
							<el-table-column prop="idCard" label="业主身份证"></el-table-column>								
			    <el-table-column label="操作" width="250" align="center">
			        <template slot-scope="scope">
			           <el-button
									size="mini"
			               @click="addPayment(scope.$index, scope.row)"
			           >创建收费</el-button>			            
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
			
			<!-- 创建收费-->
			<el-dialog title="创建收费" :visible.sync="addVisible" width="30%">
							 <el-dialog
							       width="70%"
							       title="选择收费项"
							       :visible.sync="innerVisible"
							       append-to-body>
								   <div class="handle-box">
								       <el-input v-model="querypidata.payItemName" placeholder="费用项名称" class="handle-input mr10"></el-input>
								       <el-button type="primary" icon="el-icon-search" @click="handleItemSearch">搜索</el-button>
								   </div>
								   <el-table
								   v-loading="innerloading"
								       :data="itemData"
								       stripe
								       class="table"
								       ref="multipleTable"				
								       header-cell-class-name="table-header"
								   >
								    <el-table-column prop="payItemId" label="费用项ID" width="150" align="center"></el-table-column>
								    <el-table-column prop="payItemType" label="费用项类型"></el-table-column>
								   	<el-table-column prop="payItemName" label="费用项名称" width="100"></el-table-column>
								   	<el-table-column prop="payItemPeriod" label="费用项标识" width="100"></el-table-column>
								   	<el-table-column prop="beginTime" label="开始时间"></el-table-column>
								   	<el-table-column prop="overTime" label="结束时间"></el-table-column>
								   	<el-table-column prop="charStandard" label="单价" width="70"></el-table-column>
								   	<el-table-column prop="charOnce" label="附加/固定费用" width="110" align="center"></el-table-column>
								   	
								   	<el-table-column label="操作" width="100" align="center">
								   	    <template slot-scope="scope">
								   			<el-button
								   			    @click="selectPayItem(scope.$index, scope.row)"
								   			>选择</el-button>			        
								   	    </template>
								   	</el-table-column>								
								   </el-table>
								   <div class="pagination">
								       <el-pagination
								           background
								           layout="total, prev, pager, next"
								           :current-page="querypidata.page"
								           :page-size="querypidata.rows"
								           :total="itemPageTotal"
								           @current-change="handleItemPageChange"
								       ></el-pagination>
								   </div>
								   
							 </el-dialog>
			    <el-form ref="form" :model="adddata" label-width="120px">
								 <el-form-item label="车位编号">
									 <span>{{showdata.parkingNo}}</span>
								 </el-form-item>
								 <el-form-item label="业主姓名">
									 <span>{{showdata.ownerName}}</span>
								 </el-form-item>
			        <el-form-item label="收费项目"> 
									 <el-tooltip class="item" effect="light" content="计算公式:面积*单价+附加/固定费" placement="right">
								       <span>{{ showdata.payItemName}}</span>
								     </el-tooltip>
									  <el-button style="float: right;" type="primary"  icon="el-icon-circle-plus-outline" @click="handleSelectItem">选择</el-button>							
			        </el-form-item>
					<el-form-item label="应付金额">
									<span><strong style="color: red;font-size: 20px;">¥{{adddata.payable}}</strong></span>
					</el-form-item>	 		
			    </el-form>
			    <span slot="footer" class="dialog-footer">
			        <el-button @click="addVisible = false">取 消</el-button>
			        <el-button type="primary" @click="saveAddPayMent">确 定</el-button>
			    </span>
			</el-dialog>
			
			<!-- 创建临时停车收费-->
			<el-dialog title="创建临时停车收费" :visible.sync="addTempVisible" width="30%">
							 <el-dialog
							       width="70%"
							       title="选择进出场ID"
							       :visible.sync="innerTempVisible"
							       append-to-body>
							 			  <div class="handle-box">					 			  	
							 			      <el-input v-model="querytempdata.licenseNo" placeholder="车牌号" class="handle-input mr10"></el-input>
							 			      <el-input v-model="querytempdata.parkingAreaNo" placeholder="停车场编号" class="handle-input mr10"></el-input>
							 			      <el-button type="primary" icon="el-icon-search" @click="handleTempSearch">搜索</el-button>
							 			  </div>
							 			  <el-table
							 			      :data="tempData"
							 			      border
							 			      class="table"
							 			      ref="multipleTable"
							 			      header-cell-class-name="table-header"
							 			  >
							 			      <el-table-column prop="parkRecordId" label="进出场ID" width="150" align="center"></el-table-column>
							 			      <el-table-column prop="licenseNo" label="车牌号"></el-table-column>
							 			  	<el-table-column prop="parkingAreaId" label="停车场ID" width="100"></el-table-column>
							 			  	<el-table-column prop="parkingAreaNo" label="停车场编号" width="100"></el-table-column>
							 			  	<el-table-column prop="inTime" label="进场时间"></el-table-column>
							 			  	<el-table-column prop="outTime" label="离开时间"></el-table-column>
							 			  	
							 			  	<el-table-column label="操作" width="180" align="center">
							 			  	    <template slot-scope="scope">
							 			  			<el-button
							 			  			    @click="selectParkRecord(scope.$index, scope.row)"
							 			  			>选择</el-button>			        
							 			  	    </template>
							 			  	</el-table-column>
							 			  			        
							 			  </el-table>
							 			  			
							 			  <div class="pagination">				
							 			      <el-pagination
							 			          background
							 			          layout="total, prev, pager, next"
							 			          :current-page="querytempdata.page"
							 			          :page-size="querytempdata.rows"
							 			          :total="tempPageTotal"
							 			          @current-change="handleTempPageChange"
							 			      ></el-pagination>
							 			  </div>
							 								   
							 </el-dialog>
							 <el-dialog
							       width="70%"
							       title="选择收费项"
							       :visible.sync="innerPayTempVisible"
							       append-to-body>
								   <div class="handle-box">
								       <el-input v-model="querypidata.payItemName" placeholder="费用项名称" class="handle-input mr10"></el-input>
								       <el-button type="primary" icon="el-icon-search" @click="handleItemSearch">搜索</el-button>
								   </div>
								   <el-table
								   v-loading="innerloading"
								       :data="itemData"
								       stripe
								       class="table"
								       ref="multipleTable"				
								       header-cell-class-name="table-header"
								   >
								    <el-table-column prop="payItemId" label="费用项ID" width="150" align="center"></el-table-column>
								    <el-table-column prop="payItemType" label="费用项类型"></el-table-column>
								   	<el-table-column prop="payItemName" label="费用项名称" width="100"></el-table-column>
								   	<el-table-column prop="payItemPeriod" label="费用项标识" width="100"></el-table-column>
								   	<el-table-column prop="beginTime" label="开始时间"></el-table-column>
								   	<el-table-column prop="overTime" label="结束时间"></el-table-column>
								   	<el-table-column prop="charStandard" label="单价" width="70"></el-table-column>
								   	<el-table-column prop="charOnce" label="附加/固定费用" width="110" align="center"></el-table-column>
								   	
								   	<el-table-column label="操作" width="100" align="center">
								   	    <template slot-scope="scope">
								   			<el-button
								   			    @click="selectTempPayItem(scope.$index, scope.row)"
								   			>选择</el-button>			        
								   	    </template>
								   	</el-table-column>								
								   </el-table>
								   <div class="pagination">
								       <el-pagination
								           background
								           layout="total, prev, pager, next"
								           :current-page="querypidata.page"
								           :page-size="querypidata.rows"
								           :total="itemPageTotal"
								           @current-change="handleItemPageChange"
								       ></el-pagination>
								   </div>
								   
							 </el-dialog>
			    <el-form ref="form" :model="addtempdata" label-width="120px">
					<el-form-item label="进出场ID">
						 <span>{{addtempdata.parkRecordId}}</span>
						  <el-button style="float: right;" type="primary"  icon="el-icon-circle-plus-outline" @click="handleSelectTemp">选择</el-button>	
					</el-form-item>
					<el-form-item label="车牌号">
						 <span style="color: red;">{{showtempdata.licenseNo}}</span>
					</el-form-item>			 
			        <el-form-item label="收费项目"> 
						
						  <span>{{ showtempdata.payItemName}}</span>
						
						 <el-button style="float: right;" type="primary"  icon="el-icon-circle-plus-outline" @click="handleSelectPayItem">选择</el-button>							
			        </el-form-item>
					<el-form-item label="时长(/小时)">
						<el-tooltip class="item" effect="light" content="计算公式:时长*单价+附加/固定费 不足一小时按一小时算" placement="right">
						   <el-input v-model="showtempdata.duration" placeholder="请输入时长" @input = "changeHour"></el-input>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="应付金额">
							<span><strong style="color: red;font-size: 20px;">¥{{addtempdata.payable}}</strong></span>
					</el-form-item>	 		
			    </el-form>
			    <span slot="footer" class="dialog-footer">
			        <el-button @click="addTempVisible = false">取 消</el-button>
			        <el-button type="warning" @click="saveAddParkingPay">立即缴费</el-button>
			    </span>
			</el-dialog>
			
		</div>
		
	</div>
</template>

<script>
	import {getParkingAndOwnerData} from '../../../api/parking.js'
	import {getPayItemData} from '../../../api/payItem.js'
	import {getParkRecordData} from '../../../api/parkRecord.js'
	import {addPaymentList} from '../../../api/paymentList.js'
	import {addTPPaymentList} from '../../../api/parkTempPay.js'
	
	
	
	export default{
		name: '',
		data() {
			return {				
				querydata: {
					page: 1,
					rows: 5,
					parkingNo: '',
					ownerName: ''
					
				},
				querypidata: {
					page: 1,
					rows: 10,
					payItemName: '',
				},
				querytempdata: {
					page: 1,
					rows: 5,
					licenseNo: '',
					parkingAreaNo: ''
					
				},
				adddata: {
					payPerId: '',
					payItemId: '',
					payable: '',
					parkId: ''
				},
				addtempdata: {
					parkRecordId: '',
					payItemId: '',
					payable: ''
				},
				showdata: {
					parkingNo: '',
					payItemName: '',
					ownerName: ''
				},
				showtempdata: {
					licenseNo: '',
					duration: '',
					ownerName: ''
				},
				money:{
					parkingAreal: 0,
					total: 0
				},
				countmsg:{
					charOnce: 0,
					charStandard: 0
				},
				loading: true,
				innerloading: true,
				tableData: [],
				itemData: [],
				tempData: [],
				pageTotal: 0,
				itemPageTotal: 0,
				tempPageTotal: 0,
				addVisible: false,
				addTempVisible: false,
				innerVisible: false,
				innerTempVisible: false,
				innerPayTempVisible: false
			}
		},
		created() {
			this.getData()
		},
		methods: {
			getData() {
				getParkingAndOwnerData(this.querydata).then(res=>{
					this.tableData = res.data;
					this.pageTotal = res.total;
					this.loading = false
				})				
			},
			getPayItemData(){
				getPayItemData(this.querypidata).then(res=>{
					this.itemData = res.data;
					this.itemPageTotal = res.total;
					this.innerloading = false;
				});	
			},
			getParkRecordData(){
				getParkRecordData(this.querytempdata).then(res=>{
					this.tempData = res.data;
					this.tempPageTotal = res.total;
				});	
			},
			numFormatter(row,column){
				return row.parkingAreaNo+'号停车场'+row.parkingNo+'号停车位'
			},
			handleSearch(){
				this.getData()
			},
			handleItemSearch(){
				this.getPayItemData()
			},
			handleTempSearch(){
				this.getParkRecordData()
			},
			addPayment(index,row){
				this.addVisible = true;
				this.showdata.parkingNo = row.parkingNo;
				this.showdata.ownerName = row.ownerName;
				this.adddata.payPerId = row.ownerId;
				this.adddata.parkId = row.parkId;
				this.money.parkingAreal = row.parkingAreal;
			},
			selectPayItem(index,row){
				this.adddata.payItemId = row.payItemId;
				this.showdata.payItemName = row.payItemName;
				if(row.charStandard==''){
					this.money.total = parseInt(row.charOnce);
				}else if(row.charOnce==''){
					this.money.total = parseInt(row.charStandard)*this.money.parkingAreal
				}else{
					this.money.total = parseInt(row.charStandard)*this.money.parkingAreal+parseInt(row.charOnce);
				}
				
				this.adddata.payable = this.money.total;
								
				this.innerVisible = false;
			},
			saveAddPayMent(){
				if(this.adddata.payItemId == ''){
					this.$message.error('请先选择收费项');
				}else{
					addPaymentList(this.adddata).then(res=>{
						if(res>0){
							this.$message.success('创建成功');
							this.addVisible = false;
						}else{
							this.$message.error('创建失败');
						}
					})
				}
			},
			saveAddParkingPay(){
				if(this.addtempdata.payItemId == ''){
					this.$message.error('请先选择收费项');
				}else if(this.addtempdata.parkRecordId==''){
					this.$message.error('请先选择进出场ID');
				}else{
					addTPPaymentList(this.addtempdata).then(res=>{
						if(res>0){
							this.$notify({
							          title: '付费成功',
							          message: this.showtempdata.licenseNo +' 已付费：'+this.addtempdata.payable,
							          type: 'success'
							        });
							this.addTempVisible = false;
						}else{
							this.$notify.error({
							          title: '付费失败',
							          message: this.showtempdata.licenseNo +' 付费失败',
							        });
						}
					})
				}
			},
			selectParkRecord(index,row){
				this.addtempdata.parkRecordId = row.parkRecordId;
				this.showtempdata.licenseNo = row.licenseNo;
				let beginTime = new Date(row.inTime);
				let nowTime = new Date();
				let time = nowTime.getTime()-beginTime.getTime();
				//let shijiancha=time%(24*3600*1000) ;
				this.showtempdata.duration = Math.ceil(time/(3600*1000));						
				this.innerTempVisible = false;
			},
			selectTempPayItem(index,row){
				this.addtempdata.payItemId = row.payItemId;
				this.showtempdata.payItemName = row.payItemName;
				this.countmsg.charOnce = parseInt(row.charOnce);
				this.countmsg.charStandard = parseInt(row.charStandard);
				if(row.charStandard==''){
					this.addtempdata.payable = this.countmsg.charOnce;
				}else if(row.charOnce==''){
					this.addtempdata.payable = this.countmsg.charStandard*this.showtempdata.duration
				}else{
					this.addtempdata.payable = this.countmsg.charStandard*this.showtempdata.duration+this.countmsg.charOnce;
				}
							
				this.innerPayTempVisible = false;
			},
			changeHour(val){
				//alert(this.countmsg.charStandard+'---'+this.countmsg.charOnce)
				if(isNaN(this.countmsg.charStandard)){
					this.addtempdata.payable = this.countmsg.charOnce;
				}else if(isNaN(this.countmsg.charOnce)){
					this.addtempdata.payable = this.countmsg.charStandard*val
				}else{
					this.addtempdata.payable = this.countmsg.charStandard*val+this.countmsg.charOnce;
				}
			},
			handleSelectItem(){
				this.innerVisible = true;
				this.getPayItemData();
			},
			handleSelectPayItem(){
				this.innerPayTempVisible = true;
				this.getPayItemData();
			},
			handleSelectTemp(){
				this.innerTempVisible = true;
				this.getParkRecordData();
			},
			addTempParking(){
				this.addTempVisible = true;
			},
			handlePageChange(val){
				this.$set(this.querydata, 'page', val);
				this.getData();
			},
			handleItemPageChange(val){
				this.$set(this.querypidata, 'page', val);
				this.getPayItemData();
			},
			handleTempPageChange(val){
				this.$set(this.querytempdata, 'page', val);
				this.getParkRecordData();
			}
		},
	}
</script>

<style>
	.handle-box {
	    margin-bottom: 20px;
	}
	
	.handle-select {
	    width: 120px;
	}
	
	.handle-input {
	    width: 200px;
	    display: inline-block;
	}
	.handle-select {
	    width: 200px;
	    margin-right: 10px;
	}
	.table {
	    width: 100%;
	    font-size: 14px;
	}
	.red {
	    color: #ff0000;
	}
	.mr10 {
	    margin-right: 10px;
	}
	.table-td-thumb {
	    display: block;
	    margin: auto;
	    width: 40px;
	    height: 40px;
	}
</style>
