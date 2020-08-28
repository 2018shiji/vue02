<template>
  <b-container class="layout">

    <div class="main">


        <div>
            <div>终端设备在线情况</div>
        </div>

        <div>
            <b-card no-body>
                <b-tabs pills card vertical>
                    <b-tab title="主服务器">
                        <b-table sticky-header="500px" striped hover :items="ServerContents" :fields="ServerFields" small="true" responsive="sm">
                            <template v-slot:cell(server_light)="data">
                                <b-button size="sm" class="mr-2" :variant="data.item.serverOnline?'success':'danger'">O</b-button>
                            </template>
                        </b-table>
                    </b-tab>

                    <b-tab title="场桥摄像机">
                        <b-table sticky-header="500px" striped hover :items="BridgeContents" :fields="BridgeFields" small="true" responsive="sm">
                            <template v-slot:cell(1st_light)="data">
                                <b-button size="sm" class="mr-2" :variant="data.item.fBridgeOnline?'success':'danger'">O</b-button>
                            </template>
                            <template v-slot:cell(2nd_light)="data">
                                <b-button size="sm" class="mr-2" :variant="data.item.sBridgeOnline?'success':'danger'">O</b-button>
                            </template>
                        </b-table>
                    </b-tab>

                    <b-tab title="RFID & Carema" active>
                        <b-table sticky-header="520px" striped hover :items="RCContents" :fields="RCFields" small="true" responsive="sm">
                            <template v-slot:cell(RFID_light)="data">
                                <b-button size="sm" class="mr-2" :variant="data.item.RFIDOnline?'success':'danger'">O</b-button>
                            </template>
                            <template v-slot:cell(camera_light)="data">
                                <b-button size="sm" class="mr-2" :variant="data.item.cameraOnline?'success':'danger'">O</b-button>
                            </template>
                        </b-table>
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>

    </div>
  </b-container>
</template>

<script>
  import axios from "axios";

  export default {
    name: "HelloWorld",
    data(){
      return{
        ServerFields:[],
        ServerContents:[],
        RCFields:[],
        RCContents:[],
        BridgeFields:[],
        BridgeContents:[],
        timer:null,//定时器名称
      };
    },


    mounted() {
        this.queryRCInfo('/api/getRFIDAndCamera');
        this.queryBridgeInfo('/api/getFieldBridge');
        this.queryServerInfo('/api/getMainServerResp');
        this.timer = setInterval(() => {
          setTimeout(
              this.queryRCInfo('/api/getRFIDAndCamera'),
              this.queryBridgeInfo('/api/getFieldBridge'),
              this.queryServerInfo('/api/getMainServerResp'),
              0)},
            1000 * 20)
    },

    methods:{

        queryRCInfo(url){
        console.log(url);
        axios
                .post(url)
                .then(response => {
                  this.RCContents = response.data;
                  console.log("++++++++++++++" + this.RCContents.length + url);
                  console.log("--------------" + this.RCContents);
                  this.formatRCOutput();
                })
                .catch(err => {
                  console.log(err);
                })
        },

        queryBridgeInfo(url){
            axios
                .post(url)
                .then(response => {
                    this.BridgeContents = response.data;
                    this.formatBridgeOutput();
                })
                .catch(err => {
                    console.log(err);
                })
        },

        queryServerInfo(url){
            axios
                .post(url)
                .then(response => {
                    this.ServerContents = response.data;
                    this.formatServerOutput();
                })
                .catch(err => {
                    console.log(err);
                })
        },

          beforeDestroy(){
            clearInterval(this.timer);
            this.timer = null;
          },

          formatRCOutput(){
            this.RCFields = [
                {key:'stationed', label:'标杆', sortable:true},
                {key:"RFIDIP", label:'RFID-IP', sortable:true},
                {key:'RFIDTimeStamp', label:'RFID时间戳', sortable:false},
                {key:'RFID_light', label:'RFID亮灯',sortable:false},
                {key:"cameraIP", label:'Camera-IP', sortable:true},
                {key:'cameraTimeStamp', label:'Camera时间戳', sortable:false},
                {key:'camera_light', label:'Camera亮灯', sortable:false}
            ]},

        formatBridgeOutput(){
            this.BridgeFields = [
                {key:'stationed', label:'场桥', sortable:true},
                {key:"fBridgeIP", label:'1st 场桥-IP', sortable:true},
                {key:'fBridgeTimeStamp', label:'1st 场桥 时间戳', sortable:false},
                {key:'1st_light', label:'1st场桥亮灯',sortable:false},
                {key:"sBridgeIP", label:'2nd 场桥-IP', sortable:true},
                {key:'sBridgeTimeStamp', label:'2nd 场桥 时间戳', sortable:false},
                {key:'2nd_light', label:'2nd场桥亮灯', sortable:false}
        ]},

        formatServerOutput(){
            this.ServerFields = [
                {key:'serverType', label:'服务器', sortable:false},
                {key:"serverIP", label:'服务器IP', sortable:true},
                {key:'serverTimeStamp', label:'服务器时间戳', sortable:false},
                {key:'server_light', label:'服务器亮灯',sortable:false},
                ]},

    }
  }

</script>

<style scoped>
  .layout{
    width:100%;
    height:100%;
    display:flex;
    flex-direction: column;
  }

  .main{
    flex:1;
    display:flex;
    flex-direction: column;
    overflow:auto;
  }

</style>
