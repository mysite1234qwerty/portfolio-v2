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
            slug: 'breez',
            title: 'Breez Mobility',
            subtitle: 'Premium Electric Chauffeur Platform',
            image: 'assets/projects/web/card-breez.webp',
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
            image: 'assets/projects/web/card-canteen-2.webp',
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
            slug: 'what-scene',
            title: 'What Scene?',
            subtitle: 'Social Event & Group Decision App',
            image: 'assets/projects/web/card-what-scene.webp',
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
            slug: 'plantpal',
            title: 'Plantpal?',
            subtitle: 'Intelligent Plant Care & Habit Companion',
            image: 'assets/projects/web/card-plantpal.webp',
            behanceUrl: 'https://www.behance.net/gallery/247042879/Plantpal',
            role: 'UX/UI Designer',
            category: 'Mobile UX & IoT Integration',
            metrics: [{ label: 'Plant Survival', value: '92%' }, { label: 'Daily Retention', value: '74%' }, { label: 'Habit Completion', value: '88%' }],
            challenge: 'Plant owners struggle to maintain consistent watering schedules and diagnose subtle plant diseases without complicated botanical manuals.',
            approach: 'Designed an ambient plant care companion with smart camera diagnosis, personalized sunlight-watering calendars, and micro-delight progress animations.',
            steps: [
                { title: 'Plant Parent Journey Audit', desc: 'Interviewed indoor plant enthusiasts to map root causes of plant neglect.' },
                { title: 'Visual Diagnosis Camera Flow', desc: 'Streamlined disease and moisture scanning to an instant 2-step capture.' },
                { title: 'Ambient Habit Tracking', desc: 'Crafted gentle, non-intrusive watering reminders with tactile widget cards.' },
                { title: 'Micro-Interactions & Growth Logs', desc: 'Animated botanical growth timelines rewarding sustained care habits.' }
            ]
        },
        {
            slug: 'celestine',
            title: 'Célestine',
            subtitle: 'Haute Joaillerie & Luxury E-Commerce Experience',
            image: 'assets/projects/web/card-celestine.webp',
            behanceUrl: 'https://www.behance.net/gallery/246858161/Clestine-A-Luxury-E-commerce-Experience',
            role: 'Lead Visual & Experience Designer',
            category: 'Luxury Editorial & E-Commerce',
            metrics: [{ label: 'Cart Value', value: '+44%' }, { label: 'Engagement', value: '+85%' }, { label: 'Return Rate', value: '-18%' }],
            challenge: 'Translating the tactile, sensory prestige of bespoke high jewelry to a digital surface while preserving exclusivity and emotional intimacy.',
            approach: 'Created an editorial, high-touch luxury browsing experience with bespoke micro-typography, high-fidelity 360° product rotations, and personalized concierge checkout.',
            steps: [
                { title: 'Luxury Buyer Persona Synthesis', desc: 'Mapped sensory expectations and trust signals of ultra-high-net-worth buyers.' },
                { title: 'Editorial Typographic Hierarchy', desc: 'Balanced high-contrast serif headlines with generous breathing whitespace.' },
                { title: 'Tactile Direct Manipulation', desc: 'Interactive jewelry viewports highlighting gemstone reflections and craft details.' },
                { title: 'Bespoke Concierge Booking', desc: 'Frictionless private salon appointments and custom engraving previews.' }
            ]
        },
        {
            slug: 'myjio',
            title: 'MyJio App Redesign',
            subtitle: 'Telecom & Multi-Service Super App Architecture',
            image: 'assets/projects/web/card-myjio.webp',
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
            slug: 'gigverse',
            title: 'Gigverse',
            subtitle: 'Decentralized Creator Economy Marketplace',
            image: 'assets/projects/web/card-gigverse.webp',
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
        },
        {
            slug: 'foodmate',
            title: 'Foodmate',
            subtitle: 'Smart Meal Planning & Pantry Expiry Tracker',
            image: 'assets/projects/web/card-foodmate.webp',
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
            slug: 'magazine',
            title: 'Magazine Editorial',
            subtitle: 'Print & Digital Editorial Typography System',
            image: 'assets/projects/web/card-magazine.webp',
            behanceUrl: 'https://www.behance.net/gallery/201498851/Magazine-design',
            role: 'Editorial & Art Director',
            category: 'Typography & Editorial Layout',
            metrics: [{ label: 'Read-Through', value: '88%' }, { label: 'Visual Rhythm', value: 'Selected' }, { label: 'Praise', value: 'Top Honors' }],
            challenge: 'Crafting an experimental typographic system that balances bold avant-garde layout structures with sustained narrative legibility.',
            approach: 'Designed modular multi-column grids, asymmetrical pull-quote treatments, and tactile editorial paper spreads translated to responsive interactive digital views.',
            steps: [
                { title: 'Typographic Grid Architecture', desc: 'Formulated a 12-column baseline grid with variable leading and tracking.' },
                { title: 'Asymmetrical Layout Exploration', desc: 'Pioneered contrasting scale relationships between display type and body text.' },
                { title: 'Materiality & Print Finishing', desc: 'Specified spot varnishes, foil stamping, and tactile uncoated paper stocks.' },
                { title: 'Digital Editorial Translation', desc: 'Adapted publication pacing to swipeable horizontal screens and tablet readers.' }
            ]
        }
    ];

    window.ADITI_PROJECTS = PROJECTS;

    var EFFECTS = {
        stretch: 'stretch',
        bulge: 'bulge',
        drum: 'drum',
        shatter: 'shatter',
        dust: 'thanos'
    };

    var carousel = document.getElementById('work-carousel');
    var control = document.getElementById('effect-control');

    if (carousel) {
        carousel.images = PROJECTS.map(function (p) { return p.image; });

        var current = 0;
        carousel.addEventListener('ready', function () {
            if (carousel._c && typeof carousel._c.index === 'number') current = carousel._c.index;
        });
        carousel.addEventListener('indexchange', function (e) {
            current = e.detail.index;
        });

        var cardBox = null;
        function fitCards() {
            if (!carousel || !carousel._c) return;
            var w = carousel.clientWidth, h = carousel.clientHeight;
            // 4:5 card aspect ratio
            var cardH = Math.min(h * 0.76, 680);
            var cardW = cardH * 0.8;
            cardBox = {
                left: (w - cardW) / 2,
                right: (w + cardW) / 2,
                top: (h - cardH) / 2,
                bottom: (h + cardH) / 2
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
        function inCentre(clientX, clientY) { return zoneAt(clientX, clientY) === 'card'; }

        carousel.addEventListener('pointerdown', function (e) {
            if (e.pointerType === 'mouse' && !zoneAt(e.clientX, e.clientY)) e.stopPropagation();
        }, true);

        var downX = 0, downY = 0, pressed = false;
        carousel.addEventListener('pointerdown', function (e) {
            pressed = e.button === 0;
            downX = e.clientX;
            downY = e.clientY;
        });
        carousel.addEventListener('pointerup', function (e) {
            if (!pressed) return;
            pressed = false;
            var moved = Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY);
            if (moved < 6 && inCentre(e.clientX, e.clientY)) openProject(current, e);
        });

        carousel.tabIndex = 0;
        carousel.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') { carousel.next(); e.preventDefault(); }
            else if (e.key === 'ArrowLeft') { carousel.prev(); e.preventDefault(); }
            else if (e.key === 'Enter') { openProject(current, e); }
        });

        var dragging = false;
        function setCursor(c) {
            var canvas = carousel.querySelector('canvas');
            if (canvas && canvas.style.cursor !== c) canvas.style.cursor = c;
        }
        function updateCursor(e) {
            if (dragging) return setCursor('grabbing');
            var z = zoneAt(e.clientX, e.clientY);
            setCursor(z === 'card' ? 'pointer' : z === 'drag' ? 'grab' : 'default');
        }
        carousel.addEventListener('pointermove', function (e) {
            if (pressed && !dragging && Math.abs(e.clientX - downX) > 5) dragging = true;
            updateCursor(e);
        });
        carousel.addEventListener('pointerdown', function (e) {
            if (zoneAt(e.clientX, e.clientY) === 'drag') dragging = true;
            updateCursor(e);
        });
        ['pointerup', 'pointercancel'].forEach(function (ev) {
            carousel.addEventListener(ev, function (e) { dragging = false; updateCursor(e); });
        });
        carousel.addEventListener('ready', function () { setCursor('default'); });
    }

    // Modal Case Study Drawer
    var drawer = document.getElementById('project-drawer');
    var drawerBackdrop = document.getElementById('drawer-backdrop');
    var drawerCloseBtn = document.getElementById('drawer-close');

    function openProject(index) {
        var p = PROJECTS[index];
        if (!p) return;
        try { sessionStorage.setItem('pf.lastProject', p.slug); } catch (err) {}

        var S = window.PFSound;
        if (S) S.play('select');

        // Populate drawer
        document.getElementById('drawer-title').textContent = p.title;
        document.getElementById('drawer-subtitle').textContent = p.subtitle || '';
        document.getElementById('drawer-category').textContent = p.category || 'Case Study';
        document.getElementById('drawer-role').textContent = p.role ? 'Role: ' + p.role : '';
        document.getElementById('drawer-challenge').textContent = p.challenge || 'Exploratory product concept designed with tactile design engineering.';
        document.getElementById('drawer-approach').textContent = p.approach || '';

        var metricsEl = document.getElementById('drawer-metrics');
        metricsEl.innerHTML = '';
        if (p.metrics && p.metrics.length > 0) {
            p.metrics.forEach(function (m) {
                var d = document.createElement('div');
                d.className = 'metric-box';
                d.innerHTML = '<span class="m-val">' + m.value + '</span><span class="m-lbl">' + m.label + '</span>';
                metricsEl.appendChild(d);
            });
            metricsEl.style.display = 'grid';
        } else {
            metricsEl.style.display = 'none';
        }

        var stepsEl = document.getElementById('drawer-steps');
        stepsEl.innerHTML = '';
        if (p.steps && p.steps.length > 0) {
            p.steps.forEach(function (st, idx) {
                var s = document.createElement('div');
                s.className = 'step-box';
                s.innerHTML = '<span class="s-idx">0' + (idx + 1) + '</span><div class="s-cnt"><strong>' + st.title + '</strong><p>' + st.desc + '</p></div>';
                stepsEl.appendChild(s);
            });
        }

        var behanceLink = document.getElementById('drawer-behance');
        if (p.behanceUrl) {
            behanceLink.href = p.behanceUrl;
            behanceLink.style.display = 'inline-flex';
        } else {
            behanceLink.style.display = 'none';
        }

        if (drawer && drawerBackdrop) {
            drawerBackdrop.classList.add('is-open');
            drawer.classList.add('is-open');
        }
    }

    function closeDrawer() {
        var S = window.PFSound;
        if (S) S.play('photo-close');
        if (drawer && drawerBackdrop) {
            drawerBackdrop.classList.remove('is-open');
            drawer.classList.remove('is-open');
        }
    }

    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
    window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) closeDrawer();
    });

    // Carousel Sound Hooks
    (function () {
        if (!carousel) return;
        var raf = 0, lastPos = null, lastT = 0, speed = 0;
        var SNAP_AT = 0.85;
        var goal = null, from = 0, armed = false;
        function step(now) {
            raf = 0;
            var S = window.PFSound, c = carousel._c;
            if (!S || !S.on) return;
            if (c && typeof c.position === 'number') {
                var p = c.position;
                if (lastPos !== null) {
                    var dt = Math.max(0.008, (now - lastT) / 1000);
                    speed += (Math.abs(p - lastPos) / dt - speed) * 0.35;
                    if (Math.round(p) !== Math.round(lastPos)) {
                        var f = Math.min(1, speed / 10);
                        S.play('swipe', { gain: 0.65 + 0.35 * f, rate: 0.96 + 0.12 * f });
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
                        S.play('snap');
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
        if (window.PFSound && window.PFSound.on) startSoundLoop();
    })();

    // Spring Fly-In Intro
    var INTRO_CARDS = 3;
    var SPRING_FREQ = 8;
    var SPRING_DAMPING = 0.75;
    var INTRO_RAMP = 0.40;
    var REST_CARD = 0;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var returnTo = -1;
    for (var i = 0; i < PROJECTS.length; i++) if (PROJECTS[i].slug === window.PF_RETURN_TO) returnTo = i;
    var returning = returnTo >= 0;

    if (carousel) {
        var n = PROJECTS.length;
        var startCard = returning ? returnTo
            : reduceMotion ? REST_CARD
            : ((REST_CARD - INTRO_CARDS) % n + n) % n;
        carousel.set({ startCard: startCard });
    }

    function smoothstep(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }

    function flyIn() {
        var c = carousel._c;
        if (!c) return;
        var from = c.index;
        var x = 0, v = 0;
        var start = null, last = 0, raf = 0, stopped = false;
        carousel.set({ stiffness: 30 });

        function stop() {
            if (stopped) return;
            stopped = true;
            cancelAnimationFrame(raf);
            carousel.set({ stiffness: 9 });
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
    function introReady() {
        if (document.body.classList.contains('is-ready')) return;
        var waitMs = returning ? 0 : Math.max(0, 650 - (performance.now() - introStart));
        document.body.style.setProperty('--carousel-delay', (waitMs / 1000).toFixed(2) + 's');
        document.body.classList.add('is-ready');
        if (carousel && !reduceMotion && !returning && carousel._c) setTimeout(flyIn, waitMs);
    }
    if (carousel) carousel.addEventListener('ready', introReady, { once: true });
    setTimeout(introReady, 3000);

    // Effect Switch
    if (carousel && control) {
        control.addEventListener('change', function (e) {
            var label = String((e.detail && e.detail.value) || '').trim().toLowerCase();
            var effect = EFFECTS[label];
            if (effect && typeof carousel.set === 'function') {
                carousel.set({ effect: effect });
            }
        });
    }

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
