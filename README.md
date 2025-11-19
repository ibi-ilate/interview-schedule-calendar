📅 React Interview Scheduling Calendar

A fully interactive interview scheduling application built with React + Vite.
This tool visually maps candidate availability, engineer availability, and highlights overlapping time slots, allowing users to easily schedule interviews with the correct engineer at the right time.

🚀 Features
🔹 Interactive Calendar (Mon–Fri)

Time slots from 09:00–17:30

Auto-generated in 30-minute increments

Click any slot to select it

Visually clean, modern layout

🔹 Engineer Availability

Predefined availability for each engineer

Slots with available engineers are highlighted automatically

🔹 Candidate Availability

Choose a candidate time range from a dropdown

Highlights slots within that candidate’s range

Overlapping “candidate + engineer” slots show a special style

🔹 Smart Matching & Confirmation

App checks:
✔ A candidate is selected
✔ A time slot is selected
✔ The time is valid for both candidate and engineer

Displays the correct assigned engineer

Shows helpful error messages if scheduling is not possible

🔹 Fully Built in React

Uses React hooks (useState, useMemo, useEffect)

Calendar is generated dynamically

No backend required

🖼️ Screenshot (Optional)

Add a screenshot or GIF here to showcase the UI
Example: ![App Screenshot](./screenshot.png)

📁 Project Structure
interview-calendar/
│── public/
│── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│── index.html
│── package.json
│── vite.config.js
│── README.md

🧩 Technologies Used

React 18

Vite (lightning-fast dev server)

JavaScript ES6

CSS3

HTML5

No external UI frameworks required.

🛠️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/interview-calendar.git
cd interview-calendar

2️⃣ Install dependencies
npm install

3️⃣ Start the development server
npm run dev

4️⃣ Open in your browser

Vite will print something like:

http://localhost:5173/


Open that link to view the app.

🎯 How It Works
⏱️ Time Slot Generation

Times are built programmatically:

for (let h = 9; h < 18; h++) {
  times.push(`${String(h).padStart(2, "0")}:00`);
  times.push(`${String(h).padStart(2, "0")}:30`);
}

👩‍💻 Engineer Availability

Defined in:

const engineerAvailability = {
  "Engineer A": ["Mon 09:00", "Tue 14:00", "Wed 10:00"],
  ...
};

👤 Candidate Range Parsing

Selected value like "Tue 14:00-15:30" → converted into minute ranges for comparison.

🎨 Calendar Rendering

Every day × time slot becomes a “slot” component with CSS classes based on availability:

.engineer-available

.candidate-available

.overlap

.selected

📬 Confirmation Logic

Checks all conditions before confirming:

if (overlap) {
  setConfirmation(`Interview confirmed with Candidate X and Engineer Y at Tue 14:00`);
}

🧪 Future Enhancements (Suggested)

Add engineer & candidate management screens

Drag-to-select time ranges

Week navigation (next week, previous week)

Backend integration (Node.js, Firebase, or Supabase)

User authentication

Export/Print interview schedule

📝 License

This project is licensed under the MIT License — you are free to modify and distribute.

💬 Support / Contributions

Found a bug?
Have a feature idea?

👉 Open an issue or submit a pull request — contributions are welcome!