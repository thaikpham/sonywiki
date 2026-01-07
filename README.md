# 📦 Sony Wiki Platform v2.0 - Community Edition

Nền tảng Wiki và Đào tạo sản phẩm chuyên dụng dành cho đội ngũ Trainer và Fan cứng (PG/PB) của Sony Electronics Vietnam. Tích hợp AI để tối ưu hóa kịch bản bán hàng và hệ thống Gamification để thúc đẩy thi đua.

## 🚀 Tính năng chính

- **Dashboard Mobile-First**: Giao diện tối ưu cho thiết bị di động.
- **Sony AI Hub**: Sử dụng Google Gemini 2.5 Flash để tạo Sales Talk và Quiz.
- **Notion Integration**: Kết nối tài liệu chuyên sâu.
- **Weekly Leaderboard**: Bảng xếp hạng thi đua.
- **Fan Profile & Achievements**: Lưu trữ thành tựu và đóng góp.
- **Cloud Persistence**: Đồng bộ dữ liệu Firebase.

## 🛠 Công nghệ sử dụng

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons.
- **Backend**: Firebase (Firestore & Auth).
- **AI**: Google Gemini API.
- **CI/CD**: GitHub Actions & Vercel.

## ⚙️ Thiết lập CI/CD (Auto Deploy to Vercel)

Để kích hoạt tính năng tự động Deploy, bạn cần cấu hình GitHub Secrets trong mục **Settings > Secrets and variables > Actions** của repository:

1. `VERCEL_TOKEN`: Lấy tại Vercel Account Settings.
2. `VERCEL_ORG_ID`: Lấy trong file `.vercel/project.json` sau khi chạy lệnh `vercel link` ở local.
3. `VERCEL_PROJECT_ID`: Lấy trong file `.vercel/project.json`.

Ngoài ra, cần cấu hình Environment Variables cho ứng dụng trong Vercel Project Settings:

- `VITE_FIREBASE_CONFIG`: JSON string cấu hình Firebase.
- `VITE_APP_ID`: ID ứng dụng (mặc định 'sony-wiki-default').
- `VITE_GEMINI_API_KEY`: API Key của Google Gemini.

## 📦 Cài đặt Local

1. Clone repo:
   ```bash
   git clone <repo-url>
   cd sony-wiki
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup Environment Variables:
   Tạo file `.env.local` và thêm các biến môi trường cần thiết (xem `.env.example`).

4. Run dev server:
   ```bash
   npm run dev
   ```
