import { ModelRef, ref } from 'vue'

const MAX_SIZE = 10 // MAX_SIZE in MB

export type SelectedFile = {
  key: string
  size: string
  file: File
  typeIsValid: boolean
  sizeIsValid: boolean
}

const invalidSizeError = `(File too big. Max: ${MAX_SIZE}MB)`
const invalidFileTypeError = '(Invalid file type)'

export function useAttachment(files: ModelRef<File[]>) {
  const fileRef = ref<HTMLInputElement>()

  const selectedFiles = ref<SelectedFile[]>(
    files.value?.map((file) => ({
      key: `${file.name}-${file.size}-${file.type}`,
      file,
      size: parseFileSize(file.size),
      typeIsValid: true,
      sizeIsValid: true,
    })),
  )

  async function onFileSelect(event: Event) {
    const selected = (event.target as HTMLInputElement).files
    if (!selected?.length) return

    const newFiles = Array.from(selected)
    const newSelected: SelectedFile[] = []
    for (let i = 0; i < selected.length; i++) {
      const selectedFile = validateFile(selected[i])
      if (!isAlreadySelected(selected[i])) {
        newSelected.push(selectedFile)
      }
    }

    files.value = [...files.value, ...newFiles]
    selectedFiles.value = [...selectedFiles.value, ...newSelected]
  }

  function validateFile(file: File) {
    const maxSizeInBytes = MAX_SIZE * 1024 * 1024
    const allowedFileTypes = [
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'text/csv', // .csv
      'application/pdf', // .pdf
      'text/plain', // .txt
      // Image files
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml', // SVG files
      // Audio files
      'audio/mpeg',
      'audio/ogg',
      'audio/*', // Any audio type
      // Video files
      'video/mp4',
      'video/ogg',
      'video/*', // Any video type
      // PowerPoint files
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      // Adobe Photoshop files
      'image/vnd.adobe.photoshop', // .psd
      // AutoCAD files
      'application/acad', // .dwg
      // Adobe Illustrator files
      'application/illustrator', // .ai
    ]

    const selectedFile: SelectedFile = {
      key: [file.name, file.size, file.type].join('-'),
      file,
      size: parseFileSize(file.size),
      typeIsValid: allowedFileTypes.includes(file.type),
      sizeIsValid: file.size <= maxSizeInBytes,
    }

    return selectedFile
  }

  function isAlreadySelected(file: File) {
    return files.value.some(
      (f) =>
        f.name === file.name &&
        f.size === file.size &&
        f.type === file.type &&
        f.lastModified === file.lastModified,
    )
  }

  function parseFileSize(bytes: number) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Byte'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
  }

  function removeFile(i: number) {
    files.value.splice(i, 1)
    selectedFiles.value.splice(i, 1)
  }

  return {
    onFileSelect,
    removeFile,
    fileRef,
    selectedFiles,
    invalidSizeError,
    invalidFileTypeError,
  }
}
