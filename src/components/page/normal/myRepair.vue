<template>
	<div>
		<div class="container" v-show="showdata==''">暂无数据</div>
		<div class="container" v-for="item in showdata">
			<el-row>
			  <el-col :span="9">报修内容：{{item.reason}}</el-col>
			  <el-col :span="9">房屋编号：{{item.roomNo}}</el-col>
			  <el-col :span="6" style="color: royalblue;">预约时间：{{item.appTime}}</el-col>
			</el-row>
			<br />
			<el-row>
			  <el-col :span="9">联系电话：{{item.phone}}</el-col>
			  <el-col :span="9" style="color: red;">状态：{{statusMessage(item.status)}}</el-col>
			  <el-col :span="6">
				  <el-button type="text" size="medium" @click="checkResult(item.repairNo)">查看详情</el-button>
			  </el-col>
			</el-row>
		</div>
		<!-- 结果 -->
		<el-dialog title="详情" :visible.sync="resultVisible" width="40%">
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
				<el-form-item label="状态">
				    {{statusMessage(showresultdata.status)}}
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
</template>

<script>
	import {getOwnerIdByPhone} from '../../../api/owner.js'
	import {getRepairListByOwnerId} from '../../../api/repair.js'
	import {getRepairDetailData} from '../../../api/repair.js'
	
	export default{
		name: 'myRepair',
		data() {
			return {
				querydata: {
					page: 1,
					rows: 10,
					ownerId: ''
				},
				queryonedata:{
					repairNo: ''
				},
				activities: [],
				showdata: [],
				ststusshow: '',
				showresultdata:{
					repairNo: '',
					roomNo: '',
					rtime: '',	
					appTime: '',
					finishTime: '',
					reason: '',
					workerName: '',
					workerPhone: '',
					mark: '',
					status: ''
				},
				resultVisible: false
			}
		},
		created() {
			getOwnerIdByPhone(this.$cookies.get('userid')).then(res=>{
				this.querydata.ownerId = res.data
				this.getData()
			})
		},		
		methods: {
			getData() {
				getRepairListByOwnerId(this.querydata).then(res=>{
					this.showdata = res.data
				})
			},
			statusMessage(status){
				if(status=='0'){
					return '未派单'
				}else if(status=='1'){
					return '处理中'
				}else{
					return '处理完成'
				}
			},
			checkResult(val){
				this.resultVisible = true;
				this.queryonedata.repairNo = val;
				getRepairDetailData(this.queryonedata).then(res=>{
					this.showresultdata = res.data
					this.$set(this.activities,0,{ content: '上报时间',timestamp:res.data.rtime, size: 'large', color: '#FF4500'});
					this.$set(this.activities,1,{ content: '预约时间',timestamp:res.data.appTime, size: 'large', color: '#1E90FF'});
					if(res.data.finishTime==null){
						this.$set(this.activities,2,{ content: '处理中', size: 'large', color: '#ebb563'});
					}else{
						this.$set(this.activities,2,{ content: '完成维修',timestamp:res.data.finishTime, size: 'large', color: '#0bbd87'});
					}
				});
			}
		},
		
	}
</script>

<style>
</style>
