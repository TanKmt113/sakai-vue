<script setup>
import http from "@/config/http";
import { onBeforeMount, ref } from "vue";

const visible = ref(false);
const dataChromaDB = ref({});
const uploadData = ref({});
const Collection = ref([]);

onBeforeMount(async () => {
  await getAllCollections();
  await getCollection();
});

const getCollection = async () => {
  const response = await http.get("chroma-db/collection/get-all");
  if (!response) {
    alert("Không thể lấy được dữ liệu");
    return;
  }
  dataChromaDB.value = response.data.metadata;
};

const updateDoc = (index) => {
  uploadData.value = dataChromaDB.value?.metadatas[index];
  uploadData.value.id = dataChromaDB.value?.ids[index];
  visible.value = true;
};

const SaveDoc = async () => {
  const response = await http.put("chroma-db", uploadData.value);
  if (response.status === 200) {
    alert("Cập nhật thành công");
    uploadData.value = {};
    visible.value = false;
  } else {
    alert("Cập nhật thất bại");
  }
};

const getAllCollections = async () => {
  const response = await http.get("chroma-db/collections/get-all");
  if (response.data) {
    Collection.value = response.data.metadata.collections;
  }
};
</script>
<template>
  <div class="flex flex-col gap-3">
    <div>
      <h4>Danh sách tài liệu</h4>
      <hr class="m-0" />
    </div>
    <div class="card">
      <DataTable
        :value="dataChromaDB?.ids"
        tableStyle="min-width: 50rem"
        showGridlines
        paginator
        :rows="dataChromaDB.value?.limit || 5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
      >
        <template #header>
          <div class="flex justify-between">
            <Select placeholder="Chọn collection " :options="Collection"></Select>
            <InputText placeholder="Tìm kiếm tài liệu"></InputText>
          </div>
        </template>
        <Column header="id">
          <template #body="{ index, data }">
            {{ data }}
          </template>
        </Column>
        <Column header="Câu hỏi">
          <template #body="{ index, data }">
            {{ dataChromaDB?.metadatas[index]?.question }}
          </template>
        </Column>
        <Column header="Câu trả lời">
          <template #body="{ index, data }">
            {{ dataChromaDB?.metadatas[index]?.answer }}
          </template>
        </Column>
        <Column header="Hành động">
          <template #body="{ index }">
            <div class="flex gap-2 items-center">
              <Button icon="pi pi-pencil" size="small" @click="updateDoc(index)"></Button>
              <Button icon="pi pi-trash" size="small" severity="danger"></Button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
  <Dialog
    v-model:visible="visible"
    modal
    header="Chỉnh sửa tài liệu"
    :style="{ width: '75rem' }"
  >
    <div class="card">
      <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-2">
          <label for="">Câu hỏi</label>
          <Textarea v-model="uploadData.question" auto-resize></Textarea>
        </div>
        <div class="flex flex-col gap-2">
          <label for="">Câu trả lời</label>
          <Textarea v-model="uploadData.answer" auto-resize></Textarea>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Bỏ qua"
          severity="secondary"
          @click="visible = false"
        ></Button>
        <Button type="button" label="Lưu" @click="SaveDoc"></Button>
      </div>
    </template>
  </Dialog>
</template>
