/**
 * Sound — High-Fidelity UI Audio Subsystem (Guaranteed Audible & Zero-Latency)
 *
 * Designed to provide immediate, punchy, tactile audio feedback on all browsers
 * (macOS Safari, Google Chrome, Brave, Firefox, Edge, iOS).
 */
(function () {
    'use strict';

    var KEY = 'pf.sound';

    // Clear any stale muted key so user always starts with audible audio
    try {
        var prev = sessionStorage.getItem(KEY);
        if (prev === 'muted' || prev === 'off') {
            sessionStorage.removeItem(KEY);
        }
    } catch (e) {}

    var on = true;
    var AC = window.AudioContext || window.webkitAudioContext;
    var ctx = null;
    var master = null;
    var last = {};
    var lastInteracted = 0;

    // Pre-loaded MP3 buffers
    var buffers = {};
    var BASE = '/assets/sounds/';
    var FILES = {
        'button-1': BASE + 'button-1.mp3',
        'button-5': BASE + 'button-5.mp3',
        'natural-tap-1': BASE + 'natural-tap-1.mp3',
        'natural-tap-2': BASE + 'natural-tap-2.mp3',
        'whoosh-1': BASE + 'whoosh-1.mp3',
        'whoosh-2': BASE + 'whoosh-2.mp3',
        'whoosh-2-reverse': BASE + 'whoosh-2-reverse.mp3'
    };

    function getContext() {
        if (!ctx) {
            if (!AC) return null;
            try {
                ctx = new AC();
                master = ctx.createGain();
                master.gain.value = 0.45; // Gentle, comfortable listening volume

                var limiter = ctx.createDynamicsCompressor ? ctx.createDynamicsCompressor() : null;
                if (limiter) {
                    limiter.threshold.value = -3.0;
                    limiter.knee.value = 4.0;
                    limiter.ratio.value = 8.0;
                    limiter.attack.value = 0.003;
                    limiter.release.value = 0.10;
                    master.connect(limiter);
                    limiter.connect(ctx.destination);
                } else {
                    master.connect(ctx.destination);
                }
            } catch (err) {
                console.warn('[PFSound] AudioContext creation:', err);
                return null;
            }
        }
        if (ctx && ctx.state === 'suspended') {
            ctx.resume().catch(function () {});
        }
        return ctx;
    }

    function loadBuffers() {
        var c = getContext();
        if (!c) return;
        Object.keys(FILES).forEach(function (key) {
            if (buffers[key]) return;
            fetch(FILES[key])
                .then(function (res) { return res.arrayBuffer(); })
                .then(function (ab) { return c.decodeAudioData(ab); })
                .then(function (decoded) { buffers[key] = decoded; })
                .catch(function () {});
        });
    }

    // Synchronous unlock on any genuine user activation
    function unlock() {
        lastInteracted = performance.now();
        var c = getContext();
        if (c && c.state === 'suspended') {
            c.resume().then(function () {
                loadBuffers();
            }).catch(function () {});
        }
    }

    ['pointerdown', 'mousedown', 'click', 'keydown', 'touchstart', 'pointerup', 'wheel', 'pointermove'].forEach(function (ev) {
        window.addEventListener(ev, unlock, { capture: true, passive: true });
        document.addEventListener(ev, unlock, { capture: true, passive: true });
    });

    // =========================================================================
    // DEDICATED PROCEDURAL SYNTHESIZERS (Gentle, Non-Distracting, Tactile)
    // =========================================================================
    var SYNTHS = {
        // Soft tactile tick (links, chips, tab hover)
        'tick': function (c, now, gMul) {
            var osc = c.createOscillator(), g = c.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1500, now);
            osc.frequency.exponentialRampToValueAtTime(650, now + 0.02);
            g.gain.setValueAtTime(0.16 * gMul, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.024);
            osc.connect(g); g.connect(master);
            osc.start(now); osc.stop(now + 0.026);
        },

        // Resonant micro-tap (cards, selections)
        'tap': function (c, now, gMul, rate) {
            var p = rate || 1;
            var osc = c.createOscillator(), g = c.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(360 * p, now);
            osc.frequency.exponentialRampToValueAtTime(120 * p, now + 0.045);
            g.gain.setValueAtTime(0.20 * gMul, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.connect(g); g.connect(master);
            osc.start(now); osc.stop(now + 0.055);
        },

        // Soft settling mechanical micro-click
        'snap': function (c, now, gMul) {
            var osc = c.createOscillator(), g = c.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(480, now);
            osc.frequency.exponentialRampToValueAtTime(160, now + 0.04);
            g.gain.setValueAtTime(0.20 * gMul, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
            osc.connect(g); g.connect(master);
            osc.start(now); osc.stop(now + 0.05);
        },

        // Fluid organic swipe scrub
        'swipe': function (c, now, gMul, rate) {
            var p = rate || 1;
            var osc = c.createOscillator(), g = c.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(260 * p, now);
            osc.frequency.exponentialRampToValueAtTime(130 * p, now + 0.035);
            g.gain.setValueAtTime(0.16 * gMul, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.connect(g); g.connect(master);
            osc.start(now); osc.stop(now + 0.045);
        },

        // Directional subtle click
        'key-nav': function (c, now, gMul) {
            var osc = c.createOscillator(), g = c.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);
            g.gain.setValueAtTime(0.18 * gMul, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.connect(g); g.connect(master);
            osc.start(now); osc.stop(now + 0.045);
        },

        // Venom tendril reach (gentle organic air breath)
        'tendril-reach': function (c, now, gMul) {
            var osc = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(260, now + 0.05);
            f.type = 'lowpass';
            f.frequency.setValueAtTime(400, now);
            f.Q.value = 1.4;
            g.gain.setValueAtTime(0.005, now);
            g.gain.linearRampToValueAtTime(0.12 * gMul, now + 0.03);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
            osc.connect(f); f.connect(g); g.connect(master);
            osc.start(now); osc.stop(now + 0.07);
        },

        // Venom tendril snap (gentle micro-pop)
        'tendril-snap': function (c, now, gMul) {
            var osc = c.createOscillator(), g = c.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(460, now);
            osc.frequency.exponentialRampToValueAtTime(160, now + 0.03);
            g.gain.setValueAtTime(0.18 * gMul, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
            osc.connect(g); g.connect(master);
            osc.start(now); osc.stop(now + 0.04);
        },

        // Venom collaboration button press (clean, non-distracting, luxurious tactile haptic click)
        'venom-press': function (c, now, gMul) {
            // Warm damped sub-thump (190Hz -> 55Hz)
            var osc1 = c.createOscillator(), g1 = c.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(190, now);
            osc1.frequency.exponentialRampToValueAtTime(55, now + 0.035);
            g1.gain.setValueAtTime(0.24 * gMul, now);
            g1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc1.connect(g1); g1.connect(master);
            osc1.start(now); osc1.stop(now + 0.045);

            // Soft velvet acoustic snap (380Hz -> 110Hz)
            var osc2 = c.createOscillator(), f = c.createBiquadFilter(), g2 = c.createGain();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(380, now);
            osc2.frequency.exponentialRampToValueAtTime(110, now + 0.018);
            f.type = 'lowpass';
            f.frequency.setValueAtTime(550, now);
            g2.gain.setValueAtTime(0.12 * gMul, now);
            g2.gain.exponentialRampToValueAtTime(0.001, now + 0.022);
            osc2.connect(f); f.connect(g2); g2.connect(master);
            osc2.start(now); osc2.stop(now + 0.026);
        },

        // Logomark crystal glass chime (softened)
        'logomark': function (c, now, gMul) {
            var osc1 = c.createOscillator(), osc2 = c.createOscillator(), g = c.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(1046.5, now);
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1567.98, now);
            g.gain.setValueAtTime(0.18 * gMul, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.20);
            osc1.connect(g); osc2.connect(g); g.connect(master);
            osc1.start(now); osc2.start(now);
            osc1.stop(now + 0.22); osc2.stop(now + 0.22);
        },

        // Design assistant popover open (2-tone spark chime)
        'chat-open': function (c, now, gMul) {
            var osc1 = c.createOscillator(), g1 = c.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(659.25, now);
            g1.gain.setValueAtTime(0.18 * gMul, now);
            g1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc1.connect(g1); g1.connect(master);
            osc1.start(now); osc1.stop(now + 0.09);

            var osc2 = c.createOscillator(), g2 = c.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(880, now + 0.05);
            g2.gain.setValueAtTime(0.005, now);
            g2.gain.setValueAtTime(0.20 * gMul, now + 0.05);
            g2.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
            osc2.connect(g2); g2.connect(master);
            osc2.start(now + 0.05); osc2.stop(now + 0.18);
        },

        // Design assistant close
        'chat-close': function (c, now, gMul) {
            var osc = c.createOscillator(), g = c.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(740, now);
            osc.frequency.exponentialRampToValueAtTime(440, now + 0.07);
            g.gain.setValueAtTime(0.16 * gMul, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.connect(g); g.connect(master);
            osc.start(now); osc.stop(now + 0.09);
        },

        // Message send
        'chat-send': function (c, now, gMul) {
            var osc = c.createOscillator(), g = c.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(360, now);
            osc.frequency.exponentialRampToValueAtTime(980, now + 0.08);
            g.gain.setValueAtTime(0.18 * gMul, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
            osc.connect(g); g.connect(master);
            osc.start(now); osc.stop(now + 0.10);
        },

        // Message received
        'chat-receive': function (c, now, gMul) {
            [392, 523.25, 659.25].forEach(function(freq, i) {
                var t = now + i * 0.05;
                var osc = c.createOscillator(), g = c.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t);
                g.gain.setValueAtTime(0.005, now);
                g.gain.setValueAtTime(0.18 * gMul, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
                osc.connect(g); g.connect(master);
                osc.start(t); osc.stop(t + 0.15);
            });
        },

        // Sound Toggle Unmute (Ascending bright harmonic chime)
        'unmute': function (c, now, gMul) {
            [523.25, 783.99].forEach(function(freq, i) {
                var t = now + i * 0.055;
                var osc = c.createOscillator(), g = c.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t);
                g.gain.setValueAtTime(0.005, now);
                g.gain.setValueAtTime(0.22 * gMul, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
                osc.connect(g); g.connect(master);
                osc.start(t); osc.stop(t + 0.20);
            });
        },

        // Sound Toggle Mute (Soft descending release)
        'mute': function (c, now, gMul) {
            [783.99, 523.25].forEach(function(freq, i) {
                var t = now + i * 0.045;
                var osc = c.createOscillator(), g = c.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t);
                g.gain.setValueAtTime(0.005, now);
                g.gain.setValueAtTime(0.16 * gMul, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.10);
                osc.connect(g); g.connect(master);
                osc.start(t); osc.stop(t + 0.12);
            });
        },

        // Effect tabs specialized acoustic profiles (subtle, dampened)
        'effect-stretch': function (c, now, gMul) {
            var osc = c.createOscillator(), g = c.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(260, now);
            osc.frequency.exponentialRampToValueAtTime(540, now + 0.055);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.10);
            g.gain.setValueAtTime(0.20 * gMul, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
            osc.connect(g); g.connect(master);
            osc.start(now); osc.stop(now + 0.12);
        },
        'effect-bulge': function (c, now, gMul) {
            var osc = c.createOscillator(), g = c.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.exponentialRampToValueAtTime(420, now + 0.07);
            osc.frequency.exponentialRampToValueAtTime(220, now + 0.14);
            g.gain.setValueAtTime(0.20 * gMul, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.connect(g); g.connect(master);
            osc.start(now); osc.stop(now + 0.16);
        },
        'effect-drum': function (c, now, gMul) {
            var osc = c.createOscillator(), g = c.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(60, now + 0.06);
            g.gain.setValueAtTime(0.25 * gMul, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
            osc.connect(g); g.connect(master);
            osc.start(now); osc.stop(now + 0.08);
        },
        'effect-shatter': function (c, now, gMul) {
            var osc1 = c.createOscillator(), osc2 = c.createOscillator(), g = c.createGain();
            osc1.type = 'triangle'; osc1.frequency.setValueAtTime(1600, now);
            osc2.type = 'sine'; osc2.frequency.setValueAtTime(2200, now);
            g.gain.setValueAtTime(0.16 * gMul, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
            osc1.connect(g); osc2.connect(g); g.connect(master);
            osc1.start(now); osc2.start(now);
            osc1.stop(now + 0.10); osc2.stop(now + 0.10);
        },
        'effect-dust': function (c, now, gMul) {
            var osc = c.createOscillator(), g = c.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1400, now);
            osc.frequency.exponentialRampToValueAtTime(2600, now + 0.035);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.11);
            g.gain.setValueAtTime(0.16 * gMul, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.connect(g); g.connect(master);
            osc.start(now); osc.stop(now + 0.13);
        },

        // Drawer open/close whoosh
        'drawer-open': function (c, now, gMul) {
            var osc = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(540, now + 0.10);
            f.type = 'lowpass';
            f.frequency.setValueAtTime(400, now);
            f.frequency.exponentialRampToValueAtTime(1000, now + 0.10);
            g.gain.setValueAtTime(0.005, now);
            g.gain.linearRampToValueAtTime(0.20 * gMul, now + 0.04);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
            osc.connect(f); f.connect(g); g.connect(master);
            osc.start(now); osc.stop(now + 0.16);
        },
        'drawer-close': function (c, now, gMul) {
            var osc = c.createOscillator(), g = c.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
            g.gain.setValueAtTime(0.18 * gMul, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.10);
            osc.connect(g); g.connect(master);
            osc.start(now); osc.stop(now + 0.11);
        }
    };

    // Slot-to-Synth mapping
    var SLOT_TO_SYNTH = {
        'swipe': 'swipe',
        'snap': 'snap',
        'select': 'tap',
        'tab-hover': 'tick',
        'tab-select': 'tap',
        'link-hover': 'tick',
        'link-click': 'tap',
        'back': 'tap',
        'to-top': 'drawer-open',
        'image-press': 'tap',
        'photo-hover': 'tick',
        'photo-open': 'tap',
        'photo-close': 'drawer-close',
        'drawer-open': 'drawer-open',
        'drawer-close': 'drawer-close',
        'key-nav': 'key-nav',
        'tendril-reach': 'tendril-reach',
        'tendril-snap': 'tendril-snap',
        'venom-press': 'venom-press',
        'logomark': 'logomark',
        'chat-open': 'chat-open',
        'chat-close': 'chat-close',
        'chat-send': 'chat-send',
        'chat-receive': 'chat-receive',
        'unmute': 'unmute',
        'mute': 'mute',
        'effect-stretch': 'effect-stretch',
        'effect-bulge': 'effect-bulge',
        'effect-drum': 'effect-drum',
        'effect-shatter': 'effect-shatter',
        'effect-dust': 'effect-dust'
    };

    function play(slot, o) {
        o = o || {};
        if (!on) return 0;

        // Rate limit check
        var nowMs = performance.now();
        if (last[slot] && nowMs - last[slot] < 35) return 0;
        last[slot] = nowMs;

        var c = getContext();
        if (!c) return 0;

        var gMul = o.gain == null ? 1.0 : o.gain;
        var synthName = SLOT_TO_SYNTH[slot] || slot;
        var synthFn = SYNTHS[synthName];

        function executePlay(ctxTime) {
            var playTime = Math.max(c.currentTime, ctxTime || 0) + 0.003;
            if (synthFn) {
                try {
                    synthFn(c, playTime, gMul, o.rate);
                } catch (e) {
                    console.error('[PFSound] Synth error:', e);
                }
            }

            // Also trigger MP3 buffer if decoded and available
            var fileKey = (slot === 'select' || slot === 'link-click') ? 'natural-tap-2'
                : (slot === 'swipe' || slot === 'snap') ? 'button-1'
                : (slot === 'drawer-open' || slot === 'tab-select') ? 'whoosh-2'
                : (slot === 'drawer-close' || slot === 'photo-close') ? 'whoosh-2-reverse'
                : null;

            if (fileKey && buffers[fileKey]) {
                try {
                    var node = c.createBufferSource();
                    var g = c.createGain();
                    node.buffer = buffers[fileKey];
                    node.playbackRate.value = o.rate || 1.0;
                    g.gain.value = 0.30 * gMul;
                    node.connect(g);
                    g.connect(master);
                    node.start(playTime);
                } catch (err) {}
            }
        }

        // If context is suspended, resume it first so c.currentTime is live and valid!
        if (c.state === 'suspended') {
            c.resume().then(function () {
                executePlay(c.currentTime);
            }).catch(function () {});
            return 0.1;
        }

        executePlay(c.currentTime);
        return 0.1;
    }

    function setOn(v) {
        on = !!v;
        try {
            sessionStorage.setItem(KEY, on ? 'on' : 'off');
        } catch (e) {}

        if (on) {
            var c = getContext();
            if (c && c.state === 'suspended') c.resume().catch(function () {});
            loadBuffers();
        } else if (ctx && ctx.state === 'running') {
            ctx.suspend().catch(function () {});
        }

        document.documentElement.classList.toggle('sound-on', on);
        document.dispatchEvent(new CustomEvent('pf:sound', { detail: { on: on } }));
    }

    window.PFSound = {
        play: play,
        get on() { return on; },
        set: setOn,
        latency: function () {
            if (!ctx) return 0;
            return Math.min(0.25, (ctx.baseLatency || 0) + (ctx.outputLatency || 0));
        },
        waitFor: function () {
            return 0.15;
        }
    };

    document.documentElement.classList.toggle('sound-on', on);
    document.dispatchEvent(new CustomEvent('pf:sound', { detail: { on: on } }));
    window.dispatchEvent(new CustomEvent('pfsound:ready', { detail: { on: on } }));

    // =========================================================================
    // MUTE / UNMUTE TOGGLE BUTTON
    // =========================================================================
    var SPEAKER = 'M11.6667 12.3446V7.65538C11.6667 5.03438 11.6667 3.72388 10.8956 3.39775C10.1245 3.07161 9.21692 3.99827 7.40194 5.8516C6.46199 6.81137 5.92571 7.02391 4.58837 7.02391C3.41881 7.02391 2.83404 7.02391 2.41396 7.31052C1.54196 7.90546 1.67377 9.06833 1.67377 10C1.67377 10.9317 1.54196 12.0945 2.41396 12.6895C2.83404 12.9761 3.41881 12.9761 4.58837 12.9761C5.92571 12.9761 6.46199 13.1887 7.40194 14.1484C9.21692 16.0017 10.1245 16.9284 10.8956 16.6023C11.6667 16.2761 11.6667 14.9656 11.6667 12.3446Z';
    var SHAPES = [
        {
            wave:  [14.1667, 7.5, 14.6878, 8.18307, 15, 9.05283, 15, 10, 15, 10.9472, 14.6878, 11.8169, 14.1667, 12.5],
            cross: [15, 8.33333, 15.5556, 8.88889, 16.1111, 9.44444, 16.6667, 10, 17.2222, 10.5556, 17.7778, 11.1111, 18.3333, 11.6667]
        },
        {
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
        if (document.querySelector('.sound-toggle')) return;
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

        var state = SHAPES.map(function () { return { x: on ? 0 : 1, v: 0, target: on ? 0 : 1, delay: 0 }; });
        var raf = 0, lastT = 0;
        function draw() { state.forEach(function (st, i) { paths[i].setAttribute('d', pathAt(SHAPES[i], st.x)); }); }
        function tick(now) {
            var dt = Math.min(0.05, (now - lastT) / 1000 || 0.016);
            lastT = now;
            var busy = false;
            state.forEach(function (st) {
                if (st.delay > 0) { st.delay -= dt; busy = true; return; }
                for (var k = 0, h = dt / 4; k < 4; k++) {
                    st.v += (-140 * (st.x - st.target) - 16 * st.v) * h;
                    st.x += st.v * h;
                }
                if (Math.abs(st.x - st.target) > 0.0005 || Math.abs(st.v) > 0.005) busy = true;
                else { st.x = st.target; st.v = 0; }
            });
            draw();
            raf = busy ? requestAnimationFrame(tick) : 0;
        }
        function morph(toWaves) {
            state.forEach(function (st, i) {
                st.target = toWaves ? 0 : 1;
                st.delay = i * 0.05;
                if (reduce) { st.x = st.target; st.v = 0; }
            });
            if (reduce) return draw();
            if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(tick); }
        }

        function setLabel(text) {
            sr.textContent = text;
            btn.setAttribute('aria-label', text === 'Mute' ? 'Mute sounds' : 'Unmute sounds');
            label.innerHTML = '<span class="sl-word">' + text + '</span>';
        }

        draw();
        setLabel(on ? 'Mute' : 'Unmute');

        btn.addEventListener('click', function () {
            unlock();
            if (on) {
                play('mute');
                setOn(false);
            } else {
                setOn(true);
                play('unmute');
            }
        });

        btn.addEventListener('pointerenter', function () {
            play('tab-hover');
        });

        document.addEventListener('pf:sound', function () {
            morph(on);
            setLabel(on ? 'Mute' : 'Unmute');
        });
    }

    // =========================================================================
    // SITE-WIDE INTERACTION DELEGATION
    // =========================================================================
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    var hovered = null;

    document.addEventListener('pointerover', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        var t = e.target;
        if (!t || !t.closest) return;

        var a = t.closest('a[href]');
        if (a && a !== hovered) {
            hovered = a;
            if (!e.pointerType || e.pointerType === 'mouse' || finePointer.matches) {
                if (a.classList.contains('logomark')) play('logomark');
                else play('link-hover');
            }
            return;
        }

        var interactive = t.closest('.sound-toggle');
        if (interactive && interactive !== hovered) {
            hovered = interactive;
            if (!e.pointerType || e.pointerType === 'mouse' || finePointer.matches) play('tab-hover');
            return;
        }

        if (!a && !interactive) hovered = null;
    });

    document.addEventListener('click', function (e) {
        unlock();
        var t = e.target;
        if (!t || !t.closest) return;

        if (t.closest('a.logomark')) return play('logomark');

        var backBtn = t.closest('a.back, a.auth-back');
        if (backBtn) return play('back');

        var link = t.closest('a[href]');
        if (link && !link.classList.contains('logomark')) return play('link-click');

        if (t.closest('.to-top')) return play('to-top');

        // Tactile micro-tap on general page clicks (outside custom-handled carousel/venom)
        if (!t.closest('card-carousel, .venom-hit, segmented-control, button')) {
            play('tap', { gain: 0.12 });
        }
    });

    document.addEventListener('keydown', function (e) {
        unlock();
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            play('key-nav', { gain: 0.18 });
        } else if (e.key === 'Tab') {
            play('tick', { gain: 0.15 });
        } else if (e.key === 'Enter' || e.key === ' ') {
            play('tap', { gain: 0.16 });
        }
    });

    // Throttled carousel wheel scrub
    var lastWheelTime = 0;
    window.addEventListener('wheel', function (e) {
        var now = performance.now();
        if (now - lastWheelTime > 90 && (Math.abs(e.deltaX) > 6 || Math.abs(e.deltaY) > 6)) {
            lastWheelTime = now;
            play('swipe', { gain: 0.18 });
        }
    }, { passive: true });

    // Segmented control tabs
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
    }

    function init() {
        build();
        wireTabs();
        loadBuffers();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
