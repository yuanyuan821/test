<template>
  <div class='station_body'>
    <div class='station_body_header' style="width:100%;">
      <div class="dis_in">
        <span class="fault_span">时间：</span>
        <el-date-picker v-model="startTime" type="datetime" :clearable=false :editable=false format="yyyy-MM-dd HH:mm:ss" style="width:195px;background:transparent"
          placeholder="选择日期时间">
        </el-date-picker>
      </div>

      <div class="dis_in">
        <span class="fault_span">至</span>
        <el-date-picker v-model="endTime" :clearable=false :editable=false style="width:195px;" type="datetime" format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions2" placeholder="选择日期时间">
        </el-date-picker>
      </div>

      <div class="select_div">
        主站：
        <el-select v-model="mainStation" placeholder="请选择" @change="getStations">
          <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start" v-for="item in mainStations" :key="item.id"
            :disabled="item.name.length<8">
            <el-option :label="item.name" :value="item.id">
            </el-option>
          </el-tooltip>
        </el-select>
      </div>


      <div class="select_div">
        变电站：
        <el-select v-model="station" placeholder="请选择" @change="getRecorders">
          <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start" v-for="item in stations" :key="item.id"
            :disabled="item.name.length<8">
            <el-option :label="item.name" :value="item.id">
            </el-option>
          </el-tooltip>
        </el-select>
      </div>

      <div class="select_div">
        录波器：
        <el-select v-model="recorder" placeholder="请选择">
          <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start" v-for="item in recorders" :key="item.id"
            :disabled="item.name.length<8">
            <el-option :label="item.name" :value="item.id">
            </el-option>
          </el-tooltip>
        </el-select>
      </div>

      <div class="select_div">
        <div class="anniu" @click="serchdata">
          查询
        </div>
      </div>
    </div>

    <div class='station_body_content' style="width:100%;">
      <div style="width:100%;" class="myTable">
        <Warning :tableData="tableData" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)" @setId="openWave">
        </Warning>
        <div class="block" style="float:right" id="oppage">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pagearr"
            :page-size="pageSize" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <Modal v-model="waveShow" width="100" id="bxxs" height="1000px">
      <p slot="header" style="text-align:center">
        <span>波形显示</span>
      </p>
      <div style="width:100%;height:100%;">
        <iframe :src="srcs" frameborder="0" style="width:100%;height:100%;">
        </iframe>
      </div>
    </Modal>
  </div>
</template>
<script>
  import Warning from "./warning.vue"
  export default {
    data() {
      return {
        srcs: '',
        waveShow: false,
        loading: true,
        pagearr: [50, 100, 150, 200, 250, 300],
        pageSize: 50,
        total: 0,
        tableData: [],
        currentPage: 0,
        startTime: new Date(new Date().getTime() - 7* 24 * 3600 * 1000),
        endTime: new Date(),
        smodelsty: {
          height: "400px"
        },
        pickerOptions2: {
          disabledDate: (time) => {
            return time.getTime() < this.startTime;
          }
        },
        mainStations: [],
        stations: [],
        recorders: [],
        mainStation: '',
        station: '',
        recorder: ''
      };
    },
    computed: {},
    methods: {
      //查询全部信息
      serchdata() {
        let that = this;
        let myMethod = '';
        let args = {
          startTime: this.$formatTime(this.startTime),
          endTime: this.$formatTime(this.endTime),
          isPage: 1,
          pageSize: this.pageSize,
          pageNo: this.currentPage,
        }
        if (!that.mainStation) {
          myMethod = 'getFaultRecords';
        } else if (that.mainStation && !that.station) {
          myMethod = 'getFaultRecordByMainstationId';
          args.mainstationId = that.mainStation;
        } else if (that.mainStation && that.station && !that.recorder) {
          myMethod = 'getFaultRecordByStationId';
          args.stationId = that.station;
        } else if (that.recorder) {
          myMethod = 'getFaultRecordByRecorderId';
          args.recorderId = that.recorder;
        }
        $.soap({
          method: myMethod,
          data: args,
          success: function (soapResponse) {
            let data = soapResponse.toJSON().body.return;
            // if(Object.keys(data.error).length == 0){
            if (data.rtn == 0) {
              that.tableData = data.faultRecords;
              that.total = that.tableData.length;
            } else {
              that.$message({
                message: "错误",
                type: 'error'
              });
            }
            that.loading = false;
          }
        })
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.serchdata();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.serchdata()
      },
      //打开波形
      openWave(id) {
        let that = this;
        let args = {
          id: id,
          allSelector: ''
        }
        $.soap({
          method: 'getJsonFile',
          data: args,
          success: function (soapResponse) {
            let data = JSON.parse(soapResponse.toJSON().body.return);
            // if (data.error) {
            //   that.waveShow = false;
            //   that.$message({
            //     message: data.error,
            //     type: 'error'
            //   });
            // } else {
            that.srcs = "/static/waveH5/index.html";
            that.waveShow = true;
            // }
          }
        })
      },
      //得到所有的主站信息
      getMainStations() {
        let that = this;
        $.soap({
          method: 'getMainstationInfo',
          data: {},
          success: function (soapResponse) {
            let data = soapResponse.toJSON().body.return;
            if (data.rtn == 0) {
              that.mainStations = data.mainstationInfos;
            } else {
              that.$message({
                message: data.error,
                type: 'error',
                duration: 1000
              });
            }
          }
        })
      },
      //根据主站Id得到所有变电站
      getStations() {
        let that = this;
        that.station = '';
        that.stations = [];
        that.recorder = '';
        that.recorders = [];
        let args = {
          id: that.mainStation
        }
        $.soap({
          method: 'getStationInfoByMainstionId',
          data: args,
          success: function (soapResponse) {
            let data = soapResponse.toJSON().body.return;
            if (data.rtn == 0) {
              if (!('stationInfos' in data)) {
                that.$message({
                  message: '该主站下没有变电站',
                  type: 'warning',
                  duration: 1000
                });
              } else {
                that.stations = data.stationInfos instanceof Array ? data.stationInfos : [data.stationInfos];
              }
            } else {
              that.$message({
                message: data.error,
                type: 'error',
                duration: 1000
              });
            }
          }
        })
      },
      //根据变电站Id获取所有录波器
      getRecorders() {
        let that = this;
        that.recorder = '';
        that.recorders = [];
        let args = {
          stationId: that.station
        }
        $.soap({
          method: 'getRecorderInfoByStationId',
          data: args,
          success: function (soapResponse) {
            let data = soapResponse.toJSON().body.return;
            if (data.rtn == 0) {
              if (!('recorderInfos' in data)) {
                that.$message({
                  message: '该变电站下没有录波器',
                  type: 'warning',
                  duration: 1000
                });
              } else {
                that.recorders = data.recorderInfos instanceof Array ? data.recorderInfos : [data.recorderInfos];
              }
            } else {
              that.$message({
                message: data.error,
                type: 'error',
                duration: 1000
              });
            }
          }
        })
      },
    },
    components: {
      Warning
    },
    mounted() {
      $.soap({
        url: '/service/FaultRecordService',
        namespaceQualifier: "q0",
        namespaceURL: "http://service.sduept.com/",
        appendMethodToURL: false,
        enableLogging: true,
        error: function (soapResponse) {
          // show error
        }
      });
      this.serchdata();
      this.getMainStations()
    }
  };

</script>
<style>


</style>
