(function(){
  var rok=document.getElementById('rok'); if(rok) rok.textContent=new Date().getFullYear();

  // menu mobilne
  var burger=document.getElementById('burger'), menu=document.getElementById('menu');
  function zamknij(){menu.classList.remove('otwarte');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Otwórz menu');}
  burger.addEventListener('click',function(){
    var o=menu.classList.toggle('otwarte');
    burger.setAttribute('aria-expanded',o?'true':'false');
    burger.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');
  });
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',zamknij);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij();});

  // aktywna pozycja menu
  var linki=[].slice.call(menu.querySelectorAll('a[href^="#"]'));
  var sekcje=linki.map(function(a){return document.querySelector(a.getAttribute('href'));});
  function akt(){
    var y=window.scrollY+window.innerHeight*0.35, ktora=-1;
    sekcje.forEach(function(s,i){if(s&&s.offsetTop<=y)ktora=i;});
    if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-4) ktora=linki.length-1;
    linki.forEach(function(a,i){a.classList.toggle('akt',i===ktora);});
  }
  window.addEventListener('scroll',akt,{passive:true}); akt();

  // pasek mobilny po przewinięciu za pierwszy ekran
  var mob=document.getElementById('mob'), hero=document.querySelector('.hero');
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(w){
      var pokaz=!w[0].isIntersecting; mob.classList.toggle('widac',pokaz); mob.setAttribute('aria-hidden',pokaz?'false':'true');
    },{threshold:0}).observe(hero);
  }

  // karty zespołu: przeciąganie myszą + strzałki
  var karty=document.getElementById('karty');
  function krok(){var k=karty.querySelector('.karta');return k.getBoundingClientRect().width+parseFloat(getComputedStyle(karty).columnGap||22);}
  var start=0, sl=0, ciagnie=false;
  karty.addEventListener('pointerdown',function(e){
    if(e.pointerType!=='mouse')return;
    ciagnie=true; start=e.clientX; sl=karty.scrollLeft;
  });
  window.addEventListener('pointermove',function(e){
    if(!ciagnie)return;
    var d=e.clientX-start;
    if(Math.abs(d)>4) karty.classList.add('ciagnie');
    karty.scrollLeft=sl-d;
  });
  window.addEventListener('pointerup',function(){
    if(!ciagnie)return; ciagnie=false; karty.classList.remove('ciagnie');
    var k=krok(); karty.scrollTo({left:Math.round(karty.scrollLeft/k)*k,behavior:'smooth'});
  });
  document.querySelectorAll('.strz').forEach(function(b){
    b.addEventListener('click',function(){karty.scrollBy({left:krok()*Number(b.dataset.kier),behavior:'smooth'});});
  });
  karty.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();karty.scrollBy({left:(e.key==='ArrowRight'?1:-1)*krok(),behavior:'smooth'});}
  });

  // przycisk e-doradztwa ustawia temat formularza
  var temat=document.getElementById('temat');
  document.querySelectorAll('[data-temat]').forEach(function(a){
    a.addEventListener('click',function(){temat.value=a.dataset.temat;});
  });

  // formularz pokazowy (bez wysyłki)
  var f=document.getElementById('formularz'), info=document.getElementById('form-info');
  f.addEventListener('submit',function(e){
    e.preventDefault();
    if(!f.checkValidity()){info.textContent='Proszę uzupełnić nazwę, e-mail i zaznaczyć zgodę.';return;}
    info.textContent='To podgląd strony: formularz zacznie wysyłać wiadomości po wdrożeniu.';
  });

  // cookies
  var KLUCZ='ts_cookies_v1', ck=document.getElementById('cookies'), ust=document.getElementById('cookies-ust');
  function czytaj(){try{var v=JSON.parse(localStorage.getItem(KLUCZ)||'null');if(v&&v.t>Date.now()-31536000000)return v;}catch(e){}return null;}
  function zapisz(a,m){try{localStorage.setItem(KLUCZ,JSON.stringify({a:a,m:m,t:Date.now()}));}catch(e){} ck.hidden=true;}
  if(!czytaj()) ck.hidden=false;
  ck.addEventListener('click',function(e){
    var b=e.target.closest('[data-ck]'); if(!b)return;
    var r=b.dataset.ck;
    if(r==='wszystkie') zapisz(true,true);
    else if(r==='niezbedne') zapisz(false,false);
    else if(r==='ustawienia'){
      if(ust.hidden){ust.hidden=false;b.textContent='Zapisz wybór';}
      else zapisz(document.getElementById('ck-analityka').checked,document.getElementById('ck-marketing').checked);
    }
  });
  document.querySelectorAll('[data-cookies-ustawienia]').forEach(function(b){
    b.addEventListener('click',function(){
      var v=czytaj(); document.getElementById('ck-analityka').checked=!!(v&&v.a); document.getElementById('ck-marketing').checked=!!(v&&v.m);
      ust.hidden=false; ck.querySelector('[data-ck="ustawienia"]').textContent='Zapisz wybór'; ck.hidden=false;
    });
  });
})();
