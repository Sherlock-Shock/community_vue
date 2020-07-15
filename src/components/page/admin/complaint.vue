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
			            投诉建议
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
				
			    <el-input v-model="querydata.complainter" placeholder="投诉人姓名" class="handle-input mr10"></el-input>
				<el-input v-model="querydata.comPhone" placeholder="联系电话" class="handle-input mr10"></el-input>				
			    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" icon="el-icon-plus" @click="addComplaint">投诉</el-button>
				<el-radio-group
				v-model="querydata.status" 
				class="handleisreview"
				@change="changeStatus">
				      <el-radio-button label=3>全部</el-radio-button>
				      <el-radio-button label=0>未处理</el-radio-button>
				      <el-radio-button label=1>处理中</el-radio-button>
					  <el-radio-button label=2>已处理</el-radio-button>
				</el-radio-group>
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
			    <el-table-column prop="complaintId" label="投诉单ID" width="180" align="center"></el-table-column>
			    <el-table-column prop="complainter" label="投诉人" width="180"></el-table-column>
				<el-table-column prop="roomNo" label="房屋编号" width="180"></el-table-column>
				<el-table-column prop="comPhone" label="联系电话" width="180"></el-table-column>
				<el-table-column prop="comTime" label="投诉时间" width="180"></el-table-column>
				<el-table-column prop="finishTime" :formatter="statusFormatter" label="投诉状态"></el-table-column>				
				
				<el-table-column label="操作" width="160" align="center">
				    <template slot-scope="scope">
						<el-button 
						type="success"
							v-show="scope.row.status!=2"							
						    @click="editComplaint(scope.$index, scope.row)"
						>修改</el-button>
						<el-button style="width: 95%;"
							v-show="scope.row.status==2"
						    @click="checkResult(scope.$index, scope.row)"
						>查看结果</el-button>
						<el-button 
							v-show="scope.row.status!=2"
							type="warning"
						    @click="handleReview(scope.$index, scope.row)"
						>审核</el-button>			        
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
			
			<!-- 新建投诉单 -->
			<el-dialog title="添加投诉" :visible.sync="addVisible" width="30%">
			    <el-form ref="comForm" :model="adddata" :rules="arules" label-width="120px">
					<el-form-item label="投诉人" prop="complainter">
						    <el-input v-model="adddata.complainter"></el-input>					    
					</el-form-item>
					<el-form-item label="房屋编号" prop="roomNo">
					    <el-input v-model="adddata.roomNo" placeholder="xx号楼xx单元xx室"></el-input>
					</el-form-item>
					<el-form-item label="联系电话" prop="comPhone">
						    <el-input v-model="adddata.comPhone"></el-input>					    
					</el-form-item>
					<el-form-item label="投诉内容" prop="comContent">
						    <el-input 
							type="textarea"
							:rows="3" v-model="adddata.comContent"></el-input>					    
					</el-form-item>
			    </el-form>
			    <span slot="footer" class="dialog-footer">
			        <el-button @click="addVisible = false">取 消</el-button>
			        <el-button type="primary" @click="saveAddComplaint">确 定</el-button>
			    </span>
			</el-dialog>
			
			<!-- 修改投诉单 -->
			<el-dialog title="修改投诉信息" :visible.sync="editVisible" width="30%">
			    <el-form ref="form" :model="editdata" label-width="120px">
					<el-form-item label="投诉人" >
						<el-input v-model="editdata.complainter"></el-input>											    
					</el-form-item>
					<el-form-item label="投诉电话">
					    <el-input v-model="editdata.comPhone"></el-input>
					</el-form-item>
					<el-form-item label="投诉内容">
					    <el-input 
						type="textarea"
						:rows="3" 
						v-model="editdata.comContent"></el-input>
					</el-form-item>
			    </el-form>
			    <span slot="footer" class="dialog-footer">
			        <el-button @click="editVisible = false">取 消</el-button>
			        <el-button type="primary" @click="saveEditComplaint">确 定</el-button>
			    </span>
			</el-dialog>
			
			<!-- 审核投诉单 -->
			<el-dialog title="审核投诉信息" :visible.sync="reviewVisible" width="30%">
			    <el-form ref="form" :model="reviewdata" label-width="120px">
					<el-form-item label="投诉内容">
					     <el-select v-model="reviewdata.status" placeholder="请选择状态">
					         <el-option
					               v-for="item in options"
					               :key="item.value"
					               :label="item.label"
					               :value="item.value">
					             </el-option>
					     </el-select>
					</el-form-item>
					<el-form-item label="投诉内容">
					    <span>
							{{comContent}}
						</span>
					</el-form-item>
					<el-form-item label="结果说明">
					    <el-input 
						type="textarea"
						:rows="3" 
						v-model="reviewdata.result"></el-input>
					</el-form-item>
			    </el-form>
			    <span slot="footer" class="dialog-footer">
			        <el-button @click="reviewVisible = false">取 消</el-button>
			        <el-button type="primary" @click="saveReviewComplaint">确 定</el-button>
			    </span>
			</el-dialog>
			
			<el-dialog
			  title="查看结果"
			  :visible.sync="resultVisible"
			  width="30%">
			  <span class="msg"><strong>投诉信息：</strong>{{resultdata.comContent}}</span>
			  <br /><br />
			  <span class="msg"><strong>结果说明：</strong>{{resultdata.result}}</span>
			  <span slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="resultVisible = false">确 定</el-button>
			  </span>
			</el-dialog>
			
		</div>
		
	</div>
</template>

<script>
	import {getComplaintData} from '../../../api/complaint.js'
	import {updateComplaint} from '../../../api/complaint.js'
	import {deleteComplaint} from '../../../api/complaint.js'
	import {addComplaint} from '../../../api/complaint.js'
	import {reviewComplaint} from '../../../api/complaint.js'
	
	
	
	export default{
		name: '',
		data() {
			return {				
				querydata: {
					page: 1,
					rows: 5,
					complainter: '',
					comPhone: '',
					status: 3
				},
				adddata: {
					complainter: '',
					roomNo: '',
					comContent: '',
					comPhone: ''
				},
				editdata: {
					complaintId: '',
					complainter: '',
					comPhone: '',
					comContent: ''
				},
				reviewdata: {
					complaintId: '',
					status: null,
					result: ''
					
				},
				resultdata: {
					
				},
				options: [{
				          value: '1',
				          label: '处理中'
				        }, {
				          value: '2',
				          label: '已处理'
				        }
				        ],
				arules:	{
					"complainter" : [
						   { required: true, message: '请输入投诉者姓名', trigger: 'blur' },
						  ],
					"roomNo" : [
						   { required: true, message: '请输入具体房屋编号', trigger: 'blur' },
						  ],
					"comContent" : [
						   { required: true, message: '请输入投诉内容', trigger: 'blur' },
						  ],
					"comPhone" : [
						   { required: true, message: '请输入联系电话', trigger: 'blur' },
						  ]
										
				},	
				comContent: '',
				loading: true,
				tableData: [],
				pageTotal: 0,
				multipleSelection: [],
				delList: [],
				addVisible: false,
				editVisible: false,
				reviewVisible: false,
				resultVisible: false
			}
		},
		created() {
			this.getData()
		},
		methods: {
			getData() {
				getComplaintData(this.querydata).then(res=>{
					this.tableData = res.data;
					this.pageTotal = res.total;
					this.loading = false
				})				
			},
			statusFormatter(row,column){
				if(row.status == 0){
					return '未处理'
				}else if(row.status == 1){
					return '处理中'
				}else{
					return '处理完成'
				}
			},
			checkResult(index,row){
				this.resultdata.comContent = row.comContent;
				this.resultdata.result = row.result;
				this.resultVisible = true;
			},
			addComplaint(){
				this.addVisible = true;
			},
			saveAddComplaint(){
				this.$refs.comForm.validate((valid) => {
				         if (valid) {
				          addComplaint(this.adddata).then(res=>{
				          	if(res>0){
				          		this.$message.success('投诉成功');
				          		 this.getData();
				          	}else{
				          		this.$message.error('投诉失败');
				          	}
				          	this.addVisible = false;
				          })
				         } else {
				           console.log('error submit!!');
				           return false;
				         }
				       });			
			},
			editComplaint(index,row){
				this.editVisible = true;
				this.editdata.complaintId = row.complaintId;
				this.editdata.comPhone = row.comPhone;
				this.editdata.complainter = row.complainter;
				this.editdata.comContent = row.comContent;
				
			},
			saveEditComplaint(){
				updateComplaint(this.editdata).then(res=>{
					if(res>0){
						this.$message.success('修改投诉单成功');
						 this.getData();
					}else{
						this.$message.error('修改失败');
					}
					this.editVisible = false;
				})
			},
			handleReview(index,row){
				this.reviewVisible = true;
				this.comContent = row.comContent;
				this.reviewdata.complaintId = row.complaintId;
			},
			saveReviewComplaint(){
				reviewComplaint(this.reviewdata).then(res=>{
					if(res>0){
						this.$message.success('审核成功');
						 this.getData();
					}else{
						this.$message.error('审核失败');
					}
				})
				this.reviewVisible = false;
			},
			handleSearch(){
				this.getData()
			},			
			changeStatus(val){
				this.getData()
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
							this.delList.push(this.multipleSelection[i].complaintId);
						}
						console.log(this.delList);
						deleteComplaint(this.delList).then(res=>{
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
	.msg{
		font-size: 20px;
	}
	.handleisreview{
		float: right;
	}
</style>
