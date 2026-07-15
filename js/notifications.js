// ==========================================================
// หน้าการแจ้งเตือน
// ==========================================================
async function loadNotifications() {
  if (!requireLogin()) return;

  const container = document.getElementById('notiContainer');
  container.innerHTML = '<p class="text-muted-sm">กำลังโหลด...</p>';

  try {
    const { data: notifications } = await api.get(`/notifications/${getCurrentUserId()}`);

    if (notifications.length === 0) {
      container.innerHTML = '<p class="text-muted-sm">ยังไม่มีการแจ้งเตือน</p>';
      return;
    }

    container.innerHTML = notifications.map(n => `
      <div class="card-minimal noti-card ${n.is_read ? '' : 'noti-unread'}">
        <i class="fa-solid fa-bell noti-icon"></i>
        <div>
          <p class="noti-message">${escapeHtml(n.message)}</p>
          <span class="text-muted-xs">${formatRelativeTime(n.created_at)}</span>
        </div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<p class="text-muted-sm">โหลดข้อมูลไม่สำเร็จ: ${escapeHtml(err.message)}</p>`;
  }
}

function formatRelativeTime(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'เมื่อสักครู่';
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  return `${Math.floor(hours / 24)} วันที่แล้ว`;
}
