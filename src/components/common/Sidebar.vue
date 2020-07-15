<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"

            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: []
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
		
		if(this.$cookies.get('userrole').indexOf("NORMAL") != -1){
			this.items=[
				{
				    icon: 'el-icon-lx-home',
				    index: '/userindex',
				    title: '系统首页'
				},
				{
				    icon: 'el-icon-lx-cascades',
				    index: '/1',
				    title: '我的服务',
					subs: [
							{
								icon: 'el-icon-lx-calendar',
								index: '/appRepair',
								title: '申请报修',
							},
							{
								icon: 'el-icon-lx-calendar',
								index: '/myRepair',
								title: '我的报修',
							},
							{
								icon: 'el-icon-lx-calendar',
								index: '/userComplaint',
								title: '投诉建议',
							},
							{
								icon: 'el-icon-lx-calendar',
								index: '/myPayment',
								title: '缴费'					
							}			  
					]
				},
				{
				    icon: 'el-icon-user',
				    index: '/baseMessage',
				    title: '个人信息'
				},
				{
				    icon: 'el-icon-lx-emoji',
				    index: '/forum',
				    title: '交流论坛'					
				},
				{
				    icon: 'el-icon-lx-global',
				    index: '/2',
				    title: '系统功能',
					subs: [
								{									
									index: '/changePassword',
									title: '修改密码'
								},
								{
									index: '/changeUserPhoto',
									title: '更换头像'
								}	
					]
				}
			]
		}else{
			this.items=[
				{
				    icon: 'el-icon-lx-home',
				    index: '/adminindex',
				    title: '系统首页'
				},
				{
				    icon: 'el-icon-lx-shop',
				    index: '/communityMsg',
				    title: '小区管理'
				},				
				{
				    icon: 'el-icon-lx-calendar',
				    index: '/1',
				    title: '资产管理',
				    subs: [				           
								{
									icon: 'el-icon-lx-calendar',
									index: '/building',
									title: '楼栋管理',
								},
								{
									icon: 'el-icon-lx-calendar',
									index: '/unit',
									title: '单元信息',
								},{
									icon: 'el-icon-lx-calendar',
									index: '/house',
									title: '房屋信息',
								}		      
				    ]
				},
				{
				    icon: 'el-icon-user',
				    index: '/2',
				    title: '业主管理',
					subs: [
								{
									icon: 'el-icon-lx-calendar',
									index: '/owner',
									title: '业主信息',
								}		      
					]
				},
				{
				    icon: 'el-icon-lx-servicefill',
				    index: '/3',
				    title: '智慧服务',
					subs: [
					    {
					        index: '/foreignPeople',
					        title: '访客登记'
					    },
					    {
					        index: '/noticeWrite',
					        title: '发布公告'
					    },{
							index: '/noticeManage',
							title: '公告管理'
						},{
							index: '/complaint',
							title: '投诉建议'
						},{
							index: '/repair',
							title: '报修管理'
						}
					]
				},
				{
				    icon: 'el-icon-truck',
				    index: '/4',
				    title: '停车管理',
					subs: [
					    {
					        index: '/parkingLot',
					        title: '停车场管理'
					    },
					    {
					        index: '/parking',
					        title: '车位信息'
					    },{
							index: '/parkingRecord',
							title: '车辆进出记录'
						}
					]
				},
				{
				    icon: 'el-icon-document-copy',
				    index: '/5',
				    title: '收费管理',
				    subs: [
				        {
				            index: '/payItem',
				            title: '缴费项管理'
				        },
				        {
				            index: '/houseCharge',
				            title: '房屋收费'
				        },
				        {
				            index: '/parkingCharge',
				            title: '车位收费'
				        },
						{
						    index: '/paymentList',
						    title: '缴费清单'
						},
						{
						    index: '/TPpaymentList',
						    title: '临时停车缴费清单'
						}
				    ]
				},
				{
				    icon: 'el-icon-lx-emoji',
				    index: '/forum',
				    title: '交流论坛'					
				},
				{
				    icon: 'el-icon-lx-global',
				    index: '/6',
				    title: '系统功能',
					subs: [
								{									
									index: '/changePassword',
									title: '修改密码'
								},
								{
									index: '/changeUserPhoto',
									title: '更换头像'
								}	
					]
				}				
			]
		}
			
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
			
		
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
