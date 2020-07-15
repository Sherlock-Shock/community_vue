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
        	            楼栋管理
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
                
                <el-input v-model="querydata.number" placeholder="楼栋编号" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" icon="el-icon-plus" @click="addbuilding">添加楼栋</el-button>
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
                <el-table-column prop="bulidingid" label="楼栋ID" width="100" align="center"></el-table-column>
                <el-table-column prop="bulidingno" label="楼栋编号"></el-table-column>
				<el-table-column prop="bulidingname" label="楼栋名称"></el-table-column>
           
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
						<el-button
						    type="text"
						    icon="el-icon-edit"
						    @click="editBuilding(scope.$index, scope.row)"
						>修改</el-button>
                        <el-button
                            type="text"
                            size="mini"
                            @click="addUnit(scope.$index, scope.row)"
                        >添加单元</el-button>
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


	 <!-- 添加楼栋弹出框 -->
			<el-dialog title="添加楼栋" :visible.sync="addBuidingVisible" width="30%">
				<el-form ref="addBuildingForm" :model="adddata" :rules="abrules" label-width="100px">
					<el-form-item label="楼栋编号" prop="buildingno">
						<el-input @blur="checkBuildingNo" v-model="adddata.buildingno"></el-input>
					</el-form-item>
					<el-form-item label="楼栋名称" prop="buildingname">
						<el-input v-model="adddata.buildingname"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addBuidingVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveAdd">确 定</el-button>
				</span>
			</el-dialog>
	



        <!-- 添加单元弹出框 -->
        <el-dialog title="添加单元" :visible.sync="addUnitVisible" width="30%">
            <el-form ref="addUnitForm" :model="addunitdata" :rules="aurules" label-width="100px">
                <el-form-item label="楼栋编号">
                    <el-input :value="buildingNo" disabled></el-input>
                </el-form-item>
                <el-form-item label="单元编号" prop="unitNo">
                    <el-input @blur="checkUnitNo" v-model="addunitdata.unitNo"></el-input>
                </el-form-item>
				<el-form-item label="层数" prop="floor">
				    <el-input v-model="addunitdata.floor"></el-input>
				</el-form-item>
				<el-form-item label="电梯" prop="lift">
				   <el-select v-model="addunitdata.lift" placeholder="请选择">
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
                <el-button @click="addUnitVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAddUnit">确 定</el-button>
            </span>
        </el-dialog>
		
		<!-- 编辑楼栋弹出框 -->
		<el-dialog title="修改楼栋" :visible.sync="editBuildingVisible" width="30%">
		   <el-form ref="form" :model="editdata" label-width="70px">
		   	<el-form-item label="楼栋编号">
		   		<el-input v-model="editdata.buildingNo" ></el-input>
		   	</el-form-item>
		   	<el-form-item label="楼栋名称">
		   		<el-input v-model="editdata.buildingName" ></el-input>
		   	</el-form-item>
		   </el-form>
		   <span slot="footer" class="dialog-footer">
		   	<el-button @click="editBuildingVisible = false">取 消</el-button>
		   	<el-button type="primary" @click="saveEditBuilding">确 定</el-button>
		   </span>
		</el-dialog>
		
    </div>
</template>

<script>
import { fetchData } from '../../../api/index';
import {getBuildingData} from '../../../api/building.js'
import {getBuildingDataByNo} from '../../../api/building.js'
import {addBuilding} from '../../../api/building.js'
import {deleteBuilding} from '../../../api/building.js'
import {deleteBuildings} from '../../../api/building.js'
import {updateBuilding} from '../../../api/building.js'
import {checkBuildingNoIsExist} from '../../../api/building.js'
import {addUnit} from '../../../api/building.js'
import {checkUnitNoIsExist} from '../../../api/unit.js'

export default {
    name: 'building',
    data() {
        return {
			options: [{
			          value: '是',
			          label: '是'
			        }, {
			          value: '否',
			          label: '否'
			        }],
			abrules:{
				"buildingno" : [
				       { required: true, message: '请输入楼栋编号', trigger: 'blur' },
				      ],
				"buildingname" : [
				       { required: true, message: '请输入楼栋名称', trigger: 'blur' },
				      ]								
			},
			aurules:{
				"unitNo" : [
				       { required: true, message: '请输入单元编号', trigger: 'blur' },
				      ],
				"floor" : [
				       { required: true, message: '请输入层数', trigger: 'blur' },
				      ]	,
				"lift" : [
				       { required: true, message: '请选择电梯', trigger: 'change' },
				      ]	  
			},
			liftvalue: '',
			querydata: {
				page: 1,
				rows: 5,
				number: ''
			},
			adddata: {
				buildingno: '',
				buildingname: ''
			},
			addunitdata:{
				buildingId: '',
				unitNo: '',
				floor: '',
				lift: ''
			},
			editdata:{
				buildingId: '',
				buildingNo: '',
				buildingName: ''
			},
			buildingNo: '',
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
			addBuidingVisible: false,
			addUnitVisible: false,
			editBuildingVisible: false,
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
			getBuildingData(this.querydata.page,this.querydata.rows).then(res=>{
				console.log('前端接收的结果：'+res)
				this.tableData = res.data;
				this.pageTotal = res.total;
				this.loading=false;
			});
        },
		//触发添加添加楼栋按钮
		addbuilding(){
			this.addBuidingVisible = true;
		},
		checkBuildingNo(e){
			checkBuildingNoIsExist(this.adddata.buildingno).then(res=>{
				if(res>0){
					this.adddata.buildingno = '';
					this.$message.error('此楼栋编号已存在');
				}
			})
		},
		//添加楼栋确定
		saveAdd(){
			
			this.$refs.addBuildingForm.validate((valid) => {
			         if (valid) {
						  addBuilding(this.adddata.buildingno,this.adddata.buildingname).then(res=>{
							if(res>0){
								this.$message.success('添加成功');
								this.getData();
							}else{
								this.$message.error('添加失败');
							}
						  });
			         } else {
			           console.log('error submit!!');
			           return false;
			         }
			       });
			this.addBuidingVisible = false;	   
			//this.$message.success(this.adddata.buildingno+this.adddata.buildingname);
			
			
		},
		
        // 触发搜索按钮
        handleSearch() {
            //this.$set(this.query, 'pageIndex', 1);
			getBuildingDataByNo(this.querydata.page,this.querydata.rows,this.querydata.number).then(res=>{
				this.tableData = res.data;
				this.pageTotal = res.total;
			})
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除 '+row.bulidingname +' 吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
					deleteBuilding(row.bulidingid).then(res=>{
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
					for (let i = 0; i < length; i++) {
						this.delList.push(this.multipleSelection[i].bulidingid);
					}
					console.log(this.delList);
					deleteBuildings(this.delList).then(res=>{
						if(res>0){
							this.$message.success('删除成功');
							 this.getData();
						}else{
							this.$message.error('删除失败');
						}
					});
					this.delList = [];
					this.multipleSelection = [];                   
			    })
			    .catch(() => {});
			
            
        },
		
        // 添加单元
        addUnit(index, row) {
			this.buildingNo=row.bulidingno;
			this.addunitdata.buildingId=row.bulidingid;
			//console.log(this.addunitdata.buildingId);
            this.addUnitVisible = true;
        },
		checkUnitNo(e){
			checkUnitNoIsExist(this.addunitdata).then(res=>{
				if(res>0){
					this.addunitdata.unitNo = '';
					this.$message.error('此单元编号已存在')
				}
			})
		},
        // 保存添加单元
        saveAddUnit() {
			this.$refs.addUnitForm.validate((valid) => {
			         if (valid) {
						 addUnit(this.addunitdata.buildingId,this.addunitdata.unitNo,this.addunitdata.floor,this.addunitdata.lift).then(res=>{
						 	if(res>0){
						 		this.$message.success('添加单元成功')
								 this.addUnitVisible = false;
						 	}else{
						 		this.$message.error('添加单元失败')
						 	}
						 })
			         } else {
			           console.log('error submit!!');
			           return false;
			         }
			       });
           
			//console.log(this.addunitdata.buildingId);
           
        },
		// 编辑楼栋
		editBuilding(index, row) {
		    this.editdata.buildingId=row.bulidingid;
			this.editdata.buildingNo=row.bulidingno;
			this.editdata.buildingName=row.bulidingname;
		    this.editBuildingVisible = true;
		},
		// 保存编辑楼栋
		saveEditBuilding() {
		    this.editBuildingVisible = false;
			updateBuilding(this.editdata.buildingId,this.editdata.buildingNo,this.editdata.buildingName).then(res=>{
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
