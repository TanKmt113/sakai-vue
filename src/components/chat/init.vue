<template>
  <div :class="{ 'fixed bg-slate-300 w-full h-full top-0': visible }">
    <Dialog v-model:visible="visible" modal :style="{ width: '25rem' }">
      <div class="flex flex-col items-center gap-3">
        <img
          src="https://fox.ai.vn/wp-content/uploads/2024/07/Logo_Original-1.png"
          alt=""
          width="150"
        />
        <span class="text-center font-medium">Hãy nhập tên của bạn</span>
        <InputText class="w-full" v-model="name"></InputText>
        <InputText class="w-full" v-model="phone" placeholder="Số điện thoại"></InputText>
        <div class="text-center">
          <Button
            type="button"
            label="Bắt đầu"
            @click="saveToLocalStorage(name, phone)"
          ></Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";

const visible = ref(true);
const name = ref(null);
const phone = ref(null);

const emits = defineEmits(["upload"]);

onBeforeMount(() => {
  const user = JSON.parse(localStorage.getItem("user")) || null;
  if (user) {
    visible.value = false;
  }
});

function saveToLocalStorage(name, phone) {
  if (!name || !phone) return false;
  const contact = { name, phone };
  localStorage.setItem("user", JSON.stringify(contact));
  emits("upload", name);
  visible.value = false;
  return true;
}
</script>
<style scoped>
::deep(.p-dialog-header-actions) {
  display: none !important;
}
</style>
