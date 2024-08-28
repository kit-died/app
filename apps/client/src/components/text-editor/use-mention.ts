import {
  QEditor,
  QMenuProps,
  QPopupProxy,
  QSelect,
  QSelectProps,
  QTooltip,
} from 'quasar'
import { usersList } from 'src/mock/index'
import { User } from 'src/models/user'
import { ref } from 'vue'

export function useMention() {
  const filteredUsers = ref<User[]>([])

  const tooltipRef = ref<InstanceType<typeof QTooltip>>()
  const tooltipTarget = ref<HTMLElement>()
  const tooltipUser = ref<User>()

  const editorRef = ref<InstanceType<typeof QEditor>>()
  const mentionRef = ref<InstanceType<typeof QPopupProxy>>()
  const mentionSelectRef = ref<InstanceType<typeof QSelect>>()
  const mentionTarget = ref<QMenuProps['target']>()
  const mentionOffset = ref<number[]>()
  const userSearch = ref<string>('')
  const selection = ref<Selection | null>()
  const lastRange = ref<Range>()

  function mentionChip(user: User) {
    const chip = document.createElement('span')

    const text = document.createElement('span')
    text.textContent = `@${user.name}`

    const icon = document.createElement('i')
    icon.setAttribute('class', 'm-remover material-symbols-outlined')
    icon.textContent = 'close'
    icon.addEventListener('click', () => {
      tooltipRef.value?.hide()
      chip.remove()
    })

    chip.addEventListener('mouseover', (event) => {
      tooltipTarget.value = chip
      tooltipUser.value = user
      tooltipRef.value?.show(event)
    })
    chip.addEventListener('mouseout', () => tooltipRef.value?.hide())
    chip.setAttribute('class', 'm')
    chip.setAttribute('data-id', user.id.toString())
    chip.setAttribute('contenteditable', 'false')
    chip.appendChild(text)
    chip.appendChild(icon)
    return chip
  }

  async function addMention(user: User) {
    if (!editorRef.value || !user) return

    if (lastRange.value) {
      // Remove the '@' character
      lastRange.value.setStart(
        lastRange.value.startContainer,
        lastRange.value.startOffset - 1,
      )
      lastRange.value.deleteContents()
      lastRange.value.collapse()
    }

    const html = mentionChip(user)
    mentionRef.value?.hide()
    editorRef.value.focus()
    if (
      selection.value?.getRangeAt &&
      selection.value.rangeCount &&
      lastRange.value
    ) {
      lastRange.value.insertNode(html)
      lastRange.value = lastRange.value.cloneRange()
      lastRange.value.setStartAfter(html)
      lastRange.value.collapse(true)
      selection.value.removeAllRanges()
      selection.value.addRange(lastRange.value)
      setTimeout(() => {
        // workaround to trigger the model value bind after manually inserting the mention
        editorRef.value?.runCmd('insertText', ' ')
        editorRef.value?.runCmd('undo')
      }, 50)
    }
    mentionSelectRef.value?.updateInputValue('')
  }

  function editorKeyup(event: KeyboardEvent) {
    if (['@', '#'].includes(event.key)) {
      const caret = getCaretPosition()
      const rect = (editorRef.value?.$el as HTMLElement).getBoundingClientRect()
      if (!caret || !rect) return

      if (event.key === '@') {
        mentionTarget.value = editorRef.value?.$el as HTMLElement
        mentionOffset.value = [rect.left - caret.x - 2, rect.top - caret.y + 6]
        setTimeout(() => mentionRef.value?.show(), 10)
      }
    }
  }

  function getCaretPosition() {
    selection.value = editorRef.value?.caret.selection
    lastRange.value = selection.value?.getRangeAt(0).cloneRange()
    const rect = lastRange.value?.getClientRects()[0]

    if (!rect) return null

    return {
      x: rect.left,
      y: rect.top,
    }
  }

  const mentionFilterFn: QSelectProps['onFilter'] = (val, update) => {
    userSearch.value = val

    if (!val) {
      update(() => (filteredUsers.value = []))
      return
    }

    update(() => {
      const needle = val.trim().toLowerCase()
      filteredUsers.value = usersList.filter(
        (v) =>
          v.name.toLowerCase().indexOf(needle) > -1 ||
          v.username.toLowerCase().indexOf(needle) > -1,
      )
    })
  }

  function selectKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      mentionRef.value?.hide()
      editorRef.value?.focus()
    } else if (event.key === 'Backspace' && !userSearch.value) {
      mentionRef.value?.hide()
    } else if (
      event.key === 'Enter' &&
      userSearch.value &&
      filteredUsers.value.length
    ) {
      addMention(filteredUsers.value[0])
    }
  }
  return {
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
  }
}
