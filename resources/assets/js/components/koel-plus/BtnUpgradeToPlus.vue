<template>
</template>

<script lang="ts" setup>
import { eventBus } from '@/utils/eventBus'

const openModal = () => eventBus.emit('MODAL_SHOW_KOEL_PLUS')
</script>
