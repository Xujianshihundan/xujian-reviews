// 许健点评墙 - 交互脚本（纯前端娱乐）
document.addEventListener('DOMContentLoaded', () => {
  // ===== 投票互动 =====
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
        tip.textContent = '投票成功！感谢你为"反许健事业"贡献一份力量 ✊';
      });
    });
  }

  // ===== 评论卡片渐入动画 =====
  const reviews = document.querySelectorAll('.review');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
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
  }, { threshold: 0.1 });

  reviews.forEach(r => io.observe(r));

  // ===== 头部装饰表情随机替换 =====
  const deco = document.querySelector('.hero-deco');
  const emojis = ['😤', '🌫️', '💔', '🙄', '🤦', '💩'];
  if (deco) {
    setInterval(() => {
      const e = emojis[Math.floor(Math.random() * emojis.length)];
      deco.textContent = e + deco.textContent.slice(2);
      deco.textContent = deco.textContent.slice(0, 6);
    }, 3000);
  }

  console.log('%c😤 许健点评墙', 'font-size:24px;font-weight:bold;color:#ff6b6b');
  console.log('%c本站内容纯属虚构恶搞，请勿对号入座。', 'color:#ffd166');
});
