<script setup>
function smoothScroll(id) {
  document.body.click();
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}
</script>

<template>
  <a class="flex items-center" href="#">
    <img
      src="https://fox.ai.vn/wp-content/uploads/2024/07/Logo_Original-1.png"
      alt=""
      srcset=""
      width="100"
    />
  </a>
  <Button
    class="lg:!hidden"
    text
    severity="secondary"
    rounded
    v-styleclass="{
      selector: '@next',
      enterFromClass: 'hidden',
      enterActiveClass: 'animate-scalein',
      leaveToClass: 'hidden',
      leaveActiveClass: 'animate-fadeout',
      hideOnOutsideClick: true,
    }"
  >
    <i class="pi pi-bars !text-2xl"></i>
  </Button>
  <div
    class="items-center grow justify-end hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border"
  >
    <div
      class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2"
    >
      <Button label="Đăng nhập" text as="router-link" to="/auth/login" rounded></Button>
      <Button label="Đăng ký" to="/auth/login" rounded></Button>
    </div>
  </div>
</template>
