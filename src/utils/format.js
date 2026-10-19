// 日期、數字格式化工具（取代 2026 年 main.js 裡的 toChineseNum / toOrdinal / toChineseDate / toEnglishDate）
// 全部都是純函式，build 時（Node）和瀏覽器裡算出的結果完全相同。

const WEEKDAYS_ZH = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DIGITS_ZH = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']

/** 補零成兩位數：1 → '01' */
export function pad2(n) {
  return String(n).padStart(2, '0')
}

/**
 * 解析 'YYYY-MM-DD'，回傳 { y, m, d, weekday }；格式不符（例如「即日起」）回傳 null。
 * 不用 new Date('2026-01-06')：那會被當成 UTC 午夜，
 * 在美洲等 UTC 負時區的瀏覽器裡會顯示成前一天。
 */
export function parseYMD(value) {
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(value ?? '').trim())
  if (!match) return null
  const [y, m, d] = match.slice(1).map(Number)
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  return { y, m, d, weekday }
}

/** '2026-01-06' → '2026年01月06日'；非日期文字（如「即日起」）原樣回傳 */
export function formatDateZh(value) {
  const p = parseYMD(value)
  return p ? `${p.y}年${pad2(p.m)}月${pad2(p.d)}日` : (value ?? '')
}

/** '2026-01-06' → '星期二' */
export function weekdayZh(value) {
  const p = parseYMD(value)
  return p ? WEEKDAYS_ZH[p.weekday] : ''
}

/** '2026-01-06' → '2026/01/06' */
export function formatDateEn(value) {
  const p = parseYMD(value)
  return p ? `${p.y}/${pad2(p.m)}/${pad2(p.d)}` : (value ?? '')
}

/** '2026-01-06' → 'Tuesday' */
export function weekdayEn(value) {
  const p = parseYMD(value)
  return p ? WEEKDAYS_EN[p.weekday] : ''
}

/** 1 → '一'、10 → '十'、12 → '十二'、20 → '二十'（支援 1–99） */
export function toChineseNum(value) {
  const n = Number.parseInt(value, 10)
  if (!Number.isInteger(n) || n < 1 || n > 99) return String(value ?? '')
  if (n < 10) return DIGITS_ZH[n]
  const tens = Math.floor(n / 10)
  const ones = n % 10
  return `${tens === 1 ? '' : DIGITS_ZH[tens]}十${ones ? DIGITS_ZH[ones] : ''}`
}

/** 1 → 'st'、2 → 'nd'、11 → 'th'；模板裡寫 {{ n }}<sup>{{ ordinalSuffix(n) }}</sup> */
export function ordinalSuffix(value) {
  const n = Number.parseInt(value, 10)
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}

/** 是否為網址 */
export function isUrl(value) {
  return /^https?:\/\//i.test(String(value ?? '').trim())
}