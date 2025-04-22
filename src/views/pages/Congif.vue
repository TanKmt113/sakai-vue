<script setup>
import { ref, onBeforeMount } from "vue";
import http from "@/config/http";

const tabs = ref([{ title: "Giao diện", content: "Tab 1 Content", value: "0" }]);

const themeSettings = ref({
  header: {
    enable: true,
    logo: {
      enabled: true,
      link: "https://fox.ai.vn/wp-content/uploads/2024/07/Logo_Original-1.png",
    },
    background: {
      type: "solid",
      color: "eb40eb",
    },
    textColor: "fff",
    textHeader: "FOXAI",
  },

  body: {
    primary: {
      background: "D501FD",
      text: "ffffff",
    },
    secondary: {
      background: "a35d5d",
      text: "a35d5d",
    },
    button: {
      background: "a35d5d",
      text: "a35d5d",
    },
  },
});

onBeforeMount(() => {
  getCongif();
});

const getCongif = () => {
  http
    .get("config")
    .then((res) => {
      themeSettings.value = JSON.parse(res.data.metadata.config);
    })
    .catch((err) => {
      console.log(err);
    });
};

const Save = () => {
  http
    .post("config", { config: JSON.stringify(themeSettings.value) })
    .then((res) => {
      alert("Cập nhật thành công");
      themeSettings.value = JSON.parse(res.data.metadata.config);
    })
    .catch((err) => {
      console.log(err);
    });
};

const exportJS = () => {
  const jsContent = `
    let liveChatBaseUrl   = document.location.protocol + '//' + 'livechat.fox.ai/v36/src'
    let LiveChatSocketUrl = 'livechat.fox.ai:443'
    let FoxaiAppCode        = ''
    let FoxaiAppName        = 'FOXAI'
    // Define custom styles
    let CustomStyles = {
        // header
        headerBackground: '#${themeSettings.value.header.background.color}',
        headerTextColor: '#${themeSettings.value.header.textColor}',
        headerLogoEnable: ${themeSettings.value.header.logo.enabled},
        headerLogoLink: '${themeSettings.value.header.logo.link}',
        headerText: '${themeSettings.value.header.textHeader}',
        // main
        primaryColor: '#${themeSettings.value.body.primary.background}',
        secondaryColor: '#D8D8D8FF',
        primaryTextColor: '#${themeSettings.value.body.primary.text}',
        secondaryTextColor: '#1F1F1FFF',
        buttonColor: '#0C5488',
        buttonTextColor: '#ffffffff',
        bodyBackgroundEnable: true,
        bodyBackgroundLink: 'https://chatbot-tools.FOXAI.ai/livechat-builder/img/theme/bank/body.png',
        avatarBot: 'https://chatbot-tools.fox.ai/livechat-builder/img/theme/bank/bot.svg',
        sendMessagePlaceholder: 'Enter your message here',
        // float button
        floatButtonLogo: '${themeSettings.value.header.logo.link}',
        floatButtonTooltip: 'Trợ lý FOXAI có thể giúp gì cho bạn?',
        floatButtonTooltipEnable: true,
        // start screen
        customerLogo: 'https://chatbot-tools.fox.ai/livechat-builder/img/theme/bank/logo.svg',
        customerWelcomeText: 'Please input your name',
        customerButtonText: 'Start',
        prefixEnable: false,
        prefixType: 'radio',
        prefixOptions: ["Anh","Chị"],
        prefixPlaceholder: 'Danh xưng',
        // custom css
        css: ''
    }
    // Get bot code from url if FoxaiAppCode is empty
    if (!FoxaiAppCode) {
        let appCodeFromHash = window.location.hash.substr(1)
        if (appCodeFromHash.length === 32) {
            FoxaiAppCode = appCodeFromHash
        }
    }
    // Set Configs
    let FoxaiLiveChatConfigs = {
        appName: FoxaiAppName,
        appCode: FoxaiAppCode,
        themes : '',
        styles : CustomStyles
    }
    // Append Script
    let FoxaiLiveChatScript  = document.createElement('script')
    FoxaiLiveChatScript.id   = 'fox_ai_livechat_script'
    FoxaiLiveChatScript.src  = 'http://ai.foxai.com.vn:8888/foxai-livechat.js'
    document.body.appendChild(FoxaiLiveChatScript)
    // Append Stylesheet
    let FoxaiLiveChatStyles  = document.createElement('link')
    FoxaiLiveChatStyles.id   = 'fox_ai_livechat_script'
    FoxaiLiveChatStyles.rel  = 'stylesheet'
    FoxaiLiveChatStyles.href ='http://ai.foxai.com.vn:8888/foxai-livechat.css'
    document.body.appendChild(FoxaiLiveChatStyles)
    // Init
    FoxaiLiveChatScript.onload = function () {
        fox_ai_render_chatbox(FoxaiLiveChatConfigs, liveChatBaseUrl, LiveChatSocketUrl)
    }
  `.trim();

  const blob = new Blob([jsContent], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "foxai-livechat-config.js";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
</script>
<template>
  <div class="card">
    <Tabs value="0">
      <TabList>
        <Tab v-for="tab in tabs" :key="tab.title" :value="tab.value">{{ tab.title }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-for="tab in tabs" :key="tab.content" :value="tab.value">
          <div class="grid grid-cols-12">
            <div class="col-span-6">
              <Card>
                <template #content>
                  <div>
                    <div class="flex flex-col gap-4">
                      <div class="flex justify-between items-center">
                        <div class="flex flex-col">
                          <strong>Header</strong> <span>Customize Header</span>
                        </div>
                        <div>
                          <Button icon="pi pi-question-circle" text></Button>
                        </div>
                      </div>
                      <div class="flex flex-col gap-5">
                        <div class="flex gap-10">
                          <span>Logo:</span>
                          <div class="flex flex-col gap-3 w-full">
                            <ToggleSwitch
                              v-model="themeSettings.header.logo.enabled"
                              binary
                            />
                            <InputText
                              placeholder="Link logo"
                              v-model="themeSettings.header.logo.link"
                              class="w-full"
                            ></InputText>
                          </div>
                        </div>
                        <div class="flex gap-10">
                          <span>Background:</span>
                          <div class="flex flex-col gap-3 w-full">
                            <div class="flex items-center gap-2">
                              <ColorPicker
                                v-model="themeSettings.header.background.color"
                                class="border-2"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="flex gap-10">
                          <span>Text color:</span>
                          <ColorPicker
                            v-model="themeSettings.header.textColor"
                            class="border-2"
                          />
                        </div>
                        <div class="flex gap-10">
                          <span>Text header:</span>
                          <InputText
                            class="w-full"
                            v-model="themeSettings.header.textHeader"
                          ></InputText>
                        </div>
                      </div>
                      <div class="flex justify-between items-center mt-3">
                        <div class="flex flex-col">
                          <strong>Body </strong>
                          <span>Customize color of all major components</span>
                        </div>
                        <div>
                          <Button icon="pi pi-question-circle" text></Button>
                        </div>
                      </div>
                      <div class="flex flex-col gap-5">
                        <div class="flex gap-10">
                          <div class="flex gap-3 w-full">
                            <div class="flex flex-col gap-3">
                              <span style="margin-left: 120px">Background</span>
                              <div class="flex gap-20">
                                <span style="width: 70px">Primary</span>
                                <ColorPicker
                                  v-model="themeSettings.body.primary.background"
                                  class="border-2"
                                />
                              </div>
                              <!-- <div class="flex gap-20">
                                <span style="width: 70px">Secondary</span>
                                <ColorPicker
                                  v-model="themeSettings.body.secondary.background"
                                  class="border-2"
                                />
                              </div> -->
                              <!-- <div class="flex gap-20">
                                <span style="width: 70px">Button</span>
                                <ColorPicker
                                  v-model="themeSettings.body.button.background"
                                  class="border-2"
                                />
                              </div> -->
                            </div>
                            <div class="flex flex-col gap-3">
                              <span>Text</span>
                              <ColorPicker
                                v-model="themeSettings.body.primary.text"
                                class="border-2"
                              />
                              <!-- <ColorPicker
                                v-model="themeSettings.body.secondary.text"
                                class="border-2"
                              />
                              <ColorPicker
                                v-model="themeSettings.body.button.text"
                                class="border-2"
                              /> -->
                            </div>
                          </div>
                        </div>
                        <div class="flex gap-3">
                          <span>API chatbot:</span>
                          <InputText
                            class="w-full"
                            placeholder="Nhập api của bạn"
                            v-model="themeSettings.api"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-5 flex justify-end gap-3">
                    <Button label="Hủy" icon="pi pi-times" severity="secondary"></Button>
                    <Button label="Lưu" icon="pi pi-save" @click="Save()"></Button>
                    <Button
                      label="Xuất JS"
                      icon="pi pi-file-export"
                      severity="info"
                      @click="exportJS()"
                    ></Button>
                  </div>
                </template>
              </Card>
            </div>
            <div class="col-span-6 px-5 mx-auto">
              <div style="width: 400px">
                <div
                  class="flex justify-between items-center px-3 py-2 bg-teal-700"
                  :style="`background-color:#${themeSettings.header.background.color}`"
                >
                  <div class="flex gap-3 items-center">
                    <img
                      v-if="themeSettings.header.logo.enabled"
                      :src="themeSettings.header.logo.link"
                      alt=""
                      width="50"
                    />
                    <span
                      class="text-xl font-sans"
                      :style="`color:#${themeSettings.header.textColor}`"
                      >{{ themeSettings.header.textHeader }}</span
                    >
                  </div>
                  <div>
                    <i
                      class="pi pi-arrow-up-right-and-arrow-down-left-from-center text-white p-2"
                    ></i>
                    <i class="pi pi-times text-white p-2"></i>
                  </div>
                </div>
                <div class="relative" style="height: 500px; border: 1px solid #ccc">
                  <div class="p-4">
                    <div class="mb-5 flex flex-col">
                      <div class="flex items-center">
                        <Avatar
                          v-if="themeSettings.header.logo.enabled"
                          :image="themeSettings.header.logo.link"
                          class="mr-2"
                          size="large"
                          shape="circle"
                        />
                        <Avatar
                          icon="pi pi-user"
                          class="mr-2"
                          size="large"
                          style="background-color: #ece9fc; color: #2a1261"
                          shape="circle"
                          v-else
                        />

                        <div
                          class="p-3 rounded-lg text-white"
                          :style="`background-color:#${themeSettings.body.primary.background};color:#${themeSettings.body.primary.text}`"
                        >
                          <p>Foxai xin chào bạn Đông Phương.</p>
                        </div>
                      </div>
                    </div>
                    <div class="mb-5 flex flex-col items-end">
                      <div class="flex">
                        <div
                          class="p-3 rounded-lg"
                          :style="`background-color:#${themeSettings.body.primary.background};color:#${themeSettings.body.primary.text}`"
                        >
                          <p>Foxai có những dịch vụ gì nữa.</p>
                        </div>
                        <Avatar
                          icon="pi pi-user"
                          class="ml-2"
                          size="large"
                          style="background-color: #ece9fc; color: #2a1261"
                          shape="circle"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="w-full absolute bottom-0 border-t-2 border-t-slate-200">
                    <div class="w-full flex items-center gap-3 p-2">
                      <i
                        class="pi pi-bars"
                        :style="`color:#${themeSettings.body.primary.background}`"
                        style="font-size: 20px"
                      ></i>
                      <i
                        class="pi pi-file"
                        :style="`color:#${themeSettings.body.primary.background}`"
                        style="font-size: 20px"
                      ></i>
                      <InputText
                        placeholder="Enter your message here"
                        class="w-full custome-input"
                      ></InputText>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style scoped>
:deep(.p-textarea) {
  border: none;
  background-color: transparent;
  box-shadow: none;
  font-size: 1.2rem;
}
:deep(.custome-input.p-inputtext) {
  border: none;
  background-color: transparent;
  box-shadow: none;
  font-size: 1.2rem;
}
</style>
