<template>
<div class="app-container">
  <div class="details-box flex">
      <div class="imgbox">
        <image-cropper :width="120" :height="176"
                       :image.sync="image"
                       :url="url"
                       @crop-upload-success="cropSuccess"
                       @crop-upload-fail="cropUploadFail"
                       :key="imagecropperKey">

        </image-cropper>
      </div>
      <div class="txtbox ml25">
        <p> 账号：{{personInfo.managerLoginName}}</p>
        <p> 姓名：{{personInfo.managerName}}</p>
        <p> 推荐码：{{personInfo.managerCode}}</p>
        <p> 电话：{{personInfo.managerMobile}} <i v-show="personInfo.orgName" class="el-icon-edit edit" @click="resetPhone"></i></p>
        <p> 所属：{{personInfo.orgName}} </p>
        <el-button type="info" icon="edit"  @click.native="dialogVisible = true">修改密码</el-button>
      </div>
  </div>

  <el-dialog
    :visible.sync="dialogPhone"
    size="tiny"
    >
    <el-form  align="center">
      <el-form-item label="新电话号码">
        <el-input v-model="modfiyPhone"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogPhone = false">取 消</el-button>
    <el-button type="primary" @click="submitPhone">确 定</el-button>
  </span>
  </el-dialog>

  <el-dialog
    title="修改密码"
    :visible.sync="dialogVisible"
    size="tiny"
    >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item  prop="oldpassword">
        <div>旧密码 <span class="crred f16">*</span></div>
        <el-input type="password" v-model="ruleForm.oldpassword"></el-input>
      </el-form-item>
      <el-form-item prop="pass">
        <div>新密码 <span class="crred f16">*</span></div>
        <el-input type="password" v-model="ruleForm.pass"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass" class="relative">
        <div>确认密码 <span class="crred f16">*</span></div>
        <el-input type="password" v-model="ruleForm.checkPass"></el-input>
        <div class="txt-right beizhu"><span class="f12">（密码长度为6到15位）</span></div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="resetForm('ruleForm')">取 消</el-button>
    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
  </span>
  </el-dialog>

</div>
</template>
<script>
  import { http } from '@/utils/httpHelper'
  import ImageCropper from '@/components/ImageCropper'
  import { md5For16} from '@/utils/util'

  export default {
    components: { ImageCropper },
    data() {
//      var reg =/\w{6,15}$/;
      var validateOldPass = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('旧密码不能为空'));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        value = value.replace(/(^\s*)|(\s*$)/g, "");
        if (value === '') {
          callback(new Error('请输入新密码'));
        }else if(value.length<6||value.length>15){
          callback(new Error('请输入6-15位密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入新密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        sign:'',
        url:'',
        image:'',
        imagecropperKey: 0,
        dialogVisible: false,
        modfiyPhone:'',
        dialogPhone:false,
        ruleForm:{
          oldpassword:'',
          pass:'',
          checkPass:''
        },
        rules: {
          oldpassword: [
            { validator: validateOldPass, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        },
        personInfo:{
          managerLoginName:'暂无',
          managerName:'暂无',
          managerCode:'',
          managerMobile:'暂无',
          orgName:'暂无',
          managerPic:''
        }

      };
    },
    methods: {
      cropSuccess(res) {
        let that = this;
        let pararms = {
          managerUuid:this.personInfo.managerUuid,
          managerPic:res.data.fileid
        };
        http.post('imgSave',pararms).then(respone=>{
          that.image = res.data.download_url+'?sign='+that.sign;
          this.$message.success('上传成功');
         }).catch(err=>{
          this.$message.warning(err);
        })
      },
      cropUploadFail(err){
        this.$message.warning(err);
      },
      //修改手机号码
      submitPhone(){
          var phone = this.modfiyPhone;
          var reg = /^1[3|4|5|6|7|8][0-9]{9}$/;
          var flag = reg.test(phone); //true
          if(!phone){
            this.$message('手机号不能为空');
            return;
          }
          if(phone&&!flag){
           return this.$message('手机号格式不正确');
          }
        http.post('myNewPhone', {managerMobile:phone}).then(res => {
          if(res){
              this.$message.success(res.respMsg);
              this.init();
              this.dialogPhone = false;
          }
        }).catch(err=>{
          this.dialogPhone = false;
        })
      },
      resetPhone(){
        this.modfiyPhone='';
        this.dialogPhone = true;
      },
      //修改密码
      submitForm(formName) {
         let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let pararms = {
              oldPassword : md5For16(this.ruleForm.oldpassword),
              newPassword : md5For16(this.ruleForm.pass)
            };
            http.post('modfiyPass', pararms).then(res => {
               if(res){
                 that.dialogVisible = false;
                 that.$message.success(res.respMsg);
               }
            })
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false;
      },
      init(){
        var that = this;
        http.post('mycenter',{}).then(res => {
          if(!res||!res.data) return false;
          this.personInfo = res.data;
          that.image = this.personInfo.managerPic;
        }).catch(err=>{
        });
        http.get('getSign',{}).then(res => {
        if(!res||!res.data) return false;
        that.sign =  res.data;
       // that.url="http://web.image.myqcloud.com/photos/v2/10002631/ybpimg/0?sign=Lp0bZqwCgOJvbKSZkReg2Hmh3sZhPTEwMDAyNjMxJmI9eWJwaW1nJms9QUtJRFJUdUdTZUhxcUI5a0l1eVNBWVN0ancwQjdlR3ZCSmlVJmU9MTUwODQwMTk2MiZ0PTE1MDU4MDk5NjImcj0xMDYxNDg2Njk2JnU9MCZmPQ=="
          that.url="https://web.image.myqcloud.com/photos/v2/10002631/ybpimg/0/?sign=" + encodeURIComponent(res.data);
        }).catch(err=>{
        });
      }
    },

    mounted(){
      this.init();
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .app-container{
    .el-breadcrumb{
      margin-bottom: 15px;
    }
  }
  .details-box {
    padding:20px;
    background:#f2f2f2;
  }
  .imgbox {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 122px;
    height: 178px;
    box-sizing: border-box;
    position: relative;
  }
  .txtbox p{
     margin-bottom: 15px;
     color:#777;
  }
  .edit {
    cursor: pointer;
    display:inline-block;
    width: 20px;
    height: 20px;
  }
  .beizhu {
    position: absolute;
    width:100%;
  }
</style>
