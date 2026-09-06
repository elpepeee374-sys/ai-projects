// ===== LEAD SENDING UTILITY (Telegram & Email) =====
async function sendLeadData(data) {
  data.lang = document.documentElement.lang === 'en' ? 'en' : 'ru';
  console.log('Sending lead data:', data);
  try {
    const response = await fetch('/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    console.log('Lead response:', result);
    return result;
  } catch (err) {
    console.warn('Network request failed or local server returned error (Expected on localhost without PHP). Logging payload instead:', data, err);
    return { status: 'mock_success', message: 'Local development mock success.' };
  }
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ===== HERO IMAGE KEN BURNS =====
const heroImg = document.getElementById('heroImg');
if (heroImg) {
  if (heroImg.complete) {
    heroImg.classList.add('loaded');
  } else {
    heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
  }
}

// ===== REVEAL ON SCROLL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.01, rootMargin: '0px 0px -10px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== SMOOTH COUNTER ANIMATION =====
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 3500;
  const step = 16;
  const increment = target / (duration / step);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + suffix;
    }
  }, step);
}

// Trigger counters when stats visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat-num');
      statNums.forEach(el => {
        const text = el.textContent;
        if (text.trim() === '250+') animateCounter(el, 250, '+');
        else if (text.trim() === '8 лет' || text.trim() === '8 years') animateCounter(el, 8, text.includes('years') ? ' years' : ' лет');
        else if (text.trim() === '100%') animateCounter(el, 100, '%');
        // '0%' and '6–8%' stay static to avoid complex animations
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ===== BURGER MENU =====
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const isActive = burger.classList.toggle('active');
    navLinks.classList.toggle('active');
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close mobile menu when anchor link clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ===== FORM SUBMIT =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isEn = document.documentElement.lang === 'en';
    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = isEn ? '<span>Request Submitted ✓</span>' : '<span>Заявка отправлена ✓</span>';
    btn.style.background = '#2d7a46';
    btn.style.borderColor = '#2d7a46';
    btn.style.pointerEvents = 'none';
    
    // Отправка данных на сервер
    sendLeadData({
      name: nameVal,
      phone: phoneVal,
      source: isEn ? 'Footer Form (Contacts)' : 'Форма в подвале (Контакты)'
    });

    setTimeout(() => {
      btn.innerHTML = isEn 
        ? '<span>Submit Request</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>'
        : '<span>Отправить заявку</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.style.pointerEvents = '';
      form.reset();
    }, 3500);
  });
}

// ===== GUIDE PROMO FORM SUBMIT =====
const guideForm = document.getElementById('guideForm');
if (guideForm) {
  guideForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const isEn = document.documentElement.lang === 'en';
    const btn = guideForm.querySelector('button[type="submit"]');
    
    // Сбор данных из новых полей формы
    const nameVal = guideForm.querySelector('input[name="name"]')?.value || '';
    const phoneVal = guideForm.querySelector('input[name="phone"]')?.value || '';
    const emailVal = guideForm.querySelector('input[name="email"]')?.value || '';
    const methodVal = guideForm.querySelector('input[name="contact_method"]:checked')?.value || '';
    
    btn.innerHTML = isEn ? '<span>Request Submitted ✓</span>' : '<span>Доступ запрошен ✓</span>';
    btn.style.background = '#2d7a46';
    btn.style.borderColor = '#2d7a46';
    btn.style.pointerEvents = 'none';
    
    // Отправка данных на сервер
    sendLeadData({
      name: nameVal,
      phone: phoneVal,
      email: emailVal,
      contact_method: methodVal,
      source: isEn ? 'Guide Promo Form' : 'Форма Гайда (15 евро)'
    });

    setTimeout(() => {
      btn.innerHTML = isEn 
        ? '<span>Get access to the guide for 15€</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>'
        : '<span>Получить доступ к гайду за 15€</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.style.pointerEvents = '';
      guideForm.reset();
    }, 3500);
  });
}

// ===== HERO PARALLAX & CINEMATIC PAN (Unified) =====
// heroImg is already declared above, reusing it
const heroSection = document.getElementById('hero');
const heroContent = document.querySelector('.hero-content');

if (heroSection && heroImg) {
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;
  let panOffset = 6; // Starts showing wide-open pristine turquoise sea
  let panSpeed = 0.025; // Slow, majestic cinematic pan
  let parallaxActive = false;
  let parallaxFactor = 0; // Gradually enable mouse control
  let isHeroVisible = true;
  let animationFrameId = null;

  document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mouseX = (e.clientX - centerX) / centerX;
    mouseY = (e.clientY - centerY) / centerY;
  });

  // Enable mouse control after initial pan completes (~4s)
  setTimeout(() => {
    parallaxActive = true;
  }, 4000);

  function updateHero() {
    // 1. Handle Cinematic Pan (Left to Right)
    if (panOffset > -12) {
      panOffset -= panSpeed;
    }

    // 2. Handle Mouse Parallax with Lerp
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    // 3. Gradually fade in parallax control
    if (parallaxActive && parallaxFactor < 1) {
      parallaxFactor += 0.01;
    }

    // 4. Calculate final offsets
    const finalParallaxX = currentX * 40 * parallaxFactor;
    const finalParallaxY = (currentY * 30 * parallaxFactor) + (window.scrollY * 0.15);

    heroImg.style.transform = `scale(1.1) translate3d(${panOffset}%, ${finalParallaxY}px, 0) translate3d(${finalParallaxX}px, 0, 0)`;
    
    if (heroContent) {
      const contentX = currentX * 15 * parallaxFactor;
      const contentY = currentY * 15 * parallaxFactor;
      heroContent.style.transform = `translate3d(${contentX}px, ${contentY}px, 0)`;
    }

    if (window.scrollY <= window.innerHeight) {
      animationFrameId = requestAnimationFrame(updateHero);
      isHeroVisible = true;
    } else {
      isHeroVisible = false;
      animationFrameId = null;
    }
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY <= window.innerHeight) {
      if (!isHeroVisible && !animationFrameId) {
        isHeroVisible = true;
        updateHero();
      }
    }
  });

  updateHero();
}

// ===== SERVICES INTERACTIVE DASHBOARD =====
const serviceItems = document.querySelectorAll('.service-item');
const isMobile = () => window.innerWidth <= 991;

serviceItems.forEach((item) => {
  const header = item.querySelector('.service-header');
  
  if (header) {
    // Hover event for desktop
    header.addEventListener('mouseenter', () => {
      if (!isMobile()) {
        serviceItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        updateAria();
      }
    });
    
    // Click event for mobile (accordion) and desktop (hard select)
    header.addEventListener('click', (e) => {
      e.preventDefault();
      if (isMobile()) {
        const isActive = item.classList.contains('active');
        serviceItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      } else {
        serviceItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      }
      updateAria();
    });
  }
});

function updateAria() {
  serviceItems.forEach((item) => {
    const header = item.querySelector('.service-header');
    if (header) {
      const isActive = item.classList.contains('active');
      header.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    }
  });
}



// ===== SERVICE MODAL POPUP HANDLING =====
const modalOverlay = document.getElementById('serviceModalOverlay');
const modalBody = document.getElementById('serviceModalBody');
const modalClose = document.getElementById('serviceModalClose');

if (modalOverlay && modalBody && modalClose) {
  // Open modal click handler
  document.querySelectorAll('.open-service-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceId = btn.getAttribute('data-service-id');
      
      // Clone service content from dashboard section
      const activeSource = document.querySelector(`.service-item[data-service="${serviceId}"] .service-body-inner`);
      if (activeSource) {
        modalBody.innerHTML = activeSource.innerHTML;
        
        // Setup submission for form inside the modal
        const modalForm = modalBody.querySelector('.service-expanded-form');
        if (modalForm) {
          const servicePhoneInput = modalForm.querySelector('input[type="tel"]');
          if (typeof setupPhoneValidation === 'function') {
            setupPhoneValidation(servicePhoneInput);
          }
          modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const isEn = document.documentElement.lang === 'en';
            const phoneVal = servicePhoneInput.value;
            const serviceTitle = modalBody.querySelector('.service-body-title')?.textContent || (isEn ? 'Service' : 'Услуга');
            
            const submitBtn = modalForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = isEn ? '<span>Request Submitted ✓</span>' : '<span>Заявка отправлена ✓</span>';
            submitBtn.style.background = '#2d7a46';
            submitBtn.style.borderColor = '#2d7a46';
            submitBtn.style.pointerEvents = 'none';
            
            // Отправка данных на сервер
            sendLeadData({
              phone: phoneVal,
              source: isEn ? `Service Request: ${serviceTitle}` : `Запрос услуги: ${serviceTitle}`
            });

            setTimeout(() => {
              closeModal();
            }, 4000);
          });
        }
        
        // Show modal
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
      }
    });
  });

  // Close modal function
  function closeModal() {
    console.log("closeModal called, resetting overflow");
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    // Wait for animation to finish before clearing content
    setTimeout(() => {
      modalBody.innerHTML = '';
    }, 350);
  }

  // Close modal on close button click
  modalClose.addEventListener('click', closeModal);

  // Close modal on clicking outside the card (overlay background)
  let modalOverlayMousedownTarget = null;
  modalOverlay.addEventListener('mousedown', (e) => {
    modalOverlayMousedownTarget = e.target;
  });
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay && modalOverlayMousedownTarget === modalOverlay) {
      closeModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}


// ===== CATALOG SLIDER NAV (INFINITE LOOP) =====
const catalogSlider = document.getElementById('catalogSlider');
const catalogPrev = document.getElementById('catalogPrev');
const catalogNext = document.getElementById('catalogNext');

if (catalogSlider && catalogPrev && catalogNext) {
  const originalCards = Array.from(catalogSlider.children);
  const cardCount = originalCards.length; // 9 cards
  
  // Clone cards to prepend (Group A) and append (Group C)
  // Group A (clones prepended in original order)
  const fragmentPrepend = document.createDocumentFragment();
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.add('clone-card');
    fragmentPrepend.appendChild(clone);
  });
  catalogSlider.insertBefore(fragmentPrepend, catalogSlider.firstChild);

  // Group C (clones appended in original order)
  const fragmentAppend = document.createDocumentFragment();
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.add('clone-card');
    fragmentAppend.appendChild(clone);
  });
  catalogSlider.appendChild(fragmentAppend);

  // Helper variables for layout dimensions
  let cardWidth = 380;
  let gap = 30;
  let groupWidth = 3690;

  const recalculateDimensions = () => {
    const card = catalogSlider.querySelector('.catalog-card');
    if (!card) return;
    
    cardWidth = card.offsetWidth;
    const style = window.getComputedStyle(catalogSlider);
    gap = parseFloat(style.gap) || 30;
    groupWidth = (cardWidth + gap) * cardCount;
  };

  const getScrollAmount = () => {
    return cardWidth + gap;
  };

  // Warp helper: if current scroll is in prepended Group A or appended Group C, warp it back to Group B
  const warpToCenter = () => {
    const currentScroll = catalogSlider.scrollLeft;
    if (currentScroll < groupWidth) {
      catalogSlider.style.scrollSnapType = 'none';
      catalogSlider.scrollLeft = currentScroll + groupWidth;
      catalogSlider.offsetHeight; // Force layout reflow
      catalogSlider.style.scrollSnapType = 'x mandatory';
    } else if (currentScroll >= groupWidth * 2) {
      catalogSlider.style.scrollSnapType = 'none';
      catalogSlider.scrollLeft = currentScroll - groupWidth;
      catalogSlider.offsetHeight; // Force layout reflow
      catalogSlider.style.scrollSnapType = 'x mandatory';
    }
  };

  // Pre-warp before smooth scroll starts to make sure there is room to scroll smooth
  const preWarpForButtons = (direction) => {
    recalculateDimensions();
    const currentScroll = catalogSlider.scrollLeft;
    const scrollAmount = getScrollAmount();

    if (direction === 'next') {
      // If next scroll would exceed Group B's right boundary, warp left first
      if (currentScroll >= groupWidth * 2 - scrollAmount - 10) {
        catalogSlider.style.scrollSnapType = 'none';
        catalogSlider.scrollLeft = currentScroll - groupWidth;
        catalogSlider.offsetHeight; // Force layout reflow
        catalogSlider.style.scrollSnapType = 'x mandatory';
      }
    } else if (direction === 'prev') {
      // If prev scroll would fall below Group B's left boundary, warp right first
      if (currentScroll <= groupWidth + 10) {
        catalogSlider.style.scrollSnapType = 'none';
        catalogSlider.scrollLeft = currentScroll + groupWidth;
        catalogSlider.offsetHeight; // Force layout reflow
        catalogSlider.style.scrollSnapType = 'x mandatory';
      }
    }
  };

  catalogPrev.addEventListener('click', () => {
    preWarpForButtons('prev');
    setTimeout(() => {
      catalogSlider.scrollBy({
        left: -getScrollAmount(),
        behavior: 'smooth'
      });
    }, 10);
  });

  catalogNext.addEventListener('click', () => {
    preWarpForButtons('next');
    setTimeout(() => {
      catalogSlider.scrollBy({
        left: getScrollAmount(),
        behavior: 'smooth'
      });
    }, 10);
  });

  // Track scroll event to warp to center on scroll stop
  let scrollTimeout;
  catalogSlider.addEventListener('scroll', () => {
    window.clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      recalculateDimensions();
      warpToCenter();
    }, 120); // Warp 120ms after scroll idle to prevent momentum conflicts
  }, { passive: true });

  // Handle window resize
  window.addEventListener('resize', () => {
    recalculateDimensions();
    warpToCenter();
  }, { passive: true });

  // Initial scroll positioning on load
  const initSlider = () => {
    recalculateDimensions();
    catalogSlider.scrollLeft = groupWidth;
    
    // Ensure navigation buttons are never disabled
    catalogPrev.disabled = false;
    catalogNext.disabled = false;
  };

  // Run initial setup with timeouts to ensure styles are parsed
  setTimeout(initSlider, 100);
  window.addEventListener('load', initSlider);
}

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const trigger = item.querySelector('.faq-trigger');
  const panel = item.querySelector('.faq-panel');
  
  if (trigger && panel) {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isActive = item.classList.contains('active');
      
      // Close all other panels
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherPanel = otherItem.querySelector('.faq-panel');
          if (otherPanel) {
            otherPanel.style.maxHeight = null;
          }
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          if (otherTrigger) {
            otherTrigger.setAttribute('aria-expanded', 'false');
          }
        }
      });
      
      // Toggle current panel
      if (isActive) {
        item.classList.remove('active');
        panel.style.maxHeight = null;
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  }
});


// ===== LOT MODAL POPUP HANDLING =====
const catalogLots = {
  "1": {
    title: "Апартаменты Seaside Residence",
    location: "Лимассол, Гермасогея",
    price: "€285 000",
    bedrooms: "2",
    bathrooms: "2",
    area: "95 м²",
    seaDistance: "1 км",
    descriptionLocation: "Локация и окружение: Престижный район Гермасогея в Лимассоле. В шаговой доступности супермаркеты, рестораны, аптеки и лучшие пляжи. Удобный выезд на автостраду.",
    descriptionYield: "Почему выгодно: Высокий спрос на долгосрочную аренду от IT-специалистов и экспатов. Стабильная окупаемость и высокая ликвидность на вторичном рынке.",
    expectedRent: "€1 650/мес",
    transferTax: "0% (Новостройка)",
    roi: "ROI 7.2%",
    category: "Для инвестиций (аренда)",
    seaDistBadge: "1 км от моря",
    image: "lot-1-seaside.webp",
    gallery: ["lot-1-seaside.webp", "lot-5-marina.webp", "lot-3-azure.webp"]
  },
  "2": {
    title: "Вилла Mediterranean Pearl",
    location: "Пафос, Като Пафос",
    price: "€520 000",
    bedrooms: "3",
    bathrooms: "2",
    area: "180 м²",
    seaDistance: "2 км",
    descriptionLocation: "Локация и окружение: Престижный район Като Пафос с развитой инфраструктурой. В шаговой доступности чистейшие пляжи, рестораны, банки и туристический променад. 10 минут до исторической гавани.",
    descriptionYield: "Почему выгодно: Высокий арендный спрос в популярной туристической локации Като Пафос. Готовый объект для мгновенного получения дохода или собственного проживания.",
    expectedRent: "€2 800/мес",
    transferTax: "3%",
    roi: "ROI 8.0%",
    category: "Для инвестиций (перепродажа)",
    seaDistBadge: "2 км от моря",
    image: "lot-2-pearl.webp",
    gallery: ["lot-2-pearl.webp", "lot-4-coral.webp", "lot-6-hills.webp"]
  },
  "3": {
    title: "Пентхаус Azure Tower",
    location: "Лимассол, Агиос Тихонас",
    price: "€410 000",
    bedrooms: "2",
    bathrooms: "2",
    area: "130 м²",
    seaDistance: "100 м",
    descriptionLocation: "Локация и окружение: Первая линия в элитном пригороде Лимассола Агиос Тихонас. Панорамные виды на море. Лучшие пятизвездочные отели и рестораны города в пешей доступности.",
    descriptionYield: "Почему выгодно: Уникальный видовой пентхаус на первой береговой линии. Идеальный актив для сдачи в краткосрочную VIP-аренду или для оформления ПМЖ.",
    expectedRent: "€3 200/мес",
    transferTax: "0% (Новостройка)",
    roi: "ROI 6.5%",
    category: "Для жизни и ПМЖ",
    seaDistBadge: "100 м от моря",
    image: "lot-3-azure.webp",
    gallery: ["lot-3-azure.webp", "lot-5-marina.webp", "lot-9-amaya.webp"]
  },
  "4": {
    title: "Вилла Coral Bay Sunset",
    location: "Пафос, Корал Бэй",
    price: "€690 000",
    bedrooms: "4",
    bathrooms: "3",
    area: "240 м²",
    seaDistance: "300 м",
    descriptionLocation: "Локация и окружение: Живописный район Корал Бэй, славящийся своими песчаными пляжами и кристально чистой водой. Развитая туристическая инфраструктура и уединение.",
    descriptionYield: "Почему выгодно: Просторная семейная вилла с приватным бассейном и ландшафтным садом. Подходит для мгновенного получения ПМЖ Кипра и круглогодичного проживания.",
    expectedRent: "€4 000/мес",
    transferTax: "3%",
    roi: "ROI 7.5%",
    category: "Для жизни и ПМЖ",
    seaDistBadge: "300 м от моря",
    image: "lot-4-coral.webp",
    gallery: ["lot-4-coral.webp", "lot-2-pearl.webp", "lot-6-hills.webp"]
  },
  "5": {
    title: "Апартаменты Marina View",
    location: "Лимассол Marina",
    price: "€450 000",
    bedrooms: "1",
    bathrooms: "1",
    area: "75 м²",
    seaDistance: "50 м",
    descriptionLocation: "Локация и окружение: Закрытая марина Лимассола — самая престижная гавань острова. Бутики мировых брендов, яхт-клуб, спа-центры и изысканные рестораны прямо у порога.",
    descriptionYield: "Почему выгодно: Эксклюзивная недвижимость в закрытой гавани. Стабильно высокий спрос на аренду со сверхвысоким ROI. Статусность и дефицит подобных предложений на рынке.",
    expectedRent: "€2 900/мес",
    transferTax: "0% (Новостройка)",
    roi: "ROI 8.5%",
    category: "Для инвестиций (аренда)",
    seaDistBadge: "50 м от моря",
    image: "lot-5-marina.webp",
    gallery: ["lot-5-marina.webp", "lot-1-seaside.webp", "lot-3-azure.webp"]
  },
  "6": {
    title: "Усадьба Hills View Estate",
    location: "Пафос, Тала",
    price: "€850 000",
    bedrooms: "4",
    bathrooms: "4",
    area: "310 м²",
    seaDistance: "4 км",
    descriptionLocation: "Локация и окружение: Престижный тихий пригород Пафоса — Тала. Расположена на холме, откуда открывается захватывающий вид на море и закаты. Благоприятный микроклимат.",
    descriptionYield: "Почему выгодно: Роскошная усадьба с панорамным видом, большим участком, садом и переливным бассейном. Премиальный выбор для большой семьи и статусных инвесторов.",
    expectedRent: "€4 800/мес",
    transferTax: "3%",
    roi: "ROI 6.8%",
    category: "Для жизни",
    seaDistBadge: "4 км от моря",
    image: "lot-6-hills.webp",
    gallery: ["lot-6-hills.webp", "lot-8-olympus.webp", "lot-9-amaya.webp"]
  },
  "7": {
    title: "Резиденция Harbour Bay",
    location: "Пафос, Гавань (Харбор)",
    price: "€320 000",
    bedrooms: "2",
    bathrooms: "2",
    area: "110 м²",
    seaDistance: "500 м",
    descriptionLocation: "Локация и окружение: Туристический центр Пафоса в районе набережной и исторической гавани. Рядом археологический парк, рестораны, променад и пляжи.",
    descriptionYield: "Почему выгодно: Отличное сочетание цены, локации и площади. Подходит как для комфортной жизни, так и для сдачи туристам. Сдача объекта Q3 2026 года.",
    expectedRent: "€1 900/мес",
    transferTax: "0% (Новостройка)",
    roi: "ROI 7.0%",
    category: "Для жизни и ПМЖ",
    seaDistBadge: "500 м от моря",
    image: "lot-7-harbour.webp",
    gallery: ["lot-7-harbour.webp", "lot-2-pearl.webp", "lot-4-coral.webp"]
  },
  "8": {
    title: "Пентхаус Olympus Heights",
    location: "Лимассол, Агиос Афанасиос",
    price: "€980 000",
    bedrooms: "3",
    bathrooms: "3",
    area: "210 м²",
    seaDistance: "3 км",
    descriptionLocation: "Локация и окружение: Престижный холмистый район Агиос Афанасиос в Лимассоле, где расположены лучшие международные школы (Foley's). Завораживающие виды на весь город и море.",
    descriptionYield: "Почему выгодно: Роскошный двухуровневый пентхаус с частным садом на крыше и бассейном. Идеален для комфортной семейной жизни и престижной релокации.",
    expectedRent: "€5 500/мес",
    transferTax: "0% (Новостройка)",
    roi: "ROI 6.9%",
    category: "Для жизни",
    seaDistBadge: "3 км от моря",
    image: "lot-8-olympus.webp",
    gallery: ["lot-8-olympus.webp", "lot-6-hills.webp", "lot-9-amaya.webp"]
  },
  "9": {
    title: "Вилла Amaya Seafront",
    location: "Пафос, Пейя",
    price: "€1 250 000",
    bedrooms: "4",
    bathrooms: "4",
    area: "280 м²",
    seaDistance: "100 м",
    descriptionLocation: "Локация и окружение: Первая линия моря в престижном районе Пейя. Панорамный вид на море из всех спален, приватный выход к уединенной бухте.",
    descriptionYield: "Почему выгодно: Уникальный трофейный объект недвижимости. Идеальное расположение у кромки воды, эксклюзивная архитектура, высочайшая капитализация.",
    expectedRent: "€7 000/мес",
    transferTax: "3%",
    roi: "ROI 7.8%",
    category: "Люкс перепродажа",
    seaDistBadge: "100 м от моря",
    image: "lot-9-amaya.webp",
    gallery: ["lot-9-amaya.webp", "lot-8-olympus.webp", "lot-6-hills.webp"]
  }
};

if (document.documentElement.lang === 'en') {
  catalogLots["1"].title = "Seaside Residence Apartments";
  catalogLots["1"].location = "Limassol, Germasogeia";
  catalogLots["1"].expectedRent = "€1,650/month";
  catalogLots["1"].transferTax = "0% (New build)";
  catalogLots["1"].category = "For investment (rental)";
  catalogLots["1"].seaDistBadge = "1 km from the sea";
  catalogLots["1"].descriptionLocation = "Location & Surroundings: Prestigious Germasogeia district in Limassol. Walking distance to supermarkets, restaurants, pharmacies, and the best beaches. Convenient highway access.";
  catalogLots["1"].descriptionYield = "Why it is profitable: High demand for long-term rentals from IT professionals and expats. Stable yield and high liquidity on the secondary market.";

  catalogLots["2"].title = "Mediterranean Pearl Villa";
  catalogLots["2"].location = "Paphos, Kato Paphos";
  catalogLots["2"].expectedRent = "€2,800/month";
  catalogLots["2"].category = "For investment (resale)";
  catalogLots["2"].seaDistBadge = "2 km from the sea";
  catalogLots["2"].descriptionLocation = "Location & Surroundings: Prestigious Kato Paphos area with developed infrastructure. Walking distance to pristine beaches, restaurants, banks, and the tourist promenade. 10 minutes to the historical harbor.";
  catalogLots["2"].descriptionYield = "Why it is profitable: High rental demand in the popular tourist location of Kato Paphos. Ready property for instant income generation or personal residency.";

  catalogLots["3"].title = "Azure Tower Penthouse";
  catalogLots["3"].location = "Limassol, Agios Tychonas";
  catalogLots["3"].expectedRent = "€3,200/month";
  catalogLots["3"].transferTax = "0% (New build)";
  catalogLots["3"].category = "For living & Permanent Residency";
  catalogLots["3"].seaDistBadge = "100 m from the sea";
  catalogLots["3"].descriptionLocation = "Location & Surroundings: First coastline in the elite Limassol suburb of Agios Tychonas. Panoramic sea views. The best five-star hotels and restaurants of the city within walking distance.";
  catalogLots["3"].descriptionYield = "Why it is profitable: Unique penthouse with panoramic views on the first shoreline. Ideal asset for short-term VIP rentals or for obtaining Permanent Residency.";

  catalogLots["4"].title = "Coral Bay Sunset Villa";
  catalogLots["4"].location = "Paphos, Coral Bay";
  catalogLots["4"].expectedRent = "€4,000/month";
  catalogLots["4"].category = "For living & Permanent Residency";
  catalogLots["4"].seaDistBadge = "300 m from the sea";
  catalogLots["4"].descriptionLocation = "Location & Surroundings: Picturesque Coral Bay area, famous for its sandy beaches and crystal clear water. Developed tourist infrastructure and privacy.";
  catalogLots["4"].descriptionYield = "Why it is profitable: Spacious family villa with private pool and landscaped garden. Suitable for instant Cyprus Permanent Residency and year-round living.";

  catalogLots["5"].title = "Marina View Apartments";
  catalogLots["5"].location = "Limassol Marina";
  catalogLots["5"].expectedRent = "€2,900/month";
  catalogLots["5"].transferTax = "0% (New build)";
  catalogLots["5"].category = "For investment (rental)";
  catalogLots["5"].seaDistBadge = "50 m from the sea";
  catalogLots["5"].descriptionLocation = "Location & Surroundings: Gated Limassol Marina — the most prestigious harbor of the island. Boutiques of world brands, yacht club, spa centers, and fine dining restaurants right at your doorstep.";
  catalogLots["5"].descriptionYield = "Why it is profitable: Exclusive property in a gated harbor. Consistently high demand for rentals with a ultra-high ROI. Prestige and lack of similar offers on the market.";

  catalogLots["6"].title = "Hills View Estate";
  catalogLots["6"].location = "Paphos, Tala";
  catalogLots["6"].expectedRent = "€4,800/month";
  catalogLots["6"].category = "For living";
  catalogLots["6"].seaDistBadge = "4 km from the sea";
  catalogLots["6"].descriptionLocation = "Location & Surroundings: Prestigious quiet suburb of Paphos — Tala. Located on a hill, offering breathtaking sea and sunset views. Favorable microclimate.";
  catalogLots["6"].descriptionYield = "Why it is profitable: Luxurious estate with panoramic views, a large plot, garden, and overflow pool. Premium choice for a large family and status investors.";

  catalogLots["7"].title = "Harbour Bay Residence";
  catalogLots["7"].location = "Paphos, Harbor";
  catalogLots["7"].expectedRent = "€1,900/month";
  catalogLots["7"].transferTax = "0% (New build)";
  catalogLots["7"].category = "For living & Permanent Residency";
  catalogLots["7"].seaDistBadge = "500 m from the sea";
  catalogLots["7"].descriptionLocation = "Location & Surroundings: Tourist center of Paphos in the area of the embankment and historical harbor. Nearby archaeological park, restaurants, promenade, and beaches.";
  catalogLots["7"].descriptionYield = "Why it is profitable: Excellent combination of price, location, and area. Suitable for both comfortable living and renting to tourists. Handover Q3 2026.";

  catalogLots["8"].title = "Olympus Heights Penthouse";
  catalogLots["8"].location = "Limassol, Agios Athanasios";
  catalogLots["8"].expectedRent = "€5,500/month";
  catalogLots["8"].transferTax = "0% (New build)";
  catalogLots["8"].category = "For living";
  catalogLots["8"].seaDistBadge = "3 km from the sea";
  catalogLots["8"].descriptionLocation = "Location & Surroundings: Prestigious hilly district of Agios Athanasios in Limassol, where the best international schools (Foley's) are located. Breathtaking views of the entire city and sea.";
  catalogLots["8"].descriptionYield = "Why it is profitable: Luxurious duplex penthouse with a private roof garden and pool. Ideal for comfortable family life and prestigious relocation.";

  catalogLots["9"].title = "Amaya Seafront Villa";
  catalogLots["9"].location = "Paphos, Peyia";
  catalogLots["9"].expectedRent = "€7,000/month";
  catalogLots["9"].category = "Luxury resale";
  catalogLots["9"].seaDistBadge = "100 m from the sea";
  catalogLots["9"].descriptionLocation = "Location & Surroundings: First coastline in the prestigious Peyia area. Panoramic sea view from all bedrooms, private access to a secluded cove.";
  catalogLots["9"].descriptionYield = "Why it is profitable: Unique trophy real estate. Ideal location at the water's edge, exclusive architecture, highest capital appreciation.";
}

const lotOverlay = document.getElementById('lotModalOverlay');
const lotBody = document.getElementById('lotModalBody');
const lotClose = document.getElementById('lotModalClose');

if (lotOverlay && lotBody && lotClose) {
  const openLotModal = (id) => {
    const data = catalogLots[id];
    if (!data) return;

    // Build the gallery HTML template
    let galleryHtml = '';
    if (data.gallery && data.gallery.length > 0) {
      galleryHtml = `
        <div class="lot-modal-gallery">
          ${data.gallery.map((imgSrc, index) => `
            <div class="lot-thumb ${index === 0 ? 'active' : ''}" data-src="${imgSrc}">
              <img src="${imgSrc}" alt="Превью ${index + 1}">
            </div>
          `).join('')}
        </div>
      `;
    }

    const isEn = document.documentElement.lang === 'en';
    lotBody.innerHTML = `
      <div class="lot-modal-media">
        <div class="lot-modal-img-wrap">
          <img src="${data.image}" alt="${data.title}" class="lot-modal-img">
        </div>
        <div class="lot-modal-badges">
          <span class="lot-modal-badge roi">${data.roi}</span>
          <span class="lot-modal-badge category">${data.category}</span>
          <span class="lot-modal-badge sea-dist">${data.seaDistBadge}</span>
        </div>
        ${galleryHtml}
      </div>
      <div class="lot-modal-content">
        <div class="lot-meta">${isEn ? 'PROPERTY CATALOG // 2026' : 'КАТАЛОГ ОБЪЕКТОВ // 2026'}</div>
        <div class="lot-modal-header">
          <div class="lot-modal-title-group">
            <h2>${data.title}</h2>
            <div class="lot-modal-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>${data.location}</span>
            </div>
          </div>
          <div class="lot-price-block">
            <span class="lot-price-label">${isEn ? 'PROPERTY PRICE' : 'СТОИМОСТЬ ОБЪЕКТА'}</span>
            <div class="lot-modal-price">${data.price}</div>
          </div>
        </div>
        
        <div class="lot-modal-specs">
          <div class="lot-spec-card">
            <svg class="lot-spec-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 4v16M22 4v16M2 8h20M2 14h20M6 8v6M18 8v6"/>
            </svg>
            <div class="lot-spec-info">
              <span class="lot-spec-val">${data.bedrooms}</span>
              <span class="lot-spec-label">${isEn ? 'Bedrooms' : 'Спальни'}</span>
            </div>
          </div>
          <div class="lot-spec-card">
            <svg class="lot-spec-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 18a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8H4zM14 4a2 2 0 1 0-4 0v4h4z"/>
            </svg>
            <div class="lot-spec-info">
              <span class="lot-spec-val">${data.bathrooms}</span>
              <span class="lot-spec-label">${isEn ? 'Bathrooms' : 'Санузлы'}</span>
            </div>
          </div>
          <div class="lot-spec-card">
            <svg class="lot-spec-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
            </svg>
            <div class="lot-spec-info">
              <span class="lot-spec-val">${data.area}</span>
              <span class="lot-spec-label">${isEn ? 'Area' : 'Площадь'}</span>
            </div>
          </div>
          <div class="lot-spec-card">
            <svg class="lot-spec-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 10c3-3 3-3 6 0s3 3 6 0 3-3 6 0M2 14c3-3 3-3 6 0s3 3 6 0 3-3 6 0"/>
            </svg>
            <div class="lot-spec-info">
              <span class="lot-spec-val">${data.seaDistance}</span>
              <span class="lot-spec-label">${isEn ? 'Distance to sea' : 'До моря'}</span>
            </div>
          </div>
        </div>

        <div class="lot-modal-desc-grid">
          <div class="lot-desc-col">
            <h3>${isEn ? 'Location & surroundings' : 'Локация и окружение'}</h3>
            <p>${data.descriptionLocation}</p>
          </div>
          <div class="lot-desc-col">
            <h3>${isEn ? 'Investment benefit' : 'Инвестиционная выгода'}</h3>
            <p>${data.descriptionYield}</p>
          </div>
        </div>

        <div class="lot-modal-financials">
          <div class="lot-fin-info">
            <div class="lot-fin-row">
              <span class="lot-fin-label">${isEn ? 'Expected rent' : 'Ожидаемая аренда'}</span>
              <span class="lot-fin-val highlight">${data.expectedRent}</span>
            </div>
            <div class="lot-fin-row">
              <span class="lot-fin-label">${isEn ? 'Transfer tax' : 'Налог на оформление'}</span>
              <span class="lot-fin-val">${data.transferTax}</span>
            </div>
          </div>
          <div class="lot-fin-action">
            <form class="lot-modal-form">
              <input type="tel" placeholder="${isEn ? 'Your phone number' : 'Ваш номер телефона'}" required>
              <button type="submit" class="btn btn-gold btn-lg shimmer-btn" style="width: 100%; justify-content: center;">
                <span class="btn-text-desktop">${isEn ? 'Request detailed financial calculation' : 'Запросить детальный финансовый расчет'}</span>
                <span class="btn-text-mobile">${isEn ? 'Request calculation' : 'Запросить расчет'}</span>
                <svg class="btn-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 8px;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
              <div class="form-agreement">
                <label class="agreement-label">
                  <input type="checkbox" required class="agreement-checkbox" oninvalid="this.setCustomValidity('${isEn ? 'To proceed, you must consent to the processing of personal data' : 'Для продолжения необходимо согласиться с обработкой персональных данных'}')" oninput="this.setCustomValidity('')">
                  <span class="agreement-text">
                    ${isEn 
                      ? `I consent to the processing of my <a href="consent.html" target="_blank">personal data</a> in accordance with the <a href="privacy.html" target="_blank">Privacy Policy</a>`
                      : `Даю согласие на обработку моих <a href="consent.html" target="_blank">персональных данных</a> в соответствии с <a href="privacy.html" target="_blank">Политикой конфиденциальности</a>`
                    }
                  </span>
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    // Setup phone validation for lot modal
    const lotPhoneInput = lotBody.querySelector('.lot-modal-form input[type="tel"]');
    if (typeof setupPhoneValidation === 'function') {
      setupPhoneValidation(lotPhoneInput);
    }

    // Setup interactive gallery handler
    const thumbnails = lotBody.querySelectorAll('.lot-thumb');
    const mainImg = lotBody.querySelector('.lot-modal-img');
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        const newSrc = thumb.getAttribute('data-src');
        if (mainImg && newSrc) {
          mainImg.style.opacity = '0';
          setTimeout(() => {
            mainImg.src = newSrc;
            mainImg.style.opacity = '1';
          }, 150);
        }
      });
    });

    // Setup submission for form inside the modal
    const lotForm = lotBody.querySelector('.lot-modal-form');
    if (lotForm) {
      const lotPhoneInput = lotForm.querySelector('input[type="tel"]');
      if (typeof setupPhoneValidation === 'function') {
        setupPhoneValidation(lotPhoneInput);
      }
      lotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const phoneVal = lotPhoneInput.value;
        const isEn = document.documentElement.lang === 'en';
        
        const submitBtn = lotForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = isEn ? '<span>Calculation Requested ✓</span>' : '<span>Расчет запрошен ✓</span>';
        submitBtn.classList.add('success');
        submitBtn.style.pointerEvents = 'none';
        
        // Отправка данных на сервер
        sendLeadData({
          phone: phoneVal,
          source: isEn ? `Financial calculation request for property: ${data.title}` : `Запрос финансового расчета по объекту: ${data.title}`,
          lot_details: isEn ? {
            'Lot ID': id,
            'Title': data.title,
            'Price': data.price,
            'Location': data.location,
            'ROI': data.roi
          } : {
            'ID лота': id,
            'Название': data.title,
            'Цена': data.price,
            'Локация': data.location,
            'ROI': data.roi
          }
        });

        setTimeout(() => {
          closeLotModal();
        }, 5000);
      });
    }



    lotOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeLotModal() {
    console.log("closeLotModal called, resetting overflow");
    lotOverlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      lotBody.innerHTML = '';
    }, 350);
  }

  // Event delegation on the parent container (handles infinite slider clones)
  const catalogSlider = document.getElementById('catalogSlider');
  if (catalogSlider) {
    catalogSlider.addEventListener('click', (e) => {
      const btn = e.target.closest('.card-btn');
      if (!btn) return;
      
      const card = btn.closest('.catalog-card');
      if (!card) return;
      
      e.preventDefault();
      const lotId = card.getAttribute('data-lot-id');
      if (lotId) {
        openLotModal(lotId);
      }
    });
  }

  lotClose.addEventListener('click', closeLotModal);

  let lotOverlayMousedownTarget = null;
  lotOverlay.addEventListener('mousedown', (e) => {
    lotOverlayMousedownTarget = e.target;
  });
  lotOverlay.addEventListener('click', (e) => {
    if (e.target === lotOverlay && lotOverlayMousedownTarget === lotOverlay) {
      closeLotModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lotOverlay.classList.contains('active')) {
      closeLotModal();
    }
  });
}

// ===== INTERACTIVE QUIZ POPUP LOGIC =====
const quizOverlay = document.getElementById('quizModalOverlay');
const quizBody = document.getElementById('quizModalBody');
const quizClose = document.getElementById('quizModalClose');

if (quizOverlay && quizBody && quizClose) {
  const quizQuestions = document.documentElement.lang === 'en' ? [
    {
      question: "What is your priority goal in Cyprus?",
      hint: "We help the client identify their goals",
      options: [
        { label: "A. Preserve capital in hard currency (Investments with ROI 6-8%)", value: "ROI 6-8%" },
        { label: "B. Obtain lifetime Permanent Residency for the family and relocate", value: "Permanent Residency" },
        { label: "C. Delegate property to reliable management", value: "Management" },
        { label: "D. Combined goal: liquid property + residency status", value: "Combined" }
      ]
    },
    {
      question: "What budget are you targeting for your strategy?",
      hint: "Qualification by budget. In Cyprus, Permanent Residency starts from €300k + VAT",
      options: [
        { label: "A. Up to €300,000 (Selection for residency/rental)", value: "Up to 300k" },
        { label: "B. €300,000 – €600,000 (Optimal for Permanent Residency & business class)", value: "300k-600k" },
        { label: "C. From €600,000 and above (Premium segment and villas)", value: "From 600k" },
        { label: "D. Just studying the entry threshold for now", value: "Studying" }
      ]
    },
    {
      question: "How critical is the legalization issue for you (PR/Residency)?",
      hint: "Determining the volume of legal work",
      options: [
        { label: "A. Need Permanent Residency turnkey in the shortest time", value: "PR fast" },
        { label: "B. Temporary residency (Pink Slip) or visitor visa", value: "TR" },
        { label: "C. Legalization not required, only interested in yields", value: "Not required" }
      ]
    },
    {
      question: "How do you plan to use the property after purchase?",
      hint: "Selling the idea of our 360° Management",
      options: [
        { label: "A. Plan to live myself (need infrastructure, schools)", value: "Live myself" },
        { label: "B. Want to rent it out and generate income (need management)", value: "Rental" },
        { label: "C. Plan to resell at handover (Capital Gain)", value: "Resell" }
      ]
    },
    {
      question: "Do you have open EU bank accounts or understand how to transfer funds?",
      hint: "The most painful question of 2024-2026. Showing we are experts",
      options: [
        { label: "A. Yes, accounts are open, source of funds is verified", value: "Accounts open" },
        { label: "B. Need consultation on Swift transfers and bank compliance", value: "Need consultation" },
        { label: "C. Plan to use alternative payment methods", value: "Alternative" }
      ]
    },
    {
      question: "What should be the ideal result of our work in 4 months?",
      hint: "The client states their own victory",
      options: [
        { label: "A. I have the keys and an agreement with a tenant", value: "Keys + tenant" },
        { label: "B. My family has obtained Cyprus residency status", value: "Residency status" },
        { label: "C. I receive passive income from Cyprus real estate", value: "Passive income" }
      ]
    }
  ] : [
    {
      question: "Какая приоритетная задача стоит перед вами на Кипре?",
      hint: "Помогаем клиенту самоидентифицироваться",
      options: [
        { label: "А. Сохранить капитал в твердой валюте (Инвестиции с ROI 6-8%)", value: "ROI 6-8%" },
        { label: "Б. Получить бессрочный ПМЖ для всей семьи и переехать", value: "ПМЖ" },
        { label: "В. Передать имеющийся объект в надежное управление", value: "Управление" },
        { label: "Г. Комбинированная цель: ликвидная недвижимость + статус резидента", value: "Комбинированная" }
      ]
    },
    {
      question: "На какой бюджет вы ориентируетесь для реализации стратегии?",
      hint: "Квалификация по «чеку». На Кипре ПМЖ за инвестиции стартует от €300к + НДС",
      options: [
        { label: "А. До €300,000 (Подбор под ВНЖ/аренду)", value: "До 300k" },
        { label: "Б. €300,000 – €600,000 (Оптимально для ПМЖ и бизнес-класса)", value: "300k-600k" },
        { label: "В. От €600,000 и выше (Премиальный сегмент и виллы)", value: "От 600k" },
        { label: "Г. Пока только изучаю порог входа", value: "Изучаю" }
      ]
    },
    {
      question: "Насколько критичен для вас вопрос легализации (ПМЖ/ВНЖ)?",
      hint: "Определяем объем юридической работы",
      options: [
        { label: "А. Нужен ПМЖ «под ключ» в кратчайшие сроки", value: "ПМЖ быстро" },
        { label: "Б. ВНЖ (Pink Slip) или гостевая виза", value: "ВНЖ" },
        { label: "В. Легализация не требуется, интересует только доходность", value: "Не требуется" }
      ]
    },
    {
      question: "Как вы планируете распоряжаться объектом после покупки?",
      hint: "Продаем идею вашего «Управления 360°»",
      options: [
        { label: "А. Планирую жить сам (нужна инфраструктура, школы)", value: "Жить сам" },
        { label: "Б. Хочу сдавать в аренду и получать доход (нужно управление)", value: "Аренда" },
        { label: "В. Планирую перепродать на этапе сдачи (Capital Gain)", value: "Перепродажа" }
      ]
    },
    {
      question: "Есть ли у вас открытые счета в ЕС или понимание, как перевести средства?",
      hint: "Самый «больной» вопрос 2024-2026 годов. Показываем, что мы в теме",
      options: [
        { label: "А. Да, счета открыты, происхождение средств подтверждено", value: "Счета открыты" },
        { label: "Б. Нужна консультация по Swift-переводам и банковскому комплаенсу", value: "Нужна консультация" },
        { label: "В. Планирую использовать альтернативные способы оплаты", value: "Альтернативные" }
      ]
    },
    {
      question: "Каким должен быть идеальный результат нашей работы через 4 месяца?",
      hint: "Клиент сам проговаривает свою «победу»",
      options: [
        { label: "А. У меня на руках ключи и договор с арендатором", value: "Ключи + аренда" },
        { label: "Б. Моя семья получила статус резидентов Кипра", value: "Статус резидентов" },
        { label: "В. Я получаю пассивный доход с недвижимости на Кипре", value: "Пассивный доход" }
      ]
    }
  ];

  let currentStep = 0;
  let answers = {};

  const renderQuizStep = () => {
    if (currentStep < quizQuestions.length) {
      const q = quizQuestions[currentStep];
      const progressPercent = Math.round((currentStep / quizQuestions.length) * 100);
      
      const isEn = document.documentElement.lang === 'en';
      quizBody.innerHTML = `
        <div class="quiz-header">
          <span class="quiz-badge">${isEn ? 'Property Match in 2 Minutes' : 'Подбор объекта за 2 минуты'}</span>
          <h2 class="quiz-title">${isEn ? 'We Will Find Your Property' : 'Подберём объект на Кипре'}</h2>
          <p class="quiz-subtitle">${isEn ? 'Answer 6 questions to get a personalized property selection with an accurate ROI calculation matching your goals' : 'Ответьте на 6 вопросов, чтобы получить подборку объектов с точным расчётом ROI под ваши цели'}</p>
        </div>

        <div class="quiz-progress-wrap">
          <div class="quiz-progress-info">
            <span>${isEn ? `Question ${currentStep + 1} of ${quizQuestions.length}` : `Вопрос ${currentStep + 1} из ${quizQuestions.length}`}</span>
            <span class="quiz-progress-pct">${progressPercent}%</span>
          </div>
          <div class="quiz-progress-bar-bg">
            <div class="quiz-progress-bar-fill" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <div class="quiz-question-container">
          <h3 class="quiz-question-title">${q.question}</h3>
          <div class="quiz-options-grid">
            ${q.options.map((opt, idx) => `
              <button class="quiz-option-card" data-idx="${idx}">
                <span>${opt.label}</span>
                <span class="quiz-option-indicator"></span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="quiz-footer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>${isEn ? 'Your data is secure and will not be shared with third parties' : 'Ваши данные защищены и не передаются третьим лицам'}</span>
        </div>
      `;

      // Bind options click
      quizBody.querySelectorAll('.quiz-option-card').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-idx'));
          const selectedOption = q.options[idx];
          answers[q.question] = selectedOption.value;

          btn.classList.add('selected');
          
          // Animate transition to next step
          setTimeout(() => {
            const container = quizBody.querySelector('.quiz-question-container');
            if (container) container.style.opacity = '0';
            setTimeout(() => {
              currentStep++;
              renderQuizStep();
            }, 300);
          }, 350);
        });
      });

    } else {
      const isEn = document.documentElement.lang === 'en';
      // Final form step
      quizBody.innerHTML = `
        <div class="quiz-form-wrap">
          <div class="quiz-success-icon">✓</div>
          <h2 class="quiz-form-title">${isEn ? 'Your Personalized Selection is Ready!' : 'Ваш персональный подбор готов!'}</h2>
          <p class="quiz-form-desc">${isEn ? 'We have analyzed your answers. Enter your name and phone number to receive the property catalog with ROI calculation via WhatsApp or Telegram.' : 'Мы проанализировали ваши ответы. Укажите имя и телефон для получения каталога объектов с расчётом ROI в WhatsApp или Telegram'}</p>
          <form class="quiz-final-form" id="quizFinalForm">
            <div class="quiz-form-fields">
              <input type="text" placeholder="${isEn ? 'Your name' : 'Ваше имя'}" class="quiz-input" id="quizName" name="name" autocomplete="name">
              <input type="tel" placeholder="${isEn ? 'Your phone number' : 'Ваш номер телефона'}" required class="quiz-input" id="quizPhone" name="phone" autocomplete="tel">
            </div>
              <div class="form-agreement">
                <label class="agreement-label">
                  <input type="checkbox" required class="agreement-checkbox" oninvalid="this.setCustomValidity('${isEn ? 'To proceed, you must consent to the processing of personal data' : 'Для продолжения необходимо согласиться с обработкой персональных данных'}')" oninput="this.setCustomValidity('')">
                  <span class="agreement-text">
                    ${isEn 
                      ? `I consent to the processing of my <a href="consent.html" target="_blank">personal data</a> in accordance with the <a href="privacy.html" target="_blank">Privacy Policy</a>`
                      : `Даю согласие на обработку моих <a href="consent.html" target="_blank">персональных данных</a> в соответствии с <a href="privacy.html" target="_blank">Политикой конфиденциальности</a>`
                    }
                  </span>
                </label>
              </div>
            <button type="submit" class="btn btn-gold btn-lg shimmer-btn" style="width: 100%">
              <span>${isEn ? 'Get Selection & ROI Payouts' : 'Получить подборку и расчёт'}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 8px;">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </form>
          <div class="quiz-footer" style="margin-top: 24px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>${isEn ? 'Privacy is guaranteed' : 'Конфиденциальность гарантируется'}</span>
          </div>
        </div>
      `;

      const finalForm = document.getElementById('quizFinalForm');
      if (finalForm) {
        const quizPhoneInput = document.getElementById('quizPhone');
        if (typeof setupPhoneValidation === 'function') {
          setupPhoneValidation(quizPhoneInput);
        }
        finalForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const nameVal = document.getElementById('quizName').value;
          const phoneVal = document.getElementById('quizPhone').value;
          
          console.log('Quiz completed!', {
            answers,
            contact: { name: nameVal, phone: phoneVal }
          });

          // Отправка данных на сервер
          sendLeadData({
            name: nameVal,
            phone: phoneVal,
            source: 'Квиз: Подбор объекта за 2 минуты',
            quiz_answers: answers
          });

          const isEn = document.documentElement.lang === 'en';
          // Show success message
          const namePart = nameVal.trim() 
            ? (isEn ? `Thank you, ${nameVal.trim()}.` : `Спасибо, ${nameVal.trim()}.`) 
            : (isEn ? 'Thank you!' : 'Спасибо!');
          quizBody.innerHTML = `
            <div class="quiz-form-wrap" style="padding: 40px 0;">
              <div class="quiz-success-icon" style="background: rgba(45, 122, 70, 0.1); border-color: #2d7a46; color: #2d7a46;">✓</div>
              <h2 class="quiz-form-title" style="color: #2d7a46;">${isEn ? 'Request Received!' : 'Заявка принята!'}</h2>
              <p class="quiz-form-desc">${namePart} ${isEn ? `We are preparing your personalized property selection and ROI calculation. We will send the materials to ${phoneVal} shortly.` : `Мы готовим для вас индивидуальную подборку и расчет ROI. Отправим материалы на номер ${phoneVal} в ближайшее время.`}</p>
            </div>
          `;

          setTimeout(() => {
            closeQuizModal();
          }, 6000);
        });
      }
    }
  };

  const openQuizModal = () => {
    currentStep = 0;
    answers = {};
    renderQuizStep();
    quizOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeQuizModal() {
    console.log("closeQuizModal called, resetting overflow");
    quizOverlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      quizBody.innerHTML = '';
    }, 350);
  }

  // Bind all buttons with .open-quiz-btn class
  document.querySelectorAll('.open-quiz-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openQuizModal();
    });
  });

  quizClose.addEventListener('click', closeQuizModal);
  let quizOverlayMousedownTarget = null;
  quizOverlay.addEventListener('mousedown', (e) => {
    quizOverlayMousedownTarget = e.target;
  });
  quizOverlay.addEventListener('click', (e) => {
    if (e.target === quizOverlay && quizOverlayMousedownTarget === quizOverlay) {
      closeQuizModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quizOverlay.classList.contains('active')) {
      closeQuizModal();
    }
  });
}

// ===== GENERAL FEEDBACK POPUP LOGIC =====
const feedbackOverlay = document.getElementById('feedbackModalOverlay');
const feedbackClose = document.getElementById('feedbackModalClose');
const feedbackForm = document.getElementById('feedbackModalForm');

if (feedbackOverlay && feedbackClose && feedbackForm) {
  const openFeedbackModal = () => {
    feedbackOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeFeedbackModal() {
    console.log("closeFeedbackModal called, resetting overflow");
    feedbackOverlay.classList.remove('active');
    document.body.style.overflow = '';
    feedbackForm.reset();
  }

  document.querySelectorAll('.open-feedback-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openFeedbackModal();
    });
  });

  feedbackClose.addEventListener('click', closeFeedbackModal);
  let feedbackOverlayMousedownTarget = null;
  feedbackOverlay.addEventListener('mousedown', (e) => {
    feedbackOverlayMousedownTarget = e.target;
  });
  feedbackOverlay.addEventListener('click', (e) => {
    if (e.target === feedbackOverlay && feedbackOverlayMousedownTarget === feedbackOverlay) {
      closeFeedbackModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && feedbackOverlay.classList.contains('active')) {
      closeFeedbackModal();
    }
  });

  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('feedbackName').value;
    const phone = document.getElementById('feedbackPhone').value;
    
    console.log('Feedback submitted:', { name, phone });

    const submitBtn = feedbackForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<span>Заявка отправлена ✓</span>';
    submitBtn.style.background = '#2d7a46';
    submitBtn.style.borderColor = '#2d7a46';
    submitBtn.style.pointerEvents = 'none';

    // Отправка данных на сервер
    sendLeadData({
      name: name,
      phone: phone,
      source: 'Заказ обратного звонка (Модальное окно)'
    });

    setTimeout(() => {
      closeFeedbackModal();
      // Reset button style
      setTimeout(() => {
        submitBtn.innerHTML = '<span>Отправить заявку</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 8px;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
        submitBtn.style.background = '';
        submitBtn.style.borderColor = '';
        submitBtn.style.pointerEvents = '';
      }, 400);
    }, 4000);
  });
}

// ===== PHONE VALIDATION HELPER =====
const setupPhoneValidation = (inputElement) => {
  if (!inputElement) return;

  const isEn = document.documentElement.lang === 'en';
  const onlyDigitsMsg = isEn ? 'Only digits are allowed' : 'Разрешены только цифры';
  const phoneLengthMsg = isEn ? 'Phone number must contain between 7 and 15 digits' : 'Номер телефона должен содержать от 7 до 15 цифр';

  // Create or find error message container
  let errorMsg = inputElement.parentNode.querySelector('.phone-error-msg');
  if (!errorMsg) {
    errorMsg = document.createElement('div');
    errorMsg.className = 'phone-error-msg';
    // Style to match existing design
    errorMsg.style.color = '#ff6b6b';
    errorMsg.style.fontSize = '12px';
    errorMsg.style.marginTop = '4px';
    errorMsg.style.minHeight = '18px';
    errorMsg.style.opacity = '0';
    errorMsg.style.display = 'none';
    errorMsg.style.transition = 'opacity 0.3s ease';
    // Insert after input element
    inputElement.parentNode.insertBefore(errorMsg, inputElement.nextSibling);
  }

  let errorTimeout;

  const showError = (text) => {
    errorMsg.textContent = text;
    errorMsg.style.display = 'block';
    // Force reflow
    errorMsg.offsetHeight;
    errorMsg.style.opacity = '1';
    if (text === onlyDigitsMsg) {
      clearTimeout(errorTimeout);
      errorTimeout = setTimeout(() => {
        clearError();
      }, 3000);
    }
  };

  const clearError = () => {
    clearTimeout(errorTimeout);
    errorMsg.style.opacity = '0';
    setTimeout(() => {
      if (errorMsg.style.opacity === '0') {
        errorMsg.style.display = 'none';
        errorMsg.textContent = '';
      }
    }, 300);
  };

  const handleInput = (e) => {
    const rawValue = inputElement.value;
    const selectionStart = inputElement.selectionStart;
    const selectionEnd = inputElement.selectionEnd;

    // 1. Detect if there are invalid characters in rawValue
    let hasInvalidChars = false;
    for (let i = 0; i < rawValue.length; i++) {
      const char = rawValue[i];
      if (char === '+') {
        if (i !== 0) hasInvalidChars = true;
      } else if (!/\d/.test(char)) {
        hasInvalidChars = true;
      }
    }

    // 2. Build sanitized value
    let sanitized = rawValue;
    // Auto-prepend '+' if it starts with a digit
    if (sanitized && !sanitized.startsWith('+')) {
      if (/^\d/.test(sanitized)) {
        sanitized = '+' + sanitized;
      } else {
        // If it starts with non-digits (excluding +), remove them
        sanitized = sanitized.replace(/^[^\d+]+/, '');
        if (/^\d/.test(sanitized)) {
          sanitized = '+' + sanitized;
        }
      }
    }

    // Keep only '+' at the beginning and digits after it
    if (sanitized.length > 0) {
      const firstChar = sanitized[0] === '+' ? '+' : '';
      const rest = sanitized.slice(firstChar ? 1 : 0);
      const cleanRest = rest.replace(/\D/g, '');
      const maxDigits = 15;
      sanitized = firstChar + cleanRest.slice(0, maxDigits);
    }

    // 3. Update value and restore cursor position
    if (inputElement.value !== sanitized) {
      // Calculate how many digits were before the selection start in rawValue
      const valBeforeCursor = rawValue.slice(0, selectionStart);
      const digitsBeforeCursor = valBeforeCursor.replace(/\D/g, '').length;
      
      inputElement.value = sanitized;
      
      // Calculate new cursor position in sanitized value
      let newCursorPos = digitsBeforeCursor;
      if (sanitized.startsWith('+')) {
        newCursorPos += 1;
      }
      newCursorPos = Math.min(newCursorPos, sanitized.length);
      inputElement.setSelectionRange(newCursorPos, newCursorPos);
    }

    // 4. Show error if invalid characters were blocked
    if (hasInvalidChars) {
      showError(onlyDigitsMsg);
    } else {
      // If we are typing valid characters, clear the length error immediately
      if (errorMsg.textContent === phoneLengthMsg) {
        clearError();
      } else {
        const cleanDigits = sanitized.replace(/\D/g, '');
        if (cleanDigits.length === 0 || cleanDigits.length >= 7) {
          clearError();
        }
      }
    }
  };

  const handleBlur = () => {
    const value = inputElement.value;
    const cleanDigits = value.replace(/\D/g, '');
    if (cleanDigits.length > 0 && cleanDigits.length < 7) {
      showError(phoneLengthMsg);
    }
  };

  inputElement.addEventListener('input', handleInput);
  inputElement.addEventListener('blur', handleBlur);

  // Form submit interception in capturing phase to block submission of invalid phone numbers
  const form = inputElement.form;
  if (form) {
    form.addEventListener('submit', (e) => {
      const cleanDigits = inputElement.value.replace(/\D/g, '');
      if (cleanDigits.length > 0 && (cleanDigits.length < 7 || cleanDigits.length > 15)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        showError(phoneLengthMsg);
        inputElement.focus();
      }
    }, true);
  }
  
  // Run initial validation check
  handleInput();
};

// Bind validation to static form fields on load
setupPhoneValidation(document.getElementById('phone'));
setupPhoneValidation(document.getElementById('feedbackPhone'));
document.querySelectorAll('.service-expanded-form input[type="tel"]').forEach(input => {
  setupPhoneValidation(input);
});

// ===== SMOOTH SCROLL & NAVIGATION CONNECTIONS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');

    // Close mobile menu if it is currently open
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && navLinks.style.display === 'flex') {
      navLinks.style.cssText = '';
    }

    if (targetId === '#') {
      // Scroll to the very top of the page smoothly
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Scroll to the target anchor smoothly
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  });
});

// ===== COOKIE CONSENT BANNER LOGIC =====
(() => {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;

  const btnAcceptAll = document.getElementById('cookieAcceptAllBtn');
  const btnDecline = document.getElementById('cookieDeclineBtn');
  const btnSettings = document.getElementById('cookieSettingsBtn');
  const btnSaveSettings = document.getElementById('cookieSaveSettingsBtn');
  const panelSettings = document.getElementById('cookieSettingsPanel');
  
  const chkAnalytics = document.getElementById('cookieAnalytics');
  const chkMarketing = document.getElementById('cookieMarketing');

  const CONSENT_KEY = 'cookie_consent_status';

  // Global consent API
  window.getCookieConsent = () => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Failed to parse cookie consent', e);
      return null;
    }
  };

  const saveConsent = (analytics, marketing) => {
    const consent = {
      necessary: true,
      analytics: !!analytics,
      marketing: !!marketing,
      timestamp: new Date().toISOString()
    };
    
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
      
      // Also set a technical cookie for backend compatibility (expires in 1 year)
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);
      document.cookie = `cookie_consent=${encodeURIComponent(JSON.stringify(consent))}; path=/; expires=${expiry.toUTCString()}; SameSite=Lax; Secure`;
      
      // Dispatch a custom event to notify external tracking scripts
      window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: consent }));
    } catch (e) {
      console.error('Failed to save cookie consent', e);
    }
    
    // Smooth hide banner
    banner.classList.remove('show');
    banner.setAttribute('aria-hidden', 'true');
  };

  // Show banner if consent is not yet given
  const initBanner = () => {
    const currentConsent = window.getCookieConsent();
    if (!currentConsent) {
      setTimeout(() => {
        banner.classList.add('show');
        banner.setAttribute('aria-hidden', 'false');
      }, 1500);
    } else {
      // Sync checkboxes with stored consent just in case settings panel is opened later
      if (chkAnalytics) chkAnalytics.checked = !!currentConsent.analytics;
      if (chkMarketing) chkMarketing.checked = !!currentConsent.marketing;
    }
  };

  // Button listeners
  if (btnAcceptAll) {
    btnAcceptAll.addEventListener('click', () => {
      saveConsent(true, true);
    });
  }

  if (btnDecline) {
    btnDecline.addEventListener('click', () => {
      saveConsent(false, false);
    });
  }

  if (btnSettings) {
    btnSettings.addEventListener('click', (e) => {
      e.preventDefault();
      if (panelSettings) {
        const isHidden = panelSettings.style.display === 'none';
        panelSettings.style.display = isHidden ? 'block' : 'none';
        const isEn = document.documentElement.lang === 'en';
        btnSettings.textContent = isHidden ? (isEn ? 'Hide Settings' : 'Скрыть настройки') : (isEn ? 'Settings' : 'Настройки');
        btnSettings.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      }
    });
  }

  if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', () => {
      const analytics = chkAnalytics ? chkAnalytics.checked : false;
      const marketing = chkMarketing ? chkMarketing.checked : false;
      saveConsent(analytics, marketing);
    });
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBanner);
  } else {
    initBanner();
  }
})();

