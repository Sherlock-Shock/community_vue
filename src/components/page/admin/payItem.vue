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
			            缴费项管理
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
				
			    <el-input v-model="querydata.payItemName" placeholder="费用项名称" class="handle-input mr10"></el-input>
				<el-select v-model="querydata.payItemPeriod" placeholder="请选择收费标识" class="handle-select">
				    <el-option
				          v-for="item in periodOptions"
				          :key="item.value"
				          :label="item.label"
				          :value="item.value">
				    </el-option>
				 </el-select>
				 <el-select v-model="querydata.payItemType" placeholder="请选择收费类型" class="handle-select">
				    <el-option
				          v-for="item in typeOptions"
				          :key="item.value"
				          :label="item.label"
				          :value="item.value">
				    </el-option>
				  </el-select>
			    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" icon="el-icon-plus" @click="addPayItem">创建收费项目</el-button>
			</div>
			<el-table
			v-loading="loading"
			    :data="tableData"
			    stripe
			    class="table"
			    ref="multipleTable"				
			    header-cell-class-name="table-header"
			    @selection-change="handleSelectionChange"
			>
			    <el-table-column type="selection" width="30" align="center"></el-table-column>
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
						    @click="editPayItem(scope.$index, scope.row)"
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
			
			<!-- 创建收费项 -->
			<el-dialog title="创建收费项" :visible.sync="addVisible" width="30%">
			    <el-form ref="itemForm" :model="adddata" :rules="irules" label-width="120px">
			        <el-form-item label="收费类型" prop="payItemType">
						<el-select v-model="adddata.payItemType" placeholder="请选择收费类型">
						   <el-option
						         v-for="item in typeOptions"
						         :key="item.value"
						         :label="item.label"
						         :value="item.value">
						   </el-option>
						 </el-select>			        
			        </el-form-item>
					<el-form-item label="收费项名称" prop="payItemName">
					    <el-input v-model="adddata.payItemName"></el-input>
					</el-form-item>
					<el-form-item label="收费标识" prop="payItemPeriod">
						<el-select v-model="adddata.payItemPeriod" placeholder="请选择收费标识">
						   <el-option
						         v-for="item in periodOptions"
						         :key="item.value"
						         :label="item.label"
						         :value="item.value">
						   </el-option>
						 </el-select>			        
					</el-form-item>					
					<el-form-item label="开始时间" prop="beginTime">
					   <div class="block">
					       <el-date-picker
					         v-model="adddata.beginTime"
					         type="datetime"
							 value-format="yyyy-MM-dd HH:mm:ss"
					         placeholder="选择开始时间">
					       </el-date-picker>
					     </div>
					</el-form-item>
					<el-form-item label="结束时间" prop="overTime">
					   <div class="block">
					       <el-date-picker
					         v-model="adddata.overTime"
					         type="datetime"
							 value-format="yyyy-MM-dd HH:mm:ss"
					         placeholder="选择结束时间">
					       </el-date-picker>
					     </div>
					</el-form-item>
					<el-form-item label="收费单价">
						<el-tooltip class="item" effect="light" content="计算公式=面积*单价+附加/固定费用" placement="right">
						    <el-input v-model="adddata.charStandard"></el-input>
						</el-tooltip>					    
					</el-form-item>
					<el-form-item label="附加/固定费用">
					    <el-input v-model="adddata.charOnce"></el-input>
					</el-form-item>
			    </el-form>
			    <span slot="footer" class="dialog-footer">
			        <el-button @click="addVisible = false">取 消</el-button>
			        <el-button type="primary" @click="saveAddPayItem">确 定</el-button>
			    </span>
			</el-dialog>
			
			<!-- 修改收费项 -->
			<el-dialog title="修改收费项" :visible.sync="editVisible" width="30%">
			    <el-form ref="form" :model="editdata" label-width="120px">
					<el-form-item label="收费项ID">
					    <el-input v-model="editdata.payItemId" disabled="true"></el-input>
					</el-form-item>
			        <el-form-item label="收费类型">
						<el-select v-model="editdata.payItemType" placeholder="请选择收费类型">
						   <el-option
						         v-for="item in typeOptions"
						         :key="item.value"
						         :label="item.label"
						         :value="item.value">
						   </el-option>
						 </el-select>			        
			        </el-form-item>
					<el-form-item label="收费项名称">
					    <el-input v-model="editdata.payItemName"></el-input>
					</el-form-item>
					<el-form-item label="收费标识">
						<el-select v-model="editdata.payItemPeriod" placeholder="请选择收费标识">
						   <el-option
						         v-for="item in periodOptions"
						         :key="item.value"
						         :label="item.label"
						         :value="item.value">
						   </el-option>
						 </el-select>			        
					</el-form-item>					
					<el-form-item label="开始时间">
					   <div class="block">
					       <el-date-picker
					         v-model="editdata.beginTime"
					         type="datetime"
							 value-format="yyyy-MM-dd HH:mm:ss"
					         placeholder="选择开始时间">
					       </el-date-picker>
					     </div>
					</el-form-item>
					<el-form-item label="结束时间">
					   <div class="block">
					       <el-date-picker
					         v-model="editdata.overTime"
					         type="datetime"
							 value-format="yyyy-MM-dd HH:mm:ss"
					         placeholder="选择结束时间">
					       </el-date-picker>
					     </div>
					</el-form-item>
					<el-form-item label="收费单价" >
						<el-tooltip class="item" effect="light" content="计算公式=面积*单价+附加/固定费用" placement="right">
						    <el-input v-model="editdata.charStandard"></el-input>
						</el-tooltip>					    
					</el-form-item>
					<el-form-item label="附加/固定费用">
					    <el-input v-model="editdata.charOnce"></el-input>
					</el-form-item>
			    </el-form>
			    <span slot="footer" class="dialog-footer">
			        <el-button @click="editVisible = false">取 消</el-button>
			        <el-button type="primary" @click="saveEditPayItem">确 定</el-button>
			    </span>
			</el-dialog>
			
		</div>
		
	</div>
</template>

<script>
	import {getPayItemData} from '../../../api/payItem.js'
	import {addPayItem} from '../../../api/payItem.js'
	import {deletePayItem} from '../../../api/payItem.js'
	import {updatePayItem} from '../../../api/payItem.js'
	
	export default{
		name: 'payment',
		data() {
			return {
				periodOptions: [
					{
					   value: '一次性收费',
					   label: '一次性收费'
					},{
					   value: '周期性收费',
					   label: '周期性收费'
					}
				],
				typeOptions: [
					{
					   value: '物业费',
					   label: '物业费'
					},{
					   value: '地上出租车位费',
					   label: '地上出租车位费'
					},{
					   value: '地下出租车位费',
					   label: '地下出租车位费'
					},{
					   value: '地上出售车位费',
					   label: '地上出售车位费'
					},{
					   value: '地下出售车位费',
					   label: '地下出售车位费'
					},{
					   value: '临时停车费',
					   label: '临时停车费'
					}
				],
				querydata: {
					page: 1,
					rows: 5,
					payItemType: '',
					payItemName: '',
					payItemPeriod: ''
					
				},
				adddata: {
					payItemType: '',
					payItemName: '',
					payItemPeriod: '',
					beginTime: '',
					overTime: '',
					charStandard: '',
					charOnce: ''
				},
				editdata: {
					payItemId: '',
					payItemType: '',
					payItemName: '',
					payItemPeriod: '',
					beginTime: '',
					overTime: '',
					charStandard: '',
					charOnce: ''
				},
				irules:{
					"payItemType" : [
						   { required: true, message: '请选择收费类型', trigger: 'change' },
						  ],
					"payItemName" : [
						   { required: true, message: '请输入收费项目名称', trigger: 'blur' },
						  ],
					"payItemPeriod" : [
						   { required: true, message: '请选择收费标识', trigger: 'change' },
						  ],
					"beginTime" : [
						   { required: true, message: '请选择开始时间', trigger: 'change' },
						  ],
					"overTime" : [
						   { required: true, message: '请选择结束时间', trigger: 'change' },
						  ]			
				},
				loading: true,
				tableData: [],
				pageTotal: 0,
				multipleSelection: [],
				delList: [],
				addVisible: false,
				editVisible: false
			}
		},
		created() {
			this.getData()
		},
		methods: {
			getData() {
				getPayItemData(this.querydata).then(res=>{
					this.tableData = res.data;
					this.pageTotal = res.total;
					this.loading = false
				})				
			},
			handleSearch(){
				this.getData()
			},
			addPayItem(){
				this.addVisible = true
			},
			saveAddPayItem(){
				this.$refs.itemForm.validate((valid) => {
				         if (valid) {
				          addPayItem(this.adddata).then(res=>{
				          	if(res>0){
				          		this.$message.success('创建成功');
				          		 this.getData();
				          	}else{
				          		this.$message.error('创建失败');
				          	}
				          })
				          this.addVisible = false
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
							this.delList.push(this.multipleSelection[i].payItemId);
						}
						console.log(this.delList);
						deletePayItem(this.delList).then(res=>{
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
			editPayItem(index,row){
				this.editVisible = true;
				this.editdata = row;
			},
			saveEditPayItem(){
				updatePayItem(this.editdata).then(res=>{
					if(res>0){
						this.$message.success('修改成功');
						 this.getData();
					}else{
						this.$message.error('修改失败');
					}
				})
				this.editVisible = false;
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
