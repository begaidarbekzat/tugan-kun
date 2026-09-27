var EVENT_TITLE = "Базаргүл Сейітжанқызының 60 жас мерейтойы";

// ---- Параллакс (микрофон и лошадь двигаются при скролле) ----
var parallaxEls = document.querySelectorAll('.parallax-img');
var ticking = false;
function updateParallax(){
  var scrollY = window.scrollY || window.pageYOffset;
  parallaxEls.forEach(function(el){
    var speed = parseFloat(el.getAttribute('data-speed')) || 0.25;
    var mirror = el.classList.contains('parallax-horse');
    el.style.transform = 'translate3d(0,' + (-scrollY * speed) + 'px,0)' + (mirror ? ' scaleX(-1)' : '');
  });
  ticking = false;
}
window.addEventListener('scroll', function(){
  if(!ticking){ window.requestAnimationFrame(updateParallax); ticking = true; }
}, {passive:true});
updateParallax();

// ---- Плавное появление блоков при прокрутке ----
// ---- Плавное появление блоков при прокрутке ----
var revealEls = document.querySelectorAll('.reveal');

function activate(el){
  el.classList.add('in-view');

  var grid = el.classList.contains('cal-grid') ? el : el.querySelector('.cal-grid');
  if(grid){
    var cells = grid.querySelectorAll('.cal-cell:not(.empty)');
    cells.forEach(function(cell, i){
      cell.style.transitionDelay = (i * 18) + 'ms';
    });
    requestAnimationFrame(function(){ grid.classList.add('in-view'); });
  }

  // построчное появление текста (стих, приглашение, подпись)
  var lines = el.querySelectorAll('.line');
  lines.forEach(function(line, i){
    line.style.transitionDelay = (i * 110) + 'ms';
  });
}

if('IntersectionObserver' in window){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        activate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.12, rootMargin:'0px 0px -30px 0px'});
  revealEls.forEach(function(el){ io.observe(el); });
} else {
  revealEls.forEach(function(el){ activate(el); });
}



// Countdown
var target = new Date("2026-11-21T17:00:00+05:00").getTime();
var lastSecond = null;
function pulse(el){
  el.parentElement.classList.remove('pulse');
  void el.parentElement.offsetWidth; // restart animation
  el.parentElement.classList.add('pulse');
}
function tick(){
  var diff = target - new Date().getTime();
  var d=document.getElementById('cd-days'), h=document.getElementById('cd-hours'),
      m=document.getElementById('cd-mins'), s=document.getElementById('cd-secs');
  if(diff<=0){ d.textContent=h.textContent=m.textContent=s.textContent="0"; return; }
  var sVal = Math.floor((diff/1000)%60);
  d.textContent = Math.floor(diff/86400000);
  h.textContent = Math.floor((diff/3600000)%24);
  m.textContent = Math.floor((diff/60000)%60);
  s.textContent = sVal;
  if(sVal !== lastSecond){ pulse(s); lastSecond = sVal; }
}
tick(); setInterval(tick,1000);

// RSVP radios
var chosen = null;
document.querySelectorAll('.radio-opt').forEach(function(el){
  el.addEventListener('click', function(){
    document.querySelectorAll('.radio-opt').forEach(function(o){o.classList.remove('selected');});
    el.classList.add('selected');
    chosen = el.getAttribute('data-value');
  });
});

// ---- RSVP -> Google Sheets (через Google Apps Script Web App) ----
var GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwP7a_fimKQQAf_URcxQVEMuUgVKbyUDGmHBmyPxhUFnyQZOyJ3Y2sXqEMq9KNFFilSqg/exec";

document.getElementById('rsvp-form').addEventListener('submit', function(e){
  e.preventDefault();
  var name = document.getElementById('rsvp-name').value.trim();
  var wish = document.getElementById('rsvp-wish').value.trim();
  var statusEl = document.getElementById('rsvp-status');
  if(!name){ statusEl.textContent = "Аты-жөніңізді жазыңыз."; return; }
  if(!chosen){ statusEl.textContent = "Қатысу түрін таңдаңыз."; return; }

  statusEl.textContent = "Жіберілуде...";

  var formData = new FormData();
  formData.append("name", name);
  formData.append("status", chosen);
  formData.append("wish", wish);
  formData.append("timestamp", new Date().toLocaleString("kk-KZ"));

  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: formData
  }).then(function(){
    statusEl.textContent = "Рақмет! Жауабыңыз қабылданды.";
    document.getElementById('rsvp-form').reset();
    document.querySelectorAll('.radio-opt').forEach(function(o){o.classList.remove('selected');});
    chosen = null;
  }).catch(function(){
    statusEl.textContent = "Қате шықты. Кейінірек қайталап көріңіз.";
  });
});
