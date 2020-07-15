<template>
	<div>
		<div class="container" style="margin-bottom: 10px;">
			    <el-breadcrumb separator="/" style="font-size: 20px;">
					<el-breadcrumb-item :to="{ path: '/adminindex' }">
					   首页
					</el-breadcrumb-item>
					<el-breadcrumb-item>
					    停车管理
					</el-breadcrumb-item>
			        <el-breadcrumb-item>
			            进出记录
			        </el-breadcrumb-item>
			    </el-breadcrumb>			
		</div>
		<div class="container">
		    <div class="handle-box">
		        <el-button
		            type="primary"
		            icon="el-icon-delete"
		            class="handle-del mr10"
		            @click="delAllSelection"
		        >批量删除</el-button>
				
		        <el-input v-model="querydata.licenseNo" placeholder="车牌号" class="handle-input mr10"></el-input>
		        <el-input v-model="querydata.parkingAreaNo" placeholder="停车场编号" class="handle-input mr10"></el-input>
		        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" icon="el-icon-plus" @click="addParkRecord">添加记录</el-button>
		    </div>
		    <el-table
			v-loading="loading"
		        :data="tableData"
		        border
		        class="table"
		        ref="multipleTable"
		        header-cell-class-name="table-header"
		        @selection-change="handleSelectionChange"
		    >
		        <el-table-column type="selection" width="55" align="center"></el-table-column>
		        <el-table-column prop="parkRecordId" label="进出场ID" width="150" align="center"></el-table-column>
		        <el-table-column prop="licenseNo" label="车牌号"></el-table-column>
				<el-table-column prop="parkingAreaId" label="停车场ID" width="100"></el-table-column>
				<el-table-column prop="parkingAreaNo" label="停车场编号" width="100"></el-table-column>
				<el-table-column prop="inTime" label="进场时间"></el-table-column>
				<el-table-column prop="outTime" label="离开时间"></el-table-column>
				
				<el-table-column label="操作" width="180" align="center">
				    <template slot-scope="scope">
						<el-button
							v-show="scope.row.outTime==''"
						    @click="leaveParking(scope.$index, scope.row)"
						>离开</el-button>			        
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
		</div>
		
		<!-- 添加进出场记录 -->
		<el-dialog title="添加进出场记录" :visible.sync="addVisible" width="30%">
		    <el-form ref="form" :model="adddata" label-width="90px">
		        <el-form-item label="车牌号">
		            <el-input v-model="adddata.licenseNo"></el-input>
		        </el-form-item>
				<el-form-item label="停车场ID">
				   <el-select v-model="adddata.parkingAreaId" placeholder="请选择">
				      <el-option
				            v-for="item in parkinglotids"
							:key="item"
				            :label="item"
				            :value="item">
				          </el-option>
				     </el-select>
				</el-form-item>
				<el-form-item label="进场时间">
				   <div class="block">
				       <el-date-picker
				         v-model="adddata.inTime"
				         type="datetime"
						 value-format="yyyy-MM-dd HH:mm:ss"
				         placeholder="选择进场时间">
				       </el-date-picker>
				     </div>
				</el-form-item>
				<el-form-item label="离开时间">
				   <div class="block">
				       <el-date-picker
				         v-model="adddata.outTime"
				         type="datetime"
						 value-format="yyyy-MM-dd HH:mm:ss"
				         placeholder="选择离开时间">
				       </el-date-picker>
				     </div>
				</el-form-item>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="addVisible = false">取 消</el-button>
		        <el-button type="primary" @click="saveAddParkRecord">确 定</el-button>
		    </span>
		</el-dialog>
			
		<!-- 离开弹出框 -->	
		<el-dialog title="离开" :visible.sync="leaveVisible" width="30%">
		    
				   <div class="block">
				       <el-date-picker
				         v-model="leaveData.outTime"
				         type="datetime"
						 value-format="yyyy-MM-dd HH:mm:ss"
				         placeholder="选择离开时间">
				       </el-date-picker>
				     </div>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="leaveVisible = false">取 消</el-button>
		        <el-button type="primary" @click="saveLeaveParking">确 定</el-button>
		    </span>
		</el-dialog>		
		
	</div>
</template>

<script>
	import {getParkRecordData} from '../../../api/parkRecord.js'
	import {deleteParkRecord} from '../../../api/parkRecord.js'
	import {getParkingAreaId} from '../../../api/parkingLot.js'
	import {addParkRecords} from '../../../api/parkRecord.js'
	import {leaveParkRecord} from '../../../api/parkRecord.js'
	
	
	
	export default{
		name: 'ParkRecord',
		data() {
			return {
				querydata: {
					page: 1,
					rows: 5,
					licenseNo: '',
					parkingAreaNo: ''
					
				},
				adddata: {
					licenseNo: '',
					parkingAreaId: '',
					inTime: '',
					outTime: ''
				},
				leaveData: {
					parkRecordId: '',
					outTime: ''
				},
				tableData: [],
				parkinglotids: [],
				pageTotal: 0,
				multipleSelection: [],
				delList: [],
				addVisible: false,
				leaveVisible: false,
				loading: true
			}
		},
		created() {
			this.getData();
		},
		methods: {
			getData() {
				getParkRecordData(this.querydata).then(res=>{
					this.tableData = res.data;
					this.pageTotal = res.total;
					this.loading = false;
				})				
			},
			handleSearch(){
				this.getData();
			},
			addParkRecord(){
				this.addVisible = true;
				getParkingAreaId().then(res=>{
					this.parkinglotids = res
				})
			},
			saveAddParkRecord(){
				//alert(this.adddata.inTime)
				
				addParkRecords(this.adddata).then(res=>{
					if(res>0){
						this.$message.success('添加记录成功');
						 this.getData();
					}else{
						this.$message.error('添加记录失败');
					}
				})
				this.addVisible = false
			},
			handleSelectionChange(val){
				this.multipleSelection = val;
			},
			//多选删除
			delAllSelection() {
				this.$confirm('确定要删除吗？', '提示', {
				    type: 'warning'
				})
				    .then(() => {								
						const length = this.multipleSelection.length;
						let str = '';
						for (let i = 0; i < length; i++) {
							this.delList.push(this.multipleSelection[i].parkRecordId);
						}
						console.log(this.delList);
						deleteParkRecord(this.delList).then(res=>{
							if(res>0){
								this.$message.success('删除成功');
								 this.getData();
							}else{
								this.$message.error('删除失败');
							}
						});					           
						this.multipleSelection = [];   									  
				    })
				    .catch(() => {});								
			},
			leaveParking(index,row){
				this.leaveVisible = true;
				this.leaveData.parkRecordId = row.parkRecordId;
			},
			saveLeaveParking(){
				this.leaveVisible = false;
				leaveParkRecord(this.leaveData).then(res=>{
					if(res>0){
						this.$message.success('已离场');
						 this.getData();
					}else{
						this.$message.error('离场失败');
					}
				})
			},
			handlePageChange(val){
				this.$set(this.querydata, 'page', val);
				this.getData();
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
	    width: 300px;
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
