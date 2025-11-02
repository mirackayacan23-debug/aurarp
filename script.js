// Basit parallax efekt
window.addEventListener('scroll', function() {
  const hero = document.querySelector('.hero');
  hero.style.backgroundPositionY = -(window.scrollY * 0.3) + 'px';
});
// script.js — sepet yönetimi (localStorage)
// localStorage key
const CART_KEY = 'auraCart';

// Basit ürün veri (aynı market.html'deki products ile eşleşmeli)
const PRODUCTS_REF = {
  'vip-bronze':{id:'vip-bronze',title:'Bronz VIP',price:50,img:'https://i.imgur.com/fXb2HqX.png'},
  'vip-gold':{id:'vip-gold',title:'Altın VIP',price:100,img:'https://i.imgur.com/kRz0epT.png'},
  'vip-diamond':{id:'vip-diamond',title:'Elmas VIP',price:150,img:'https://i.imgur.com/0CwHwTg.png'},
  'car-sport':{id:'car-sport',title:'Spor Araç',price:120,img:'https://i.imgur.com/XqPrRn8.png'},
  'car-offroad':{id:'car-offroad',title:'Off-Road Araç',price:90,img:'https://i.imgur.com/MXhUhWu.png'},
  'house-villa':{id:'house-villa',title:'Los Santos Villa',price:250,img:'https://i.imgur.com/wqvE8wU.png'},
  'name-change':{id:'name-change',title:'İsim Değişikliği',price:15,img:'https://i.imgur.com/qXjBDE2.png'},
  'skin-change':{id:'skin-change',title:'Skin Değişikliği',price:20,img:'https://i.imgur.com/nK2AyzC.png'}
};

/* CART helpers */
function getCart(){
  try{
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return []; }
}
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartBadge(); }
function addToCartById(id){
  const ref = PRODUCTS_REF[id];
  if(!ref) return alert('Ürün bulunamadı.');
  const cart = getCart();
  const found = cart.find(i=>i.id===id);
  if(found){ found.qty += 1; }
  else cart.push({ id: ref.id, title: ref.title, price: ref.price, img: ref.img, qty: 1 });
  saveCart(cart);
  toast('Sepete eklendi: ' + ref.title);
}
function removeFromCart(id){
  let cart = getCart();
  cart = cart.filter(i=>i.id!==id);
  saveCart(cart);
}
function changeQty(id, qty){
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.qty = Math.max(1, qty);
  saveCart(cart);
}
function clearCart(){ localStorage.removeItem(CART_KEY); updateCartBadge(); }

/* UI helpers */
function updateCartBadge(){
  const cart = getCart();
  const count = cart.reduce((s,i)=>s+i.qty,0);
  const el = document.getElementById('cartCount');
  if(el) el.textContent = count;
}
function updateUserStatus(){
  const user = localStorage.getItem('auraRP_user');
  const el = document.getElementById('userStatus');
  if(el){
    if(user) el.innerHTML = `Hoşgeldin, <strong style="color:#0ff">${escapeHtml(user)}</strong>`;
    else el.innerHTML = `Zaten üye misin? <a href="kayit.html" style="color:#0ff">Giriş Yap</a> / <a href="kayit.html" style="color:#0ff">Kayıt Ol</a>`;
  }
}

/* Sepet sayfası render (sepet.html) */
function renderCartPage(){
  updateUserStatus();
  updateCartBadge();
  const area = document.getElementById('cartArea');
  if(!area) return;
  const cart = getCart();
  if(!cart || cart.length===0){
    area.innerHTML = `<div class="empty">Sepetinizde ürün yok. Marketten ürün ekleyin.</div>`;
    document.getElementById('cartTotals').innerHTML = '';
    return;
  }
  const list = document.createElement('div');
  list.className = 'cart-list';
  cart.forEach(item=>{
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div class="ci-info">
        <div class="ci-title">${escapeHtml(item.title)}</div>
        <div class="ci-price">₺${item.price} x ${item.qty} = ₺${item.price*item.qty}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;align-items:center">
        <div class="qty-control">
          <button class="small-btn" data-action="dec" data-id="${item.id}">-</button>
          <span style="min-width:26px;text-align:center">${item.qty}</span>
          <button class="small-btn" data-action="inc" data-id="${item.id}">+</button>
        </div>
        <button class="small-btn" data-action="remove" data-id="${item.id}">Sil</button>
      </div>
    `;
    list.appendChild(itemDiv);
  });
  area.innerHTML = '';
  area.appendChild(list);

  // totals
  const total = cart.reduce((s,i)=>s + (i.price * i.qty),0);
  const totalsEl = document.getElementById('cartTotals');
  totalsEl.innerHTML = `<div>Toplam: <strong style="color:#0ff">₺${total}</strong></div>
    <div><button class="buy-btn" id="checkoutBtn">Satın Al (Discord)</button> <button class="small-btn" id="clearCartBtn">Sepeti Temizle</button></div>`;

  // events
  document.querySelectorAll('[data-action="inc"]').forEach(b=>b.addEventListener('click', e=>{
    const id = e.currentTarget.dataset.id; changeQty(id, getCart().find(i=>i.id===id).qty + 1); renderCartPage();
  }));
  document.querySelectorAll('[data-action="dec"]').forEach(b=>b.addEventListener('click', e=>{
    const id = e.currentTarget.dataset.id; 
    const current = getCart().find(i=>i.id===id).qty;
    if(current>1) changeQty(id, current-1);
    else removeFromCart(id);
    renderCartPage();
  }));
  document.querySelectorAll('[data-action="remove"]').forEach(b=>b.addEventListener('click', e=>{
    removeFromCart(e.currentTarget.dataset.id); renderCartPage();
  }));
  document.getElementById('checkoutBtn').addEventListener('click', ()=> {
    // checkout: yönlendir + (isteğe bağlı) sepeti temizle
    if(confirm('Satın alma için Discord destek kanalına yönlendirileceksiniz. Devam edilsin mi?')){
      // opsiyonel: sepeti mesaj formatında kopyala vs.
      window.location.href = 'https://discord.gg/quWAxqxK4T';
      // clearCart();
    }
  });
  document.getElementById('clearCartBtn').addEventListener('click', ()=>{ if(confirm('Sepeti temizlemek istiyor musunuz?')){ clearCart(); renderCartPage(); }});
}

/* small helper */
function escapeHtml(text){
  if(!text) return '';
  return text.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

/* Toast (basit) */
function toast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  t.style = 'position:fixed;right:18px;bottom:18px;background:#111;border:1px solid #00ffff66;padding:10px 14px;border-radius:8px;color:#fff;box-shadow:0 0 10px #00ffff66;z-index:9999';
  document.body.appendChild(t);
  setTimeout(()=> t.remove(),2000);
}

/* Auto update badge on load for pages using script.js */
document.addEventListener('DOMContentLoaded', ()=> updateCartBadge());

