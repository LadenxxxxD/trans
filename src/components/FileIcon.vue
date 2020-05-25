<template>
	<label
		id="fileIcon"
		class="fileIcon"
		for="file"
		draggable="true"
		@dragstart="dragStart"
		@dragend="dragEnd"
	>
	</label>
</template>

<script>
export default {
	data() {
		return {};
	},
	computed: {
		isDownloadDrag() {
			return this.$store.state.isDownloadDrag;
		}
	},
	methods: {
		dragStart(event) {
			event.target.style.opacity = "0.4";
			this.$store.commit("toggleLoadMode");
		},
		dragEnd(event) {
			event.target.style.opacity = "1";
			this.$store.commit("toggleLoadMode");
		}
	}
};
</script>

<style lang="scss" scoped>
.fileIcon {
	display: inline-block;
	position: relative;
	width: 80px;
	height: 60px;
	border-radius: 2px;
	background-color: #7bd4fc;
	box-shadow: 0 -2px 2px #98daf8;
	cursor: pointer;
}
.fileIcon::before {
	content: "";
	position: absolute;
	top: -8px;
	left: 3px;
	height: 8px;
	width: 30px;
	border-radius: 2px;
	background-color: #98daf8;
}
</style>