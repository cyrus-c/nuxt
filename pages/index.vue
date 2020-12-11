<template>
  <div>tt
    <div>
      <ul>
        <li v-for="(item) in baseData" :key="item._id" >
          <span>
            {{item.userName}}
          </span>
          <div>
            <el-button @click="updateData(item)" >updateOne</el-button>
            <el-button @click="deleteData(item)" >deleteOne</el-button>
          </div>
        </li>
      </ul>
      <el-button @click="addData()" type="primary">insertOne</el-button>
      <el-button @click="addMultipleData()" type="primary">insertMany</el-button>
      <el-button @click="search()" type="primary">search</el-button>

      <el-button @click="login()" type="primary">login</el-button>
      <el-button @click="logout()" type="primary">logout</el-button>
      <el-button @click="islogin()" type="primary">islogin</el-button>
      
      <el-upload
        class="upload-demo"
        action="/api/homelist/upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList">
        <el-button size="small" type="primary">upload</el-button>
      </el-upload>
      <!-- <img src="~static/img/logo.png" alt=""> -->
    </div>


  </div>
</template>
       
<script>
import Logo from '~/components/Logo.vue'
import axios from 'axios';

export default {
  components: {
    Logo
  },
  data () {
    return {
      baseData:[],
      fileList:[]
    }
  },
  created() {
    this.getData()
    this.practice()
  },
  mounted() {
  
  },
  methods:{
    practice(){

  


    },
    getData() {
      axios.get('/api/homelist/list').then(res => {
          if(res.data.code == 200){
            this.baseData = res.data.data
          }
      })
    },
    search(){
      this.getData()
    },
    addData() {
      var param = {
        userName: "cc",
      }
      axios.post('/api/homelist/add',param).then(res => {
        console.log(res);
        if(res.data.code == 200){
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          this.getData()
        }
      })
    },
    addMultipleData(){
      var param = [
          { userName: 'c1'},
          { userName: 'c2'},
          { userName: 'c3'}
      ]
      axios.post('/api/homelist/addMultiple',param).then(res => {
          console.log(res);
          if(res.data.code == 200){
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.getData()
          }
      })
    },
    updateData(val){
      var param = {
        uuid: val.uuid,
        newData:'new-'+val.userName
      }
      axios.post('/api/homelist/update',param).then(res => {
          console.log(res);
          if(res.data.code == 200){
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.getData()
          }
      })
    },
    deleteData(val){
      var param = {
        uuid: val.uuid
      }
      axios.post('/api/homelist/delete',param).then(res => {
          console.log(res);
          if(res.data.code == 200){
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.getData()
          }
      })
    },
    // upload
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    // login
    login(){
      var param = {
        name : 'cc',
        password:'123456'
      }
      axios.post('/api/homelist/login',param).then(res => {
          // console.log(res);
          if(res.data.code == 200){
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
          }else{
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
      })
    },
    // logout
    logout(){
      axios.get('/api/homelist/logout').then(res => {
        console.log(res);
        if(res.data.code == 200){
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
        }else{
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
      })
    },
    // isLogin
    islogin(){
      axios.get('/api/homelist/islogin').then(res => {
        // console.log(res);
        if(res.data.loginUser){
          this.$message({
            message: 'logged',
            type: 'success'
          });
        }else{
          this.$message({
            message: 'Not logged in',
            type: 'warning'
          });
        }
      })
    },
    
  }



}
</script>

<style>
  ul{
    width: 50%;
  }
  li{
    display: flex;
    justify-content: space-between;
    margin: 5px 20px;
    background: aliceblue;
    align-items: center;
  }
</style>
