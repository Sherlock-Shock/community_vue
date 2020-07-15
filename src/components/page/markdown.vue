<template>
    <div>
        <div class="container">
            <div class="title">
               <el-input v-model="adddata.title" placeholder="请输入标题" ref="inputRef"></el-input>
            </div>
            <mavon-editor v-model="content" ref="md" @imgAdd="$imgAdd" @change="change" style="min-height: 600px"/>
            <el-button class="editor-btn" type="primary" @click="submit">发布</el-button>
        </div>
    </div>
</template>

<script>
	import {addPosting} from '../../api/posting.js'
	import {uploadPostPicture} from '../../api/posting.js'
	
    import { mavonEditor } from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    export default {
        name: 'markdown',
        data: function(){
            return {
                content:'',
                html:'',
                configs: {
                },
				adddata: {
					title: '',
					userId: '',
					content: ''
				}
            }
        },
        components: {
            mavonEditor
        },
		created() {
			this.adddata.userId = this.$cookies.get('userid');  
		},
        methods: {
            // 将图片上传到服务器，返回地址替换到md中
            $imgAdd(pos, $file){
                var formdata = new FormData();
                formdata.append('file', $file);
                uploadPostPicture(formdata).then((url) => {
                    this.$refs.md.$img2Url(pos, url);
                })
            },
            change(value, render){
                // render 为 markdown 解析后的结果
                this.html = render;
            },
            submit(){
				if(this.adddata.title==''){
					this.$message.error('请先输入标题');
					 this.$refs.inputRef.focus()
				}else if (this.html==''){
					this.$message.error('请输入帖子内容');
				}else{
					// console.log(this.content)
					// console.log(this.html)
					// this.prototype.$markDown = mavonEditor.markdownIt
					// this.$markDown.render(this.content||'> 文章暂未上传')
					const loading = this.$loading({
					          lock: true,
					          text: '发布中',
					          spinner: 'el-icon-loading',
					          background: 'rgba(0, 0, 0, 0.7)'
					        });					       
					this.adddata.content = this.html;
					addPosting(this.adddata).then(res=>{
						if(res>0){
							loading.close();
							this.$message.success('已发布');
						}else{
							loading.close();
							this.$message.error('发布失败');
						}
					})
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
		
		margin-bottom: 20px;
	}
</style>