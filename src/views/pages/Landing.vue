<script setup lang="ts">
import init from "@/components/chat/init.vue";
import { ref } from "vue";

const name = ref();
const setName = (event) => {
  name.value = event;
};
</script>

<template>
  <div class="">
    <div class="hidden">
      <div class="px-10 flex py-5 shadow-md fixed w-full bg-slate-100">
        <TopbarWidget />
      </div>
    </div>

    <div style="height: 20px"></div>
    <div id="home" class="landing-wrapper overflow-hidden">
      <div
        class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static"
      ></div>
    </div>
    <div class="mt-10">
      <chatBot :name="name"></chatBot>
    </div>
    <init @upload="setName($event)"></init>
  </div>
</template>
