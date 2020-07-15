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
			            发布公告
			        </el-breadcrumb-item>
			    </el-breadcrumb>
			
		</div>
        <div class="container">
			<div>
				<strong>标题：</strong><br />
				<el-input
				  class="title"
				  placeholder="请输入标题"
				  v-model="noticedata.title"
				  clearable>
				</el-input>
				<br />
				<strong>发布者：</strong><br />
				<el-input
				  class="title"
				  placeholder="请输入发布者"
				  v-model="noticedata.publisher"
				  clearable>
				</el-input>
			</div>
			<strong>内容：</strong><br />
            <quill-editor ref="myTextEditor" v-model="noticedata.content" :options="editorOption"></quill-editor>
            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
        </div>
    </div>
</template>

<script>
	import {editorOptions} from '../../../../vue-quill-editor-config.js'
	import {addNotice} from '../../../api/notice.js'
	
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    export default {
        name: 'editor',
        data: function(){
            return {
				noticedata: {
					title: '',
					publisher: '',
					content: ''
				},
                editorOption: editorOptions
            }
        },
        components: {
            quillEditor
        },
        methods: {
            onEditorChange({ editor, html, text }) {
                this.noticedata.content = html;
            },
            submit(){
                if(this.noticedata.title==''){
					this.$alert('请输入标题', '提示', {
					         confirmButtonText: '确定'					          
					       });
				}else if(this.noticedata.content==''){
					this.$alert('请输入内容', '提示', {
					         confirmButtonText: '确定'					          
					       });
				}else if(this.noticedata.publisher==''){
					this.$alert('请输入发布者', '提示', {
					         confirmButtonText: '确定'					          
					       });
				}else{
					
					this.$confirm('是否提交?', '提示', {
					          confirmButtonText: '确定',
					          cancelButtonText: '取消',
					          type: 'warning'
					        }).then(() => {
					          addNotice(this.noticedata).then(res=>{
					          	if(res>0){
					          		 this.$message.success('提交成功！');
					          	}else{
					          		 this.$message.error('提交失败！');
					          	}
					          }).catch(e=>{
					          	console.log(e)
					          })
					        }).catch(() => {
					          this.$message({
					            type: 'info',
					            message: '已取消提交'
					          });          
					        });
											
				}
           
            }
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
	.title{
		width: 50%;
		margin-bottom: 10px;
		margin-top: 10px;
	}
</style>