/* ==========================================
   CHERRY BLOSSOM & PARTICLES ENGINE
   ========================================== */
const canvas = document.getElementById('petal-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

// Particle configuration
const maxParticles = 65;
const particles = [];
let mouse = { x: -1000, y: -1000, radius: 150 };
let currentTheme = 'sakura'; // 'sakura' or 'romance'

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

class Petal {
    constructor() {
        this.reset();
        this.y = Math.random() * height; // Start at random height initially
    }

    reset() {
        this.x = Math.random() * width;
        // Rising sparkles start at the bottom; falling particles start at the top
        if (currentTheme === 'fairy') {
            this.y = height + 10 + Math.random() * 50;
        } else {
            this.y = -20 - Math.random() * 50;
        }
        this.angle = Math.random() * 360;
        this.opacity = Math.random() * 0.4 + 0.5;

        // Determine particle type based on current active page/theme
        if (currentTheme === 'sakura') {
            this.type = 'petal';
            this.size = Math.random() * 12 + 6;
            this.speedX = Math.random() * 1.5 - 0.5;
            this.speedY = Math.random() * 1.2 + 0.8;
            this.spin = Math.random() * 1.5 - 0.75;
        } else if (currentTheme === 'romance') {
            // Page 2: Romance theme (Only Hearts falling)
            this.type = 'heart';
            this.size = Math.random() * 12 + 6;
            this.speedX = Math.random() * 1.2 - 0.6;
            this.speedY = Math.random() * 1.0 + 0.7;
            this.spin = Math.random() * 2 - 1;
        } else {
            // Page 3: Cozy Starry Sunset theme (Fairy Lights rising)
            this.type = 'sparkle';
            this.size = Math.random() * 8 + 4;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.speedY = Math.random() * -0.6 - 0.4; // Rise slowly
            this.spin = Math.random() * 1.0 - 0.5;
        }
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.angle * Math.PI / 180) * 0.2;
        this.angle += this.spin;

        // Interaction with mouse wind
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 5;
            this.y += Math.sin(angle) * force * 3;
        }

        // Reset if out of bounds
        const margin = 30;
        if (currentTheme === 'fairy') {
            if (this.y < -margin || this.x < -margin || this.x > width + margin) {
                this.reset();
            }
        } else {
            if (this.y > height + margin || this.x < -margin || this.x > width + margin) {
                this.reset();
            }
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.globalAlpha = this.opacity;

        if (this.type === 'petal') {
            // Draw cherry blossom petal
            ctx.fillStyle = 'rgba(255, 183, 195, 0.95)';
            ctx.strokeStyle = 'rgba(255, 140, 160, 0.4)';
            ctx.lineWidth = 1;
            
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Petal indent/cut
            ctx.fillStyle = 'rgba(255, 140, 160, 0.8)';
            ctx.beginPath();
            ctx.moveTo(this.size, 0);
            ctx.lineTo(this.size - 3, -1);
            ctx.lineTo(this.size - 3, 1);
            ctx.closePath();
            ctx.fill();
        } else if (this.type === 'heart') {
            ctx.fillStyle = 'rgba(255, 77, 109, 0.85)';
            ctx.beginPath();
            const size = this.size * 0.7;
            ctx.moveTo(0, size / 4);
            ctx.quadraticCurveTo(size / 2, -size / 2, size, size / 4);
            ctx.quadraticCurveTo(size, size, 0, size * 1.5);
            ctx.quadraticCurveTo(-size, size, -size, size / 4);
            ctx.quadraticCurveTo(-size / 2, -size / 2, 0, size / 4);
            ctx.closePath();
            ctx.fill();
        } else if (this.type === 'sparkle') {
            // Draw warm amber fairy light
            ctx.fillStyle = 'rgba(255, 200, 80, 0.85)';
            ctx.shadowColor = 'rgba(255, 180, 50, 0.8)';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

// Sparkle/Confetti Effect for opening the letter
class Confetti {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 4;
        this.speedX = Math.random() * 12 - 6;
        this.speedY = Math.random() * -12 - 5;
        this.gravity = 0.4;
        this.color = `hsl(${Math.random() * 30 + 340}, 100%, ${Math.random() * 20 + 60}%)`;
        this.opacity = 1;
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 10 - 5;
    }

    update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.spin;
        this.opacity -= 0.015;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // Draw little diamonds or squares
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.restore();
    }
}

const confettiList = [];

function triggerConfetti(x, y) {
    for (let i = 0; i < 80; i++) {
        confettiList.push(new Confetti(x, y));
    }
}

// Populate standard falling particles
for (let i = 0; i < maxParticles; i++) {
    particles.push(new Petal());
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw standard falling background particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Update & draw dynamic letter confetti
    for (let i = confettiList.length - 1; i >= 0; i--) {
        const c = confettiList[i];
        c.update();
        c.draw();
        if (c.opacity <= 0) {
            confettiList.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

// Start particle animation loop
animate();


/* ==========================================
   AUDIO & VOLUME FADE MANAGER
   ========================================== */
const song1 = document.getElementById('audio-page1');
const song2 = document.getElementById('audio-page2');
const muteBtn = document.getElementById('mute-btn');
const nowPlaying = document.getElementById('now-playing');
const musicController = document.getElementById('music-controller');

let isMuted = false;
let currentSong = song1;

function playSong(song) {
    currentSong = song;
    song.volume = 0;
    
    // Play with error safety (browsers block immediate play)
    const playPromise = song.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            if (!isMuted) {
                fadeIn(song);
            }
        }).catch(error => {
            console.log("Audio play blocked initially: ", error);
        });
    }
}

function fadeIn(audio, duration = 1500) {
    audio.volume = 0;
    const interval = 50;
    const step = interval / duration;
    const targetVolume = 0.6; // Soft, premium background level

    const fade = setInterval(() => {
        if (isMuted) {
            audio.volume = 0;
            clearInterval(fade);
            return;
        }
        if (audio.volume < targetVolume) {
            audio.volume = Math.min(targetVolume, audio.volume + step);
        } else {
            clearInterval(fade);
        }
    }, interval);
}

function fadeOut(audio, duration = 1500, callback) {
    const interval = 50;
    const step = interval / duration;

    const fade = setInterval(() => {
        if (audio.volume > 0.05) {
            audio.volume = Math.max(0, audio.volume - step);
        } else {
            audio.volume = 0;
            audio.pause();
            clearInterval(fade);
            if (callback) callback();
        }
    }, interval);
}

// Mute button handler
muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted) {
        currentSong.volume = 0;
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        nowPlaying.textContent = "Music Muted";
    } else {
        fadeIn(currentSong, 800);
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        updateMusicLabel();
    }
});

function updateMusicLabel() {
    if (currentSong === song1) {
        nowPlaying.textContent = "Playing: Sweet Romance 🌸";
    } else {
        nowPlaying.textContent = "Playing: Eternal Love 💖";
    }
}


/* ==========================================
   NAVIGATION & TRANSITIONS
   ========================================== */
const introScreen = document.getElementById('intro-screen');
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const page3 = document.getElementById('page3');

const btnUnlock = document.getElementById('btn-unlock');
const btnToPage2 = document.getElementById('btn-to-page2');
const btnToPage1 = document.getElementById('btn-to-page1');
const btnToPage3 = document.getElementById('btn-to-page3');

const btnPage3ToPage2 = document.getElementById('btn-page3-to-page2');
const btnPage3ToPage1 = document.getElementById('btn-page3-to-page1');

// Unlock the site
btnUnlock.addEventListener('click', () => {
    introScreen.style.opacity = '0';
    introScreen.style.transform = 'scale(1.05)';
    
    // Play sound 1
    playSong(song1);
    updateMusicLabel();
    
    setTimeout(() => {
        introScreen.classList.remove('active-screen');
        introScreen.classList.add('hidden-screen');
        
        page1.classList.remove('hidden-screen');
        page1.classList.add('active-screen');
        
        musicController.classList.remove('hidden');
    }, 1200);
});

// Navigate Page 1 -> Page 2
btnToPage2.addEventListener('click', () => {
    currentTheme = 'romance';
    particles.forEach(p => p.reset()); // Reset particles to transition theme immediately
    
    // Fade out page 1
    page1.classList.remove('active-screen');
    page1.classList.add('hidden-screen');
    
    // Audio Cross-fade
    fadeOut(song1, 1500, () => {
        if (!isMuted) {
            playSong(song2);
            updateMusicLabel();
        } else {
            currentSong = song2;
        }
    });

    // Fade in page 2 after short delay
    setTimeout(() => {
        page2.classList.remove('hidden-screen');
        page2.classList.add('active-screen');
    }, 500);
});

// Navigate Page 2 -> Page 1
btnToPage1.addEventListener('click', () => {
    currentTheme = 'sakura';
    particles.forEach(p => p.reset()); // Reset particles to transition theme immediately
    
    // Fade out page 2
    page2.classList.remove('active-screen');
    page2.classList.add('hidden-screen');
    
    // Audio Cross-fade
    fadeOut(song2, 1500, () => {
        if (!isMuted) {
            playSong(song1);
            updateMusicLabel();
        } else {
            currentSong = song1;
        }
    });

    // Fade in page 1 after short delay
    setTimeout(() => {
        page1.classList.remove('hidden-screen');
        page1.classList.add('active-screen');
    }, 500);
});

// Navigate Page 2 -> Page 3
btnToPage3.addEventListener('click', () => {
    currentTheme = 'fairy';
    particles.forEach(p => p.reset()); // Reset particles to transition theme immediately
    
    // Fade out page 2
    page2.classList.remove('active-screen');
    page2.classList.add('hidden-screen');
    
    // Song 2 continues playing, update music label
    if (!isMuted) {
        updateMusicLabel();
    }

    // Fade in page 3 after short delay
    setTimeout(() => {
        page3.classList.remove('hidden-screen');
        page3.classList.add('active-screen');
    }, 500);
});

// Navigate Page 3 -> Page 2
btnPage3ToPage2.addEventListener('click', () => {
    currentTheme = 'romance';
    particles.forEach(p => p.reset()); // Reset particles to transition theme immediately
    
    // Fade out page 3
    page3.classList.remove('active-screen');
    page3.classList.add('hidden-screen');
    
    // Song 2 continues playing
    if (!isMuted) {
        updateMusicLabel();
    }

    // Fade in page 2 after short delay
    setTimeout(() => {
        page2.classList.remove('hidden-screen');
        page2.classList.add('active-screen');
    }, 500);
});

// Navigate Page 3 -> Page 1 (Restart)
btnPage3ToPage1.addEventListener('click', () => {
    currentTheme = 'sakura';
    particles.forEach(p => p.reset()); // Reset particles to transition theme immediately
    
    // Fade out page 3
    page3.classList.remove('active-screen');
    page3.classList.add('hidden-screen');
    
    // Audio Cross-fade back to Song 1
    fadeOut(song2, 1500, () => {
        if (!isMuted) {
            playSong(song1);
            updateMusicLabel();
        } else {
            currentSong = song1;
        }
    });

    // Fade in page 1 after short delay
    setTimeout(() => {
        page1.classList.remove('hidden-screen');
        page1.classList.add('active-screen');
    }, 500);
});


/* ==========================================
   SECRET LETTER INTERACTIVE POPUP
   ========================================== */
const envelopeTrigger = document.getElementById('envelope-trigger');
const letterModal = document.getElementById('letter-modal');
const btnCloseLetter = document.getElementById('btn-close-letter');

envelopeTrigger.addEventListener('click', (e) => {
    // Get mouse position for explosion source
    const rect = envelopeTrigger.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Trigger sparkle/confetti explosion
    triggerConfetti(x, y);

    // Show the modal
    setTimeout(() => {
        letterModal.classList.remove('hidden');
    }, 400);
});

btnCloseLetter.addEventListener('click', () => {
    letterModal.classList.add('hidden');
});

// Close modal when clicking outside content
letterModal.addEventListener('click', (e) => {
    if (e.target === letterModal) {
        letterModal.classList.add('hidden');
    }
});
