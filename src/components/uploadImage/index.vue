<template>
	<div class="upload-image">
		<div v-if="imageUrl" class="image-wrapper" v-viewer>
			<img :src="imageUrl" class="image" />
		</div>
		<div v-else class="upload" @click="openFile">
			<el-icon class="image-uploader-icon"><Plus /></el-icon>
		</div>
		<div v-if="imageUrl" class="image-shelter">
			<span @click="show"
				><el-icon><ZoomIn /></el-icon
			></span>
			<span @click="openFile"
				><el-icon><Upload /></el-icon
			></span>
			<span v-if="isDelete" @click="deleteFile"
				><el-icon><Delete /></el-icon
			></span>
		</div>
		<input ref="file" type="file" style="display: none" @change="changFile" />
		<!-- <el-button class="btnSelectImg" type="primary" size="small" @click="openFile">选择图片</el-button> -->
	</div>
</template>
<script>
import "viewerjs/dist/viewer.css"
import { directive as viewer } from "v-viewer"
export default {
	props: {
		url: {
			type: String
		},
		isDelete: {
			type: Boolean,
			default: false
		}
	},
	directives: {
		viewer: viewer({
			debug: true,
			zIndex: 9999
		})
	},
	watch: {
		url: {
			handler(val) {
				this.imageUrl = val
			},
			immediate: true
		}
	},
	data() {
		return {
			imageUrl: "",
			fileList: []
		}
	},
	methods: {
		changFile({ target }) {
			const { files } = target
			if (files.length) {
				const isImg = files[0].type.includes("image")
				const MB = 10
				const isLtSize = files[0].size / 1024 / 1024 < MB
				// 判断文件是否为图片
				if (!isImg) {
					this.$message({ type: "warning", message: "上传文件只能为图片" })
					return
				}
				if (!isLtSize) {
					this.$message({ type: "warning", message: `上传文件大小不能超过${MB}M` })
					return
				}
				// 图片文件转化为对象
				this.imageUrl = URL.createObjectURL(files[0])
				this.$emit("getImgFile", files[0])
			}
		},
		deleteFile() {
			this.$emit("getImgFile", "")
			this.imageUrl = ""
			this.fileList = []
		},
		openFile() {
			this.$refs.file.click()
		},
		show() {
			const viewer = this.$el.querySelector(".image-wrapper").$viewer
			viewer.show()
		}
	}
}
</script>

<style lang="scss" scoped>
.upload-image {
	position: relative;
	min-height: 120px;
	min-width: 120px;
	max-height: 160px;
	max-width: 160px;
	width: 100%;
	height: 100%;
	.image,
	.upload,
	.image-wrapper,
	.image-uploader-icon {
		width: 100%;
		height: 100%;
	}
	.image-shelter {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		cursor: default;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		opacity: 0;
		font-size: 20px;
		background-color: rgba(0, 0, 0, 0.5);
		transition: opacity 0.2s;
		&:hover {
			opacity: 1;
		}
		span {
			cursor: pointer;
			margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
		}
	}
	.upload {
		border: 1px dashed var(--el-border-color);
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition: border 0.2s;
		&:hover {
			border: 1px dashed #409eff;
		}
		.image-uploader-icon {
			font-size: 28px;
			color: #8c939d;
			text-align: center;
		}
	}
	.btnSelectImg {
		margin-top: 5px;
	}
}
</style>
