const API = "https://wanderlust-backend-ao05.onrender.com/api";
let state = {
  user: null, token: null,
  destinations: [], wishlist: [],
  currentDest: null, currentTab: 'overview',
  filters: { category: '', continent: '', sort: '', search: '' }
};

// ====== API HELPERS ======
async function api(endpoint, opts = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
  const res = await fetch(API + endpoint, { headers, ...opts });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ====== AUTH ======
function loadAuth() {
  const token = localStorage.getItem('wl_token');
  const user = localStorage.getItem('wl_user');
  if (token && user) { state.token = token; state.user = JSON.parse(user); updateNavUser(); }
}

function saveAuth(token, user) {
  state.token = token; state.user = user;
  localStorage.setItem('wl_token', token);
  localStorage.setItem('wl_user', JSON.stringify(user));
  updateNavUser();
}

function logout() {
  state.token = null; state.user = null; state.wishlist = [];
  localStorage.removeItem('wl_token'); localStorage.removeItem('wl_user');
  updateNavUser();
  showPage('home');
  showToast('Logged out successfully', 'success');
  closeDropdown();
}

function updateNavUser() {
  const navActions = document.getElementById('navActions');
  if (state.user) {
    navActions.innerHTML = `
      <div class="user-menu">
        <button class="user-btn" onclick="toggleDropdown()">
          <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=${state.user.name}" alt="avatar">
          ${state.user.name.split(' ')[0]} ▾
        </button>
        <div class="user-dropdown" id="userDropdown">
          <a onclick="showPage('wishlist')">❤️ Wishlist</a>
          <a onclick="showPage('bookings')">🧳 My Bookings</a>
          <div class="divider"></div>
          <button onclick="logout()">🚪 Log Out</button>
        </div>
      </div>
    `;
  } else {
    navActions.innerHTML = `
      <button class="btn btn-outline btn-sm" onclick="openAuthModal('login')">Log In</button>
      <button class="btn btn-primary btn-sm" onclick="openAuthModal('register')">Sign Up</button>
    `;
  }
}

function toggleDropdown() {
  document.getElementById('userDropdown')?.classList.toggle('open');
}

function closeDropdown() {
  document.getElementById('userDropdown')?.classList.remove('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.user-menu')) closeDropdown();
});

// ====== PAGES ======
function showPage(page) {
  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page)?.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'explore') loadDestinations();
  if (page === 'wishlist') loadWishlist();
  if (page === 'bookings') loadBookings();
}

// ====== DESTINATIONS ======
async function loadDestinations() {
  const grid = document.getElementById('destinationsGrid');
  grid.innerHTML = '<div class="spinner"></div>';

  const params = new URLSearchParams();
  if (state.filters.search) params.set('search', state.filters.search);
  if (state.filters.category) params.set('category', state.filters.category);
  if (state.filters.continent) params.set('continent', state.filters.continent);
  if (state.filters.sort) params.set('sort', state.filters.sort);

  try {
    const data = await api('/destinations?' + params);
    state.destinations = data.destinations;
    renderDestinations(data.destinations);
  } catch (e) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-light)">Could not load destinations</p>';
  }
}

async function loadFeatured() {
  try {
    const data = await api('/destinations/featured/top');
    renderFeatured(data);
  } catch {}
}

function renderDestinations(dests) {
  const grid = document.getElementById('destinationsGrid');
  if (!dests.length) {
    grid.innerHTML = '<div class="empty-state"><div class="emoji">🔍</div><h3>No destinations found</h3><p>Try adjusting your filters</p></div>';
    return;
  }
  grid.innerHTML = dests.map(dest => destCard(dest)).join('');
}

function destCard(dest) {
  const saved = state.wishlist.includes(dest.id);
  const badge = dest.tags?.[0];
  const badgeClass = badge === 'Trending' ? 'badge-trending' : badge === 'Luxury' ? 'badge-luxury' : badge === 'Popular' ? 'badge-popular' : 'badge-default';
  return `
    <div class="dest-card" onclick="openDest('${dest.id}')">
      <div class="dest-card-img">
        <img src="${dest.image}" alt="${dest.name}" loading="lazy">
        <div class="dest-card-badges">
          ${dest.tags?.map((t, i) => `<span class="badge ${i === 0 ? badgeClass : 'badge-default'}">${t}</span>`).join('') || ''}
        </div>
        <button class="wishlist-btn ${saved ? 'saved' : ''}" onclick="toggleWishlist(event,'${dest.id}')">
          ${saved ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="dest-card-body">
        <div class="dest-location">📍 ${dest.country} · ${dest.continent}</div>
        <h3 class="dest-name">${dest.name}</h3>
        <div class="dest-meta">
          <div>
            <div class="dest-rating">⭐ ${dest.rating} <span class="dest-reviews">(${dest.reviews.toLocaleString()})</span></div>
            <div style="font-size:0.8rem;color:var(--text-light);margin-top:2px">🕐 ${dest.duration}</div>
          </div>
          <div class="dest-price">
            <div>
              <div class="price-from">from</div>
              <div><span class="price-amount">$${dest.price.toLocaleString()}</span> <span class="price-per">/person</span></div>
            </div>
          </div>
        </div>
        <button class="btn btn-primary" style="width:100%" onclick="openDest('${dest.id}')">Explore →</button>
      </div>
    </div>
  `;
}

function renderFeatured(dests) {
  const grid = document.getElementById('featuredGrid');
  if (!grid || !dests.length) return;
  grid.innerHTML = dests.map((dest, i) => `
    <div class="featured-card" onclick="openDest('${dest.id}')">
      <img src="${dest.image}" alt="${dest.name}" loading="lazy">
      <div class="featured-card-overlay">
        <h3>${dest.name}</h3>
        <p>📍 ${dest.country} · ⭐ ${dest.rating} · from $${dest.price.toLocaleString()}</p>
      </div>
    </div>
  `).join('');
}

// ====== SEARCH & FILTERS ======
function handleSearch(e) {
  if (e.key === 'Enter' || e.type === 'click') {
    state.filters.search = document.getElementById('searchInput').value;
    showPage('explore');
  }
}

function setFilter(key, val) {
  state.filters[key] = state.filters[key] === val ? '' : val;
  document.querySelectorAll('.filter-chip').forEach(c => {
    if (c.dataset.filter === key) c.classList.toggle('active', c.dataset.val === state.filters[key]);
  });
  loadDestinations();
}

function setSort(val) {
  state.filters.sort = val;
  loadDestinations();
}

// ====== DESTINATION MODAL ======
async function openDest(id) {
  try {
    const dest = await api('/destinations/' + id);
    state.currentDest = dest;
    state.currentTab = 'overview';
    renderDestModal(dest);
    document.getElementById('destModal').classList.add('open');
    document.body.style.overflow = 'hidden';
    // Load reviews
    loadReviews(id);
  } catch (e) {
    showToast('Could not load destination', 'error');
  }
}

function closeDest() {
  document.getElementById('destModal').classList.remove('open');
  document.body.style.overflow = '';
}

function renderDestModal(dest) {
  document.getElementById('destModal').innerHTML = `
    <div class="modal">
      <div class="modal-hero">
        <img src="${dest.image}" alt="${dest.name}">
        <div class="modal-hero-overlay">
          <h2>${dest.name}</h2>
          <p>📍 ${dest.country}, ${dest.continent} · ⭐ ${dest.rating} (${dest.reviews.toLocaleString()} reviews) · 🕐 ${dest.duration}</p>
        </div>
        <button class="modal-close" onclick="closeDest()">✕</button>
      </div>
      <div class="modal-body">
        <div class="modal-grid">
          <div>
            <div class="info-tabs">
              <button class="info-tab active" onclick="switchTab('overview', this)">Overview</button>
              <button class="info-tab" onclick="switchTab('highlights', this)">Highlights</button>
              <button class="info-tab" onclick="switchTab('gallery', this)">Gallery</button>
              <button class="info-tab" onclick="switchTab('reviews', this)">Reviews</button>
            </div>
            
            <div id="tab-overview">
              <div class="weather-widget">
                <div class="weather-icon">🌤️</div>
                <div class="weather-info">
                  <h5>${dest.weather.temp} · ${dest.weather.season}</h5>
                  <p>Best time to visit: ${dest.weather.bestTime}</p>
                </div>
              </div>
              <p style="color:var(--text);line-height:1.8;margin-bottom:20px">${dest.description}</p>
              <h4 style="margin-bottom:12px">What's Included</h4>
              <ul class="included-list">
                ${dest.included.map(i => `<li>${i}</li>`).join('')}
              </ul>
            </div>
            
            <div id="tab-highlights" style="display:none">
              <ul class="highlights-list">
                ${dest.highlights.map(h => `<li>${h}</li>`).join('')}
              </ul>
            </div>
            
            <div id="tab-gallery" style="display:none">
              <div class="gallery-grid">
                ${[dest.image, ...(dest.gallery || [])].slice(0, 6).map(img => 
                  `<img src="${img}" alt="Gallery" loading="lazy">`
                ).join('')}
              </div>
            </div>
            
            <div id="tab-reviews" style="display:none">
              <div id="reviewsList"><div class="spinner"></div></div>
              ${state.user ? `
                <div style="margin-top:24px;padding-top:20px;border-top:1px solid #f3f4f6">
                  <h4 style="margin-bottom:12px">Write a Review</h4>
                  <div class="form-group">
                    <label>Rating</label>
                    <select id="reviewRating">
                      <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                      <option value="4">⭐⭐⭐⭐ Great</option>
                      <option value="3">⭐⭐⭐ Good</option>
                      <option value="2">⭐⭐ Fair</option>
                      <option value="1">⭐ Poor</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Your Experience</label>
                    <textarea id="reviewComment" rows="3" placeholder="Share your experience..."></textarea>
                  </div>
                  <button class="btn btn-primary" onclick="submitReview('${dest.id}')">Submit Review</button>
                </div>
              ` : `<p style="margin-top:16px;color:var(--text-light)"><a onclick="openAuthModal('login')" style="color:var(--ocean);cursor:pointer">Log in</a> to write a review</p>`}
            </div>
          </div>
          
          <div>
            <div class="booking-card">
              <h4>Starting from</h4>
              <div class="big-price">$${dest.price.toLocaleString()} <span>/person</span></div>
              
              ${state.user ? `
                <div class="form-group">
                  <label>Check-in Date</label>
                  <input type="date" id="bookCheckIn" min="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                  <label>Check-out Date</label>
                  <input type="date" id="bookCheckOut">
                </div>
                <div class="form-group">
                  <label>Travelers</label>
                  <select id="bookTravelers">
                    ${[1,2,3,4,5,6,7,8].map(n => `<option value="${n}">${n} ${n===1?'traveler':'travelers'}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label>Special Requests</label>
                  <textarea id="bookRequests" rows="2" placeholder="Any special requests?"></textarea>
                </div>
                <div class="booking-summary" id="bookingSummary">
                  <div class="booking-summary-row"><span>Base price</span><span>$${dest.price.toLocaleString()} × 1</span></div>
                  <div class="booking-summary-row total"><span>Total</span><span id="bookTotal">$${dest.price.toLocaleString()}</span></div>
                </div>
                <button class="btn btn-coral btn-lg" style="width:100%;margin-top:16px" onclick="bookNow('${dest.id}')">🏖️ Book Now</button>
              ` : `
                <p style="color:var(--text-light);margin-bottom:16px;font-size:0.9rem">Log in to book this trip</p>
                <button class="btn btn-primary btn-lg" style="width:100%" onclick="openAuthModal('login')">Log In to Book</button>
                <button class="btn btn-outline btn-lg" style="width:100%;margin-top:10px" onclick="openAuthModal('register')">Create Account</button>
              `}
              
              <button class="btn" style="width:100%;margin-top:10px;background:var(--sand);color:var(--ocean)" onclick="toggleWishlist(event,'${dest.id}')">
                ${state.wishlist.includes(dest.id) ? '❤️ Saved to Wishlist' : '🤍 Save to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Update total on input
  ['bookTravelers','bookCheckIn','bookCheckOut'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', updateBookingTotal);
  });
}

function switchTab(tab, btn) {
  document.querySelectorAll('.info-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  ['overview','highlights','gallery','reviews'].forEach(t => {
    const el = document.getElementById('tab-' + t);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
}

function updateBookingTotal() {
  const travelers = parseInt(document.getElementById('bookTravelers')?.value || 1);
  const price = state.currentDest?.price || 0;
  const total = price * travelers;
  const totalEl = document.getElementById('bookTotal');
  if (totalEl) totalEl.textContent = '$' + total.toLocaleString();
}

// ====== BOOKING ======
async function bookNow(destId) {
  const checkIn = document.getElementById('bookCheckIn')?.value;
  const checkOut = document.getElementById('bookCheckOut')?.value;
  const travelers = document.getElementById('bookTravelers')?.value;
  const requests = document.getElementById('bookRequests')?.value;

  if (!checkIn || !checkOut) return showToast('Please select travel dates', 'error');
  if (new Date(checkOut) <= new Date(checkIn)) return showToast('Check-out must be after check-in', 'error');

  try {
    const booking = await api('/bookings', {
      method: 'POST',
      body: JSON.stringify({ destinationId: destId, travelers, startDate: checkIn, endDate: checkOut, specialRequests: requests })
    });
    closeDest();
    showToast('🎉 Booking confirmed! Ref: ' + booking.bookingRef, 'success');
    showPage('bookings');
  } catch (e) {
    showToast(e.message, 'error');
  }
}

// ====== WISHLIST ======
async function toggleWishlist(e, destId) {
  e.stopPropagation();
  if (!state.user) { openAuthModal('login'); return; }
  try {
    const data = await api('/wishlist/toggle/' + destId, { method: 'POST' });
    if (data.saved) {
      state.wishlist.push(destId);
      showToast('❤️ Added to wishlist!', 'success');
    } else {
      state.wishlist = state.wishlist.filter(id => id !== destId);
      showToast('Removed from wishlist', 'success');
    }
    // Update buttons
    document.querySelectorAll(`.wishlist-btn`).forEach(btn => {
      if (btn.getAttribute('onclick')?.includes(destId)) {
        btn.textContent = data.saved ? '❤️' : '🤍';
        btn.classList.toggle('saved', data.saved);
      }
    });
    renderDestinations(state.destinations);
  } catch (e) {
    showToast('Failed to update wishlist', 'error');
  }
}

async function loadWishlist() {
  if (!state.user) { showPage('home'); openAuthModal('login'); return; }
  const container = document.getElementById('wishlistGrid');
  container.innerHTML = '<div class="spinner"></div>';
  try {
    const items = await api('/wishlist');
    state.wishlist = items.map(i => i.id);
    if (!items.length) {
      container.innerHTML = '<div class="empty-state"><div class="emoji">❤️</div><h3>Your wishlist is empty</h3><p>Save destinations you love to plan future trips!</p><br><button class="btn btn-primary" onclick="showPage(\'explore\')">Explore Destinations</button></div>';
      return;
    }
    container.innerHTML = `<div class="destinations-grid">${items.map(d => destCard(d)).join('')}</div>`;
  } catch { container.innerHTML = '<p>Could not load wishlist</p>'; }
}

// ====== BOOKINGS ======
async function loadBookings() {
  if (!state.user) { showPage('home'); openAuthModal('login'); return; }
  const container = document.getElementById('bookingsList');
  container.innerHTML = '<div class="spinner"></div>';
  try {
    const bookings = await api('/bookings/my');
    if (!bookings.length) {
      container.innerHTML = '<div class="empty-state"><div class="emoji">🧳</div><h3>No bookings yet</h3><p>Start exploring and book your dream trip!</p><br><button class="btn btn-primary" onclick="showPage(\'explore\')">Explore Destinations</button></div>';
      return;
    }
    container.innerHTML = bookings.map(b => `
      <div class="booking-item">
        <img src="${b.destination.image}" alt="${b.destination.name}">
        <div class="booking-info">
          <div class="booking-ref">Booking Ref: <strong>${b.bookingRef}</strong></div>
          <div class="booking-name">${b.destination.name}, ${b.destination.country}</div>
          <div class="booking-dates">📅 ${b.startDate} → ${b.endDate} · 👥 ${b.travelers} traveler${b.travelers > 1 ? 's' : ''} · ${b.nights} nights</div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <span class="status-badge status-${b.status}">${b.status.toUpperCase()}</span>
          <div style="font-family:'Playfair Display',serif;font-size:1.5rem;color:var(--ocean);margin-top:8px">$${b.total.toLocaleString()}</div>
          ${b.status === 'confirmed' ? `<button class="btn btn-sm" style="margin-top:8px;background:#fee2e2;color:#991b1b" onclick="cancelBooking('${b.id}')">Cancel</button>` : ''}
        </div>
      </div>
    `).join('');
  } catch { container.innerHTML = '<p>Could not load bookings</p>'; }
}

async function cancelBooking(id) {
  if (!confirm('Cancel this booking?')) return;
  try {
    await api('/bookings/' + id + '/cancel', { method: 'PATCH' });
    showToast('Booking cancelled', 'success');
    loadBookings();
  } catch { showToast('Could not cancel booking', 'error'); }
}

// ====== REVIEWS ======
async function loadReviews(destId) {
  const container = document.getElementById('reviewsList');
  if (!container) return;
  try {
    const reviews = await api('/reviews/' + destId);
    if (!reviews.length) { container.innerHTML = '<p style="color:var(--text-light)">No reviews yet. Be the first!</p>'; return; }
    container.innerHTML = reviews.map(r => `
      <div class="review-item">
        <div class="review-header">
          <img src="${r.avatar}" alt="${r.userName}" class="review-avatar">
          <div>
            <div class="review-author-name">${r.userName}</div>
            <div class="review-date">${r.date}</div>
          </div>
          <div class="review-stars" style="margin-left:auto">${'⭐'.repeat(r.rating)}</div>
        </div>
        <p class="review-text">${r.comment}</p>
      </div>
    `).join('');
  } catch {}
}

async function submitReview(destId) {
  const rating = document.getElementById('reviewRating')?.value;
  const comment = document.getElementById('reviewComment')?.value;
  if (!comment.trim()) return showToast('Please write a comment', 'error');
  try {
    await api('/reviews/' + destId, { method: 'POST', body: JSON.stringify({ rating, comment }) });
    showToast('Review submitted! Thanks!', 'success');
    loadReviews(destId);
    document.getElementById('reviewComment').value = '';
  } catch (e) { showToast(e.message, 'error'); }
}

// ====== AUTH MODAL ======
function openAuthModal(mode) {
  document.getElementById('authModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  setAuthMode(mode);
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('open');
  document.body.style.overflow = '';
}

function setAuthMode(mode) {
  const header = document.getElementById('authHeader');
  const body = document.getElementById('authBody');
  if (mode === 'login') {
    header.innerHTML = `<h2>Welcome Back ✈️</h2><p>Log in to continue your adventures</p>`;
    body.innerHTML = `
      <div class="form-group"><label>Email</label><input type="email" id="authEmail" placeholder="you@email.com"></div>
      <div class="form-group"><label>Password</label><input type="password" id="authPassword" placeholder="Your password"></div>
      <button class="btn btn-primary btn-lg" style="width:100%" onclick="submitLogin()">Log In</button>
      <div class="auth-switch">Don't have an account? <a onclick="setAuthMode('register')">Sign Up</a></div>
    `;
  } else {
    header.innerHTML = `<h2>Join Wanderlust 🌍</h2><p>Create your account and start exploring</p>`;
    body.innerHTML = `
      <div class="form-group"><label>Full Name</label><input type="text" id="authName" placeholder="Your name"></div>
      <div class="form-group"><label>Email</label><input type="email" id="authEmail" placeholder="you@email.com"></div>
      <div class="form-group"><label>Password</label><input type="password" id="authPassword" placeholder="Choose a password"></div>
      <button class="btn btn-primary btn-lg" style="width:100%" onclick="submitRegister()">Create Account</button>
      <div class="auth-switch">Already have an account? <a onclick="setAuthMode('login')">Log In</a></div>
    `;
  }
}

async function submitLogin() {
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;
  if (!email || !password) return showToast('Please fill all fields', 'error');
  try {
    const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    saveAuth(data.token, data.user);
    closeAuthModal();
    showToast('Welcome back, ' + data.user.name + '! 🎉', 'success');
  } catch (e) { showToast(e.message, 'error'); }
}

async function submitRegister() {
  const name = document.getElementById('authName').value;
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;
  if (!name || !email || !password) return showToast('Please fill all fields', 'error');
  try {
    const data = await api('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
    saveAuth(data.token, data.user);
    closeAuthModal();
    showToast('Welcome to Wanderlust, ' + data.user.name + '! 🌍', 'success');
  } catch (e) { showToast(e.message, 'error'); }
}

// ====== TOAST ======
function showToast(msg, type = 'default') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ====== NEWSLETTER ======
function subscribeNewsletter() {
  const email = document.getElementById('newsletterEmail').value;
  if (!email) return showToast('Please enter your email', 'error');
  showToast('🎉 Subscribed! Welcome to the Wanderlust community!', 'success');
  document.getElementById('newsletterEmail').value = '';
}

// ====== INIT ======
window.addEventListener('scroll', () => {
  document.querySelector('.navbar').classList.toggle('scrolled', window.scrollY > 20);
});

document.addEventListener('DOMContentLoaded', () => {
  loadAuth();
  showPage('home');
  loadFeatured();
  loadDestinations();
});
