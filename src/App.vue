<template>
	<div id="app">
		<transition :name="transitionName">
			<div class="wrapper">
				<router-view class="child-view"></router-view>
			</div>
		</transition>
		<audio src="../static/music.mp3" preload="auto" id="bgMusic"></audio>
	</div>
</template>
<script>
	export default {
		name: 'App',
		data() {
			return {
				transitionName: 'slide-left',
				set: '',
				set01: ''
			}
		},
		methods: {
			opennew(target) {
				this.$router.push({
					name: '' + target + '',
					params: {
						id: 2,
						status: 1
					}
				});
			},
			havenew: function() {
				var that = this
				that.set = setInterval(function() {
					$.ajax({
						type: "get",
						url: that.service + "/queryCuserMessagePojoByCuserId",
						dataType: 'json',
						data: {
							cuserId: localStorage.getItem('userid')
						},
						success: function(res) {
							var mycfile = ''
							var mystatus = ''
							var cmessageId = ''
							var cuserCmessageId = ''
							if(res.data.length > 0) {
								for(var i = 0; i < res.data.length; i++) {
									var mm1 = (parseInt(new Date().Format("ss")) - 5).toString();
									if(mm1.length == 1) {
										mm1 = '0' + mm1
									};
									var testdate = res.data[i].createTime1;
									var startDateString = new Date().Format("yyyy-MM-dd hh:mm:" + mm1 + "");
									var endDateString = new Date().Format("yyyy-MM-dd hh:mm:ss");
									//										判断是否在指定时间内
									if(new Date(testdate) > new Date(startDateString) && new Date(testdate) < new Date(endDateString)) {
										mycfile = res.data[i].cfileId
										mystatus = res.data[i].stystemSatus
										cmessageId = res.data[i].cmessageId
										cuserCmessageId = res.data[i].cuserCmessageId
										//											推送消息
										var info = plus.push.getClientInfo();
										if(mystatus == 1) {
											var audio = document.getElementById("bgMusic");
											//播放(继续播放)
											audio.play();
											plus.push.createMessage('您有新的案卷需要处理,请点击查看!');
										} else {
											plus.push.createMessage('您有新的消息！');
										}

										//											点击事件
										plus.push.addEventListener("click", function(msg) {
											if(mystatus == 1) {
												plus.nativeUI.showWaiting('消息处理中')
												$.ajax({
													type: "post",
													url: that.service + "/queryListByCfileId",
													dataType: 'json',
													data: {
														cfileId: mycfile
													},
													success: function(response) {
														plus.nativeUI.closeWaiting()
														if(response.data[0].cfileResult == 1) {
															that.$store.state.windexid = response.data[0].cfileId
															that.$router.push({
																name: 'changedetail'
															})
														} else if(response.data[0].cfileResult == 0 && localStorage.getItem('cuserRole') == 4) {
															that.$store.state.windexid = response.data[0].cfileId
															that.$router.push({
																name: 'ydetail'
															})
														} else {
															that.$store.state.windexid = response.data[0].cfileId
															that.$router.push({
																name: 'changedetail'
															})
														}
													},
													error: function() {
														plus.nativeUI.alert('消息读取错误！')
													}
												})
											} else {
												that.$store.state.newid = cmessageId
												that.$store.state.newstwoid = cuserCmessageId
												that.$router.push({
													name: 'newdetail'
												})
											}

										}, false);
										break
									}
								}
							}
						}
					});
				}, 3000)

			}
		},
		watch: {
			'$route' (to, from) {
				if(to.path == '/') {
					this.transitionName = 'slide-right';
				} else {
					this.transitionName = 'slide-left';
				}
			}
		},
		mounted() {
			var that = this
			that.havenew()
			that.set01 = setInterval(function() {
					plus.geolocation.getCurrentPosition(function(p) {
						$.ajax({
							type: "post",
							url: that.service + "/saveCoordinate",
							dataType: 'json',
							data: {
								cuserId: localStorage.getItem('userid'),
								cuserCoordinate: '[' + p.coords.longitude + ',' + p.coords.latitude + ']'
							},
							success: function(res) {
								console.log(JSON.stringify(res))
							},
							error: function(err) {
								console.log(JSON.stringify(err))
							}
						});
					}, function(e) {
						alert('错误信息:' + e.message);
					});
			}, 5000)

			function plusReady() {
				plus.key.addEventListener("backbutton", function() {
					that.$router.back()
				})
				plus.navigator.setStatusBarBackground('#1e81d2');
			}
			if(window.plus) {
				plusReady();
			} else {
				document.addEventListener("plusready", plusReady, false);
			}

		},
		computed: {
			service() {
				return this.$store.state.service
			}
		}
	}
</script>

<style lang="scss">
	.slide-left-enter,
	.slide-right-leave-active {
		opacity: 0;
		-webkit-transform: translate(100%, 0);
		transform: translate(100%, 0);
	}
	
	.slide-left-leave-active,
	.slide-right-enter {
		opacity: 0;
		-webkit-transform: translate(-100%, 0);
		transform: translate(-100% 0);
	}
</style>