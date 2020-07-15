import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({

    mode: 'history',
    routes: [

        // {

        //     path: '/',

        //     redirect: '/adminindex'

        // },

        {

            path: '/',

            component: () => import( '../components/common/Home.vue'),

            meta: { 
				title: '首页',
				requireAuth: true
			 },

            children: [

                {

                    path: 'adminindex',

                    component: () => import('../components/page/admin/adminindex.vue'),

                    meta: { title: '系统首页' }

                },
				{
				
				    path: '/communityMsg',
				
				    component: () => import('../components/page/admin/communityMsg.vue'),
				
				    meta: { title: '小区信息' }
				
				},
                {

                    path: 'unit',

                    component: () => import('../components/page/admin/unit.vue'),

                    meta: { title: '单元信息' }

                },

                {

                    path: 'building',

                    component: () => import('../components/page/admin/building.vue'),

                    meta: { title: '楼栋管理' }

                },
				{
				
				    path: 'house',
				
				    component: () => import( '../components/page/admin/house.vue'),
				
				    meta: { title: '房屋信息' }
				
				},

                {

                    path: '/owner',

                    component: () => import( '../components/page/admin/owner.vue'),

                    meta: { title: '业主信息' }

                },
				{
				
				    path: '/addOwnerRoom',
				
				    component: () => import( '../components/page/admin/addOwnerRoom.vue'),
				
				    meta: { title: '业主房屋绑定' }
				
				},
				{
				
				    path: '/addOwnerParking',
				
				    component: () => import( '../components/page/admin/addOwnerParking.vue'),
				
				    meta: { title: '业主车位绑定' }
				
				},
				// {
				
				//     path: '/test',
				
				//     component: () => import( '../components/page/testcommont.vue'),
				
				//     meta: { title: '测试页面' }
				
				// },
				{
				
				    path: '/ownerDetail',
				
				    component: () => import('../components/page/admin/ownerDetail.vue'),
				
				    meta: { title: '业主详情' }
				
				},										
                {

                    path: '/parkingLot',

                    component: () => import( '../components/page/admin/parkingLot.vue'),

                    meta: { title: '停车场管理' }

                },
				{
				
				    path: '/parking',
				
				    component: () => import( '../components/page/admin/parking.vue'),
				
				    meta: { title: '车位信息' }
				
				},
				{
				
				    path: '/parkingCharge',
				
				    component: () => import( '../components/page/admin/parkingCharge.vue'),
				
				    meta: { title: '车位收费' }
				
				},
				{
				
				    path: '/parkingRecord',
				
				    component: () => import( '../components/page/admin/parkingRecord.vue'),
				
				    meta: { title: '进出场记录' }
				
				},
                {
                    path: '/foreignPeople',

                    component: () => import( '../components/page/admin/foreignPeople.vue'),

                    meta: { title: '访客登记' }

                },

                {

                    path: '/payItem',

                    component: () => import( '../components/page/admin/payItem.vue'),

                    meta: { title: '费用项管理' }

                },
				{
				
				    path: '/houseCharge',
				
				    component: () => import( '../components/page/admin/houseCharge.vue'),
				
				    meta: { title: '房屋收费' }
				
				},
				{
				
				    path: '/paymentList',
				
				    component: () => import( '../components/page/admin/paymentList.vue'),
				
				    meta: { title: '缴费清单' }
				
				},
				{
				
				    path: '/TPpaymentList',
				
				    component: () => import( '../components/page/admin/TPpaymentList.vue'),
				
				    meta: { title: '临时停车缴费清单' }
				
				},
				{

                    path: '/noticeManage',

                    component: () => import('../components/page/admin/noticeManage.vue'),

                    meta: { title: '公告管理' }

                },
				{
				
				    path: '/complaint',
				
				    component: () => import('../components/page/admin/complaint.vue'),
				
				    meta: { title: '投诉建议' }
				
				},
				{
				
				    path: '/repair',
				
				    component: () => import('../components/page/admin/repair.vue'),
				
				    meta: { title: '报修管理' }
				
				},
                {

                    path: '/noticeWrite',

                    component: () => import('../components/page/admin/noticeWrite.vue'),

                    meta: { title: '编写公告' }

                },
				{
				
				    path: '/notice',				
				    component: () => import('../components/page/Notice.vue'),
				
				    meta: { title: '查看公告' }
				
				},
                {

                    path: '/404',

                    component: () => import('../components/page/404.vue'),

                    meta: { title: '404' }

                },

                {

                    path: '/403',

                    component: () => import('../components/page/403.vue'),

                    meta: { title: '403' }

                },
				{
				
				    path: '/userindex',
				
				    component: () => import('../components/page/normal/userindex.vue'),
				
				    meta: { title: '首页' }
				
				},
				{
				
				    path: '/appRepair',
				
				    component: () => import('../components/page/normal/appRepair.vue'),
				
				    meta: { title: '申请报修' }
				
				},
				{
				
				    path: '/myRepair',
				
				    component: () => import('../components/page/normal/myRepair.vue'),
				
				    meta: { title: '我的报修' }
				
				},
				{
				
				    path: '/myPayment',
				
				    component: () => import('../components/page/normal/myPayment.vue'),
				
				    meta: { title: '缴费' }
				
				},
				{
				
				    path: '/userComplaint',
				
				    component: () => import('../components/page/normal/complaint.vue'),
				
				    meta: { title: '投诉或建议' }
				
				},
				{
				
				    path: '/baseMessage',
				
				    component: () => import('../components/page/normal/baseMessage.vue'),
				
				    meta: { title: '个人信息' }
				
				},
				{
				
				    path: '/changePassword',
				
				    component: () => import('../components/page/changePassword.vue'),
				
				    meta: { title: '修改密码' }
				
				},
				{
				
				    path: '/changeUserPhoto',
				
				    component: () => import('../components/page/changeUserPhoto.vue'),
				
				    meta: { title: '更换头像' }
				
				},
				{
				
				    path: '/forum',
				
				    component: () => import('../components/page/forum.vue'),
				
				    meta: { title: '交流论坛' }
				
				},
				{
				
				    path: '/post',
				
				    component: () => import('../components/page/markdown.vue'),
				
				    meta: { title: '发帖' }
				
				},
				{
				
				    path: '/postDetail',
				
				    component: () => import('../components/page/postDetail.vue'),
				
				    meta: { title: '帖子详情' }
				
				}

            ]

        },

        {

            path: '/login',

            component: () => import('../components/page/Login.vue'),

            meta: { title: '登录' }

        }

        

    ]

});