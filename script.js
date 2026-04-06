

// Sri Lanka Holidays 2026 with Symbols
// • Public, † Bank, ❖ Mercantile
const fixedHolidays2026 = {
    "2026-01-03": "Duruthu Full Moon Poya Day •†",
    "2026-01-15": "Tamil Thai Pongal Day •†❖",
    "2026-02-01": "Nawam Full Moon Poya Day •†",
    "2026-02-04": "Independence Day •†❖",
    "2026-02-15": "Maha Sivarathri Day •†",
    "2026-03-02": "Medin Full Moon Poya Day •†",
    "2026-03-21": "Id-Ul-Fitr (Ramazan Festival Day) •†",
    "2026-04-01": "Bak Full Moon Poya Day •†",
    "2026-04-03": "Good Friday •†",
    "2026-04-13": "Day Prior to New Year •†❖",
    "2026-04-14": "Sinhala and Tamil New Year •†❖",
    "2026-05-01": "Vesak Poya / May Day •†",
    "2026-05-02": "Day Following Vesak •†❖",
    "2026-05-28": "Id-Ul-Alha (Hadji Festival) •†",
    "2026-05-30": "Adhi Poson Full Moon Poya Day •†",
    "2026-06-29": "Poson Full Moon Poya Day •†",
    "2026-07-29": "Esala Full Moon Poya Day •†",
    "2026-08-26": "Milad-Un-Nabi •†❖",
    "2026-08-27": "Nikini Full Moon Poya Day •†",
    "2026-09-26": "Binara Full Moon Poya Day •†",
    "2026-10-25": "Vap Full Moon Poya Day •†",
    "2026-11-08": "Deepavali Festival Day •†",
    "2026-11-24": "Il Full Moon Poya Day •†",
    "2026-12-23": "Unduvap Full Moon Poya Day •†",
    "2026-12-25": "Christmas Day •†❖"
};

// State
let currentDate = new Date(2026, 0, 1); 
let customHolidays = {}; 
let emptyCellNotes = {}; 

let iconType = 'default'; 
let customIconImage = ''; 
let customIconText = '★';

const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkMobile(); // Detect mobile
    initControls();
    initIconControls(); 
    renderAll();
});

function checkMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        document.body.classList.add('is-mobile');
    }
}

function renderAll() {
    renderMainCalendar(currentDate);
    renderMiniCalendars(currentDate);
}

function getColumnClass(colIndex) {
    if (colIndex === 6) return 'red-text';
    if (colIndex === 5) return 'grey-text';
    return '';
}

function getIconHtml() {
    if (iconType === 'image' && customIconImage) {
        return `<div class="cell-inner"><img src="${customIconImage}" style="width:75%; height:75%; object-fit:contain; display:block;"></div>`;
    } else if (iconType === 'text') {
        return `<div class="cell-inner" style="font-size: 3rem; line-height:1;">${customIconText}</div>`;
    } else {
        return `<div class="cell-inner"><svg class="punkalasa-icon"><use href="#icon-punkalasa"/></svg></div>`;
    }
}

function generateFixedGrid(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const numDays = lastDay.getDate();
    let startDayIndex = firstDay.getDay() - 1; 
    if (startDayIndex === -1) startDayIndex = 6; 
    const grid = new Array(35).fill(null);
    for (let d = 1; d <= numDays; d++) {
        const pos = (startDayIndex + d - 1) % 35;
        const dateString = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        grid[pos] = { type: 'date', day: d, dateString: dateString };
    }
    for (let i = 0; i < 35; i++) {
        if (grid[i] === null) {
            grid[i] = { type: 'icon', id: `${year}-${month}-empty-${i}` };
        }
    }
    return grid;
}

function renderMainCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    document.getElementById('display-year').textContent = year;
    document.getElementById('display-month-name').textContent = monthNames[month];
    document.getElementById('display-month-number').textContent = String(month + 1).padStart(2, '0');
    const tbody = document.querySelector('.calendar-table tbody');
    tbody.innerHTML = '';
    const gridData = generateFixedGrid(year, month);
    let row = document.createElement('tr');
    gridData.forEach((cellData, i) => {
        if (i > 0 && i % 7 === 0) { tbody.appendChild(row); row = document.createElement('tr'); }
        const colIndex = i % 7;
        const colClass = getColumnClass(colIndex);
        const td = document.createElement('td'); 
        if (cellData.type === 'icon') {
            td.className = `date-cell icon-cell ${colClass}`;
            if (emptyCellNotes[cellData.id]) {
                td.innerHTML = `<div class="cell-inner empty-cell-note" onclick="handleEmptyClick('${cellData.id}')">${emptyCellNotes[cellData.id]}</div>`;
            } else {
                td.innerHTML = `<div class="cell-wrapper" onclick="handleEmptyClick('${cellData.id}')" style="width:100%; height:100%; display:flex; justify-content:center; align-items:center;">${getIconHtml()}</div>`;
            }
        } else {
            let finalColClass = colClass;
            let holidayTitle = "";
            if (fixedHolidays2026[cellData.dateString]) { finalColClass = 'red-text'; holidayTitle = fixedHolidays2026[cellData.dateString]; }
            if (customHolidays[cellData.dateString]) { finalColClass = 'red-text'; holidayTitle = customHolidays[cellData.dateString]; }
            td.className = `date-cell ${finalColClass}`;
            let html = `<div class="cell-inner" onclick="handleDateClick('${cellData.dateString}')">`;
            if (holidayTitle) html += `<span class="holiday-title">${holidayTitle}</span>`;
            html += `<span class="date-number">${cellData.day}</span></div>`;
            td.innerHTML = html;
        }
        row.appendChild(td);
    });
    tbody.appendChild(row);
}

function renderMiniCalendars(date) {
    renderMiniCal(new Date(date.getFullYear(), date.getMonth() - 1, 1), 'mini-prev');
    renderMiniCal(new Date(date.getFullYear(), date.getMonth() + 1, 1), 'mini-next');
}

function renderMiniCal(date, elementId) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const container = document.getElementById(elementId);
    if (!container) return;
    let gridHtml = `<div class="mini-header"><span>${monthNames[month]}</span><span>${year}</span></div><div class="mini-grid">
        <div class="mini-day-head">MON</div><div class="mini-day-head">TUE</div><div class="mini-day-head">WED</div><div class="mini-day-head">THU</div><div class="mini-day-head">FRI</div><div class="mini-day-head saturday">SAT</div><div class="mini-day-head sunday">SUN</div>`;
    const grid = generateFixedGrid(year, month);
    grid.forEach((cellData, i) => {
        const colClass = getColumnClass(i % 7);
        if (cellData.type === 'icon') {
            if (iconType === 'default') gridHtml += `<div class="mini-cell ${colClass}"><svg class="mini-icon"><use href="#icon-punkalasa"/></svg></div>`;
            else if (iconType === 'image' && customIconImage) gridHtml += `<div class="mini-cell ${colClass}"><img src="${customIconImage}" style="width:70%; height:70%; object-fit:contain;"></div>`;
            else gridHtml += `<div class="mini-cell ${colClass}" style="font-size:1rem;">${customIconText}</div>`;
        } else {
            let finalColClass = colClass;
            if (fixedHolidays2026[cellData.dateString] || customHolidays[cellData.dateString]) finalColClass = 'red-text';
            gridHtml += `<div class="mini-cell ${finalColClass}">${cellData.day}</div>`;
        }
    });
    container.innerHTML = gridHtml + `</div>`;
}

function handleDateClick(dateStr) {
    const title = prompt(`Enter holiday title for ${dateStr}:`, customHolidays[dateStr] || "");
    if (title !== null) { if (title.trim() === "") delete customHolidays[dateStr]; else customHolidays[dateStr] = title; renderAll(); }
}

function handleEmptyClick(id) {
    const text = prompt("Enter note for this empty cell:", emptyCellNotes[id] || "");
    if (text !== null) { if (text.trim() === "") delete emptyCellNotes[id]; else emptyCellNotes[id] = text; renderAll(); }
}

function initIconControls() {
    const selector = document.getElementById('icon-type-selector');
    selector.addEventListener('change', (e) => {
        iconType = e.target.value;
        document.getElementById('icon-image-group').style.display = iconType === 'image' ? 'block' : 'none';
        document.getElementById('icon-text-group').style.display = iconType === 'text' ? 'block' : 'none';
        renderAll();
    });
    document.getElementById('icon-image-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) { const reader = new FileReader(); reader.onload = (e) => { customIconImage = e.target.result; renderAll(); }; reader.readAsDataURL(file); }
    });
    document.getElementById('icon-text-input').addEventListener('input', (e) => { customIconText = e.target.value; renderAll(); });
}

function initControls() {
    const root = document.documentElement;
    
    // --- Update Functions ---
    const updateHeaderStyles = () => {
        root.style.setProperty('--main-title-color', document.getElementById('main-title-color').value);
        root.style.setProperty('--main-title-size', document.getElementById('main-title-size').value + 'rem');
        root.style.setProperty('--main-title-pos-y', document.getElementById('main-title-pos-y').value + '%');
        root.style.setProperty('--sub-title-color', document.getElementById('sub-title-color').value);
        root.style.setProperty('--sub-title-size', document.getElementById('sub-title-size').value + 'rem');
        root.style.setProperty('--sub-title-pos-y', document.getElementById('sub-title-pos-y').value + '%');
        root.style.setProperty('--contact-info-color', document.getElementById('contact-info-color').value);
        root.style.setProperty('--contact-info-size', document.getElementById('contact-info-size').value + 'rem');
        root.style.setProperty('--contact-info-pos-y', document.getElementById('contact-info-pos-y').value + '%');
    };

    const updateHolidayStyles = () => {
        const size = document.getElementById('holiday-text-size').value;
        const gap = document.getElementById('holiday-line-gap').value;
        const weight = document.getElementById('holiday-font-weight').value;
        const outline = document.getElementById('holiday-outline-thick').value;
        const posY = document.getElementById('holiday-pos-y').value;
        let shadow = outline > 0 ? `${outline}px ${outline}px 0 white, -${outline}px -${outline}px 0 white, ${outline}px -${outline}px 0 white, -${outline}px ${outline}px 0 white, 0 ${outline}px 0 white, 0 -${outline}px 0 white, ${outline}px 0 0 white, -${outline}px 0 0 white` : 'none';
        root.style.setProperty('--holiday-font-size', `${size}rem`);
        root.style.setProperty('--holiday-line-height', gap);
        root.style.setProperty('--holiday-font-weight', weight);
        root.style.setProperty('--holiday-text-shadow', shadow);
        root.style.setProperty('--holiday-pos-y', `${posY}%`);
    };

    const updateNoteStyles = () => {
        root.style.setProperty('--note-color', document.getElementById('note-color').value);
        root.style.setProperty('--note-size', document.getElementById('note-size').value + 'rem');
    };

    // --- Reset Functions ---
    const resetHeaderContent = () => {
        document.getElementById('header-text-input').value = "SRI LANKA";
        document.getElementById('subheader-text-input').value = "CALENDAR";
        document.getElementById('contact-text-input').value = "No: 142/B, Makola Road, Kiribathgoda, Sri Lanka.\nTel: 0112 912 013/0112 910 798\nE-mail: tharangaprinters@yahoo.com, Web: www.tharangaprinters.com";
        document.querySelector('.main-title').textContent = "SRI LANKA";
        document.querySelector('.sub-title').textContent = "CALENDAR";
        document.querySelector('.contact-info').innerHTML = document.getElementById('contact-text-input').value.replace(/\n/g, '<br>');
        document.getElementById('header-image-input').value = "";
        document.getElementById('img-opacity').value = 0.3;
        document.getElementById('img-pos-x').value = 50;
        document.getElementById('img-pos-y').value = 50;
        document.getElementById('img-filter').value = "none";
        let img = document.querySelector('.header-bg-image');
        if(img) { img.style.display = 'none'; img.src = ''; img.style.opacity = 0.3; img.style.objectPosition = "50% 50%"; img.style.filter = "none"; img.style.mixBlendMode = "normal"; }
        document.querySelector('.main-header').style.backgroundColor = "transparent";
    };

    const resetHeaderStyling = () => {
        document.getElementById('main-title-color').value = "#ed1c24"; document.getElementById('main-title-size').value = 8; document.getElementById('main-title-pos-y').value = 10;
        document.getElementById('sub-title-color').value = "#000000"; document.getElementById('sub-title-size').value = 3.5; document.getElementById('sub-title-pos-y').value = 50;
        document.getElementById('contact-info-color').value = "#000000"; document.getElementById('contact-info-size').value = 1.1; document.getElementById('contact-info-pos-y').value = 75;
        updateHeaderStyles();
    };

    const resetAppearance = () => {
        document.getElementById('color-red').value = "#ed1c24"; document.getElementById('color-black').value = "#000000"; document.getElementById('color-grey').value = "#666666";
        root.style.setProperty('--primary-red', "#ed1c24"); root.style.setProperty('--text-black', "#000000"); root.style.setProperty('--text-grey', "#666666");
        document.getElementById('holiday-text-size').value = 0.55; document.getElementById('holiday-line-gap').value = 2.0; document.getElementById('holiday-font-weight').value = 700;
        document.getElementById('holiday-outline-thick').value = 1; document.getElementById('holiday-pos-y').value = 50;
        updateHolidayStyles();
    };

    const resetIconsNotes = () => {
        iconType = 'default'; customIconImage = ''; customIconText = '★'; emptyCellNotes = {};
        document.getElementById('icon-type-selector').value = "default"; document.getElementById('icon-image-group').style.display = 'none'; document.getElementById('icon-text-group').style.display = 'none';
        document.getElementById('icon-text-input').value = "★"; document.getElementById('icon-image-input').value = "";
        document.getElementById('note-color').value = "#000000"; document.getElementById('note-size').value = 1.0;
        updateNoteStyles(); renderAll();
    };

    // --- Listeners ---
    document.getElementById('btn-prev').addEventListener('click', () => { currentDate.setDate(1); currentDate.setMonth(currentDate.getMonth() - 1); renderAll(); });
    document.getElementById('btn-next').addEventListener('click', () => { currentDate.setDate(1); currentDate.setMonth(currentDate.getMonth() + 1); renderAll(); });
    document.getElementById('btn-reset').addEventListener('click', () => { currentDate = new Date(2026, 0, 1); resetHeaderContent(); resetHeaderStyling(); resetAppearance(); resetIconsNotes(); renderAll(); });
    document.querySelectorAll('.btn-reset-section').forEach(btn => { btn.addEventListener('click', (e) => {
        const s = e.currentTarget.getAttribute('data-section');
        if(s==='header-content') resetHeaderContent(); if(s==='header-styling') resetHeaderStyling(); if(s==='appearance') resetAppearance(); if(s==='icons-notes') resetIconsNotes();
    });});

    document.getElementById('header-text-input').addEventListener('input', (e) => document.querySelector('.main-title').textContent = e.target.value);
    document.getElementById('subheader-text-input').addEventListener('input', (e) => document.querySelector('.sub-title').textContent = e.target.value);
    document.getElementById('contact-text-input').addEventListener('input', (e) => document.querySelector('.contact-info').innerHTML = e.target.value.replace(/\n/g, '<br>'));
    
    document.getElementById('color-red').addEventListener('input', (e) => root.style.setProperty('--primary-red', e.target.value));
    document.getElementById('color-black').addEventListener('input', (e) => root.style.setProperty('--text-black', e.target.value));
    document.getElementById('color-grey').addEventListener('input', (e) => root.style.setProperty('--text-grey', e.target.value));

    ['main-title-color', 'main-title-size', 'main-title-pos-y', 'sub-title-color', 'sub-title-size', 'sub-title-pos-y', 'contact-info-color', 'contact-info-size', 'contact-info-pos-y'].forEach(id => document.getElementById(id).addEventListener('input', updateHeaderStyles));
    ['holiday-text-size', 'holiday-line-gap', 'holiday-font-weight', 'holiday-outline-thick', 'holiday-pos-y'].forEach(id => document.getElementById(id).addEventListener('input', updateHolidayStyles));
    ['note-color', 'note-size'].forEach(id => document.getElementById(id).addEventListener('input', updateNoteStyles));

    // Unified Print Strategy - Works beautifully across ALL devices!
    // Print Current Month Button
    document.getElementById('btn-print-current').addEventListener('click', () => {
        window.print();
    });

    // Print All 12 Months Button
    document.getElementById('btn-print-all').addEventListener('click', () => {
        const savedDate = new Date(currentDate);
        const printArea = document.getElementById('print-area');
        printArea.innerHTML = '';
        document.body.classList.add('print-all-mode');

        // Generate all 12 months
        for (let i = 0; i < 12; i++) {
            currentDate = new Date(2026, i, 1);
            renderAll();
            const clone = document.querySelector('.page-container').cloneNode(true);
            printArea.appendChild(clone);
        }

        // Trigger print dialog after rendering
        setTimeout(() => {
            window.print();
            restoreState(savedDate);
        }, 500);
    });

    // Image Upload Logic
    document.getElementById('header-image-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                let img = document.querySelector('.header-bg-image') || document.createElement('img');
                img.className = 'header-bg-image'; img.style.position = 'absolute'; img.style.top = '0'; img.style.left = '0'; img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover'; img.style.zIndex = '0'; 
                img.src = e.target.result; img.style.display = 'block';
                if(!document.querySelector('.header-bg-image')) document.querySelector('.main-header').prepend(img);
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('img-opacity').addEventListener('input', (e) => document.querySelector('.header-bg-image').style.opacity = e.target.value);
    document.getElementById('img-pos-x').addEventListener('input', (e) => document.querySelector('.header-bg-image').style.objectPosition = `${e.target.value}% ${document.getElementById('img-pos-y').value}%`);
    document.getElementById('img-pos-y').addEventListener('input', (e) => document.querySelector('.header-bg-image').style.objectPosition = `${document.getElementById('img-pos-x').value}% ${e.target.value}%`);
    document.getElementById('img-filter').addEventListener('change', (e) => {
        const val = e.target.value; const img = document.querySelector('.header-bg-image');
        if (val === 'duotone') { img.style.filter = 'grayscale(100%) contrast(1.2)'; img.style.mixBlendMode = 'multiply'; document.querySelector('.main-header').style.backgroundColor = root.style.getPropertyValue('--primary-red'); } 
        else { img.style.filter = val; img.style.mixBlendMode = 'normal'; document.querySelector('.main-header').style.backgroundColor = 'transparent'; }
    });

    // Initial Sync
    updateHeaderStyles(); updateHolidayStyles(); updateNoteStyles();
}
