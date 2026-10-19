/**
 * Sound — UI sounds and the Mute / Unmute button (every page)
 *
 * Sounds: uisfx "Zen" set in assets/sounds (.mp3), played
 * with the Web Audio API: each file is decoded once, then every play is a cheap, instant voice
 * that can overlap the previous one — fast swipes stay smooth instead of cutting out.
 * Every visit starts muted; unmuting carries across pages for the rest of that visit (sessionStorage).
 *
 *   PFSound.play(interaction, { gain, rate, reverse })  → seconds the sound lasts (0 when muted /
 *                                       not ready); reverse plays it backwards
 *     interactions: see SLOTS below (swipe, snap, select, tab-hover, tab-select, link-hover, back,
 *     to-top, image-press, photo-hover, photo-open)
 *   PFSound.on                          → is sound on?
 *   document 'pf:sound' event           → fired when it's switched on or off
 *
 * Wired here (delegated, so it covers every page): link hover, segmented-control tabs (hover +
 * select), back arrows (sound, then navigate), scroll-to-top, project-image clicks, About photos.
 * The carousel (swipe / snap / select) is wired in js/home.js.
 */
(function () {
    'use strict';

    var KEY = 'pf.sound';
    var me = document.currentScript;
    var BASE = me && me.src ? me.src.replace(/js\/sound\.js([?#].*)?$/, 'assets/sounds/') : 'assets/sounds/';

    var MASTER_GAIN = 1.5;  // overall volume of every sound (was 0.9) — see context()
    var MAX_WAIT = 0.5;   // longest a link waits for its sound before the page changes (seconds)

    // ===== INTERACTIONS → SOUNDS =====
    // Which sound each interaction plays (files in assets/sounds, played as .mp3).
    // returns to these. gain: volume · gap: min seconds between plays · voices: max overlapping
    var SLOTS = {
        'swipe':       { label: 'Carousel swipe',          file: 'button-1',      gain: 1.25, gap: 0.035, voices: 5 },
        'snap':        { label: 'Carousel snap',           file: 'button-1',      gain: 1.4062 },
        'select':      { label: 'Project card click',      file: 'natural-tap-2', gain: 1.25 },
        'tab-hover':   { label: 'Effect tab hover',        file: 'natural-tap-1', gain: 0.3125, gap: 0.04, voices: 2 },
        'tab-select':  { label: 'Effect tab select',       file: 'whoosh-2',      gain: 0.9375 },
        'link-hover':  { label: 'Link hover',              file: 'natural-tap-1', gain: 0.3125, gap: 0.04, voices: 2 },
        'back':        { label: 'Back arrow',              file: 'natural-tap-2', gain: 0.9375 },
        'to-top':      { label: 'Scroll to top',           file: 'button-5',      gain: 1.1719 },
        'image-press': { label: 'Project image click',     file: 'natural-tap-2', gain: 1.1719 },
        'photo-hover': { label: 'About photo hover',       file: 'natural-tap-1', gain: 0.3125, gap: 0.04, voices: 2 },
        'photo-open':  { label: 'About photo click',       file: 'whoosh-2',      gain: 0.9375 },
        'photo-close': { label: 'About photo close',       file: 'whoosh-2-reverse', gain: 0.9375 }   // whoosh-2 backwards, lead-in trimmed
    };
    // Previous set (uisfx Zen — files still in assets/sounds), to go back to if needed:
    //   swipe: swipe @0.55 · snap: snap @0.7 · select: select @0.8 · tab-hover: hover @0.35 ·
    //   tab-select: drag-start @0.7 · link-hover: hover @0.35 · back: back @0.8 · to-top: seek @0.8 ·
    //   image-press: press @0.75 · photo-hover: hover @0.35 · photo-open: open @0.8
    // lengths of the files, used before a sound has been decoded (and by the <audio> fallback)
    var LENGTH = { 'button-1': 0.125, 'button-5': 0.133, 'natural-tap-1': 0.81, 'natural-tap-2': 0.81,
                   'whoosh-1': 0.958, 'whoosh-2': 0.75, 'whoosh-2-reverse': 0.385,
                   swipe: 0.366, snap: 0.183, select: 0.287, hover: 0.157, 'drag-start': 0.287,
                   back: 0.313, seek: 0.313, press: 0.183, open: 0.366 };

    try { localStorage.removeItem('pf.soundTest'); localStorage.removeItem('pf.soundDebug'); localStorage.removeItem('pf.soundHint'); } catch (e) {}   // left by the old sound debug panel and the removed first-visit hint

    var on = false;                                              // muted until the visitor unmutes
    // Remembered for this visit only (sessionStorage: carried across pages in the same tab), so every
    // new visit starts muted. (Earlier builds kept it for good in localStorage — cleared here.)
    try { localStorage.removeItem(KEY); } catch (e) {}
    try { on = sessionStorage.getItem(KEY) === 'on'; } catch (e) {}

    // Every browser plays the .mp3 versions (the .ogg encodes came out quieter, e.g. button-1)
    var EXT = 'mp3';

    var AC = window.AudioContext || window.webkitAudioContext;
    // Opened from disk, browsers won't let scripts read the sound files: fall back to <audio>
    var useMedia = !AC || location.protocol === 'file:';

    var ctx = null, master = null, buffers = {}, loading = {}, playing = {}, last = {};

    function srcOf(slot) { return SLOTS[slot].file; }
    function gainOf(slot) { return SLOTS[slot].gain; }
    function urls(name) {
        return [BASE + name + '.' + EXT];
    }

    function context() {
        if (ctx || useMedia) return ctx;
        try {
            ctx = new AC({ latencyHint: 'interactive' });
        } catch (e) {
            try { ctx = new AC(); } catch (e2) { useMedia = true; return null; }
        }
        // Overall level: MASTER_GAIN boosts every sound by the same amount (2 = +6dB, clearly louder;
        // the per-interaction gains in SLOTS keep their balance). A limiter after it catches peaks,
        // so loud moments can't distort.
        master = ctx.createGain();
        master.gain.value = MASTER_GAIN;
        var limiter = ctx.createDynamicsCompressor && ctx.createDynamicsCompressor();
        if (limiter) {
            limiter.threshold.value = -3;
            limiter.knee.value = 0;
            limiter.ratio.value = 20;
            limiter.attack.value = 0.002;
            limiter.release.value = 0.1;
            master.connect(limiter);
            limiter.connect(ctx.destination);
        } else {
            master.connect(ctx.destination);
        }
        return ctx;
    }

    function decode(buf) {
        return new Promise(function (ok, fail) {
            var p = ctx.decodeAudioData(buf, ok, fail);   // callback form for older Safari
            if (p && p.then) p.then(ok, fail);
        });
    }
    function load(src) {
        if (useMedia || buffers[src] || loading[src] || !context()) return loading[src];
        var list = urls(src);
        var get = function (i) {
            return fetch(list[i])
                .then(function (r) { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
                .then(decode)
                .catch(function (err) { if (i + 1 < list.length) return get(i + 1); throw err; });
        };
        loading[src] = get(0)
            .then(function (b) { buffers[src] = b; return b; })
            .catch(function () { loading[src] = null; });
        return loading[src];
    }
    function loadAll() { Object.keys(SLOTS).forEach(function (s) { load(srcOf(s)); }); }

    // Browsers keep audio suspended until the visitor clicks / taps / types on the page
    var unlocked = false;
    function wake() {
        if (!on) return;
        var c = context();
        if (!c) return;
        if (c.state !== 'running') {
            var p = c.resume();
            if (p && p.then) p.then(function () { if (c.state === 'running') loadAll(); }, function () {});
        }
        if (!unlocked) {                       // older iOS also wants a sound started inside the gesture
            unlocked = true;
            try {
                var b = c.createBuffer(1, 1, 22050), n = c.createBufferSource();
                n.buffer = b; n.connect(c.destination); n.start(0);
            } catch (e) {}
        }
    }
    // (Safari only accepts some of these as a "go-ahead" — click / touchend / keydown — so listen to all)
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click', 'touchstart', 'touchend', 'keydown'].forEach(function (ev) {
        document.addEventListener(ev, wake, { capture: true, passive: true });
    });

    // <audio> fallback (file://, very old browsers)
    var media = {};
    function playMedia(src, gain, o, voices) {
        if (o.reverse) return 0;                                    // <audio> can't play backwards
        var pool = media[src] || (media[src] = []);
        var a = pool.filter(function (x) { return x.paused || x.ended; })[0];
        if (!a) {
            if (pool.length >= (voices || 2)) return 0;
            a = new Audio(urls(src)[0]);
            a.preload = 'auto';
            pool.push(a);
        }
        a.volume = Math.max(0, Math.min(1, gain * (o.gain == null ? 1 : o.gain)));
        a.playbackRate = o.rate || 1;
        try { a.currentTime = 0; } catch (e) {}
        var p = a.play();
        if (p && p.catch) p.catch(function () {});
        return (LENGTH[src] || 0.3) / (o.rate || 1);
    }

    // a time-reversed copy of a decoded sound (made once, then reused)
    var backwards = {};
    function reversed(src, buf) {
        if (backwards[src] && backwards[src].from === buf) return backwards[src].buf;
        var r = ctx.createBuffer(buf.numberOfChannels, buf.length, buf.sampleRate);
        for (var ch = 0; ch < buf.numberOfChannels; ch++) {
            var data = buf.getChannelData(ch).slice();
            Array.prototype.reverse.call(data);
            r.copyToChannel ? r.copyToChannel(data, ch) : r.getChannelData(ch).set(data);
        }
        // a sound's quiet fade-out becomes a quiet lead-in when reversed: skip it, so the reversed
        // sound is heard straight away (from where it rises above 2% of its loudest point)
        var d = r.getChannelData(0), peak = 0, i;
        for (i = 0; i < d.length; i++) if (Math.abs(d[i]) > peak) peak = Math.abs(d[i]);
        for (i = 0; i < d.length && Math.abs(d[i]) < peak * 0.02; i++) {}
        r._skip = i / r.sampleRate;
        backwards[src] = { from: buf, buf: r };
        return r;
    }

    // play a sound file right now
    function playSrc(src, gain, o, voices) {
        o = o || {};
        if (useMedia) return playMedia(src, gain, o, voices);
        var c = context();
        if (!c) return 0;
        if (c.state !== 'running') {
            // Not allowed to play yet. If this very interaction is the visitor's first click / key
            // (the go-ahead), audio wakes a moment later: play then — but never late, and never a
            // backlog of sounds from before.
            var asked = performance.now(), r = c.resume();
            if (r && r.then) r.then(function () {
                if (c.state === 'running' && performance.now() - asked < 150) playSrc(src, gain, o, voices);
            }, function () {});
            return 0;
        }
        var buf = buffers[src];
        if (!buf) { load(src); return 0; }
        if (o.reverse) buf = reversed(src, buf);
        var list = playing[src] || (playing[src] = []);
        if (voices && list.length >= voices) return 0;

        var node = c.createBufferSource();
        var g = c.createGain();
        node.buffer = buf;
        node.playbackRate.value = o.rate || 1;
        g.gain.value = gain * (o.gain == null ? 1 : o.gain);
        node.connect(g);
        g.connect(master);
        list.push(node);
        node.onended = function () {
            var i = list.indexOf(node);
            if (i >= 0) list.splice(i, 1);
            g.disconnect();
        };
        node.start(0, buf._skip || 0);
        return (buf.duration - (buf._skip || 0)) / (o.rate || 1);
    }

    function play(slot, o) {
        var cfg = SLOTS[slot];
        if (!on || !cfg) return 0;
        var now = (ctx ? ctx.currentTime : performance.now() / 1000);
        if (cfg.gap && last[slot] != null && now - last[slot] < cfg.gap) return 0;
        last[slot] = now;
        return playSrc(srcOf(slot), gainOf(slot), o, cfg.voices);
    }

    function setOn(v) {
        on = !!v;
        try { sessionStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) {}
        if (on) { context(); wake(); loadAll(); }
        else if (ctx && ctx.state === 'running') ctx.suspend();
        document.documentElement.classList.toggle('sound-on', on);
        document.dispatchEvent(new CustomEvent('pf:sound', { detail: { on: on } }));
    }

    window.PFSound = {
        play: play,
        get on() { return on; },
        set: setOn,
        // seconds between starting a sound and hearing it (output buffer + device latency)
        latency: function () {
            if (!ctx) return 0;
            return Math.min(0.25, (ctx.baseLatency || 0) + (ctx.outputLatency || 0));
        },
        // seconds to wait before following a link, so a sound can finish (0 when silent)
        waitFor: function (slot) {
            if (!on || !SLOTS[slot]) return 0;
            var src = srcOf(slot), name = src;
            if (useMedia) return Math.min(MAX_WAIT, LENGTH[name] || 0.3);
            // capped, so a long sound never holds up the page
            return buffers[src] && ctx && ctx.state === 'running' ? Math.min(MAX_WAIT, buffers[src].duration) : 0;
        },

    };
    document.documentElement.classList.toggle('sound-on', on);
    if (on) loadAll();

    // ===== MUTE / UNMUTE BUTTON =====
    // Figma: PF26 "Desktop-Unmute / Desktop-Mute" (118×45 pill) and "Mobile-…" (45×45, icon only).
    // The label names the action: "Unmute" while muted (speaker with sound waves), "Mute" while
    // on (speaker with a cross). Switching, the two waves bend into the cross (and back) on the
    // site's spring, and the label rolls letter by letter.
    var SPEAKER = 'M11.6667 12.3446V7.65538C11.6667 5.03438 11.6667 3.72388 10.8956 3.39775C10.1245 3.07161 9.21692 3.99827 7.40194 5.8516C6.46199 6.81137 5.92571 7.02391 4.58837 7.02391C3.41881 7.02391 2.83404 7.02391 2.41396 7.31052C1.54196 7.90546 1.67377 9.06833 1.67377 10C1.67377 10.9317 1.54196 12.0945 2.41396 12.6895C2.83404 12.9761 3.41881 12.9761 4.58837 12.9761C5.92571 12.9761 6.46199 13.1887 7.40194 14.1484C9.21692 16.0017 10.1245 16.9284 10.8956 16.6023C11.6667 16.2761 11.6667 14.9656 11.6667 12.3446Z';
    // Each wave is two cubic curves (top half, bottom half). The cross lines are written the same
    // way (straight, with control points along the line), so every point has a partner to move to.
    // Inner wave → "\" line, outer wave → "/" line; both cross at (16.67, 10).
    var SHAPES = [
        {   // inner wave  →  line from top-left to bottom-right
            wave:  [14.1667, 7.5, 14.6878, 8.18307, 15, 9.05283, 15, 10, 15, 10.9472, 14.6878, 11.8169, 14.1667, 12.5],
            cross: [15, 8.33333, 15.5556, 8.88889, 16.1111, 9.44444, 16.6667, 10, 17.2222, 10.5556, 17.7778, 11.1111, 18.3333, 11.6667]
        },
        {   // outer wave  →  line from top-right to bottom-left
            wave:  [16.6667, 5.83333, 17.709, 6.97178, 18.3333, 8.42142, 18.3333, 10, 18.3333, 11.5786, 17.709, 13.0283, 16.6667, 14.1667],
            cross: [18.3333, 8.33333, 17.7778, 8.88889, 17.2222, 9.44444, 16.6667, 10, 16.1111, 10.5556, 15.5556, 11.1111, 15, 11.6667]
        }
    ];
    function pathAt(s, t) {
        var p = s.wave.map(function (w, i) { return w + (s.cross[i] - w) * t; });
        var f = function (n) { return +n.toFixed(3); };
        return 'M' + f(p[0]) + ' ' + f(p[1]) +
            'C' + f(p[2]) + ' ' + f(p[3]) + ' ' + f(p[4]) + ' ' + f(p[5]) + ' ' + f(p[6]) + ' ' + f(p[7]) +
            'C' + f(p[8]) + ' ' + f(p[9]) + ' ' + f(p[10]) + ' ' + f(p[11]) + ' ' + f(p[12]) + ' ' + f(p[13]);
    }

    function build() {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sound-toggle';
        btn.innerHTML =
            '<svg class="sound-icon" viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" ' +
            'stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="' + SPEAKER + '"/><path class="sw"/><path class="sw"/></svg>' +
            '<span class="sound-label" aria-hidden="true"></span>' +
            '<span class="sound-sr"></span>';
        document.body.appendChild(btn);

        var paths = btn.querySelectorAll('.sw');
        var label = btn.querySelector('.sound-label');
        var sr = btn.querySelector('.sound-sr');
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // --- icon: one spring per line (stiffness 140, damping 16, mass 1 — the site's spring),
        //     the outer line 50ms behind the inner one; interruptible mid-way
        var state = SHAPES.map(function () { return { x: on ? 1 : 0, v: 0, target: on ? 1 : 0, delay: 0 }; });
        var raf = 0, lastT = 0;
        function draw() { state.forEach(function (st, i) { paths[i].setAttribute('d', pathAt(SHAPES[i], st.x)); }); }
        function tick(now) {
            var dt = Math.min(0.05, (now - lastT) / 1000 || 0.016);
            lastT = now;
            var busy = false;
            state.forEach(function (st) {
                if (st.delay > 0) { st.delay -= dt; busy = true; return; }
                for (var k = 0, h = dt / 4; k < 4; k++) {            // small steps keep it stable
                    st.v += (-140 * (st.x - st.target) - 16 * st.v) * h;
                    st.x += st.v * h;
                }
                if (Math.abs(st.x - st.target) > 0.0005 || Math.abs(st.v) > 0.005) busy = true;
                else { st.x = st.target; st.v = 0; }
            });
            draw();
            raf = busy ? requestAnimationFrame(tick) : 0;
        }
        function morph(toCross) {
            state.forEach(function (st, i) {
                st.target = toCross ? 1 : 0;
                st.delay = i * 0.05;
                if (reduce) { st.x = st.target; st.v = 0; }
            });
            if (reduce) return draw();
            if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(tick); }
        }

        // --- label: letters of the old word roll up and out, the new word's roll in from below
        //     (20ms apart, 400ms, the letter-roll curve); the label's width eases between words
        //     so the icon glides instead of jumping
        function word(text) {
            var w = document.createElement('span');
            w.className = 'sl-word';
            Array.prototype.forEach.call(text, function (ch, i) {
                var l = document.createElement('span');
                l.className = 'sl-letter';
                l.style.setProperty('--i', i);
                l.textContent = ch;
                w.appendChild(l);
            });
            return w;
        }
        function setLabel(text, animate) {
            sr.textContent = text;
            btn.setAttribute('aria-label', text === 'Mute' ? 'Mute sounds' : 'Unmute sounds');
            var old = label.querySelector('.sl-word:not(.is-out)');
            var next = word(text);
            if (!animate || reduce || !old) {
                label.innerHTML = '';
                label.appendChild(next);
                label.style.width = '';
                return;
            }
            var from = label.getBoundingClientRect().width;
            next.classList.add('is-in');
            label.appendChild(next);
            var to = next.getBoundingClientRect().width;
            label.style.width = from + 'px';
            old.classList.add('is-out');
            label.getBoundingClientRect();                       // commit the start state
            label.style.width = to + 'px';
            requestAnimationFrame(function () { next.classList.remove('is-in'); });
            clearTimeout(label._t);
            label._t = setTimeout(function () {
                Array.prototype.forEach.call(label.querySelectorAll('.sl-word.is-out'), function (w) { w.remove(); });
                label.style.width = '';
            }, 700);
        }

        draw();
        setLabel(on ? 'Mute' : 'Unmute', false);

        btn.addEventListener('click', function () {
            setOn(!on);
        });
        document.addEventListener('pf:sound', function () {
            morph(on);
            setLabel(on ? 'Mute' : 'Unmute', true);
        });
    }

    // ===== INTERACTIONS (delegated) =====
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    // Hovering a link
    var hovered = null;
    document.addEventListener('pointerover', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        var a = e.target.closest && e.target.closest('a[href]');
        if (a === hovered) return;
        hovered = a;
        if (a && finePointer.matches) play('link-hover');
    });

    // Following a link after its sound has played (modifier-clicks open new tabs straight away)
    function navigateAfter(e, a, name) {
        if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        play(name);
        var wait = PFSound.waitFor(name);
        if (!wait || (a.target && a.target !== '_self')) return;
        e.preventDefault();
        var href = a.href;
        setTimeout(function () { location.href = href; }, Math.round(wait * 1000));
    }

    document.addEventListener('click', function (e) {
        var t = e.target;
        if (!t.closest) return;
        var a = t.closest('a.back, a.auth-back');
        if (a) return navigateAfter(e, a, 'back');
        if (t.closest('.to-top')) return play('to-top');
        if (t.closest('.zoomable')) return play('image-press');
        if (t.closest('.photos .photo')) return play('photo-open');
    });
    document.addEventListener('keydown', function (e) {             // keyboard-opened images
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('zoomable')) play('image-press');
    });

    // About: hovering a photo
    var hoveredPhoto = null;
    document.addEventListener('pointerover', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        var p = e.target.closest && e.target.closest('.photos .photo');
        if (p === hoveredPhoto) return;
        hoveredPhoto = p;
        if (p) play('photo-hover');
    });

    // Home: segmented-control tabs (inside the component's shadow DOM)
    function wireTabs() {
        var control = document.getElementById('effect-control');
        if (!control) return;
        var tab = null;
        control.addEventListener('pointermove', function (e) {
            if (e.pointerType && e.pointerType !== 'mouse') return;
            var path = e.composedPath ? e.composedPath() : [];
            var hit = null;
            for (var i = 0; i < path.length; i++) {
                if (path[i].getAttribute && path[i].getAttribute('role') === 'tab') { hit = path[i]; break; }
            }
            if (hit !== tab) {
                tab = hit;
                if (hit && !hit.classList.contains('on')) play('tab-hover');
            }
        });
        control.addEventListener('pointerleave', function () { tab = null; });
        control.addEventListener('change', function () { play('tab-select'); });
    }

    function init() {
        build();
        wireTabs();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
