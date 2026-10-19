// 觀摩團資料 composable（整合 2026 年 main.js 的資料處理邏輯）
//
// 這裡只負責「把 JSON 整理成元件好用的形狀」，不碰 DOM、不用 fetch、不用 onMounted，
// 所以 vite-ssg build 時就能拿到完整資料並寫進 HTML。
// 所有計算在模組載入時做一次，各元件共用同一份結果。

import rawData from '@/data/data.json'
import rawPlaces from '@/data/place.json'
import {
  pad2, formatDateZh, weekdayZh, formatDateEn, weekdayEn,
  toChineseNum, ordinalSuffix, isUrl,
} from '@/utils/format'

// ─── 設定 ────────────────────────────────────────────────

const HEADER_KEY = 'header'

// 圖片 / 檔案路徑（沿用 2026 年的資料夾結構，public/img 可以整包搬過來）
// 之後想統一路徑規則，只要改這裡。
const PATHS = {
  headerNewsImage: (file) => `img/header/pictures/${file}`,
  sessionNewsImage: (code, file) => `img/${code}/pictures/${file}`,
  galleryImage: (code, file) => `img/session${code}/pictures/${file}`,
  placeImage: (file) => `img/place/${file}`,
}

// 每個時段的標題
const SLOT_LABELS = {
  'all-dayandnight': { zh: '全日活動', en: 'All Day' },
  'all-day': { zh: '全日活動', en: 'All Day' },
  morning: { zh: '上午活動', en: 'Morning' },
  afternoon: { zh: '下午活動', en: 'Afternoon' },
  evening: { zh: '晚間活動', en: 'Evening' },
}

// 新聞重要性 → Bootstrap Icons 圖示
const IMPORTANCE_MARKS = {
  important: { icon: 'bi-exclamation-diamond', cls: 'text-danger' },
  warn: { icon: 'bi-info-circle', cls: 'text-warning' },
  normal: null,
}

// ─── 工具 ────────────────────────────────────────────────

/** 站內路徑加上 base（/OCAC-YouthTaiwanStudyTour2027/）；外部網址原樣回傳 */
export function asset(path) {
  if (!path) return ''
  if (isUrl(path)) return path
  return import.meta.env.BASE_URL + String(path).replace(/^\.?\/+/, '')
}

const str = (v) => (v == null ? '' : String(v).trim())

// build 時在終端機 / GitHub Actions log 顯示的資料警告
export const dataWarnings = []
const warn = (msg) => dataWarnings.push(msg)

// ─── 景點（place.json）────────────────────────────────────

const placesById = new Map(
  (Array.isArray(rawPlaces) ? rawPlaces : []).map((p) => [str(p.id), p]),
)

/**
 * 取得景點介紹。lang 例：'zh-TW'、'en'、'en-US'
 * 找不到該語言時：先試語系前綴（en-US → en），再退回 zh-TW。
 */
export function getPlace(placeId, lang = 'zh-TW') {
  const raw = placesById.get(str(placeId))
  if (!raw) return null
  const prefix = str(lang).split('-')[0]
  const text = raw[lang] || raw[prefix] || raw['zh-TW'] || ''
  return {
    id: raw.id,
    image: raw.image ? asset(PATHS.placeImage(raw.image)) : '',
    paragraphs: text.split('\n').map((line) => line.trim()).filter(Boolean),
  }
}

// ─── 新聞 ────────────────────────────────────────────────

function normalizeNews(list = [], scope, imagePath) {
  return list.map((item, index) => {
    const importance = str(item.importance).toLowerCase()
    return {
      id: `news-${scope}-${index}`, // 給 accordion 用的唯一 id
      title: str(item.title),
      content: str(item.content),
      link: asset(str(item.link)),
      image: item.image ? asset(imagePath(str(item.image))) : '',
      mark: IMPORTANCE_MARKS[importance] ?? null,
    }
  })
}

const headerNews = normalizeNews(
  rawData.news?.[HEADER_KEY], HEADER_KEY, PATHS.headerNewsImage,
)

// ─── 梯次 ────────────────────────────────────────────────

const sessions = (rawData.dates ?? [])
  .map((d) => {
    const id = str(d.session)
    const code = pad2(id)
    const status = str(d.status).toUpperCase()
    return {
      id,
      code,
      anchors: {
        root: `session${code}`,
        info: `session${code}Info`,
        schedule: `session${code}Schedule`,
        photo: `session${code}Photo`,
      },
      nameZh: `第${toChineseNum(id)}梯次`, // 第一梯次
      ordinal: { num: Number(id), suffix: ordinalSuffix(id) }, // 1<sup>st</sup>
      area: str(d.area),
      areaEn: str(d.area_en),
      dateRangeZh: `${formatDateZh(d.start_date)}至${formatDateZh(d.end_date)}`,
      registerRangeZh: `${formatDateZh(d.register_date)}至${formatDateZh(d.expiration_date)}`,
      quota: str(d.quota),
      link: asset(str(d.link)),
      status,
      isCancelled: status === 'CANCELLED',
      isEnded: status === 'ENDED',
    }
  })
  .sort((a, b) => Number(a.id) - Number(b.id))

const sessionsById = new Map(sessions.map((s) => [s.id, s]))

// ─── 行程表 ──────────────────────────────────────────────

function normalizeActivity(a) {
  const placeId = str(a.place_id)
  const introEn = str(a.introduction_en)
  return {
    title: str(a.title),
    place: str(a.place),
    placeEn: str(a.place_en),
    // 只有 place.json 裡真的有這個景點，才給 placeId（元件據此決定要不要做成可點的連結）
    placeId: placesById.has(placeId) ? placeId : '',
    intro: str(a.introduction),
    introEn: isUrl(introEn) ? '' : introEn,
  }
}

function normalizeAccommodation(a) {
  // 2026 年資料把住宿網址放在 introduction_en，這裡統一轉成 url
  const candidates = [a.url, a.introduction_en, a.introduction].map(str)
  return {
    place: str(a.place),
    placeEn: str(a.place_en),
    url: candidates.find(isUrl) ?? '',
  }
}

/** 決定當天要顯示哪些時段（沿用 2026 年邏輯） */
function pickSlots(bySlot) {
  if (bySlot['all-dayandnight']?.length) return ['all-dayandnight']
  if (bySlot['all-day']?.length) return ['all-day', 'evening']
  return ['morning', 'afternoon', 'evening']
}

function buildDays(sessionId, items = []) {
  const code = pad2(sessionId)

  // 依日期分組（日期排序，不依賴 Sheets 列順序；同一時段內保留原順序）
  const byDate = new Map()
  for (const item of items) {
    const date = str(item.date)
    if (!byDate.has(date)) byDate.set(date, [])
    byDate.get(date).push(item)
  }

  return [...byDate.keys()].sort().map((date, index) => {
    const bySlot = {}
    for (const item of byDate.get(date)) {
      const slot = str(item.time)
      ;(bySlot[slot] ??= []).push(item)
    }

    const shown = pickSlots(bySlot)
    for (const [slot, list] of Object.entries(bySlot)) {
      if (slot === 'accommodation' || shown.includes(slot)) continue
      const label = SLOT_LABELS[slot] ? slot : `未知時段「${slot}」`
      warn(`第${sessionId}梯 ${date}：${label} 的 ${list.length} 筆資料不會顯示（${list.map((i) => i.place || i.place_en).join('、')}）`)
    }

    return {
      id: `session${code}ScheduleDay${index + 1}`, // accordion 用的唯一 id
      date,
      dateZh: formatDateZh(date),
      weekdayZh: weekdayZh(date),
      dateEn: formatDateEn(date),
      weekdayEn: weekdayEn(date),
      sections: shown
        .filter((slot) => bySlot[slot]?.length)
        .map((slot) => ({
          slot,
          label: SLOT_LABELS[slot],
          items: bySlot[slot].map(normalizeActivity),
        })),
      accommodation: (bySlot.accommodation ?? []).map(normalizeAccommodation),
    }
  })
}

const scheduleBySession = Object.fromEntries(
  Object.entries(rawData.schedule ?? {}).map(([id, items]) => [str(id), buildDays(str(id), items)]),
)

// ─── 花絮 ────────────────────────────────────────────────

const galleryBySession = Object.fromEntries(
  Object.entries(rawData.gallery ?? {}).map(([id, photos]) => [
    str(id),
    (photos ?? []).map((p) => ({
      src: asset(PATHS.galleryImage(pad2(id), str(p.fileName))),
      description: str(p.description),
      descriptionEn: str(p.description_en),
    })),
  ]),
)

// ─── 梯次新聞 ────────────────────────────────────────────

const newsBySession = Object.fromEntries(
  Object.entries(rawData.news ?? {})
    .filter(([key]) => key !== HEADER_KEY)
    .map(([id, list]) => {
      const code = pad2(id)
      return [str(id), normalizeNews(list, `s${code}`, (file) => PATHS.sessionNewsImage(code, file))]
    }),
)

// ─── 資料檢查 ────────────────────────────────────────────

for (const id of Object.keys(scheduleBySession)) {
  if (!sessionsById.has(id)) warn(`schedule 有第${id}梯的行程，但 dates 裡沒有這個梯次`)
}
for (const s of sessions) {
  if (!s.isCancelled && !s.link) warn(`${s.nameZh}（${s.area}）沒有簡章連結`)
}

if (import.meta.env.SSR && dataWarnings.length) {
  console.warn(`\n[資料檢查] 發現 ${dataWarnings.length} 個問題：\n  - ${dataWarnings.join('\n  - ')}\n`)
}

// ─── 對外介面 ────────────────────────────────────────────

export function useTourData() {
  return {
    sessions,
    headerNews,
    getSession: (id) => sessionsById.get(str(id)) ?? null,
    getSchedule: (id) => scheduleBySession[str(id)]?.length ? scheduleBySession[str(id)] : null,
    getGallery: (id) => galleryBySession[str(id)] ?? [],
    getNews: (id) => newsBySession[str(id)] ?? [],
    getPlace,
    asset,
  }
}