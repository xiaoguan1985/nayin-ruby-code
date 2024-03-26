<template>
  <div class="container">

    <div class="header flex space-between">
      <div @click="selectNum(item)" class="header-num" v-for="item in num" :key="item">{{item}}</div>
    </div>

    <div class="chinese-code flex flex-center">
      <el-radio @change="deleteArray" v-model="radio" label="2">2位编码</el-radio>
      <el-radio @change="deleteArray" v-model="radio" label="4">4位编码</el-radio>
      <el-button @click="deleteArray" class="right30" type="primary" size="mini" icon="el-icon-s-open">重新选择</el-button>
      
      <el-button @click="submitArray" class="right30" type="primary" size="mini" icon="el-icon-s-goods">选好并收藏</el-button>

      <el-badge :value="countLocal" class="item left30">
        <el-button @click="mineStore" type="primary" size="mini" icon="el-icon-user">我的收藏</el-button>
      </el-badge>
    </div>

    <!-- <div class="show-num" v-show="compose.objArray.length > 0">
      声母和韵母：{{compose.objArray}}
    </div> -->

    <div class="check-index" v-show="numCheck.length > 0">
      <span  v-for="checkItem in numCheck" :key="checkItem.key">{{checkItem.key}}</span>
      <span  v-for="selectItem in selectChinese" :key="selectItem">{{selectItem}}</span>
    </div>

    <div class="content flex space">
      <div class="flex space-between" v-for="checkItem in numCheck" :key="checkItem.key">
        <div>
          
          <div class="content-num" >{{checkItem.key}}</div>
          <div class="content-num-delete">
            <el-button @click="deleteCheckItem(checkItem)" icon="el-icon-close" type="text"></el-button>
          </div>
          

        </div>
        <div class="line-80">

          <div class="flex flex-left flex-column">
            <div class="line30">声母：{{checkItem.soundCheck}} </div>
            <div class="line30">韵母：{{checkItem.compoundCheck}} </div>
          </div>
          

        </div>
      </div>
    </div>

    <div class="show-num">
      <!-- <div class="item" v-show="compose.checkObjArray.length > 0">
        可能的组合：{{compose.checkObjArray}}
      </div>  -->
      <div class="item" v-show="compose.intersection.length > 0">
        <span class="item-span">可以组成拼音：</span> 
        {{compose.intersection}}
      </div>
      <div class="item" v-show="compose.chinese.length > 0">
        <span class="item-span bottom15">对应汉字：（点击下面汉字进行收藏打印）</span>  
        
        <div v-for="composeItem in compose.chinese" :key="composeItem.key">

         
          <el-checkbox v-for="composeItemChild in composeItem"
           @change="composeItemChildHandler(composeItemChild)"
          :max="Number(radio) "
          :label="composeItemChild" 
          :key="composeItemChild">{{composeItemChild}}</el-checkbox>

          <el-divider></el-divider>


        </div>
      </div>
      
    </div>



    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :with-header="false">
      <div class="flex">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="nameKey"
            label="键值">
          </el-table-column>
          <el-table-column
            prop="nameStr"
            label="汉字">
          </el-table-column>
          <el-table-column
            prop="name"
            label="操作">

            <template slot-scope="scope">
              <el-button @click="deleteRow(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
          
        </el-table>

      </div>
      <div class="flex print-btn">
        <el-button @click="printDoc" type="primary">导出Word</el-button>
      </div>
    </el-drawer>


  </div>

  
</template>

<style>
.container{font-size: 14px;}
.header{margin: 0 200px;}
.flex{display: flex;}
.space-between{
  justify-content:space-between;
}
.flex-center{
  justify-content: center;
      align-items: center;
}
.flex-column{
  flex-direction: column;
}
.flex-left{
  align-items: left;
}

.space{
  align-items: flex-start;
}

.header-num{
  margin:10px 20px;
  padding: 20px;
  background: #5cbb7a;
  color: aliceblue;
  border-radius: 5px;
  cursor: pointer;
}
.content-num{
    padding: 20px;
    background: #e6a23c;
    color: aliceblue;
    border-radius: 5px;
    margin: 10px 20px 0;
    line-height: 20px;
    height: 20px;
}
.content-num-delete{
  color: aliceblue;
  margin: 0px 20px;
}
.line-80{
  line-height: 80px;
}
.check-index{
  margin: 20px auto;
  text-align: center;
}
.check-index span{
  padding: 10px;
  background: #ddd;
}
.chinese-code{
  margin: 10px 0;
}
.show-num{
  margin: 10px 20px;
}
.show-num .item{
  margin: 10px 0;
  text-align: left;
}
.show-num .item-span{
  color: #f56c6c;
}

.check-icon{
  margin: 0 20px 0 20px;
}
.compose-item-child{
  margin: 5px 15px;
  cursor: pointer;
  text-decoration: underline;
  color: #2c3e50;
  display: inline-block;
}
.right30{
  margin-right: 30px;
}
.left30{
  margin-left: 30px;
}
.line30{
  height: 40px;
  line-height: 40px;
}
.bottom15{
  display: inline-block;
  margin-bottom: 15px;
}
.print-btn{
  margin-top: 10px;
  justify-content: center;
}
.el-table{
  font-size: 12px;
}
.el-table .el-table__cell{
  padding: 2px 0;
}
</style>

<script>

  import { sound, compound, right, commonJSON } from "@/data/data.js";
  import { map } from "@/data/json-map.js";
  import { getLoaclStorage, setLoaclStorage, getALLLoaclStorage,removeLoaclStorage } from "@/util/util";

  // word 方案
  import docxtemplater from 'docxtemplater'
  import PizZip from 'pizzip'
  import JSZipUtils from 'jszip-utils'
  import {saveAs} from 'file-saver'

  export default {
    data() {
      
      return {

        radio:'2',

        num: [1,2,3,4,5,6,7,8,9,0],

        numCheck:[],

        selectChinese:[],

        drawer: false,

        countLocal:0,

        tableData : []
      }
    },

    created(){
      this.countLocalHandler();
    },

    methods:{

      selectNum(obj){

        let size = this.numCheck.length;

        let arrayCheck = this.numCheck;

        if(size >= Number(this.radio)){
          return;
        }

        if(size == arrayCheck.length){

          this.numCheck.push({
            key:obj,
            soundCheck: sound[obj],
            compoundCheck:compound[obj]
          });
        }
        
      },

      deleteArray(){
        this.numCheck = [];
        this.selectChinese = [];
      },

      deleteCheckItem(item){
        let index = this.numCheck.indexOf(item);
        this.numCheck.splice(index,1);

        this.selectChinese = [];
      },

      composeItemChildHandler(item){

        let size = this.selectChinese.length;
        
        if(this.selectChinese.indexOf(item) == -1){
          this.selectChinese.push(item);
        }else{
          this.selectChinese.splice(this.selectChinese.indexOf(item),1)
        }
      },

      mineStore(){
        this.drawer = true;

        let arr = getALLLoaclStorage();

        this.tableData = [];

        arr.map((item)=>{

          console.log(item)

          let row = {};
          let jsonVal = JSON.parse(item.val);
          row.nameKey = jsonVal.key;
          row.nameStr = jsonVal.value;

          this.tableData.push(row);
        })

        
      },
      
      // 选好并收藏
      submitArray(){
        let s_len = Number(this.radio) == 2 ? 1 : 2;

        if(this.selectChinese.length != s_len){
          this.$message({
            message: '选择的汉字和编码不一致',
            type: 'error'
          });
          return;
        }        

        let str = '';

        this.numCheck.forEach((item)=>{
          str += item.key;
        })

        let jsonObj = {
          key : str,
          value : this.selectChinese
        };

        // 存储编码和值
        setLoaclStorage('key-' + str, JSON.stringify(jsonObj) );

        this.countLocalHandler();

        this.$message({
          message: '已经收藏可以打印了',
          type: 'success'
        });

      },

      deleteRow(row){

        console.log(row, this.tableData)

        let tableIndex = this.tableData.indexOf(row);

        if( tableIndex !== -1){
          this.tableData.splice(tableIndex, 1);
          removeLoaclStorage('key-' + row.nameKey);
          this.countLocalHandler();
        }
      },

      countLocalHandler(){

        let arr = getALLLoaclStorage();

        console.log(arr);
        
        this.countLocal = arr.length;
      },

      printDoc(){

        let that = this;

        let docxsrc = "./static/template.docx";        //模板文件的位置
        let docxname = "我的编码.docx";        //导出文件的名字
        // 读取并获得模板文件的二进制内容
        JSZipUtils.getBinaryContent(docxsrc, function(error, content) {
            // docxsrc是模板。我们在导出的时候，会根据此模板来导出对应的数据
            // 抛出异常
            if (error) {
                throw error;
            }
    
            // 创建一个PizZip实例，内容为模板的内容
            let zip = new PizZip(content);
            // 创建并加载docx templater实例对象
            let doc = new docxtemplater().loadZip(zip);

            let china = [];
            that.tableData.forEach((item, index)=>{

              let obj = {
                count:index+1,
                key : item.nameKey,
                name : item.nameStr.join('')
              }

              china.push(obj);
            });

            // 设置模板变量的值
            doc.setData({
                china: china
            });
    
            try {
                // 用模板变量的值替换所有模板变量
                doc.render();
            } catch (error) {
              // 抛出异常
              let e = {
                  message: error.message,
                  name: error.name,
                  stack: error.stack,
                  properties: error.properties
                  };
              console.log(JSON.stringify({ error: e }));
              throw error;
            }
    
            // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
            let out = doc.getZip().generate({
                type: "blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            });
            // 将目标文件对象保存为目标类型的文件，并命名
            saveAs(out, docxname);
        });
      }
    },

    computed:{

      compose:function(){

        let objArray = [];
        
        this.numCheck.forEach((item,index)=>{

          let jsonObj = {};

          if(index == 0 || index == 2){
            jsonObj = {
              'key': item.key,
              'value' : item.soundCheck
            }
          }
          if(index == 1 || index == 3){
            jsonObj = {
              'key': item.key,
              'value' : item.compoundCheck
            }
          }

          objArray.push(jsonObj);
        })

        let checkObjArray = [];
        let intersection = [];
        let chinese = [];
        
        if(objArray.length >= Number(this.radio)){
          
           for(var i=0;i<objArray[0].value.length;i++){

             for(var j=0;j<objArray[1].value.length;j++){

               checkObjArray.push(objArray[0].value[i]+objArray[1].value[j])
             }
           }

           if(Number(this.radio) >= 4){
             for(var i=0;i<objArray[2].value.length;i++){
              for(var j=0;j<objArray[3].value.length;j++){
                checkObjArray.push(objArray[2].value[i]+objArray[3].value[j])
              }
            }
           }
           

           intersection = checkObjArray.filter(v => right.includes(v));

           intersection.forEach((item,index)=>{
            //  chinese.push(map[item])
             chinese.push(commonJSON[item])
            
           })

        }

        return {objArray : objArray, checkObjArray:checkObjArray, intersection: intersection, chinese:chinese};
      }
    }
  };
</script>
