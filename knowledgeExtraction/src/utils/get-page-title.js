import defaultSettings from '@/settings'

const title = defaultSettings.title || '临床术语知识库'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
