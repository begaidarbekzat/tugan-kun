# Базаргүл Сейітжанқызы — 60 жас мерейтойы

Файлдар: `index.html`, `style.css`, `script.js`. Кез келген хостингке (хостинг, GitHub Pages, Netlify, т.б.) осы үш файлды бірге жүктесеңіз болды.

## Google Таблицаға қосу (RSVP форма)

Форма жауаптары Google Sheets-ке түсуі үшін **Google Apps Script** арқылы кішкене "webhook" жасау керек. Бұл тегін және 10 минутқа созылады.

### 1-қадам: Кесте жасаңыз
1. https://sheets.google.com сайтында жаңа бос кесте ашыңыз.
2. Бірінші жолға тақырыптар жазыңыз: `Уақыты | Аты-жөні | Жауабы | Тілек`

### 2-қадам: Apps Script қосыңыз
1. Кестеде: **Extensions → Apps Script** (Кеңейтулер → Apps Script) басыңыз.
2. Ашылған терезедегі кодты өшіріп, мына кодты қойыңыз:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    e.parameter.timestamp,
    e.parameter.name,
    e.parameter.status,
    e.parameter.wish
  ]);
  return ContentService.createTextOutput("OK");
}
```

3. Дискета белгісін басып сақтаңыз (атын өзгертуге болады, мысалы "RSVP").

### 3-қадам: Веб-қосымша ретінде жариялаңыз
1. Жоғарғы оң жақтағы көк **Deploy → New deployment** (Орналастыру → Жаңа орналастыру) басыңыз.
2. Тегеріш (⚙️) белгісінен **Web app** түрін таңдаңыз.
3. Баптаулар:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. **Deploy** басыңыз, Google рұқсат сұрайды — өз аккаунтыңызбен растаңыз.
5. Сізге ұзын сілтеме беріледі, мысалы:
   `https://script.google.com/macros/s/AKfycb.../exec`
   Осы сілтемені көшіріп алыңыз.

### 4-қадам: Сайтқа қосыңыз
`script.js` файлын ашып, мына жолды тауып:

```javascript
var GOOGLE_SCRIPT_URL = "ВСТАВЬТЕ_СЮДА_URL_ВАШЕГО_APPS_SCRIPT";
```

өз сілтемеңізге ауыстырыңыз:

```javascript
var GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycb.../exec";
```

Сақтаңыз, файлды хостингке қайта жүктеңіз — дайын! Енді әр қонақ форманы толтырғанда, жауап автоматты түрде кестенің жаңа жолына түседі.

### Ескерту
Форма `mode: "no-cors"` арқылы жіберіледі — бұл дегеніміз браузер жауапты оқи алмайды (Google Apps Script осылай жұмыс істейді), бірақ деректер сонда да кестеге жазылады. Сондықтан сайтта әрдайым "Рақмет!" деген хабарлама шығады — бұл қалыпты жағдай.
