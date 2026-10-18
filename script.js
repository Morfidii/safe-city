let map;
let currentTransport = 'car';
let currentRouteType = 'fast';
let currentSelectedDistrict = 'Almaly';
let sosTargetMode = 'self';

window.addEventListener('DOMContentLoaded', () => {
    // Initialize MapLibre vector map centered on Almaty
    map = new maplibregl.Map({
        container: 'map',
        style: 'https://tiles.openfreemap.org/styles/positron',
        center: [76.889709, 43.238949],
        zoom: 13,
        attributionControl: false
    });

    map.on('load', () => {
        map.resize();

        // 1. Crime Marker
        const crimeEl = document.createElement('div');
        crimeEl.className = 'map-crime-marker';
        crimeEl.style.width = '24px';
        crimeEl.style.height = '24px';
        crimeEl.style.backgroundColor = '#E53E3E';
        crimeEl.style.border = '3px solid #ffffff';
        crimeEl.style.borderRadius = '50%';
        crimeEl.style.cursor = 'pointer';
        crimeEl.style.pointerEvents = 'auto';
        crimeEl.style.boxShadow = '0 0 10px rgba(0,0,0,0.4)';

        crimeEl.addEventListener('click', (e) => {
            e.stopPropagation();
            openReportDetailWithData('Public Intoxication and Drinking in Prohibited Places near Auezov street.', '10/23');
        });

        new maplibregl.Marker({ element: crimeEl })
            .setLngLat([76.885, 43.240])
            .addTo(map);

        // 2. District Badge
        const districtEl = document.createElement('div');
        districtEl.className = 'map-district-badge';
        districtEl.style.pointerEvents = 'auto';
        districtEl.innerHTML = '<span class="badge bg-primary px-2 py-1 shadow" style="cursor:pointer; font-size:12px;">Bostandyk District (80/100)</span>';
        
        districtEl.addEventListener('click', (e) => {
            e.stopPropagation();
            openDistrictMini('Bostandyk');
        });

        new maplibregl.Marker({ element: districtEl })
            .setLngLat([76.895, 43.235])
            .addTo(map);
    });
});

// Switch tabs and bottom sheets in English
function switchTab(tab) {
    const routingView = document.getElementById('routingView');
    const reportsHubView = document.getElementById('reportsHubView');
    const emergencyView = document.getElementById('emergencyView');
    const districtMiniView = document.getElementById('districtMiniView');
    const districtStatsView = document.getElementById('districtStatsView');
    const reportFormView = document.getElementById('reportFormView');
    const reportDetailView = document.getElementById('reportDetailView');
    const settingsView = document.getElementById('settingsView');
    const sosConfirmView = document.getElementById('sosConfirmView');
    const loginView = document.getElementById('loginView');
    const registerView = document.getElementById('registerView');

    // Hide full-screen auth views when switching to main map tabs
    if(loginView) loginView.style.display = 'none';
    if(registerView) registerView.style.display = 'none';
    if(settingsView) {
        settingsView.classList.remove('show');
        settingsView.style.display = 'none';
    }

    [routingView, reportsHubView, emergencyView, districtMiniView, districtStatsView, reportFormView, reportDetailView, sosConfirmView].forEach(v => {
        if (v) {
            v.classList.remove('show');
            v.style.display = 'none';
        }
    });

    document.querySelectorAll('.nav-item-custom').forEach(n => n.classList.remove('active'));

    if (tab === 'rou') {
        routingView.style.display = 'block';
        setTimeout(() => routingView.classList.add('show'), 10);
        document.getElementById('navRou').classList.add('active');
    } else if (tab === 'rep') {
        reportsHubView.style.display = 'block';
        setTimeout(() => reportsHubView.classList.add('show'), 10);
        document.getElementById('navRep').classList.add('active');
    } else if (tab === 'eme') {
        emergencyView.style.display = 'flex';
        setTimeout(() => emergencyView.classList.add('show'), 10);
        document.getElementById('navEme').classList.add('active');
    } else if (tab === 'districtMini') {
        districtMiniView.style.display = 'block';
        setTimeout(() => districtMiniView.classList.add('show'), 10);
    } else if (tab === 'districtStats') {
        districtStatsView.style.display = 'block';
        setTimeout(() => districtStatsView.classList.add('show'), 10);
    } else if (tab === 'reportForm') {
        reportFormView.style.display = 'block';
        setTimeout(() => reportFormView.classList.add('show'), 10);
    } else if (tab === 'reportDetail') {
        reportDetailView.style.display = 'block';
        setTimeout(() => reportDetailView.classList.add('show'), 10);
    } else if (tab === 'sosConfirm') {
        sosConfirmView.style.display = 'block';
        setTimeout(() => sosConfirmView.classList.add('show'), 10);
    } else {
        document.getElementById('navMap').classList.add('active');
    }

    setTimeout(() => {
        if (map) map.resize();
    }, 300);
}

// Authentication Views Control (Login / Registration)
function switchAuthView(viewName) {
    const loginView = document.getElementById('loginView');
    const registerView = document.getElementById('registerView');
    if (viewName === 'register') {
        loginView.style.display = 'none';
        registerView.style.display = 'flex';
    } else {
        registerView.style.display = 'none';
        loginView.style.display = 'flex';
    }
}

function completeLogin() {
    alert('Successfully authorized in Safe City Almaty!');
    document.getElementById('loginView').style.display = 'none';
    switchTab('map');
}

// Settings / Profile full-screen view
function openSettingsView() {
    const settingsView = document.getElementById('settingsView');
    settingsView.style.display = 'flex';
    setTimeout(() => settingsView.classList.add('show'), 10);
}

function toggleLanguage() {
    alert('App language switched between English and Russian.');
}

// SOS Emergency Broadcast Window
function openSosConfirm() {
    switchTab('sosConfirm');
}

function setSosTarget(target) {
    sosTargetMode = target;
    const btnOther = document.getElementById('sosOtherBtn');
    const btnSelf = document.getElementById('sosSelfBtn');
    if (target === 'other') {
        btnOther.classList.add('active', 'btn-danger');
        btnOther.classList.remove('btn-outline-secondary');
        btnSelf.classList.remove('active', 'btn-danger');
        btnSelf.classList.add('btn-outline-secondary');
    } else {
        btnSelf.classList.add('active', 'btn-danger');
        btnSelf.classList.remove('btn-outline-secondary');
        btnOther.classList.remove('active', 'btn-danger');
        btnOther.classList.add('btn-outline-secondary');
    }
}

function executeSosCall() {
    alert(`SOS signal broadcasted successfully [${sosTargetMode.toUpperCase()}]! Current GPS address confirmed and transmitted to emergency responders and nearby users.`);
    switchTab('map');
}

// Route Options
function setTransport(mode, btn) {
    document.querySelectorAll('.transport-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTransport = mode;
}

function setRouteType(type) {
    currentRouteType = type;
    if (type === 'safe') {
        document.getElementById('cardSafe').classList.add('selected');
        document.getElementById('cardFast').classList.remove('selected');
    } else {
        document.getElementById('cardFast').classList.add('selected');
        document.getElementById('cardSafe').classList.remove('selected');
    }
}

function calculateRoute() {
    alert(`Calculating ${currentRouteType} route for [${currentTransport.toUpperCase()}] avoiding high-risk zones.`);
    switchTab('map');
}

// Emergency Services Filtering & Presets
function filterByService(serviceNum) {
    const items = document.querySelectorAll('.emergency-item');
    items.forEach(item => {
        const services = item.getAttribute('data-services');
        if (services.includes(serviceNum.toString())) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function resetEmergencyFilter() {
    document.getElementById('emergencySearch').value = '';
    const items = document.querySelectorAll('.emergency-item');
    items.forEach(item => item.style.display = 'flex');
}

function filterEmergencyList() {
    const query = document.getElementById('emergencySearch').value.toLowerCase();
    const items = document.querySelectorAll('.emergency-item');
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function applyPreset(presetType) {
    resetEmergencyFilter();
    const items = document.querySelectorAll('.emergency-item');
    if (presetType === 'tastak') {
        items.forEach(item => {
            const text = item.textContent;
            if (text.includes('Public Intoxication') || text.includes('Theft') || text.includes('Vandalism')) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        alert('Preset applied: Tastak sector high-priority offenses.');
    } else if (presetType === 'recent') {
        items.forEach(item => {
            const text = item.textContent;
            if (text.includes('Robbery') || text.includes('Assault') || text.includes('Manslaughter')) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        alert('Preset applied: Past 24:00 critical incidents.');
    }
}

function dispatchEmergency(articleName, servicesCode) {
    alert(`Emergency dispatch triggered for article: "${articleName}" -> Units assigned: [${servicesCode}]`);
    switchTab('map');
}

// District Mini-Window & Stats
function openDistrictMini(districtName) {
    currentSelectedDistrict = districtName;
    document.getElementById('miniDistrictTitle').textContent = districtName.toUpperCase();
    switchTab('districtMini');
}

function openFullDistrictStats() {
    document.getElementById('districtTitle').textContent = `DISTRICT: ${currentSelectedDistrict.toUpperCase()}`;
    switchTab('districtStats');
}

function setDistrictMode(mode) {
    const btnStats = document.getElementById('btnModeStats');
    const btnList = document.getElementById('btnModeList');
    const contentStats = document.getElementById('modeStatsContent');
    const contentList = document.getElementById('modeListContent');

    if (mode === 'stats') {
        btnStats.classList.add('active', 'btn-primary');
        btnStats.classList.remove('btn-outline-primary');
        btnList.classList.remove('active', 'btn-primary');
        btnList.classList.add('btn-outline-primary');
        contentStats.style.display = 'block';
        contentList.style.display = 'none';
    } else {
        btnList.classList.add('active', 'btn-primary');
        btnList.classList.remove('btn-outline-primary');
        btnStats.classList.remove('active', 'btn-primary');
        btnStats.classList.add('btn-outline-primary');
        contentList.style.display = 'block';
        contentStats.style.display = 'none';
    }
}

function openReportsHub() {
    switchTab('rep');
}

function openReportForm() {
    switchTab('reportForm');
}

function openReportDetail() {
    openReportDetailWithData('Public Intoxication and Drinking in Prohibited Places', '10/23');
}

function openReportDetailWithData(reportText, reportDate) {
    document.getElementById('reportDetailText').value = reportText;
    document.getElementById('reportDetailDate').textContent = `DATE ${reportDate}`;
    switchTab('reportDetail');
}

function voteReport(type) {
    if (type === 'up') {
        alert('You upvoted this incident report.');
    } else {
        alert('You downvoted this incident report.');
    }
}

function submitReport() {
    alert('Report successfully submitted to emergency moderation queue!');
    switchTab('map');
}