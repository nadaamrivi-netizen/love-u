const photoUpload = document.getElementById('photoUpload');
const gallery = document.getElementById('gallery');
const uploadStatus = document.getElementById('uploadStatus');
const coverPreview = document.getElementById('coverPreview');
const coverPlaceholder = document.getElementById('coverPlaceholder');
const toast = document.getElementById('toast');

// Foto utama permanen dibaca dari assets/foto-utama.jpg.
coverPreview.addEventListener('error', () => {
  coverPreview.classList.add('hidden');
  coverPlaceholder.style.display = 'flex';
});
coverPreview.addEventListener('load', () => {
  coverPreview.classList.remove('hidden');
  coverPlaceholder.style.display = 'none';
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}
photoUpload.addEventListener('change', (event) => {
  const files = Array.from(event.target.files || []).filter(file => file.type.startsWith('image/'));
  if (!files.length) return;
  // Jadikan foto pertama sebagai foto utama.
  const coverURL = URL.createObjectURL(files[0]);
  coverPreview.src = coverURL;
  coverPreview.classList.remove('hidden');
  coverPlaceholder.style.display = 'none';

  // Foto tambahan ditampilkan sebagai kartu kenangan.
  gallery.innerHTML = '';
  files.forEach((file, index) => {
    const url = URL.createObjectURL(file);
    const card = document.createElement('div');
    card.className = 'memory-card tilt-card';
    const image = document.createElement('img');
    image.src = url;
    image.alt = `Kenangan ${index + 1}`;
    image.loading = 'lazy';
    const caption = document.createElement('p');
    caption.textContent = ['the beginning', 'the little things', 'my favorite day', 'just us', 'a little forever'][index % 5];
    card.append(image, caption);
    gallery.appendChild(card);
  });
  uploadStatus.textContent = `${files.length} foto dipilih. Foto tampil selama halaman ini terbuka.`;
  showToast('Foto kenangan berhasil ditambahkan ♡');
});

const audio = document.getElementById('ourSong');
const audioUpload = document.getElementById('audioUpload');
const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');
const musicDock = document.getElementById('musicDock');
const trackName = document.getElementById('trackName');
let audioReady = Boolean(audio.getAttribute('src'));
audio.addEventListener('canplay', () => {
  audioReady = true;
  trackName.textContent = 'Say You Won’t Let Go';
});
audio.addEventListener('error', () => {
  // File assets/lagu.mp3 belum diletakkan; pengguna bisa pilih audio lewat tombol +.
  audioReady = false;
});

audioUpload.addEventListener('change', () => {
  const file = audioUpload.files && audioUpload.files[0];
  if (!file) return;
  if (audio.src.startsWith('blob:')) URL.revokeObjectURL(audio.src);
  audio.src = URL.createObjectURL(file);
  trackName.textContent = file.name.replace(/\.[^/.]+$/, '');
  audioReady = true;
  audio.play().then(updateMusicUI).catch(() => {
    showToast('File lagu siap. Tekan Play our song untuk memutar.');
    updateMusicUI();
  });
});
function updateMusicUI() {
  const playing = !audio.paused;
  musicLabel.textContent = playing ? 'Pause our song' : 'Play our song';
  musicDock.classList.toggle('paused', !playing);
}
musicToggle.addEventListener('click', async () => {
  if (!audioReady || !audio.src) {
    audioUpload.click();
    showToast('Pilih file lagu dari perangkatmu ♫');
    return;
  }
  if (audio.paused) {
    try { await audio.play(); } catch { showToast('Browser tidak dapat memutar file ini. Coba pilih file audio lain.'); }
  } else {
    audio.pause();
  }
  updateMusicUI();
});
audio.addEventListener('play', updateMusicUI);
audio.addEventListener('pause', updateMusicUI);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Tambahkan bintang-bintang kecil dekoratif di latar hero.
const hero = document.querySelector('.hero');
for (let i = 0; i < 18; i++) {
  const star = document.createElement('span');
  star.textContent = i % 3 === 0 ? '✦' : '·';
  star.style.cssText = `position:absolute;left:${5 + Math.random()*90}%;top:${10 + Math.random()*80}%;color:#e8a6b9;opacity:${.2 + Math.random()*.45};font-size:${8 + Math.random()*10}px;pointer-events:none;`;
  hero.appendChild(star);
}
