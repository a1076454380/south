<template>
	<div id="head">
		<span>
			<em v-show="thead" @click="opennew('login')">
				登陆
			</em>
		</span>
		<div>美丽南钢</div>
		<span>
			
		</span>
	</div>
</template>

<script>
	export default {
		name: 'dthead',
		data() {
			return {
				thead: true
			}
		},
		methods: {
			opennew: function(target) {
				this.$router.push({
					name: target
				})
			}
		},
		mounted(){
			if(localStorage.getItem('userid')==null){
				this.thead=true
			}else{
				this.thead=false
			}
		},
		computed:{
			usertype(){
				return this.$store.state.usertype
			}
		}
	}
</script>

<style type="text/css" lang="scss">

</style>