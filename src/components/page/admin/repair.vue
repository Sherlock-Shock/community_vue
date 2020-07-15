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
			            报修管理
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
				
			    <el-input v-model="querydata.ownerName" placeholder="报修人" class="handle-input mr10"></el-input>
				<el-input v-model="querydata.phone" placeholder="报修电话" class="handle-input mr10"></el-input>	
				 <el-select clearable  v-model="querydata.status" placeholder="请选择报修状态" class="handle-select">
				    <el-option
				          v-for="item in options"
				          :key="item.value"
				          :label="item.label"
				          :value="item.value">
				    </el-option>
				  </el-select>
			    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" icon="el-icon-plus" @click="addRepair">报修</el-button>
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
			    <el-table-column prop="repairNo" label="报修单ID" width="190" align="center"></el-table-column>
			    <el-table-column prop="ownerName" label="报修人" width="150"></el-table-column>
				<el-table-column prop="phone" label="联系电话" width="160"></el-table-column>
				<el-table-column prop="appTime" label="预约时间" width="180"></el-table-column>
				<el-table-column prop="workerName" label="维修师傅" width="150"></el-table-column>
				<el-table-column prop="status" width="150" :formatter="statusFormate" label="状态"></el-table-column>
				
				<el-table-column label="操作"  >
				    <template slot-scope="scope">
						<el-button
						type="success"
							v-show="scope.row.status==0"							
						    @click="editRepair(scope.$index, scope.row)"
						>修改</el-button>
						<el-button 
							v-show="scope.row.status==0"
							type="warning"
						    @click="handleSend(scope.$index, scope.row)"
						>派单</el-button>
						<el-button
							v-show="scope.row.status==1"
							type="info"
						    @click="handleCheck(scope.$index, scope.row)"
						>详  情</el-button>
						<el-button 
							v-show="scope.row.status==2"
						    @click="checkResult(scope.$index, scope.row)"
						>查看信息</el-button>						
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
			
			<!-- 创建保修单 -->
			<el-dialog title="新添报修" :visible.sync="addVisible" width="30%">
				<el-dialog title="选择业主" :visible.sync="OwnerVisible" append-to-body width="60%">
					<div>
					<el-input v-model="queryownerdata.ownerName" placeholder="姓名" class="handle-input mr10" style="width: 88%;margin-bottom: 12px;"></el-input>
					<el-button type="primary" icon="el-icon-search" @click="handleOwnerSearch">搜索</el-button>	
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
				
			    <el-form ref="repForm" :model="adddata" :rules="rrules" label-width="120px">					
					<el-form-item label="选择业主">
						 {{adddata.ownerName}}
						 <el-button  size="small" type="primary" @click="selectOwner" icon="el-icon-circle-plus" style="float: right;">选择业主</el-button>
					</el-form-item>
					<el-form-item label="房屋编号" prop="roomNo">
					    <el-input v-model="adddata.roomNo" placeholder="xx号楼xx单元xx室"></el-input>
					</el-form-item>
					<el-form-item label="预约时间" prop="appTime">
					    <div class="block">
					        <el-date-picker
					          v-model="adddata.appTime"
					          type="datetime"
					    	  value-format="yyyy-MM-dd HH:mm:ss"
					          placeholder="选择预约时间">
					        </el-date-picker>
					      </div>
					</el-form-item>
					<el-form-item label="联系电话" prop="phone">
					    <el-input v-model="adddata.phone"></el-input>
					</el-form-item>
					<el-form-item label="报修事项" prop="reason">
					   <el-input type="textarea"
					   	:rows="3" v-model="adddata.reason"></el-input>
					</el-form-item>
			    </el-form>
			    <span slot="footer" class="dialog-footer">
			        <el-button @click="addVisible = false">取 消</el-button>
			        <el-button type="primary" @click="saveAddRepair">确 定</el-button>
			    </span>
			</el-dialog>
			
			<!-- 修改报修信息 -->
			<el-dialog title="修改报修信息" :visible.sync="editVisible" width="30%">
			    <el-form ref="form" :model="editdata" label-width="120px">
					<el-form-item label="报修单ID">
					    <el-input v-model="editdata.repairNo" disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="报修人" >
					    <el-input v-model="editdata.ownerName" disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="联系电话">
					    <el-input v-model="editdata.phone"></el-input>
					</el-form-item>
					<el-form-item label="房屋编号">
					    <el-input v-model="editdata.roomNo"></el-input>
					</el-form-item>
					<el-form-item label="预约时间">
					    <div class="block">
					        <el-date-picker
					          v-model="editdata.appTime"
					          type="datetime"
					    	  value-format="yyyy-MM-dd HH:mm:ss"
					          placeholder="选择预约时间">
					        </el-date-picker>
					      </div>
					</el-form-item>
					<el-form-item label="报修事项">
					    <el-input type="textarea"
							:rows="3" v-model="editdata.reason"></el-input>
					</el-form-item>					
			    </el-form>
			    <span slot="footer" class="dialog-footer">
			        <el-button @click="editVisible = false">取 消</el-button>
			        <el-button type="primary" @click="saveEditRepair">确 定</el-button>
			    </span>
			</el-dialog>
			
			<!-- 派单 -->
			<el-dialog title="派单" :visible.sync="sendVisible" width="30%">
			    <el-form ref="sendForm" :model="senddata" :rules="sendRules" label-width="120px">
					<el-form-item label="报修单ID">
					    <el-input v-model="senddata.repairNo" disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="维修师傅" prop="workerName">
					    <el-input v-model="senddata.workerName"></el-input>
					</el-form-item>					
					<el-form-item label="联系电话" prop="workerPhone">
					    <el-input v-model="senddata.workerPhone"></el-input>
					</el-form-item>				
			    </el-form>
			    <span slot="footer" class="dialog-footer">
			        <el-button @click="sendVisible = false">取 消</el-button>
			        <el-button type="primary" @click="saveHandleSend">确 定</el-button>
			    </span>
			</el-dialog>
			<!-- 详情 -->
			<el-dialog title="报修详情" :visible.sync="checkVisible" width="40%">
			    <el-form ref="form" :model="senddata"  label-width="140px">
					<el-form-item label="报修单ID">
					    {{showdetaildata.repairNo}}
					</el-form-item>
					<el-form-item label="报修人" >
					    {{showdetaildata.ownerName}}
					</el-form-item>
					<el-form-item label="联系电话">
						{{showdetaildata.phone}}
					</el-form-item>
					<el-form-item label="房屋编号">
						{{showdetaildata.roomNo}}
					</el-form-item>
					<el-form-item label="预约时间">
					    {{showdetaildata.appTime}}
					</el-form-item>
					<el-form-item label="报修事项">
					    <el-input type="textarea" disabled="true"
							:rows="3" v-model="showdetaildata.reason"></el-input>
					</el-form-item>
					<el-form-item label="状态">
					    处理中
					</el-form-item>
					<el-form-item label="维修师傅" >
					    {{showdetaildata.workerName}}
					</el-form-item>					
					<el-form-item label="维修师傅联系电话" >
					   {{showdetaildata.workerPhone}}
					</el-form-item>	
					<el-form-item label="备注" >
					   <el-input type="textarea"
					   	:rows="3" v-model="finishdata.mark"></el-input>
					</el-form-item>				
			    </el-form>
			    <span slot="footer" class="dialog-footer">
			        <el-button @click="checkVisible = false">取 消</el-button>
			        <el-button type="warning" @click="saveHandleCheck">完成维修</el-button>
			    </span>
			</el-dialog>
			
			<!-- 结果 -->
			<el-dialog title="结果" :visible.sync="resultVisible" width="40%">
			    <el-form ref="form" :model="showresultdata"  label-width="140px">										
					<el-form-item label="时间线">
						<el-timeline >
						    <el-timeline-item
						      v-for="(activity, index) in activities"
						      :key="index"
							  :color="activity.color"
							  :size="activity.size"
						      :timestamp="activity.timestamp">
						      {{activity.content}}
						    </el-timeline-item>
						  </el-timeline>
					</el-form-item>
					<el-form-item label="房屋编号">
						{{showresultdata.roomNo}}
					</el-form-item>
					<el-form-item label="报修事项">
					    <el-input type="textarea"
							:rows="3" v-model="showresultdata.reason"></el-input>
					</el-form-item>
					<el-form-item label="状态">
					    已处理完成
					</el-form-item>
					<el-form-item label="维修师傅" >
					    {{showresultdata.workerName}}
					</el-form-item>					
					<el-form-item label="维修师傅联系电话" >
					   {{showresultdata.workerPhone}}
					</el-form-item>	
					<el-form-item label="备注" >
					   <el-input type="textarea" 
					   	:rows="3" v-model="showresultdata.mark"></el-input>
					</el-form-item>				
			    </el-form>
			    <span slot="footer" class="dialog-footer">
			        <el-button @click="resultVisible = false">确定</el-button>
			    </span>
			</el-dialog>
			
		</div>
		
	</div>
</template>

<script>
  import {getRepairListData} from '../../../api/repair.js'
  import {getRepairDetailData} from '../../../api/repair.js'
  import {deleteRepairs} from '../../../api/repair.js'
  import {getRepairedOne} from '../../../api/repair.js'
  import {finishRepair} from '../../../api/repair.js'
  import {updateRepair} from '../../../api/repair.js'
  import {addRepair} from '../../../api/repair.js'
  import {addRepaired} from '../../../api/repair.js'
  import {getOwnerData} from '../../../api/owner.js'
	export default{

		name: '',
		data() {
			return {
				options: [{
				          value: '0',
				          label: '未派单'
				        }, {
				          value: '1',
				          label: '处理中'
				        }, {
				          value: '2',
				          label: '处理完成'
				        }],
				sendRules:{
					workerName: [
					       { required: true, message: '请输入维修师傅姓名', trigger: 'blur' },
					      ],
					workerPhone: [
					       { required: true, message: '请输入联系电话', trigger: 'blur' }
					      ]
				},
				rrules:{
					roomNo: [
					       { required: true, message: '请输入具体房屋编号', trigger: 'blur' },
					      ],
					appTime: [
					       { required: true, message: '请选择预约时间', trigger: 'blur' }
					      ],
					phone: [
					       { required: true, message: '请输入联系电话', trigger: 'blur' }
					      ],
					reason: [
					       { required: true, message: '请输入报修事项', trigger: 'blur' }
					      ],			
				},
				activities: [{
				          content: '上报时间',
				          timestamp: ''
				        }, {
				          content: '预约时间',
				          timestamp: ''
				        }, {
				          content: '完成维修',
				          timestamp: ''
				        }],		
				querydata: {
					page: 1,
					rows: 5,
					ownerName: '',
					phone: '',
					status: ''
					
				},
				queryownerdata: {
					page: 1,
					rows: 5,
					ownerName: '',
					idCard: '',
					phone: ''
				},
				queryonedata:{
					repairNo: ''
				},
				showdetaildata:{
					repairNo: '',
					ownerName: '',
					roomNo: '',
					appTime: '',
					reason: '',
					phone: '',
					workerName: '',
					workerPhone: ''
				},
				showresultdata:{
					repairNo: '',
					roomNo: '',
					rtime: '',	
					appTime: '',
					finishTime: '',
					reason: '',
					workerName: '',
					workerPhone: '',
					mark: ''
				},
				finishdata: {
					repairNo: '',
					mark: ''
				},
				adddata: {
					ownerId: '',
					ownerName: '',
					roomNo: '',
					appTime: '',
					reason: '',
					phone: ''
				},
				editdata: {
					repairNo: '',
					ownerName: '',
					roomNo: '',
					appTime: '',
					reason: '',
					phone: ''
				},
				senddata: {
					repairNo: '',
					workerName: '',
					workerPhone: ''
				},
				loading: true,
				tableData: [],
				ownerData: [],
				pageTotal: 0,
				ownerPageTotal: 0,
				multipleSelection: [],
				delList: [],
				addVisible: false,
				editVisible: false,
				OwnerVisible: false,
				sendVisible: false,
				checkVisible: false,
				resultVisible: false
			}
		},
		created() {
			this.getData()
		},
		methods: {
			getData() {
				getRepairListData(this.querydata).then(res=>{
					this.tableData = res.data;
					this.pageTotal = res.total;
					this.loading = false
				})				
			},
			getOwnersData(){
				getOwnerData(this.queryownerdata).then(res=>{
					this.ownerData = res.data;
					this.ownerPageTotal = res.total;
				});	
			},
			statusFormate(row,column){
				if(row.status==0){
					return '未派单'
				}else if(row.status==1){
					return '处理中'
				}else{
					return '处理完成'
				}
			},
			handleSearch(){
				this.getData()
			},
			handleOwnerSearch(){
				this.getOwnersData()
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
							this.delList.push(this.multipleSelection[i].repairNo);
						}
						console.log(this.delList);
						deleteRepairs(this.delList).then(res=>{
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
			selectOwner(){
				this.OwnerVisible = true;
				this.getOwnersData();
			},
			selectedOwner(index,row){
				this.adddata.ownerId = row.ownerId;
				this.adddata.ownerName = row.ownerName;
				this.OwnerVisible = false;
			},
			addRepair(){
				this.addVisible = true;
			},
			saveAddRepair(){
				this.$refs.repForm.validate((valid) => {
				         if (valid) {
							  addRepair(this.adddata).then(res=>{
								if(res>0){
									this.$message.success('报修成功');
									 this.getData();
								}else{
									this.$message.error('报修失败');
								}
							  })
							  this.addVisible = false;
				         } else {
				           console.log('error submit!!');
				           return false;
				         }
				       });
				
				
			},
			editRepair(index,row){
				this.editVisible = true;
				this.editdata = row;
			},
			saveEditRepair(){
				updateRepair(this.editdata).then(res=>{
					if(res>0){
						this.$message.success('修改成功');
						 this.getData();
					}else{
						this.$message.error('修改失败');
					}
				})
				this.editVisible = false
			},
			handleSend(index,row){
				this.sendVisible = true;
				this.senddata.repairNo = row.repairNo
			},
			saveHandleSend(){
				 this.$refs.sendForm.validate((valid) => {
				          if (valid) {
				           addRepaired(this.senddata).then(res=>{
							 if(res>0){
							 	this.$message.success('派单成功');
							 	 this.getData();
							 }else{
							 	this.$message.error('派单失败');
							 }  
						   })
						  this.sendVisible = false
				          } else {
				            console.log('error submit!!');
				            return false;
				          }
				 });
			},
			handleCheck(index,row){
				this.checkVisible = true;
				this.queryonedata.repairNo = row.repairNo;
				this.showdetaildata.repairNo = row.repairNo;
				this.showdetaildata.ownerName = row.ownerName;
				this.showdetaildata.appTime = row.appTime;
				this.showdetaildata.phone = row.phone;
				this.showdetaildata.roomNo = row.roomNo;
				this.showdetaildata.reason = row.reason;
				getRepairedOne(this.queryonedata).then(res=>{
					this.showdetaildata.workerName = res.data.workerName;
					this.showdetaildata.workerPhone = res.data.workerPhone;
				});
				this.finishdata.repairNo = row.repairNo;
			},
			saveHandleCheck(){
				finishRepair(this.finishdata).then(res=>{
					if(res>0){
						this.$message.success('已完成报修');
						 this.getData();
					}else{
						this.$message.error('提交失败');
					}  
				})
				this.checkVisible = false;
			},
			checkResult(index,row){
				this.resultVisible = true;
				this.queryonedata.repairNo = row.repairNo;
				getRepairDetailData(this.queryonedata).then(res=>{
					this.showresultdata = res.data
					this.$set(this.activities,0,{ content: '上报时间',timestamp:res.data.rtime, size: 'large', color: '#FF4500'});
					this.$set(this.activities,1,{ content: '预约时间',timestamp:res.data.appTime, size: 'large', color: '#1E90FF'});
					this.$set(this.activities,2,{ content: '完成维修',timestamp:res.data.finishTime, size: 'large', color: '#0bbd87'});
				});
				//alert(this.showresultdata.rtime)
				
			},
			handlePageChange(val){
				this.$set(this.querydata, 'page', val);
				this.getData();
			},
			handleOwnerPageChange(val) {
			    this.$set(this.queryownerdata, 'page', val);
			    this.getOwnersData()
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
