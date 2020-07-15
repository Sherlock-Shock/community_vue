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
			            房屋收费
			        </el-breadcrumb-item>
			    </el-breadcrumb>			
		</div>
		 <div class="container">
			 <div class="handle-box">
				 查询：
			     <el-input v-model="querydata.bulidingNo" placeholder="楼栋编号" class="handle-input mr10"></el-input>
			 	<el-input v-model="querydata.unitNo" placeholder="单元编号" class="handle-input mr10"></el-input>
			 	<el-input v-model="querydata.roomNo" placeholder="房屋编号" class="handle-input mr10"></el-input>
			    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-button type="primary"  @click="addPiLiangVisible=true">批量创建</el-button>
			 </div>
			 <el-table
			 	v-loading="loading"
			     :data="tableData"
			     stripe
			     class="table"
			     ref="multipleTable"
			     header-cell-class-name="table-header"
			 >
			     <el-table-column prop="houseId" label="房屋ID" width="100" ></el-table-column>
			 	<el-table-column prop="roomNo" :formatter="numFormatter" label="房屋编号"></el-table-column>
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
					 <el-form-item label="房屋编号">
						 <span>{{showdata.roomNo}}</span>
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
			 
			 
			 <!-- 批量创建收费-->
			 <el-dialog title="批量创建收费(对此表格所有数据生效)" :visible.sync="addPiLiangVisible" width="30%">
			 				 <el-dialog
			 				       width="70%"
			 				       title="选择收费项"
			 				       :visible.sync="innerPVisible"
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
			 					   			    @click="selectPiLiangPayItem(scope.$index, scope.row)"
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
			         <el-form-item label="收费项目"> 
			 						 <el-tooltip class="item" effect="light" content="计算公式:面积*单价+附加/固定费" placement="right">
			 					       <span>{{ showdata.payItemName}}</span>
			 					     </el-tooltip>
			 			<el-button style="float: right;" type="primary"  icon="el-icon-circle-plus-outline" @click="handleSelectPiLiangItem">选择</el-button>							
			         </el-form-item>
					<el-form-item label="收费项目类型">
							{{addpiliangdata.payItemType}}	 						
					</el-form-item>
					<el-form-item label="收费项目名称">
							{{addpiliangdata.payItemName}}	 						 
					</el-form-item>	
					<el-form-item label="单价">
							{{addpiliangdata.charStandard}}	 						 
					</el-form-item>	
					<el-form-item label="附加/固定费用">
							{{addpiliangdata.charOnce}}	 						 
					</el-form-item>		 
			     </el-form>
			     <span slot="footer" class="dialog-footer">
			         <el-button @click="addPiLiangVisible = false">取 消</el-button>
			         <el-button type="primary" @click="saveAddPiLiangPayMent">确 定</el-button>
			     </span>
			 </el-dialog>
			 
		 </div>
		 
		 
	</div>
</template>

<script>
	import {getHouseAndOwnerData} from '../../../api/house.js'
	import {getPayItemData} from '../../../api/payItem.js'
	import {addPaymentList} from '../../../api/paymentList.js'
	
	import {addPLPaymentList} from '../../../api/paymentList.js'
	
	export default{
		name: 'houseCharge',
		data() {
			return {
				querydata: {
					page: 1,
					rows: 5,
					bulidingNo: '',
					unitNo: '',
					roomNo: ''
					
				},
				querypidata: {
					page: 1,
					rows: 10,
					payItemName: '',
				},
				showdata: {
					roomNo: '',
					payItemName: '',
					ownerName: ''
				},
				adddata: {					
					payPerId: '',
					payItemId: '',
					payable: '',
					houseId: ''
				},
				addpiliangdata: {
					payItemId: '',
					payItemType: '',
					payItemName: '',
					charStandard: '',
					charOnce: ''
					
				},
				money:{
					houseAreal: 0,
					total: 0
				},				
				loading: true,
				innerloading: true,
				tableData: [],
				itemData: [],
				pageTotal: 0,
				itemPageTotal: 0,
				addVisible: false,
				innerVisible: false,
				innerPVisible: false,
				addPiLiangVisible: false
			}
		},
		created() {
			this.getData()
		},
		methods: {
			getData() {
				getHouseAndOwnerData(this.querydata).then(res=>{
					this.tableData = res.data;
					this.pageTotal = res.total;
					this.loading = false;
				});		
			},
			getPayItemData(){
				getPayItemData(this.querypidata).then(res=>{
					this.itemData = res.data;
					this.itemPageTotal = res.total;
					this.innerloading = false;
				});	
			},
			handleSearch(){
				this.getData()
			},
			handleItemSearch(){
				this.getPayItemData()
			},
			selectPayItem(index,row){
				this.adddata.payItemId = row.payItemId;
				this.showdata.payItemName = row.payItemName;
				if(row.charStandard==''){
					this.money.total = parseInt(row.charOnce);
				}else if(row.charOnce==''){
					this.money.total = parseInt(row.charStandard)*this.money.houseAreal
				}else{
					this.money.total = parseInt(row.charStandard)*this.money.houseAreal+parseInt(row.charOnce);
				}
			
				this.adddata.payable = this.money.total;
								
				this.innerVisible = false;
			},
			handleSelectPiLiangItem(){
				
				this.innerPVisible = true;
				this.getPayItemData()
			},
			selectPiLiangPayItem(index,row){
				this.addpiliangdata.payItemId = row.payItemId;
				this.addpiliangdata.charStandard = row.charStandard;
				this.addpiliangdata.charOnce = row.charOnce;
				this.addpiliangdata.payItemType = row.payItemType;
				this.addpiliangdata.payItemName = row.payItemName;
				this.innerPVisible = false;
			},
			numFormatter(row,column){
				return row.bulidingNo+'号楼'+row.unitNo+'单元'+row.roomNo+'室'
			},
			addPayment(index,row){
				this.addVisible = true;
				this.showdata.roomNo = row.roomNo;
				this.showdata.ownerName = row.ownerName;
				this.adddata.payPerId = row.ownerId;
				this.adddata.houseId = row.houseId;
				this.money.houseAreal = row.houseAreal;
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
			saveAddPiLiangPayMent(){
				
				if(this.addpiliangdata.payItemId == ''){
					this.$message.error('请先选择收费项');
				}else{
					addPLPaymentList(this.addpiliangdata).then(res=>{
						if(res>0){
							this.$message.success('创建成功');
							this.addPiLiangVisible = false;
						}else{
							this.$message.error('创建失败');
						}
					})
				}
			},
			handleSelectItem(){
				this.innerVisible = true;
				this.getPayItemData();

			},
			
			handlePageChange(val){
				this.$set(this.querydata, 'page', val);
				this.getData();
			},
			handleItemPageChange(val){
				this.$set(this.querypidata, 'page', val);
				this.getPayItemData();
			}
		},
	}
</script>

<style scoped>
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
