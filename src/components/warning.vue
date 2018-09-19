<template>
  <div style="height: 100%">
    <div style="height:100%;" id="gzjs_table" class="clicri_table">
      <el-table :data="tableData" height="100" border size="small" style="width: 100%" row-class-name="sdu-table-tr" @row-dblclick="rowDblclick">
        <el-table-column prop="id" label="序号" align=center show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="faultTime" label="故障时间" align=center show-overflow-tooltip :formatter="setTime">
        </el-table-column>
        <el-table-column prop="mainstationName" label="区域" align=center show-overflow-tooltip :formatter='set'>
        </el-table-column>
        <el-table-column prop="stationName" label="变电站" align=center show-overflow-tooltip :formatter='set'>
        </el-table-column>
        <el-table-column prop="recorderName" label="录波器" align=center show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="phase" label="故障相别" align=center show-overflow-tooltip width="80">
        </el-table-column>
        <el-table-column prop="location" label="故障测距" align=center show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="maxI" label="最大电流" align=center show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="minU" label="最低电压" align=center show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>


<script>
  export default {
    props: ["tableData"],
    data() {
      return {

      }
    },
    methods: {
      setTime(row, column, cellValue) {
        return cellValue.year + '-' + this.t(cellValue.month) + '-' + this.t(cellValue.day) + ' ' +
          this.t(cellValue.hour) + ":" + this.t(cellValue.minute) + ":" + this.t(cellValue.second) + ":" +
          this.t(cellValue.msecond);
      },
      t(sfm) {
        return sfm < 10 ? '0' + sfm : sfm;
      },
      set(row, column, cellValue) {
        if (Object.keys(cellValue).length == 0) {
          return ' ';
        } else {
          return cellValue;
        }
      },
      rowDblclick(row) {
        this.$emit('setId', row.id);
      }
    },
    watch: {

    },
    mounted() {

    }
  }

</script>

<style scoped>
  div {
    color: #000;
  }

</style>
