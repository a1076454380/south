<template>
	<div id="wrapper" class="news">
		<div id="head">
			<span @click="back">
					<img src="../../static/back.png"/>
				</span>
			<div>美丽南钢</div>
			<span></span>
		</div>
		<div id="main" style="height: calc(100% - .7rem);">
			<div class="group" v-for="val in mydata" @click="opennew('newdetail',val.cmessageId,val.cuserCmessageId,val.stystemSatus,val.cfileId,val.status)">
				<div class="circle" v-show="val.status!=1"></div>
				<div class="title">
					{{val.cmessageTitle}}
				</div>
			</div>
			<p v-if="mydata.length==0">
				您好没有消息呢，赶快活跃起来吧
			</p>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'news',
		data() {
			return {
				mydata: []
			}
		},
		mounted() {
			this.myajax()
		},
		methods: {
			opennew: function(target, id, twoid, stystemSatus, cfileId, status) {
				var that = this
				$.ajax({
					type: "post",
					url: that.service + "/updateCuserCmessageByPrimaryKeySelective",
					dataType: 'json',
					data: {
						cmessageId: id,
						cuserCmessageId: twoid
					}
				});
				if(stystemSatus == 1){
					$.ajax({
						type: "post",
						url: that.service + "/queryListByCfileId",
						dataType: 'json',
						data: {
							cfileId: cfileId
						},
						success:function(res){
							if(res.data[0].cfileResult == 1){
								that.$store.state.windexid = cfileId
								that.$router.push({
									name: 'changedetail'
								})
							}else if(res.data[0].cfileResult == 0){
								that.$store.state.windexid = cfileId
								that.$router.push({
									name: 'ydetail'
								})
							}else{
								that.$store.state.windexid = cfileId
								that.$router.push({
									name: 'changedetail'
								})
							}
						}
					});
					
				}else{
					this.$store.state.newid = id
						this.$store.state.newstwoid = twoid
						this.$router.push({
							name: target
						})
				}
					
				
			},
			back: function() {
				this.$router.back()
			},
			myajax: function() {
				plus.nativeUI.showWaiting('数据加载中')
				var that = this;
				$.ajax({
					type: "get",
					url: that.service + "/queryCuserMessagePojoByCuserId",
					dataType: 'json',
					data: {
						cuserId: localStorage.getItem('userid')
					},
					success: function(res) {
						that.mydata = res.data
						plus.nativeUI.closeWaiting()
					}
				});
			}
		},
		computed: {
			service() {
				return this.$store.state.service
			}
		},
		components: {
			THead: resolve => require(['./tourists/thead'], resolve)
		}
	}
</script>

<style type="text/css" lang="scss">
	.news {
		background: #ECECEC;
		p {
			text-align: center;
			line-height: 1rem;
		}
		.group {
			background: white;
			padding: .15rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #ECECEC;
			.title {
				font-size: .3rem;
				font-weight: 600;
				line-height: .5rem;
				flex: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.text {
				color: #666666;
				line-height: .4rem;
				height: .8rem;
				margin-top: .2rem;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.time {
				text-align: right;
				margin-top: .1rem;
				margin-right: .2rem;
				width: 1.5rem;
			}
			.circle {
				width: .1rem;
				height: .1rem;
				border-radius: 50%;
				background: rgb(280, 80, 60);
				margin-right: .15rem;
			}
		}
	}
</style>