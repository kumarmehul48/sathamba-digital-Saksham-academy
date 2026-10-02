export const API_BASE = 'https://superagent-d1c2e2a1.base44.app/functions';
export const WHATSAPP_URL = 'https://wa.me/917043795279';
export const WHATSAPP_LABEL = '+91 70437 95279';
export const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/18L9LFf0MZbcDJ_MyEsKrnDpOIVq29fX5U1AIdafpgew';

/** Assets live at the site root — nested routes need the base path prefix. */
export const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;
