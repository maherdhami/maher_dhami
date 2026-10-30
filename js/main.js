/**
 * MAHER DHAMI — PERSONAL BRAND SITE
 * Vanilla JS, no dependencies. Modules are small init functions so each
 * piece of behaviour can be read, tested and removed independently.
 */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const EMAIL = 'maherdhamicet@gmail.com';

  /* ------------------------------------------------------------------ */
  /* Small shared helpers                                                */
  /* ------------------------------------------------------------------ */
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (name, attrs = {}, parent) => {
    const el = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    if (parent) parent.appendChild(el);
    return el;
  };

  const toast = $('#toast');
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  /* ------------------------------------------------------------------ */
  /* Navigation, scroll progress, scrollspy, drawer, back-to-top          */
  /* ------------------------------------------------------------------ */
  function initNav() {
    const nav = $('#nav');
    const toTop = $('#to-top');
    const links = $$('.nav__link');
    const sections = $$('main section[id]');
    const root = document.documentElement;

    let ticking = false;
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? clamp(y / max, 0, 1) : 0;
      nav.classList.toggle('is-scrolled', y > 24);
      nav.style.setProperty('--progress', p.toFixed(4));
      toTop.style.setProperty('--progress', p.toFixed(4));
      toTop.classList.toggle('is-visible', y > window.innerHeight * 0.8);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();

    // Scrollspy
    if ('IntersectionObserver' in window) {
      const spy = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = e.target.id;
          links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + id));
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach((s) => spy.observe(s));
    }

    // Mobile drawer
    const btn = $('#menu-btn');
    const drawer = $('#drawer');
    const setDrawer = (open) => {
      drawer.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', String(!open));
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      root.style.overflow = open ? 'hidden' : '';
    };
    btn.addEventListener('click', () => setDrawer(!drawer.classList.contains('is-open')));
    $$('a', drawer).forEach((a) => a.addEventListener('click', () => setDrawer(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setDrawer(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 1020) setDrawer(false); });

    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  }

  /* ------------------------------------------------------------------ */
  /* Scroll reveal                                                       */
  /* ------------------------------------------------------------------ */
  function initReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------------ */
  /* Parallax (hero only) + custom cursor                                 */
  /* ------------------------------------------------------------------ */
  function initParallax() {
    if (reduceMotion) return;
    const els = $$('[data-parallax]');
    const hero = $('#top');
    let raf = false;
    const update = () => {
      const y = window.scrollY;
      if (y < hero.offsetHeight * 1.4) {
        els.forEach((el) => {
          const f = parseFloat(el.dataset.parallax) || 0;
          el.style.transform = `translate3d(0, ${(y * f * -1).toFixed(1)}px, 0)`;
        });
      }
      raf = false;
    };
    window.addEventListener('scroll', () => { if (!raf) { requestAnimationFrame(update); raf = true; } }, { passive: true });
  }

  function initCursor() {
    if (!finePointer || reduceMotion || window.innerWidth < 900) return;
    const ring = $('.cursor');
    const dot = $('.cursor-dot');
    document.body.classList.add('has-cursor');
    let x = 0, y = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', (e) => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
    const loop = () => {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    const hoverables = 'a, button, .guest, .repo, .chan, .node__chip, .loop__step, .cat';
    document.addEventListener('mouseover', (e) => { if (e.target.closest(hoverables)) ring.classList.add('is-active'); });
    document.addEventListener('mouseout', (e) => { if (e.target.closest(hoverables)) ring.classList.remove('is-active'); });
  }

  /* ------------------------------------------------------------------ */
  /* Identity strip — clone track for a seamless marquee                  */
  /* ------------------------------------------------------------------ */
  function initStrip() {
    const track = $('#strip-track');
    if (!track) return;
    $$('.strip__item', track).forEach((el) => {
      const c = el.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      track.appendChild(c);
    });
  }

  /* ------------------------------------------------------------------ */
  /* About — "how I work" loop                                            */
  /* ------------------------------------------------------------------ */
  function initLoop() {
    const steps = $$('.loop__step');
    const detail = $('#loop-detail');
    if (!steps.length) return;
    const copy = [
      'Courses and bootcamps in data science, deep learning, NLP and generative AI \u2014 then straight into code, never theory alone.',
      'Seven end-to-end projects so far: RAG systems, LLM-powered analytics and predictive ML models.',
      'If it only runs on my laptop, it isn\u2019t finished. I deploy to Streamlit Cloud so anyone can try it.',
      'Hosting The Young Founder Show and teaching at CodiePag workshops \u2014 explaining is how I find out what I actually know.'
    ];
    const set = (i) => {
      steps.forEach((s, n) => {
        s.classList.toggle('is-active', n === i);
        s.setAttribute('aria-selected', String(n === i));
      });
      detail.style.setProperty('--pointer', (12.5 + i * 25) + '%');
      const p = detail.querySelector('p');
      p.style.animation = 'none'; void p.offsetWidth; p.style.animation = '';
      p.textContent = copy[i];
    };
    steps.forEach((s, i) => s.addEventListener('click', () => set(i)));
    set(0);
  }

  /* ------------------------------------------------------------------ */
  /* Expertise — constellation                                            */
  /* ------------------------------------------------------------------ */
  const CONSTELLATION = {
    ai: { title: 'Artificial Intelligence', nodes: [
      ['Generative AI'], ['LLMs'], ['RAG'], ['LangChain', 'langchain'], ['Machine Learning'],
      ['AI-powered apps'], ['Hugging Face', 'huggingface'], ['Ollama', 'ollama']] },
    dev: { title: 'Development', nodes: [
      ['Python', 'python'], ['FastAPI', 'fastapi'], ['Streamlit', 'streamlit'],
      ['C++', 'cplusplus'], ['C', 'c'], ['REST APIs'], ['OOP']] },
    data: { title: 'Data & Databases', nodes: [
      ['NumPy', 'numpy'], ['Pandas', 'pandas'], ['Matplotlib', 'matplotlib'], ['Scikit-learn', 'scikitlearn'],
      ['ChromaDB'], ['SQL'], ['Data Analytics'], ['Feature Engineering']] },
    tools: { title: 'Tools & Engineering', nodes: [
      ['Git', 'git'], ['GitHub', 'github'], ['Docker', 'docker'], ['REST APIs'],
      ['Streamlit Cloud', 'streamlit'], ['Vercel', 'vercel']] }
  };

  function initConstellation() {
    const nodesEl = $('#stage-nodes');
    const linesEl = $('#stage-lines');
    const core = $('#stage-core');
    const cats = $$('.cat');
    if (!nodesEl) return;

    const render = (key) => {
      const d = CONSTELLATION[key];
      core.textContent = d.title;
      nodesEl.innerHTML = '';
      linesEl.innerHTML = '';
      const n = d.nodes.length;
      d.nodes.forEach(([label, slug], i) => {
        const a = -Math.PI / 2 + i * (2 * Math.PI / n) + (i % 2 ? 0.1 : 0);
        const rx = i % 2 ? 31 : 43;
        const ry = i % 2 ? 29 : 39;
        const x = 50 + rx * Math.cos(a);
        const y = 50 + ry * Math.sin(a);

        const node = document.createElement('div');
        node.className = 'node';
        node.style.left = x.toFixed(2) + '%';
        node.style.top = y.toFixed(2) + '%';
        node.style.setProperty('--i', i);
        const chip = document.createElement('span');
        chip.className = 'node__chip';
        const glyph = () => {
          const g = svgEl('svg', { class: 'glyph icon', viewBox: '0 0 24 24' });
          svgEl('use', { href: '#i-spark' }, g);
          return g;
        };
        if (slug) {
          const img = new Image();
          img.width = 20; img.height = 20; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
          img.src = `https://cdn.simpleicons.org/${slug}/315EFB`;
          img.addEventListener('error', () => img.replaceWith(glyph()));
          chip.appendChild(img);
        } else {
          chip.appendChild(glyph());
        }
        chip.appendChild(document.createTextNode(label));
        node.appendChild(chip);
        nodesEl.appendChild(node);

        svgEl('line', { x1: 50, y1: 50, x2: x.toFixed(2), y2: y.toFixed(2) }, linesEl);
      });
    };

    cats.forEach((c) => c.addEventListener('click', () => {
      cats.forEach((o) => { o.classList.toggle('is-active', o === c); o.setAttribute('aria-selected', String(o === c)); });
      render(c.dataset.cat);
    }));
    render('ai');
  }

  /* ------------------------------------------------------------------ */
  /* Projects — tilt, live preview, generated visualizations              */
  /* ------------------------------------------------------------------ */
  function initProjects() {
    // Tilt + inner image parallax on browser mockups (desktop only)
    if (finePointer && !reduceMotion) {
      $$('[data-tilt]').forEach((b) => {
        b.addEventListener('mousemove', (e) => {
          const r = b.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          b.style.setProperty('--ry', (px * 6).toFixed(2) + 'deg');
          b.style.setProperty('--rx', (-py * 5).toFixed(2) + 'deg');
          b.style.setProperty('--mx', (-px * 18).toFixed(1) + 'px');
          b.style.setProperty('--my', (-py * 12).toFixed(1) + 'px');
        });
        b.addEventListener('mouseleave', () => {
          ['--ry', '--rx', '--mx', '--my'].forEach((p) => b.style.removeProperty(p));
        });
      });
    }

    // Load the real deployed app inside the browser mockup on demand
    $$('.preview-btn').forEach((btn) => btn.addEventListener('click', () => {
      const body = btn.closest('.browser__body');
      const frame = document.createElement('iframe');
      frame.src = btn.dataset.src;
      frame.title = 'Live app preview';
      frame.loading = 'lazy';
      frame.setAttribute('allow', 'clipboard-write');
      body.innerHTML = '';
      body.appendChild(frame);
    }));

    // Generative, concept-linked visualizations (clearly labelled illustrative)
    $$('.viz').forEach((host, idx) => {
      const rand = mulberry32(7 + idx * 31);
      const gid = 'g' + idx;
      let w = 400, h = 500;
      if (host.dataset.viz === 'bars') { h = 400; }
      if (host.dataset.viz === 'network') { h = 480; }
      const svg = svgEl('svg', { viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: 'xMidYMid slice', 'aria-hidden': 'true' });
      const defs = svgEl('defs', {}, svg);
      const grad = svgEl('linearGradient', { id: gid, x1: 0, y1: 1, x2: 0, y2: 0 }, defs);
      svgEl('stop', { offset: '0', 'stop-color': '#315EFB' }, grad);
      svgEl('stop', { offset: '1', 'stop-color': '#60A5FA' }, grad);

      // faint grid
      for (let i = 1; i < 8; i++) {
        svgEl('line', { x1: 0, x2: w, y1: (h / 8) * i, y2: (h / 8) * i, stroke: '#172033', 'stroke-opacity': 0.05 }, svg);
        svgEl('line', { y1: 0, y2: h, x1: (w / 8) * i, x2: (w / 8) * i, stroke: '#172033', 'stroke-opacity': 0.05 }, svg);
      }

      if (host.dataset.viz === 'clusters') {
        const centers = [[125, 170, '#315EFB'], [285, 255, '#60A5FA'], [165, 385, '#172033']];
        centers.forEach(([cx, cy, col]) => {
          for (let i = 0; i < 30; i++) {
            const a = rand() * Math.PI * 2, r = Math.pow(rand(), 0.7) * 62;
            svgEl('circle', { cx: (cx + Math.cos(a) * r).toFixed(1), cy: (cy + Math.sin(a) * r).toFixed(1), r: (3 + rand() * 4.5).toFixed(1), fill: col, 'fill-opacity': (0.35 + rand() * 0.5).toFixed(2) }, svg);
          }
        });
        [[345, 92], [58, 455], [352, 425]].forEach(([cx, cy]) => {
          svgEl('circle', { cx, cy, r: 5, fill: '#172033' }, svg);
          const ring = svgEl('circle', { cx, cy, r: 16, fill: 'none', stroke: '#60A5FA', 'stroke-width': 1.6, 'stroke-dasharray': '4 4' }, svg);
          if (!reduceMotion) svgEl('animate', { attributeName: 'r', values: '14;22;14', dur: '3.4s', repeatCount: 'indefinite' }, ring);
        });
      }

      if (host.dataset.viz === 'bars') {
        const n = 26, bw = w / n, thr = h * 0.4;
        for (let i = 0; i < n; i++) {
          const v = 0.18 + 0.62 * Math.abs(Math.sin(i * 0.55) * 0.6 + rand() * 0.55);
          const bh = Math.min(v, 0.92) * h * 0.82;
          const over = h - bh < thr;
          svgEl('rect', { x: (i * bw + 4).toFixed(1), y: (h - bh).toFixed(1), width: (bw - 8).toFixed(1), height: bh.toFixed(1), rx: 5, fill: over ? '#60A5FA' : `url(#${gid})`, 'fill-opacity': over ? 0.95 : 0.8 }, svg);
        }
        svgEl('line', { x1: 0, x2: w, y1: thr, y2: thr, stroke: '#172033', 'stroke-dasharray': '6 6', 'stroke-opacity': 0.45 }, svg);
        const t = svgEl('text', { x: 14, y: thr - 10, 'font-family': 'JetBrains Mono, monospace', 'font-size': 11, fill: '#718096' }, svg);
        t.textContent = 'RISK THRESHOLD';
      }

      if (host.dataset.viz === 'network') {
        const cx = w / 2, cy = h / 2;
        const lines = svgEl('g', { stroke: '#315EFB', 'stroke-opacity': 0.28, 'stroke-width': 1.3 }, svg);
        const dots = svgEl('g', {}, svg);
        const l1 = 7;
        for (let i = 0; i < l1; i++) {
          const a = (i / l1) * Math.PI * 2 + 0.3;
          const x1 = cx + Math.cos(a) * 92, y1 = cy + Math.sin(a) * 92;
          svgEl('line', { x1: cx, y1: cy, x2: x1.toFixed(1), y2: y1.toFixed(1) }, lines);
          svgEl('circle', { cx: x1.toFixed(1), cy: y1.toFixed(1), r: 9, fill: '#315EFB', 'fill-opacity': 0.85 }, dots);
          const kids = 2 + Math.floor(rand() * 2);
          for (let k = 0; k < kids; k++) {
            const a2 = a + (k - (kids - 1) / 2) * 0.42 + (rand() - 0.5) * 0.12;
            const d2 = 150 + rand() * 38;
            const x2 = clamp(cx + Math.cos(a2) * d2, 14, w - 14), y2 = clamp(cy + Math.sin(a2) * d2 * 1.12, 14, h - 14);
            svgEl('line', { x1: x1.toFixed(1), y1: y1.toFixed(1), x2: x2.toFixed(1), y2: y2.toFixed(1) }, lines);
            svgEl('circle', { cx: x2.toFixed(1), cy: y2.toFixed(1), r: (4 + rand() * 3.5).toFixed(1), fill: '#60A5FA', 'fill-opacity': 0.85 }, dots);
          }
        }
        const core = svgEl('circle', { cx, cy, r: 22, fill: `url(#${gid})` }, dots);
        if (!reduceMotion) {
          const pulse = svgEl('circle', { cx, cy, r: 22, fill: 'none', stroke: '#60A5FA', 'stroke-width': 1.5 }, dots);
          svgEl('animate', { attributeName: 'r', values: '22;70', dur: '3s', repeatCount: 'indefinite' }, pulse);
          svgEl('animate', { attributeName: 'stroke-opacity', values: '.8;0', dur: '3s', repeatCount: 'indefinite' }, pulse);
        }
        void core;
      }
      host.insertBefore(svg, host.firstChild);
    });

    // Progressive enhancement: refresh the archive from the GitHub API
    refreshArchive();
  }

  async function refreshArchive() {
    const list = $('#archive-list');
    if (!list || !('fetch' in window)) return;
    const featured = new Set(['autonomous-ai-data-analysts', 'ai-knowledge-assistant', 'social-media-virality-prediction',
      'student-dropout-risk-prediction', 'student-success-intelligence-platform', 'maher_dhami']);
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    try {
      const res = await fetch('https://api.github.com/users/maherdhami/repos?per_page=100&sort=updated', {
        headers: { Accept: 'application/vnd.github+json' }, signal: ctrl.signal
      });
      if (!res.ok) return;
      const repos = (await res.json())
        .filter((r) => !r.fork && !featured.has(r.name.toLowerCase()) && (r.description || r.homepage) && r.description !== r.name)
        .slice(0, 6);
      if (!repos.length) return;
      list.innerHTML = '';
      repos.forEach((r) => {
        const a = document.createElement('a');
        a.className = 'repo'; a.href = r.html_url; a.target = '_blank'; a.rel = 'noopener';
        const n = document.createElement('span'); n.className = 'repo__name'; n.textContent = r.name.replace(/[-_]/g, ' ');
        const d = document.createElement('span'); d.className = 'repo__desc'; d.textContent = r.description || 'Live deployment on Vercel.';
        const l = document.createElement('span'); l.className = 'repo__lang'; l.textContent = r.language || 'Repository';
        const ic = svgEl('svg', { class: 'icon' }); svgEl('use', { href: '#i-arrow-ur' }, ic);
        a.append(n, d, l, ic);
        list.appendChild(a);
      });
    } catch (_) { /* keep static fallback */ } finally { clearTimeout(t); }
  }

  /* ------------------------------------------------------------------ */
  /* Journey — animated progress                                          */
  /* ------------------------------------------------------------------ */
  function initTimeline() {
    const tl = $('#timeline');
    if (!tl) return;
    const fill = $('.tl__fill', tl);
    const update = () => {
      const r = tl.getBoundingClientRect();
      const p = clamp((window.innerHeight * 0.55 - r.top) / r.height, 0, 1);
      fill.style.setProperty('--fill', p.toFixed(4));
    };
    window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ------------------------------------------------------------------ */
  /* TYF — audio waveform bars                                            */
  /* ------------------------------------------------------------------ */
  function initWave() {
    const wave = $('#wave');
    if (!wave) return;
    const n = window.innerWidth < 600 ? 34 : 64;
    const rand = mulberry32(42);
    for (let i = 0; i < n; i++) {
      const bar = document.createElement('i');
      const env = 0.35 + 0.65 * Math.abs(Math.sin(i / n * Math.PI * 2.4 + 0.6));
      bar.style.setProperty('--h', clamp(env * (0.55 + rand() * 0.6), 0.14, 1).toFixed(2));
      bar.style.setProperty('--n', i);
      wave.appendChild(bar);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Contact — Calendly (lazy), copy email                              */
  /* ------------------------------------------------------------------ */
  function initContact() {
    // Lazy-load Calendly when the section approaches the viewport
    const section = $('#contact');
    const loadCalendly = () => {
      if (document.getElementById('calendly-js')) return;
      const s = document.createElement('script');
      s.id = 'calendly-js'; s.async = true;
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      document.body.appendChild(s);
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { loadCalendly(); io.disconnect(); } }, { rootMargin: '400px 0px' });
      io.observe(section);
    } else { loadCalendly(); }

    $$('.copy-email-btn').forEach((b) => b.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(EMAIL); showToast('Email copied: ' + EMAIL); }
      catch (_) { window.location.href = 'mailto:' + EMAIL; }
    }));
  }

  /* ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
    initNav();
    initReveal();
    initParallax();
    initCursor();
    initStrip();
    initLoop();
    initConstellation();
    initProjects();
    initTimeline();
    initWave();
    initContact();
  });
})();
