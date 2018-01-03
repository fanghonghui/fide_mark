<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="data-total">创建日期：{{currentTime | formatDate}}</div>
      <el-form :inline="true" id="editTable" class="demo-form-inline">
        <el-table :data="tableDatas" border style="width: 100%">
          <el-table-column label="账号(必填)">
            <template scope="scope">
              <el-input size="small" v-model="scope.row.managerLoginName"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="姓名(必填)">
            <template scope="scope">
              <el-input size="small" v-model="scope.row.managerName"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="权限">
            <template scope="scope">
              <el-checkbox-group v-model="scope.row.managerRole">
                <el-checkbox v-for="item of rolesOptions" :label="item.roleUuid" :value="item.roleUuid" :key="item.roleUuid">{{item.roleName}}</el-checkbox>
              </el-checkbox-group>
            </template>
          </el-table-column>
          <el-table-column label="联系电话">
            <template scope="scope">
              <el-input size="small" v-model="scope.row.managerMobile" name="managerMobile"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button size="small" type="primary" icon="delete2" @click="deleteRow(scope.$index, tableDatas)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <el-row class="mt15">
        <el-button size="small" type="primary" @click="addRow">继续添加</el-button>
        <el-button size="small" type="primary" @click="saveData">保存</el-button>
        <el-button size="small" type="primary" @click="cancelAdd">取消</el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import { validateValue } from '@/utils/util'
  import { ORGCODE } from '@/config/settings'

  export default {
    data() {
      return {
        currentTime: new Date(),
        rolesOptions: [],
        tableDatas: [{
          managerLoginName: '',
          managerName: '',
          managerRole: [],
          managerMobile: ''
        }],
        checkedItem: []
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.http.post('rolesOptions', {}).then(res => {
          if (res) {
            this.rolesOptions = res.data
          }
        })
      },

      // 继续添加
      addRow() {
        this.tableDatas.push({
          managerLoginName: '',
          managerName: '',
          managerRole: [],
          managerMobile: ''
        })
      },

      // 删除
      deleteRow(index, tableDatas) {
        if (tableDatas.length > 1) {
          tableDatas.splice(index, 1)
        } else {
          return
        }
      },

      // 保存
      saveData() {
        var data = this.tableDatas
        for (var i in data) {
          var mobile = data[i].managerMobile
          if (data[i].managerLoginName === '' || data[i].managerName === '') {
            this.$message.warning('请输入必填信息！')
            return
          }
          if (mobile && !validateValue('mobileOrTel', mobile)) {
            this.$message.warning('请填写正确的联系电话！')
            return
          }
        }

        var length = data.length
        data.map((value, index) => {
          this.http.post('addPerson', this.trimVal(value)).then(res => {
            if (res) {
              if (index != 0) {
                data.splice(index, 1)
              }

              if (index == (length - 1)) {
                this.tableDatas = [{
                  managerLoginName: '',
                  managerName: '',
                  managerRole: [],
                  managerMobile: ''
                }]
                this.$message.success('新增成功！')
                setTimeout(() => {
                  this.$router.push('/permission/roleManagement')
                }, 1500)
              }
            }
          }).catch(err => {
            console.log('err')
          })
        })
      },

      // 过滤输入值空格
      trimVal(data) {
        var params = {}
        params.orgInnerCode = ORGCODE
        for (var i in data) {
          if (i !== 'managerRole') {
            if (data[i] !== '') {
              params[i] = data[i].trim()
            }
          } else {
            params[i] = data[i].join('|')
          }
        }
        return params
      },

      // 取消
      cancelAdd() {
        this.$router.push('/permission/roleManagement')
      }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
  .app-container {
    .el-breadcrumb {
      margin-bottom: 15px;
    }
    .box-card {
      margin-bottom: 20px;
      .el-checkbox {
        margin-right: 10px;
      }
      .el-checkbox+.el-checkbox {
        margin-left: 0
      }
    }
  }
</style>