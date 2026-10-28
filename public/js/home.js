/**
 * Home page logic for Aditi Sharma Portfolio
 * Built on the authentic gahan.earth interaction engine:
 * - <card-carousel> WebGL 3D card carousel with GPU shaders (Stretch, Bulge, Drum, Shatter, Thanos)
 * - <segmented-control> spring-physics effect switcher
 * - PFSound Web Audio engine synchronization
 * - Letter-roll hover animations on links
 * - Center card click to open Case Study Drawer
 * - Session restoration via sessionStorage.pf.lastProject
 */
(function () {
    'use strict';

    var PROJECTS = [
        {
            slug: 'myjio',
            title: 'MyJio App Redesign',
            subtitle: 'Telecom & Multi-Service Super App Architecture',
            image: '/assets/projects/web/card-myjio.webp',
            behanceUrl: 'https://www.behance.net/gallery/246794973/MyJio-App-Redesign',
            role: 'Product Designer & Systems Architect',
            category: 'Super App & Design System',
            metrics: [{ label: 'Recharge Speed', value: '3.2s' }, { label: 'Visual Clutter', value: '-50%' }, { label: 'Task Success', value: '96.8%' }],
            challenge: 'With over 400 million active users, the MyJio super-app suffered from feature bloat, high cognitive overload, and buried core telecom utility actions.',
            approach: 'Modularized the home dashboard with dynamic smart utility widgets, reduced recharge steps from 6 to 2, and standardized a high-contrast accessible design system.',
            steps: [
                { title: 'Super-App Information Architecture Audit', desc: 'Deconstructed 60+ nested sub-services into 4 clear functional zones.' },
                { title: 'One-Tap Recharge Flow', desc: 'Replaced multi-step forms with contextual quick-pay cards and biometric checkout.' },
                { title: 'Modular Card Grid System', desc: 'Engineered an adaptable widget layout accommodating personalized telecom alerts.' },
                { title: 'Accessibility & Contrast Benchmarking', desc: 'Tested WCAG AAA compliance for diverse regional demographic readability.' }
            ]
        },
        {
            slug: 'breez',
            title: 'Breez Mobility',
            subtitle: 'Premium Electric Chauffeur Platform',
            image: '/assets/projects/web/card-breez.webp',
            behanceUrl: 'https://www.behance.net/gallery/256963973/Breez-Premium-Mobility',
            role: 'Product & Interaction Designer',
            category: 'Mobility & Responsive Web',
            metrics: [{ label: 'Booking Speed', value: '2.1 min' }, { label: 'Task Success', value: '99.4%' }, { label: 'Conversion', value: '+38%' }],
            challenge: 'Enterprise corporate clients required multi-rider expense routing, while individual VIP riders demanded immediate luxury vehicle allocation without cognitive friction.',
            approach: 'Designed a split-purpose dual routing architecture allowing instant ride requests on mobile while offering deep corporate dashboard fleet controls on widescreen views.',
            steps: [
                { title: 'B2B vs. B2C Stakeholder Segmentation', desc: 'Mapped executive assistants booking recurring trips vs. individual airport transfers.' },
                { title: 'One-Handed Mobile Itinerary Builder', desc: 'Crafted bottom-sheet booking controls optimized for thumb zones.' },
                { title: 'Adaptive Luxury Dark Palette', desc: 'Selected deep obsidian surfaces, precision sapphire accents, and tabular typography.' },
                { title: 'Real-Time Telemetry & Chauffeur Status', desc: 'Live interactive vehicle arrival cards with route progression animations.' }
            ]
        },
        {
            slug: 'canteen-2',
            title: 'Canteen 2.0',
            subtitle: 'Campus Dining & Pickup Ecosystem',
            image: '/assets/projects/web/card-canteen-2.webp',
            behanceUrl: 'https://www.behance.net/gallery/256956757/Canteen-20',
            role: 'Lead Product Designer & UX Researcher',
            category: 'Product & Service Design',
            metrics: [{ label: 'Dwell Time', value: '-75%' }, { label: 'Accuracy', value: '98.2%' }, { label: 'Satisfaction', value: '4.9/5' }],
            challenge: 'During peak class breaks, over 400 students simultaneously flooded the canteen counter, causing severe queue bottlenecks, order errors, and high wait times.',
            approach: 'Conducted on-site ethnographic shadowing, reorganized 120+ menu items into fast-tap categorical clusters, and decoupled ordering from payment with real-time preparation notifications.',
            steps: [
                { title: 'Field Shadowing & Friction Mapping', desc: 'Identified decision paralysis at printed menus as the root cause of queue halts.' },
                { title: 'IA Restructure & Real-time States', desc: 'Re-indexed menu items with stock availability indicators.' },
                { title: 'Haptic Micro-Interactions & Cart Flow', desc: 'Designed rapid add-to-cart thumb gestures and dual-tab meal customization.' },
                { title: 'Staged Counter Handover Protocol', desc: 'Replaced verbal number shouting with numerical bay allocation.' }
            ]
        },
        {
            slug: 'foodmate',
            title: 'Foodmate',
            subtitle: 'Smart Meal Planning & Pantry Expiry Tracker',
            image: '/assets/projects/web/card-foodmate.webp',
            behanceUrl: 'https://www.behance.net/gallery/246237433/Foodmate',
            role: 'UX Researcher & Interaction Designer',
            category: 'Consumer Mobile & Sustainability',
            metrics: [{ label: 'Food Waste', value: '-42%' }, { label: 'Prep Time Saved', value: '3.5 hrs/wk' }, { label: 'Repeat Use', value: '81%' }],
            challenge: 'Household food waste causes substantial financial loss and environmental impact due to unmonitored pantry expirations and disjointed grocery lists.',
            approach: 'Developed an intelligent pantry scanning interface that recommends personalized recipes based on expiring ingredients and auto-syncs grocery cart items.',
            steps: [
                { title: 'Kitchen Ethnography & Waste Logging', desc: 'Tracked kitchen discard habits across 20 suburban households.' },
                { title: 'Barcode & Receipt OCR Scanner', desc: 'Instant item logging with automatic shelf-life categorization.' },
                { title: 'Dynamic Recipe Suggester', desc: 'Smart recipe cards ranked by ingredients currently in danger of spoiling.' },
                { title: 'Collaborative Household Grocery Sync', desc: 'Real-time multi-user cart checkoff for shared apartments.' }
            ]
        },
        {
            slug: 'what-scene',
            title: 'What Scene?',
            subtitle: 'Social Event & Group Decision App',
            image: '/assets/projects/web/card-what-scene.webp',
            behanceUrl: 'https://www.behance.net/gallery/249215845/What-Scene',
            role: 'Product Designer & UX Researcher',
            category: 'Social Discovery & Mobile UX',
            metrics: [{ label: 'Decision Time', value: '-60%' }, { label: 'Group Alignment', value: '94%' }, { label: 'Engagement', value: '+4.2x' }],
            challenge: 'Group social outings suffer from decision fatigue, endless back-and-forth messaging across chat apps, and fragmented venue links.',
            approach: 'Engineered a collaborative polling and discovery interface with swipable venue cards, synchronized group voting, and integrated location-based reservations.',
            steps: [
                { title: 'Social Decision Mapping', desc: 'Identified hesitation loops in friend group chats when picking venues.' },
                { title: 'Swipe & Vote Micro-Interactions', desc: 'Designed rapid gesture-based voting cards to reach consensus in seconds.' },
                { title: 'AI-Curated Recommendations', desc: 'Contextual activity suggestions tailored to group vibe, distance, and budget.' },
                { title: 'Itinerary Synchronization', desc: 'One-tap calendar and map sharing with unified Uber/ride integration.' }
            ]
        },
        {
            slug: 'gigverse',
            title: 'Gigverse',
            subtitle: 'Decentralized Creator Economy Marketplace',
            image: '/assets/projects/web/card-gigverse.webp',
            behanceUrl: 'https://www.behance.net/gallery/246768791/Gigverse',
            role: 'Product Architect & UX Designer',
            category: 'Marketplace & Fintech UX',
            metrics: [{ label: 'Match Rate', value: '89%' }, { label: 'Payout Speed', value: '< 1 hr' }, { label: 'Dispute Rate', value: '< 1.2%' }],
            challenge: 'Freelance digital creators face opaque platform fees, delayed international escrow payouts, and fragmented portfolio verification.',
            approach: 'Architected a transparent gig discovery marketplace featuring smart contract escrow milestone releases, instant wallet withdrawals, and verified talent scorecards.',
            steps: [
                { title: 'Creator Monetization Friction Audit', desc: 'Interviewed 40 independent digital artists on payment and contract pain points.' },
                { title: 'Milestone Escrow Visualization', desc: 'Crafted transparent timeline cards showing funds locked, approved, and released.' },
                { title: 'Interactive Talent Profiles', desc: 'Rich media showcase grids displaying live verified client reviews.' },
                { title: 'Frictionless Payout Gateway', desc: 'Multi-currency and instant crypto/fiat withdrawal switches.' }
            ]
        }
    ];

    window.ADITI_PROJECTS = PROJECTS;

    var carousel = document.getElementById('work-carousel');

    if (carousel) {
        if (typeof carousel.set === 'function') {
            carousel.set({ effect: 'drum' });
        }
        var projectUrls = PROJECTS.map(function (p) { return p.image; });
        carousel.images = projectUrls;
        if (typeof carousel.set !== 'function' && window.customElements && typeof window.customElements.whenDefined === 'function') {
            customElements.whenDefined('card-carousel').then(function () {
                carousel.images = projectUrls;
            });
        }

        var current = 0;
        function getCurrentIndex() {
            if (carousel && carousel._c && typeof carousel._c.index === 'number') {
                return carousel._c.index;
            }
            return current;
        }

        carousel.addEventListener('ready', function () {
            if (carousel._c && typeof carousel._c.index === 'number') current = carousel._c.index;
        });
        carousel.addEventListener('indexchange', function (e) {
            current = e.detail.index;
        });

        var cardBox = null;
        function fitCards() {
            if (!carousel) return;
            var w = carousel.clientWidth, h = carousel.clientHeight;
            // 1.28 card aspect ratio (1024x800), synced with carousel dimensions
            var wRatio = (carousel._c && carousel._c.values && carousel._c.values.wFrac) || 0.35;
            var isTall = (w / h) < 0.85;
            if (isTall && carousel._c && carousel._c.values && carousel._c.values.wFracTall) {
                wRatio = carousel._c.values.wFracTall;
            }
            var cardW = Math.min(w * wRatio, 540);
            var cardH = cardW / 1.28;
            var liftOffset = (carousel._c && carousel._c.values && typeof carousel._c.values.lift === 'number')
                ? carousel._c.values.lift * h
                : 0.02 * h;
            cardBox = {
                left: (w - cardW) / 2,
                right: (w + cardW) / 2,
                top: (h - cardH) / 2 - liftOffset,
                bottom: (h + cardH) / 2 - liftOffset
            };
        }
        fitCards();
        window.addEventListener('resize', fitCards);

        function zoneAt(clientX, clientY) {
            var r = carousel.getBoundingClientRect();
            var g = cardBox;
            if (!g) return null;
            var x = clientX - r.left, y = clientY - r.top;
            var inCardX = x >= g.left && x <= g.right;
            if (inCardX) return (y >= g.top && y <= g.bottom) ? 'card' : null;
            var pad = (g.bottom - g.top) * 0.15;
            if (y >= g.top - pad && y <= g.bottom + pad) return 'drag';
            return null;
        }
        function getCardAt(clientX, clientY) {
            var r = carousel.getBoundingClientRect();
            var g = cardBox;
            if (!g) return null;
            var x = clientX - r.left, y = clientY - r.top;
            var inY = (y >= g.top && y <= g.bottom);
            if (!inY) return null;

            var active = getCurrentIndex();
            var n = PROJECTS.length;
            // Center card
            if (x >= g.left && x <= g.right) {
                return active;
            }
            var cardW = g.right - g.left;
            // Left card zone
            if (x < g.left && x >= Math.max(0, g.left - cardW * 0.95)) {
                return ((active - 1) % n + n) % n;
            }
            // Right card zone
            if (x > g.right && x <= Math.min(r.width, g.right + cardW * 0.95)) {
                return (active + 1) % n;
            }
            return null;
        }

        function inCardZone(clientX, clientY) {
            return getCardAt(clientX, clientY) !== null;
        }

        carousel.addEventListener('pointerdown', function (e) {
            if (e.pointerType === 'mouse' && !zoneAt(e.clientX, e.clientY) && !inCardZone(e.clientX, e.clientY)) {
                e.stopPropagation();
            }
        }, true);

        var downX = 0, downY = 0, pressed = false;
        var lastHoveredCard = null;

        carousel.addEventListener('pointerdown', function (e) {
            pressed = e.button === 0;
            downX = e.clientX;
            downY = e.clientY;
            var S = window.PFSound;
            if (S) S.play('tap', { gain: 0.15 });
        });
        carousel.addEventListener('pointerup', function (e) {
            if (!pressed) return;
            pressed = false;
            var moved = Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY);
            if (moved < 6) {
                var clickedIndex = getCardAt(e.clientX, e.clientY);
                if (clickedIndex !== null) {
                    navigateToProject(clickedIndex);
                }
            }
        });

        carousel.tabIndex = 0;
        carousel.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') { carousel.next(); e.preventDefault(); }
            else if (e.key === 'ArrowLeft') { carousel.prev(); e.preventDefault(); }
            else if (e.key === 'Enter') { navigateToProject(getCurrentIndex()); }
        });

        var dragging = false;
        function setCursor(c) {
            var canvas = carousel.querySelector('canvas');
            if (canvas && canvas.style.cursor !== c) canvas.style.cursor = c;
        }
        function updateCursor(e) {
            if (dragging) return setCursor('grabbing');
            if (getCardAt(e.clientX, e.clientY) !== null) return setCursor('pointer');
            var z = zoneAt(e.clientX, e.clientY);
            setCursor(z === 'drag' ? 'grab' : 'default');
        }
        carousel.addEventListener('pointermove', function (e) {
            if (pressed && !dragging && Math.abs(e.clientX - downX) > 5) dragging = true;
            updateCursor(e);

            if (!dragging) {
                var cardIdx = getCardAt(e.clientX, e.clientY);
                if (cardIdx !== null && cardIdx !== lastHoveredCard) {
                    lastHoveredCard = cardIdx;
                    var S = window.PFSound;
                    if (S) S.play('tick', { gain: 0.16 });
                } else if (cardIdx === null) {
                    lastHoveredCard = null;
                }
            }
        });
        carousel.addEventListener('pointerleave', function () {
            lastHoveredCard = null;
        });
        carousel.addEventListener('pointerdown', function (e) {
            if (zoneAt(e.clientX, e.clientY) === 'drag' || !inCardZone(e.clientX, e.clientY)) dragging = true;
            updateCursor(e);
        });
        ['pointerup', 'pointercancel'].forEach(function (ev) {
            carousel.addEventListener(ev, function (e) { dragging = false; updateCursor(e); });
        });
        carousel.addEventListener('ready', function () { setCursor('default'); });
        window.getCardAt = getCardAt;
    }

    // Direct Behance Navigation (Bypassing intermediate drawer)
    function navigateToProject(index) {
        var p = PROJECTS[index];
        if (!p || !p.behanceUrl) return;
        try { sessionStorage.setItem('pf.lastProject', p.slug); } catch (err) {}

        var S = window.PFSound;
        if (S) {
            S.play('select', { gain: 0.28 });
            setTimeout(function () {
                window.location.href = p.behanceUrl;
            }, 120);
        } else {
            window.location.href = p.behanceUrl;
        }
    }

    window.navigateToProject = navigateToProject;

    // Carousel Sound Hooks
    (function () {
        if (!carousel) return;
        var raf = 0, lastPos = null, lastT = 0, speed = 0;
        var SNAP_AT = 0.85;
        var goal = null, from = 0, armed = false;
        function step(now) {
            var S = window.PFSound;
            var c = carousel ? carousel._c : null;
            if (S && S.on && c && typeof c.position === 'number') {
                var p = c.position;
                if (lastPos !== null) {
                    var dt = Math.max(0.008, (now - lastT) / 1000);
                    speed += (Math.abs(p - lastPos) / dt - speed) * 0.35;
                    if (Math.round(p) !== Math.round(lastPos) || Math.abs(p - lastPos) > 0.45) {
                        var f = Math.min(1, speed / 8);
                        S.play('swipe', { gain: 0.18 + 0.08 * f, rate: 0.95 + 0.15 * f });
                    }
                }
                lastPos = p;
                lastT = now;

                if (typeof c.target === 'number' && c.target !== goal) {
                    goal = c.target;
                    from = p;
                    armed = Math.abs(goal - from) > 0.05;
                }
                if (armed && goal !== null) {
                    var dist = Math.abs(goal - from);
                    var done = dist > 0.001 ? Math.abs(p - from) / dist : 1;
                    if (done >= SNAP_AT) {
                        S.play('snap', { gain: 0.22 });
                        armed = false;
                    }
                }
            }
            raf = requestAnimationFrame(step);
        }
        function startSoundLoop() {
            if (!raf) { lastPos = null; lastT = performance.now(); raf = requestAnimationFrame(step); }
        }
        function stopSoundLoop() {
            if (raf) { cancelAnimationFrame(raf); raf = 0; }
        }
        document.addEventListener('pf:sound', function (e) {
            if (e.detail && e.detail.on) startSoundLoop();
            else stopSoundLoop();
        });
        window.addEventListener('pfsound:ready', startSoundLoop);
        startSoundLoop();
    })();

    // Spring Fly-In Intro
    var INTRO_CARDS = 3;
    var SPRING_FREQ = 8;
    var SPRING_DAMPING = 0.75;
    var INTRO_RAMP = 0.40;
    var REST_CARD = 1; // Breez (index 1) with MyJio (0) on left, Canteen 2.0 (2) on right
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var returnTo = -1;
    for (var i = 0; i < PROJECTS.length; i++) if (PROJECTS[i].slug === window.PF_RETURN_TO) returnTo = i;
    var returning = returnTo >= 0;

    if (carousel) {
        var n = PROJECTS.length;
        var startCard = returning ? returnTo
            : reduceMotion ? REST_CARD
            : ((REST_CARD - INTRO_CARDS) % n + n) % n;
        if (typeof carousel.set === 'function') {
            carousel.set({ startCard: startCard });
        } else {
            carousel.setAttribute('startcard', String(startCard));
        }
    }

    function smoothstep(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }

    function flyIn() {
        var c = carousel._c;
        if (!c) return;
        var from = c.index;
        var x = 0, v = 0;
        var start = null, last = 0, raf = 0, stopped = false;
        if (typeof carousel.set === 'function') carousel.set({ stiffness: 30 });

        function stop() {
            if (stopped) return;
            stopped = true;
            cancelAnimationFrame(raf);
            if (typeof carousel.set === 'function') carousel.set({ stiffness: 9 });
        }
        ['pointerdown', 'wheel', 'keydown'].forEach(function (ev) {
            carousel.addEventListener(ev, stop, { once: true, passive: true });
        });

        function frame(now) {
            if (stopped) return;
            if (start === null) start = last = now;
            var t = (now - start) / 1000;
            var dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            var target = INTRO_CARDS * smoothstep(t / INTRO_RAMP);
            for (var k = 0; k < 8; k++) {
                var h = dt / 8;
                v += (SPRING_FREQ * SPRING_FREQ * (target - x) - 2 * SPRING_DAMPING * SPRING_FREQ * v) * h;
                x += v * h;
            }
            c.goTo(from + x);
            if (t > INTRO_RAMP && Math.abs(INTRO_CARDS - x) < 0.002 && Math.abs(v) < 0.01) {
                c.goTo(from + INTRO_CARDS);
                setTimeout(stop, 250);
            } else {
                raf = requestAnimationFrame(frame);
            }
        }
        raf = requestAnimationFrame(frame);
    }

    var introStart = performance.now();
    var flyInScheduled = false;
    function scheduleFlyIn(waitMs) {
        if (flyInScheduled || reduceMotion || returning || !carousel) return;
        if (carousel._c) {
            flyInScheduled = true;
            setTimeout(flyIn, waitMs);
        } else if (carousel.addEventListener) {
            carousel.addEventListener('ready', function () {
                if (!flyInScheduled) {
                    flyInScheduled = true;
                    setTimeout(flyIn, waitMs);
                }
            }, { once: true });
        }
    }
    function introReady() {
        if (!document.body.classList.contains('is-ready')) {
            var waitMs = returning ? 0 : Math.max(0, 650 - (performance.now() - introStart));
            document.body.style.setProperty('--carousel-delay', (waitMs / 1000).toFixed(2) + 's');
            document.body.classList.add('is-ready');
            scheduleFlyIn(waitMs);
        } else {
            scheduleFlyIn(0);
        }
    }
    if (carousel) {
        if (carousel._c && carousel._c.ready) introReady();
        else carousel.addEventListener('ready', introReady, { once: true });
    }
    setTimeout(introReady, 800);

    // Drum Effect Trigger on Venom Button Interaction
    document.addEventListener('venom:activate', function () {
        if (carousel && typeof carousel.set === 'function') {
            carousel.set({ effect: 'drum' });
        }
        if (window.PFSound) {
            window.PFSound.play('effect-drum');
        }
    });

    // Letter Roll Hover Animation
    function letterRoll(el, text) {
        text = text == null ? el.textContent : text;
        el.setAttribute('aria-label', text);
        el.classList.add('roll');
        el.textContent = '';
        var wrap = document.createElement('span');
        wrap.className = 'roll-word';
        wrap.setAttribute('aria-hidden', 'true');
        Array.prototype.forEach.call(text, function (ch, idx) {
            var c = ch === ' ' ? ' ' : ch;
            var l = document.createElement('span');
            l.className = 'roll-letter';
            l.style.setProperty('--i', idx);
            l.innerHTML = '<span class="roll-a"></span><span class="roll-b"></span>';
            l.firstChild.textContent = c;
            l.lastChild.textContent = c;
            wrap.appendChild(l);
        });
        el.appendChild(wrap);
    }

    document.querySelectorAll('.accent, .links a').forEach(function (a) { letterRoll(a); });

    // Email Copy
    var email = document.querySelector('.email-link');
    if (email && navigator.clipboard) {
        var timer = null;
        email.addEventListener('click', function (e) {
            e.preventDefault();
            var S = window.PFSound;
            if (S) S.play('select', { gain: 0.22 });
            navigator.clipboard.writeText(email.dataset.email).then(function () {
                letterRoll(email, 'Copied');
                email.classList.add('is-copied');
                clearTimeout(timer);
                timer = setTimeout(function () {
                    letterRoll(email, 'Email');
                    email.classList.remove('is-copied');
                }, 2000);
            });
        });
    }
})();
