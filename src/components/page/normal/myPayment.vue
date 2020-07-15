<template>
	<div>	
		<div class="container">
			<div class="handle-box">
				查询：
			    <el-input v-model="querydata.payItemName" placeholder="费用项名称" class="handle-input mr10"></el-input>
				
				    <el-date-picker
					class="handle-select"
				      v-model="bAndoTime"
					  @change = "selectDate"
				      type="daterange"
				      value-format="yyyy-MM-dd HH:mm:ss"
				      unlink-panels
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期"
				      :picker-options="pickerOptions">
				    </el-date-picker>
				 
			    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-radio-group 
				v-model="querydata.isPay" 
				class="handleispay"
				@change="changeIsPay">
				      <el-radio-button label="0">全部</el-radio-button>
				      <el-radio-button label="1">已缴费</el-radio-button>
				      <el-radio-button label="2">未缴费</el-radio-button>
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
			      <el-table-column prop="paymentId" label="缴费单ID" width="150"></el-table-column>
				<el-table-column prop="payItemName" label="费用项名称" width="120"></el-table-column>
				<el-table-column prop="roomNo" :formatter="roomNoFormatter" label="房屋号" width="150"></el-table-column>
				<el-table-column prop="ownerName" label="付费方" width="100"></el-table-column>
				<el-table-column prop="payable" label="应付金额" width="120"></el-table-column>
				<el-table-column prop="factPay" label="实付金额" width="120"></el-table-column>
				<el-table-column prop="beginTime" label="开始时间" width="160"></el-table-column>
				<el-table-column prop="overTime" label="结束时间" width="160"></el-table-column>
				<el-table-column prop="payTime" label="缴费时间" width="160" ></el-table-column>
				
				<el-table-column label="操作" width="100" align="center">
				    <template slot-scope="scope">
						<el-button
						v-show="scope.row.factPay == null"
						@click="handlePay(scope.$index,scope.row)"
						>缴费</el-button>			        
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

		<!-- 缴费弹出框 -->
		<el-dialog title="缴费" :visible.sync="payVisible" width="30%">
		    <el-form ref="form" :model="paydata" label-width="90px">
				<el-form-item label="收费单ID">
				    <el-input v-model="paydata.paymentId" disabled="true"></el-input>
				</el-form-item>	
		        <el-form-item label="费用项名称">
					<span>{{showdata.payItemName}}</span>
		        </el-form-item>				
				<el-form-item label="付费方">
					<span>{{showdata.ownerName}}</span>
				</el-form-item>
				<el-form-item label="应付金额">
					<span style="color: red;"><strong>¥{{showdata.payable}}</strong></span>				   
				</el-form-item>
				<el-form-item label="实付金额">
				    <el-input v-model="paydata.factPay"></el-input>
				</el-form-item>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="payVisible = false">取 消</el-button>
		        <el-button type="warning" @click="saveHandlePay">模拟缴费</el-button>
		    </span>
		</el-dialog>
			
		</div>
	</div>	
</template>

<script>
	import {getOwnerPaymentListData} from '../../../api/paymentList.js'
	import {payPayment} from '../../../api/paymentList.js'
	
	export default{
		name: 'paymentList',
		data() {
			return {
				querydata: {
					page: 1,
					rows: 5,
					payItemName: '',
					beginTime: '',
					overTime: '',
					isPay: '0',
					userId : ''
				},
				paydata: {
					paymentId: '',
					factPay: ''
				},
				showdata: {
					payItemName: '',
					ownerName: '',
					payable: '',
				},
				pickerOptions: {
				          shortcuts: [{
				            text: '最近一周',
				            onClick(picker) {
				              const end = new Date();
				              const start = new Date();
				              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
				              picker.$emit('pick', [start, end]);
				            }
				          }, {
				            text: '最近一个月',
				            onClick(picker) {
				              const end = new Date();
				              const start = new Date();
				              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
				              picker.$emit('pick', [start, end]);
				            }
				          }, {
				            text: '最近三个月',
				            onClick(picker) {
				              const end = new Date();
				              const start = new Date();
				              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
				              picker.$emit('pick', [start, end]);
				            }
				          }]
				        },
				loading: true,
				tableData: [],
				pageTotal: 0,
				bAndoTime: [],
				payVisible: false
			}
		},
		created() {
			
			this.getData()
		},
		methods: {
			getData(){
				this.querydata.userId = this.$cookies.get('userid');
				getOwnerPaymentListData(this.querydata).then(res=>{
					this.tableData = res.data;
					this.pageTotal = res.total;
					this.loading = false
				})
			},
			handleSearch(){
				this.getData()
			},
			roomNoFormatter(row,column){
				if(typeof(row.bulidingNo)=='undefined'){
					return ''
				}else{
					return row.bulidingNo+'号楼'+row.unitNo+'单元'+row.roomNo+'室'
				}	
			},
			selectDate(bAndoTime) {
				this.querydata.beginTime = bAndoTime[0];
				this.querydata.overTime = bAndoTime[1];
			},
			changeIsPay(val){
				this.getData()
			},
			handlePay(index,row){
				this.payVisible = true;
				this.paydata.paymentId = row.paymentId;
				this.showdata.payItemName = row.payItemName;
				this.showdata.ownerName = row.ownerName;
				this.showdata.payable = row.payable;
			},
			saveHandlePay(){
				payPayment(this.paydata).then(res=>{
					if(res>0){
						this.$notify({
						          title: '付费成功',
						          message: this.showdata.ownerName +' 已付费：'+this.paydata.factPay,
						          type: 'success'
						        });
						this.payVisible = false;
						this.getData();
					}else{
						this.$notify.error({
						          title: '付费失败',
						          message: this.showdata.ownerName +' 付费失败',
						        });
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
	.handle-input {
	    width: 200px;
	    display: inline-block;
	}
	.handle-select {
		margin-right: 10px;
	    display: inline-block;
	}
	.handleispay {
		float: right;
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
