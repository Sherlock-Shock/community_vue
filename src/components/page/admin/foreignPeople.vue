<template>
	<div>
	    <div class="container" style="margin-bottom: 10px;">
	    	    <el-breadcrumb separator="/" style="font-size: 20px;">
	    			<el-breadcrumb-item :to="{ path: '/adminindex' }">
	    			   首页
	    			</el-breadcrumb-item>
	    			<el-breadcrumb-item>
	    			    智慧服务
	    			</el-breadcrumb-item>
	    	        <el-breadcrumb-item>
	    	            访客登记
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
				    
				    <el-input v-model="querydata.personName" placeholder="姓名" class="handle-input mr10"></el-input>
				    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>	
					<el-button type="primary" icon="el-icon-plus" @click="addRecord">进行登记</el-button>
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
				    <el-table-column prop="personNo" label="访客ID" width="150" ></el-table-column>
					<el-table-column prop="personName" label="访客姓名" width="80"></el-table-column>
					<el-table-column prop="phone" label="联系方式"></el-table-column>
					<el-table-column prop="inTime" label="来访时间"></el-table-column>
				    <el-table-column prop="outTime" label="离开时间"></el-table-column>
					<el-table-column prop="reason" label="来访缘由"></el-table-column>				           
				    <el-table-column label="操作" width="220" align="center">
				        <template slot-scope="scope">
				           <el-button
							   v-show="scope.row.carLicenes!=''"
				               @click="queryCar(scope.$index, scope.row)"
				           >查看车辆</el-button>		
						   <el-button
								v-show="scope.row.outTime==''"
							    @click="leaveCommunity(scope.$index, scope.row)"
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
				<!--添加记录-->
				<el-dialog title="登记" :visible.sync="addVisible" width="30%">
				    <el-form ref="addForm" :rules="arules" :model="adddata" label-width="90px">
				        <el-form-item label="姓名" prop="personName">
				            <el-input v-model="adddata.personName"></el-input>
				        </el-form-item>
						<el-form-item label="联系方式" prop="phone">
						    <el-input v-model="adddata.phone"></el-input>
						</el-form-item>
						<el-form-item label="来访缘由" prop="reason">
						    <el-input v-model="adddata.reason"></el-input>
						</el-form-item>
						<el-form-item label="来访时间" prop="inTime">
						   <div class="block">
						       <el-date-picker
						         v-model="adddata.inTime"
						         type="datetime"
								 value-format="yyyy-MM-dd HH:mm:ss"
						         placeholder="选择来访时间">
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
						<el-form-item label="是否有车">
						   <el-select v-model="adddata.isCar" placeholder="请选择">
						       <el-option
								      label="是"
								      value="y">
							   </el-option>
							   <el-option
							   		  label="否"
							   	      value="n">
							   </el-option>
						     </el-select>
						</el-form-item>
						<el-form-item v-if="adddata.isCar=='y'" label="车牌号">
						    <el-input v-model="adddata.carLicenes"></el-input>
						</el-form-item>
						<el-form-item v-if="adddata.isCar=='y'" label="颜色">
						    <el-input v-model="adddata.carColor"></el-input>
						</el-form-item>
						<el-form-item v-if="adddata.isCar=='y'" label="品牌">
						    <el-input v-model="adddata.carType"></el-input>
						</el-form-item>
				    </el-form>
				    <span slot="footer" class="dialog-footer">
				        <el-button @click="addVisible = false">取 消</el-button>
				        <el-button type="primary" @click="saveAddForeignPeo">确 定</el-button>
				    </span>										
					
				</el-dialog>
				
				<el-dialog
				  title="车辆信息"
				  :visible.sync="carVisible"
				  width="30%"
				  center>
				  <div class="car">
					  <span>车牌号：{{carData.carLicenes}}</span>
					  <br />
					  <br />
					  <span>颜色：{{carData.carColor}}</span>
					  <br />
					  <br />
					  <span>品牌：{{carData.carType}}</span>
				  </div>			  
				  <span slot="footer" class="dialog-footer">				    
				    <el-button type="primary" @click="carVisible = false">确 定</el-button>
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
				        <el-button type="primary" @click="saveLeaveCommunity">确 定</el-button>
				    </span>
				</el-dialog>	
				
			</div>
	    </div>
</template>

<script>
	import {getForeignPeoData} from '../../../api/foreign.js'
	import {deleteForeignPeos} from '../../../api/foreign.js'
	import {addForeignPeo} from '../../../api/foreign.js'
	import {leaveCommunity} from '../../../api/foreign.js'
	
	
	export default{
		name: 'foreignPeople',
		data() {
			return {
				querydata: {
					page: 1,
					rows: 5,
					personName:''
					
				},
				adddata: {
					personName: '',
					phone: '',
					reason: '',
					inTime: '',
					outTime: '',
					isCar: 'n',
					carLicenes: '',
					carColor: '',
					carType: ''
				},
				carData: {
					carLicenes: '',
					carColor: '',
					carType: ''
				},
				leaveData: {
					personNo: '',
					outTime: ''
				},
				arules:{
				"personName" : [
				       { required: true, message: '请输入来访者姓名', trigger: 'blur' },
				      ],
				"phone" : [
				       { required: true, message: '请输入联系方式', trigger: 'blur' },
				      ],
				"reason" : [
				       { required: true, message: '请输入来访缘由', trigger: 'blur' },
				      ],
				"inTime" : [
				       { required: true, message: '请选择来访时间', trigger: 'change' },
				      ]
										
				},
				loading: true,
				tableData: [],
				pageTotal: 0,
				multipleSelection: [],
				delList: [],
				addVisible: false,
				carVisible: false,
				leaveVisible: false
			}
		},
		created() {
			this.getData();
		},
		methods: {
			getData() {
				getForeignPeoData(this.querydata).then(res=>{
					this.tableData = res.data;
					this.pageTotal = res.total;
					this.loading = false;
				})
			},
			handleSearch(){
				this.getData();
			},
			handlePageChange(val){
				this.$set(this.querydata, 'page', val);
				this.getData();
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
							this.delList.push(this.multipleSelection[i].personNo);
						}
						console.log(this.delList);
						deleteForeignPeos(this.delList).then(res=>{
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
			addRecord(){
				this.addVisible = true;
			},
			saveAddForeignPeo(){
				this.$refs.addForm.validate((valid) => {
				         if (valid) {
							  addForeignPeo(this.adddata).then(res=>{
								if(res>0){
									this.$message.success('登记成功');
									 this.getData();
								}else{
									this.$message.error('登记失败');
								}
							  })
							  this.addVisible = false;
				         } else {
				           console.log('error submit!!');
				           return false;
				         }
				       });				
			},
			queryCar(index,row){
				this.carVisible = true;
				this.carData.carLicenes = row.carLicenes;
				this.carData.carColor = row.carColor;
				this.carData.carType = row.carType;
			},
			leaveCommunity(index,row){
				this.leaveVisible = true;
				this.leaveData.personNo = row.personNo;
			},
			saveLeaveCommunity(){
				this.leaveVisible = false;
				leaveCommunity(this.leaveData).then(res=>{
					if(res>0){
						this.$message.success('已离开');
						 this.getData();
					}else{
						this.$message.error('离开失败');
					}
				})
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
	.car{
		text-align: center;
		font-size: 20px;
	}
</style>
