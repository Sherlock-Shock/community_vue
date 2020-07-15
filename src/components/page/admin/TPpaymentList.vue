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
			            临时停车缴费清单
			        </el-breadcrumb-item>
			    </el-breadcrumb>			
		</div>
		<div class="container">
			<div class="handle-box">
				查询：
			    <el-input v-model="querydata.licenseNo" placeholder="车牌号" class="handle-input mr10"></el-input>
				
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
				
			</div>
			<el-table
			v-loading="loading"
			    :data="tableData"
			    stripe
			    class="table"
			    ref="multipleTable"				
			    header-cell-class-name="table-header"
			>
			    <el-table-column prop="paymentId" label="缴费单ID" width="170" ></el-table-column>
			    <el-table-column prop="payItemType" label="费用项类型" width="160"></el-table-column>
				<el-table-column prop="payItemName" label="费用项名称" width="160"></el-table-column>
				<el-table-column prop="parkRecordId" label="进出场ID" width="160"></el-table-column>
				<el-table-column prop="parkingAreaId" label="停车场ID" width="100"></el-table-column>
				<el-table-column prop="licenseNo" label="车牌号" width="130"></el-table-column>
				<el-table-column prop="payable" label="金额" width="130"></el-table-column>
				<el-table-column prop="payTime" label="缴费时间" ></el-table-column>
									
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
	</div>	
</template>

<script>
	import {getTPPaymentList} from '../../../api/parkTempPay.js'
	
	export default{
		name: 'paymentList',
		data() {
			return {
				querydata: {
					page: 1,
					rows: 5,
					payItemName: '',
					beginTime: '',
					overTime: ''
					
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
				bAndoTime: []
			}
		},
		created() {
			this.getData()
		},
		methods: {
			getData(){
				getTPPaymentList(this.querydata).then(res=>{
					this.tableData = res.data;
					this.pageTotal = res.total;
					this.loading = false
				})
			},
			handleSearch(){
				this.getData()
			},
			selectDate(bAndoTime) {
				this.querydata.beginTime = bAndoTime[0];
				this.querydata.overTime = bAndoTime[1];
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
