import type { ValidateResult } from "./types";

export const INTRO_TEMPLATE_HINT = `【名前】
（呼ばれたい名前）

【年齢】（任意）
20 / 25 / 非公開 など

【性別】（任意）
男 / 女 / 非公開 など

【目的】
このサーバーに参加した理由

【一言】
自由欄
`;

// セクション見出し（テンプレの【】）
const NAME_FIELD = { key: "名前", header: "【名前】" };
const AGE_FIELD = { key: "年齢", header: "【年齢】" };
const GENDER_FIELD = { key: "性別", header: "【性別】" };
const PURPOSE_FIELD = { key: "目的", header: "【目的】" };
const ONE_FIELD = { key: "一言", header: "【一言】" };

// 必須は名前・目的・一言。年齢/性別は任意
export const REQUIRED_FIELDS = [NAME_FIELD, PURPOSE_FIELD, ONE_FIELD];

// 禁止要素（荒らし/宣伝/メンション爆撃対策）
// NOTE: includesではなく正規表現にすると "discord.gg/xxxx" や "https://..." の揺れに強い
export const NG_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "招待リンク", pattern: /discord\.gg\//i },
  { label: "URL(http)", pattern: /https?:\/\//i },
  { label: "@everyone", pattern: /@everyone/i },
  { label: "@here", pattern: /@here/i },
];

type FieldDef = { key: string; header: string };

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * テンプレの【見出し】ごとに、次の見出しまでの本文を抜き出す。
 * - 見出しだけ書いて中身が空、を検出できる
 */
function extractSectionValue(text: string, field: FieldDef, allHeaders: string[]) {
  const startHeader = escapeRegExp(field.header);
  const nextHeaders = allHeaders
    .filter((h) => h !== field.header)
    .map(escapeRegExp)
    .join("|");

  // 例: 【趣味】(任意) のように後ろに注釈があってもOKにする
  // 次の見出し（または文末）までを本文として取得
  const re = nextHeaders
    ? new RegExp(`${startHeader}[^\n]*\n([\\s\\S]*?)(?=^(${nextHeaders})|$)`, "m")
    : new RegExp(`${startHeader}[^\n]*\n([\\s\\S]*)$`, "m");

  const m = text.match(re);
  if (!m) return null; // 見出しが無い

  // 本文（空行・スペースだけを除去）
  const value = m[1].trim();
  return value;
}

export function validateIntro(text: string, minChars: number): ValidateResult {
  const errors: string[] = [];
  const missingFields: string[] = [];
  const trimmed = text.trim();

  // 文字数（全体）チェック
  if (trimmed.length < minChars) {
    errors.push(`文字数が少ないです（最低${minChars}文字）`);
  }

  // 禁止要素チェック
  for (const ng of NG_PATTERNS) {
    if (ng.pattern.test(text)) {
      errors.push(`禁止要素が含まれています: ${ng.label}`);
    }
  }

  // 必須セクションの存在＆中身チェック
  const allHeaders = [NAME_FIELD, AGE_FIELD, GENDER_FIELD, PURPOSE_FIELD, ONE_FIELD].map((f) => f.header);

  for (const f of REQUIRED_FIELDS) {
    const value = extractSectionValue(text, f, allHeaders);

    if (value === null || value.length === 0) {
      missingFields.push(f.header);
      errors.push(`「${f.header}」がありません`);
    }
  }

  if (missingFields.length > 0) {
    return { ok: false, errors, reason: "NOT_TEMPLATE", missingFields };
  }
  if (errors.some((e) => e.startsWith("文字数が少ない"))) {
    return { ok: false, errors, reason: "MIN_CHARS" };
  }
  if (errors.some((e) => e.startsWith("禁止要素"))) {
    return { ok: false, errors, reason: "NG" };
  }

  return { ok: errors.length === 0, errors };
}

export function extractIntroName(text: string): string | null {
  const allHeaders = [NAME_FIELD, AGE_FIELD, GENDER_FIELD, PURPOSE_FIELD, ONE_FIELD].map((f) => f.header);
  return extractSectionValue(text, NAME_FIELD, allHeaders);
}
