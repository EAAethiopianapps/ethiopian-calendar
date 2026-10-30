'use strict';
const DAY=86400000, REF=Date.UTC(2024,8,11), ETH_REF_YEAR=2017;
const enMonths=['Meskerem','Tikimt','Hidar','Tahsas','Tir','Yekatit','Megabit','Miazia','Ginbot','Sene','Hamle','Nehase','Pagume'];
const amMonths=['መስከረም','ጥቅምት','ኅዳር','ታኅሣሥ','ጥር','የካቲት','መጋቢት','ሚያዝያ','ግንቦት','ሰኔ','ሐምሌ','ነሐሴ','ጳጉሜን'];
const usMonths=['January','February','March','April','May','June','July','August','September','October','November','December'];
const weekdays=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const $=id=>document.getElementById(id);
const utc=(y,m,d)=>Date.UTC(y,m,d);
const dayNum=ms=>Math.round(ms/DAY);
function startOfEthYear(y){return REF+DAY*(365*(y-ETH_REF_YEAR)+Math.floor(y/4)-Math.floor(ETH_REF_YEAR/4));}
function ethToMs(y,m,d){if(y<1||m<1||m>13||d<1||d>(m===13?(y%4===3?6:5):30))throw Error('Invalid Ethiopian date');return startOfEthYear(y)+DAY*((m-1)*30+d-1);}
function toEth(ms){let y=new Date(ms).getUTCFullYear()-7;while(ms<startOfEthYear(y))y--;while(ms>=startOfEthYear(y+1))y++;let n=dayNum(ms-startOfEthYear(y));return {y,m:Math.floor(n/30)+1,d:n%30+1};}
function iso(ms){return new Date(ms).toISOString().slice(0,10)}
function localToday(){let d=new Date();return utc(d.getFullYear(),d.getMonth(),d.getDate());}
function gregLabel(ms){return new Intl.DateTimeFormat('en-US',{timeZone:'UTC',weekday:'long',month:'long',day:'numeric',year:'numeric'}).format(new Date(ms));}
function ethLabel(ms,am=false){let e=toEth(ms);return `${(am?amMonths:enMonths)[e.m-1]} ${e.d}, ${e.y}${am?' ዓ.ም':''}`;}
function nthWeekday(y,m,weekday,n){let first=new Date(utc(y,m,1)).getUTCDay();return 1+(weekday-first+7)%7+7*(n-1)}
function lastWeekday(y,m,weekday){let last=new Date(utc(y,m+1,0));return last.getUTCDate()-(last.getUTCDay()-weekday+7)%7}
function holidays(ms){let e=toEth(ms),d=new Date(ms),m=d.getUTCMonth(),n=d.getUTCDate(),y=d.getUTCFullYear(),out=[];
 if(e.m===1&&e.d===1)out.push('🇪🇹 Ethiopian New Year (Enkutatash)');
 if(e.m===1&&e.d===17)out.push('🇪🇹 Meskel');
 if(e.m===5&&e.d===11)out.push('🇪🇹 Timkat');
 if(m===0&&n===1)out.push('🇺🇸 New Year’s Day');
 if(m===0&&n===nthWeekday(y,0,1,3))out.push('🇺🇸 Martin Luther King Jr. Day');
 if(m===1&&n===nthWeekday(y,1,1,3))out.push('🇺🇸 Washington’s Birthday');
 if(m===4&&n===lastWeekday(y,4,1))out.push('🇺🇸 Memorial Day');
 if(m===5&&n===19)out.push('🇺🇸 Juneteenth');
 if(m===6&&n===4)out.push('🇺🇸 Independence Day');
 if(m===8&&n===nthWeekday(y,8,1,1))out.push('🇺🇸 Labor Day');
 if(m===9&&n===nthWeekday(y,9,1,2))out.push('🇺🇸 Columbus Day');
 if(m===10&&n===11)out.push('🇺🇸 Veterans Day');
 if(m===10&&n===nthWeekday(y,10,4,4))out.push('🇺🇸 Thanksgiving');
 if(m===11&&n===25)out.push('🇺🇸 Christmas Day');
 return out;
}
let mode='dual',language='en',selected=localToday(),viewMonth=toEth(selected).m,viewYear=toEth(selected).y;
function monthBounds(){if(mode==='us'){return {start:utc(viewYear,viewMonth-1,1),end:utc(viewYear,viewMonth,1),title:`${usMonths[viewMonth-1]} ${viewYear}`}}let start=ethToMs(viewYear,viewMonth,1);return {start,end:start+DAY*(viewMonth===13?(viewYear%4===3?6:5):30),title:`${(language==='am'?amMonths:enMonths)[viewMonth-1]} ${viewYear}`};}
function setMode(next){if(next===mode)return;const anchor=monthBounds().start;mode=next;if(mode==='us'){let d=new Date(anchor);viewYear=d.getUTCFullYear();viewMonth=d.getUTCMonth()+1;}else{let e=toEth(anchor);viewYear=e.y;viewMonth=e.m;}render();}
function shiftMonth(delta){viewMonth+=delta;let count=mode==='us'?12:13;if(viewMonth<1){viewMonth=count;viewYear--}else if(viewMonth>count){viewMonth=1;viewYear++}render();}
function render(){const today=localToday();$('todayEth').textContent=ethLabel(today,language==='am');$('todayUs').textContent=gregLabel(today);document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));$('lang').textContent=language==='en'?'አማ':'EN';const bounds=monthBounds();$('monthTitle').textContent=bounds.title;$('monthSubtitle').textContent=mode==='us'?ethLabel(bounds.start,language==='am'):`${gregLabel(bounds.start).split(', ').slice(1).join(', ')} – ${new Date(bounds.end-DAY).toLocaleDateString('en-US',{timeZone:'UTC',month:'short',day:'numeric',year:'numeric'})}`;
 $('weekdays').replaceChildren();weekdays.forEach(w=>{let el=document.createElement('div');el.textContent=w;$('weekdays').append(el)});
 const grid=$('days');grid.replaceChildren();const offset=new Date(bounds.start).getUTCDay();const count=Math.round((bounds.end-bounds.start)/DAY);const total=Math.ceil((offset+count)/7)*7;
 for(let i=0;i<total;i++){let ms=bounds.start+(i-offset)*DAY,e=toEth(ms),g=new Date(ms),inMonth=i>=offset&&i<offset+count;let b=document.createElement('button');b.className='day'+(!inMonth?' other':'')+(ms===today?' today':'')+(ms===selected?' selected':'')+(holidays(ms).length?' holiday':'');let p=document.createElement('span'),s=document.createElement('span');p.className='primary';s.className='secondary';p.textContent=mode==='us'?g.getUTCDate():e.d;s.textContent=mode==='us'?`${amMonths[e.m-1]} ${e.d}`:mode==='dual'?g.getUTCDate():'';b.append(p,s);b.setAttribute('aria-label',`${ethLabel(ms)}; ${gregLabel(ms)}`);b.onclick=()=>{selected=ms;if(!inMonth){if(mode==='us'){viewYear=g.getUTCFullYear();viewMonth=g.getUTCMonth()+1}else{viewYear=e.y;viewMonth=e.m}}render()};grid.append(b)}
 $('selectedHeading').textContent=language==='am'?'የተመረጠ ቀን':'Selected date';$('selectedDates').replaceChildren();[['🇪🇹 Ethiopian',ethLabel(selected,language==='am')],['🇺🇸 U.S. / Gregorian',gregLabel(selected)]].forEach(([label,value])=>{let card=document.createElement('div');card.className='date-card';let small=document.createElement('small');small.textContent=label;let strong=document.createElement('strong');strong.textContent=value;card.append(small,strong);$('selectedDates').append(card)});
 $('holidayInfo').replaceChildren();let h=holidays(selected);if(h.length){let box=document.createElement('div');box.className='holiday-note';box.textContent=h.join(' · ');$('holidayInfo').append(box)}renderEvents();$('gregDate').value=iso(selected);$('conversion').textContent=ethLabel(selected,language==='am');}
function loadEvents(){try{return JSON.parse(localStorage.getItem('ethio-events')||'{}')}catch{return {}}}
function saveEvents(e){localStorage.setItem('ethio-events',JSON.stringify(e))}
function renderEvents(){let root=$('events');root.replaceChildren();let items=loadEvents()[iso(selected)]||[];if(!items.length){let el=document.createElement('p');el.className='empty';el.textContent='No events for this date';root.append(el);return}items.forEach((name,index)=>{let row=document.createElement('div');row.className='event-item';let text=document.createElement('span');text.textContent=name;let btn=document.createElement('button');btn.textContent='Remove';btn.onclick=()=>{let all=loadEvents();all[iso(selected)].splice(index,1);saveEvents(all);renderEvents()};row.append(text,btn);root.append(row)})}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));$('prev').onclick=()=>shiftMonth(-1);$('next').onclick=()=>shiftMonth(1);$('lang').onclick=()=>{language=language==='en'?'am':'en';render()};$('goToday').onclick=()=>{selected=localToday();if(mode==='us'){let d=new Date(selected);viewYear=d.getUTCFullYear();viewMonth=d.getUTCMonth()+1}else{let e=toEth(selected);viewYear=e.y;viewMonth=e.m}render()};$('gregDate').onchange=e=>{let value=e.target.value;if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return;selected=utc(+value.slice(0,4),+value.slice(5,7)-1,+value.slice(8,10));if(mode==='us'){viewYear=+value.slice(0,4);viewMonth=+value.slice(5,7)}else{let eth=toEth(selected);viewYear=eth.y;viewMonth=eth.m}render()};$('addEvent').onclick=()=>{$('eventDay').textContent=gregLabel(selected);$('eventName').value='';$('eventDialog').showModal()};$('cancelEvent').onclick=()=>$('eventDialog').close();$('eventForm').onsubmit=e=>{e.preventDefault();let value=$('eventName').value.trim();if(!value)return;let all=loadEvents(),key=iso(selected);(all[key]??=[]).push(value);saveEvents(all);$('eventDialog').close();renderEvents()};
render();if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
