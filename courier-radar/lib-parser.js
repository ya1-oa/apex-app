const MONEY = /\$\s*([0-9]+(?:\.[0-9]{1,2})?)/gi;
const MILES = /([0-9]+(?:\.[0-9]+)?)\s*(?:mi|miles?)\b/i;
const MINUTES = /([0-9]+)\s*(?:min|mins|minutes?)\b/i;
const NOISE=[/uber\s*eats/i,/delivery/i,/exclusive/i,/accept/i,/decline/i,/includes? expected tip/i,/estimated/i,/total/i,/miles?\b/i,/minutes?\b/i,/customer/i,/pickup/i,/drop.?off/i,/you(?:'|’)re/i,/match/i,/radar/i,/shop\s*&?\s*pay/i,/items?\b/i,/^\s*\$?[0-9.,]+\s*$/,/^\s*\d{1,2}:\d{2}\s*(?:am|pm)?\s*$/i];

export function parseOfferText(rawText=''){
  const text=String(rawText||'').replace(/\r/g,'');
  const lines=text.split('\n').map(s=>s.trim()).filter(Boolean);
  const payouts=[...text.matchAll(MONEY)].map(m=>Number(m[1])).filter(n=>Number.isFinite(n)&&n>0&&n<500);
  const payout=payouts.length?Math.max(...payouts):null;
  const mm=text.match(MILES), miles=mm?Number(mm[1]):null;
  const mins=[...text.matchAll(new RegExp(MINUTES.source,'gi'))].map(m=>Number(m[1])).filter(n=>Number.isFinite(n)&&n>0&&n<240);
  const etaMinutes=mins.length?Math.min(...mins):null;
  const isShop=/shop\s*&?\s*pay|shopping|\b\d+\s+items?\b/i.test(text);
  const im=text.match(/\b(\d+)\s+items?\b/i), itemCount=im?Number(im[1]):null;
  const candidates=lines.filter(line=>line.length>=2&&line.length<=64&&!NOISE.some(re=>re.test(line))&&/[A-Za-z]/.test(line));
  const merchant=candidates[0]||null;
  let confidence=0;
  if(payout!=null)confidence+=.38;if(miles!=null)confidence+=.28;if(etaMinutes!=null)confidence+=.18;if(merchant)confidence+=.16;
  return {payout,miles,etaMinutes,merchant,isShop,itemCount,confidence:Number(Math.min(confidence,1).toFixed(2)),rawText:text};
}
export function effectiveOfferRate({payout,miles,etaMinutes,isShop,itemCount,mode='normal'}){
  if(!(payout>0))return null;
  const ride=etaMinutes??((miles||0)/11.5)*60+5;
  const shop=isShop?Math.max(8,Math.min(25,(itemCount||6)*1.2)):0;
  const reposition=mode==='escape'?2:5;
  const effectiveMinutes=Math.max(1,ride+shop+reposition);
  return {effectiveMinutes:Number(effectiveMinutes.toFixed(1)),dollarsPerHour:Number((payout/effectiveMinutes*60).toFixed(2))};
}
