<template>
  <div class="app-container">
    <el-card class="box-card search-box">
      <el-form :inline="true" :model="formData">
        <el-form-item>
          <div class="sub-title">账号</div>
          <el-input size="small" v-model="formData.managerLoginName"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">姓名</div>
          <el-input size="small" v-model="formData.managerName"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">推荐码</div>
          <el-input size="small" v-model="formData.managerCode"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">联系电话</div>
          <el-input size="small" v-model="formData.managerMobile"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">权限</div>
          <el-select size="small" clearable v-model="formData.roleUuid" placeholder="全部">
            <el-option v-for="item in rolesOptions" :key="item.roleUuid" :label="item.roleName" :value="item.roleUuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">创建时间(起)</div>
          <el-date-picker size="small" v-model="formData.startTime" type="date">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">创建时间(止)</div>
          <el-date-picker size="small" v-model="formData.endTime" type="date">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" class="search-btn-style" icon="search" type="primary" @click="searchBtn">检索</el-button>
          <el-button size="small" class="search-btn-style" icon="plus" type="primary" @click="addPerson">新增人员</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div class="data-total">
        <span class="pdr25">人数：{{tableData.total || 0}}人</span>
      </div>
      <el-table :data="tableData.list" border style="width: 100%">
        <el-table-column prop="managerLoginName" label="账号"></el-table-column>
        <el-table-column prop="managerName" label="姓名"></el-table-column>
        <el-table-column prop="roleName" label="权限"></el-table-column>
        <el-table-column prop="managerCode" label="推荐码"></el-table-column>
        <el-table-column prop="managerMobile" label="联系电话"></el-table-column>
        <el-table-column label="创建时间" width="180">
          <template scope="scope">
            {{scope.row.createTime | format}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-col style="margin-top:5px;">
              <el-button size="small" class="mb5" icon="edit" type="primary" :disabled="scope.row.isManager" @click="editBtn(scope.row)">编辑</el-button>
              <el-button size="small" class="mb5" icon="delete2" type="primary" :disabled="scope.row.isManager" @click="deleteBtn(scope.row)">删除</el-button>
            </el-col>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
        layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </el-card>

    <!--编辑-->
    <el-dialog size="tiny" :visible.sync="editPersonalInfo">
      <span slot="title">创建时间：{{personalInfo.createTime | formatDate}}</span>
      <div class="clearfix">
        <div class="person-image fl">
          <img v-if="personalInfo.managerPic" :src="personalInfo.managerPic" />
          <span v-else>未上传</span>
        </div>
        <div class="fl">
          <p class="mb15">账号：{{personalInfo.managerLoginName}}</p>
          <div class="mb15 clearfix">
            <div class="fl edit-account">姓名：</div>
            <el-input class="fl" size="small" v-model="managerName" :value="personalInfo.managerName" style="width: 120px;"></el-input>
          </div>
          <p class="mb15">推荐码：{{personalInfo.managerCode || '暂无'}}</p>
          <p class="mb15">联系电话：{{personalInfo.managerMobile || '暂无'}}</p>
          <p class="mb15">
            <el-checkbox-group v-model="selectedRoles">
              <el-checkbox label="销售"></el-checkbox>
              <el-checkbox label="客服"></el-checkbox>
            </el-checkbox-group>
          </p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPersonalInfo = false">取 消</el-button>
        <el-button type="primary" @click="resetPwd(personalInfo.managerUuid)">恢复默认密码(000000)</el-button>
        <el-button type="primary" @click="saveData(personalInfo.managerUuid)">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { ORGCODE } from '@/config/settings'

  export default {
    data() {
      return {
        formData: {
          managerLoginName: '',
          managerName: '',
          managerMobile: '',
          managerCode: '',
          roleUuid: '',
          startTime: '',
          endTime: '',
          orgInnerCode: ORGCODE
        },
        pageSize: 20,
        currentPage: 1,
        total: 0,
        rolesOptions: [],
        tableData: [],
        createTime: '',
        editPersonalInfo: false,
        personalInfo: {},
        selectedRoles: [],
        managerName: ''
      }
    },
    created() {
      this.getRoleList()
      this.fetchData(this.currentPage)
    },
    methods: {
      // 权限下拉框选项
      getRoleList() {
        this.http.smallPost('rolesOptions', {}).then(res => {
          if (res) {
            this.rolesOptions = res.data
          }
        })
      },

      // 查询列表数据
      fetchData(pageNum) {
        var data = this.formData

        var params = {}
        params.pageSize = this.pageSize
        params.pageNum = pageNum

        for (var i in data) {
          if (data[i] !== '') {
            if (i === 'startTime') {
              data[i] = this.$moment(data[i]).startOf('day').format()
            }
            if (i === 'endTime') {
              data[i] = this.$moment(data[i]).endOf('day').format()
            }
            params[i] = data[i]
          }
        }

        this.http.post('permissionList', this.filterParams(params)).then(res => {
          if (res && res.data) {
            var data = res.data
            var list = data.list

            list.map(item => {
              if(item.roleName.split(" ").indexOf("主管") != -1 ) {
                item.isManager = true
              } else {
                item.isManager = false
              }
            })
            this.tableData = data
            this.total = data.total
          }
        })
      },

      // 检索
      searchBtn() {
        this.fetchData(this.currentPage)
      },

      // 新增
      addPerson() {
        this.$router.push('/permission/roleManagement/addPerson')
      },

      // 编辑
      editBtn(row) {
        this.editPersonalInfo = true
        this.personalInfo = row
        this.managerName = row.managerName
        this.selectedRoles = row.roleName.split(' ')
      },

      // 恢复默认密码
      resetPwd(managerUuid) {
        this.http.post('resetManagerPassword', { managerUuid: managerUuid }).then(res => {
          if (res) {
            this.editPersonalInfo = false
            this.$message.success('恢复系统默认密码成功！')
          }
        })
      },

      // 保存
      saveData(managerUuid) {
        var params = {
          managerUuid: managerUuid,
          managerRole: this.selectedRoles.join('|'),
          managerName: this.managerName
        }

        this.http.post('updateManager', params).then(res => {
          if (res) {
            this.editPersonalInfo = false
            this.$message.success('修改成功！')
            this.fetchData(this.currentPage)
          }
        })
      },

      // 删除
      deleteBtn(row) {
        this.$confirm('确定删除' + row.managerName + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.http.post('deleteManager', { managerUuid: row.managerUuid }).then(res => {
            if (res) {
              this.$message.success('删除成功！')
              this.fetchData(this.currentPage)
            }
          })
        }).catch(() => { })
      },

      handleSizeChange(val) {
        this.pageSize = val
        this.fetchData(this.currentPage)
      },

      handleCurrentChange(val) {
        this.currentPage = val
        this.fetchData(this.currentPage)
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
      .small-image {
        width: 44px;
        height: 60px;
        margin: 10px 0;
      }
    }
    .person-image {
      padding: 4px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-right: 20px;
      width: 110px;
      height: 150px;
      line-height: 130px;
      text-align: center;
      img {
        width: 100px;
        height: 140px;
        vertical-align: middle;
      }
    }
    .edit-account {
      vertical-align: middle;
      line-height: 1;
      padding-top: 7px;
      box-sizing: border-box;
    }
  }
</style>