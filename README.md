<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1RlzJz9WX4YAx-pxflWrWvLUWOm0Kwsj0

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`



## prompt 
ยอดเยี่ยมครับ! เพื่อให้ระบบ **"Classroom Quest" (RPG)** ของคุณออกมาสวยงาม ว้าว และมีเอกลักษณ์ตามที่คุณต้องการ ผมได้รวมคำสั่ง **Design & UI Instructions** ชุดใหม่ เข้ากับระบบเกม RPG และเพิ่ม **Logo** กับ **Footer** ให้เรียบร้อยแล้วครับ

นี่คือ **Prompt ฉบับสมบูรณ์ที่สุด** (Copy ไปสั่ง AI ได้เลยครับ):

---

### **Prompt: Classroom Quest RPG (Vivid Edition)**

**Role:** Act as a Senior Frontend Developer & UI/UX Designer specialized in Gamification.
**Task:** Create a **Single Page Application (SPA)** called **"Classroom Quest"** (Classroom Gamification System).
**Tech Stack:** HTML5, CSS3, Vanilla JavaScript (contained in a single `index.html` file).
**Database:** Use `localStorage`.

---

### **1. 🎨 Design & UI Instructions (Strictly Follow)**

**Global Theme:** "Vivid, Playful, and Modern".

* **Color Palette:** Use these specific codes to distinguish sections:
* **Primary/Teal:** `#26A69A`
* **Secondary/Green:** `#AED581`
* **Highlight/Yellow:** `#FFCA28`
* **Action/Orange:** `#FF8A65`
* **Danger/Red:** `#EF5350`


* **Logo:** Display this logo at the top of the Sidebar or Login Card:
* `src="https://img5.pic.in.th/file/secure-sv1/-668e94e3b2fda05e3.png"` (Set width approx 80-100px).


* **Footer:** Add a fixed or sticky footer at the bottom of the page with this text:
* *"Freeman @ Cpoy Right Krukai ฝากแชร์ ฝากติดตามด้วยนะครับ"* (Style it with small, gray text).



**Component Styling:**

* **Color Coding Strategy:** Assign specific colors to **Player Classes** instead of physical tests:
* **Warrior (Red #EF5350):** High HP.
* **Mage (Teal #26A69A):** High Gold Gain.
* **Healer (Green #AED581):** Support/balanced.


* **Gradients:** Use **Linear Gradients** for buttons, card headers, and active menu items to create depth.
* **Cards (Dashboard):** White background with **Soft Drop Shadows** (`box-shadow: 0 10px 30px rgba(0,0,0,0.1)`). On hover, the card should lift up (`transform: translateY(-5px)`).
* **Sidebar Menu:** Modern Sidebar with a glassmorphism effect or clean white. The **Active Tab** must have a **Colorful Gradient Background** with rounded corners (`border-radius: 12px`).
* **Tables:** Use "Striped Rows" with very soft pastel colors derived from the theme. Table Headers should use a **Gradient** background with white text.
* **Badges/Tags:** For status (e.g., "Level Up", "Fainted"), use soft background colors (e.g., Light Red bg with Dark Red text).
* **Visual Effects:**
* **Glassmorphism:** Use `backdrop-filter: blur(10px)` for Modals and Overlays.
* **Icons:** Use large, colorful icons (FontAwesome) inside Dashboard Cards.
* **Animations:** Fade-in effects when switching tabs.



---

### **2. 🏰 Game Mechanics & Logic**

* **Entities:** Students are "Heroes".
* **Stats:** HP (Health), XP (Experience), Gold (Currency), Level.


* **Logic:**
* **XP Full:** Level Up! (Reset XP, Increase Level).
* **HP 0:** Fainted (Cannot earn Gold until healed).



---

### **3. 📱 Functional Modules**

#### **3.1 Login Page**

* **Design:** Split screen or centered card with a **Dynamic Gradient Background** (animating colors).
* **Logo:** Show the logo prominently above the login form.
* **Inputs:** Teacher (`admin`/`start`) vs Student (Enter ID).

#### **3.2 Teacher Dashboard (The Arena)**

* **Overview Cards:** Show Total Students, Total Gold in circulation, Top Level Student.
* **Student Grid (Grid Layout):**
* Display students in **Colorful Cards** arranged in a Grid.
* Each card's header color matches their **Class** (Warrior/Mage/Healer).
* **Visual Bars:** HP (Red), XP (Blue/Teal).
* **Click Action:** Open a "Command Modal" (Glassmorphism style) to:
* **Give XP/Gold:** (Positive behavior).
* **Take Damage:** (Negative behavior).





#### **3.3 Student Dashboard**

* **Profile:** Show their Avatar, Big Level Number, and Stats.
* **Item Shop:** Grid of items to buy with Gold.
* *Items:* "Skip Homework Pass", "Change Seat", etc.



#### **3.4 Leaderboard**

* Styled Table showing Top 5 Players.

---

### **4. 🛠️ Technical Implementation**

* **Single File:** All HTML, CSS, JS in `index.html`.
* **Init Data:** If `localStorage` is empty, generate 6 dummy students with different Classes to demonstrate the Color Coding immediately.

**Deliverable:** The complete, ready-to-run HTML code.

---

### **สิ่งที่ผมปรับปรุงให้ใน Prompt นี้:**

1. **Logo & Footer:** ใส่ลิงก์รูปและข้อความตามที่คุณขอเป๊ะๆ
2. **Color Coding:** ผมประยุกต์คำสั่ง "Physical Test Item" ของคุณ ให้กลายเป็น **"Player Class" (Warrior, Mage, Healer)** แทน เพื่อให้เข้ากับธีมเกม RPG แต่ยังคงใช้ Logic การแยกสีตามประเภทเหมือนเดิม
3. **UI Effects:** ใส่คำสั่ง Glassmorphism, Gradients, และ Animation ให้ปุ่มและเมนูดูเด้งดึ๋ง ทันสมัย
4. **Login Page:** สั่งให้ทำพื้นหลังแบบ Dynamic Gradient ตามที่คุณชอบ

คุณสามารถ Copy ไปสั่ง AI เพื่อสร้างโค้ดได้เลยครับ!
