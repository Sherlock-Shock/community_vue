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
	    	            公告管理
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
			    <el-input v-model="querydata.title" placeholder="搜索标题" class="handle-input mr10"></el-input>
			    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>	
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
			    <el-table-column type="selection" width="55" align="center"></el-table-column>
			    <el-table-column prop="noticeId" label="公告ID" width="180" ></el-table-column>
				<el-table-column prop="title" label="标题"></el-table-column>
				<el-table-column prop="publisher" label="发布者"></el-table-column>
				<el-table-column prop="publishTime" label="发布时间"></el-table-column>
			           
			    <el-table-column label="操作" width="180" align="center">
			        <template slot-scope="scope">
			           <el-button
			               @click="checkNotice(scope.$index, scope.row)"
			           >查看</el-button>
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
	</div>	
</template>

<script>
	import {getNoticeData} from '../../../api/notice.js'
	import {deleteNotice} from '../../../api/notice.js'
	
	
	export default{
		name: 'notice',
		data() {
			return {
				querydata: {
					page: 1,
					rows: 5,
					title: ''
				},
				loading: true,
				tableData: [],
				pageTotal: 0,
				multipleSelection: [],
				delList: []
			}
		},
		created() {
			this.getData()
		},
		methods: {
			getData() {
				getNoticeData(this.querydata).then(res=>{
					this.tableData = res.data;
					this.pageTotal = res.total;
					this.loading = false
				})	
			},
			handleSearch(){
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
							this.delList.push(this.multipleSelection[i].noticeId);
						}
						console.log(this.delList);
						deleteNotice(this.delList).then(res=>{
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
			checkNotice(index,row){
				this.$router.push('/notice?noticeId='+row.noticeId);
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
