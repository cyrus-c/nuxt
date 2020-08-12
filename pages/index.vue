<template>
  <div>
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
      baseData:[]
    }
  },
  created() {
    this.getData()
  },
  mounted() {
  
  },
  methods:{
    getData() {
      axios.get('/api/homelist').then(res => {
          console.log(res.data);
          this.baseData = res.data
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
    }
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
