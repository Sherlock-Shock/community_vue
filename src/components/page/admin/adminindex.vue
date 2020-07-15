<template>
    <div>
       
        <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ownerNum}}</div>
                                    <div>业主总数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-home grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{houseNum}}</div>
                                    <div>房屋总数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-truck grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{parkingNum}}</div>
                                    <div>车位总数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
        <el-card shadow="hover" style="height:403px;margin-bottom: 20px;">
                    <div slot="header" class="clearfix">
                        <span>欠费信息</span>
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
                        <el-table-column prop="payItemType" label="费用项类型" width="140"></el-table-column>
                    	<el-table-column prop="payItemName" label="费用项名称" width="140"></el-table-column>
                    	<el-table-column prop="ownerName" label="付费方" width="120"></el-table-column>
                    	<el-table-column prop="payable" label="应付金额" width="120"></el-table-column>
                    	<el-table-column prop="beginTime" label="费用开始时间" ></el-table-column>
                    	<el-table-column prop="overTime" label="费用到期时间" ></el-table-column>                  								
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
        </el-card>
           
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart class="schart" :canvasId="pie1" :options="houseOptions"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart class="schart" :canvasId="pie2" :options="parkingOptions"></schart>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
	import {getOwnerTotal} from '../../../api/owner.js'
	import {getHouseTotal} from '../../../api/house.js'
	import {getHousePie} from '../../../api/house.js'
	import {getParkingTotal} from '../../../api/parking.js'
	import {getParkingPie} from '../../../api/parking.js'
	import {getPaymentListData} from '../../../api/paymentList.js'
	
import Schart from 'vue-schart';
import bus from '../../common/bus';
export default {
    name: 'dashboard',
    data() {
        return {
            name: this.$cookies.get('userid'),
			ownerNum: 0,
			houseNum: 0,
			parkingNum: 0,
			querydata: {
				page: 1,
				rows: 5,
				payItemName: '',
				beginTime: '',
				overTime: '',
				isPay: '2'
			},
			loading: true,
			tableData: [],
			pageTotal: 0, 
			pie1: 'p1',
			pie2: 'p2',
			
			houseOptions: {
			    type: 'pie',
			    title: {
			        text: '房屋状态饼状图'
			    },
			    legend: {
			        position: 'left'
			    },
			    bgColor: '#fbfbfb',
			    labels: ['已出售', '已出租', '空闲'],
			    datasets: [
			        {
			            data: [0,0,0]
			        }
			    ]
			},
			parkingOptions: {
				type: 'pie',
				title: {
				    text: '车位状态饼状图'
				},
				legend: {
				    position: 'right'
				},
				bgColor: '#fbfbfb',
				labels: ['已出售', '已出租', '空闲'],
				datasets: [
				    {
				        data: [0,0,0]
				    }
				]
			}  
            
        };
    },
    components: {
        Schart
    },
    computed: {
    },
    created() {
        this.getTotalData();
		this.getPaymentList();
    },
    methods: {
		getTotalData(){
			getOwnerTotal().then(res=>{
				this.ownerNum = res
			})
			getHouseTotal().then(res=>{
				this.houseNum = res
			})
			getParkingTotal().then(res=>{
				this.parkingNum = res
			})
			getHousePie().then(res=>{
				this.houseOptions.datasets[0].data.splice(0,1,res.sold)
				this.houseOptions.datasets[0].data.splice(1,1,res.rent)
				this.houseOptions.datasets[0].data.splice(2,1,res.free)
			})
			getParkingPie().then(res=>{
				this.parkingOptions.datasets[0].data.splice(0,1,res.sold)
				this.parkingOptions.datasets[0].data.splice(1,1,res.rent)
				this.parkingOptions.datasets[0].data.splice(2,1,res.free)
			})
		},
		getPaymentList(){
			getPaymentListData(this.querydata).then(res=>{
				this.tableData = res.data;
				this.pageTotal = res.total;
				this.loading = false
			})
		},
		handlePageChange(val){
			this.$set(this.querydata, 'page', val);
			this.getPaymentList();
		}
        
    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>
