const API = 'http://localhost:3000/api';

// ══════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════
const FOODS=[
  {name:'Oatmeal',cal:150,protein:5,carbs:27,fats:3},
  {name:'Scrambled Eggs',cal:140,protein:13,carbs:1,fats:10},
  {name:'Banana',cal:89,protein:1,carbs:23,fats:0},
  {name:'Grilled Chicken',cal:165,protein:31,carbs:0,fats:4},
  {name:'Brown Rice',cal:216,protein:5,carbs:45,fats:2},
  {name:'Salad',cal:80,protein:2,carbs:10,fats:4},
  {name:'Salmon',cal:208,protein:20,carbs:0,fats:13},
  {name:'Sweet Potato',cal:103,protein:2,carbs:24,fats:0},
  {name:'Greek Yogurt',cal:100,protein:17,carbs:6,fats:1},
  {name:'Almonds',cal:164,protein:6,carbs:6,fats:14},
  {name:'Apple',cal:95,protein:0,carbs:25,fats:0},
  {name:'Whole Wheat Bread',cal:69,protein:4,carbs:12,fats:1},
  {name:'Milk (1 cup)',cal:149,protein:8,carbs:12,fats:8},
  {name:'Pasta',cal:220,protein:8,carbs:43,fats:1},
  {name:'Pizza Slice',cal:285,protein:12,carbs:36,fats:10},
];
const PMULT={small:.6,medium:1,large:1.5};
const MEALS={
  breakfast:{name:'Breakfast',icon:'🌅',items:[]},
  lunch:{name:'Lunch',icon:'☀️',items:[]},
  dinner:{name:'Dinner',icon:'🌙',items:[]},
  snacks:{name:'Snacks',icon:'🍪',items:[]},
};
const EXERCISE_DB=[
  {name:'Running',type:'cardio',met:9.8,icon:'💙'},
  {name:'Cycling',type:'cardio',met:7.5,icon:'🚴'},
  {name:'Swimming',type:'cardio',met:8.0,icon:'🏊'},
  {name:'Jump Rope',type:'cardio',met:12.3,icon:'🪢'},
  {name:'Walking',type:'cardio',met:3.8,icon:'🚶'},
  {name:'Weight Lifting',type:'strength',met:5.0,icon:'🏋️'},
  {name:'Push-ups',type:'strength',met:3.8,icon:'💪'},
  {name:'Pull-ups',type:'strength',met:4.5,icon:'🔝'},
  {name:'Deadlift',type:'strength',met:6.0,icon:'🏋️'},
  {name:'Squats',type:'strength',met:5.0,icon:'🦵'},
  {name:'HIIT Workout',type:'hiit',met:10.0,icon:'⚡'},
  {name:'Tabata',type:'hiit',met:13.5,icon:'⚡'},
  {name:'Burpees',type:'hiit',met:10.0,icon:'🔥'},
  {name:'Yoga',type:'yoga',met:2.5,icon:'🧘'},
  {name:'Stretching',type:'flexibility',met:2.3,icon:'🤸'},
  {name:'Football',type:'sports',met:8.0,icon:'⚽'},
  {name:'Basketball',type:'sports',met:8.0,icon:'🏀'},
  {name:'Tennis',type:'sports',met:7.3,icon:'🎾'},
  {name:'Boxing',type:'hiit',met:9.5,icon:'🥊'},
];
const IMULT={low:.7,medium:1,high:1.35};
const TYPE_BADGE={cardio:'type-cardio',strength:'type-strength',hiit:'type-hiit',flexibility:'type-flexibility',sports:'type-sports',yoga:'type-yoga'};
const TYPE_MET={cardio:7.5,strength:5,hiit:10,flexibility:2.5,sports:7.5,yoga:2.8};

let exercises=[];
let currentMeal=null,selectedFood=null,selectedEx=null,currentIntensity='medium';
let currentUser=null;
let waterCount=0,stepsCount=0;

// ══════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════
function showErr(id,msg){const el=document.getElementById(id);el.textContent=msg;el.style.display='block';}
function hideErr(id){document.getElementById(id).style.display='none';}
function markErr(el){el.style.borderColor='var(--red)';setTimeout(()=>el.style.borderColor='',2000);}
function showLoading(id){document.getElementById(id).style.display='block';}
function hideLoading(id){document.getElementById(id).style.display='none';}
function setBtnLoading(btnId,loading,text=''){
  const btn=document.getElementById(btnId);
  btn.disabled=loading;
  if(text)btn.textContent=loading?'⏳ Please wait...':text;
}

// ══════════════════════════════════════════════════
// AUTH — SIGNUP (connected to backend)
// ══════════════════════════════════════════════════
async function doSignup(){
  hideErr('su-err');
  hideLoading('su-loading');

  const name  = document.getElementById('su-name').value.trim();
  const email = document.getElementById('su-email').value.trim();
  const pass  = document.getElementById('su-pass').value;
  const pass2 = document.getElementById('su-pass2').value;
  const terms = document.getElementById('su-terms').checked;

  // Client-side validation first
  if(!name){markErr(document.getElementById('su-name'));showErr('su-err','Please enter your full name.');return;}
  if(!email||!email.includes('@')){markErr(document.getElementById('su-email'));showErr('su-err','Please enter a valid email address.');return;}
  if(pass.length<6){markErr(document.getElementById('su-pass'));showErr('su-err','Password must be at least 6 characters.');return;}
  if(pass!==pass2){markErr(document.getElementById('su-pass2'));showErr('su-err','Passwords do not match.');return;}
  if(!terms){showErr('su-err','Please agree to the Terms of Service.');return;}

  // Show loading state
  setBtnLoading('su-btn',true,'Create Account');
  showLoading('su-loading');

  try {
    const res  = await fetch(`${API}/auth/signup`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name,email,password:pass})
    });
    const data = await res.json();

    if(!res.ok){
      hideLoading('su-loading');
      setBtnLoading('su-btn',false,'Create Account');
      showErr('su-err', data.error || 'Signup failed. Please try again.');
      return;
    }

    // Success — store user and go to app
    currentUser = data; // { userId, name, email }
    goToApp();

  } catch(e){
    hideLoading('su-loading');
    setBtnLoading('su-btn',false,'Create Account');
    showErr('su-err','⚠️ Cannot connect to server. Make sure it is running:\n npm run dev');
  }
}

// ══════════════════════════════════════════════════
// AUTH — SIGNIN (connected to backend)
// ══════════════════════════════════════════════════
async function doSignin(){
  hideErr('si-err');
  hideLoading('si-loading');

  const email = document.getElementById('si-email').value.trim();
  const pass  = document.getElementById('si-pass').value;

  // Client-side validation first
  if(!email){markErr(document.getElementById('si-email'));showErr('si-err','Please enter your email address.');return;}
  if(!pass){markErr(document.getElementById('si-pass'));showErr('si-err','Please enter your password.');return;}

  // Show loading state
  setBtnLoading('si-btn',true,'Sign In');
  showLoading('si-loading');

  try {
    const res  = await fetch(`${API}/auth/signin`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email,password:pass})
    });
    const data = await res.json();

    if(!res.ok){
      hideLoading('si-loading');
      setBtnLoading('si-btn',false,'Sign In');
      showErr('si-err', data.error || 'Sign in failed. Please try again.');
      return;
    }

    // Success — store user and go to app
    currentUser = data; // { userId, name, email }
    goToApp();

  } catch(e){
    hideLoading('si-loading');
    setBtnLoading('si-btn',false,'Sign In');
    showErr('si-err','⚠️ Cannot connect to server. Make sure it is running:\n npm run dev');
  }
}

// ══════════════════════════════════════════════════
// SOCIAL AUTH (demo only — no backend)
// ══════════════════════════════════════════════════
function doSocialAuth(){
  const name=prompt('Enter your display name for social login:','User');
  if(!name)return;
  currentUser={userId:null,name,email:'social_'+Date.now()+'@fittrack.app'};
  goToApp();
}

// ══════════════════════════════════════════════════
// AUTH TAB TOGGLE
// ══════════════════════════════════════════════════
function authTab(t){
  document.querySelectorAll('.tab-btn').forEach((b,i)=>b.classList.toggle('active',i===(t==='signup'?0:1)));
  document.getElementById('authSignup').classList.toggle('active',t==='signup');
  document.getElementById('authSignin').classList.toggle('active',t==='signin');
  document.getElementById('authHeroSignup').style.display=t==='signup'?'':'none';
  document.getElementById('authHeroSignin').style.display=t==='signin'?'':'none';
  // Reset errors and buttons when switching tabs
  hideErr('su-err');hideErr('si-err');
  hideLoading('su-loading');hideLoading('si-loading');
  setBtnLoading('su-btn',false,'Create Account');
  setBtnLoading('si-btn',false,'Sign In');
}

// ══════════════════════════════════════════════════
// GO TO APP / LOGOUT
// ══════════════════════════════════════════════════
function goToApp(){
  waterCount=0;stepsCount=0;
  Object.keys(MEALS).forEach(k=>MEALS[k].items=[]);
  exercises=[];
  document.getElementById('view-auth').classList.remove('active');
  document.getElementById('view-app').classList.add('active');
  navigate('dashboard');
  renderAllMeals();
  renderExTable(exercises);
  updateExStats();
  updateWaterUI();
  updateStepsUI();
  initProgressCharts();
  loadProfileFromUser();
  document.getElementById('streakVal').textContent=1;
}

function logout(){
  currentUser=null;
  document.getElementById('view-app').classList.remove('active');
  document.getElementById('view-auth').classList.add('active');
  ['si-email','si-pass'].forEach(id=>document.getElementById(id).value='');
  hideErr('si-err');hideErr('su-err');
  hideLoading('su-loading');hideLoading('si-loading');
  setBtnLoading('su-btn',false,'Create Account');
  setBtnLoading('si-btn',false,'Sign In');
  authTab('signin');
}

function navigate(page){
  document.querySelectorAll('#view-app main .view').forEach(v=>v.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  const nb=document.getElementById('nav-'+page);
  if(nb)nb.classList.add('active');
  if(page==='progress')updateProgressPage();
  if(page==='diet')syncDietProfile();
  window.scrollTo(0,0);
}

function syncDietProfile(){
  if(!currentUser) return;
  const dw = document.getElementById('diet-weight');
  const dh = document.getElementById('diet-height');
  const da = document.getElementById('diet-age');
  const dg = document.getElementById('diet-gender');
  
  if(dw && currentUser.weight) dw.value = currentUser.weight;
  if(dh && currentUser.height) dh.value = currentUser.height;
  // age is not explicitly in current site profile but we can try to guess or use default
  // gender as well.
}

// ══════════════════════════════════════════════════
// WATER & STEPS
// ══════════════════════════════════════════════════
function adjWater(d){waterCount=Math.max(0,Math.min(20,waterCount+d));updateWaterUI();}
function updateWaterUI(){
  document.getElementById('waterVal').textContent=waterCount;
  document.getElementById('waterBar').style.width=Math.min(100,(waterCount/8)*100)+'%';
  let g='';for(let i=0;i<8;i++)g+=`<span style="font-size:13px;opacity:${i<waterCount?1:.2}">💧</span>`;
  document.getElementById('waterGlasses').innerHTML=g;
}
function adjSteps(d){stepsCount=Math.max(0,Math.min(30000,stepsCount+d));updateStepsUI();}
function updateStepsUI(){
  const stepsValEl = document.getElementById('stepsVal');
  if(stepsValEl) stepsValEl.textContent=stepsCount.toLocaleString();
  
  const stepsBarEl = document.getElementById('stepsBar');
  if(stepsBarEl) stepsBarEl.style.width=Math.min(100,(stepsCount/10000)*100)+'%';
  
  const stepsPctEl = document.getElementById('stepsPct');
  if(stepsPctEl) stepsPctEl.textContent=Math.round(Math.min(100,(stepsCount/10000)*100))+'% of daily goal';
  
  updateEcoImpact();
}

// ── ECO IMPACT LOGIC ──
function updateEcoImpact(){
  // Carbon Calculations
  // 1000 steps ≈ 0.15kg CO2 saved (vs driving)
  const carbonFromSteps = stepsCount * 0.00015;
  
  // Kinetic Currency (Watts)
  // Conversion: 100 Calories Burned ≈ 10 "Virtual Watts"
  const burned = exercises.reduce((s,e)=>s+e.calories,0);
  const kineticWatts = Math.round(burned * 0.1);
  
  // Update UI Elements
  const ecoCarbonEl = document.getElementById('ecoCarbon');
  const ecoTotalCarbonEl = document.getElementById('ecoTotalCarbon');
  const ecoWattsEl = document.getElementById('ecoWatts');
  
  if(ecoCarbonEl) ecoCarbonEl.textContent = carbonFromSteps.toFixed(2);
  if(ecoTotalCarbonEl) ecoTotalCarbonEl.textContent = carbonFromSteps.toFixed(2);
  if(ecoWattsEl) ecoWattsEl.textContent = kineticWatts;
  
  const equivKm = carbonFromSteps / 0.19;
  const ecoEquivKmEl = document.getElementById('ecoEquivKm');
  if(ecoEquivKmEl) ecoEquivKmEl.textContent = equivKm.toFixed(1);
  
  // Tree Progress (Every 500 Watts = 1 Tree)
  const trees = Math.floor(kineticWatts / 500);
  const progressWatts = kineticWatts % 500;
  const treePct = (progressWatts / 500) * 100;
  
  const treeBarEl = document.getElementById('treeBar');
  const treeWattsEl = document.getElementById('treeWatts');
  const treesPlantedEl = document.getElementById('treesPlanted');
  
  if(treeBarEl) treeBarEl.style.width = treePct + '%';
  if(treeWattsEl) treeWattsEl.textContent = `${progressWatts} / 500 Watts`;
  if(treesPlantedEl) treesPlantedEl.textContent = `${trees} Trees Planted`;
}

// ══════════════════════════════════════════════════
// PROFILE
// ══════════════════════════════════════════════════
function loadProfileFromUser(){
  if(!currentUser)return;
  document.getElementById('profileDispName').textContent=currentUser.name||'—';
  document.getElementById('profileDispEmail').textContent=currentUser.email||'—';
  const initials=(currentUser.name||'U').split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
  const av=document.getElementById('profileAvatar');
  av.style.fontSize='28px';av.style.fontFamily="'Plus Jakarta Sans',sans-serif";av.style.fontWeight='800';
  av.textContent=initials;
  document.getElementById('pf-name').value=currentUser.name||'';
  document.getElementById('pf-email').value=currentUser.email||'';
  if(currentUser.weight)document.getElementById('pf-weight').value=currentUser.weight;
  if(currentUser.height)document.getElementById('pf-height').value=currentUser.height;
}
function saveProfile(){
  const name=document.getElementById('pf-name').value.trim();
  const email=document.getElementById('pf-email').value.trim();
  const weight=document.getElementById('pf-weight').value;
  const height=document.getElementById('pf-height').value;
  if(name)currentUser.name=name;
  if(email)currentUser.email=email;
  if(weight)currentUser.weight=parseFloat(weight);
  if(height)currentUser.height=parseFloat(height);
  loadProfileFromUser();
  if(currentUser.weight&&currentUser.height){
    document.getElementById('bmiWeight').value=currentUser.weight;
    document.getElementById('bmiHeight').value=currentUser.height;
    calcBMI();
  }
  updateProgressPage();
  const btn=document.querySelector('.profile-save');
  const orig=btn.textContent;btn.textContent='✓ Saved!';btn.style.background='var(--green-dark)';
  setTimeout(()=>{btn.textContent=orig;btn.style.background='';},1800);
}

// ══════════════════════════════════════════════════
// PROGRESS PAGE
// ══════════════════════════════════════════════════
let weightChartObj=null,calChartObj=null,macroChartObj=null;
function updateProgressPage(){
  const totalCal=Object.values(MEALS).reduce((s,m)=>s+m.items.reduce((ss,it)=>ss+Math.round(it.cal*(PMULT[it.portion||'medium'])),0),0);
  const totalBurned=exercises.reduce((s,e)=>s+e.calories,0);
  const totalMin=exercises.reduce((s,e)=>s+e.duration,0);
  const exCount=exercises.length;
  document.getElementById('pg-avg-cal').textContent=totalCal>0?totalCal+' kcal':'—';
  document.getElementById('pg-burned').textContent=totalBurned>0?totalBurned+' kcal':'—';
  document.getElementById('pg-ex-count').textContent=exCount>0?exCount:'—';
  document.getElementById('pg-weight').textContent=(currentUser&&currentUser.weight)?currentUser.weight+' kg':'—';
  document.getElementById('pg-total-cal').textContent=totalCal+' kcal';
  document.getElementById('pg-total-burned').textContent=totalBurned+' kcal';
  document.getElementById('pg-total-min').textContent=totalMin+' min';
  document.getElementById('pg-total-steps').textContent=stepsCount.toLocaleString()+' steps';
  document.getElementById('pg-total-water').textContent=waterCount+' glasses';
  const hasWeight=currentUser&&currentUser.weight&&currentUser.height;
  document.getElementById('weightChartWrap').style.display=hasWeight?'block':'none';
  document.getElementById('weightChartEmpty').style.display=hasWeight?'none':'block';
  if(hasWeight){
    const w=currentUser.weight;
    const wData=[+(w+1.5).toFixed(1),+(w+1.1).toFixed(1),+(w+0.7).toFixed(1),+(w+0.4).toFixed(1),+(w+0.1).toFixed(1),+w.toFixed(1)];
    if(!weightChartObj){
      weightChartObj=new Chart(document.getElementById('weightChart'),{type:'line',data:{labels:['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6'],datasets:[{label:'weight (kg)',data:wData,borderColor:'#1db954',backgroundColor:'rgba(29,185,84,.08)',pointBackgroundColor:'#1db954',pointRadius:5,tension:.3,fill:true}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{color:'#6b7280',font:{family:'DM Sans',size:13}}}},scales:{y:{grid:{color:'rgba(0,0,0,.05)'},ticks:{color:'#9ca3af'}},x:{grid:{color:'rgba(0,0,0,.05)'},ticks:{color:'#9ca3af'}}}}});
    }else{weightChartObj.data.datasets[0].data=wData;weightChartObj.update();}
  }
  const hasCal=totalCal>0;
  document.getElementById('calChartWrap').style.display=hasCal?'block':'none';
  document.getElementById('calChartEmpty').style.display=hasCal?'none':'block';
  if(hasCal){
    const today=new Date().toLocaleDateString('en-US',{weekday:'short'});
    const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const calData=days.map(d=>d===today?totalCal:0);
    if(!calChartObj){
      calChartObj=new Chart(document.getElementById('calChart'),{type:'bar',data:{labels:days,datasets:[{label:'calories',data:calData,backgroundColor:days.map(d=>d===today?'#3b82f6':'#bfdbfe'),borderRadius:6}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{color:'#6b7280',font:{family:'DM Sans',size:13}}}},scales:{y:{grid:{color:'rgba(0,0,0,.05)'},ticks:{color:'#9ca3af'}},x:{grid:{display:false},ticks:{color:'#9ca3af'}}}}});
    }else{calChartObj.data.datasets[0].data=calData;calChartObj.data.datasets[0].backgroundColor=days.map(d=>d===today?'#3b82f6':'#bfdbfe');calChartObj.update();}
  }
  document.getElementById('macroSummaryWrap').style.display=hasCal?'block':'none';
  document.getElementById('macroSummaryEmpty').style.display=hasCal?'none':'block';
  if(hasCal){
    let totalP=0,totalC=0,totalF=0;
    Object.values(MEALS).forEach(m=>m.items.forEach(it=>{const mv=PMULT[it.portion||'medium'];totalP+=Math.round(it.protein*mv);totalC+=Math.round(it.carbs*mv);totalF+=Math.round(it.fats*mv)}));
    const sum=totalP+totalC+totalF||1;
    const pPct=Math.round(totalP/sum*100),cPct=Math.round(totalC/sum*100),fPct=100-pPct-cPct;
    if(!macroChartObj){
      macroChartObj=new Chart(document.getElementById('macroChart'),{type:'pie',data:{labels:[`Carbs: ${cPct}%`,`Protein: ${pPct}%`,`Fats: ${fPct}%`],datasets:[{data:[cPct,pPct,fPct],backgroundColor:['#3b82f6','#1db954','#f59e0b'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:'#374151',font:{family:'DM Sans',size:13}}}}}});
    }else{macroChartObj.data.labels=[`Carbs: ${cPct}%`,`Protein: ${pPct}%`,`Fats: ${fPct}%`];macroChartObj.data.datasets[0].data=[cPct,pPct,fPct];macroChartObj.update();}
  }
}

// ══════════════════════════════════════════════════
// DATE
// ══════════════════════════════════════════════════
const now=new Date();
document.getElementById('todayDate').textContent=now.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});

// ══════════════════════════════════════════════════
// FOOD DIARY
// ══════════════════════════════════════════════════
function getMealCals(k){return MEALS[k].items.reduce((s,i)=>s+Math.round(i.cal*PMULT[i.portion||'medium']),0)}
function renderMeal(k){
  const m=MEALS[k],el=document.getElementById('meal-'+k);
  const cal=getMealCals(k);
  let body='';
  if(!m.items.length){body=`<div class="empty-meal">No food items added yet</div>`}
  else{body=`<table class="food-table"><tr><th>Food</th><th>Portion</th><th>Calories</th><th>Protein (g)</th><th>Carbs (g)</th><th>Fats (g)</th><th>Action</th></tr>${m.items.map((it,i)=>{const mv=PMULT[it.portion||'medium'];return`<tr><td>${it.name}</td><td><span class="portion-badge portion-${it.portion||'medium'}">${it.portion||'medium'}</span></td><td>${Math.round(it.cal*mv)}</td><td>${Math.round(it.protein*mv)}</td><td>${Math.round(it.carbs*mv)}</td><td>${Math.round(it.fats*mv)}</td><td><button class="btn-delete" onclick="delFood('${k}',${i})">🗑️</button></td></tr>`}).join('')}</table>`;}
  el.className='meal-card-d';
  el.innerHTML=`<div class="meal-header"><div class="meal-info"><span class="meal-icon">${m.icon}</span><div><div class="meal-name">${m.name}</div><div class="meal-cal">${cal} calories</div></div></div><button class="btn-add-food" onclick="openFoodModal('${k}')">＋ Add Food</button></div>${body}`;
}
function renderAllMeals(){Object.keys(MEALS).forEach(renderMeal);updateDashboard();updateProgressPage();}
function delFood(k,i){MEALS[k].items.splice(i,1);renderAllMeals();}
function updateDashboard(){
  let c=0,p=0,ca=0,f=0;
  Object.values(MEALS).forEach(m=>m.items.forEach(it=>{const mv=PMULT[it.portion||'medium'];c+=Math.round(it.cal*mv);p+=Math.round(it.protein*mv);ca+=Math.round(it.carbs*mv);f+=Math.round(it.fats*mv)}));
  const burned=exercises.reduce((s,e)=>s+e.calories,0);
  document.getElementById('db-consumed').textContent=c;
  document.getElementById('db-burned').textContent=burned;
  document.getElementById('db-remaining').textContent=Math.max(0,2000-c);
  document.getElementById('calProgress').style.width=Math.min(100,(c/2000)*100)+'%';
  document.getElementById('db-protein').textContent=p;
  document.getElementById('db-carbs').textContent=ca;
  document.getElementById('db-fats').textContent=f;
  document.getElementById('protein-circle').style.strokeDashoffset=251.2*(1-Math.min(1,p/150));
  document.getElementById('carbs-circle').style.strokeDashoffset=251.2*(1-Math.min(1,ca/250));
  document.getElementById('fats-circle').style.strokeDashoffset=251.2*(1-Math.min(1,f/65));
}
function openFoodModal(k){
  currentMeal=k;selectedFood=null;
  document.getElementById('foodModalTitle').textContent='Add Food to '+MEALS[k].name;
  document.getElementById('foodInput').value='';
  document.getElementById('portionSelect').value='medium';
  document.getElementById('suggestionsList').classList.remove('open');
  ['prev-cal','prev-protein','prev-carbs','prev-fats'].forEach(id=>document.getElementById(id).textContent='—');
  document.getElementById('foodModal').classList.add('open');
  setTimeout(()=>document.getElementById('foodInput').focus(),100);
}
function closeFoodModal(){document.getElementById('foodModal').classList.remove('open');}
document.getElementById('foodModal').addEventListener('click',e=>{if(e.target===document.getElementById('foodModal'))closeFoodModal();});
function handleFoodInput(v){
  const list=document.getElementById('suggestionsList');
  if(!v){list.classList.remove('open');return;}
  const m=FOODS.filter(f=>f.name.toLowerCase().includes(v.toLowerCase())).slice(0,6);
  if(!m.length){list.classList.remove('open');return;}
  list.innerHTML=m.map(f=>`<div class="suggestion-item" onclick="pickFood('${f.name}')"><span>${f.name}</span><span class="suggestion-cal">${f.cal} cal</span></div>`).join('');
  list.classList.add('open');
}
function pickFood(name){
  selectedFood=FOODS.find(f=>f.name===name);
  document.getElementById('foodInput').value=name;
  document.getElementById('suggestionsList').classList.remove('open');
  updateNutritionPreview();
}
function updateNutritionPreview(){
  if(!selectedFood)return;
  const m=PMULT[document.getElementById('portionSelect').value];
  document.getElementById('prev-cal').textContent=Math.round(selectedFood.cal*m);
  document.getElementById('prev-protein').textContent=Math.round(selectedFood.protein*m)+'g';
  document.getElementById('prev-carbs').textContent=Math.round(selectedFood.carbs*m)+'g';
  document.getElementById('prev-fats').textContent=Math.round(selectedFood.fats*m)+'g';
}
function confirmAddFood(){
  if(!selectedFood){document.getElementById('foodInput').style.borderColor='var(--red)';setTimeout(()=>document.getElementById('foodInput').style.borderColor='',1500);return;}
  MEALS[currentMeal].items.push({...selectedFood,portion:document.getElementById('portionSelect').value});
  closeFoodModal();renderAllMeals();
}

// ══════════════════════════════════════════════════
// EXERCISE
// ══════════════════════════════════════════════════
function calcCal(met,dur,intensity){return Math.round(met*70*(dur/60)*(IMULT[intensity]||1)*1.05);}
function renderExTable(list){
  const w=document.getElementById('exerciseTableWrap');
  if(!list.length){w.innerHTML=`<div class="empty-exercises">No exercises logged. Click <strong>Add Exercise</strong> to start!</div>`;return;}
  w.innerHTML=`<table class="exercise-table"><thead><tr><th>Exercise</th><th>Type</th><th style="text-align:center">Duration (min)</th><th style="text-align:right;padding-right:40px">Calories Burned</th><th>Action</th></tr></thead><tbody>${list.map((e,i)=>`<tr><td><div class="exercise-name-cell"><span>${e.icon}</span>${e.name}</div></td><td><span class="type-badge ${TYPE_BADGE[e.type]||''}">${e.type}</span></td><td style="text-align:center">${e.duration}</td><td style="text-align:right;padding-right:40px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;color:var(--blue)">${e.calories}</td><td style="text-align:center"><button class="btn-delete" onclick="delEx(${i})">🗑️</button></td></tr>`).join('')}</tbody></table>`;
}
function updateExStats(){
  document.getElementById('ex-stat-cal').textContent=exercises.reduce((s,e)=>s+e.calories,0);
  document.getElementById('ex-stat-dur').textContent=exercises.reduce((s,e)=>s+e.duration,0);
  document.getElementById('ex-stat-count').textContent=exercises.length;
  updateDashboard();updateProgressPage();updateEcoImpact();
}
function delEx(i){exercises.splice(i,1);renderExTable(exercises);updateExStats();}
function filterExTable(v){renderExTable(v?exercises.filter(e=>e.name.toLowerCase().includes(v.toLowerCase())||e.type.toLowerCase().includes(v.toLowerCase())):exercises);}
function openExModal(){
  selectedEx=null;currentIntensity='medium';
  document.getElementById('exNameInput').value='';
  document.getElementById('exType').value='cardio';
  document.getElementById('exDuration').value='';
  document.getElementById('exCalVal').textContent='—';
  document.getElementById('exCalNote').textContent='Fill in duration to calculate';
  document.getElementById('exSuggestions').classList.remove('open');
  document.querySelectorAll('.intensity-btn').forEach((b,i)=>b.classList.toggle('active',i===1));
  document.getElementById('exerciseModal').classList.add('open');
  setTimeout(()=>document.getElementById('exNameInput').focus(),100);
}
function closeExModal(){document.getElementById('exerciseModal').classList.remove('open');}
document.getElementById('exerciseModal').addEventListener('click',e=>{if(e.target===document.getElementById('exerciseModal'))closeExModal();});
function handleExInput(v){
  const list=document.getElementById('exSuggestions');
  const exact=EXERCISE_DB.find(e=>e.name.toLowerCase()===v.toLowerCase());
  if(exact){selectedEx=exact;document.getElementById('exType').value=exact.type;}else selectedEx=null;
  if(!v){list.classList.remove('open');exRecalc();return;}
  const m=EXERCISE_DB.filter(e=>e.name.toLowerCase().includes(v.toLowerCase())).slice(0,7);
  if(!m.length){list.classList.remove('open');exRecalc();return;}
  list.innerHTML=m.map(e=>`<div class="suggestion-item" onclick="pickEx('${e.name}')"><span>${e.icon} ${e.name}</span><span class="suggestion-cal">${e.type}</span></div>`).join('');
  list.classList.add('open');exRecalc();
}
function pickEx(name){
  selectedEx=EXERCISE_DB.find(e=>e.name===name);
  document.getElementById('exNameInput').value=name;
  document.getElementById('exType').value=selectedEx.type;
  document.getElementById('exSuggestions').classList.remove('open');
  exRecalc();
}
function setIntensity(level,btn){
  currentIntensity=level;
  document.querySelectorAll('.intensity-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');exRecalc();
}
function exRecalc(){
  const dur=parseInt(document.getElementById('exDuration').value)||0;
  if(!dur){document.getElementById('exCalVal').textContent='—';document.getElementById('exCalNote').textContent='Fill in duration to calculate';return;}
  const met=selectedEx?selectedEx.met:(TYPE_MET[document.getElementById('exType').value]||6);
  const cal=calcCal(met,dur,currentIntensity);
  const v=document.getElementById('exCalVal');
  v.classList.remove('cal-animate');void v.offsetWidth;v.classList.add('cal-animate');
  v.textContent=cal;
  document.getElementById('exCalNote').textContent=`≈ ${Math.round(cal/dur)} kcal/min · ${currentIntensity} intensity`;
}
function confirmAddEx(){
  const name=document.getElementById('exNameInput').value.trim();
  const dur=parseInt(document.getElementById('exDuration').value)||0;
  const type=document.getElementById('exType').value;
  if(!name){document.getElementById('exNameInput').classList.add('error');setTimeout(()=>document.getElementById('exNameInput').classList.remove('error'),1500);return;}
  if(!dur){document.getElementById('exDuration').classList.add('error');setTimeout(()=>document.getElementById('exDuration').classList.remove('error'),1500);return;}
  const met=selectedEx?selectedEx.met:(TYPE_MET[type]||6);
  const calories=calcCal(met,dur,currentIntensity);
  exercises.push({name,type,duration:dur,calories,icon:selectedEx?selectedEx.icon:'🏃',intensity:currentIntensity});
  closeExModal();renderExTable(exercises);updateExStats();
}

// ══════════════════════════════════════════════════
// BMI CALCULATOR
// ══════════════════════════════════════════════════
function calcBMI(){
  const w=parseFloat(document.getElementById('bmiWeight').value);
  const h=parseFloat(document.getElementById('bmiHeight').value);
  const res=document.getElementById('bmiResult');
  const ph=document.getElementById('bmiPlaceholder');
  if(!w||!h||w<=0||h<=0){res.style.display='none';ph.style.display='block';return;}
  const bmi=w/((h/100)*(h/100));
  const bmiRounded=Math.round(bmi*10)/10;
  document.getElementById('bmiNumber').textContent=bmiRounded;
  let cat,cls,markerPct;
  if(bmi<18.5){cat='Underweight';cls='bmi-underweight';markerPct=Math.min(22,(bmi/18.5)*22);}
  else if(bmi<25){cat='Normal';cls='bmi-normal';markerPct=22+((bmi-18.5)/(25-18.5))*26;}
  else if(bmi<30){cat='Overweight';cls='bmi-overweight';markerPct=48+((bmi-25)/5)*26;}
  else{cat='Obese';cls='bmi-obese';markerPct=Math.min(96,74+((bmi-30)/10)*22);}
  const badge=document.getElementById('bmiCategory');
  badge.textContent=cat;badge.className='bmi-category-badge '+cls;
  const numEl=document.getElementById('bmiNumber');
  if(cls==='bmi-normal')numEl.style.color='var(--green)';
  else if(cls==='bmi-underweight')numEl.style.color='var(--blue)';
  else if(cls==='bmi-overweight')numEl.style.color='var(--yellow)';
  else numEl.style.color='var(--red)';
  document.getElementById('bmiMarker').style.left=markerPct+'%';
  res.style.display='flex';ph.style.display='none';
}

// ══════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════
function initProgressCharts(){updateProgressPage();}
renderAllMeals();
renderExTable(exercises);
updateExStats();
























