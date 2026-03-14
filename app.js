// ==================== LANDING ====================
window.addEventListener('scroll',()=>document.getElementById('navbar').classList.toggle('scrolled',scrollY>40));
function smoothTo(id){document.getElementById(id).scrollIntoView({behavior:'smooth'});}
function showContactToast(){toast('📧 Contact us at sales@coreinventory.in');}
function launchApp(){
  document.getElementById('landing').classList.add('hidden');
  document.getElementById('app-shell').classList.add('visible');
  document.body.style.overflow='hidden';
  initGmailLogin();
}
function backToLanding(){
  document.getElementById('app-shell').classList.remove('visible');
  document.getElementById('landing').classList.remove('hidden');
  document.body.style.overflow='';
  document.getElementById('gmail-login').classList.remove('hidden');
  destroyCharts();
}

// ==================== DATA ====================
// Users - can be mutated by Admin
let USERS=[
  {id:1,name:'Sanjay Admin',email:'sanjay@coreinv.in',role:'admin',dept:'IT Admin',lastLogin:'2026-03-14',status:'Active',avatarColor:'#D4920A'},
  {id:2,name:'Meera Kumar',email:'meera@coreinv.in',role:'manager',dept:'Operations',lastLogin:'2026-03-14',status:'Active',avatarColor:'#C4622D'},
  {id:3,name:'Rohit Desai',email:'rohit@coreinv.in',role:'manager',dept:'Procurement',lastLogin:'2026-03-12',status:'Active',avatarColor:'#8B3D18'},
  {id:4,name:'Arjun Patel',email:'arjun@coreinv.in',role:'warehouse',dept:'Warehouse A',lastLogin:'2026-03-14',status:'Active',avatarColor:'#6B7F5E'},
  {id:5,name:'Priya Sharma',email:'priya@coreinv.in',role:'warehouse',dept:'Warehouse B',lastLogin:'2026-03-13',status:'Active',avatarColor:'#4E7A6B'},
  {id:6,name:'Kavya Nair',email:'kavya@coreinv.in',role:'warehouse',dept:'Dispatch',lastLogin:'2026-03-10',status:'Inactive',avatarColor:'#8B7A68'},
];

const SUPPLIERS=[
  {id:1,name:'Bharat Distributors',category:'Electronics',leadDays:5,rating:5},
  {id:2,name:'Modi Textiles Ltd',category:'Apparel',leadDays:8,rating:4},
  {id:3,name:'GreenFarms Co-op',category:'Food',leadDays:2,rating:5},
  {id:4,name:'Shree Tools & Parts',category:'Tools',leadDays:10,rating:3},
  {id:5,name:'Rani Furniture Works',category:'Furniture',leadDays:14,rating:4},
  {id:6,name:'Indra Raw Materials',category:'Raw Materials',leadDays:7,rating:4},
];
let PRODUCTS=[
  {sku:'SKU-101',name:'Industrial Fan 36"',cat:'Electronics',supplier:'Bharat Distributors',price:3400,lead:5},
  {sku:'SKU-102',name:'Cotton Work Uniform',cat:'Apparel',supplier:'Modi Textiles Ltd',price:850,lead:8},
  {sku:'SKU-103',name:'Basmati Rice 50kg',cat:'Food',supplier:'GreenFarms Co-op',price:2800,lead:2},
  {sku:'SKU-104',name:'Torque Wrench Set',cat:'Tools',supplier:'Shree Tools & Parts',price:1250,lead:10},
  {sku:'SKU-105',name:'Office Chair Ergo',cat:'Furniture',supplier:'Rani Furniture Works',price:7200,lead:14},
  {sku:'SKU-106',name:'Steel Rod 12mm',cat:'Raw Materials',supplier:'Indra Raw Materials',price:320,lead:7},
  {sku:'SKU-107',name:'LED Floodlight 100W',cat:'Electronics',supplier:'Bharat Distributors',price:1890,lead:5},
  {sku:'SKU-108',name:'Safety Gloves',cat:'Apparel',supplier:'Modi Textiles Ltd',price:180,lead:8},
  {sku:'SKU-109',name:'Wheat Flour 25kg',cat:'Food',supplier:'GreenFarms Co-op',price:1400,lead:2},
  {sku:'SKU-110',name:'Drill Bit Set',cat:'Tools',supplier:'Shree Tools & Parts',price:680,lead:10},
];
let STOCK=[
  {sku:'SKU-101',name:'Industrial Fan 36"',cat:'Electronics',qty:142,reorder:30,loc:'Rack A-1'},
  {sku:'SKU-102',name:'Cotton Work Uniform',cat:'Apparel',qty:380,reorder:100,loc:'Rack B-3'},
  {sku:'SKU-103',name:'Basmati Rice 50kg',cat:'Food',qty:22,reorder:50,loc:'Cold-01'},
  {sku:'SKU-104',name:'Torque Wrench Set',cat:'Tools',qty:58,reorder:20,loc:'Rack C-2'},
  {sku:'SKU-105',name:'Office Chair Ergo',cat:'Furniture',qty:0,reorder:10,loc:'Zone D'},
  {sku:'SKU-106',name:'Steel Rod 12mm',cat:'Raw Materials',qty:1840,reorder:500,loc:'Yard E'},
  {sku:'SKU-107',name:'LED Floodlight 100W',cat:'Electronics',qty:14,reorder:25,loc:'Rack A-4'},
  {sku:'SKU-108',name:'Safety Gloves',cat:'Apparel',qty:720,reorder:200,loc:'Rack B-1'},
  {sku:'SKU-109',name:'Wheat Flour 25kg',cat:'Food',qty:95,reorder:40,loc:'Cold-02'},
  {sku:'SKU-110',name:'Drill Bit Set',cat:'Tools',qty:8,reorder:15,loc:'Rack C-5'},
];
let ORDERS=[
  {id:'ORD-2043',date:'2026-03-14',product:'Industrial Fan 36"',customer:'Narmada Tech',qty:10,total:34000,status:'Processing'},
  {id:'ORD-2042',date:'2026-03-14',product:'Safety Gloves',customer:'Ashoka Mfg',qty:200,total:36000,status:'Shipped'},
  {id:'ORD-2041',date:'2026-03-13',product:'Basmati Rice 50kg',customer:'Royal Hotel Chain',qty:30,total:84000,status:'Delivered'},
  {id:'ORD-2040',date:'2026-03-13',product:'Torque Wrench Set',customer:'Pawan Autos',qty:15,total:18750,status:'Delivered'},
  {id:'ORD-2039',date:'2026-03-12',product:'Office Chair Ergo',customer:'InfoSoft Pvt Ltd',qty:20,total:144000,status:'Cancelled'},
  {id:'ORD-2038',date:'2026-03-12',product:'LED Floodlight 100W',customer:'Builder Co.',qty:50,total:94500,status:'Delivered'},
  {id:'ORD-2037',date:'2026-03-11',product:'Steel Rod 12mm',customer:'Raj Steel Works',qty:400,total:128000,status:'Delivered'},
  {id:'ORD-2036',date:'2026-03-11',product:'Cotton Work Uniform',customer:'City Factory',qty:80,total:68000,status:'Delivered'},
];
let DELIVERIES=[
  {id:'DEL-501',from:'Bharat Distributors',product:'LED Floodlight 100W',qty:100,eta:'2026-03-14',status:'In Transit',progress:80},
  {id:'DEL-502',from:'GreenFarms Co-op',product:'Basmati Rice 50kg',qty:200,eta:'2026-03-15',status:'In Transit',progress:55},
  {id:'DEL-503',from:'Modi Textiles Ltd',product:'Cotton Work Uniform',qty:500,eta:'2026-03-16',status:'Pending',progress:15},
  {id:'DEL-504',from:'Shree Tools & Parts',product:'Torque Wrench Set',qty:50,eta:'2026-03-14',status:'Delayed',progress:40},
  {id:'DEL-505',from:'Indra Raw Materials',product:'Steel Rod 12mm',qty:2000,eta:'2026-03-17',status:'In Transit',progress:65},
];
let MO=[
  {mo:'MO-088',product:'Steel Rod 12mm',qty:500,due:'2026-03-18',status:'In Progress'},
  {mo:'MO-089',product:'Industrial Fan 36"',qty:50,due:'2026-03-20',status:'In Progress'},
  {mo:'MO-090',product:'Safety Gloves',qty:1000,due:'2026-03-22',status:'Scheduled'},
  {mo:'MO-087',product:'Drill Bit Set',qty:100,due:'2026-03-14',status:'Completed'},
];
const PERM_FEATURES=[
  {f:'View Dashboard & Charts',a:'full',m:'full',w:'full'},
  {f:'View Stock Levels',a:'full',m:'full',w:'readonly'},
  {f:'Add / Edit Stock',a:'full',m:'full',w:'none'},
  {f:'View Products',a:'full',m:'full',w:'readonly'},
  {f:'Create / Edit Products',a:'full',m:'full',w:'none'},
  {f:'View Deliveries',a:'full',m:'full',w:'full'},
  {f:'Create Deliveries',a:'full',m:'full',w:'none'},
  {f:'View Manufacture Orders',a:'full',m:'full',w:'readonly'},
  {f:'Create Manufacture Orders',a:'full',m:'full',w:'none'},
  {f:'View Order History',a:'full',m:'full',w:'full'},
  {f:'Create Orders',a:'full',m:'full',w:'none'},
  {f:'View Users',a:'full',m:'readonly',w:'none'},
  {f:'Manage Users & Roles',a:'full',m:'none',w:'none'},
  {f:'Smart Notifications',a:'full',m:'full',w:'none'},
];
let NOTIFS=[
  {id:1,type:'alert',icon:'⚠',ic:'ni-r',title:'Out of Stock: Office Chair Ergo',desc:'SKU-105 at 0 units.',time:'Just now',unread:true},
  {id:2,type:'alert',icon:'⚠',ic:'ni-a',title:'Low Stock: Basmati Rice 50kg',desc:'SKU-103 at 22 — reorder level 50.',time:'5 min',unread:true},
  {id:3,type:'alert',icon:'⚠',ic:'ni-a',title:'Low Stock: LED Floodlight 100W',desc:'SKU-107 at 14 — reorder level 25.',time:'12 min',unread:true},
  {id:4,type:'alert',icon:'🚚',ic:'ni-r',title:'DEL-504 Delayed',desc:'Torque Wrench Set shipment delayed.',time:'1 hr',unread:true},
  {id:5,type:'info',icon:'✓',ic:'ni-g',title:'ORD-2041 Delivered',desc:'Basmati Rice — Royal Hotel Chain.',time:'2 hr',unread:false},
  {id:6,type:'info',icon:'📦',ic:'ni-rust',title:'New Order: ORD-2043',desc:'Industrial Fan × 10 by Narmada Tech.',time:'3 hr',unread:false},
];
const SIM=[
  {type:'alert',icon:'⚠',ic:'ni-r',title:'Critical: Drill Bit Set depleted',desc:'SKU-110 dropped to 8 units.',time:'Just now'},
  {type:'info',icon:'🚚',ic:'ni-rust',title:'DEL-502 arriving soon',desc:'Basmati Rice 10km away.',time:'Just now'},
  {type:'alert',icon:'⚠',ic:'ni-a',title:'MO-089 may miss due date',desc:'Industrial Fan order behind schedule.',time:'Just now'},
];
let simIdx=0;

// ==================== STATE ====================
let CU=null; // current user object
let AV='dashboard';
let nTab='all';
let activeCat='All';
let charts={};
const NAV_DEF=[
  {id:'dashboard',lbl:'Dashboard',icon:'⬛',sec:'Overview',a:'full',m:'full',w:'full'},
  {id:'stock',lbl:'Stock',icon:'▦',sec:'Inventory',a:'full',m:'full',w:'readonly'},
  {id:'products',lbl:'Products',icon:'◈',sec:'Inventory',a:'full',m:'full',w:'readonly'},
  {id:'delivery',lbl:'Delivery',icon:'◎',sec:'Operations',a:'full',m:'full',w:'full'},
  {id:'manufacture',lbl:'Manufacture',icon:'◇',sec:'Operations',a:'full',m:'full',w:'readonly'},
  {id:'orders',lbl:'Order History',icon:'≡',sec:'Operations',a:'full',m:'full',w:'full'},
  {id:'reports',lbl:'Reports',icon:'📋',sec:'Operations',a:'full',m:'full',w:'full'},
  {id:'usermgmt',lbl:'User Management',icon:'⊛',sec:'Admin',a:'full',m:'none',w:'none'},
  {id:'users',lbl:'Users',icon:'◉',sec:'Admin',a:'none',m:'readonly',w:'none'},
  {id:'permissions',lbl:'Permissions',icon:'⊞',sec:'Admin',a:'full',m:'full',w:'none'},
];

// ==================== UTILS ====================
function getAcc(id){
  const n=NAV_DEF.find(x=>x.id===id);
  if(!n||!CU)return'none';
  const r=CU.role;
  return r==='admin'?n.a:r==='manager'?n.m:n.w;
}
function sb(s){const m={Active:'bg-g',Inactive:'bg-b',Delivered:'bg-g',Processing:'bg-a',Shipped:'bg-rust',Cancelled:'bg-r','In Transit':'bg-rust',Pending:'bg-a',Delayed:'bg-r','In Progress':'bg-rust',Scheduled:'bg-a',Completed:'bg-g'};return`<span class="badge ${m[s]||'bg-b'}">${s}</span>`;}
function stb(q,r){if(q===0)return`<span class="badge bg-r">Out of Stock</span>`;if(q<r)return`<span class="badge bg-a">Low Stock</span>`;return`<span class="badge bg-g">In Stock</span>`;}
function fmt(n){return'₹'+n.toLocaleString('en-IN');}
function initials(name){return name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase();}
function roleLabel(r){return r==='admin'?'Administrator':r==='manager'?'Manager':'Warehouse';}
function roleBadgeClass(r){return r==='admin'?'role-admin':r==='manager'?'role-mgr':'role-wh';}
function stars(n){return'★'.repeat(n)+'☆'.repeat(5-n);}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600);}
function canEdit(){return CU&&(CU.role==='admin'||CU.role==='manager');}
function requireEdit(){if(!canEdit()){toast('Managers and Admins only');return false;}return true;}

// ==================== GOOGLE OAUTH ====================
// ─────────────────────────────────────────────────────
// CONFIGURATION: Replace with your own Google OAuth Client ID
// Get one at: https://console.cloud.google.com/apis/credentials
// Set Authorized JS origins: http://localhost, https://yourdomain.com
// Set Authorized redirect URIs if needed
// ─────────────────────────────────────────────────────
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

// Stores the currently signed-in Google user profile
// googleUser.email  → the Gmail address
// googleUser.name   → display name
// googleUser.picture → avatar URL
// googleUser.sub    → unique Google ID
let googleUser = null;

function startGoogleOAuth(){
  // Check if Google Identity Services is loaded
  if(typeof google === 'undefined' || !google.accounts){
    toast('⚠️ Google API not loaded. Configure your Client ID first.');
    showOAuthSetupGuide();
    return;
  }

  // Initialize the token client for OAuth 2.0
  const tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/gmail.readonly openid email profile',
    callback: (tokenResponse) => {
      if(tokenResponse.error){
        toast('Google sign-in failed: '+tokenResponse.error);
        return;
      }
      // Fetch user profile with the access token
      fetchGoogleProfile(tokenResponse.access_token);
    },
  });
  tokenClient.requestAccessToken({prompt: 'select_account'});
}

async function fetchGoogleProfile(accessToken){
  try {
    const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: 'Bearer ' + accessToken }
    });
    const profile = await resp.json();
    // profile contains: sub, name, given_name, family_name, picture, email, email_verified
    googleUser = profile;
    onGoogleSignedIn(profile, accessToken);
  } catch(e) {
    toast('Could not fetch Google profile: ' + e.message);
  }
}

function onGoogleSignedIn(profile, accessToken){
  // Show Google user info card in login screen
  document.getElementById('google-user-info').style.display='block';
  document.getElementById('google-avatar').src = profile.picture || '';
  document.getElementById('google-display-name').textContent = profile.name;
  document.getElementById('google-display-email').textContent = profile.email;
  document.getElementById('btn-google-signin').textContent = '✓ Signed in with Google';
  document.getElementById('btn-google-signin').style.background = '#e8f5e9';
  document.getElementById('btn-google-signin').style.color = '#2e7d32';
  document.getElementById('btn-google-signin').disabled = true;

  // Try to match signed-in Google email with a registered USERS account
  const matchedUser = USERS.find(u => u.email.toLowerCase() === profile.email.toLowerCase() && u.status === 'Active');
  if(matchedUser){
    // Auto-select and log in
    toast('✅ Google account matched! Signing you in...');
    setTimeout(() => {
      CU = matchedUser;
      completeLogin();
    }, 800);
  } else {
    // Open Gmail picker to let them select an account or show mismatch
    toast('Google sign-in successful! Select your app role below.');
    openGmailInboxPicker(profile, accessToken);
  }
}

function openGmailInboxPicker(profile, accessToken){
  // Open a modal showing the signed-in Gmail account and letting user pick a system role
  const el = document.getElementById('gmail-picker-list');
  el.innerHTML = `
    <div style="background:#f0f7ff;border-radius:10px;padding:14px;margin-bottom:12px;border:1.5px solid #c0d8f0;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <img src="${profile.picture}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">
        <div>
          <div style="font-size:13px;font-weight:700;color:#3A2E22;">${profile.name}</div>
          <div style="font-size:11px;color:#8B7A68;">${profile.email}</div>
          <div style="font-size:10px;color:#6B7F5E;margin-top:2px;">✓ Verified Google Account</div>
        </div>
      </div>
      <div style="font-size:12px;color:#8B7A68;">This email is not registered in CoreInventory. Please select a demo account below, or ask your Admin to add <strong>${profile.email}</strong> to the system.</div>
    </div>
    ${USERS.filter(u=>u.status==='Active').map(u=>`
      <div class="gmail-acc" onclick="pickGmailAccount(${u.id})" style="cursor:pointer">
        <div class="gmail-av" style="background:${u.avatarColor}">${initials(u.name)}</div>
        <div class="gmail-info"><div class="gmail-name">${u.name}</div><div class="gmail-email">${u.email}</div></div>
        <span class="gmail-role-badge ${roleBadgeClass(u.role)}">${roleLabel(u.role)}</span>
      </div>`).join('')}
  `;
  document.getElementById('modal-gmail-picker').classList.add('open');
}

function signOutGoogle(){
  googleUser = null;
  document.getElementById('google-user-info').style.display='none';
  const btn = document.getElementById('btn-google-signin');
  btn.innerHTML = `<svg class="google-g" viewBox="0 0 48 48"><path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-21 0-1.3-.2-2.7-.5-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.1 19.1 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.6 7.4 6.3 14.7z"/><path fill="#FBBC05" d="M24 46c5.8 0 10.8-1.9 14.6-5.2l-6.7-5.5C29.8 36.8 27 38 24 38c-6.1 0-10.7-3.8-11.8-9l-7 5.4C8.6 41.6 15.7 46 24 46z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-1 3.1-3.2 5.6-6.1 7.3l6.7 5.5C40.6 37.3 45 31.4 45 24c0-1.3-.2-2.7-.5-4z"/></svg> Sign in with Google (Opens Gmail)`;
  btn.style.background = 'white';
  btn.style.color = '#3A2E22';
  btn.disabled = false;
  if(typeof google !== 'undefined' && google.accounts){
    google.accounts.id.disableAutoSelect();
  }
  toast('Signed out of Google');
}

function showOAuthSetupGuide(){
  // Show a helpful overlay explaining how to set up OAuth
  const existing = document.getElementById('oauth-guide-modal');
  if(existing) { existing.classList.add('open'); return; }
  
  const modal = document.createElement('div');
  modal.id = 'oauth-guide-modal';
  modal.className = 'modal-ov open';
  modal.innerHTML = `
    <div class="modal" style="max-width:480px;">
      <div class="modal-title">🔑 Setup Google OAuth</div>
      <div style="font-size:13px;color:var(--amu);line-height:1.7;">
        <p style="margin-bottom:12px;">To enable real Google sign-in, follow these steps:</p>
        <ol style="padding-left:18px;display:flex;flex-direction:column;gap:8px;">
          <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" style="color:var(--ar)">Google Cloud Console → Credentials</a></li>
          <li>Create a new <strong>OAuth 2.0 Client ID</strong> (Web application)</li>
          <li>Add your domain to <strong>Authorized JavaScript origins</strong><br><code style="font-size:11px;background:#eee;padding:2px 6px;border-radius:3px;">http://localhost</code> or <code style="font-size:11px;background:#eee;padding:2px 6px;border-radius:3px;">https://yourdomain.com</code></li>
          <li>Copy the Client ID and replace <code style="font-size:11px;background:#eee;padding:2px 6px;border-radius:3px;">YOUR_GOOGLE_CLIENT_ID</code> in the JS code</li>
          <li>Enable the <strong>Gmail API</strong> in your project</li>
        </ol>
        <div style="margin-top:16px;padding:10px;background:var(--arl);border-radius:8px;font-size:12px;">
          <strong>Variable locations in code:</strong><br>
          • <code>GOOGLE_CLIENT_ID</code> — your OAuth client ID<br>
          • <code>googleUser</code> — signed-in Google profile (email, name, picture)<br>
          • <code>USERS[]</code> — registered app users with their emails<br>
          • <code>CU</code> — currently active (logged-in) user object
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-p" onclick="this.closest('.modal-ov').classList.remove('open')">Got it</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function completeLogin(){
  document.getElementById('app-av').textContent=initials(CU.name);
  document.getElementById('app-av').style.background=CU.avatarColor;
  document.getElementById('app-uname').textContent=CU.name;
  document.getElementById('app-uemail').textContent=CU.email;
  // If signed in via real Google, show real avatar
  if(googleUser && googleUser.picture){
    const av=document.getElementById('app-av');
    av.style.backgroundImage=`url(${googleUser.picture})`;
    av.style.backgroundSize='cover';
    av.style.backgroundPosition='center';
    av.textContent='';
  }
  const rp=document.getElementById('app-rpill');
  rp.textContent=roleLabel(CU.role);rp.className='app-rpill '+CU.role;
  document.getElementById('tb-role').textContent=roleLabel(CU.role);
  const bell=document.getElementById('notif-bell');
  bell.style.display=(CU.role==='admin'||CU.role==='manager')?'flex':'none';
  document.getElementById('gmail-login').classList.add('hidden');
  document.getElementById('app-date').textContent=new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
  AV='dashboard';
  buildNav();renderAll();
  if(CU.role!=='warehouse')updateNotifBadge();
  toast('Welcome, '+CU.name.split(' ')[0]+'! Signed in as '+roleLabel(CU.role));
}

// ==================== GMAIL LOGIN ====================
function initGmailLogin(){
  const el=document.getElementById('gmail-accounts');
  el.innerHTML=USERS.filter(u=>u.status==='Active').map((u,i)=>`
    <div class="gmail-acc${i===0?' selected':''}" onclick="selGmail(this,${u.id})" data-uid="${u.id}">
      <div class="gmail-av ${u.role==='admin'?'admin-av':u.role==='manager'?'mgr-av':'wh-av'}" style="background:${u.avatarColor}">${initials(u.name)}</div>
      <div class="gmail-info"><div class="gmail-name">${u.name}</div><div class="gmail-email">${u.email}</div></div>
      <span class="gmail-role-badge ${roleBadgeClass(u.role)}">${roleLabel(u.role)}</span>
    </div>`).join('');
  el.dataset.sel=USERS[0].id;
}
function selGmail(el,uid){document.querySelectorAll('.gmail-acc').forEach(c=>c.classList.remove('selected'));el.classList.add('selected');document.getElementById('gmail-accounts').dataset.sel=uid;}
function openGmailPicker(){
  const el=document.getElementById('gmail-picker-list');
  el.innerHTML=USERS.filter(u=>u.status==='Active').map(u=>`
    <div class="gmail-acc" onclick="pickGmailAccount(${u.id})" style="cursor:pointer">
      <div class="gmail-av" style="background:${u.avatarColor}">${initials(u.name)}</div>
      <div class="gmail-info"><div class="gmail-name">${u.name}</div><div class="gmail-email">${u.email}</div></div>
      <span class="gmail-role-badge ${roleBadgeClass(u.role)}">${roleLabel(u.role)}</span>
    </div>`).join('');
  document.getElementById('modal-gmail-picker').classList.add('open');
}
function pickGmailAccount(uid){
  closeModal('modal-gmail-picker');
  document.querySelectorAll('.gmail-acc').forEach(c=>c.classList.remove('selected'));
  const el=document.querySelector(`.gmail-acc[data-uid="${uid}"]`);
  if(el){el.classList.add('selected');document.getElementById('gmail-accounts').dataset.sel=uid;}
  doGmailLogin();
}
function doGmailLogin(){
  const uid=parseInt(document.getElementById('gmail-accounts').dataset.sel)||1;
  CU=USERS.find(u=>u.id===uid);
  if(!CU||CU.status==='Inactive'){toast('Account inactive. Contact your Admin.');return;}
  completeLogin();
}
function doLogout(){
  destroyCharts();
  // Reset Google sign-in UI if applicable
  if(googleUser){ signOutGoogle(); googleUser=null; }
  document.getElementById('gmail-login').classList.remove('hidden');
  closeNotif();
  initGmailLogin();
  AV='dashboard';
  CU=null;
}

// ==================== NAV ====================
function buildNav(){
  const el=document.getElementById('app-nav');
  let html='';let lastSec='';
  NAV_DEF.forEach(item=>{
    if(item.sec!==lastSec){html+=`<div class="app-nav-sec">${item.sec}</div>`;lastSec=item.sec;}
    const acc=getAcc(item.id);
    const locked=acc==='none';
    html+=`<div class="app-ni${AV===item.id?' active':''}${locked?' locked':''}"
      onclick="${locked?`toast('${roleLabel(CU.role)}s do not have access to this')`:` showView('${item.id}')`}">
      <span style="font-size:14px;width:18px;text-align:center">${item.icon}</span>${item.lbl}
      ${locked?'<span style="margin-left:auto;font-size:10px;opacity:.35">🔒</span>':''}
    </div>`;
  });
  el.innerHTML=html;
}
function showView(v){
  const acc=getAcc(v);AV=v;
  document.querySelectorAll('.a-view').forEach(x=>x.classList.remove('active'));
  if(acc==='none'){document.getElementById('av-denied').classList.add('active');}
  else{
    const el=document.getElementById('av-'+v);
    if(el){el.classList.add('active');applyRestr(v,acc);}
    else{document.getElementById('av-denied').classList.add('active');}
  }
  document.getElementById('app-ptitle').textContent=NAV_DEF.find(x=>x.id===v)?.lbl||v;
  buildNav();
  if(v==='dashboard')setTimeout(initCharts,80);
  if(v==='usermgmt')renderUserCards();
  if(v==='permissions')renderPerms();
  if(v==='reports')renderReports();
}
function applyRestr(v,acc){
  const isMgrOrAdmin=CU.role==='admin'||CU.role==='manager';
  const isAdmin=CU.role==='admin';
  if(v==='stock'){
    document.getElementById('stock-ro').style.display=acc==='readonly'?'flex':'none';
    const b=document.getElementById('btn-add-stock');
    b.className='btn '+(isMgrOrAdmin?'btn-p':'btn-dis');b.disabled=!isMgrOrAdmin;
    b.onclick=isMgrOrAdmin?openAddStock:()=>toast('Managers only');
    renderStock();
  }
  if(v==='products'){
    document.getElementById('prod-ro').style.display=acc==='readonly'?'flex':'none';
    const b=document.getElementById('btn-add-prod');
    b.className='btn '+(isMgrOrAdmin?'btn-p':'btn-dis');b.disabled=!isMgrOrAdmin;
    b.onclick=isMgrOrAdmin?openAddProd:()=>toast('Managers only');
    renderProducts();
  }
  if(v==='delivery'){
    const b=document.getElementById('btn-new-delivery');
    b.className='btn '+(isMgrOrAdmin?'btn-p':'btn-dis');b.disabled=!isMgrOrAdmin;
    b.onclick=isMgrOrAdmin?openNewDelivery:()=>toast('Managers only');
  }
  if(v==='manufacture'){
    const bmo=document.getElementById('btn-new-mo');
    const bsup=document.getElementById('btn-add-supplier');
    bmo.className='btn '+(isMgrOrAdmin?'btn-p':'btn-dis');bmo.disabled=!isMgrOrAdmin;
    bsup.className='btn '+(isMgrOrAdmin?'btn-p':'btn-dis');bsup.disabled=!isMgrOrAdmin;
  }
  if(v==='orders'){
    const b=document.getElementById('btn-new-order');
    b.className='btn '+(isMgrOrAdmin?'btn-p':'btn-dis');b.disabled=!isMgrOrAdmin;
  }
}

// ==================== RENDER ALL ====================
function renderAll(){
  renderDash();renderStock();renderProducts();renderOrders();renderDelivery();renderMO();renderUsers();renderPerms();renderReports();
  setTimeout(initCharts,150);
}
function renderDash(){
  document.getElementById('d-orders').innerHTML=ORDERS.slice(0,5).map(o=>`<tr><td style="font-family:'Cormorant Garamond',serif;font-weight:600">${o.id}</td><td>${o.product}</td><td>${o.qty}</td><td>${sb(o.status)}</td></tr>`).join('');
  document.getElementById('d-low').innerHTML=STOCK.filter(s=>s.qty<s.reorder).slice(0,5).map(s=>`<tr><td>${s.name}</td><td style="font-weight:700;color:${s.qty===0?'var(--ared)':'var(--ar)'}">${s.qty}</td><td>${s.reorder}</td></tr>`).join('');
}
function renderStock(data){
  const ok=canEdit();
  document.getElementById('t-stock').innerHTML=(data||STOCK).map(s=>`<tr>
    <td style="font-size:11px;color:var(--amu)">${s.sku}</td>
    <td style="font-weight:700">${s.name}</td><td>${s.cat}</td>
    <td style="font-weight:700;color:${s.qty===0?'var(--ared)':s.qty<s.reorder?'var(--ar)':'var(--adp)'}">${s.qty}</td>
    <td>${s.reorder}</td><td style="color:var(--amu)">${s.loc}</td>
    <td>${stb(s.qty,s.reorder)}</td>
    <td>${ok?`<button class="btn btn-o" style="font-size:11px;padding:4px 9px" onclick="openEditStock('${s.sku}')">Edit</button>`:'—'}</td>
  </tr>`).join('');
}
function renderProducts(){
  const ok=canEdit();
  document.getElementById('t-products').innerHTML=PRODUCTS.map(p=>`<tr>
    <td style="font-size:11px;color:var(--amu)">${p.sku}</td>
    <td style="font-weight:700">${p.name}</td><td>${p.cat}</td><td>${p.supplier}</td>
    <td>${fmt(p.price)}</td><td>${p.lead}d</td>
    <td>${ok?`<button class="btn btn-o" style="font-size:11px;padding:4px 9px" onclick="openEditProd('${p.sku}')">Edit</button>`:'—'}</td>
  </tr>`).join('');
}
function renderOrders(data){
  const ok=canEdit();
  const rows=data||ORDERS;
  document.getElementById('order-cnt').textContent=rows.length+' orders';
  document.getElementById('t-orders').innerHTML=rows.map(o=>`<tr>
    <td style="font-family:'Cormorant Garamond',serif;font-weight:600">${o.id}</td>
    <td style="color:var(--amu)">${o.date}</td><td>${o.product}</td><td>${o.customer}</td>
    <td>${o.qty}</td><td style="font-weight:700">${fmt(o.total)}</td><td>${sb(o.status)}</td>
    <td>${ok?`<select class="form-sel" style="font-size:11px;padding:3px 6px;width:110px" onchange="changeOrderStatus('${o.id}',this.value)">
      <option${o.status==='Processing'?' selected':''}>Processing</option>
      <option${o.status==='Shipped'?' selected':''}>Shipped</option>
      <option${o.status==='Delivered'?' selected':''}>Delivered</option>
      <option${o.status==='Cancelled'?' selected':''}>Cancelled</option>
    </select>`:'—'}</td>
  </tr>`).join('');
}
function renderDelivery(){
  document.getElementById('t-delivery').innerHTML=DELIVERIES.map(d=>`
    <div class="del-card">
      <div class="del-top">
        <div><div class="del-id">${d.id} — ${d.product}</div><div class="del-meta">From: ${d.from} · Qty: ${d.qty} · ETA: ${d.eta}</div></div>
        <div style="display:flex;align-items:center;gap:8px">
          ${sb(d.status)}
          ${canEdit()?`<select class="form-sel" style="font-size:11px;padding:3px 6px;width:110px" onchange="changeDelStatus('${d.id}',this.value)">
            <option${d.status==='Pending'?' selected':''}>Pending</option>
            <option${d.status==='In Transit'?' selected':''}>In Transit</option>
            <option${d.status==='Delayed'?' selected':''}>Delayed</option>
            <option value="Delivered">Delivered</option>
          </select>`:''}
        </div>
      </div>
      <div class="prog-bar"><div class="prog-fill" style="width:${d.progress}%;background:${d.status==='Delayed'?'var(--ared)':d.status==='Pending'?'var(--aam)':'var(--ar)'}"></div></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px">
        <span style="font-size:11px;color:var(--amu)">${d.progress}% complete</span>
        ${canEdit()?`<div style="display:flex;gap:6px">
          <button class="btn btn-g" style="font-size:10px;padding:3px 8px" onclick="updateProgress('${d.id}',-10)">−10%</button>
          <button class="btn btn-p" style="font-size:10px;padding:3px 8px" onclick="updateProgress('${d.id}',10)">+10%</button>
        </div>`:''}
      </div>
    </div>`).join('');
}
function renderMO(){
  const ok=canEdit();
  document.getElementById('t-mo').innerHTML=MO.map(m=>`<tr>
    <td style="font-family:'Cormorant Garamond',serif;font-weight:600">${m.mo}</td>
    <td style="font-weight:700">${m.product}</td><td>${m.qty}</td>
    <td style="color:var(--amu)">${m.due}</td><td>${sb(m.status)}</td>
    <td>${ok?`<select class="form-sel" style="font-size:11px;padding:3px 6px;width:110px" onchange="changeMOStatus('${m.mo}',this.value)">
      <option${m.status==='Scheduled'?' selected':''}>Scheduled</option>
      <option${m.status==='In Progress'?' selected':''}>In Progress</option>
      <option${m.status==='Completed'?' selected':''}>Completed</option>
    </select>`:'—'}</td>
  </tr>`).join('');
  document.getElementById('t-supp').innerHTML=SUPPLIERS.map(s=>`<tr>
    <td style="font-weight:700">${s.name}</td><td>${s.category}</td><td>${s.leadDays}d</td>
    <td style="color:var(--aam)">${stars(s.rating)}</td>
    <td>${ok?`<button class="btn btn-o" style="font-size:11px;padding:3px 8px">Edit</button>`:'—'}</td>
  </tr>`).join('');
}
function renderUsers(){
  document.getElementById('t-users').innerHTML=USERS.map(u=>`<tr>
    <td style="font-weight:700">${u.name}</td><td style="color:var(--amu)">${u.email}</td>
    <td><span class="badge ${roleBadgeClass(u.role)}">${roleLabel(u.role)}</span></td>
    <td style="color:var(--amu)">${u.lastLogin}</td><td>${sb(u.status)}</td>
  </tr>`).join('');
}
function renderPerms(){
  const pc=v=>v==='full'?'<span class="p-yes">✓</span>':v==='readonly'?'<span class="p-ro">View only</span>':'<span class="p-no">✗</span>';
  document.getElementById('pm-admin').innerHTML=PERM_FEATURES.map(f=>`<div class="perm-row"><span>${f.f}</span>${pc(f.a)}</div>`).join('');
  document.getElementById('pm-mgr').innerHTML=PERM_FEATURES.map(f=>`<div class="perm-row"><span>${f.f}</span>${pc(f.m)}</div>`).join('');
  document.getElementById('pm-wh').innerHTML=PERM_FEATURES.map(f=>`<div class="perm-row"><span>${f.f}</span>${pc(f.w)}</div>`).join('');
}
function renderUserCards(){
  const el=document.getElementById('user-cards');
  el.innerHTML=USERS.map(u=>`
    <div class="uc">
      <div class="uc-top">
        <div class="uc-av" style="background:${u.avatarColor}">${initials(u.name)}</div>
        <div>
          <div class="uc-name">${u.name}</div>
          <div class="uc-email">${u.email}</div>
          <div style="font-size:11px;color:var(--amu);margin-top:2px">${u.dept||'—'}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <span class="badge ${roleBadgeClass(u.role)}">${roleLabel(u.role)}</span>
        <span class="badge ${u.status==='Active'?'bg-g':'bg-b'}">${u.status}</span>
      </div>
      <div style="font-size:11px;color:var(--amu);margin-bottom:10px">Last login: ${u.lastLogin}</div>
      <div style="margin-bottom:8px">
        <label class="form-lbl" style="margin-bottom:4px">Change Role</label>
        <select class="role-select-inline" id="role-sel-${u.id}" onchange="changeUserRole(${u.id},this.value)">
          <option value="admin" ${u.role==='admin'?'selected':''}>Administrator</option>
          <option value="manager" ${u.role==='manager'?'selected':''}>Manager</option>
          <option value="warehouse" ${u.role==='warehouse'?'selected':''}>Warehouse</option>
        </select>
      </div>
      <div class="uc-actions">
        ${u.status==='Active'
          ?`<button class="btn btn-danger" style="font-size:11px;padding:4px 10px" onclick="toggleUserStatus(${u.id})">Deactivate</button>`
          :`<button class="btn btn-g" style="font-size:11px;padding:4px 10px" onclick="toggleUserStatus(${u.id})">Reactivate</button>`
        }
        ${u.id===CU.id?'<span style="font-size:11px;color:var(--amu)">(You)</span>':''}
      </div>
    </div>`).join('');
}

// ==================== INLINE STATUS UPDATES ====================
function changeOrderStatus(id,val){
  const o=ORDERS.find(x=>x.id===id);if(o){o.status=val;toast('Order '+id+' → '+val);renderDash();}
}
function changeDelStatus(id,val){
  const d=DELIVERIES.find(x=>x.id===id);
  if(d){d.status=val;if(val==='Delivered')d.progress=100;renderDelivery();toast(id+' status updated');}
}
function changeMOStatus(mo,val){
  const m=MO.find(x=>x.mo===mo);if(m){m.status=val;toast(mo+' → '+val);}
}
function updateProgress(id,delta){
  const d=DELIVERIES.find(x=>x.id===id);
  if(d){d.progress=Math.min(100,Math.max(0,d.progress+delta));renderDelivery();toast(id+' progress: '+d.progress+'%');}
}

// ==================== ADMIN USER MGMT ====================
function changeUserRole(uid,newRole){
  if(uid===CU.id&&newRole!==CU.role){
    if(!confirm('Changing your own role will require you to re-login. Continue?')){
      document.getElementById('role-sel-'+uid).value=CU.role;return;
    }
  }
  const u=USERS.find(x=>x.id===uid);
  if(u){
    const old=u.role;u.role=newRole;
    toast(u.name+': '+roleLabel(old)+' → '+roleLabel(newRole));
    renderUserCards();
    if(uid===CU.id){CU.role=newRole;buildNav();document.getElementById('app-rpill').textContent=roleLabel(newRole);document.getElementById('app-rpill').className='app-rpill '+newRole;document.getElementById('tb-role').textContent=roleLabel(newRole);}
  }
}
function toggleUserStatus(uid){
  const u=USERS.find(x=>x.id===uid);
  if(!u)return;
  if(uid===CU.id){toast("You can't deactivate your own account");return;}
  u.status=u.status==='Active'?'Inactive':'Active';
  toast(u.name+': '+u.status);
  renderUserCards();
}
function openAddUser(){document.getElementById('modal-adduser').classList.add('open');}
function saveNewUser(){
  const name=document.getElementById('nu-name').value.trim();
  const email=document.getElementById('nu-email').value.trim();
  const role=document.getElementById('nu-role').value;
  const dept=document.getElementById('nu-dept').value.trim();
  if(!name||!email){toast('Name and email are required');return;}
  if(USERS.find(u=>u.email===email)){toast('Email already exists');return;}
  const cols=['#C4622D','#6B7F5E','#D4920A','#8B6F47','#4E7A6B','#8B3D18'];
  USERS.push({id:Date.now(),name,email,role,dept:dept||'—',lastLogin:'Never',status:'Active',avatarColor:cols[USERS.length%cols.length]});
  closeModal('modal-adduser');
  renderUserCards();
  initGmailLogin();
  toast('User added: '+name+' as '+roleLabel(role));
}

// ==================== MODALS ====================
let editStockSku=null,editProdSku=null;
function openAddStock(){
  editStockSku=null;
  document.getElementById('mstock-title').textContent='Add Stock';
  document.getElementById('s-prod').innerHTML=PRODUCTS.map(p=>`<option value="${p.sku}">${p.name}</option>`).join('');
  document.getElementById('s-qty').value='';document.getElementById('s-reorder').value='';document.getElementById('s-loc').value='';
  document.getElementById('modal-stock').classList.add('open');
}
function openEditStock(sku){
  editStockSku=sku;
  const s=STOCK.find(x=>x.sku===sku);
  document.getElementById('mstock-title').textContent='Edit Stock — '+s.name;
  document.getElementById('s-prod').innerHTML=`<option selected>${s.name}</option>`;
  document.getElementById('s-qty').value=s.qty;document.getElementById('s-reorder').value=s.reorder;document.getElementById('s-loc').value=s.loc;
  document.getElementById('modal-stock').classList.add('open');
}
function saveStock(){
  const qty=parseInt(document.getElementById('s-qty').value)||0;
  const reorder=parseInt(document.getElementById('s-reorder').value)||0;
  const loc=document.getElementById('s-loc').value;
  if(editStockSku){
    const s=STOCK.find(x=>x.sku===editStockSku);s.qty=qty;s.reorder=reorder;s.loc=loc;
    toast('Stock updated');
  }else{
    const idx=document.getElementById('s-prod').selectedIndex;
    const p=PRODUCTS[idx];
    if(!STOCK.find(x=>x.sku===p.sku))STOCK.push({sku:p.sku,name:p.name,cat:p.cat,qty,reorder,loc});
    toast('Stock added');
  }
  closeModal('modal-stock');renderStock();renderDash();
  if(AV==='dashboard')setTimeout(buildStockChart,80);
}
function openAddProd(){
  editProdSku=null;
  document.getElementById('mprod-title').textContent='New Product';
  document.getElementById('p-supplier').innerHTML=SUPPLIERS.map(s=>`<option>${s.name}</option>`).join('');
  ['p-name','p-sku','p-price','p-lead'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('modal-prod').classList.add('open');
}
function openEditProd(sku){
  editProdSku=sku;
  const p=PRODUCTS.find(x=>x.sku===sku);
  document.getElementById('mprod-title').textContent='Edit Product';
  document.getElementById('p-name').value=p.name;document.getElementById('p-sku').value=p.sku;
  document.getElementById('p-price').value=p.price;document.getElementById('p-lead').value=p.lead;
  document.getElementById('p-supplier').innerHTML=SUPPLIERS.map(s=>`<option${s.name===p.supplier?' selected':''}>${s.name}</option>`).join('');
  document.getElementById('modal-prod').classList.add('open');
}
function saveProd(){
  const name=document.getElementById('p-name').value.trim();
  const sku=document.getElementById('p-sku').value.trim();
  if(!name||!sku){toast('Name and SKU required');return;}
  const cat=document.getElementById('p-cat').value;
  const price=parseFloat(document.getElementById('p-price').value)||0;
  const supplier=document.getElementById('p-supplier').value;
  const lead=parseInt(document.getElementById('p-lead').value)||7;
  if(editProdSku){
    const p=PRODUCTS.find(x=>x.sku===editProdSku);
    p.name=name;p.cat=cat;p.price=price;p.supplier=supplier;p.lead=lead;
    toast('Product updated');
  }else{
    if(PRODUCTS.find(x=>x.sku===sku)){toast('SKU already exists');return;}
    PRODUCTS.push({sku,name,cat,supplier,price,lead});
    STOCK.push({sku,name,cat,qty:0,reorder:10,loc:'Unassigned'});
    toast('Product created: '+name);
  }
  closeModal('modal-prod');renderProducts();renderStock();
}
function openNewDelivery(){
  document.getElementById('d-id').value='DEL-'+(506+DELIVERIES.length);
  document.getElementById('d-supplier').innerHTML=SUPPLIERS.map(s=>`<option>${s.name}</option>`).join('');
  document.getElementById('d-prod').innerHTML=PRODUCTS.map(p=>`<option>${p.name}</option>`).join('');
  document.getElementById('d-eta').value=new Date(Date.now()+5*86400000).toISOString().split('T')[0];
  document.getElementById('modal-delivery').classList.add('open');
}
function saveDelivery(){
  const id=document.getElementById('d-id').value.trim();
  const from=document.getElementById('d-supplier').value;
  const product=document.getElementById('d-prod').value;
  const qty=parseInt(document.getElementById('d-qty').value)||0;
  const eta=document.getElementById('d-eta').value;
  const status=document.getElementById('d-status').value;
  if(!id||!qty){toast('Delivery ID and quantity required');return;}
  DELIVERIES.push({id,from,product,qty,eta,status,progress:0});
  closeModal('modal-delivery');renderDelivery();toast('Delivery '+id+' created');
}
function openNewMO(){
  document.getElementById('mo-num').value='MO-0'+(90+MO.length+1);
  document.getElementById('mo-prod').innerHTML=PRODUCTS.map(p=>`<option>${p.name}</option>`).join('');
  document.getElementById('mo-due').value=new Date(Date.now()+14*86400000).toISOString().split('T')[0];
  document.getElementById('modal-mo').classList.add('open');
}
function saveMO(){
  const mo=document.getElementById('mo-num').value.trim();
  const product=document.getElementById('mo-prod').value;
  const qty=parseInt(document.getElementById('mo-qty').value)||0;
  const due=document.getElementById('mo-due').value;
  const status=document.getElementById('mo-status').value;
  if(!mo||!qty){toast('MO number and quantity required');return;}
  MO.push({mo,product,qty,due,status});
  closeModal('modal-mo');renderMO();toast('Manufacture order '+mo+' created');
}
function openAddSupplier(){document.getElementById('modal-supplier').classList.add('open');}
function saveSupplier(){
  const name=document.getElementById('sup-name').value.trim();
  const cat=document.getElementById('sup-cat').value;
  const lead=parseInt(document.getElementById('sup-lead').value)||7;
  const rating=Math.min(5,Math.max(1,parseInt(document.getElementById('sup-rating').value)||4));
  if(!name){toast('Supplier name required');return;}
  SUPPLIERS.push({id:SUPPLIERS.length+1,name,category:cat,leadDays:lead,rating});
  closeModal('modal-supplier');renderMO();toast('Supplier added: '+name);
}
function openNewOrder(){
  document.getElementById('o-prod').innerHTML=PRODUCTS.map(p=>`<option>${p.name}</option>`).join('');
  document.getElementById('modal-order').classList.add('open');
}
function saveOrder(){
  const cust=document.getElementById('o-cust').value.trim();
  const product=document.getElementById('o-prod').value;
  const qty=parseInt(document.getElementById('o-qty').value)||0;
  const status=document.getElementById('o-status').value;
  if(!cust||!qty){toast('Customer and quantity required');return;}
  const p=PRODUCTS.find(x=>x.name===product);
  const total=(p?p.price:0)*qty;
  const today=new Date().toISOString().split('T')[0];
  const id='ORD-'+(2044+ORDERS.length);
  ORDERS.unshift({id,date:today,product,customer:cust,qty,total,status});
  closeModal('modal-order');renderOrders();renderDash();toast('Order '+id+' created');
}
function closeModal(id){document.getElementById(id).classList.remove('open');}

// ==================== NOTIFICATIONS ====================
function updateNotifBadge(){
  const u=NOTIFS.filter(n=>n.unread).length;
  document.getElementById('notif-cnt').textContent=u;
  const d=document.getElementById('notif-dot');d.style.display=u>0?'block':'none';
  document.getElementById('nt-all').textContent=NOTIFS.length?`(${NOTIFS.length})`:'';
  document.getElementById('nt-alert').textContent=NOTIFS.filter(n=>n.type==='alert').length||'';
  document.getElementById('nt-info').textContent=NOTIFS.filter(n=>n.type==='info').length||'';
}
function openNotif(){document.getElementById('notif-panel').classList.add('open');document.getElementById('notif-ov').classList.add('open');renderNotifList();}
function closeNotif(){document.getElementById('notif-panel').classList.remove('open');document.getElementById('notif-ov').classList.remove('open');}
function switchNTab(tab,el){nTab=tab;document.querySelectorAll('.n-tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');renderNotifList();}
function renderNotifList(){
  const f=nTab==='all'?NOTIFS:NOTIFS.filter(n=>n.type===nTab);
  const el=document.getElementById('notif-list');
  if(!f.length){el.innerHTML=`<div style="padding:40px;text-align:center;color:var(--amu);font-size:13px">No notifications</div>`;return;}
  el.innerHTML=f.map(n=>`<div class="n-item${n.unread?' unread':''}" onclick="readNotif(${n.id})">
    <div class="ni-icon ${n.ic}">${n.icon}</div>
    <div class="ni-bd"><div class="ni-title">${n.title}</div><div class="ni-desc">${n.desc}</div><div class="ni-time">${n.time}</div></div>
    ${n.unread?'<div class="ni-udot"></div>':''}
  </div>`).join('');
}
function readNotif(id){const n=NOTIFS.find(x=>x.id===id);if(n)n.unread=false;renderNotifList();updateNotifBadge();}
function markAllRead(){NOTIFS.forEach(n=>n.unread=false);renderNotifList();updateNotifBadge();toast('All marked as read');}
function clearNotifs(){NOTIFS=[];renderNotifList();updateNotifBadge();toast('Notifications cleared');}
function addSimNotif(){const s=SIM[simIdx%SIM.length];simIdx++;const n={id:Date.now(),...s,unread:true};NOTIFS.unshift(n);renderNotifList();updateNotifBadge();toast('New alert: '+n.title);}

// ==================== CHARTS ====================
const CC={rust:'rgba(196,98,45,0.85)',rustB:'#C4622D',sage:'rgba(107,127,94,0.85)',sageB:'#6B7F5E',amb:'rgba(212,146,10,0.85)',ambB:'#D4920A',red:'rgba(185,64,64,0.85)',redB:'#B94040'};
const CATCOLS=['#C4622D','#6B7F5E','#D4920A','#8B6F47','#5C4A32','#B94040'];
function destroyCharts(){Object.values(charts).forEach(c=>{try{c.destroy();}catch(e){}});charts={};}
function initCharts(){
  const cats=['All','Electronics','Apparel','Food','Tools','Furniture','Raw Materials'];
  const cf=document.getElementById('cat-filters');
  if(!cf.hasChildNodes()){
    cf.innerHTML=cats.map(c=>`<button class="cf-btn${c===activeCat?' active':''}" onclick="setCat('${c}',this)">${c}</button>`).join('');
  }
  buildStockChart();buildStatusChart();buildRevenueChart();buildCatChart();buildDelChart();
}
function setCat(c,el){activeCat=c;document.querySelectorAll('.cf-btn').forEach(b=>b.classList.remove('active'));el.classList.add('active');buildStockChart();}
function buildStockChart(){
  const data=activeCat==='All'?STOCK:STOCK.filter(s=>s.cat===activeCat);
  const labels=data.map(s=>s.name.length>13?s.name.slice(0,13)+'…':s.name);
  const bg=data.map(s=>s.qty===0?CC.red:s.qty<s.reorder?CC.amb:CC.sage);
  const bc=data.map(s=>s.qty===0?CC.redB:s.qty<s.reorder?CC.ambB:CC.sageB);
  if(charts.stock)charts.stock.destroy();
  charts.stock=new Chart(document.getElementById('c-stock'),{type:'bar',data:{labels,datasets:[{label:'Stock',data:data.map(s=>s.qty),backgroundColor:bg,borderColor:bc,borderWidth:1.5,borderRadius:4},{label:'Reorder',data:data.map(s=>s.reorder),type:'line',borderColor:CC.redB,borderWidth:1.5,borderDash:[5,5],pointRadius:3,pointBackgroundColor:CC.redB,fill:false,tension:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{font:{size:10},color:'#8B7A68',boxWidth:10}}},scales:{x:{ticks:{font:{size:10},color:'#8B7A68'},grid:{display:false}},y:{ticks:{font:{size:10},color:'#8B7A68'},grid:{color:'rgba(212,196,168,.4)'},beginAtZero:true}}}});
}
function buildStatusChart(){
  const c={Delivered:0,Processing:0,Shipped:0,Cancelled:0};ORDERS.forEach(o=>{if(c[o.status]!==undefined)c[o.status]++;});
  if(charts.status)charts.status.destroy();
  charts.status=new Chart(document.getElementById('c-status'),{type:'doughnut',data:{labels:Object.keys(c),datasets:[{data:Object.values(c),backgroundColor:[CC.sage,CC.amb,CC.rust,CC.red],borderColor:['#fff','#fff','#fff','#fff'],borderWidth:3,hoverOffset:5}]},options:{responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{position:'bottom',labels:{font:{size:10},color:'#8B7A68',boxWidth:10,padding:8}}}}});
}
function buildRevenueChart(){
  const labs=ORDERS.slice().reverse().map(o=>o.id.replace('ORD-','#'));
  if(charts.revenue)charts.revenue.destroy();
  charts.revenue=new Chart(document.getElementById('c-revenue'),{type:'line',data:{labels:labs,datasets:[{data:ORDERS.slice().reverse().map(o=>o.total),borderColor:CC.rustB,backgroundColor:'rgba(196,98,45,.07)',borderWidth:2,fill:true,tension:.4,pointRadius:4,pointBackgroundColor:CC.rustB,pointBorderColor:'#fff',pointBorderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{font:{size:10},color:'#8B7A68'},grid:{display:false}},y:{ticks:{font:{size:10},color:'#8B7A68',callback:v=>'₹'+Math.round(v/1000)+'k'},grid:{color:'rgba(212,196,168,.4)'}}}}});
}
function buildCatChart(){
  const cc={};STOCK.forEach(s=>{cc[s.cat]=(cc[s.cat]||0)+1;});
  if(charts.cat)charts.cat.destroy();
  charts.cat=new Chart(document.getElementById('c-cat'),{type:'bar',data:{labels:Object.keys(cc),datasets:[{data:Object.values(cc),backgroundColor:CATCOLS,borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{font:{size:10},color:'#8B7A68'},grid:{display:false}},y:{ticks:{font:{size:10},color:'#8B7A68',stepSize:1},grid:{color:'rgba(212,196,168,.4)'},beginAtZero:true}}}});
}
function buildDelChart(){
  const cols=DELIVERIES.map(d=>d.status==='Delayed'?CC.red:d.status==='Pending'?CC.amb:CC.sage);
  if(charts.del)charts.del.destroy();
  charts.del=new Chart(document.getElementById('c-del'),{type:'bar',data:{labels:DELIVERIES.map(d=>d.id),datasets:[{data:DELIVERIES.map(d=>d.progress),backgroundColor:cols,borderRadius:4,borderSkipped:false}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{min:0,max:100,ticks:{font:{size:10},color:'#8B7A68',callback:v=>v+'%'},grid:{color:'rgba(212,196,168,.4)'}},y:{ticks:{font:{size:10},color:'#8B7A68'},grid:{display:false}}}}});
}
// Filters
function filterStock(){const q=document.getElementById('stock-q').value.toLowerCase();renderStock(STOCK.filter(s=>s.name.toLowerCase().includes(q)||s.sku.toLowerCase().includes(q)));}
function filterOrders(){const q=document.getElementById('order-q').value.toLowerCase();const st=document.getElementById('order-sf').value;renderOrders(ORDERS.filter(o=>(o.product.toLowerCase().includes(q)||o.customer.toLowerCase().includes(q)||o.id.toLowerCase().includes(q))&&(!st||o.status===st)));}
// ==================== DELIVERY ====================
function openNewDelivery(){document.getElementById('modal-delivery').classList.add('open');}
function saveDelivery(){
  const id=document.getElementById('d-id').value.trim();
  const prod=document.getElementById('d-prod').value.trim();
  const dest=document.getElementById('d-dest').value.trim();
  const eta=document.getElementById('d-eta').value;
  const status=document.getElementById('d-status').value;
  if(!id||!prod||!dest){toast('ID, product and destination required');return;}
  DELIVERIES.unshift({id,product:prod,dest,eta,status,progress:status==='Delivered'?100:status==='In Transit'?60:status==='Delayed'?30:10});
  closeModal('modal-delivery');renderDelivery();renderDash();toast('Delivery '+id+' added');
}
function renderDelivery(){
  document.getElementById('t-delivery').innerHTML='<div class="t-card"><table><thead><tr><th>ID</th><th>Product</th><th>Destination</th><th>ETA</th><th>Status</th><th>Progress</th><th>Action</th></tr></thead><tbody>'+DELIVERIES.map(d=>`<tr><td style="font-weight:700">${d.id}</td><td>${d.product}</td><td>${d.dest}</td><td>${d.eta}</td><td>${sb(d.status)}</td><td><div style="background:#EDE4D3;border-radius:4px;height:6px;width:100px"><div style="background:${d.status==='Delayed'?'var(--ared)':d.status==='Pending'?'var(--aam)':'var(--asg)'};height:6px;border-radius:4px;width:${d.progress}%"></div></div><span style="font-size:10px;color:var(--amu)">${d.progress}%</span></td><td>${canEdit()?`<button class="btn btn-o" style="font-size:11px;padding:4px 9px" onclick="updateDelivery('${d.id}')">Update</button>`:'—'}</td></tr>`).join('')+'</tbody></table></div>';
}
function updateDelivery(id){
  const d=DELIVERIES.find(x=>x.id===id);if(!d)return;
  const statuses=['Pending','In Transit','Delivered','Delayed'];
  const cur=statuses.indexOf(d.status);
  d.status=statuses[(cur+1)%statuses.length];
  d.progress=d.status==='Delivered'?100:d.status==='In Transit'?60:d.status==='Delayed'?30:10;
  renderDelivery();buildDelChart();toast('Delivery '+id+' updated to '+d.status);
}

// ==================== USER MANAGEMENT ====================
function renderUsers(){
  document.getElementById('t-users').innerHTML=USERS.map(u=>`<tr><td style="font-weight:700">${u.name}</td><td style="font-size:11px;color:var(--amu)">${u.email}</td><td>${sb2(u.role)}</td><td style="font-size:11px;color:var(--amu)">${u.lastLogin}</td><td>${u.status==='Active'?'<span class="badge bg-g">Active</span>':'<span class="badge bg-r">Inactive</span>'}</td></tr>`).join('');
}
function renderUserCards(){
  document.getElementById('user-cards').innerHTML=USERS.map(u=>`
    <div class="user-card">
      <div class="uc-top">
        <div class="uc-av" style="background:${u.avatarColor}">${initials(u.name)}</div>
        <div><div class="uc-name">${u.name}</div><div class="uc-email">${u.email}</div></div>
        <span class="gmail-role-badge ${roleBadgeClass(u.role)}" style="margin-left:auto">${roleLabel(u.role)}</span>
      </div>
      <div style="font-size:11px;color:var(--amu);margin-bottom:10px">${u.dept} · Last login: ${u.lastLogin}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${CU&&CU.role==='admin'?`
          <button class="btn btn-o" style="font-size:11px;padding:4px 9px" onclick="changeRole(${u.id})">Change Role</button>
          <button class="btn ${u.status==='Active'?'btn-danger':'btn-p'}" style="font-size:11px;padding:4px 9px" onclick="toggleUser(${u.id})">${u.status==='Active'?'Deactivate':'Activate'}</button>
        `:'<span style="font-size:11px;color:var(--amu)">Admin only</span>'}
      </div>
    </div>`).join('');
}
function changeRole(id){
  const u=USERS.find(x=>x.id===id);if(!u)return;
  const roles=['admin','manager','warehouse'];
  const cur=roles.indexOf(u.role);
  u.role=roles[(cur+1)%roles.length];
  renderUserCards();renderUsers();toast(u.name+' is now '+roleLabel(u.role));
}
function toggleUser(id){
  const u=USERS.find(x=>x.id===id);if(!u)return;
  if(u.id===CU?.id){toast('Cannot deactivate yourself');return;}
  u.status=u.status==='Active'?'Inactive':'Active';
  renderUserCards();renderUsers();toast(u.name+' is now '+u.status);
}
function openAddUser(){document.getElementById('modal-adduser').classList.add('open');}
function saveNewUser(){
  const name=document.getElementById('nu-name').value.trim();
  const email=document.getElementById('nu-email').value.trim();
  const role=document.getElementById('nu-role').value;
  const dept=document.getElementById('nu-dept').value.trim();
  if(!name||!email){toast('Name and email required');return;}
  const colors=['#C4622D','#6B7F5E','#D4920A','#8B3D18','#4E7A6B'];
  USERS.push({id:Date.now(),name,email,role,dept:dept||'General',lastLogin:'Never',status:'Active',avatarColor:colors[USERS.length%colors.length]});
  closeModal('modal-adduser');renderUserCards();renderUsers();toast('User '+name+' added');
}

function sb(s){const m={Delivered:'bg-g',Processing:'bg-a',Shipped:'bg-rust',Cancelled:'bg-r',Pending:'bg-a','In Transit':'bg-rust',Delayed:'bg-r',Scheduled:'bg-b','In Progress':'bg-a',Completed:'bg-g'};return`<span class="badge ${m[s]||'bg-b'}">${s}</span>`;}
function sb2(r){return`<span class="badge ${roleBadgeClass(r)}">${roleLabel(r)}</span>`;}
function renderPerms(){
  const PERMS={
    admin:{dashboard:'full',stock:'full',products:'full',delivery:'full',manufacture:'full',orders:'full',reports:'full',usermgmt:'full',users:'full',permissions:'full'},
    manager:{dashboard:'full',stock:'full',products:'full',delivery:'full',manufacture:'full',orders:'full',reports:'full',usermgmt:'none',users:'readonly',permissions:'readonly'},
    warehouse:{dashboard:'readonly',stock:'readonly',products:'readonly',delivery:'readonly',manufacture:'readonly',orders:'readonly',reports:'full',usermgmt:'none',users:'none',permissions:'readonly'}
  };
  ['admin','mgr','wh'].forEach((k,i)=>{
    const role=['admin','manager','warehouse'][i];
    const p=PERMS[role];
    document.getElementById('pm-'+k).innerHTML=Object.entries(p).map(([page,acc])=>`
      <div class="perm-row"><span class="perm-page">${page.charAt(0).toUpperCase()+page.slice(1)}</span>
      <span class="perm-badge ${acc==='full'?'pf':acc==='readonly'?'pr':'pn'}">${acc==='full'?'Full':acc==='readonly'?'Read Only':'No Access'}</span></div>`).join('');
  });
}
function getAcc(v){
  const PERMS={
    admin:{dashboard:'full',stock:'full',products:'full',delivery:'full',manufacture:'full',orders:'full',reports:'full',usermgmt:'full',users:'full',permissions:'full'},
    manager:{dashboard:'full',stock:'full',products:'full',delivery:'full',manufacture:'full',orders:'full',reports:'full',usermgmt:'none',users:'readonly',permissions:'readonly'},
    warehouse:{dashboard:'readonly',stock:'readonly',products:'readonly',delivery:'readonly',manufacture:'readonly',orders:'readonly',reports:'full',usermgmt:'none',users:'none',permissions:'readonly'}
  };
  return(CU&&PERMS[CU.role]&&PERMS[CU.role][v])||'none';
}

// ==================== REPORTS ====================
let REPORTS = [
  {id:'RPT-001',type:'Stock Issue',title:'Missing units in Rack B-3',desc:'Counted 40 units but system shows 65. Possible miscount or theft.',loc:'Rack B-3',priority:'High',submittedBy:'Arjun Patel',role:'warehouse',date:'2026-03-13',status:'Pending'},
  {id:'RPT-002',type:'Damage Report',title:'3 boxes of Cotton Uniforms damaged',desc:'Water damage found in Zone C due to roof leak. Items cannot be sold.',loc:'Zone C',priority:'Medium',submittedBy:'Priya Sharma',role:'warehouse',date:'2026-03-12',status:'Reviewed'},
  {id:'RPT-003',type:'Low Stock Alert',title:'Torque Wrench Set nearly depleted',desc:'Only 8 units left, reorder level is 30. Urgent restock needed.',loc:'Rack A-5',priority:'Critical',submittedBy:'Arjun Patel',role:'warehouse',date:'2026-03-14',status:'Flagged'},
  {id:'RPT-004',type:'Safety Concern',title:'Forklift path blocked in Aisle 4',desc:'Large pallet left in main forklift route creating safety hazard.',loc:'Aisle 4',priority:'High',submittedBy:'Kavya Nair',role:'warehouse',date:'2026-03-11',status:'Reviewed'},
  {id:'RPT-005',type:'General',title:'Shift handover notes - March 14',desc:'Evening shift completed all pending dispatch. 12 orders packed and ready.',loc:'Dispatch Zone',priority:'Low',submittedBy:'Priya Sharma',role:'warehouse',date:'2026-03-14',status:'Pending'},
];

function renderReports(){
  const isWH = CU && CU.role === 'warehouse';
  const isMgrOrAdmin = CU && (CU.role === 'manager' || CU.role === 'admin');

  // Role note
  const note = document.getElementById('report-role-note');
  if(note) note.textContent = isWH ? 'Submit reports for manager review' : 'Reviewing reports submitted by warehouse staff';

  // Show/hide submit button for warehouse only
  const btn = document.getElementById('btn-new-report');
  if(btn) { btn.style.display = isWH ? 'inline-block' : 'none'; }

  // Filter by type
  const typeFilter = document.getElementById('rpt-filter')?.value || '';
  // Warehouse sees only their own; manager/admin see all
  let data = isWH ? REPORTS.filter(r => r.submittedBy === CU.name) : REPORTS;
  if(typeFilter) data = data.filter(r => r.type === typeFilter);

  // Stats
  document.getElementById('rpt-total').textContent = data.length;
  document.getElementById('rpt-pending').textContent = data.filter(r=>r.status==='Pending').length;
  document.getElementById('rpt-reviewed').textContent = data.filter(r=>r.status==='Reviewed').length;
  document.getElementById('rpt-flagged').textContent = data.filter(r=>r.status==='Flagged').length;

  const priorityColor = {Low:'bg-b',Medium:'bg-a',High:'bg-rust',Critical:'bg-r'};
  const statusColor = {Pending:'bg-a',Reviewed:'bg-g',Flagged:'bg-r'};

  document.getElementById('t-reports').innerHTML = data.length ? data.map(r=>`<tr>
    <td style="font-family:'Cormorant Garamond',serif;font-weight:600;font-size:13px">${r.id}</td>
    <td><span class="badge bg-b" style="font-size:9px">${r.type}</span></td>
    <td style="font-weight:500;max-width:180px">${r.title}<br><span style="font-size:11px;color:var(--amu);font-weight:300">${r.loc}</span></td>
    <td style="font-size:12px">${r.submittedBy}<br><span style="font-size:10px;color:var(--amu)">${r.role}</span></td>
    <td style="font-size:12px;color:var(--amu)">${r.date}</td>
    <td><span class="badge ${statusColor[r.status]||'bg-b'}">${r.status}</span><br><span class="badge ${priorityColor[r.priority]||'bg-b'}" style="margin-top:3px;font-size:8px">${r.priority}</span></td>
    <td style="white-space:nowrap">
      <button class="btn btn-g" style="font-size:11px;padding:4px 8px" onclick="viewReport('${r.id}')">View</button>
      ${isMgrOrAdmin ? `<button class="btn btn-o" style="font-size:11px;padding:4px 8px;margin-left:4px" onclick="cycleReportStatus('${r.id}')">Update</button>` : ''}
    </td>
  </tr>`).join('') : `<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--amu);font-size:13px">No reports found</td></tr>`;
}

function openNewReport(){
  document.getElementById('mrpt-title').textContent = 'Submit Warehouse Report';
  document.getElementById('modal-report').classList.add('open');
}

function saveReport(){
  const type = document.getElementById('rpt-type').value;
  const title = document.getElementById('rpt-title-inp').value.trim();
  const desc = document.getElementById('rpt-desc').value.trim();
  const loc = document.getElementById('rpt-loc').value.trim() || 'Unspecified';
  const priority = document.getElementById('rpt-priority').value;
  if(!title||!desc){toast('Title and description required');return;}
  const id = 'RPT-' + String(REPORTS.length+1).padStart(3,'0');
  const today = new Date().toISOString().split('T')[0];
  REPORTS.unshift({id,type,title,desc,loc,priority,submittedBy:CU.name,role:CU.role,date:today,status:'Pending'});
  closeModal('modal-report');
  // Clear form
  ['rpt-title-inp','rpt-desc','rpt-loc'].forEach(id=>document.getElementById(id).value='');
  renderReports();
  toast('✅ Report '+id+' submitted');
}

function viewReport(id){
  const r = REPORTS.find(x=>x.id===id); if(!r) return;
  const isMgrOrAdmin = CU && (CU.role==='manager'||CU.role==='admin');
  const priorityColor = {Low:'bg-b',Medium:'bg-a',High:'bg-rust',Critical:'bg-r'};
  const statusColor = {Pending:'bg-a',Reviewed:'bg-g',Flagged:'bg-r'};
  document.getElementById('report-detail-body').innerHTML = `
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
      <span class="badge bg-b">${r.type}</span>
      <span class="badge ${statusColor[r.status]||'bg-b'}">${r.status}</span>
      <span class="badge ${priorityColor[r.priority]||'bg-b'}">${r.priority} Priority</span>
    </div>
    <div style="font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--adp);margin-bottom:10px">${r.title}</div>
    <div style="background:var(--asf2);border-radius:8px;padding:12px;margin-bottom:12px;border:1px solid var(--abrdl);color:var(--atx);font-size:13px;line-height:1.7">${r.desc}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;color:var(--amu)">
      <div><strong>Location:</strong> ${r.loc}</div>
      <div><strong>Date:</strong> ${r.date}</div>
      <div><strong>Submitted by:</strong> ${r.submittedBy}</div>
      <div><strong>Role:</strong> ${r.role}</div>
    </div>`;
  const actions = document.getElementById('report-detail-actions');
  actions.innerHTML = `<button class="btn btn-g" onclick="closeModal('modal-view-report')">Close</button>
    ${isMgrOrAdmin ? `
      <button class="btn btn-p" onclick="setReportStatus('${r.id}','Reviewed');closeModal('modal-view-report')">Mark Reviewed</button>
      <button class="btn btn-danger" onclick="setReportStatus('${r.id}','Flagged');closeModal('modal-view-report')">Flag Report</button>
    ` : ''}`;
  document.getElementById('modal-view-report').classList.add('open');
}

function setReportStatus(id, status){
  const r = REPORTS.find(x=>x.id===id); if(!r) return;
  r.status = status;
  renderReports();
  toast('Report '+id+' marked as '+status);
}

function cycleReportStatus(id){
  const r = REPORTS.find(x=>x.id===id); if(!r) return;
  const s = ['Pending','Reviewed','Flagged'];
  r.status = s[(s.indexOf(r.status)+1)%s.length];
  renderReports();
  toast('Report '+id+' → '+r.status);
}
