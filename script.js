var EVENT_TITLE = "Базаргүл Сейітжанқызының 60 жас мерейтойы";

  // Countdown
  var target = new Date("2026-11-21T17:00:00+05:00").getTime();
  function tick(){
    var diff = target - new Date().getTime();
    var d=document.getElementById('cd-days'), h=document.getElementById('cd-hours'),
        m=document.getElementById('cd-mins'), s=document.getElementById('cd-secs');
    if(diff<=0){ d.textContent=h.textContent=m.textContent=s.textContent="0"; return; }
    d.textContent = Math.floor(diff/86400000);
    h.textContent = Math.floor((diff/3600000)%24);
    m.textContent = Math.floor((diff/60000)%60);
    s.textContent = Math.floor((diff/1000)%60);
  }
  tick(); setInterval(tick,1000);

  // Route button


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
  // 1. Инструкция по настройке — в файле README.md
  // 2. Вставьте сюда URL вашего Apps Script веб-приложения:
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
      mode: "no-cors",   // Apps Script не возвращает CORS-заголовки, поэтому используем no-cors
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