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
		<div id="head">
			<span @click="back">
					<img src="../../static/back.png"/>
				</span>
			<div>美丽南钢</div>
			<span></span>
		</div>
		<div id="main" style="height: calc(100% - .7rem);">
			<div class="time-box" style="padding: 0;">
				<div class="time-left" style="margin-left: .4rem;">
					<div class="left-box">
						<div class="box" @click="timeshow(0)" style="width: 3.05rem;margin-left: .1rem;">
							{{starttime==''?'开始时间':starttime}}
							<img src="../../static/arrbottom.png" />
						</div>
						<span class="hr"></span>
						<div class="box" @click="timeshow(1)" style="width: 3.05rem;">
							{{endtime==''?'结束时间':endtime}}
							<img src="../../static/arrbottom.png" />
						</div>
					</div>
				</div>
				<div class="box-go" style="visibility: hidden;"></div>
			</div>
			<div class="time-box" style="padding:0;">
				<div class="time-left" style="margin-left: .2rem;">
					<div class="left-box">
						<div class="box" style="width: 100%;">
							<input type="text" placeholder="请输入搜索网格名称" v-model="cgridName" style="width: 100%!important;"/>
						</div>
					</div>
				</div>
				<div class="box-go" @click="gosearch">
					搜索
				</div>
			</div>
			<div class="table-box">
				<table style="flex: 1;">
					<tr class="title">
						<td>
							网格区域
						</td>
						<td>
							上报数量
						</td>
						<td>
							处理数量
						</td>
					</tr>
					<tr v-for="(val,index) in mydata" v-if="val.count1!=0||val.count2!=0">
						<td>
							{{val.cgridName}}
						</td>
						<td>
							{{val.count1}}
						</td>
						<td>
							{{val.count2==null?'0':val.count2}}
						</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</template>

<script>
	import { swiper, swiperSlide } from 'vue-awesome-swiper'
	export default {
		name: 'can',
		data() {
			return {
				starttime: '',
				endtime: '',
				startshow: false,
				timety: 0,
				alertboo: false,
				navindex: -1,
				community:'选择社区',
				grid:'选择网格',
				texttype:'0',
				cgridName:'',
				mydata:''
			}
		},
		components: {
			swiper,
			swiperSlide,
			BootomNav: resolve => require(['./bottom-nav'], resolve)
		},
		mounted() {
			this.myajax()
		},
		computed: {
			service() {
				return this.$store.state.service
			}
		},
		methods: {
			myajax:function(){
				function plusReady() {
					// 弹出系统等待对话框
					var w = plus.nativeUI.showWaiting("数据加载中，可能用时较长，请耐心等待。。。");
				}
				if(window.plus) {
					plusReady();
				} else {
					document.addEventListener("plusready", plusReady, false);
				}
				var that=this
				var formData={
					createTime1: that.starttime,
					handingTime1: that.endtime,
					cgridName: that.cgridName
				}
				if(that.starttime==''){delete formData.createTime1}
				if(that.endtime==''){delete formData.handingTime1}
				if(that.cgridName==''){delete formData.cgridName}
				$.ajax({
					type: "get",
					url: that.service + "/queryGridReportCountAndHandCount",
					dataType: 'json',
					data: formData,
					success: function(res) {
						console.log(res)
						function plusReady(){
							// 弹出系统等待对话框
							plus.nativeUI.closeWaiting();
						}
						if(window.plus){
							plusReady();
						}else{
							document.addEventListener("plusready",plusReady,false);
						}
						for(var i=0;i<res.data[0].length;i++){
							if(res.data[i+1]!=null){
								res.data[0][i].count2=res.data[i+1].count2
							}
						}
						that.mydata=res.data[0]
					},
					error:function(err){
						console.log(err)
					}
				});
			},
			back: function() {
				this.$router.back()
			},
			opennew: function(target) {
				this.$router.push({
					name: target
				})
			},
			navshow: function(num) {
				this.navboo = !this.navboo
				this.texttype = num
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
				this.myajax()
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
		.box input{
			border: 0;
			width:100% ;
			height: 100%;
			text-indent: .2rem;
		}
		.btn{
			position: absolute;
			bottom: .2rem;
			width: calc(100% - .4rem);
			left: .2rem;
			background: #1e81d2;
			color: white;
			display: flex;
			align-items: center;
			justify-content: center;
			height: .8rem;
			border-radius: .1rem;
		}
		.table-box{
			display: flex;
			table{
				width: 100%;
				background: white;
				td{
					height: .6rem;
					line-height: .6rem;
					font-size: .25rem;
					border: 1px solid #ECECEC;
					text-indent: .15rem;
				}
				tr:first-of-type{
					font-weight: 600;
					font-size: .25rem;
				}
			}
		}
		.time-left{
			flex: 1;
			display: flex;
			flex-direction: column;
			.left-box{
				display: flex;
				align-items: center;
				margin: .1rem 0;
			}
		}
		.time-box{
			height: auto;
		}
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
					height: .7rem;
					display: flex;
					align-items: center;
					justify-content: center;
					border-bottom: 1px solid ghostwhite;
				}
				.clear {
					background: #1e81d2;
					color: white;
					height: .8rem;
				}
				.active {
					background: #1e81d2;
					color: white;
				}
			}
		}
		.group img {
			height: .35rem;
		}
		.box-group .group {
			background: #FFFFFF;
			margin: .2rem 0;
			height: .8rem;
			display: flex;
			align-items: center;
			box-shadow: 0 2px 2px 2px gainsboro;
		}
		.riqi {
			display: flex;
			align-items: center;
			margin: 0 .2rem 0 .34rem;
		}
		.text {
			width: 4.4rem;
		}
		.width12 {
			width: .17rem;
			height: .17rem;
			border-radius: 50%;
			margin-right: .35rem;
		}
		.group:nth-of-type(1) .circle {
			background: blue;
		}
		.group:nth-of-type(2) .circle {
			background: yellow;
		}
		.group:nth-of-type(3) .circle {
			background: red;
		}
		.group:nth-of-type(4) .circle {
			background: pink;
		}
		.group:nth-of-type(5) .circle {
			background: peru;
		}
		.group:nth-of-type(6) .circle {
			background: green;
		}
		.back-group {
			background: white;
			width: 100%;
			margin-top: .15rem;
			box-shadow: 0 2px 2px 2px gainsboro;
			height: .95rem;
			display: flex;
			align-items: center;
			font-size: .25rem;
			.circle {
				width: .2rem;
				height: .2rem;
				border-radius: 50%;
				background: #00b7ee;
				margin: 0 .22rem 0 .34rem;
			}
			.date {
				width: 2rem;
			}
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
		}
		.wwang {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.grey {
				color: #8a8a8a;
				font-size: .2rem;
				font-weight: 400;
			}
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
					font-size: .25rem;
					font-weight: 600;
				}
				.upload {
					background: #eeeeee;
					padding: .05rem .25rem;
					color: gray;
					height: .35rem;
					line-height: .35rem;
				}
			}
		}
	}
</style>