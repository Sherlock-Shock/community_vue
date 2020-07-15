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
			            车位信息
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
		        
		        <el-input v-model="querydata.parkingNo" placeholder="车位编号" class="handle-input mr10"></el-input>
		        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>		
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
		        <el-table-column prop="parkId" label="车位ID" width="100" align="center" sortable></el-table-column>
		        <el-table-column prop="parkingAreaNo" label="停车场编号"></el-table-column>
				<el-table-column prop="parkingNo" label="车位编号"></el-table-column>
				<el-table-column prop="ownerName" label="所属业主"></el-table-column>
				<el-table-column prop="parkStatus" label="车位状态" ></el-table-column>
				<el-table-column prop="parkingAreal" label="面积" ></el-table-column>
				
		        <el-table-column label="操作" width="180" align="center">
		            <template slot-scope="scope">
						<el-button
						    type="text"
						    icon="el-icon-edit"
						    @click="editParking(scope.$index, scope.row)"
						>修改</el-button>		                
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
		
		<!-- 修改停车位弹出框 -->
		<el-dialog title="修改车位" :visible.sync="editVisible" width="30%">
		    <el-form ref="form" :model="editdata" label-width="90px">
		        <el-form-item label="车位ID">
		            <el-input v-model="editdata.parkId" disabled="true"></el-input>
		        </el-form-item>
				<el-form-item label="车位编号">
				    <el-input v-model="editdata.parkingNo"></el-input>
				</el-form-item>
				<el-form-item label="车位状态">
				   <el-select v-model="editdata.parkStatus" placeholder="请选择">
				       <el-option
						      label="空闲"
						      value="空闲">
					   </el-option>
					   <el-option
					   		  label="出租"
					   	      value="出租">
					   </el-option>
					   <el-option
					   		  label="已出售"
					   	      value="已出售">
					   </el-option>
				     </el-select>
				</el-form-item>
				<el-form-item label="面积">
				    <el-input v-model="editdata.parkingAreal"></el-input>
				</el-form-item>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="editVisible = false">取 消</el-button>
		        <el-button type="primary" @click="saveEditParking">确 定</el-button>
		    </span>
		</el-dialog>
		
	</div>
</template>

<script>
import {getParkingData} from '../../../api/parking.js'	
import {deleteParkings} from '../../../api/parking.js'	
import {updateParking} from '../../../api/parking.js'	
	
	export default{
		name: 'parking',
		data() {
			return {
				querydata: {
					parkingNo: '',
					page: 1,
					rows: 5
				},
				editdata: {
					parkId: '',
					parkingNo: '',
					parkStatus: '',
					parkingAreal: ''
					
				},
				tableData: [],
				pageTotal: 0,
				multipleSelection: [],
				delList: [],
				editVisible: false,
				loading: true
				
			}
		},
		created() {
			this.getData()
		},
		methods: {
			getData() {
				getParkingData(this.querydata).then(res=>{
					this.tableData = res.data;
					this.pageTotal = res.total;
					this.loading  = false;
				})
			},
			handlePageChange(val){
				this.$set(this.querydata, 'page', val);
				this.getData();
			},
			handleSearch(){
				getParkingData(this.querydata).then(res=>{
					this.tableData = res.data;
					this.pageTotal = res.total;
				})
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
							this.delList.push(this.multipleSelection[i].parkId);
						}
						console.log(this.delList);
						deleteParkings(this.delList).then(res=>{
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
			editParking(index,row){
				this.editdata.parkId = row.parkId;
				this.editdata.parkingNo = row.parkingNo;
				this.editdata.parkStatus = row.parkStatus;
				this.editdata.parkingAreal = row.parkingAreal;
				this.editVisible = true;
			},
			saveEditParking(){
				updateParking(this.editdata).then(res=>{
					if(res>0){
						this.$message.success('修改成功');
						 this.getData();
					}else{
						this.$message.error('修改失败');
					}
				})
				this.editVisible = false;
			}
			
		}
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
