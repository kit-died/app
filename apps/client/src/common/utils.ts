import dayjs from 'dayjs'
import {
  QNotifyCreateOptions,
  copyToClipboard,
  date as qdate,
  useQuasar,
} from 'quasar'

const { formatDate } = qdate

function fromNow(date: string | Date | number) {
  return dayjs(date).fromNow()
}

function isDue(date: string) {
  return dayjs(date).isBefore(dayjs())
}

function dashToTitle(dash: string) {
  return dash
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function humanizeDuration(duration: number | undefined) {
  if (duration)
    return dayjs.duration(duration * 1000).humanize()

  // return dayjs.duration(dayjs(duration).diff(dayjs())).humanize()
}

function useUtils() {
  const $q = useQuasar()

  function notify(
    message: string,
    type = 'positive',
    position: QNotifyCreateOptions['position'] = 'top',
    timeout = 2000,
  ) {
    $q.notify({
      message,
      position,
      type,
      timeout,
    })
  }

  function copy(text: string, msg?: string) {
    copyToClipboard(text)
    notify(msg ?? `Copied ${text} to clipboard`)
  }

  return {
    notify,
    copy,
  }
}

export {
  dashToTitle, formatDate, fromNow, humanizeDuration, isDue, useUtils
}

