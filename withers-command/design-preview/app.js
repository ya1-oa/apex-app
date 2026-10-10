/* WITHERS / DEATH BROKER — DESIGN PREVIEW 02
   Deliberately isolated state. Does NOT modify WITHERS v1 or connected Google Calendar.
   All records below are local examples based on the owner's stated plans.
*/
(() => {
'use strict';
const KEY='withers.visual.v2';
const $=s=>document.querySelector(s);
const dateNow=()=>new Date().toLocaleDateString('en-CA',{timeZone:'America/Los_Angeles'});
const today=dateNow();
const plusDays=(str,days)=>{const d=new Date(str+'T12:00:00');d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)};
const formatDay=(str,opts={})=>new Date(str+'T12:00:00').toLocaleDateString('en-US',opts);
const shortDay=str=>formatDay(str,{weekday:'short',month:'short',day:'numeric'});
const cash=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(Number(n)||0);
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>crypto.randomUUID?.()||('id'+Math.random().toString(36).slice(2));
const I={
 today:'<path d="M3 10.3 12 3l9 7.3V21h-7v-6h-4v6H3V10.3z"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
 work:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>',
 money:'<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18M7 15h4"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 next:'<path d="m9 18 6-6-6-6"/>',
 chevron:'<path d="m9 18 6-6-6-6"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 pen:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
 bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
 download:'<path d="M12 3v12m-4-4 4 4 4-4M4 18v3h16v-3"/>'
};
const icon=(n)=>`<svg viewBox="0 0 24 24" aria-hidden="true">${I[n]}</svg>`;
const seed=()=>({
 view:'today',workTab:'projects',date:today,balance:null,
 tasks:[
 {id:'fa',name:'Finish FAFSA documentation',category:'School',due:today,estimate:50,done:false,priority:1,steps:['Open the financial-aid messages from school','Prepare the unusual-circumstances statement and supporting letters','Confirm the exact submission portal with your adviser','Submit files and save the confirmation']},
 {id:'mit',name:'Build Joe’s MIT claim selection list',category:'Claimet',due:today,estimate:85,done:false,priority:1,steps:['List all MIT claims from the source of truth','Mark claims requiring MIT work','Allow Joe to select the work he wants','Track claims completed and payments owed']},
 {id:'bike',name:'Charge and check the delivery bike',category:'Personal',due:today,estimate:20,done:false,priority:2,steps:['Check charger and battery status','Inspect the pedal before riding','Pack water and your delivery gear']},
 {id:'leads',name:'Follow up with Caesar / moving leads',category:'Services',due:plusDays(today,1),estimate:25,done:false,priority:2,steps:['Send a short availability message','Ask for the next paid job and start time','Log the response and follow-up date']},
 {id:'interview',name:'Prepare for Tuesday’s 3:15 interview',category:'Career',due:'2026-10-12',estimate:60,done:false,priority:1,steps:['Confirm the company, interview link, and timezone','Practice your Claimet architecture stories','Review Python, integrations, and system design','Check equipment and quiet location']},
 {id:'viv',name:'Sketch clothing concepts for Viv',category:'Creative',due:plusDays(today,3),estimate:90,done:false,priority:3,steps:['Sketch two product silhouettes','Add material and trim notes','Send to Viv for critique','Coordinate a Fashion District visit']},
 {id:'violin',name:'Violin — record one practice take',category:'Music',due:plusDays(today,2),estimate:30,done:false,priority:3,steps:['Tune instrument and warm up','Practice a passage slowly','Record a short comparison take','Write down one technique to improve']},
 {id:'upwork',name:'Review five high-fit engineering leads',category:'Career',due:plusDays(today,2),estimate:45,done:false,priority:2,steps:['Review the existing Opportunity Desk','Discard roles below your rate/fit floor','Draft two evidence-backed proposals','Record the actual submissions separately']}
 ],
 events:[
 {id:'a',date:today,time:'15:00',end:'15:45',name:'LA Fitness membership',sub:'Payment reported: $68',kind:'personal'},
 {id:'b',date:today,time:'17:15',end:'20:30',name:'Uber Eats — dinner shift',sub:'Income block',kind:'income'},
 {id:'c',date:'2026-10-13',time:'10:30',end:'11:30',name:'Malik — callback window',sub:'Time unconfirmed · six-month contract',kind:'client'},
 {id:'d',date:'2026-10-13',time:'15:15',end:'16:15',name:'Engineering interview',sub:'3:15 PM · confirm the interview link',kind:'client'}
 ],
 entries:[{id:'gym68',date:today,title:'Gym membership',category:'Fitness',kind:'expense',amount:68,notes:'Paid $68 — reported in chat; bank sync not connected'}],
 skills:[],
 debtEstimate:2401
});
function load(){try{const x=JSON.parse(localStorage.getItem(KEY));if(x&&x.tasks&&x.events)return x}catch{}return seed()}
let s=load();
const save=()=>localStorage.setItem(KEY,JSON.stringify(s));
function toast(msg){const x=$('#toast');x.textContent=msg;x.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>x.classList.remove('visible'),2600)}
function setView(n){s.view=n;save();render();window.scrollTo({top:0,behavior:'instant'})}
function section(title,action='',handler=''){return `<div class="section-head"><h2>${title}</h2>${action?`<button class="inline-button" data-action="${handler}">${safe(action)} ${icon('next')}</button>`:''}</div>`}
function header(title,desc='',date=''){return `<div class="screen-head"><div class="date-line">${safe(date||formatDay(today,{weekday:'long',month:'long',day:'numeric',year:'numeric'}))}</div><h1 class="screen-title">${title}</h1>${desc?`<p class="screen-subtitle">${desc}</p>`:''}</div>`}
function rowTask(t){return `<div class="task-row ${t.done?'done':''}"><button class="task-check" role="checkbox" aria-checked="${t.done}" aria-label="Mark ${safe(t.name)} ${t.done?'incomplete':'complete'}" data-toggle="${safe(t.id)}">${t.done?icon('check'):''}</button><div class="task-main"><button class="task-name" data-task="${safe(t.id)}">${safe(t.name)}</button><div class="task-context">${safe(t.category)} · ${t.estimate} min${t.due===today?' · Today':(t.due<today?' · Overdue':` · ${shortDay(t.due)}`)}</div></div><span class="task-side">${t.priority===1?'Priority 1':''}</span></div>`}
function rowEvent(e){let a=e.time.split(':');let tt=new Date(e.date+'T'+e.time+':00');return `<div class="event-row" data-kind="${safe(e.kind)}"><div class="event-time">${tt.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',hour12:true}).replace(' ','')}</div><div class="event-stripe"></div><div><div class="event-title">${safe(e.name)}</div><div class="event-sub">${safe(e.sub||'')}${e.end?' · ends '+new Date(e.date+'T'+e.end+':00').toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}):''}</div></div></div>`}
function progress(){const due=s.tasks.filter(t=>t.due<=today);const done=due.filter(t=>t.done).length;const pct=due.length?Math.round(done/due.length*100):0;return {due:due.length,done,pct}}
function nextTask(){return s.tasks.filter(t=>!t.done).sort((a,b)=>a.priority-b.priority||a.due.localeCompare(b.due))[0]}
function todayView(){const p=progress();let top=nextTask();let active=s.tasks.filter(t=>!t.done&&t.id!==top?.id).sort((a,b)=>a.priority-b.priority||a.due.localeCompare(b.due)).slice(0,3);
 const events=s.events.filter(e=>e.date===today).sort((a,b)=>a.time.localeCompare(b.time));const gym=s.entries.find(x=>x.id==='gym68');
 return `${header('Today','Tasks due, today’s schedule, and recent spending.')}
 ${top?`<section class="next-action"><div><div class="next-label">First priority · ${safe(top.category)}</div><h2>${safe(top.name)}</h2><div class="details">${top.estimate} minutes · ${top.steps?.length||0} clear steps · ${top.due<=today?'Due today or earlier':shortDay(top.due)}</div></div><div class="right"><button class="start-button" data-task="${safe(top.id)}">Open ${icon('arrow')}</button></div></section>`:''}
 ${section('Next in line','All work','work')}<div class="plain-list">${active.length?active.map(rowTask).join(''):'<div class="empty">Queue clear. Add a task when you need one.</div>'}</div>
 ${section('Schedule','Open calendar','calendar')}<div class="schedule-list">${events.length?events.map(rowEvent).join(''):'<div class="empty">Nothing scheduled today.</div>'}</div>
 ${section('Progress','Open work','work')}<div class="progress-split"><div><div class="progress-number">${p.done} / ${p.due}</div><div class="progress-note">Tasks due by today completed</div></div><span class="small-label">${p.pct}%</span></div><div class="progress-track" role="progressbar" aria-label="Tasks completed" aria-valuenow="${p.pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${p.pct}%"></i></div>
 ${section('Money','Open ledger','money')}<div class="capital-overview"><div><div class="small-label">Latest expense</div><div class="money-amount">${gym?cash(gym.amount):'—'}</div><div class="money-detail">${gym?safe(gym.title):'Add an expense'}</div></div><div><div class="small-label">Account balance</div><div class="money-amount">${s.balance===null?'Not set':cash(s.balance)}</div><div class="money-detail">Manual entry; never assumed from earnings</div></div></div><p class="fine-print">This is a separate design preview. It does not alter your existing WITHERS data or connected calendar.</p>`;
}
function calendarView(){const selected=s.date||today;let start=plusDays(selected,-new Date(selected+'T12:00:00').getDay());const weekdays=Array.from({length:7},(_,i)=>plusDays(start,i));const events=s.events.filter(e=>e.date===selected).sort((a,b)=>a.time.localeCompare(b.time));return `${header('Schedule','See your commitments at a glance. Add blocks without leaving this view.','CALENDAR · '+formatDay(selected,{month:'long',year:'numeric'}).toUpperCase())}<div class="weekbar">${weekdays.map(d=>`<button class="day-chip ${d===selected?'selected':''}" data-date="${d}"><span>${formatDay(d,{weekday:'short'})}</span><strong>${+d.slice(-2)}</strong><span class="daymark"></span></button>`).join('')}</div><div class="section-head"><h2>${formatDay(selected,{weekday:'long',month:'short',day:'numeric'})}</h2><button class="inline-button" data-action="event">Add event ${icon('plus')}</button></div><div class="schedule-list">${events.length?events.map(rowEvent).join(''):'<div class="empty">This day is open. Add an event or keep it free.</div>'}</div><p class="fine-print">Preview events are stored locally. Google Calendar sync is not active in this preview.</p>`}
const categories=['Claimet','Career','School','Services','Creative','Music','Personal','Business'];
function workView(){const projects=categories.map(c=>{const ts=s.tasks.filter(t=>t.category===c);return {c,ts,done:ts.filter(t=>t.done).length}}).filter(g=>g.ts.length);
const tabs=`<div class="segmented" role="tablist"><button role="tab" aria-selected="${s.workTab==='projects'}" class="${s.workTab==='projects'?'active':''}" data-tab="projects">Projects</button><button role="tab" aria-selected="${s.workTab==='tasks'}" class="${s.workTab==='tasks'?'active':''}" data-tab="tasks">All tasks</button><button role="tab" aria-selected="${s.workTab==='skills'}" class="${s.workTab==='skills'?'active':''}" data-tab="skills">Practice</button></div>`;
 let content='';if(s.workTab==='projects')content=projects.map(g=>`<div class="project-row"><div class="project-heading"><div><h3>${safe(g.c)}</h3><p>${g.done} of ${g.ts.length} tasks completed</p></div><span class="project-count">${Math.round(100*g.done/g.ts.length)}%</span></div><div class="progress-track"><i style="width:${100*g.done/g.ts.length}%"></i></div><div class="project-taskline">Next: ${safe(g.ts.find(t=>!t.done)?.name||'Completed')}</div></div>`).join('');
 else if(s.workTab==='tasks')content=`<div class="plain-list">${s.tasks.slice().sort((a,b)=>Number(a.done)-Number(b.done)||a.priority-b.priority).map(rowTask).join('')}</div>`;
 else {const tracks=['Engineering','Art / design','Violin / music','Game design','Animation / 3D','Security','Writing','Business / sales'];content=tracks.map(name=>{let logs=s.skills.filter(x=>x.track===name);let mins=logs.reduce((a,x)=>a+x.minutes,0);return `<div class="skill-item"><div><h3>${name}</h3><p>${mins?mins+' minutes logged · '+logs.length+' sessions':'No practice logged yet'}</p></div><button class="secondary-button" data-skill="${safe(name)}">Log session</button></div>`}).join('')+`<p class="fine-print">Practice minutes are recorded activity, not an invented mastery score. Log what you did and what you can now demonstrate.</p>`;}
 return `${header('Work','Projects are organized by responsibility. Practice is separate from output.','PROJECTS & PRACTICE')}${tabs}<div>${content}</div>`;
}
function moneyView(){const spent=s.entries.filter(e=>e.kind==='expense').reduce((a,e)=>a+e.amount,0);const earned=s.entries.filter(e=>e.kind==='income').reduce((a,e)=>a+e.amount,0);
return `${header('Money','Balances, payments, and income you have recorded.','PERSONAL LEDGER')}
<section class="money-summary"><div class="small-label">Available balance · manual</div><div class="money-amount">${s.balance===null?'Not entered':cash(s.balance)}</div><div class="money-detail">${s.balance===null?'Enter your current account balance to start.':'You entered this amount; it is not bank-synced.'}</div><div class="summary-rule"></div><div class="summary-foot"><div><div class="small-label">Expenses logged</div><strong>${cash(spent)}</strong></div><div><div class="small-label">Income logged</div><strong>${cash(earned)}</strong></div></div></section>
<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="primary-button" data-action="expense">Record expense</button><button class="secondary-button" data-action="income">Record income</button><button class="secondary-button" data-action="balance">Edit balance</button></div>
${section('Transactions','Add entry','expense')}<div class="plain-list">${s.entries.slice().reverse().map(e=>`<div class="transaction"><div class="transaction-mark">${icon(e.kind==='expense'?'money':'bolt')}</div><div><h3>${safe(e.title)}</h3><p>${safe(e.category)} · ${shortDay(e.date)}</p></div><strong class="${e.kind==='expense'?'negative':''}">${e.kind==='expense'?'−':'+'}${cash(e.amount)}</strong></div>`).join('')}</div>
${section('Debt overview')}<div class="capital-overview"><div><div class="small-label">Cards combined</div><div class="money-amount">${cash(s.debtEstimate)}</div><div class="money-detail">User-reported approximate total</div></div><div><div class="small-label">Spending rule</div><div class="money-amount" style="font-size:20px">Protect rent</div><div class="money-detail">Review balances before new discretionary spending</div></div></div><p class="fine-print">The $68 gym payment is included from your latest update. Balances and other payments are not automatically reconciled.</p>`;
}
const navs=[['today','Today'],['calendar','Calendar'],['work','Work'],['money','Money']];
function navHTML(){return navs.map(([id,label])=>`<button class="nav-item ${s.view===id?'active':''}" data-nav="${id}" aria-current="${s.view===id?'page':'false'}">${icon(id)}<span>${label}</span></button>`).join('')}
function render(){const view=({today:todayView,calendar:calendarView,work:workView,money:moneyView})[s.view]||todayView;$('#screen').innerHTML=view();$('#desktopNavigation').innerHTML=navHTML();$('#bottomNavigation').innerHTML=navHTML();document.title=`WITHERS — ${s.view.charAt(0).toUpperCase()+s.view.slice(1)}`;wireScreen()}
function wireScreen(){document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>setView(b.dataset.nav));document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{let x=b.dataset.action;if(navs.some(n=>n[0]===x))setView(x);else if(x==='event')openEditor('event');else if(x==='income'||x==='expense'||x==='balance')openEditor(x)});document.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=()=>{let t=s.tasks.find(t=>t.id===b.dataset.toggle);if(t){t.done=!t.done;save();render();toast(t.done?'Task completed':'Task restored')}});document.querySelectorAll('[data-task]').forEach(b=>b.onclick=()=>openTask(b.dataset.task));document.querySelectorAll('[data-date]').forEach(b=>b.onclick=()=>{s.date=b.dataset.date;save();render()});document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{s.workTab=b.dataset.tab;save();render()});document.querySelectorAll('[data-skill]').forEach(b=>b.onclick=()=>openEditor('skill',b.dataset.skill))}
function field(name,label,type='text',value='',required=false,options=null){return `<label class="field">${label}${options?`<select name="${name}">${options.map(v=>`<option ${v===value?'selected':''}>${safe(v)}</option>`).join('')}</select>`:type==='textarea'?`<textarea name="${name}" placeholder="Concrete notes, not a generated summary">${safe(value)}</textarea>`:`<input type="${type}" name="${name}" ${required?'required':''} value="${safe(value)}" ${type==='number'?'min="0" step="0.01"':''} />`}</label>`}
let editorMode=null,editorId=null;
function openEditor(mode,detail=null){editorMode=mode;editorId=detail;const titles={task:'New task',event:'New event',income:'Record income',expense:'Record expense',balance:'Update balance',skill:'Log practice'};$('#editorTitle').textContent=titles[mode]||'Add';$('#editorHint').textContent=mode==='skill'?'CRAFT RECORD':'NEW RECORD';const form={
 task:()=>field('title','What needs to be done?','text','',true)+`<div class="field-row">${field('category','Area','text','Claimet',true,null).replace('type="text" name="category"','type="text" name="category"')}${field('due','Due date','date',today,true)}</div>`+`<div class="field-row">${field('minutes','Minutes estimated','number','30',true)}${field('priority','Priority','text','2',true)}</div>`+field('steps','How will you know it is done?','textarea'),
 event:()=>field('title','Event','text','',true)+`<div class="field-row">${field('date','Date','date',s.date||today,true)}${field('time','Start time','time','09:00',true)}</div>`+`<div class="field-row">${field('end','End time','time','10:00',true)}${field('kind','Type','text','personal')}</div>`+field('notes','Details','textarea'),
 income:()=>field('title','Source','text','',true)+`<div class="field-row">${field('amount','Amount ($)','number','',true)}${field('date','Date','date',today,true)}</div>`+field('category','Category','text','Income'),
 expense:()=>field('title','Merchant / expense','text','',true)+`<div class="field-row">${field('amount','Amount ($)','number','',true)}${field('date','Date','date',today,true)}</div>`+field('category','Category','text','Personal'),
 balance:()=>field('amount','Current account balance ($)','number',s.balance??0,true),
 skill:()=>`<div class="field-row">${field('track','Discipline','text',detail||'Engineering',true)}${field('minutes','Actual practice (min)','number','30',true)}</div>`+field('notes','What did you practice? What evidence do you have?','textarea','',true)
 }[mode];$('#editorFields').innerHTML=form();$('#submitEditor').textContent='Save';$('#editorDialog').showModal();const first=$('#editorFields input');if(first)setTimeout(()=>first.focus(),80)}
function openTask(id){const t=s.tasks.find(x=>x.id===id);if(!t)return;editorMode='taskDetail';editorId=id;$('#editorTitle').textContent=t.name;$('#editorHint').textContent=t.category+' · '+t.estimate+' minutes';$('#editorFields').innerHTML=`<div class="small-label" style="margin-bottom:14px">DEFINITION OF DONE</div><div class="plain-list">${(t.steps?.length?t.steps:['Write down the verifiable outcome.','Complete the work.','Record the result.']).map((step,i)=>`<div class="task-row" style="align-items:center"><span style="font-family:Georgia,serif;color:var(--oxblood);font-size:19px;width:24px">${String(i+1).padStart(2,'0')}</span><div class="task-main"><div class="task-name">${safe(step)}</div></div></div>`).join('')}</div><p class="fine-print">Doing the task changes its status. It does not automatically imply the work was verified by a client.</p>`;$('#submitEditor').textContent=t.done?'Mark incomplete':'Mark complete';$('#editorDialog').showModal()}
$('#editorForm').onsubmit=e=>{e.preventDefault();if(editorMode==='taskDetail'){let t=s.tasks.find(x=>x.id===editorId);if(t)t.done=!t.done;save();$('#editorDialog').close();render();toast(t.done?'Task completed':'Task restored');return}
let f=new FormData(e.currentTarget),v=Object.fromEntries(f.entries());if(editorMode==='task'){s.tasks.push({id:uid(),name:v.title.trim(),category:v.category.trim()||'Personal',due:v.due||today,estimate:+v.minutes||30,done:false,priority:Math.min(4,Math.max(1,+v.priority||2)),steps:v.steps.split('\n').map(x=>x.trim()).filter(Boolean)})}
else if(editorMode==='event'){if(v.end<=v.time){toast('End time must be after start');return}s.events.push({id:uid(),name:v.title,date:v.date,time:v.time,end:v.end,sub:v.notes,kind:v.kind.toLowerCase()})}
else if(editorMode==='income'||editorMode==='expense'){if(+v.amount<=0){toast('Enter an amount above zero');return}s.entries.push({id:uid(),title:v.title,amount:+v.amount,date:v.date,category:v.category,kind:editorMode})}
else if(editorMode==='balance'){s.balance=+v.amount}
else if(editorMode==='skill'){if(+v.minutes<=0){toast('Enter practiced minutes');return}s.skills.push({id:uid(),track:v.track,minutes:+v.minutes,notes:v.notes,date:today})}
save();$('#editorDialog').close();render();toast('Saved on this device')};
const actionRows=[['task','Task','Assign work to a project and due date','list'],['event','Calendar block','Set a date and start/end time','calendar'],['expense','Expense','Record a payment or purchase','money'],['income','Income','Record cash received','bolt'],['skill','Practice','Log actual craft hours and evidence','pen']];
$('#actionChoices').innerHTML=actionRows.map(([m,n,desc,ic])=>`<button class="menu-option" data-create="${m}"><span class="glyph">${icon(ic)}</span><span><strong>${n}</strong><small>${desc}</small></span>${icon('chevron')}</button>`).join('');
document.querySelectorAll('[data-create]').forEach(b=>b.onclick=()=>{$('#actionDialog').close();openEditor(b.dataset.create)});
$('#addButton').onclick=()=>$('#actionDialog').showModal();$('#homeBrand').onclick=()=>setView('today');$('#closeEditor').onclick=$('#cancelEditor').onclick=()=>$('#editorDialog').close();$('#closeAction').onclick=()=>$('#actionDialog').close();
window.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#addButton').click()}});
render();
})();