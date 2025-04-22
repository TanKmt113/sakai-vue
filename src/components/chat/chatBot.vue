<template>
  <div>
    <div class="container mx-auto" id="content">
      <div class="flex flex-col gap-3">
        <div class="w-full px-5" style="margin-bottom: 226px">
          <div
            class="mb-5 flex flex-col"
            :class="{ 'items-end': item.role === 'user' }"
            v-for="item in messages"
            :key="item"
          >
            <div
              v-html="item.content"
              class="font-normal text-xl"
              :class="{ 'bg-slate-200 p-3 rounded-3xl w-fit': item.role === 'user' }"
            ></div>
            <div class="mt-3">
              <i
                class="pi pi-clone cursor-pointer"
                @click="copyToClipboard(htmlToText(item.content))"
                v-tooltip.bottom="'Copy'"
              ></i>
            </div>
          </div>
          <ProgressSpinner
            v-if="loading"
            style="width: 20px; height: 20px"
            strokeWidth="8"
            fill="transparent"
            animationDuration="1s"
            aria-label="Custom ProgressSpinner"
          />
          <Message severity="error" class="w-fit" v-if="Error">{{ Error }}</Message>
        </div>
      </div>
    </div>
    <div class="w-full fixed bottom-0" style="background-color: #f1f5f9">
      <div class="container mx-auto">
        <h4 class="text-center" v-if="!messages.length">What can I help with?</h4>
        <div class="px-2 py-5 rounded-3xl shadow-lg bg-white mb-4 hidden lg:block">
          <div class="flex flex-col gap-2">
            <div>
              <Textarea
                placeholder="Ask anything"
                class="w-full bg-transparent outline-none border-none"
                :autoResize="true"
                rows="1"
                style="resize: none"
                v-model="message"
                @keyup.enter="submitChat"
              />
            </div>
            <div class="flex justify-between px-3 py-1">
              <div class="cursor-pointer" @click="submitChat">
                <img src="/demo/images/access/folder.png" alt="" width="30" />
              </div>

              <div class="flex gap-5">
                <!-- <div class="cursor-pointer" v-if="!loading" @click="submitChat">
                  <img src="/demo/images/access/paper-plane.png" alt="" width="30" />
                </div> -->
                <div class="cursor-pointer" v-if="loading" @click="submitChat(true)">
                  <img src="/demo/images/access/stop-button.png" alt="" width="30" />
                </div>
                <div class="cursor-pointer" @click="clearData" v-if="messages.length">
                  <img src="/demo/images/access/broom.png" alt="" width="30" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex justify-between items-center p-2 px-3 shadow-lg bg-white lg:hidden"
        >
          <div class="cursor-pointer" @click="submitChat">
            <img src="/demo/images/access/folder.png" alt="" width="30" />
          </div>
          <div class="w-full">
            <InputText
              @keyup.enter="submitChat"
              class="w-full"
              placeholder="Ask anything"
              v-model="message"
            ></InputText>
          </div>
          <div class="flex gap-1">
            <div class="cursor-pointer" v-if="!loading" @click="submitChat">
              <img src="/demo/images/access/paper-plane.png" alt="" width="30" />
            </div>
            <div class="cursor-pointer" v-if="loading" @click="submitChat(true)">
              <img src="/demo/images/access/stop-button.png" alt="" width="30" />
            </div>
            <!-- <div class="cursor-pointer" @click="clearData" v-if="messages.length">
              <img src="/demo/images/access/broom.png" alt="" width="30" />
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import http from "@/config/http";
import { ref, watchEffect } from "vue";

const Error = ref();
const messages = ref([]);
const message = ref();
const loading = ref(false);
const props = defineProps(["name"]);
const name = ref("");
watchEffect(() => {
  if (props.name) {
    name.value = props.name;
    if (!messages.value.length) {
      messages.value = [
        {
          role: "user",
          content: "Bắt đầu",
        },
        {
          role: "assistant",
          content: `Xin chào Quý khách ${name.value}, Foxai hy vọng Quý khách có trải nghiệm thật tuyệt.`,
        },
      ];
    }
  }
});

const submitChat = async (isCancel = false) => {
  // if (isCancel) controller.abort();
  if (!message.value.trim()) return;
  const controller = new AbortController();
  const signal = controller.signal;
  messages.value.push({
    role: "user",
    content: message.value,
  });
  message.value = "";
  scrollToBottom();
  try {
    loading.value = true;
    const response = await http.post(
      "chat",
      {
        query: messages.value[messages.value.length - 1]?.content || "",
      }
      // { signal }
    );
    if (response.status === 200) {
      loading.value = false;
      messages.value.push({
        role: "assistant",
        content: "",
      });

      // const content = marked(response.data.html);
      const content = response.data.html;

      for (let i = 0; i < content.length; i++) {
        setTimeout(() => {
          messages.value[messages.value.length - 1].content += content[i];
          scrollToBottom();
        }, 20 * i);
      }
    }
  } catch (error) {
    Error.value = error;
    loading.value = false;
  }
};

const clearData = () => {
  messages.value = [];
  Error.value = null;
};

function scrollToBottom() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
}
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Đã copy thành công: " + text);
        alert("Đã copy vào clipboard!");
      })
      .catch((err) => {
        console.error("Lỗi khi copy: ", err);
        alert("Copy thất bại!");
      });
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      console.log("Đã copy thành công: " + text);
      alert("Đã copy vào clipboard!");
    } catch (err) {
      console.error("Lỗi khi copy: ", err);
      alert("Copy thất bại!");
    }
    document.body.removeChild(textarea);
  }
}

function htmlToText(html) {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = html;

  return tempElement.textContent || tempElement.innerText || "";
}
</script>
<style scoped>
:deep(.p-textarea) {
  border: none;
  background-color: transparent;
  box-shadow: none;
  font-size: 1.5rem;
}
:deep(.p-inputtext) {
  border: none;
  background-color: transparent;
  box-shadow: none;
  font-size: 1.5rem;
}
</style>
