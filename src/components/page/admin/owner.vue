<template>
    <div>
        <div class="container" style="margin-bottom: 10px;">
        	    <el-breadcrumb separator="/" style="font-size: 20px;">
        			<el-breadcrumb-item :to="{ path: '/adminindex' }">
        			   首页
        			</el-breadcrumb-item>
        			<el-breadcrumb-item>
        			    业主管理
        			</el-breadcrumb-item>
        	        <el-breadcrumb-item>
        	            业主信息
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
                
                <el-input v-model="querydata.ownerName" placeholder="姓名" class="handle-input mr10"></el-input>
				<el-input v-model="querydata.idCard" placeholder="身份证号" class="handle-input mr10"></el-input>
				<el-input v-model="querydata.phone" placeholder="联系电话" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>	
				<el-button type="primary" icon="el-icon-plus" @click="addOwner">添加业主</el-button>
				<el-button type="primary" icon="el-icon-plus" @click="getOwnerExcel">导出Excel</el-button>
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
                <el-table-column prop="ownerId" label="业主ID" width="140" ></el-table-column>
				<el-table-column prop="ownerName" label="姓名"></el-table-column>
				<el-table-column prop="sex" label="性别"></el-table-column>
				<el-table-column prop="idCard" label="身份证号"></el-table-column>
                <el-table-column prop="phone" label="联系电话"></el-table-column>
           
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                      				   
						 <el-dropdown   trigger="click" >
						<span class="el-dropdown-link">
							变更<i class="el-icon-arrow-down el-icon--right"></i>
							 </span>
							<el-dropdown-menu slot="dropdown">
							 <el-dropdown-item @click.native="addOwnerRoom(scope.row)">入住房屋</el-dropdown-item>
							<el-dropdown-item @click.native="addOwnerParking(scope.row)">绑定车位</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						&nbsp;&nbsp;
						<el-button
						    type="text"
						    @click="ownerdetail(scope.row)"
						>详情</el-button>
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

		<!-- 添加业主弹出框 -->
        <el-dialog title="添加业主" :visible.sync="addOwnerVisible" width="30%">
            <el-form ref="adddata" :model="adddata" :rules="rules" label-width="120px">				
				<el-form-item label="姓名" prop="ownerName">
				    <el-input v-model="adddata.ownerName"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
				   <el-select v-model="adddata.sex" placeholder="请选择">
				       <el-option				        
				         label="男"
				         value="男">
				       </el-option>
					   <el-option
					     label="女"
					     value="女">
					   </el-option>
				     </el-select>
				</el-form-item>
				<el-form-item label="身份证号" prop="idCard">
				    <el-input v-model="adddata.idCard"></el-input>
				</el-form-item>		
				<el-form-item label="联系电话" prop="phone">
					<el-input v-model="adddata.phone"></el-input>
				</el-form-item>	
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addOwnerVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAddOwner()">确 定</el-button>
            </span>
        </el-dialog>
		
		


    </div>
</template>

<script>

import {getOwnerData} from '../../../api/owner.js'
import {addOwner} from '../../../api/owner.js'
import {deleteOwner} from '../../../api/owner.js'
import {exportOwnerExcel} from '../../../api/owner.js'



export default {
    name: 'house',
    data() {
        return {			
			querydata: {
				page: 1,
				rows: 5,
				ownerName: '',
				idCard: '',
				phone: ''
				
			},
			adddata:{
				ownerName: '',
				sex: '',
				idCard: '',
				phone: ''
			},
			rules:{
				"ownerName" : [
				       { required: true, message: '请输入姓名', trigger: 'blur' },
				      ],
				"sex" : [
				       { required: true, message: '请选择性别', trigger: 'change' },
				      ],
				"idCard" : [
				       { required: true, message: '请输入身份证号', trigger: 'blur' },
					   { min: 18, max: 18, message: '请输入正确的身份证号', trigger: 'blur' }
				      ],
				"phone" : [
				       { required: true, message: '请输入联系电话', trigger: 'blur' },
					   { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' }
				      ]
										
			},			
			addOwnerVisible: false,
            tableData: [],
            multipleSelection: [],
            delList: [],
            pageTotal: 0,
			loading: true
        };
    },
    created() {
        this.getData();	
    },
    methods: {
        getData() {
				getOwnerData(this.querydata).then(res=>{
					console.log('前端接收的结果：'+res.data.code)
					this.tableData = res.data;
					this.pageTotal = res.total;
					this.loading  =false;
				});			
        },
				
        // 触发搜索按钮
        handleSearch() {
            //this.$set(this.query, 'pageIndex', 1);
			getOwnerData(this.querydata).then(res=>{
				console.log('前端接收的结果：'+res)
				this.tableData = res.data;
				this.pageTotal = res.total;
			});	
        },
		// 添加业主
		addOwner() {			
		    this.addOwnerVisible = true;
		},
		//提交添加业主
		saveAddOwner(){
			 this.$refs.adddata.validate((valid) => {
			          if (valid) {
			            addOwner(this.adddata).then(res=>{
							if(res == 1001){
								this.$message.error('该电话号码已被注册');
							}
							else if(res==1){
								this.$message.success('添加成功');
								this.getData();
							}else{
								this.$message.error('添加失败');
							}
						 this.addOwnerVisible = false;	
						})
			          } else {
			            console.log('error submit!!');
			            return false;
			          }
			        });
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
						this.delList.push(this.multipleSelection[i].ownerId);
					    //str += this.multipleSelection[i].bulidingid + ' ';
					}
					console.log(this.delList);
					deleteOwner(this.delList).then(res=>{
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
		addOwnerRoom(row){
			this.$router.push('/addOwnerRoom?ownerId='+row.ownerId+'&ownerName='+row.ownerName+'&idCard='+row.idCard);		
		},
		addOwnerParking(row){
			this.$router.push('/addOwnerParking?ownerId='+row.ownerId+'&ownerName='+row.ownerName+'&idCard='+row.idCard);		
		},
		ownerdetail(row){
			this.$router.push('/ownerDetail?ownerId='+row.ownerId)
		},
		getOwnerExcel(){
			exportOwnerExcel().then(response=>{
				let blob = new Blob([response], {type: "application/vnd.ms-excel"});
				let link = document.createElement('a');
				link.href = window.URL.createObjectURL(blob);
				link.download = '业主信息单.xlsx';
				link.click();  
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
.el-dropdown-link {
    cursor: pointer;
    color: #07C4A8;
	font-size: 13px;
  }
  .el-icon-arrow-down {
    font-size: 13px;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 20px;
    margin-bottom: 20px;
  }
</style>
