<template>
  <el-button type="primary">主要按钮</el-button>
</template>
<script>
import ElButton from "element-ui/lib/button";

export default {
  components: {
    ElButton,
  },
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
      ],
      value: "",
    };
  },
};
</script>
