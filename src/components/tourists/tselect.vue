<template>
	<div id="wrapper" class="tselect">
		<transition name='alert'>
			<div class="alert" v-show="alertboo" @click="alerttab">
				<div class="alert-inner">
					<div class="alert-text">
						日期填写不完整
					</div>
					<div class="alert-setting">
						<div class="setting-group">
							确定
						</div>
					</div>
				</div>
			</div>
		</transition>
		<t-head></t-head>
		<div id="main">
			<div class="tselect-top">
				<div class="top-nav" :class="swiperindex==0?'active':''" @click="toswiper(0)">
					已整改案卷
				</div>
				<div class="top-nav" :class="swiperindex==1?'active':''" @click="toswiper(1)">
					未整改案卷
				</div>
			</div>
			<div class="time-box">
				<div class="box" @click="timeshow(0)">
					{{starttime==''?'开始时间':starttime}}
					<img src="../../../static/arrbottom.png" />
				</div>
				<span class="hr"></span>
				<div class="box" @click="timeshow(1)">
					{{endtime==''?'结束时间':endtime}}
					<img src="../../../static/arrbottom.png" />
				</div>
				<div class="box-go" @click="gosearch">
					<img src="../../../static/search.png" /> 搜索
				</div>
			</div>
			<swiper :options="swiperOption" ref="mySwiper" class='swiper-no-swiping'>
				<!-- 这部分放你要渲染的那些内容 -->
				<swiper-slide>
					<div class="select-group" v-for="val in list01" @click="opennew('changedetail',val.cfileId)">
						<div class="group-inner">
							<div class="group-title">
								{{val.createTime1}}{{val.cmultipleCommunitiesName}}{{val.cgridName}}
							</div>
							<div class="img-box">
								<div class="img-group">
									<div class="myimg-box">
										<img :src="val.cfileDealPrevImg1 | myimg" />
									</div>
									<div class="state">
										整改前
									</div>
								</div>
								<div class="img-group">
									<div class="myimg-box">
										<img :src="val.cfileDealAfterImg1 | myimg" />
									</div>
									<div class="state">
										整改后
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="more"  @click="next(2)" v-if="pageNum&lt;mydata.lastPage">点击加载更多~</div>
				</swiper-slide>
				<swiper-slide>
					<div class="select-group" v-for="(val,index) in list" @click="opennew('changedetail',val.cfileId)">
						<div class="group-inner">
							<div class="group-title">
								{{val.createTime1}}{{val.cmultipleCommunitiesName}}{{val.cgridName}}
							</div>
							<div class="img-box">
								<div class="img-group">
									<div class="myimg-box">
										<img :src="val.cfileDealPrevImg1 | myimg" /></div>
									<div class="state">
										整改前
									</div>
								</div>
								<div class="img-group">
									<div class="myimg-box">
										<img src="../../../static/uploadselect.png" /></div>
									<div class="state">
										上传图片
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="more"  @click="next(0)" v-if="pageNum&lt;mydata.lastPage">点击加载更多~</div>
				</swiper-slide>
			</swiper>
		</div>
		<transition name='nav'>
			<bootom-nav v-show='navboo' v-on:navshow='navshow'></bootom-nav>
		</transition>
		<t-foot></t-foot>
	</div>
</template>

<script>
	import { swiper, swiperSlide } from 'vue-awesome-swiper'
	export default {
		name: 'tselect',
		data() {
			return {
				swiperOption: {},
				swiperindex: 0,
				starttime: '',
				endtime: '',
				startshow: false,
				timety: 0,
				alertboo: false,
				uploadtarget: '',
				navboo: false,
				navtext: '分类',
				mydata: [],
				server: '',
				cfileDealAfterImg1: '',
				files: [],
				pageNum:1,
				pageSize:10,
				list:[],
				list01:[]
			}
		},
		components: {
			swiper,
			swiperSlide,
			THead: resolve => require(['./thead'], resolve),
			TFoot: resolve => require(['./tfoot'], resolve),
			BootomNav: resolve => require(['../bottom-nav'], resolve)
		},
		mounted() {
			this.$store.state.tfoot = 2
			this.toswiper(0)
			this.server = this.service + '/uploadRegisterImage'
		},
		computed: {
			swiper() {
				return this.$refs.mySwiper.swiper;
			},
			service() {
				return this.$store.state.service;
			}
		},
		methods: {
			opennew: function(target, id) {
				this.$store.state.windexid = id
				this.$router.push({
					name: target
				})
			},
			next:function(index){
				this.pageNum++
				this.myajax(index)
			},
			myajax: function(type) {
				var that = this
//				plus.nativeUI.showWaiting("数据加载中,请耐心等待...");
				var ajaxJson = {
					cuserId: localStorage.getItem('userid'),
					cfileResult: type,
					createTime1: that.starttime,
					handingTime1: that.endtime,
					pageNum:that.pageNum
				}
				if(this.starttime == '') {
					delete ajaxJson.createTime1
				}
				if(this.endtime == '') {
					delete ajaxJson.handingTime1
				}
				$.ajax({
					type: "post",
					url: that.service + "/queryByCfilePojoRegister",
					dataType: 'json',
					data: ajaxJson,
					success: function(res) {
						console.log(res)
						that.mydata=res.data
						if(type==0){
							for (var i=0;i<res.data.list.length;i++) {
								that.list.push(res.data.list[i])
							}
						}else{
							for (var i=0;i<res.data.list.length;i++) {
								that.list01.push(res.data.list[i])
							}
						}
						
//						plus.nativeUI.closeWaiting()
					}
				});
			},
			navshow: function(id) {
				this.navboo = !this.navboo
				this.navtext = id
			},
			toswiper: function(index) {
				this.swiperindex = index
				this.swiper.slideTo(index, 1000, false)
				this.pageNum=1
				this.list=[]
				this.list01=[]
				if(index == 0) {
					this.myajax(2)
				} else {
					this.myajax(0)
				}
			},
			timeshow: function(type) {
				var that = this
				plus.nativeUI.pickDate(function(e) {
					var d = e.date;
					if(type == 0) {
						that.starttime = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
					} else {
						that.endtime = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
					}
				}, function(e) {
					console.log("未选择日期：" + e.message);
				});
			},
			gosearch: function() {
				if(this.swiperindex == 0) {
					this.myajax(2)
				} else {
					this.myajax(0)
				}
			},
			alerttab: function() {
				this.alertboo = !this.alertboo
			}
		}
	}
</script>

<style type="text/css" lang="scss">
	.tselect {
		background: #eeeeee;
		p {
			text-align: center;
		}
		.type {
			display: flex;
			align-items: center;
			img {
				height: .1rem!important;
				width: auto!important;
				margin: 0 .05rem!important;
			}
		}
		.tselect-top {
			display: flex;
			background: #FFFFFF;
			.top-nav {
				flex: 1;
				height: 1rem;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: .26rem;
				box-sizing: border-box;
				font-weight: 500;
				transition: all .3s;
				border-bottom: 2px solid #FFFFFF;
			}
			.active {
				color: #1e81d2;
				border-bottom: 2px solid #1e81d2;
			}
		}
		.time-box {
			display: flex;
			align-items: center;
			height: 1.1rem;
			padding-left: .3rem;
			.box {
				height: .5rem;
				width: 2rem;
				border: 2px solid #1e81d2;
				background: #FFFFFF;
				display: flex;
				align-items: center;
				justify-content: center;
				box-sizing: border-box;
				img {
					height: .1rem;
					margin-left: .2rem;
				}
			}
			.box-go {
				width: 1.5rem;
				height: .5rem;
				background: #1e81d2;
				color: #FFFFFF;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 0 .3rem 0 .4rem;
				img {
					height: .28rem;
					margin-right: .14rem;
				}
			}
			.hr {
				height: 2px;
				background: #1e81d2;
				width: .5rem;
			}
		}
		.select-group {
			background: white;
			padding-bottom: .3rem;
			margin-bottom: .24rem;
			.group-inner {
				margin: 0 .34rem;
			}
			.group-title {
				line-height: .8rem;
				font-size: .3rem;
				border-bottom: 1px solid #b8b8b8;
			}
			.img-box {
				display: flex;
				justify-content: space-between;
				.state {
					line-height: .5rem;
					text-align: center;
					border: 1px solid #b8b8b8;
					border-top: 0;
					margin-top: -2px;
					display: flex;
					align-items: center;
					justify-content: center;
					height: .5rem;
				}
				.upload {
					background: #eeeeee;
					padding: 0 .25rem;
					color: gray;
					height: .35rem;
					line-height: .35rem;
					margin-left: .3rem;
				}
			}
		}
	}
</style>