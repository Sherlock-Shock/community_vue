<template>
    <div>
        <div class="container" style="margin-bottom: 10px;">
        	    <el-breadcrumb separator="/" style="font-size: 20px;">
        			<el-breadcrumb-item :to="{ path: '/adminindex' }">
        			   首页
        			</el-breadcrumb-item>
        			<el-breadcrumb-item>
        			    资产管理
        			</el-breadcrumb-item>
        	        <el-breadcrumb-item>
        	            单元信息
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
                
                <el-input v-model="querydata.number" placeholder="单元编号" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>				
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
                <el-table-column prop="unitId" label="单元ID" width="100" align="center"></el-table-column>
                <el-table-column prop="bulidingNo" label="楼栋编号"></el-table-column>
				<el-table-column prop="unitNo" label="单元编号"></el-table-column>
				<el-table-column prop="floor" label="层数"></el-table-column>
				<el-table-column prop="lift" label="是否有电梯"></el-table-column>
           
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                       <el-button
                           type="text"
                           icon="el-icon-edit"
                           @click="editUnit(scope.$index, scope.row)"
                       >修改</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
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


	<!-- 修改单元弹出框 -->
	<el-dialog title="修改单元" :visible.sync="editVisible" width="30%">
	    <el-form ref="form" :model="unitdata" label-width="70px">
	        <el-form-item label="单元编号">
	            <el-input v-model="unitdata.unitNo"></el-input>
	        </el-form-item>
			<el-form-item label="层数">
			    <el-input v-model="unitdata.floor"></el-input>
			</el-form-item>
			<el-form-item label="电梯">
			   <el-select v-model="unitdata.lift" placeholder="请选择">
			       <el-option
					v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
				   </el-option>
			     </el-select>
			</el-form-item>
	    </el-form>
	    <span slot="footer" class="dialog-footer">
	        <el-button @click="editVisible = false">取 消</el-button>
	        <el-button type="primary" @click="saveEditUnit">确 定</el-button>
	    </span>
	</el-dialog>


    </div>
</template>

<script>

import {getUnitData} from '../../../api/unit.js'
import {deleteUnits} from '../../../api/unit.js'
import {updateUnit} from '../../../api/unit.js'


export default {
    name: 'unit',
    data() {
        return {
			options: [{
			          value: '是',
			          label: '是'
			        }, {
			          value: '否',
			          label: '否'
			        }],
			liftvalue: '',
			querydata: {
				page: 1,
				rows: 5,
				number: ''
			},
			unitdata:{
				unitId: '',
				unitNo: '',
				floor: '',
				lift: ''
			},		
			buildingNo: '',
            tableData: [],
            multipleSelection: [],
            delList: [],
			delArray:[],
            editVisible: false,
            pageTotal: 0,
            form: {},
			loading: true
        };
    },
    created() {
        this.getData();
		
    },
    methods: {
        getData() {
				getUnitData(this.querydata.page,this.querydata.rows,this.querydata.number).then(res=>{
					console.log('前端接收的结果：'+res.data.code)
					this.tableData = res.data;
					this.pageTotal = res.total;
					this.loading=false;
				});			
        },
				
        // 触发搜索按钮
        handleSearch() {
            //this.$set(this.query, 'pageIndex', 1);
			getUnitData(this.querydata.page,this.querydata.rows,this.querydata.number).then(res=>{
				console.log('前端接收的结果：'+res)
				this.tableData = res.data;
				this.pageTotal = res.total;
			});	
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除 '+row.unitNo +'号单元吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
					deleteUnits(row.unitId).then(res=>{
						if(res>0){
							this.$message.success('删除成功');
							this.getData();
						}else{
							this.$message.error('删除失败');
						}
						
					})                    
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
			//console.log(val);
			//this.$message.error('选中'+val);
        },
		//多选删除
        delAllSelection() {
			this.$confirm('确定要删除吗？', '提示', {
			    type: 'warning'
			})
			    .then(() => {		
					
					const length = this.multipleSelection.length;
					let str = '';
					//this.delList = this.delList.concat(this.multipleSelection);
					for (let i = 0; i < length; i++) {
						this.delList.push(this.multipleSelection[i].unitId);
					    //str += this.multipleSelection[i].bulidingid + ' ';
					}
					console.log(this.delList);
					deleteUnits(this.delList).then(res=>{
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
        // 编辑单元
        editUnit(index, row) {
			this.unitdata.unitId = row.unitId;
            this.unitdata.unitNo=row.unitNo;
        	this.unitdata.floor=row.floor;
        	this.unitdata.lift=row.lift;
            this.editVisible = true;
        },
        // 保存编辑单元
        saveEditUnit() {
            this.editVisible = false;
        	updateUnit(this.unitdata.unitId,this.unitdata.unitNo,this.unitdata.floor,this.unitdata.lift).then(res=>{
        		if(res>0){
        			this.$message.success('修改成功');
        			 this.getData();
        		}else{
        			this.$message.error('修改失败');
        		}
        	})
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.querydata, 'page', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
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
