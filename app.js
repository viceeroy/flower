/**
 * AURA & FLORA — Haute Floristry & Botanical AI Studio
 * Client-Side Interactive Engine & Gemini Model Integration
 */

// --- Botanical Arrangement Database & Preset Recipes ---
const BOTANICAL_PRESETS = {
  'midnight-dahlia': {
    id: 'midnight-dahlia',
    title: 'Midnight Dahlia & Noir Baccara',
    family: 'Asteraceae & Rosaceae Haute',
    price: 185,
    prompt: 'Moody Parisian midnight dahlias with velvet black baccara roses, seeded eucalyptus, and dramatic chiaroscuro candlelight',
    image: 'assets/floral-midnight-dahlia.png',
    tags: ['Deep Velvet Noir', 'Seeded Eucalyptus', 'Artisanal Stone Urn', 'Evening Chiaroscuro'],
    stems: 28,
    category: 'romance'
  },
  'champagne-peony': {
    id: 'champagne-peony',
    title: 'Champagne Peony Cloud',
    family: 'Paeoniaceae & Rosa Odorata',
    price: 210,
    prompt: 'Lush Parisian blush and champagne peonies, off-white garden roses, and delicate trailing sweet peas in glowing morning light',
    image: 'assets/floral-champagne-peony.png',
    tags: ['Blush Peony', 'Cream Garden Roses', 'Sweet Pea Vines', 'Morning Sun Glow'],
    stems: 34,
    category: 'romance'
  },
  'ethereal-meadow': {
    id: 'ethereal-meadow',
    title: 'Ethereal Wild Meadow Mist',
    family: 'Delphinium & Matricaria Wild',
    price: 160,
    prompt: 'Wild meadow arrangement of soft sky-blue delphinium, chamomile daisies, French lavender, and delicate grasses in dewy garden light',
    image: 'assets/floral-ethereal-meadow.png',
    tags: ['Sky Delphinium', 'Wild Chamomile', 'Provence Lavender', 'Morning Dew'],
    stems: 42,
    category: 'ethereal'
  },
  'golden-ranunculus': {
    id: 'golden-ranunculus',
    title: 'Golden Hour Ranunculus',
    family: 'Ranunculaceae & Fluted Amber',
    price: 195,
    prompt: 'Vibrant arrangement of golden amber ranunculus, peach spray roses, honey poppies, and dried golden bunny tails in warm sunset light',
    image: 'assets/floral-golden-ranunculus.png',
    tags: ['Amber Ranunculus', 'Peach Garden Rose', 'Sunset Honey Poppies', 'Fluted Glass'],
    stems: 30,
    category: 'solstice'
  }
};

// --- Application State ---
const State = {
  activePreset: 'midnight-dahlia',
  cart: [],
  apiKey: localStorage.getItem('aura_flora_gemini_api_key') || '',
  ambientAudioPlaying: false,
  audioContext: null,
  audioNodes: []
};

// --- DOM Element References ---
const Elements = {
  // Navigation & Badges
  apiModalBtn: document.getElementById('api-modal-btn'),
  apiStatusBadge: document.getElementById('api-status-badge'),
  cartToggleBtn: document.getElementById('cart-toggle-btn'),
  cartCounter: document.getElementById('cart-counter'),
  ambientSoundBtn: document.getElementById('ambient-sound-btn'),
  
  // Hero Video
  heroVideo: document.getElementById('hero-video'),
  videoToggleBtn: document.getElementById('video-playback-toggle'),
  videoIconPause: document.getElementById('video-icon-pause'),
  videoIconPlay: document.getElementById('video-icon-play'),
  videoProgressBar: document.getElementById('video-progress-bar'),

  // Studio Interactive Console
  promptInput: document.getElementById('studio-prompt-input'),
  generateBtn: document.getElementById('generate-studio-btn'),
  recipeChips: document.querySelectorAll('.recipe-chip'),
  studioMainImage: document.getElementById('studio-main-image'),
  renderLoadingOverlay: document.getElementById('render-loading-overlay'),
  loaderStatusText: document.getElementById('loader-status-text'),
  btnFullscreenRender: document.getElementById('btn-fullscreen-render'),
  displayRecipeTitle: document.getElementById('display-recipe-title'),
  displayRecipeFamily: document.getElementById('display-recipe-family'),
  displayRecipePrice: document.getElementById('display-recipe-price'),
  displayRecipeTags: document.getElementById('display-recipe-tags'),

  // Studio Video Player
  studioBloomVideo: document.getElementById('studio-bloom-video'),
  bloomSpeedRange: document.getElementById('bloom-speed-range'),
  speedVal: document.getElementById('speed-val'),
  videoTimestamp: document.getElementById('video-timestamp'),
  toggleVideoLoop: document.getElementById('toggle-video-loop'),
  studioAddCartBtn: document.getElementById('studio-add-cart-btn'),
  studioDownloadRenderBtn: document.getElementById('studio-download-render-btn'),

  // Catalog
  catalogTabs: document.querySelectorAll('.catalog-tab'),
  flowerCards: document.querySelectorAll('.flower-card'),
  quickViewBtns: document.querySelectorAll('.quick-view-btn'),
  addToBagBtns: document.querySelectorAll('.add-to-bag-btn'),

  // Cart Drawer
  cartDrawer: document.getElementById('cart-drawer'),
  cartOverlay: document.getElementById('cart-drawer-overlay'),
  closeCartBtn: document.getElementById('close-cart-btn'),
  cartItemsList: document.getElementById('cart-items-list'),
  cartSubtotal: document.getElementById('cart-subtotal'),
  checkoutBtn: document.getElementById('checkout-btn'),

  // API Modal
  apiModal: document.getElementById('api-modal'),
  apiModalOverlay: document.getElementById('api-modal-overlay'),
  closeApiModalBtn: document.getElementById('close-api-modal-btn'),
  apiKeyInput: document.getElementById('gemini-api-key-input'),
  saveApiKeyBtn: document.getElementById('save-api-key-btn'),
  clearApiKeyBtn: document.getElementById('clear-api-key-btn'),

  // Concierge & Toasts
  conciergeForm: document.getElementById('concierge-form'),
  toastContainer: document.getElementById('toast-container'),
  petalCanvas: document.getElementById('petal-canvas'),

  // Mobile Navigation & Floating Bar
  mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
  mobileNavDrawer: document.getElementById('mobile-nav-drawer'),
  mobileNavOverlay: document.getElementById('mobile-nav-overlay'),
  closeMobileNavBtn: document.getElementById('close-mobile-nav-btn'),
  mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
  mobileSoundBtn: document.getElementById('mobile-sound-btn'),
  mobileApiBtn: document.getElementById('mobile-api-btn'),
  mobileApiStatusBadge: document.getElementById('mobile-api-status-badge'),

  // Mobile Studio Tabs
  tabBtnImage: document.getElementById('tab-btn-image'),
  tabBtnVideo: document.getElementById('tab-btn-video'),
  imagePanel: document.querySelector('.studio-panel.image-panel'),
  videoPanel: document.querySelector('.studio-panel.video-panel'),

  // Mobile Floating Cart Pill
  mobileCartFloat: document.getElementById('mobile-cart-float'),
  floatCartCount: document.getElementById('float-cart-count'),
  floatCartTotal: document.getElementById('float-cart-total'),
  floatCartBtn: document.getElementById('float-cart-btn')
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initPetalCanvas();
  initHeroVideoControls();
  initStudioConsole();
  initStudioMobileTabs();
  initCatalog();
  initCart();
  initApiModal();
  initAmbientSound();
  initMobileNav();
  initConcierge();
  updateApiStatusUI();
});

// ==========================================================================
// 1. Floating Botanical Petals Canvas Animation
// ==========================================================================
function initPetalCanvas() {
  const canvas = Elements.petalCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let mouse = { x: -1000, y: -1000, radius: 120 };

  const isMobile = window.innerWidth <= 768;
  const petals = [];
  const PETAL_COUNT = isMobile ? 12 : 24;

  const colors = [
    'rgba(229, 195, 120, 0.45)', // Champagne gold
    'rgba(240, 216, 156, 0.35)', // Light champagne
    'rgba(224, 148, 139, 0.4)',  // Rose blush
    'rgba(180, 210, 195, 0.25)', // Sage dust
    'rgba(255, 255, 255, 0.35)'  // White petal
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Touch physics for mobile & tablets
  function handleTouch(e) {
    if (e.touches && e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }
  window.addEventListener('touchstart', handleTouch, { passive: true });
  window.addEventListener('touchmove', handleTouch, { passive: true });
  window.addEventListener('touchend', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  }, { passive: true });

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 0.8 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 1.5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.sway = Math.random() * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
      this.aspect = Math.random() * 0.5 + 0.7;
    }

    update() {
      this.y += this.speedY;
      this.sway += this.swaySpeed;
      this.x += Math.sin(this.sway) * 0.5 + this.speedX;
      this.rotation += this.rotationSpeed;

      // Mouse repulsion physics
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x += (dx / dist) * force * 3;
        this.y += (dy / dist) * force * 3;
      }

      if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.scale(1, this.aspect);

      ctx.beginPath();
      // Organic petal curve
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size * 0.8, -this.size * 1.2, this.size * 1.2, this.size * 0.8, 0, this.size * 1.6);
      ctx.bezierCurveTo(-this.size * 1.2, this.size * 0.8, -this.size * 0.8, -this.size * 1.2, 0, 0);
      ctx.fillStyle = this.color;
      ctx.shadowColor = 'rgba(229, 195, 120, 0.2)';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    petals.push(new Petal());
  }

  function renderLoop() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(renderLoop);
  }
  renderLoop();
}

// ==========================================================================
// 2. Hero Ambient Video Controls
// ==========================================================================
function initHeroVideoControls() {
  const video = Elements.heroVideo;
  const toggleBtn = Elements.videoToggleBtn;
  const progressBar = Elements.videoProgressBar;
  if (!video || !toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      Elements.videoIconPause.classList.remove('hidden');
      Elements.videoIconPlay.classList.add('hidden');
    } else {
      video.pause();
      Elements.videoIconPause.classList.add('hidden');
      Elements.videoIconPlay.classList.remove('hidden');
    }
  });

  video.addEventListener('timeupdate', () => {
    if (video.duration && progressBar) {
      const pct = (video.currentTime / video.duration) * 100;
      progressBar.style.width = `${pct}%`;
    }
  });
}

// ==========================================================================
// 3. AI Floral Studio (Nano Banana & Bloom Video)
// ==========================================================================
function initStudioConsole() {
  // Preset Recipe Chips Click
  Elements.recipeChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const presetKey = chip.getAttribute('data-preset');
      if (presetKey && BOTANICAL_PRESETS[presetKey]) {
        applyPresetToStudio(presetKey);
      }
    });
  });

  // Prompt Generate Button
  Elements.generateBtn.addEventListener('click', () => {
    const promptText = Elements.promptInput.value.trim();
    if (!promptText) {
      showToast('Please describe your botanical vision first.', '✿');
      return;
    }
    triggerAIGeneration(promptText);
  });

  // Enter Key on Prompt Input
  Elements.promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      Elements.generateBtn.click();
    }
  });

  // Bloom Velocity Speed Slider
  Elements.bloomSpeedRange.addEventListener('input', (e) => {
    const speed = parseFloat(e.target.value);
    Elements.speedVal.textContent = `${speed.toFixed(2)}x`;
    if (Elements.studioBloomVideo) {
      Elements.studioBloomVideo.playbackRate = speed;
    }
  });

  // Video Time Display
  if (Elements.studioBloomVideo) {
    Elements.studioBloomVideo.addEventListener('timeupdate', () => {
      const cur = Math.floor(Elements.studioBloomVideo.currentTime);
      const dur = Math.floor(Elements.studioBloomVideo.duration || 12);
      const curStr = cur < 10 ? `00:0${cur}` : `00:${cur}`;
      const durStr = dur < 10 ? `00:0${dur}` : `00:${dur}`;
      Elements.videoTimestamp.textContent = `${curStr} / ${durStr}`;
    });
  }

  // Add Current Studio Creation to Cart
  Elements.studioAddCartBtn.addEventListener('click', () => {
    const current = BOTANICAL_PRESETS[State.activePreset] || {
      id: 'custom-' + Date.now(),
      title: 'Bespoke Nano Banana Creation',
      price: 220,
      image: Elements.studioMainImage.src,
      family: 'Custom Multimodal Hybrid'
    };

    addToCart({
      id: current.id,
      title: current.title,
      price: current.price,
      image: Elements.studioMainImage.src
    });
  });

  // Save / Download Still Button
  Elements.studioDownloadRenderBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = Elements.studioMainImage.src;
    link.download = `AuraFlora-${State.activePreset}-still.png`;
    link.click();
    showToast('High-fidelity botanical still saved.', '✦');
  });

  // Fullscreen Inspect
  Elements.btnFullscreenRender.addEventListener('click', () => {
    window.open(Elements.studioMainImage.src, '_blank');
  });
}

function applyPresetToStudio(presetKey) {
  State.activePreset = presetKey;
  const data = BOTANICAL_PRESETS[presetKey];
  if (!data) return;

  // Active Chip
  Elements.recipeChips.forEach((c) => {
    c.classList.toggle('active', c.getAttribute('data-preset') === presetKey);
  });

  // Update Input & Notes
  Elements.promptInput.value = data.prompt;
  Elements.displayRecipeTitle.textContent = data.title;
  Elements.displayRecipeFamily.textContent = `Botanical Family: ${data.family}`;
  Elements.displayRecipePrice.textContent = `€${data.price}`;

  // Update Tags
  Elements.displayRecipeTags.innerHTML = data.tags
    .map((tag) => `<span class="meta-tag">${tag}</span>`)
    .join('');

  // Smooth Cross-fade Image
  Elements.studioMainImage.style.opacity = '0.3';
  Elements.studioMainImage.style.transform = 'scale(0.97)';

  setTimeout(() => {
    Elements.studioMainImage.src = data.image;
    Elements.studioMainImage.style.opacity = '1';
    Elements.studioMainImage.style.transform = 'scale(1)';
  }, 200);

  // Restart bloom video with a fresh loop
  if (Elements.studioBloomVideo) {
    Elements.studioBloomVideo.currentTime = 0;
    Elements.studioBloomVideo.play();
  }
}

// ==========================================================================
// 4. Live / Simulated AI Generation
// ==========================================================================
async function triggerAIGeneration(prompt) {
  Elements.renderLoadingOverlay.classList.remove('hidden');
  Elements.generateBtn.disabled = true;

  const steps = [
    'Parsing botanical morphology with Gemini Nano...',
    'Synthesizing petal pigmentation & chiaroscuro...',
    'Rendering high-fidelity still via gemini-nano-banana-2.1...',
    'Generating 4K bloom time-lapse with Gemini Omni...'
  ];

  let stepIdx = 0;
  Elements.loaderStatusText.textContent = steps[0];
  const stepInterval = setInterval(() => {
    stepIdx++;
    if (stepIdx < steps.length) {
      Elements.loaderStatusText.textContent = steps[stepIdx];
    }
  }, 700);

  // Check if live API Key is present
  if (State.apiKey) {
    try {
      await callLiveGeminiApi(prompt);
      clearInterval(stepInterval);
      Elements.renderLoadingOverlay.classList.add('hidden');
      Elements.generateBtn.disabled = false;
      showToast('Live Nano Banana generation completed!', '✦');
      return;
    } catch (err) {
      console.warn('Live API attempt failed or rate-limited; falling back to high-res atelier preset.', err);
      showToast('Live call error. Falling back to high-fidelity atelier synthesis.', '⚠️');
    }
  }

  // Pre-rendered Atelier Synthesis Mode
  setTimeout(() => {
    clearInterval(stepInterval);
    Elements.renderLoadingOverlay.classList.add('hidden');
    Elements.generateBtn.disabled = false;

    // Pick best matching or rotate preset
    const presetKeys = Object.keys(BOTANICAL_PRESETS);
    const matchedKey = presetKeys.find((k) => prompt.toLowerCase().includes(k.split('-')[0])) || 
                       presetKeys[(presetKeys.indexOf(State.activePreset) + 1) % presetKeys.length];

    applyPresetToStudio(matchedKey);
    Elements.promptInput.value = prompt; // Retain user's custom prompt
    showToast('Synthesized bespoke botanical arrangement!', '✦');
  }, 2800);
}

async function callLiveGeminiApi(prompt) {
  // Direct call to Gemini endpoint using user's key
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-nano-banana-2.1:generateImages?key=${State.apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: prompt,
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg' }
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const result = await response.json();
  if (result.generatedImages && result.generatedImages[0]?.image?.imageBytes) {
    const base64Data = result.generatedImages[0].image.imageBytes;
    Elements.studioMainImage.src = `data:image/jpeg;base64,${base64Data}`;
    Elements.displayRecipeTitle.textContent = 'Live Bespoke Synthesis';
    Elements.displayRecipeFamily.textContent = 'Model: gemini-nano-banana-2.1 (Live)';
    Elements.displayRecipeTags.innerHTML = '<span class="meta-tag">Live GenAI</span><span class="meta-tag">Multimodal</span><span class="meta-tag">Unique Stems</span>';
  } else {
    throw new Error('Unexpected response schema');
  }
}

// ==========================================================================
// 5. Curated Catalog & 3D Interactive Card Tilt
// ==========================================================================
function initCatalog() {
  // Category Filter Tabs
  Elements.catalogTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      Elements.catalogTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      Elements.flowerCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.classList.add('animate-fade-in');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 3D Parallax Tilt on Hover
  Elements.flowerCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // Quick View in Studio Buttons
  Elements.quickViewBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const preset = btn.getAttribute('data-preset');
      if (preset && BOTANICAL_PRESETS[preset]) {
        applyPresetToStudio(preset);
        document.getElementById('studio').scrollIntoView({ behavior: 'smooth' });
        showToast(`Loaded ${BOTANICAL_PRESETS[preset].title} into Atelier Studio`, '✦');
      }
    });
  });

  // Add to Bag Buttons
  Elements.addToBagBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const title = btn.getAttribute('data-title');
      const price = parseFloat(btn.getAttribute('data-price'));
      const card = btn.closest('.flower-card');
      const img = card ? card.querySelector('.card-img').src : 'assets/floral-midnight-dahlia.png';

      addToCart({ id, title, price, image: img });
    });
  });
}

// ==========================================================================
// 6. Atelier Bag & Slide-out Cart Drawer
// ==========================================================================
function initCart() {
  Elements.cartToggleBtn.addEventListener('click', openCart);
  Elements.closeCartBtn.addEventListener('click', closeCart);
  Elements.cartOverlay.addEventListener('click', closeCart);

  if (Elements.floatCartBtn) {
    Elements.floatCartBtn.addEventListener('click', openCart);
  }

  Elements.checkoutBtn.addEventListener('click', () => {
    if (State.cart.length === 0) {
      showToast('Your bag is currently empty.', '✿');
      return;
    }
    closeCart();
    celebrateCheckout();
  });
}

function openCart() {
  Elements.cartDrawer.classList.add('active');
  Elements.cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  Elements.cartDrawer.classList.remove('active');
  Elements.cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

function addToCart(item) {
  State.cart.push(item);
  renderCart();
  Elements.cartCounter.textContent = State.cart.length;
  showToast(`Added "${item.title}" to Atelier Bag`, '✿');

  // Gentle pulse animation on cart button
  Elements.cartToggleBtn.style.transform = 'scale(1.1)';
  setTimeout(() => {
    Elements.cartToggleBtn.style.transform = 'scale(1)';
  }, 250);
}

function removeFromCart(index) {
  State.cart.splice(index, 1);
  renderCart();
  Elements.cartCounter.textContent = State.cart.length;
}

function renderCart() {
  if (State.cart.length === 0) {
    Elements.cartItemsList.innerHTML = `
      <div class="empty-cart-state">
        <span class="empty-icon">✿</span>
        <p>Your bag is currently empty.</p>
        <span class="empty-sub">Explore our curated sculptures or synthesize a custom bouquet in the AI Studio.</span>
      </div>
    `;
    Elements.cartSubtotal.textContent = '€0';
    if (Elements.mobileCartFloat) {
      Elements.mobileCartFloat.classList.add('hidden');
    }
    return;
  }

  let subtotal = 0;
  Elements.cartItemsList.innerHTML = State.cart.map((item, idx) => {
    subtotal += item.price;
    return `
      <div class="cart-item-row">
        <img src="${item.image}" alt="${item.title}" class="cart-item-thumb">
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.title}</h4>
          <span class="cart-item-sub">Hand-cut & packaged in Paris</span>
          <span class="cart-item-price">€${item.price}</span>
        </div>
        <button class="cart-remove-btn" onclick="removeFromCart(${idx})" title="Remove item">✕</button>
      </div>
    `;
  }).join('');

  Elements.cartSubtotal.textContent = `€${subtotal}`;

  // Update floating mobile pill
  if (Elements.mobileCartFloat) {
    if (Elements.floatCartCount) Elements.floatCartCount.textContent = State.cart.length;
    if (Elements.floatCartTotal) Elements.floatCartTotal.textContent = `€${subtotal}`;
    if (window.innerWidth <= 768) {
      Elements.mobileCartFloat.classList.remove('hidden');
    } else {
      Elements.mobileCartFloat.classList.add('hidden');
    }
  }
}

window.removeFromCart = removeFromCart;

function celebrateCheckout() {
  showToast('Haute commission initiated! Our Parisian concierge is preparing your blooms.', '✦');
  State.cart = [];
  renderCart();
  Elements.cartCounter.textContent = '0';
}

// ==========================================================================
// 7. Ambient Garden Soundscape (Web Audio API)
// ==========================================================================
function initAmbientSound() {
  Elements.ambientSoundBtn.addEventListener('click', toggleAmbientSound);
}

function toggleAmbientSound() {
  if (!State.ambientAudioPlaying) {
    startBotanicalSoundscape();
  } else {
    stopBotanicalSoundscape();
  }
}

function startBotanicalSoundscape() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    State.audioContext = new AudioContext();

    // Create soothing warm harmonic drone (F# major chord: 185Hz, 233Hz, 277Hz, 370Hz)
    const freqs = [185.0, 233.08, 277.18, 369.99];
    State.audioNodes = [];

    freqs.forEach((freq, idx) => {
      const osc = State.audioContext.createOscillator();
      const gain = State.audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, State.audioContext.currentTime);

      // Soft breathing modulation
      const lfo = State.audioContext.createOscillator();
      const lfoGain = State.audioContext.createGain();
      lfo.frequency.setValueAtTime(0.08 + idx * 0.02, State.audioContext.currentTime);
      lfoGain.gain.setValueAtTime(0.015, State.audioContext.currentTime);
      lfo.connect(gain.gain);
      lfo.start();

      gain.gain.setValueAtTime(0.025, State.audioContext.currentTime);
      osc.connect(gain);
      gain.connect(State.audioContext.destination);
      osc.start();

      State.audioNodes.push(osc, lfo);
    });

    State.ambientAudioPlaying = true;
    Elements.ambientSoundBtn.querySelector('.sound-icon-off').classList.add('hidden');
    Elements.ambientSoundBtn.querySelector('.sound-icon-on').classList.remove('hidden');
    updateMobileSoundUI();
    showToast('Ambient garden soundscape playing...', '♫');
  } catch (e) {
    console.error('AudioContext error:', e);
  }
}

function stopBotanicalSoundscape() {
  if (State.audioContext) {
    State.audioContext.close();
    State.audioContext = null;
  }
  State.ambientAudioPlaying = false;
  Elements.ambientSoundBtn.querySelector('.sound-icon-off').classList.remove('hidden');
  Elements.ambientSoundBtn.querySelector('.sound-icon-on').classList.add('hidden');
  updateMobileSoundUI();
  showToast('Ambient sound muted.', '♫');
}

// ==========================================================================
// 8. Gemini API Key Modal
// ==========================================================================
function initApiModal() {
  Elements.apiModalBtn.addEventListener('click', () => {
    Elements.apiKeyInput.value = State.apiKey;
    Elements.apiModal.classList.add('active');
    Elements.apiModalOverlay.classList.add('active');
  });

  const closeModal = () => {
    Elements.apiModal.classList.remove('active');
    Elements.apiModalOverlay.classList.remove('active');
  };

  Elements.closeApiModalBtn.addEventListener('click', closeModal);
  Elements.apiModalOverlay.addEventListener('click', closeModal);

  Elements.saveApiKeyBtn.addEventListener('click', () => {
    const key = Elements.apiKeyInput.value.trim();
    if (key) {
      State.apiKey = key;
      localStorage.setItem('aura_flora_gemini_api_key', key);
      updateApiStatusUI();
      closeModal();
      showToast('Gemini API Key activated for live Nano Banana generation!', '✦');
    }
  });

  Elements.clearApiKeyBtn.addEventListener('click', () => {
    State.apiKey = '';
    localStorage.removeItem('aura_flora_gemini_api_key');
    Elements.apiKeyInput.value = '';
    updateApiStatusUI();
    closeModal();
    showToast('Reverted to Pre-Rendered High-Fidelity Atelier Mode.', '✿');
  });
}

function updateApiStatusUI() {
  if (State.apiKey) {
    Elements.apiStatusBadge.textContent = 'Live Key Active';
    Elements.apiStatusBadge.style.color = '#34d399';
    if (Elements.mobileApiStatusBadge) {
      Elements.mobileApiStatusBadge.textContent = 'Live Key Active';
      Elements.mobileApiStatusBadge.style.color = '#34d399';
    }
  } else {
    Elements.apiStatusBadge.textContent = 'Dual-Mode Ready';
    Elements.apiStatusBadge.style.color = 'var(--champagne-400)';
    if (Elements.mobileApiStatusBadge) {
      Elements.mobileApiStatusBadge.textContent = 'Dual-Mode Ready';
      Elements.mobileApiStatusBadge.style.color = 'var(--champagne-400)';
    }
  }
}

// ==========================================================================
// 10. Mobile AI Studio Tabs
// ==========================================================================
function initStudioMobileTabs() {
  if (!Elements.tabBtnImage || !Elements.tabBtnVideo) return;

  Elements.tabBtnImage.addEventListener('click', () => {
    Elements.tabBtnImage.classList.add('active');
    Elements.tabBtnImage.setAttribute('aria-selected', 'true');
    Elements.tabBtnVideo.classList.remove('active');
    Elements.tabBtnVideo.setAttribute('aria-selected', 'false');

    if (Elements.imagePanel) Elements.imagePanel.classList.add('mobile-active-panel');
    if (Elements.videoPanel) Elements.videoPanel.classList.remove('mobile-active-panel');
  });

  Elements.tabBtnVideo.addEventListener('click', () => {
    Elements.tabBtnVideo.classList.add('active');
    Elements.tabBtnVideo.setAttribute('aria-selected', 'true');
    Elements.tabBtnImage.classList.remove('active');
    Elements.tabBtnImage.setAttribute('aria-selected', 'false');

    if (Elements.videoPanel) Elements.videoPanel.classList.add('mobile-active-panel');
    if (Elements.imagePanel) Elements.imagePanel.classList.remove('mobile-active-panel');
    
    // Ensure video is playing when switched to
    if (Elements.studioBloomVideo && Elements.studioBloomVideo.paused) {
      Elements.studioBloomVideo.play();
    }
  });
}

// ==========================================================================
// 11. Mobile Slide-out Navigation Drawer
// ==========================================================================
function initMobileNav() {
  if (!Elements.mobileMenuToggle || !Elements.mobileNavDrawer) return;

  function openMobileNav() {
    Elements.mobileNavDrawer.classList.add('active');
    Elements.mobileNavOverlay.classList.add('active');
    Elements.mobileMenuToggle.classList.add('active');
    Elements.mobileMenuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    Elements.mobileNavDrawer.classList.remove('active');
    Elements.mobileNavOverlay.classList.remove('active');
    Elements.mobileMenuToggle.classList.remove('active');
    Elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  Elements.mobileMenuToggle.addEventListener('click', () => {
    if (Elements.mobileNavDrawer.classList.contains('active')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  if (Elements.closeMobileNavBtn) {
    Elements.closeMobileNavBtn.addEventListener('click', closeMobileNav);
  }
  if (Elements.mobileNavOverlay) {
    Elements.mobileNavOverlay.addEventListener('click', closeMobileNav);
  }

  // Close when tapping a section anchor link
  Elements.mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  // Mobile sound toggle button
  if (Elements.mobileSoundBtn) {
    Elements.mobileSoundBtn.addEventListener('click', () => {
      toggleAmbientSound();
      updateMobileSoundUI();
    });
  }

  // Mobile API settings button
  if (Elements.mobileApiBtn) {
    Elements.mobileApiBtn.addEventListener('click', () => {
      closeMobileNav();
      Elements.apiModalBtn.click();
    });
  }

  // Escape key support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileNav();
      closeCart();
    }
  });

  // Window resize handler to maintain layout state
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileNav();
      if (Elements.mobileCartFloat) {
        Elements.mobileCartFloat.classList.add('hidden');
      }
    } else if (State.cart.length > 0 && Elements.mobileCartFloat) {
      Elements.mobileCartFloat.classList.remove('hidden');
    }
  });
}

function updateMobileSoundUI() {
  if (!Elements.mobileSoundBtn) return;
  const label = Elements.mobileSoundBtn.querySelector('.mobile-sound-label');
  if (label) {
    label.textContent = State.ambientAudioPlaying ? '✓ Ambient Audio Playing' : '♫ Ambient Garden Audio';
  }
}

// ==========================================================================
// 9. Concierge Form & Toasts
// ==========================================================================
function initConcierge() {
  Elements.conciergeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Your commission inquiry has been received. An atelier florist will respond within 4 hours.', '✦');
    Elements.conciergeForm.reset();
  });
}

function showToast(message, icon = '✦') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${message}</span>`;
  Elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
