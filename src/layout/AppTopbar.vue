<script setup>
import { useLayout } from "@/layout/composables/layout";
import AppConfigurator from "./AppConfigurator.vue";

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
</script>

<template>
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <router-link to="/" class="layout-topbar-logo">
        <img
          src="https://fox.ai.vn/wp-content/uploads/2024/07/Logo_Original-1.png"
          alt=""
          width="80"
          srcset=""
        />
      </router-link>
    </div>
    <div class="layout-topbar-actions">
      <div class="layout-topbar-menu hidden lg:block">
        <div class="layout-topbar-menu-content">
          <button type="button" class="layout-topbar-action">
            <i class="pi pi-user"></i>
            <span>Profile</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
