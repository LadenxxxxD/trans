<template>
	<div id="footerBar">
		<div id="footerProgress" :style="renderProgress"></div>
		<section>
			<span>速度：</span>
			<span>{{ loadInfo.speed ? loadInfo.speed : "0 MB/s" }}</span>
			<span style="margin-left: 20px;">时间：</span>
			<span>{{ loadInfo.timeString ? loadInfo.timeString : "0s" }}</span>
		</section>
		<section>
			<div class="percentage"></div>
			<span>{{ loadInfo.loadPercentage }}%</span>
		</section>
	</div>
</template>

<script>
import { mapState } from "vuex";

export default {
	data() {
		return {};
	},
	computed: {
		renderProgress() {
			return `width:${this.loadInfo.loadPercentage}%;`;
		},
		loadInfo() {
			return this.$store.state.loadInfo;
		}
	}
};
</script>

<style lang="scss" scoped>
#footerBar {
	background-color: #e7e7e7;
	padding: 0 20px;
	height: 30px;
	line-height: 30px;
	display: flex;
	justify-content: space-between;
	color: #999;
	font-size: 12px;
	position: relative;
}
#footerProgress {
	position: absolute;
	top: 0;
	left: 0;
	height: inherit;
	display: inherit;
	justify-content: inherit;
	background-color: rgba(0, 0, 0, 0.1);
}
</style>