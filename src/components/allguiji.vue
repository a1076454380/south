<template>
	<div id="wrapper" class="csearch">
		<div id="head">
			<span @click="back">
    			<img src="../../static/back.png"/>
    		</span>
			<div>美丽南钢</div>
			<span></span>
		</div>
		<div id="main" style="height: calc(100% - .8rem);">
			<div class="csearch-top" style="margin-bottom: 0;">
				<div class="csearch-inner">
					<div class="csearch-group" @click="timeshow(0)" style="width: 3.5rem;">
						<span>
    						{{starttime}}
    					</span>
						<img src="../../static/xiaxia.png" />
					</div>
					<div class="csearch-group" @click="timeshow(1)" style="width: 3.5rem;margin: 0;">
						<span>
    						{{endtime}}
    					</span>
						<img src="../../static/xiaxia.png" />
					</div>
				</div>
			</div>
			<div class="csearch-top" style="margin-bottom: 0;">
				<div class="csearch-inner" style="justify-content: space-between;">
					<div class="csearch-group" @click="navshow" style="width: 3.5rem;">
						<span>
    						{{navtext}}
    					</span>
						<img src="../../static/xiaxia.png" />
					</div>
					<div class="csearch-group" style="width: 3.5rem;margin: 0;">
						<input type="text" placeholder="姓名" v-model="uname" />
					</div>
					
				</div>
			</div>
			<div class="csearch-top">
				<div class="csearch-inner">
					<div class="go-search flexc" @click="myajax" style="width: 100%;margin-left: 0;">
						查询
					</div>
				</div>
			</div>
			<div class="csearch-main">
				<div class="group" @click="opennew('allgujilist',val.cuserId)" v-for="val in mydata">
					<!--cdetail-->
					<div class="circle"></div>
					<div class="name">
						{{val.cuserName}}
					</div>
					<div class="upnum">

					</div>
					<div class="oknum">

					</div>
					<img src="../../static/arrright.png" />
				</div>
				<p v-if="mydata.length==0">
					暂无数据
				</p>
			</div>
		</div>
		<transition name='nav'>
			<div class="bottom-nav" v-show='navboo'>
				<div class="nav-group">
					<div class="sub-nav" v-for="(val,index) in bottomone">
						<span @click="navshow(val.text,val.id)">{{val.text}}</span>
					</div>
					<div class="sub-nav clear" @click="navshow('分类')">
						取消
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	export default {
		name: 'allguiji',
		data() {
			return {
				navboo: false,
				navtext: '人员分类',
				uname: '',
				navid: '',
				bottomone: [{
					text: '社区网格员',
					id: 4
				}, {
					text: '环卫工作者',
					id: 5
				}, {
					text: '综合执法队',
					id: 6
				}, {
					text: '城管中心',
					id: 7
				}, {
					text: '街办管理员',
					id: 8
				}, ],
				mydata: [],
				starttime: '开始时间',
				endtime: '结束时间'
			}
		},
		mounted() {
			this.myajax()
		},
		methods: {
			myajax: function() {
				function plusReady() {
					// 弹出系统等待对话框
					var w = plus.nativeUI.showWaiting("数据加载中~");
				}
				if(window.plus) {
					plusReady();
				} else {
					document.addEventListener("plusready", plusReady, false);
				}
				var that = this
				var dataJson = {
					cuserName: that.uname,
					cuserRole: that.navid,
					createTime1: that.starttime,
					updataTime1: that.endtime
				}
				if(that.uname == '') {
					delete dataJson.cuserName
				}
				if(that.navid == '') {
					delete dataJson.cuserRole
				}
				if(that.starttime == '开始时间') {
					delete dataJson.createTime1
				}
				if(that.endtime == '结束时间') {
					delete dataJson.updataTime1
				}
				$.ajax({
					type: "get",
					url: that.service + "/queryAllNames",
					dataType: 'json',
					data: dataJson,
					success: function(res) {
						console.log(res)
						that.mydata = res.data
						function plusReady() {
							// 弹出系统等待对话框
							var w = plus.nativeUI.closeWaiting()
						}
						if(window.plus) {
							plusReady();
						} else {
							document.addEventListener("plusready", plusReady, false);
						}
					}
				});
			},
			opennew: function(target, id) {
				this.$store.state.windexid = id
				this.$router.push({
					name: target
				})
			},
			navshow: function(text, id) {
				this.navboo = !this.navboo
				this.navtext = text
				this.navid = id
			},
			back: function() {
				this.$router.back()
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
			}
		},
		computed: {
			tfoot() {
				return this.$store.state.tfoot
			},
			service() {
				return this.$store.state.service
			}
		},
		components: {
			BootomNav: resolve => require(['./bottom-nav'], resolve)
		}
	}
</script>

<style type="text/css" lang="scss">
	.csearch {
		p {
			text-align: center;
			line-height: 1rem;
		}
		background: #EEEEEE;
		.bottom-nav {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			background: rgba(0, 0, 0, .5);
			z-index: 999;
			.nav-group {
				position: absolute;
				bottom: 0;
				left: 0;
				background: white;
				width: 100%;
				.sub-nav {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					border-bottom: 1px solid ghostwhite;
					flex-direction: column;
				}
				span {
					padding: .3rem 0;
				}
				.nav-inner {
					padding: .3rem 0;
				}
				.clear {
					background: #1e81d2;
					color: white;
					height: .8rem;
				}
			}
		}
		.group {
			width: 100%;
			height: .95rem;
			display: flex;
			align-items: center;
			box-shadow: 0 2px 2px 2px gainsboro;
			background: white;
			margin-bottom: .2rem;
			&:nth-of-type(1n) .circle {
				background: #00b7ee;
			}
			&:nth-of-type(2n) .circle {
				background: #e39b00;
			}
			&:nth-of-type(3n) .circle {
				background: #ff5c5c;
			}
			&:nth-of-type(4n) .circle {
				background: #a8f247;
			}
			&:nth-of-type(5n) .circle {
				background: #a264ff;
			}
			&:nth-of-type(6n) .circle {
				background: #00b7ee;
			}
			&:nth-of-type(7n) .circle {
				background: #ff6262;
			}
			&:nth-of-type(8n) .circle {
				background: #b17dff;
			}
			.circle {
				width: .2rem;
				height: .2rem;
				border-radius: 50%;
				background: #00b7ee;
				margin: 0 .22rem 0 .34rem;
			}
			.name {
				width: 2.24rem;
			}
			.upnum {
				width: 2.1rem;
				color: #848484;
			}
			.oknum {
				width: 1.68rem;
				color: #848484;
			}
			img {
				height: .25rem;
			}
		}
		.csearch-top {
			background: white;
			height: 1rem;
			margin-bottom: .17rem;
		}
		.csearch-inner {
			margin: 0 .34rem;
			display: flex;
			align-items: center;
			height: 100%;
			.csearch-group {
				border: 1px solid #1e81d2;
				color: #1e81d2;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 2rem;
				height: .6rem;
				border-radius: .1rem;
				overflow: hidden;
				margin-right: .3rem;
				img {
					height: .15rem;
					margin-left: .25rem;
				}
				input {
					width: 100%;
					height: 100%;
					border: 0;
					text-align: center;
					color: #1e81d2;
				}
				input::-webkit-input-placeholder {
					color: #1e81d2;
				}
			}
			.go-search {
				background: #1e81d2;
				color: white;
				width: 1.8rem;
				height: .6rem;
				border-radius: .1rem;
				margin-left: .2rem;
			}
		}
	}
</style>