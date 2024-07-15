<template>
  <VueCropper
    ref="cropperRefs"
    :canScale="true"
    auto-crop
    center-box
    :autoCropWidth="width"
    :autoCropHeight="height"
    :outputSize="0.6"
    :style="{
      width: width + 'px',
      height: height + 'px',
    }"
    :img="img"
    :imgMove="true"
    @img-load="imgLoaded"
    @real-time="onchange"
  ></VueCropper>
</template>
<script setup lang="ts">
import VueCropper from "./Cropper.vue";
import { ref, defineEmits } from "vue";
import img from "./img";

import debounce from "lodash/debounce";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  width: { type: Number },
  height: { type: Number },
  img: {
    default: img, // 'https://avatars2.githubusercontent.com/u/15681693?s=460&v=4'
  },
});

const cropperRefs = ref();
const id = Math.random();
function imgLoaded() {
  cropperRefs.value.getCropData((r) => {
    console.info("获取base64",id);
    emit("update:modelValue", r);
  });
  console.info(props);
}

const getCropperImgBase64=debounce(imgLoaded,500)
 

function onchange() {
  getCropperImgBase64()
}

defineExpose();
</script>
