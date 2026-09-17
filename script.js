// 渣男许健点评墙 - 交互与语音播放脚本
document.addEventListener('DOMContentLoaded', () => {

  // ===== 1. 点击点评卡片播放许健狡辩语音 =====
  let currentAudio = null;
  let activeReview = null;

  function stopCurrentAudio() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    if (activeReview) {
      activeReview.classList.remove('playing');
      const btnText = activeReview.querySelector('.btn-text');
      const statusText = activeReview.querySelector('.rebuttal-status');
      if (btnText) btnText.textContent = '听许健狡辩 🔊';
      if (statusText) statusText.textContent = '▶ 点击卡片收听原声';
      activeReview = null;
    }
  }

  const reviewCards = document.querySelectorAll('.review[data-audio]');
  reviewCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // 允许点击复制文本或选区
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) return;

      const audioSrc = card.getAttribute('data-audio');
      if (!audioSrc) return;

      // 如果点击的是当前正在播放的卡片
      if (activeReview === card && currentAudio) {
        if (!currentAudio.paused) {
          // 正在播则暂停
          currentAudio.pause();
          card.classList.remove('playing');
          const btnText = card.querySelector('.btn-text');
          const statusText = card.querySelector('.rebuttal-status');
          if (btnText) btnText.textContent = '继续播放 ▶';
          if (statusText) statusText.textContent = '⏸ 狡辩暂停中';
          return;
        } else {
          // 暂停中则继续播放
          currentAudio.play().then(() => {
            card.classList.add('playing');
            const btnText = card.querySelector('.btn-text');
            const statusText = card.querySelector('.rebuttal-status');
            if (btnText) btnText.textContent = '狡辩中... 🛑';
            if (statusText) statusText.textContent = '🔊 正在播放狡辩语音...';
          }).catch(err => console.log('音频播放失败:', err));
          return;
        }
      }

      // 点击了新卡片，先停止之前的
      stopCurrentAudio();

      // 创建并播放新音频
      const audio = new Audio(audioSrc);
      currentAudio = audio;
      activeReview = card;

      card.classList.add('playing');
      const btnText = card.querySelector('.btn-text');
      const statusText = card.querySelector('.rebuttal-status');
      if (btnText) btnText.textContent = '加载中... ⏳';
      if (statusText) statusText.textContent = '⏳ 正在加载许健录音...';

      audio.play().then(() => {
        if (btnText) btnText.textContent = '狡辩中... 🛑';
        if (statusText) statusText.textContent = '🔊 许健正慌忙狡辩...';
      }).catch(err => {
        console.log('音频自动播放需要用户交互:', err);
        if (btnText) btnText.textContent = '听许健狡辩 🔊';
        if (statusText) statusText.textContent = '▶ 点击重试';
        card.classList.remove('playing');
      });

      audio.addEventListener('ended', () => {
        card.classList.remove('playing');
        if (btnText) btnText.textContent = '听许健狡辩 🔊';
        if (statusText) statusText.textContent = '✅ 狡辩完毕 (可点击重听)';
        currentAudio = null;
        activeReview = null;
      });

      audio.addEventListener('error', () => {
        card.classList.remove('playing');
        if (btnText) btnText.textContent = '播放失败 ⚠️';
        if (statusText) statusText.textContent = '❌ 录音加载失败';
        currentAudio = null;
        activeReview = null;
      });
    });
  });

  // ===== 2. 投票互动 =====
  const poll = document.getElementById('poll');
  const tip = document.getElementById('poll-tip');

  if (poll) {
    poll.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        // 已投过则不允许重复
        if (poll.querySelector('.voted')) {
          tip.textContent = '你已经投过啦，做人不能太贪心（虽然许健就是🙂）';
          return;
        }
        let votes = parseInt(btn.dataset.votes, 10) || 0;
        votes += 1;
        btn.dataset.votes = votes;
        btn.querySelector('.votes').textContent = votes + ' 票';
        btn.classList.add('voted');
        tip.textContent = '投票成功！感谢你为"反许健避坑事业"贡献一份力量 ✊';
      });
    });
  }

  // ===== 3. 评论卡片渐入动画 =====
  const reviews = document.querySelectorAll('.review');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        });
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  reviews.forEach(r => io.observe(r));

  // ===== 4. 头部装饰表情随机替换 =====
  const deco = document.querySelector('.hero-deco');
  const emojis = ['😤', '🤡', '💔', '🙄', '🤦', '💩', '🚨'];
  if (deco) {
    setInterval(() => {
      const e = emojis[Math.floor(Math.random() * emojis.length)];
      deco.textContent = e + deco.textContent.slice(2);
      deco.textContent = deco.textContent.slice(0, 6);
    }, 3000);
  }

  console.log('%c🚨 渣男许健点评墙就绪', 'font-size:24px;font-weight:bold;color:#ff4757');
  console.log('%c本站所有"网恋对象"及点评内容均为虚构娱乐，请勿对号入座。', 'color:#ffa502');
});
