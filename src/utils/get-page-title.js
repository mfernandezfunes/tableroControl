import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Panel Administracion'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
