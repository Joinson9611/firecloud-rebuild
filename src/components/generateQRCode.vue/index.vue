<template>
	<canvas id="QRCode_header"></canvas>
</template>

<script>
import QRCode from "qrcode"
export default {
  props:{
    url:{
      required: true,
      type: String
    }
  },
	data() {
		return {
			QRCodeMsg: "",
			options: {
				errorCorrectionLevel: "H", //容错级别
				type: "image/png", //生成的二维码类型
				quality: 0.3, //二维码质量
				margin: 12, //二维码留白边距
				width: '100%', //宽
				height: '100%', //高
				text: 'http://www.baidu.com', //二维码内容
				color: {
					dark: "#333333", //前景色
					light: "#fff" //背景色
				}
			}
		}
	},
	mounted() {
		this.QRCodeMsg = this.url //生成的二维码为URL地址js
		let msg = document.getElementById("QRCode_header")
		// 将获取到的数据（val）画到msg（canvas）上
		QRCode.toCanvas(msg, this.url, this.options, function (err) {
      console.log(err)
		})
	},
	methods: {}
}
</script>
