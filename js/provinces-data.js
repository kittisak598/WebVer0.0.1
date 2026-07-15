// ==========================================================
// ข้อมูลจังหวัดทั้งหมดของประเทศไทย แบ่งตามโซนภาค พร้อมพิกัดโดยประมาณ
// ใช้สร้าง <select> แบบไดนามิก และ zoom แผนที่ไปยังจังหวัดที่เลือก
// ==========================================================
const THAI_PROVINCES_BY_ZONE = {
  "กรุงเทพฯ และปริมณฑล": [
    { name: "กรุงเทพมหานคร", lat: 13.7563, lng: 100.5018 },
    { name: "นนทบุรี", lat: 13.8622, lng: 100.5142 },
    { name: "ปทุมธานี", lat: 14.0208, lng: 100.5250 },
    { name: "สมุทรปราการ", lat: 13.5991, lng: 100.5998 },
    { name: "สมุทรสาคร", lat: 13.5475, lng: 100.2740 },
    { name: "นครปฐม", lat: 13.8199, lng: 100.0620 }
  ],
  "ภาคเหนือ": [
    { name: "เชียงใหม่", lat: 18.7883, lng: 98.9853 },
    { name: "เชียงราย", lat: 19.9105, lng: 99.8406 },
    { name: "ลำปาง", lat: 18.2888, lng: 99.4909 },
    { name: "ลำพูน", lat: 18.5745, lng: 99.0088 },
    { name: "แม่ฮ่องสอน", lat: 19.3020, lng: 97.9654 },
    { name: "น่าน", lat: 18.7756, lng: 100.7730 },
    { name: "พะเยา", lat: 19.1664, lng: 99.9019 },
    { name: "แพร่", lat: 18.1445, lng: 100.1405 },
    { name: "อุตรดิตถ์", lat: 17.6200, lng: 100.0993 },
    { name: "ตาก", lat: 16.8839, lng: 99.1258 },
    { name: "สุโขทัย", lat: 17.0068, lng: 99.8265 },
    { name: "พิษณุโลก", lat: 16.8211, lng: 100.2659 },
    { name: "เพชรบูรณ์", lat: 16.4189, lng: 101.1591 },
    { name: "กำแพงเพชร", lat: 16.4827, lng: 99.5226 },
    { name: "พิจิตร", lat: 16.4429, lng: 100.3487 },
    { name: "นครสวรรค์", lat: 15.7030, lng: 100.1367 },
    { name: "อุทัยธานี", lat: 15.3835, lng: 100.0248 }
  ],
  "ภาคตะวันออกเฉียงเหนือ (อีสาน)": [
    { name: "ขอนแก่น", lat: 16.4419, lng: 102.8360 },
    { name: "อุดรธานี", lat: 17.4139, lng: 102.7873 },
    { name: "นครราชสีมา", lat: 14.9799, lng: 102.0977 },
    { name: "อุบลราชธานี", lat: 15.2287, lng: 104.8567 },
    { name: "บุรีรัมย์", lat: 14.9930, lng: 103.1029 },
    { name: "สุรินทร์", lat: 14.8818, lng: 103.4936 },
    { name: "ศรีสะเกษ", lat: 15.1186, lng: 104.3220 },
    { name: "ร้อยเอ็ด", lat: 16.0538, lng: 103.6520 },
    { name: "มหาสารคาม", lat: 16.1850, lng: 103.3001 },
    { name: "กาฬสินธุ์", lat: 16.4315, lng: 103.5060 },
    { name: "ชัยภูมิ", lat: 15.8068, lng: 102.0316 },
    { name: "มุกดาหาร", lat: 16.5450, lng: 104.7241 },
    { name: "ยโสธร", lat: 15.7922, lng: 104.1451 },
    { name: "อำนาจเจริญ", lat: 15.8656, lng: 104.6257 },
    { name: "หนองบัวลำภู", lat: 17.2216, lng: 102.4260 },
    { name: "หนองคาย", lat: 17.8783, lng: 102.7420 },
    { name: "เลย", lat: 17.4860, lng: 101.7223 },
    { name: "สกลนคร", lat: 17.1546, lng: 104.1428 },
    { name: "นครพนม", lat: 17.4088, lng: 104.7793 },
    { name: "บึงกาฬ", lat: 18.3609, lng: 103.6466 }
  ],
  "ภาคกลาง": [
    { name: "พระนครศรีอยุธยา", lat: 14.3532, lng: 100.5689 },
    { name: "สระบุรี", lat: 14.5289, lng: 100.9106 },
    { name: "ลพบุรี", lat: 14.7995, lng: 100.6534 },
    { name: "สิงห์บุรี", lat: 14.8907, lng: 100.3968 },
    { name: "อ่างทอง", lat: 14.5896, lng: 100.4550 },
    { name: "ชัยนาท", lat: 15.1851, lng: 100.1251 },
    { name: "สุพรรณบุรี", lat: 14.4744, lng: 100.1177 },
    { name: "นครนายก", lat: 14.2069, lng: 101.2130 },
    { name: "สมุทรสงคราม", lat: 13.4098, lng: 100.0022 }
  ],
  "ภาคตะวันออก": [
    { name: "ชลบุรี", lat: 13.3611, lng: 100.9847 },
    { name: "ระยอง", lat: 12.6814, lng: 101.2816 },
    { name: "จันทบุรี", lat: 12.6110, lng: 102.1039 },
    { name: "ตราด", lat: 12.2428, lng: 102.5178 },
    { name: "ฉะเชิงเทรา", lat: 13.6904, lng: 101.0779 },
    { name: "ปราจีนบุรี", lat: 14.0509, lng: 101.3730 },
    { name: "สระแก้ว", lat: 13.8244, lng: 102.0645 }
  ],
  "ภาคตะวันตก": [
    { name: "กาญจนบุรี", lat: 14.0022, lng: 99.5328 },
    { name: "ราชบุรี", lat: 13.5364, lng: 99.8172 },
    { name: "เพชรบุรี", lat: 13.1119, lng: 99.9398 },
    { name: "ประจวบคีรีขันธ์", lat: 11.8126, lng: 99.7957 }
  ],
  "ภาคใต้": [
    { name: "ภูเก็ต", lat: 7.8804, lng: 98.3923 },
    { name: "สุราษฎร์ธานี", lat: 9.1382, lng: 99.3215 },
    { name: "สงขลา", lat: 7.1897, lng: 100.5951 },
    { name: "นครศรีธรรมราช", lat: 8.4304, lng: 99.9631 },
    { name: "กระบี่", lat: 8.0863, lng: 98.9063 },
    { name: "พังงา", lat: 8.4509, lng: 98.5298 },
    { name: "ตรัง", lat: 7.5645, lng: 99.6239 },
    { name: "พัทลุง", lat: 7.6167, lng: 100.0742 },
    { name: "ชุมพร", lat: 10.4930, lng: 99.1800 },
    { name: "ระนอง", lat: 9.9528, lng: 98.6085 },
    { name: "สตูล", lat: 6.6238, lng: 100.0674 },
    { name: "ปัตตานี", lat: 6.8692, lng: 101.2500 },
    { name: "ยะลา", lat: 6.5411, lng: 101.2800 },
    { name: "นราธิวาส", lat: 6.4264, lng: 101.8236 }
  ]
};

// รวมทุกจังหวัดเป็น flat array เดียว + หา zone/lat/lng จากชื่อจังหวัดได้ง่ายๆ
const THAI_PROVINCES_FLAT = Object.entries(THAI_PROVINCES_BY_ZONE).flatMap(
  ([zone, provinces]) => provinces.map(p => ({ ...p, zone }))
);

function findProvinceData(provinceName) {
  return THAI_PROVINCES_FLAT.find(p => p.name === provinceName) || null;
}

// สร้าง <option>/<optgroup> ใส่ select ที่มีอยู่แล้วในหน้า HTML
// group=true -> แบ่งเป็น optgroup ตามภาค, group=false -> list เรียงตัวอักษรเดียว
function populateProvinceSelect(selectId, { includeAllOption = false, group = true } = {}) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = '';

  if (includeAllOption) {
    const allOpt = document.createElement('option');
    allOpt.value = 'all';
    allOpt.textContent = '-- แสดงทุกจังหวัดทั่วไทย --';
    select.appendChild(allOpt);
  }

  if (group) {
    Object.entries(THAI_PROVINCES_BY_ZONE).forEach(([zone, provinces]) => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = zone;
      provinces.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.name;
        opt.textContent = p.name;
        optgroup.appendChild(opt);
      });
      select.appendChild(optgroup);
    });
  } else {
    THAI_PROVINCES_FLAT
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, 'th'))
      .forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.name;
        opt.textContent = p.name;
        select.appendChild(opt);
      });
  }
}
