// ---------------------- HTML 요소 선택 ----------------------
const dateInput = document.getElementById("dateInput");
const nameInput = document.getElementById("nameInput");
const calInput = document.getElementById("calInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");
const totalCalories = document.getElementById("totalCalories");
const calendar = document.getElementById("calendar");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const monthTitle = document.getElementById("monthTitle");
// BMI 요소
const heightInput = document.getElementById("heightInput");
const weightInput = document.getElementById("weightInput");
const bmiBtn = document.getElementById("bmiBtn");
const bmiResult = document.getElementById("bmiResult");

// ---------------------- localStorage ----------------------
let dietData = JSON.parse(localStorage.getItem("dietData")) || {};

// ---------------------- 리스트 렌더링 ----------------------
function renderList(date) {
  list.innerHTML = "";
  let total = 0;

  if (dietData[date]) {
    dietData[date].forEach((item, index) => {
      total += item.calories;

      const li = document.createElement("li");
      li.textContent = `${item.name} - ${item.calories} kcal `;

      const delBtn = document.createElement("button");
      delBtn.textContent = "x";
      delBtn.addEventListener("click", () => {
        dietData[date].splice(index, 1);
        localStorage.setItem("dietData", JSON.stringify(dietData));
        renderList(date);
        renderCalendar(currentYear, currentMonth);
      });

      li.appendChild(delBtn);
      list.appendChild(li);
    });
  }

  totalCalories.textContent = total;
}

// ---------------------- 추가 버튼 ----------------------
addBtn.addEventListener("click", () => {
  const date = dateInput.value;
  const name = nameInput.value.trim();
  const cal = parseInt(calInput.value);

  if (!name || isNaN(cal)) return alert("이름과 칼로리를 정확히 입력해주세요!");

  if (!dietData[date]) dietData[date] = [];
  dietData[date].push({ name, calories: cal });

  localStorage.setItem("dietData", JSON.stringify(dietData));

  renderList(date);
  renderCalendar(currentYear, currentMonth);

  nameInput.value = "";
  calInput.value = "";
});

// ---------------------- 날짜 변경 ----------------------
dateInput.addEventListener("change", () => {
  renderList(dateInput.value);
});

// ---------------------- 달력 ----------------------
let today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();

function renderCalendar(year, month) {
  calendar.innerHTML = "";

  monthTitle.textContent = `${year}년 ${month + 1}월`;


  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const days = ["일","월","화","수","목","금","토"];
  let thead = document.createElement("thead");
  let tr = document.createElement("tr");

  days.forEach(d => {
    let th = document.createElement("th");
    th.textContent = d;
    tr.appendChild(th);
  });

  thead.appendChild(tr);
  calendar.appendChild(thead);

  let tbody = document.createElement("tbody");
  tr = document.createElement("tr");

  for (let i = 0; i < firstDay; i++) {
    tr.appendChild(document.createElement("td"));
  }

  for (let date = 1; date <= lastDate; date++) {
    let td = document.createElement("td");
    const fullDate = `${year}-${String(month+1).padStart(2,'0')}-${String(date).padStart(2,'0')}`;
    td.textContent = date;

    if (dietData[fullDate] && dietData[fullDate].length > 0) {
      td.classList.add("hasData");
      td.addEventListener("click", () => {
        dateInput.value = fullDate;
        renderList(fullDate);
      });
    }

    tr.appendChild(td);

    if ((date + firstDay) % 7 === 0) {
      tbody.appendChild(tr);
      tr = document.createElement("tr");
    }
  }

  tbody.appendChild(tr);
  calendar.appendChild(tbody);
}

// ---------------------- BMI 계산 ----------------------
bmiBtn.addEventListener("click", () => {
  const height = parseFloat(heightInput.value) / 100;
  const weight = parseFloat(weightInput.value);

  if (!height || !weight) {
    return alert("키와 몸무게를 입력해주세요!");
  }

  const bmi = (weight / (height * height)).toFixed(1);

  let status = "";
  if (bmi < 18.5) status = "저체중";
  else if (bmi < 23) status = "정상";
  else if (bmi < 25) status = "과체중";
  else status = "비만";

  bmiResult.textContent = `BMI: ${bmi} (${status})`;
});

//---------------------달 이동 버튼-----------------
prevMonth.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentYear, currentMonth);
});

nextMonth.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentYear, currentMonth);
});


// ---------------------- 초기 실행 ----------------------
window.addEventListener("load", () => {
  dateInput.valueAsDate = today;
  renderList(dateInput.value);
  renderCalendar(currentYear, currentMonth);
});
