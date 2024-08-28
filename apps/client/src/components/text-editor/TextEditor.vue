<template>
  <q-editor
    flat
    @keyup="editorKeyup"
    ref="editorRef"
    v-model="model"
    content-class="q-pa-md"
    color="accent"
    :toolbar="[]"
    :disable="disable"
    placeholder="Add a reply..."
    min-height="5rem"
  />
  <q-separator v-if="files.length" />
  <div v-if="files.length" class="row q-gutter-xs q-pa-sm">
    <transition-group
      appear
      enter-active-class="animated bounce"
      leave-active-class="animated collapse-in"
    >
      <q-item
        v-for="(file, i) of selectedFiles"
        :key="file.key"
        dense
        class="q-px-xs q-py-xs rounded-md q-card--bordered border-app-2"
        :style="{
          'border-color':
            file.typeIsValid && file.sizeIsValid
              ? undefined
              : getPaletteColor('red-3'),
        }"
        :class="{
          'bg-app-1 text-app': file.typeIsValid && file.sizeIsValid,
          'bg-red-2 text-negative': !file.typeIsValid || !file.sizeIsValid,
        }"
      >
        <q-item-section avatar class="q-pr-none" style="min-width: 28px">
          <q-icon
            size="22px"
            name="sym_o_attach_file"
            :color="file.typeIsValid && file.sizeIsValid ? 'app' : 'negative'"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium text-body1">
            {{ file.file.name }}
            {{ !file.typeIsValid ? invalidFileTypeError : '' }}
          </q-item-label>
          <q-item-label
            caption
            :class="{ 'text-red-7': !file.typeIsValid || !file.sizeIsValid }"
          >
            {{ file.size }} {{ !file.sizeIsValid ? invalidSizeError : '' }}
          </q-item-label>
        </q-item-section>
        <q-item-section side class="q-pl-none">
          <q-btn
            flat
            dense
            size="sm"
            icon="sym_o_close"
            class="not-rounded"
            :color="file.sizeIsValid && file.typeIsValid ? 'app-5' : 'negative'"
            @click="removeFile(i)"
          />
        </q-item-section>
      </q-item>
    </transition-group>
  </div>
  <q-separator />
  <div class="row items-center q-px-sm q-py-xs">
    <q-btn
      flat
      dense
      size="sm"
      class="icon-2"
      color="app"
      icon="sym_o_undo"
      :disable="disable"
      @click="editorRef?.runCmd('undo')"
    >
      <q-tooltip>Undo</q-tooltip>
    </q-btn>
    <q-btn
      flat
      dense
      size="sm"
      class="icon-2"
      color="app"
      icon="sym_o_redo"
      :disable="disable"
      @click="editorRef?.runCmd('redo')"
    >
      <q-tooltip>Redo</q-tooltip>
    </q-btn>
    <q-separator spaced vertical />
    <q-btn
      flat
      dense
      size="sm"
      class="icon-2"
      color="app"
      icon="sym_o_format_bold"
      :disable="disable"
      @click="editorRef?.runCmd('bold')"
    >
      <q-tooltip>Bold</q-tooltip>
    </q-btn>
    <q-btn
      flat
      dense
      size="sm"
      class="icon-2"
      color="app"
      icon="sym_o_format_italic"
      :disable="disable"
      @click="editorRef?.runCmd('italic')"
    >
      <q-tooltip>Italic</q-tooltip>
    </q-btn>
    <q-btn
      flat
      dense
      size="sm"
      class="icon-2"
      color="app"
      icon="sym_o_format_underlined"
      :disable="disable"
      @click="editorRef?.runCmd('underline')"
    >
      <q-tooltip>Underline</q-tooltip>
    </q-btn>
    <q-btn
      flat
      dense
      size="sm"
      class="icon-2"
      color="app"
      icon="sym_o_format_clear"
      :disable="disable"
      @click="editorRef?.runCmd('removeFormat')"
    >
      <q-tooltip>Clear Formatting</q-tooltip>
    </q-btn>
    <q-separator spaced vertical />
    <q-btn
      flat
      dense
      size="sm"
      class="icon-2"
      color="app"
      icon="sym_o_attach_file_add"
      :disable="disable"
      @click="fileRef?.click()"
    >
      <q-tooltip>Attach File</q-tooltip>
    </q-btn>
    <span
      class="q-ml-sm q-pa-xs border border-app-3 bg-app-1 text-app rounded-md text-sm row items-center"
    >
      <q-icon name="sym_o_info" size="xs" class="q-mr-xs" />Type '@' to mention
      a person.
    </span>
    <q-space />
    <slot name="toolbar-end" />
    <q-btn
      @click="$emit('send')"
      unelevated
      dense
      color="app-1"
      text-color="app"
      :disable="disable"
      icon="sym_o_send"
    >
      <q-tooltip>Send</q-tooltip>
    </q-btn>
    <q-menu
      @show="mentionSelectRef?.showPopup()"
      :target="mentionTarget"
      :offset="mentionOffset"
      ref="mentionRef"
      class="mention-popup"
      anchor="top left"
      no-parent-event
    >
      <q-select
        :model-value="null"
        @update:model-value="addMention"
        @popup-hide="mentionRef?.hide()"
        @filter="mentionFilterFn"
        @keydown="selectKeydown"
        :options="filteredUsers"
        :input-debounce="50"
        option-label="name"
        option-value="id"
        ref="mentionSelectRef"
        input-class="q-mx-sm"
        hide-dropdown-icon
        options-dense
        borderless
        autofocus
        use-input
        dense
      >
        <template #option="{ itemProps, selected, opt }">
          <q-item v-bind="itemProps" :class="{ 'bg-app-1 text-app': selected }">
            <q-item-section avatar class="avatar-near">
              <q-avatar
                size="sm"
                text-color="white"
                :color="selected ? 'app-5' : 'app-9'"
                >{{ opt.username[0].toUpperCase() }}</q-avatar
              >
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <highlight-text :text="opt.name" :highlight="userSearch" />
              </q-item-label>
              <q-item-label caption>
                <highlight-text :text="opt.username" :highlight="userSearch" />
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-menu>
    <input
      ref="fileRef"
      type="file"
      multiple
      class="hidden"
      @change="onFileSelect"
    />
    <q-tooltip
      v-if="tooltipUser"
      ref="tooltipRef"
      :target="tooltipTarget"
      no-parent-event
    >
      {{ `${tooltipUser.name} <${tooltipUser.username}>` }}
    </q-tooltip>
  </div>
</template>

<script setup lang="ts">
import { QEditor, QSelect, colors, QTooltip } from 'quasar'
import { useMention } from './use-mention'
import { useAttachment } from './use-attachment'
import HighlightText from 'components/HighlightText.vue'
const { getPaletteColor } = colors

defineEmits<{
  (e: 'send'): void
}>()

const model = defineModel({
  type: String,
  default: '',
})
const files = defineModel('files', {
  type: Array<File>,
  default: [],
})

defineProps<{
  disable?: boolean
}>()

const {
  fileRef,
  selectedFiles,
  invalidSizeError,
  invalidFileTypeError,
  onFileSelect,
  removeFile,
} = useAttachment(files)
const {
  editorRef,
  editorKeyup,

  tooltipRef,
  tooltipUser,
  tooltipTarget,

  mentionRef,
  mentionTarget,
  mentionOffset,

  mentionSelectRef,
  filteredUsers,
  userSearch,
  addMention,
  selectKeydown,
  mentionFilterFn,
} = useMention()
</script>

<style lang="scss">
.mention-popup {
  .q-field--auto-height.q-field--dense .q-field__control,
  .q-field--auto-height.q-field--dense .q-field__native {
    padding: 0;
    min-height: 28px;
  }
}

/* mention chip in ticket comment */
.m {
  border-radius: 8px;
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  padding: 0 4px;
  margin-bottom: 2px;
  color: $blue-8;
  background-color: $blue-1;

  .m-remover {
    cursor: pointer;
  }
}
</style>
