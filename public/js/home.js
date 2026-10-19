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
            slug: 'canteen-2',
            title: 'Canteen 2.0',
            subtitle: 'Campus Dining & Pickup Ecosystem',
            image: 'assets/projects/web/card-canteen-2.png',
            behanceUrl: 'https://www.behance.net/gallery/256956757/Canteen-20',
            role: 'Lead Product Designer & UX Researcher',
            category: 'Product & Service Design',
            metrics: [{ label: 'Dwell Time', value: '-75%' }, { label: 'Accuracy', value: '98.2%' }, { label: 'Satisfaction', value: '4.9/5' }],
            challenge: 'During peak class breaks, over 400 students simultaneously flooded the canteen counter, causing severe congestion, order errors, and high wait times.',
            approach: 'Conducted on-site ethnographic shadowing, reorganized 120+ menu items into fast-tap categorical clusters, and decoupled ordering from payment with real-time preparation notifications.',
            steps: [
                { title: 'Field Shadowing & Friction Mapping', desc: 'Identified decision paralysis at printed menus as the root cause of queue halts.' },
                { title: 'IA Restructure & Real-time States', desc: 'Re-indexed menu items with stock availability indicators.' },
                { title: 'Haptic Micro-Interactions & Cart Flow', desc: 'Designed rapid add-to-cart thumb gestures and dual-tab meal customization.' },
                { title: 'Staged Counter Handover Protocol', desc: 'Replaced verbal number shouting with numerical bay allocation.' }
            ]
        },
        {
            slug: 'breez',
            title: 'Breez Mobility',
            subtitle: 'Premium Electric Chauffeur Platform',
            image: 'assets/projects/web/card-breez.png',
            behanceUrl: 'https://www.behance.net/gallery/256963973/Breez-Premium-Mobility',
            role: 'Product & Interaction Designer',
            category: 'Mobility & Responsive Web',
            metrics: [{ label: 'Booking Speed', value: '2.1 min' }, { label: 'Task Success', value: '99.4%' }, { label: 'Conversion', value: '+38%' }],
            challenge: 'Enterprise corporate clients required multi-rider expense routing, while individual riders demanded immediate luxury vehicle allocation without cognitive friction.',
            approach: 'Designed a split-purpose dual routing architecture allowing instant ride requests on mobile while offering deep corporate dashboard fleet controls on widescreen views.',
            steps: [
                { title: 'B2B vs. B2C Stakeholder Segmentation', desc: 'Mapped executive assistants booking recurring trips vs. individual airport transfers.' },
                { title: 'One-Handed Mobile Itinerary Builder', desc: 'Crafted bottom-sheet booking controls optimized for thumb zones.' },
                { title: 'Adaptive Luxury Dark Palette', desc: 'Selected deep obsidian surfaces, precision sapphire accents, and tabular typography.' },
                { title: 'Real-Time Telemetry & Chauffeur Status', desc: 'Live interactive vehicle arrival cards with route progression animations.' }
            ]
        },
        {
            slug: 'evaara',
            title: 'Evaara Early Ed',
            subtitle: 'Story-Led Progressive Preschool Experience',
            image: 'assets/projects/web/card-evaara.png',
            role: 'Digital Experience & Visual Designer',
            category: 'Editorial & UX Design',
            metrics: [{ label: 'Tour Inquiries', value: '+112%' }, { label: 'Scroll Depth', value: '82%' }, { label: 'Bounce Rate', value: '-28%' }],
            challenge: 'Parents considering progressive child-led early-childhood pedagogy often feel apprehensive without clear curriculum transparency and tangible proof of developmental care.',
            approach: 'Structured the site as an exploratory day-in-the-life narrative, replacing bureaucratic school catalogues with immersive classroom vignettes and educator profiles.',
            steps: [
                { title: 'Parent Anxiety Audit', desc: 'Interviewed 24 parents to identify pivotal hesitation points during preschool selection.' },
                { title: 'Narrative Content Sequencing', desc: 'Arranged page hierarchies to answer emotional reassurance questions before technical admission details.' },
                { title: 'Warm Editorial Typography & Spacing', desc: 'Utilized generous editorial whitespace and tactile imagery containers.' },
                { title: 'Micro-Step Tour Scheduling', desc: 'Constructed a low-commitment tour calendar reducing abandonment rates.' }
            ]
        },
        {
            slug: 'lumina',
            title: 'Lumina Studio',
            subtitle: 'Spatial Generative Interface Kit',
            image: 'assets/projects/web/card-lumina.png',
            role: 'Creative Technologist',
            category: 'Design Engineering',
            metrics: [{ label: 'Frame Rate', value: '60 FPS' }, { label: 'Bundle Size', value: '18 KB' }],
            challenge: 'Modern creative applications struggle to bridge dense toolsets with playful, visceral direct manipulation.',
            approach: 'Engineered responsive WebGL canvas textures reacting to pointer inertia, audio frequencies, and spring-physics controls.',
            steps: [
                { title: 'Materiality & Glass Shaders', desc: 'Implemented real-time refractive vertex and fragment shaders in GLSL.' },
                { title: 'Audio-Haptic Integration', desc: 'Coupled sound synthesizers to UI state transitions for immediate confirmation.' }
            ]
        },
        {
            slug: 'chronos',
            title: 'Chronos AI',
            subtitle: 'Contextual Ambient Intelligence Workspace',
            image: 'assets/projects/web/card-chronos.png',
            role: 'Product Designer',
            category: 'Product Architecture',
            metrics: [{ label: 'Focus Duration', value: '+45m' }, { label: 'Context Switching', value: '-62%' }],
            challenge: 'Knowledge workers lose up to 40% of their creative flow switching between tab-heavy tools and static calendars.',
            approach: 'Designed a single-surface stream with proactive timeline collapsing and adaptive typography.',
            steps: [
                { title: 'Attention Span & Interruption Metrics', desc: 'Studied workflow interruptions across 30 design students and practitioners.' },
                { title: 'Calm UI Architecture', desc: 'Stripped away notification badges in favor of ambient color shifts and gentle sound cues.' }
            ]
        },
        { slug: 'circles', title: 'Circles', image: 'assets/projects/web/card-circles.webp' },
        { slug: 'arkade', title: 'Arkade', image: 'assets/projects/web/card-arkade.webp' },
        { slug: 'polls', title: 'Polls', image: 'assets/projects/web/card-polls.webp' },
        { slug: 'audioviz', title: 'Audioviz', image: 'assets/projects/web/card-audioviz.webp' }
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
