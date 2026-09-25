/*
 * "Download several at once": pick mods, get one ZIP with a folder for each.
 *
 * GitHub doesn't let a page fetch release downloads, so the hub keeps its own copies of each mod's current ZIP
 * on the `downloads` branch (scripts/update-downloads.mjs, hourly: the same release each Download button offers).
 * This reads their manifest.json from GitHub's raw file host, which does allow it, fetches the picked copies,
 * checks each against its SHA-256 and joins them with assets/zipmerge.js. Nothing is unpacked or sent anywhere.
 *
 * For a local preview, ?downloads=<folder or URL> reads the copies from there instead.
 */
(() => {
  'use strict';

  const form = document.querySelector('[data-bundle]');
  const Zip = window.TimbermodsZip;
  if (!form || !Zip) return;

  const RAW = 'https://raw.githubusercontent.com/timbermods/timbermods.github.io/downloads/';
  const base = (() => {
    try {
      const q = new URLSearchParams(location.search).get('downloads');
      return q ? new URL(q.replace(/\/?$/, '/'), location.href).href : RAW;
    } catch (e) { return RAW; }
  })();

  const note = form.querySelector('[data-bundle-note]');
  const go = form.querySelector('[data-bundle-go]');
  const goLabel = go.querySelector('.btn-label');
  const goSize = go.querySelector('[data-bundle-size]');
  const all = form.querySelector('[data-bundle-all]');
  const inputs = [...form.querySelectorAll('input')];
  const boxes = inputs.filter((i) => i.type === 'checkbox');
  let mods = new Map();
  let busy = false;

  const formatSize = (bytes) => bytes >= 1048576
    ? (bytes / 1048576).toFixed(1) + ' MB'
    : Math.max(1, Math.round(bytes / 1024)) + ' KB';
  const plural = (n) => n + (n === 1 ? ' mod' : ' mods');
  const say = (text) => { note.textContent = text; };

  const chosen = () => inputs.filter((i) => i.checked && i.value && mods.has(i.value)).map((i) => mods.get(i.value));

  function refresh() {
    const picked = chosen();
    go.disabled = busy || !picked.length;
    goLabel.textContent = picked.length ? 'Download ' + plural(picked.length) : 'Pick a mod first';
    goSize.textContent = picked.length ? formatSize(picked.reduce((n, m) => n + m.size, 0)) : '';
    const open = boxes.filter((b) => !b.disabled);
    all.textContent = open.length && open.every((b) => b.checked) ? 'Clear these' : 'Select all';
  }

  function lock(on) {
    busy = on;
    inputs.forEach((i) => { i.disabled = on || (i.value !== '' && !mods.has(i.value)); });
    all.disabled = on;
    refresh();
  }

  // The text file at the top of the ZIP: what is in it and where it goes. CRLF, for Notepad.
  function readme(picked, when) {
    const lines = [
      'Timbermods: ' + plural(picked.length) + ', downloaded ' + when.toISOString().slice(0, 10) + '.',
      '',
      'Close Timberborn. Extract every folder in this ZIP into Documents\\Timberborn\\Mods,',
      'then turn the mods on in the game\'s mod manager.',
      '',
    ];
    for (const m of picked) {
      lines.push(m.name + ' ' + m.version + (m.prerelease ? ' (preview)' : '') + ', folder ' + m.folder);
      lines.push('  Requires: ' + (m.requires || 'Nothing extra'));
      lines.push('  Release notes: ' + m.notes);
    }
    lines.push('', 'Harmony and Mod Settings are separate mods: subscribe to them on the Steam Workshop.', 'https://timbermods.github.io/', '');
    return lines.join('\r\n');
  }

  async function sha256(bytes) {
    const d = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
    return [...d].map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  async function load() {
    try {
      const res = await fetch(base + 'manifest.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      mods = new Map((await res.json()).mods.map((m) => [m.id, m]));
    } catch (e) {
      say('The download list didn\'t load. Use each mod\'s own Download button above.');
      inputs.forEach((i) => { i.disabled = true; });
      return;
    }
    for (const input of inputs) {
      if (!input.value) continue;
      const m = mods.get(input.value);
      const ver = input.closest('.pick').querySelector('[data-ver]');
      if (m) ver.textContent = m.version + ' · ' + formatSize(m.size);
      else { input.checked = false; ver.textContent = 'Not available'; }
    }
    say('');
    lock(false);
  }

  form.addEventListener('change', refresh);

  all.addEventListener('click', () => {
    const open = boxes.filter((b) => !b.disabled);
    const on = !open.every((b) => b.checked);
    open.forEach((b) => { b.checked = on; });
    refresh();
  });

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const picked = chosen();
    if (busy || !picked.length) return;
    lock(true);
    try {
      const parts = [];
      for (const [i, m] of picked.entries()) {
        say('Downloading ' + m.name + ' (' + (i + 1) + ' of ' + picked.length + ')…');
        const res = await fetch(base + m.file);
        if (!res.ok) throw new Error(m.name + ' didn\'t download');
        const bytes = new Uint8Array(await res.arrayBuffer());
        if (await sha256(bytes) !== m.sha256) throw new Error(m.name + ' didn\'t match its checksum');
        parts.push(bytes);
      }
      const when = new Date();
      const zip = Zip.merge(parts, [{ name: 'Timbermods.txt', text: readme(picked, when) }], when);
      const url = URL.createObjectURL(new Blob([zip], { type: 'application/zip' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'timbermods-mods.zip';
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      say('Saved timbermods-mods.zip with ' + plural(picked.length) + '. Extract it into Documents\\Timberborn\\Mods.');
    } catch (e) {
      say(e.message + '. Try again, or use its own Download button above.');
    } finally {
      lock(false);
    }
  });

  load();
})();
