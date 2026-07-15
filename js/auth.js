// ==========================================================
// เข้าสู่ระบบ / สมัครสมาชิก (Email หรือ Username + รหัสผ่าน)
// และ Face ID (จำลอง WebAuthn) สำหรับ Demo วิชา Deep Learning
// ==========================================================

function switchAuthTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('loginForm').style.display = isLogin ? 'block' : 'none';
  document.getElementById('registerForm').style.display = isLogin ? 'none' : 'block';
  document.getElementById('authTabLogin').classList.toggle('active', isLogin);
  document.getElementById('authTabRegister').classList.toggle('active', !isLogin);
}

function saveSession(user) {
  localStorage.setItem('current_user_id', user.id);
  if (user.token) localStorage.setItem('auth_token', user.token);
  updateAuthNavUI();
}

function logout() {
  localStorage.removeItem('current_user_id');
  localStorage.removeItem('auth_token');
  updateAuthNavUI();
  switchTab('auth');
}

// ปรับปุ่ม "เข้าสู่ระบบ" บนแถบเมนูบนให้เปลี่ยนเป็นชื่อ/โปรไฟล์เมื่อ login แล้ว
function updateAuthNavUI() {
  const nav = document.getElementById('nav-auth');
  if (!nav) return;
  const loggedIn = isLoggedIn();
  nav.innerHTML = loggedIn
    ? '<i class="fa-solid fa-circle-user"></i> โปรไฟล์ของฉัน (ออกจากระบบ)'
    : '<i class="fa-solid fa-user"></i> เข้าสู่ระบบ / สมัครสมาชิก';
  nav.onclick = () => {
    if (loggedIn) {
      if (confirm('ต้องการออกจากระบบหรือไม่?')) {
        logout();
      } else {
        switchTab('profile');
      }
    } else {
      switchTab('auth');
    }
  };
}

async function handleLogin(e) {
  e.preventDefault();
  const errEl = document.getElementById('loginError');
  errEl.textContent = '';
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;

  try {
    const { data } = await api.post('/auth/login', {
      identifier: document.getElementById('loginIdentifier').value.trim(),
      password: document.getElementById('loginPassword').value
    });
    saveSession(data);
    switchTab('profile');
  } catch (err) {
    errEl.textContent = err.message;
  } finally {
    btn.disabled = false;
  }
}

async function handleRegister(e) {
    e.preventDefault();

    console.log("กดปุ่มสมัครสมาชิก");

    const errEl = document.getElementById("registerError");
    errEl.textContent = "";

    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;

    const user = {
        first_name: document.getElementById("regFirstName").value.trim(),
        last_name: document.getElementById("regLastName").value.trim(),
        username: document.getElementById("regUsername").value.trim(),
        email: document.getElementById("regEmail").value.trim(),
        password: document.getElementById("regPassword").value
    };

    console.log("ข้อมูลที่จะส่ง =", user);

    try {

        console.log("กำลังเรียก API...");

        const response = await api.post("/auth/register", user);

        console.log("API ตอบกลับ =", response);

        if (response.data) {
            saveSession(response.data);
        }

        alert("สมัครสมาชิกสำเร็จ");

        switchTab("profile");

    } catch (err) {

        console.error("Register Error =", err);

        errEl.textContent = err.message;

    } finally {

        btn.disabled = false;

    }
}

// ---------- Face ID (จำลอง WebAuthn) สำหรับ Demo วิชา Deep Learning ----------
// หมายเหตุ: ยังคงไว้ตามที่ขอ เพราะต้องใช้ส่งงานวิชา Deep Learning
// ตอนนี้แยกออกมาเป็นหน้าต่างหาก (view-faceid) ไม่ปนกับการ login จริงแล้ว
async function handleFaceScan(event) {
  if (!requireLogin()) return;

  const btn = event.target.closest('button');
  btn.disabled = true;
  btn.innerText = 'กำลังเชื่อมต่อระบบสแกน...';

  const userId = getCurrentUserId();

  const finishLogin = async () => {
    try {
      await api.patch(`/users/${userId}/verify-face`);
    } catch (err) {
      console.error('บันทึกสถานะ Face ID ไม่สำเร็จ:', err.message);
    }
    switchTab('profile');
    btn.disabled = false;
    btn.innerText = 'สแกนใบหน้าเข้าสู่ระบบ';
  };

  // ตรวจสอบว่าเบราว์เซอร์รองรับ Biometric / Face ID หรือไม่
  if (window.PublicKeyCredential && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) {
    try {
      alert('กรุณายืนยันตัวตนด้วย Face ID / Touch ID บนอุปกรณ์ของคุณ');

      /* ในระบบจริง: ตรงนี้จะต้องไปดึง 'challenge' ค่าสุ่มจาก Backend Server ก่อน
         แล้วเรียก navigator.credentials.get({ publicKey: { challenge, ... } })
         จากนั้นส่ง credential ที่ได้ไปตรวจสอบกับ Backend อีกที (WebAuthn flow เต็มรูปแบบ) */

      alert('✓ ยืนยันตัวตนด้วย Face ID เรียบร้อยแล้ว!');
      await finishLogin();
    } catch (err) {
      console.error(err);
      alert('การสแกนถูกยกเลิก หรือเกิดข้อผิดพลาด: ' + err.message);
      btn.disabled = false;
      btn.innerText = 'สแกนใบหน้าเข้าสู่ระบบ';
    }
  } else {
    alert('อุปกรณ์หรือเบราว์เซอร์นี้ไม่รองรับการสแกน Face ID / Touch ID ผ่าน Web (ระบบจะบันทึกสถานะยืนยันให้เลยสำหรับทดสอบ)');
    await finishLogin();
  }
}
