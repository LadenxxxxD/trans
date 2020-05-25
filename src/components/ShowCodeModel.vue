<template>
	<div id="show-pwd" class="middle">
		<div class="title-bar">
			<div id="show-close"></div>
			<div class="title-text">上传成功</div>
		</div>
		<div class="middle">
			<span></span>
		</div>
	</div>
</template>

<script>
export default {};
</script>

<style scoped>
#show-pwd {
	width: 300px;
	height: 200px;
	background: #ececec;
	box-sizing: border-box;
	box-shadow: 0 0 20px #888;
	display: none;
}
#show-pwd .middle {
	width: 61%;
}
#show-pwd span {
	display: inline-block;
	width: 40px;
	height: 40px;
	text-align: center;
	font-size: 20pt;
	font-weight: 600;
	box-shadow: 0 0 5px #ccc;
	color: #1dd1a1;
}
#show-close {
	position: absolute;
	margin: 6px;
	height: 20px;
	width: 20px;
	border-radius: 50%;
	background: url("./assets/close.png") no-repeat;
	background-size: cover;
	background-position: center center;
}
#show-close:hover {
	transform: scale(1.3);
}
</style>