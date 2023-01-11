<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="text-left">Libri</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <div>{{ barcode }}</div>
      <div v-if="barcode">{{ isbn ? 'Valid ISBN' : 'Invalid ISBN' }}</div>

      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" color="accent" @click="startScan" />
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

const leftDrawerOpen = ref(false);
const barcode = ref<string>();
const isbn = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const isISBN = (value?: string) => {
  if (!value) return false;

  const last = value.slice(-1).toUpperCase();

  if (value.length === 10) {
    const sum = [...value]
      .slice(0, -1)
      .reduce((acc, l, i) => acc + +l * (10 - i), 0);
    const check = (11 - (sum % 11)) % 11;
    if (check === 10) return 'X' === last;
    return check === +last;
  }

  if (value.length === 13) {
    if (value.slice(0, 3) !== '978') return false;
    const sum = [...value]
      .slice(0, -1)
      .reduce((acc, l, i) => acc + (i % 2 ? 3 : 1) * +l, 0);
    const check = (10 - (sum % 10)) % 10;
    console.log(sum, check, last);
    return check === +last;
  }

  return false;
};

const startScan = async () => {
  await BarcodeScanner.checkPermission({ force: true });
  BarcodeScanner.hideBackground();

  const result = await BarcodeScanner.startScan();
  if (!result.hasContent) return;

  barcode.value = result.content;
  isbn.value = isISBN(result.content);
};
</script>
