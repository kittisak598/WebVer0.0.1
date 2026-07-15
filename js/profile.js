// ==========================================================
// หน้าโปรไฟล์ผู้ใช้ - โหลด/บันทึกข้อมูลลง SQL ผ่าน API
// ==========================================================
async function loadProfile() {
  if (!requireLogin()) return;

  const userId = getCurrentUserId();
  document.getElementById('user_id').value = userId;

  try {
    const { data: user } = await api.get(`/users/${userId}`);
    document.getElementById('first_name').value = user.first_name || '';
    document.getElementById('last_name').value = user.last_name || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('province').value = user.province || '';
    document.getElementById('region_zone').value = user.region_zone || 'north';
    document.getElementById('address_detail').value = user.address_detail || '';

    const statusEl = document.getElementById('profileStatus');
    if (user.face_id_verified) {
      statusEl.textContent = '✓ Face ID Verified';
      statusEl.style.background = 'rgba(74, 222, 128, 0.15)';
      statusEl.style.color = '#16A34A';
    } else {
      statusEl.textContent = 'ยังไม่ได้ยืนยัน Face ID';
      statusEl.style.background = 'rgba(239, 68, 68, 0.12)';
      statusEl.style.color = '#DC2626';
    }
  } catch (err) {
    console.error('โหลดโปรไฟล์ไม่สำเร็จ:', err.message);
  }
}

async function saveUserProfile(e) {
  e.preventDefault();
  if (!requireLogin()) return;

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  const userId = document.getElementById('user_id').value;
  const userData = {
    first_name: document.getElementById('first_name').value,
    last_name: document.getElementById('last_name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    province: document.getElementById('province').value,
    region_zone: document.getElementById('region_zone').value,
    address_detail: document.getElementById('address_detail').value
  };

  try {
    await api.put(`/users/${userId}`, userData);
    alert('✓ บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว!');
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการเชื่อมต่อ:', error);
    alert('ไม่สามารถบันทึกข้อมูลได้: ' + error.message);
  } finally {
    submitBtn.disabled = false;
  }
}
