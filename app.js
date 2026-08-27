const SCREENS = [
  {id:'R0', label:'Вход'},
  {id:'AT', label:'Атлас'},
  {id:'R1', label:'Как явлена'},
  {id:'R1m', label:'Промах R1'},
  {id:'R2', label:'Функция'},
  {id:'R3', label:'Имя'},
  {id:'R4', label:'Предсказ'},
  {id:'R4m', label:'Промах R4'},
  {id:'R5', label:'0 ↔ 6'},
  {id:'R6', label:'Мост'}
];
let cur = 'R0';
let pick = {yav:null, fn:null, name:null, pred:null};
function star(lit=0, twin=null){
  const cx=105,cy=105,r=78; let rays='';
  for(let i=0;i<12;i++){
    const a=(3*Math.PI/2)+i*(Math.PI/6);
    const x=cx+r*Math.cos(a), y=cy-r*Math.sin(a);
    const gold = i===lit || i===twin;
    rays += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${gold?'#D4A84B':'rgba(238,241,246,.16)'}" stroke-width="${gold?2.4:1}"/>`;
    rays += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${gold?4.5:2.2}" fill="${gold?'#D4A84B':'rgba(238,241,246,.22)'}"/>`;
  }
  return `<svg class="star" viewBox="0 0 210 210">${rays}<circle cx="105" cy="105" r="18" fill="#171B22" stroke="rgba(238,241,246,.12)"/></svg>`;
}
function shell(hdr, cap, dots, body){
  const d = [0,1,2,3].map(i=>`<i class="${i<dots?'on':''}"></i>`).join('');
  return `<header><button class="back" data-go="back">←</button><div class="hdr"><b>${hdr}</b><span>${cap}</span></div><div class="dots">${d}</div></header><main>${body}</main><nav class="tabs"><button>Главная</button><button class="on">Игра</button><button>Уроки</button><button>Профиль</button></nav>`;
}
function view(id){
  const go = (n)=>`data-go="${n}"`;
  if(id==='R0') return shell('Рифма','Полка 0 · practiced',0,`<p class="kicker">Та же функция</p>${star(0)}<p class="title">Вход / основа</p><p class="body">Ночь, ворота, грязь — одна полка.</p><div class="card" style="display:flex;gap:8px;justify-content:space-between;font-size:12px;color:var(--muted)"><span>Ночь</span><span>Прихожая</span><span>Ворота</span></div><button class="btn" ${go('R1')}>Собрать полку 0</button><button class="link" ${go('AT')}>Сначала одежды</button>`);
  if(id==='AT') return shell('Одежды 0','колонка',0,`<p class="title">Как выглядит вход</p>${['Сутки · Ночь','Дом · Прихожая','Двор · Ворота','Год · Зима'].map(t=>`<div class="card" style="margin-top:8px;padding:12px;font-size:13px">${t}</div>`).join('')}<button class="btn" ${go('R1')}>Искать во дворе</button>`);
  if(id==='R1') return shell('Как явлена','Такт 1 / 4',1,`<p class="title">Как во дворе явлена ночь?</p>${star(0)}<button class="choice" data-act="yav-kal">Калитка</button><button class="choice" data-act="yav-vor">Ворота</button><button class="choice" data-act="yav-kuz">Кузня</button>`);
  if(id==='R1m') return shell('Как явлена','такт 1',1,`<p class="title">Как во дворе явлена ночь?</p>${star(0)}<button class="choice bad">Кузня</button><p class="err">Это уже бой утра — не вход.</p><button class="btn" ${go('R1')}>Ещё раз</button>`);
  if(id==='R2') return shell('Функция','Такт 2 / 4',2,`<p class="title">Из-за чего одно место?</p><div class="tri"><div class="cell"><div class="n">Сутки</div><div class="t">Ночь</div></div><div class="arr">—</div><div class="cell mid"><div class="t">?</div></div><div class="arr">—</div><div class="cell"><div class="n">Двор</div><div class="t">Ворота</div></div></div><button class="choice" data-act="fn-in">Вход / основа</button><button class="choice" data-act="fn-ev">Главное событие</button>`);
  if(id==='R3') return shell('Имя','Такт 3 / 4',3,`<p class="title">Почему ворота, не калитка?</p><button class="choice" data-act="nm-ok">Порог и закрытость начала</button><button class="choice" data-act="nm-bad">Потому что железные</button>${pick.name==='ok'?'<p class="okline">Дальше закон угадывает воду.</p><button class="btn" data-go="R4">Проверить в воде</button>':''}`);
  if(id==='R4') return shell('Предсказание','Такт 4 / 4',4,`<p class="kicker" style="color:var(--gold)">вход / основа</p><p class="title">Как это явлено в воде?</p>${star(0)}<button class="choice" data-act="pr-par">Пар</button><button class="choice" data-act="pr-gr">Грязь</button><button class="choice" data-act="pr-do">Дождь</button>`);
  if(id==='R4m') return shell('Предсказание','такт 4',4,`<p class="title">Как это явлено в воде?</p>${star(0)}<button class="choice bad">Пар</button><p class="err">Рифмуешь вещество, не функцию.</p><button class="btn" ${go('R4')}>Вернуть закон</button>`);
  if(id==='R5') return shell('Граница','0 ↔ 6',4,`<p class="title">Почему не день?</p>${star(0,6)}<button class="btn" ${go('R6')}>Мост собран</button>`);
  if(id==='R6') return shell('Полка 0','Мост',4,`<p class="title">Полка 0 собрана</p><div class="card bridge"><span>Ночь</span><span><em>вход / основа</em></span><span>Ворота</span><span>Грязь</span></div><button class="btn" ${go('R5')}>К 0 ↔ 6</button>`);
  return '';
}
function legend(id){return ({R0:'вход',AT:'атлас',R1:'явлена',R1m:'промах',R2:'функция',R3:'имя',R4:'вода',R4m:'пар',R5:'0-6',R6:'мост'})[id]||'';}
let mode='board';
function render(){
  document.getElementById('mBoard').classList.toggle('on', mode==='board');
  document.getElementById('mOne').classList.toggle('on', mode==='one');
  document.getElementById('nav').hidden = mode!=='one';
  document.getElementById('stage').hidden = mode!=='one';
  document.getElementById('board').style.display = mode==='board' ? 'grid' : 'none';
  if(mode==='board'){
    document.getElementById('board').innerHTML = SCREENS.map(s=>`<div class="shot"><div class="phone">${view(s.id)}</div><div class="cap">${s.label}</div></div>`).join('');
    return;
  }
  document.getElementById('nav').innerHTML = SCREENS.map(s=>`<button class="chip ${s.id===cur?'on':''}" data-go="${s.id}">${s.label}</button>`).join('');
  document.getElementById('phone').innerHTML = view(cur);
  document.getElementById('legend').textContent = legend(cur);
}
document.getElementById('mBoard').onclick=()=>{mode='board';render()};
document.getElementById('mOne').onclick=()=>{mode='one';render()};
document.body.addEventListener('click', e=>{
  const go = e.target.closest('[data-go]');
  const act = e.target.closest('[data-act]');
  if(go){ const n=go.getAttribute('data-go'); if(n==='back'){const i=SCREENS.findIndex(s=>s.id===cur); cur=SCREENS[Math.max(0,i-1)].id;} else cur=n; render(); }
  if(act){
    const a=act.getAttribute('data-act');
    if(a==='yav-vor'){cur='R2';}
    else if(a==='yav-kal'||a==='yav-kuz'){cur='R1m';}
    else if(a==='fn-in'){cur='R3';}
    else if(a==='nm-ok'){pick.name='ok';}
    else if(a==='pr-gr'){cur='R6';}
    else if(a==='pr-par'||a==='pr-do'){cur='R4m';}
    render();
  }
});
render();
