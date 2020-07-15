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
	    	            停车场管理
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
		        
		        <el-input v-model="querydata.parkingAreaNo" placeholder="停车场编号" class="handle-input mr10"></el-input>
		        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" icon="el-icon-plus" @click="addParkingLot">添加停车场</el-button>
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
		        <el-table-column prop="parkingAreaId" label="停车场ID" width="100" align="center"></el-table-column>
		        <el-table-column prop="parkingAreaNo" label="停车场编号"></el-table-column>
				<el-table-column prop="parkingType" label="类型"></el-table-column>
				<el-table-column prop="parkAddress" label="位置"></el-table-column>
				
		        <el-table-column label="操作" width="180" align="center">
		            <template slot-scope="scope">
						<el-button
						    type="text"
						    icon="el-icon-edit"
						    @click="editParkingLot(scope.$index, scope.row)"
						>修改</el-button>
		                <el-button
		                    type="text"
		                    size="mini"
		                    @click="addParking(scope.$index, scope.row)"
		                >添加车位</el-button>
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
		<!-- 修改停车场弹出框 -->
		<el-dialog title="修改停车场" :visible.sync="editVisible" width="30%">
		    <el-form ref="form" :model="editdata" label-width="90px">
		        <el-form-item label="停车场编号">
		            <el-input v-model="editdata.parkingAreaNo"></el-input>
		        </el-form-item>
				<el-form-item label="类型">
				   <el-select v-model="editdata.parkingType" placeholder="请选择">
				       <el-option
						      label="地上停车场"
						      value="地上停车场">
					   </el-option>
					   <el-option
					   		  label="地下停车场"
					   	      value="地下停车场">
					   </el-option>
				     </el-select>
				</el-form-item>
				<el-form-item label="地址">
				    <el-input v-model="editdata.parkAddress"></el-input>
				</el-form-item>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="editVisible = false">取 消</el-button>
		        <el-button type="primary" @click="saveEditParkingArea">确 定</el-button>
		    </span>
		</el-dialog>
		<!-- 添加停车场弹出框 -->
		<el-dialog title="添加停车场" :visible.sync="addVisible" width="30%">
		    <el-form ref="addLotForm" :model="adddata" :rules="lrules" label-width="110px">
		        <el-form-item label="停车场编号" prop="parkingAreaNo">
		            <el-input @blur="checkParkingAreaNo" v-model="adddata.parkingAreaNo"></el-input>
		        </el-form-item>
				<el-form-item label="类型" prop="parkingType">
				   <el-select v-model="adddata.parkingType" placeholder="请选择">
				       <el-option
						      label="地上停车场"
						      value="地上停车场">
					   </el-option>
					   <el-option
					   		  label="地下停车场"
					   	      value="地下停车场">
					   </el-option>
				     </el-select>
				</el-form-item>
				<el-form-item label="地址">
				    <el-input v-model="adddata.parkAddress"></el-input>
				</el-form-item>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="addVisible = false">取 消</el-button>
		        <el-button type="primary" @click="saveAddParkingArea">确 定</el-button>
		    </span>
		</el-dialog>
		
		<!-- 添加停车位弹出框 -->
		<el-dialog title="添加停车位" :visible.sync="addParkingVisible" width="30%">
		    <el-form ref="addParkForm" :rules="prules" :model="addparkingdata" label-width="110px">
				<el-form-item label="停车场ID">
				    <el-input v-model="addparkingdata.parkingAreaId" disabled="true"></el-input>
				</el-form-item>	
		        <el-form-item label="停车位编号" prop="parkingNo">
		            <el-input @blur="checkParkingNo" v-model="addparkingdata.parkingNo"></el-input>
		        </el-form-item>				
				<el-form-item label="面积" prop="parkingAreal">
				    <el-input v-model="addparkingdata.parkingAreal"></el-input>
				</el-form-item>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="addParkingVisible = false">取 消</el-button>
		        <el-button type="primary" @click="saveAddParking">确 定</el-button>
		    </span>
		</el-dialog>
	</div>	
</template>

<script>
import {getParkingAreaData} from '../../../api/parkingLot.js'
import {deleteParkingAreas} from '../../../api/parkingLot.js'
import {updateParkingArea} from '../../../api/parkingLot.js'
import {addParkingArea} from '../../../api/parkingLot.js'
 import {checkParkingAreaNoIsExist} from '../../../api/parkingLot.js'
import {checkParkingNoIsExist} from '../../../api/parking.js'


import {addParking} from '../../../api/parking.js'
	
	
	export default{
		name: 'parkingLot',
		data() {
			return {
				querydata: {
					parkingAreaNo: '',
					page: 1,
					rows: 5
				},
				checkdata: {
					parkingAreaId: '',
					parkingNo: ''
				},
				editdata:{
					parkingAreaId: '',
					parkingAreaNo: '',
					parkingType: '',
					parkAddress: ''
				},
				adddata: {
					parkingAreaNo: '',
					parkingType: '',
					parkAddress: ''
				},
				addparkingdata: {
					parkingAreaId: '',
					parkingNo: '',
					parkingAreal: ''
				},
				lrules:{
					"parkingAreaNo" : [
						   { required: true, message: '请输入停车场编号', trigger: 'blur' },
						  ],
					"parkingType" : [
						   { required: true, message: '请选择停车场类型', trigger: 'change' },
						  ]				
				},
				prules:{
					"parkingNo" : [
						   { required: true, message: '请输入停车位编号', trigger: 'blur' },
						  ],
					"parkingAreal" : [
						   { required: true, message: '请输入面积', trigger: 'change' },
						  ]				
				},
				tableData: [],
				pageTotal: 0,
				multipleSelection: [],
				delList: [],
				editVisible: false,
				addVisible: false,
				addParkingVisible: false,
				loading: true
			}
		},
		created() {
			this.getData();
		},
		methods:{
			getData(){
				getParkingAreaData(this.querydata).then(res=>{
					this.tableData = res.data;
					this.pageTotal = res.total;
					this.loading = false;
				})
			},
			handleSearch(){
				getParkingAreaData(this.querydata).then(res=>{
					this.tableData = res.data;
					this.pageTotal = res.total;
				})
			},
			checkParkingAreaNo(e){
				checkParkingAreaNoIsExist(this.adddata).then(res=>{
					if(res>0){
						this.$message.error('该停车场编号已存在');
						this.adddata.parkingAreaNo='';
					}
				})
			},
			addParkingLot(){
				this.addVisible = true;
			},
			saveAddParkingArea(){
				this.$refs.addLotForm.validate((valid) => {
				         if (valid) {
							  addParkingArea(this.adddata).then(res=>{
								if(res>0){
									this.$message.success('添加成功');
									 this.getData();
								}else{
									this.$message.error('添加失败');
								}
							  })
							  this.addVisible = false
				         } else {
				           console.log('error submit!!');
				           return false;
				         }
				       });
				
				
			},
			checkParkingNo(e){
				checkParkingNoIsExist(this.addparkingdata).then(res=>{
					if(res>0){
						this.$message.error('该车位编号已存在');
						this.addparkingdata.parkingNo='';
					}else{						
					}
				})
			},
			addParking(index,row){
				this.addparkingdata.parkingAreaId = row.parkingAreaId;
				this.addParkingVisible = true;
			},
			saveAddParking(){
				this.$refs.addParkForm.validate((valid) => {
				         if (valid) {
							 addParking(this.addparkingdata).then(res=>{
							 	if(res>0){
							 		this.$message.success('添加车位成功');
							 		 this.getData();
							 	}else{
							 		this.$message.error('添加车位失败');
							 	}
							 })
							 this.addParkingVisible = false;
				         } else {
				           console.log('error submit!!');
				           return false;
				         }
				       });
				
				
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
							this.delList.push(this.multipleSelection[i].parkingAreaId);
						}
						console.log(this.delList);
						deleteParkingAreas(this.delList).then(res=>{
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
			handlePageChange(val){
				this.$set(this.querydata, 'page', val);
				this.getData();
			},
			editParkingLot(index,row){
				this.editdata.parkingAreaId = row.parkingAreaId;
				this.editdata.parkingAreaNo = row.parkingAreaNo;
				this.editdata.parkingType = row.parkingType;
				this.editdata.parkAddress = row.parkAddress;
				this.editVisible = true;								
			},
			saveEditParkingArea() {			    
				updateParkingArea(this.editdata).then(res=>{
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
