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
        	            房屋信息
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
                
                <el-input v-model="querydata.bulidingNo" placeholder="楼栋编号" class="handle-input mr10"></el-input>
				<el-input v-model="querydata.unitNo" placeholder="单元编号" class="handle-input mr10"></el-input>
				<el-input v-model="querydata.roomNo" placeholder="房屋编号" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>	
				<el-button type="primary" icon="el-icon-plus" @click="addHouse">添加房屋</el-button>
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
                <el-table-column prop="houseId" label="房屋ID" width="100" ></el-table-column>
				<el-table-column prop="bulidingNo" label="楼栋编号"></el-table-column>
				<el-table-column prop="unitNo" label="单元编号"></el-table-column>
				<el-table-column prop="roomNo" label="房屋编号"></el-table-column>
				<el-table-column prop="ownerName" label="所属业主"></el-table-column>
                <el-table-column prop="houseStatus" label="房屋状态"></el-table-column>
				<el-table-column prop="houseAreal" label="面积"></el-table-column>
				<el-table-column prop="rate" label="单价"></el-table-column>
           
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                       <el-button
                           type="text"
                           icon="el-icon-edit"
                           @click="editHouse(scope.$index, scope.row)"
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

		<!-- 添加房屋弹出框 -->
        <el-dialog title="添加房屋" :visible.sync="addHouseVisible" width="30%">
            <el-form ref="adddata" :model="adddata" :rules="rules" label-width="120px">
				
				<el-form-item label="楼栋号/单元号" prop="buNo">
				<el-cascader
				    v-model="adddata.buNo"
				    :options="buoptions"
				    :props="optionProps"
				    @change="handleChange"></el-cascader>				
				 </el-form-item>
				<el-form-item label="房屋编号" prop="roomNo">
				    <el-input @blur="checkRoomNo" v-model="adddata.roomNo"></el-input>
				</el-form-item>
				<el-form-item label="面积" prop="houseAreal">
				    <el-input v-model="adddata.houseAreal"></el-input>
				</el-form-item>
				<el-form-item label="单价" prop="rate">
				    <el-input v-model="adddata.rate"></el-input>
				</el-form-item>				
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addHouseVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAddHouse()">确 定</el-button>
            </span>
        </el-dialog>


	<!-- 修改房屋弹出框 -->
	<el-dialog title="修改房屋" :visible.sync="editVisible" width="30%">
	    <el-form ref="editdata" :model="editdata" :rules="erules" label-width="120px">	
			<el-form-item label="楼栋号/单元号" prop="buNo">
			<el-cascader
			    v-model="editdata.buNo"
			    :options="buoptions"
			    :props="optionProps"
			    @change="handleEditChange"></el-cascader>				
			 </el-form-item>
			<el-form-item label="房屋编号" prop="roomNo">
			    <el-input v-model="editdata.roomNo"></el-input>
			</el-form-item>
			<el-form-item label="房屋状态" prop="houseStatus" >
			    <el-select v-model="editdata.houseStatus" placeholder="请选择">
			        <el-option
			          label="闲置"
			          value="闲置">
			        </el-option>
			    	<el-option
			    	  label="已出租"
			    	  value="已出租">
			    	</el-option>
			    	<el-option
			    	  label="已出售"
			    	  value="已出售">
			    	</el-option>
			      </el-select>
			  </el-form-item>
			<el-form-item label="面积" prop="houseAreal">
			    <el-input v-model="editdata.houseAreal"></el-input>
			</el-form-item>
			<el-form-item label="单价" prop="rate">
			    <el-input v-model="editdata.rate"></el-input>
			</el-form-item>				
	    </el-form>
	    <span slot="footer" class="dialog-footer">
	        <el-button @click="editVisible = false">取 消</el-button>
	        <el-button type="primary" @click="saveEditHouse()">确 定</el-button>
	    </span>
	</el-dialog>
	


    </div>
</template>

<script>

import {getHouseData} from '../../../api/house.js'
import {deleteHouses} from '../../../api/house.js'
import {getBuildingNo} from '../../../api/house.js'
import {getUnitNo} from '../../../api/house.js'
import {getBUNo} from '../../../api/house.js'
import {addHouse} from '../../../api/house.js'
import {updateHouse} from '../../../api/house.js'
 import {checkRoomNoIsExist} from '../../../api/house.js'


export default {
    name: 'house',
    data() {
        return {
			buoptions: [],
			optionProps: {
			  value: 'bulidingno',
			  label: 'bulidingno',
			  children: 'bunitList',
			  expandTrigger: 'hover'
			},
			buNo:[],
			querydata: {
				page: 1,
				rows: 5,
				//houseId: 1,
				bulidingNo: '',
				unitNo: '',
				roomNo: ''
				
			},
			adddata:{
				buNo: [],
				houseAreal: '',
				bulidingNo: '',
				unitNo: '',
				roomNo: '',
				rate: ''
			},
			editdata:{
				houseId: '',
				buNo: [],
				houseAreal: '',
				bulidingNo: '',
				unitNo: '',
				roomNo: '',
				houseStatus: '',
				rate: ''
			},
			rules:{
				"buNo" : [
				       { required: true, message: '请输入楼号单元号', trigger: 'blur' },
				      ],
				"houseAreal" : [
				       { required: true, message: '请输入面积', trigger: 'blur' },
				      ],
				"roomNo" : [
				       { required: true, message: '请输入房屋编号', trigger: 'blur' },
				      ],
				"rate" : [
				       { required: true, message: '请输入单价', trigger: 'blur' },
				      ]
										
			},
			erules:{
				"buNo" : [
				       { required: true, message: '请输入楼号单元号', trigger: 'blur' },
				      ],
				"houseAreal" : [
				       { required: true, message: '请输入面积', trigger: 'blur' },
				      ],
				"roomNo" : [
				       { required: true, message: '请输入房屋编号', trigger: 'blur' },
				      ],
				"rate" : [
				       { required: true, message: '请输入单价', trigger: 'blur' },
				      ],	
				"houseStatus" : [
				       { required: true, message: '请输入状态', trigger: 'blur' },
				      ],					
			},
			addHouseVisible: false,
			buildingNo: '',
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
			loading: true
        };
    },
    created() {
        this.getData();
		getBuildingNo().then(res=>{
			this.boptions=res;
		})
		getUnitNo().then(res=>{
			this.uoptions=res;
		})
		getBUNo().then(res=>{
			//更改便于显示
			let bbb= JSON.parse(JSON.stringify(res).replace(/unitNo/g,"bulidingno"));
			this.buoptions=bbb;			
		})
    },
    methods: {
        getData() {
				getHouseData(this.querydata).then(res=>{
					console.log('前端接收的结果：'+res.data.code)
					this.tableData = res.data;
					this.pageTotal = res.total;
					this.loading = false;
				});			
        },
				
        // 触发搜索按钮
        handleSearch() {
            //this.$set(this.query, 'pageIndex', 1);
			getHouseData(this.querydata).then(res=>{
				console.log('前端接收的结果：'+res)
				this.tableData = res.data;
				this.pageTotal = res.total;
			});	
        },
		// 添加房屋
		addHouse() {			
		    this.addHouseVisible = true;
		},
		//选中楼号单元号
		handleChange(value){
			this.adddata.buNo=value;
			this.adddata.bulidingNo=value[0];
			this.adddata.unitNo=value[1];
			 console.log(value);
		},
		checkRoomNo(e){
			checkRoomNoIsExist(this.adddata).then(res=>{
				if(res>0){
					this.adddata.roomNo = '';
					this.$message.error('此房屋编号已存在');
				}
			})
		},
		//提交添加房屋
		saveAddHouse(){
			 this.$refs.adddata.validate((valid) => {
			          if (valid) {
			            addHouse(this.adddata).then(res=>{
							if(res>0){
								this.$message.success('添加成功');
								this.getData();
							}else{
								this.$message.error('添加失败');
							}
						 this.addHouseVisible = false;	
						})
			          } else {
			            console.log('error submit!!');
			            return false;
			          }
			        });
		},
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除 '+row.roomNo +'号房屋吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
					deleteHouses(row.houseId).then(res=>{
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
						this.delList.push(this.multipleSelection[i].houseId);
					    //str += this.multipleSelection[i].bulidingid + ' ';
					}
					console.log(this.delList);
					deleteHouses(this.delList).then(res=>{
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
		//（edit）选中楼号单元号
		handleEditChange(value){
			this.editdata.bulidingNo=value[0];
			this.editdata.unitNo=value[1];
		},
        // 编辑房屋
        editHouse(index, row) {
			this.editdata.houseId = row.houseId;
			this.editdata.roomNo = row.roomNo;
            this.editdata.bulidingNo=row.bulidingNo;
        	this.editdata.unitNo=row.unitNo;
        	this.editdata.houseStatus=row.houseStatus;
			this.editdata.houseAreal=row.houseAreal;
			this.editdata.rate=row.rate;
            this.editVisible = true;
        },
        // 保存编辑房屋
        saveEditHouse() {
			
            this.editVisible = false;
        	this.$refs.editdata.validate((valid) => {
        	         if (valid) {
        	           updateHouse(this.editdata).then(res=>{
        								if(res>0){
        									this.$message.success('修改成功');
        									this.getData();
        								}else{
        									this.$message.error('修改失败');
        								}
        							})
        	         } else {
        	           console.log('error submit!!');
        	           return false;
        	         }
        	       });
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
