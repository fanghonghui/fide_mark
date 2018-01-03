<template>
  <div class="update-container">
    <div class="pan-item"
         :class="{'active':active,'txt':!!image}"
         :style="{height:height+'px',width:width+'px'}"
         ref="pan"
         @click="handleClick"
         @mouseover="handleMouseover" @mouseout="handleMouseout">
      <img v-show="!!image" class="pan-thumb" :src="image" :class="{'active':active}">
      <input type="file" v-show="false" @change="handleChange" ref="fileinput">
      <canvas class="canvas" v-show="true" :width="width" :height="height" ref="canvas"></canvas>
    </div>
  </div>
</template>
<script>
  import mimes from '@/utils/mimes';
  import data2blob from '@/utils/data2blob';
  export default {
    props: {
      // 域，上传文件name，触发事件会带上（如果一个页面多个图片上传控件，可以做区分
      field: {
        type: String,
        'default': 'fileContent'
      },
      // 原名key，类似于id，触发事件会带上（如果一个页面多个图片上传控件，可以做区分
      ki: {
        'default': 0
      },
      // 显示该控件与否
      value: {
        'default': true
      },
      // 上传地址
      url: {
        type: String,
        'default': ''
      },
      // 其他要上传文件附带的数据，对象格式
      params: {
        type: Object,
        'default': null
      },
      //Add custom headers
      headers: {
        type: Object,
        'default': null
      },
      image: {
        type: String,
        default: ''
      },
      width: {
        type: Number,
        default: '150px'
      },
      height: {
        type: Number,
        default: '150px'
      },
      // 上传地址
      url: {
        type: String,
        'default': 'www.baidu.com'
      },
      // 其他要上传文件附带的数据，对象格式
      params: {
        type: Object,
        'default': null
      },
      //Add custom headers
      headers: {
        type: Object,
        'default': null
      },
      // 单文件大小限制
      maxSize: {
        type: Number,
        'default': 10240
      },
      // 图片上传格式
      imgFormat: {
        type: String,
        'default': 'png'
      }
    },
    data(){
      let that = this,
        {
          imgFormat,
        } = that,
        isSupported = true,
        allowImgFormat = [
          'jpg',
          'png'
        ],
        tempImgFormat = allowImgFormat.indexOf(imgFormat) === -1 ? 'jpg' : imgFormat,
        mime = mimes[tempImgFormat];
      // 规范图片格式
      that.imgFormat = tempImgFormat;
      if (typeof FormData != 'function') {
        isSupported = false;
      }
      return {
        mime,
        isSupported,
        active: false,
        // 原图地址、生成图片地址
        sourceImg: null,
        sourceImgUrl: '',
        createImgUrl: ''
      }
    },
    methods: {
      handleClick(e){
        if (e.target !== this.$refs.fileinput) {
          e.preventDefault();
          if (document.activeElement !== this.$refs) {
            this.$refs.fileinput.click();

          }
        }
      },
      handleMouseover(){
        this.active = true;
      },
      handleMouseout(){
        this.active = false;
      },
      handleChange(e){
        e.preventDefault();
        let files = e.target.files;
        if (files && this.checkFile(files[0])) {
          this.setSourceImg(files[0]);
        }
      },
      //查看文件是否合适
      checkFile(file){
        let that = this,
          {
            maxSize
          } = that;
        if (file.type.indexOf('image') === -1||file.type.indexOf("image/svg+xml")==0) {
          this.$message('上传文件格式不正确');
          return false;
        }
        if (file.size / 1024 > maxSize) {
          this.$message('单文件大小不能超过' + maxSize + 'kb');
          return false;
        }
        return true;
      },
      // 设置图片源
      setSourceImg(file) {
        let that = this,
          fr = new FileReader();
        fr.onload = function (e) {
          that.sourceImgUrl = fr.result;
          that.createImg();
        };
        fr.readAsDataURL(file);
      },
      //图片压缩上传
      createImg() {
        let that = this,
          {
            mime,
            sourceImgUrl,
            width,
            height
          } = that,
          img = new Image();
        img.src = sourceImgUrl;
        img.onload = function () {
          let canvas = that.$refs.canvas,
            ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          const ndata = canvas.toDataURL(mime);
          that.createImgUrl = ndata;
          that.upload();
        }
      },
      //上传文件
      upload(){
        let that = this,
          {
            imgFormat,
            mime,
            url,
            params,
            headers,
            field,
            ki,
            createImgUrl
          } = this,
          fmData = new FormData();
        fmData.append(field, data2blob(createImgUrl, mime), field + '.' + imgFormat);
        // 添加其他参数
        if (typeof params == 'object' && params) {
          Object.keys(params).forEach((k) => {
            fmData.append(k, params[k]);
          })
        }
        //上传文件
        new Promise(function (resolve, reject) {
          let client = new XMLHttpRequest();
          client.open('POST', url, true);
          client.onreadystatechange = function () {
            if (this.readyState !== 4) {
              return;
            }
            if (this.status === 200 || this.status === 201) {
              resolve(JSON.parse(this.responseText));
            } else {
              reject(this.status);
            }
          };
          // 设置header

          if (typeof headers == 'object' && headers) {
            Object.keys(headers).forEach((k) => {
              client.setRequestHeader(k, headers[k]);
            })
          }
          client.send(fmData);
        }).then(
          // 上传成功
          function (resData) {
            if (that.value) {
              that.$emit('crop-upload-success', resData);
            }
          },
          // 上传失败
          function (sts) {
            if (that.value) {
              that.$emit('crop-upload-fail', sts, field, ki);
            }
          }
        );
      }
    },
    mounted(){

    }
  }
</script>

<style scoped>
  .pan-item {
    position: relative;
  }

  .pan-item input {
    position: absolute;
    z-index: -1;
  }

  .pan-item::before {
    display: none;
    content: '添加图片';
  }

  .pan-item.txt::before {
    content: '点击修改';
  }

  .pan-item.active::before {
    display: block;
    position: absolute;
    width: 100%;
    font-size: 16px;
    color: #174435;
    text-align: center;
    height: 0;
    top: 50%;
  }

  .pan-thumb {
    display: block;
    width: 100%;
    height: 100%;
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transition: 1s;
  }

  .pan-thumb.active {
    opacity: 0.2;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }

  .canvas {
    width: 120px;
    height: 176px;
    position: absolute;
    z-index: -4;
  }
</style>
