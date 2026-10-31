/**
 * ==========================================================================
 * VIDEO.JS - Framer Studio Demo Audio/Video Player & Visualizer
 * ==========================================================================
 */

(() => {
  'use strict';

  /**
   * 1. Cinematic Demo Player: Click to Play / Swap in Video Stream
   */
  function initDemoPlayer() {
    const playBtn = document.querySelector('.js-audio-play');
    const playerStage = document.querySelector('.demo__player-stage');
    const visualizer = document.querySelector('.js-visualizer');
    const voiceButtons = document.querySelectorAll('.js-voice-btn');
    const timeDisplay = document.querySelector('.js-audio-time');

    if (!playBtn || !playerStage) return;

    let isPlaying = false;
    let animationInterval = null;
    let currentSeconds = 0;
    const totalDuration = 135; // 2m 15s

    // Generate 44 Waveform Bars
    if (visualizer) {
      visualizer.innerHTML = '';
      const barCount = 44;
      const bars = [];

      for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('span');
        bar.className = 'demo__waveform-bar';
        const initialHeight = Math.floor(Math.random() * 30) + 15;
        bar.style.height = `${initialHeight}%`;
        visualizer.appendChild(bar);
        bars.push(bar);
      }

      function updateVisualizer() {
        bars.forEach((bar, index) => {
          if (isPlaying) {
            const dynamicHeight = Math.floor(Math.sin(Date.now() / 150 + index * 0.45) * 40) + 50;
            bar.style.height = `${Math.max(12, Math.min(95, dynamicHeight))}%`;
            bar.classList.add('is-active');
          } else {
            bar.classList.remove('is-active');
            bar.style.height = `${Math.floor(Math.random() * 25) + 15}%`;
          }
        });
      }

      function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
      }

      function togglePlayback() {
        isPlaying = !isPlaying;

        if (isPlaying) {
          playBtn.setAttribute('aria-label', 'Pause playback');
          playBtn.innerHTML = `
            <svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect></svg>
          `;

          // Check if video is loaded in playerStage
          let activeVideo = playerStage.querySelector('video');
          if (!activeVideo) {
            const poster = playerStage.querySelector('.demo__player-poster');
            if (poster) poster.style.display = 'none';

            activeVideo = document.createElement('video');
            activeVideo.controls = true;
            activeVideo.autoplay = true;
            activeVideo.playsInline = true;
            activeVideo.style.cssText = 'width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; z-index: 2;';
            activeVideo.innerHTML = `
              <source src="assets/video/demo-sample.mp4" type="video/mp4">
              Your browser does not support the video tag.
            `;
            playerStage.appendChild(activeVideo);

            activeVideo.addEventListener('ended', () => {
              isPlaying = false;
              clearInterval(animationInterval);
              updateVisualizer();
              playBtn.innerHTML = `<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
            });
          } else {
            activeVideo.play();
          }

          animationInterval = setInterval(() => {
            updateVisualizer();
            currentSeconds = (currentSeconds + 1) % totalDuration;
            if (timeDisplay) {
              timeDisplay.textContent = formatTime(currentSeconds);
            }
          }, 200);
        } else {
          playBtn.setAttribute('aria-label', 'Play sample');
          playBtn.innerHTML = `
            <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          `;
          const activeVideo = playerStage.querySelector('video');
          if (activeVideo) activeVideo.pause();

          clearInterval(animationInterval);
          updateVisualizer();
        }
      }

      playBtn.addEventListener('click', togglePlayback);

      // Voice Selector Tabs (Segmented control)
      voiceButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          voiceButtons.forEach((b) => {
            b.classList.remove('is-active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('is-active');
          btn.setAttribute('aria-selected', 'true');

          bars.forEach((bar) => {
            bar.style.height = `${Math.floor(Math.random() * 50) + 20}%`;
          });
        });
      });
    }
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDemoPlayer);
  } else {
    initDemoPlayer();
  }
})();
