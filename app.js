   
        // ─── DOM refs ───
        const $ = s => document.querySelector(s);
        const pre = $('#preloader');

        // ─── preloader ───
        window.addEventListener('load', () => setTimeout(() => pre.classList.add('open'), 900));
        setTimeout(() => pre.classList.add('done'), 3900);

        // ─── topbar scroll effect ───
        const topbar = $('#topbar');
        window.addEventListener('scroll', () => {
            topbar.classList.toggle('scrolled', window.scrollY > 60);
        });

        // ─── language ───
        function setLang(code) {
            document.documentElement.lang = code;
            document.querySelectorAll('[data-si]').forEach(el => {
                const val = el.dataset[code];
                if (val) el.innerHTML = val;
            });
            $('#si').classList.toggle('active', code === 'si');
            $('#en').classList.toggle('active', code === 'en');
            localStorage.setItem('ridi-lang', code);
        }
        $('#si').onclick = () => setLang('si');
        $('#en').onclick = () => setLang('en');
        const savedLang = localStorage.getItem('ridi-lang');
        setLang(savedLang || ((navigator.language || 'si').toLowerCase().startsWith('si') ? 'si' : 'en'));

        // ─── smooth nav with transition ───
        const transition = $('#transitionLayer');
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                const target = document.querySelector(a.getAttribute('href'));
                if (!target) return;
                e.preventDefault();
                transition.classList.remove('go');
                void transition.offsetWidth;
                transition.classList.add('go');
                setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 280);
            });
        });

        // ─── scroll reveal ───
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') });
        }, { threshold: .12 });
        document.querySelectorAll('.reveal').forEach(x => observer.observe(x));

        // ─── 3D invitation tilt ───
        document.querySelectorAll('.invitation').forEach(card => {
            card.addEventListener('mousemove', e => {
                if (innerWidth < 900) return;
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - .5;
                const y = (e.clientY - r.top) / r.height - .5;
                card.style.transform = `perspective(1200px) rotateY(${x * 4}deg) rotateX(${-y * 3}deg)`;
            });
            card.addEventListener('mouseleave', () => card.style.transform = '');
        });

        // ─── download invitation ───
        $('#download').onclick = () => {
            const c = document.createElement('canvas'),
                ctx = c.getContext('2d');
            c.width = 1600;
            c.height = 1050;
            const g = ctx.createLinearGradient(0, 0, 1600, 1050);
            g.addColorStop(0, '#f8eccb');
            g.addColorStop(1, '#d6b66e');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, c.width, c.height);
            ctx.strokeStyle = '#9b6411';
            ctx.lineWidth = 18;
            ctx.strokeRect(35, 35, 1530, 980);
            ctx.lineWidth = 2;
            ctx.strokeRect(65, 65, 1470, 920);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#8d4912';
            ctx.font = 'bold 38px Georgia';
            ctx.fillText('☸  RIDI VIHARA • RIDEE VIHARAYA  ☸', 800, 145);
            ctx.font = 'bold 70px Georgia';
            ctx.fillText('INVITATION', 800, 255);
            ctx.fillStyle = '#4a2b0c';
            ctx.font = 'bold 43px Georgia';
            ctx.fillText('Ridi Viharaya Annual Esala Perahera Festival', 800, 355);
            ctx.font = '27px Georgia';
            ctx.fillText('A celebration of Sri Lankan heritage, faith and tradition', 800, 415);
            ctx.strokeStyle = '#a16b13';
            ctx.beginPath();
            ctx.moveTo(330, 470);
            ctx.lineTo(1270, 470);
            ctx.stroke();
            ctx.fillStyle = '#74440e';
            ctx.font = 'bold 31px Georgia';
            ctx.fillText('31 AUGUST 2026  –  04 SEPTEMBER 2026', 800, 550);
            ctx.font = '27px Georgia';
            ctx.fillText('Ridi Viharaya • Ridigama • Kurunegala • Sri Lanka', 800, 615);
            ctx.font = '25px Georgia';
            ctx.fillText('Dance • Drums • Elephants • Ritual • Living Cultural Heritage', 800, 690);
            ctx.font = 'italic 29px Georgia';
            ctx.fillText('Everyone is warmly invited.', 800, 800);
            ctx.font = '19px Georgia';
            ctx.fillText('Please confirm official dates, times and traffic arrangements with the organizers.', 800, 900);
            const a = document.createElement('a');
            a.download = 'Ridi-Viharaya-2026-Invitation.png';
            a.href = c.toDataURL('image/png');
            a.click();
        };

        // ─── COUNTDOWN ───
        // target: September 04, 2026, 7:15 PM local time
        const targetDate = new Date(2026, 8, 4, 19, 15, 0).getTime();

        function updateCountdown() {
            const now = Date.now();
            let diff = targetDate - now;
            if (diff < 0) diff = 0;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
            document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
            document.getElementById('cdMinutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('cdSeconds').textContent = String(seconds).padStart(2, '0');
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);

        // ─── ICE RAIN CANVAS ───
        const canvas = document.getElementById('iceRainCanvas');
        const ctx2 = canvas.getContext('2d');
        let w, h;

        function resizeCanvas() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles = [];
        const COUNT = 160;

        class IceParticle {
            constructor() { this.reset(true); }
            reset(init) {
                this.x = Math.random() * w;
                this.y = init ? Math.random() * h : -10 - Math.random() * 50;
                this.len = 5 + Math.random() * 14;
                this.speed = 1.8 + Math.random() * 5;
                this.opacity = 0.2 + Math.random() * 0.45;
                this.width = 0.4 + Math.random() * 1.2;
                this.drift = (Math.random() - 0.5) * 0.4;
                this.swing = Math.random() * Math.PI * 2;
                this.swingSpeed = 0.008 + Math.random() * 0.022;
                this.swingAmp = 0.3 + Math.random() * 0.8;
            }
            update() {
                this.y += this.speed;
                this.swing += this.swingSpeed;
                this.x += this.drift + Math.sin(this.swing) * this.swingAmp;
                if (this.y > h + 40 || this.x < -40 || this.x > w + 40) {
                    this.reset(false);
                }
            }
            draw(ctx) {
                const grad = ctx.createLinearGradient(this.x, this.y, this.x + this.drift * 2, this.y + this.len);
                grad.addColorStop(0, `rgba(220, 240, 255, ${this.opacity * 0.2})`);
                grad.addColorStop(0.4, `rgba(190, 225, 255, ${this.opacity * 0.5})`);
                grad.addColorStop(1, `rgba(160, 210, 255, ${this.opacity * 0.1})`);
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x + this.drift * 2, this.y + this.len);
                ctx.strokeStyle = grad;
                ctx.lineWidth = this.width;
                ctx.shadowColor = 'rgba(180, 220, 255, 0.08)';
                ctx.shadowBlur = 6;
                ctx.stroke();
                ctx.shadowBlur = 10;
                ctx.fillStyle = `rgba(220, 240, 255, ${this.opacity * 0.12})`;
                ctx.beginPath();
                ctx.arc(this.x + this.drift * 2, this.y + this.len, 1.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        for (let i = 0; i < COUNT; i++) {
            particles.push(new IceParticle());
        }

        function drawIceRain() {
            ctx2.clearRect(0, 0, w, h);
            const grd = ctx2.createRadialGradient(w / 2, h + 50, 30, w / 2, h + 30, w * 0.7);
            grd.addColorStop(0, 'rgba(160, 210, 255, 0.015)');
            grd.addColorStop(1, 'rgba(160, 210, 255, 0)');
            ctx2.fillStyle = grd;
            ctx2.fillRect(0, 0, w, h);

            for (const p of particles) {
                p.update();
                p.draw(ctx2);
            }
            requestAnimationFrame(drawIceRain);
        }
        drawIceRain();

        // ─── YOUTUBE THUMBNAIL CLICK → load iframe ───
        const ytShell = document.getElementById('ytVideoShell');
        const playOverlay = document.getElementById('playOverlay');
        const thumbImg = ytShell.querySelector('.yt-thumb');
        const ytBadge = ytShell.querySelector('.yt-badge');
        let loaded = false;

        ytShell.addEventListener('click', function(e) {
            if (loaded) return;
            loaded = true;
            const iframe = document.createElement('iframe');
            iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&rel=0';
            iframe.title = 'Grand Randoli Perahera Live';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = '0';
            iframe.loading = 'lazy';
            thumbImg.style.display = 'none';
            playOverlay.style.display = 'none';
            ytBadge.style.display = 'none';
            ytShell.appendChild(iframe);
        });

        // ─── video fallback ───
        const heroVideo = document.querySelector('.hero-video');
        heroVideo.addEventListener('error', () => {
            heroVideo.style.display = 'none';
            const shade = document.querySelector('.hero-shade');
            shade.style.background = 'linear-gradient(135deg, #050403 0%, #1a0e05 50%, #050403 100%)';
        });

        const cinemaVideo = document.querySelector('.cinema-bg');
        cinemaVideo.addEventListener('error', () => {
            cinemaVideo.style.display = 'none';
            const shade = document.querySelector('.cinema-shade');
            shade.style.background = 'linear-gradient(135deg, #050403 0%, #1a0e05 50%, #050403 100%)';
        });
    