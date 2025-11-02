<script>
// DOM hazır olunca çalışacak şekilde
document.addEventListener("DOMContentLoaded", () => {
  const userStatus = document.getElementById('userStatus');
  const user = localStorage.getItem('auraRP_user');
  if(user){
    userStatus.innerHTML = `Hoşgeldin, <span>${user}</span>`;
  }else{
    userStatus.innerHTML = `Zaten üye misin? <a href="kayit.html" style="color:#0ff">Giriş Yap</a> / <a href="kayit.html" style="color:#0ff">Kayıt Ol</a>`;
  }

  // Ürünler
  const products = {
    vip: [
      {name:"Bronz VIP", price:50, img:"vip1.jpg", desc:"Temel avantajlar ve özel tag."},
      {name:"Altın VIP", price:100, img:"vip2.jpg", desc:"Ev, araç, özel tag ve skin hakları."},
      {name:"Elmas VIP", price:150, img:"vip3.jpg", desc:"Tüm avantajlar + özel villa."}
    ]
  };

  function renderProducts(sectionId, items){
    const container = document.getElementById(sectionId);
    container.innerHTML = "";
    items.forEach((p, index) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <p class="price">₺${p.price}</p>
        <div class="buttons">
          <button id="addCart${sectionId}${index}">Sepete Ekle</button>
          <a href="https://discord.gg/quWAxqxK4T">Satın Al</a>
        </div>
      `;
      container.appendChild(card);

      // Butona tıklandığında sepete ekle
      document.getElementById(`addCart${sectionId}${index}`).addEventListener("click", () => {
        let cart = JSON.parse(localStorage.getItem("aura_cart")) || [];
        cart.push(p);
        localStorage.setItem("aura_cart", JSON.stringify(cart));
        alert(p.name + " sepete eklendi!");
      });
    });
  }

  renderProducts("vipProducts", products.vip);
});
</script>
