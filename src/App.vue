<template>
	<div id="root" @dragover="dragOver" @drop="dropDownload">
		<div class="windows">
			<div class="title-bar">
				<div class="dots"></div>
				<div class="dots"></div>
				<div class="dots"></div>
				<div class="title-text">user@{{ siteUrl }}</div>
			</div>
			<div id="content" class="content" @dragover="dragOver" @drop="dropUpload">
				<file-icon></file-icon>
				<div class="card download-card">
					接收文件
					<input type="text" class="input-pwd middle" />
					<input type="button" class="btn-down" />
				</div>
				<div :class="['card', 'upload-card', isLoading ? 'backface' : '']">
					上传文件

					<form
						name="upload"
						action=""
						enctype="multipart/form-data"
						method="post"
					>
						<input
							type="file"
							name="file"
							id="file"
							multiple
							@change="fileChanged"
						/>
						<label class="add middle" for="file"></label>
					</form>
					<div id="back">
						<div class="upFileIcon middle">
							<div class="progress" :style="renderProgress"></div>
						</div>
						<div class="info">
							<span id="speed">{{
								loadInfo.speed ? loadInfo.speed : "0 MB/s"
							}}</span>
							<span id="percentage">{{ loadInfo.loadPercentage }}%</span>
							<span id="time">{{
								loadInfo.timeString ? loadInfo.timeString : "0s"
							}}</span>
						</div>
					</div>
				</div>
			</div>
			<footer-bar></footer-bar>
		</div>
	</div>
</template>

<script>
import FileIcon from "@/components/FileIcon.vue";
import FooterBar from "@/components/FooterProgress.vue";

export default {
	name: "MainPage",
	components: {
		"file-icon": FileIcon,
		"footer-bar": FooterBar
	},
	data() {
		return {
			siteUrl: "trans.zhencai.xyz", // 这只是默认值 会根据地址自动修改
			isLoading: false,
			uploadFiles: []
		};
	},
	computed: {
		loadInfo() {
			return this.$store.state.loadInfo;
		},
		renderProgress() {
			return `height:${this.loadInfo.loadPercentage}%;`;
		}
	},
	methods: {
		getFilePWD() {
			return prompt("请输入提取密码");
		},
		getLocalFile(event) {
			let dt = event.dataTransfer;

			//这里chrome获取文件用items对象 需要判断浏览器兼容
			if (dt.items !== undefined) {
				dt.items.forEach(item => {
					//用webkitGetAsEntry禁止上传目录文件
					if (item.kind == "file" && item.webkitGetAsEntry().isFile) {
						this.uploadFiles.push(item.getAsFile());
					} else {
						alert("暂不支持上传文件夹");
					}
				});
			} else {
				dt.files.forEach(file => {
					this.uploadFiles.push(dt.files[i]);
				});
			}
			return this.uploadFiles;
		},

		// 为什么有两个获取上传文件呢 因为同时支持拖拽和点击弹出选择文件框
		fileChanged(e) {
			this.uploadFiles = [...this.uploadFiles, ...e.target.files];
			this.asyncUpload();
		},
		prevent(event) {
			event.preventDefault();
			event.stopPropagation();
		},
		//为了ondrop起作用
		dragOver(event) {
			this.prevent(event);
		},
		dropUpload(event) {
			let that = this;
			this.prevent(event);
			if (!this.$store.state.isDownloadDrag) {
				this.getLocalFile(event);
				this.asyncUpload();
			}
		},
		asyncUpload() {
			let form = new FormData();
			this.uploadFiles.forEach((item, index) => {
				form.append("file" + index, item);
			});
			const axiosConfig = {
				onUploadProgress: progressEvent => {
					this.isLoading = true;
					this.$store.commit("setTimeCounter");
					this.$store.commit("speedCounter", progressEvent);
					// 上传完成后 停止计时并初始化数据
					if (this.loadInfo.loadPercentage === 100) {
						this.$store.commit("stopTimeCounter");
						this.$store.commit("stateInit");
					}
				}
			};
			this.$axios
				.post("/uploadFile.php", form, axiosConfig)
				.then(res => {
					console.log(res);
				})
				.catch(err => {
					console.log(err);
				});
		},
		dropDownload(event) {
			this.prevent(event);
			if (this.$store.state.isDownloadDrag) {
				let pwd = this.getFilePWD();
				this.download(pwd);
			}
		},
		download(pwd) {
			// let url = "http://trans.zhencai.xyz" + "/api/downloadFile.php?pwd=" + pwd;
			// let url = window.location.href + "api/downloadFile.php?pwd=" + pwd;
			// window.location.href = url;
			console.log("download", location.href);
		}
	},
	mounted() {
		this.siteUrl = window.location.host;
	}
};
</script>

<style scoped lang="scss">
.middle {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
* {
	margin: 0;
	padding: 0;
}
#root {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	background-color: #1dd1a1;
}
.title-bar {
	position: relative;
	height: 30px;
	width: 100%;
	background-color: #e7e7e7;
}
.title-text {
	text-align: center;
	line-height: 30px;
	color: #999;
}
.title{
	
}

/*************************************************************************************************/

@media (min-width: 769px) {
	.windows {
		width: 800px;
		margin: 80px;
		background-color: #ececec;
		transition: all ease-in 1s;
	}

	.dots {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		height: 20px;
		width: 20px;
		border-radius: 50%;
		transition: all ease-in 0.5s;
	}
	.dots:nth-child(1) {
		left: 20px;
		background-color: #ff615d;
	}
	.dots:nth-child(2) {
		left: 50px;
		background-color: #fcbe43;
	}
	.dots:nth-child(3) {
		left: 80px;
		background-color: #d0d0d0;
	}
	.content {
		height: 500px;
		width: 100%;
		padding: 8%;
		box-sizing: border-box;
		display: flex;
	}
	.card {
		display: none;
	}
}

/*************************************************************************************************/

@media (max-width: 768px) {
	.windows {
		width: 90%;
		height: 90%;
		margin: 5% auto;
		background-color: #ececec;
	}
	.title-bar {
		height: 40px;
	}
	.title-text {
		line-height: 40px;
	}
	.content {
		position: relative;
		height: 100%;
		width: 100%;

		transition: all ease-in 0.5s;
	}
	.card {
		position: absolute;
		margin: 0 5%;
		width: 90%;
		height: 200px;
		padding: 20px;
		box-sizing: border-box;
		font-size: 14pt;
		font-weight: 600;
		border-radius: 5px;
		box-shadow: 0 0 10px #ddd;
	}
	.download-card {
		position: absolute;
		top: 30%;
		left: 0;
		transform: translateY(-50%);
		color: #fcbe43;
	}
	.input-pwd {
		height: 50px;
		width: 80%;
		outline: none;
		border-style: none;
		border-radius: 5px;
		background-color: #e7e7e7;
		color: #555;
		caret-color: #1dd1a1;
		text-align: center;
		font-size: 20pt;
		font-weight: 600;
		letter-spacing: 10px;
	}
	.btn-down {
		position: absolute;
		right: 10%;
		top: 50%;
		transform: translateY(-50%);
		height: 50px;
		width: 50px;
		border: none;
		outline: none;
		background: url("./assets/download.png") no-repeat;
		background-size: 70% 70%;
		background-position: center center;
		cursor: pointer;
	}
	.btn-down:hover {
		transform: scale(1.05) translateY(-50%);
	}
	.btn-down:focus {
		background-color: rgba(0, 0, 0, 0.01);
	}
	.upload-card {
		top: 70%;
		left: 0;
		transform: translateY(-50%);
		color: #1dd1a1;
		overflow: hidden;
	}
	input[type="file"] {
		width: 100%;
		height: 120%;
		opacity: 0;
		overflow: hidden;
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 10;
	}
	input[type="file"]:focus {
		opacity: 0.1;
		background: #555;
	}
	.add {
		display: block;
		height: 100px;
		width: 100px;
	}
	.add::before {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		content: "";
		width: 10px;
		height: 80%;
		border-radius: 10px;
		background-color: rgba(235, 179, 68, 0.8);
	}
	.add::after {
		content: "";
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 80%;
		height: 10px;
		border-radius: 10px;
		background-color: rgba(29, 209, 161, 0.8);
	}
	.backface {
		position: relative;
		height: 200px;
	}
	.backface > form {
		display: none;
	}
	.backface > #back {
		display: block;
	}
	#back {
		display: none;
	}
	.fileIcon {
		display: none;
	}

	.upFileIcon {
		width: 80px;
		height: 60px;
		border-radius: 2px;
		background-color: #7bd4fc;
		box-shadow: 0 -2px 2px #98daf8;
		cursor: pointer;
	}
	.upFileIcon::before {
		content: "";
		position: absolute;
		top: -8px;
		left: 3px;
		height: 8px;
		width: 30px;
		border-radius: 2px;
		background-color: #98daf8;
	}
	.progress {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		width: inherit;
		background: rgba(0, 0, 0, 0.2);
	}
	#footerBar {
		display: none;
	}
	#progressBar::-webkit-progress-bar {
		background-color: rgba(0, 0, 0, 0.5);
		border: none;
	}
	#progressBar::-webkit-progress-value {
		background-color: rgba(255, 255, 255, 0);
		border: none;
	}
	.info {
		width: 80%;
		position: absolute;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
	}
	.info::before {
		content: "";
		display: block;
	}
	.info::after {
		content: "";
		display: block;
	}
}

/*************************************************************************************************/
</style>
