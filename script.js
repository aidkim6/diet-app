// ---------------------- HTML 요소 선택 ----------------------
const dateInput = document.getElementById("dateInput");   // 날짜 입력
const nameInput = document.getElementById("nameInput");   // 음식 이름 입력
const calInput = document.getElementById("calInput");     // 칼로리 입력
const addBtn = document.getElementById("addBtn");         // 추가 버튼
const list = document.getElementById("list");            // 식단 리스트 ul
const totalCalories = document.getElementById("totalCalories"); // 총 칼로리 표시
const calendar = document.getElementById("calendar");    // 달력 테이블

// ---------------------- localStorage 불러오기 ----------------------
let dietData = JSON.parse(localStorage.getItem("dietData")) || {}; 
// 저장된 식단이 있으면 불러오고, 없으면 빈 객체 생성

// ---------------------- 리스트 렌더링 ----------------------
function renderList(date) {
  list.innerHTML = ""; // 기존 리스트 초기화
  let total = 0;       // 총 칼로리 초기화

  if (dietData[date]) {
    dietData[date].forEach((item, index) => {
      total += item.calories; // 총 칼로리 계산

      const li = document.createElement("li");
      li.textContent = `${item.name} - ${item.calories} kcal `;

      // ---------------------- 삭제 버튼 ----------------------
      const delBtn = document.createElement("button");
      delBtn.textContent = "x";
      delBtn.addEventListener("click", () => {
        dietData[date].splice(index, 1); // 배열에서 제거
        localStorage.setItem("dietData", JSON.stringify(dietData)); // localStorage 갱신
        renderList(date);  // 리스트 갱신
        renderCalendar(currentYear, currentMonth); // 달력 갱신
      });

      li.appendChild(delBtn);
      list.appendChild(li);
    });
  }

  totalCalories.textContent = total; // 총 칼로리 업데이트
}

// ---------------------- 추가 버튼 클릭 ----------------------
addBtn.addEventListener("click", () => {
  const date = dateInput.value;          // 선택한 날짜
  const name = nameInput.value.trim();   // 음식 이름
  const cal = parseInt(calInput.value);  // 칼로리 숫자 변환

  // 입력 검사
  if (!name || isNaN(cal)) return alert("이름과 칼로리를 정확히 입력해주세요!");

  if (!dietData[date]) dietData[date] = [];       // 해당 날짜 배열 없으면 생성
  dietData[date].push({ name, calories: cal });   // 데이터 추가
  localStorage.setItem("dietData", JSON.stringify(dietData)); // 저장

  renderList(date);            // 리스트 갱신
  renderCalendar(currentYear, currentMonth); // 달력 갱신

  nameInput.value = "";        // 입력 초기화
  calInput.value = "";
});

// ---------------------- 날짜 선택 변경 시 ----------------------
dateInput.addEventListener("change", () => {
  renderList(dateInput.value); // 선택한 날짜의 리스트 렌더링
});

// ---------------------- 달력 기능 ----------------------
let today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();

// 달력 렌더링 함수
function renderCalendar(year, month) {
  calendar.innerHTML = ""; // 기존 달력 초기화

  const firstDay = new Date(year, month, 1).getDay();    // 달의 첫날 요일
  const lastDate = new Date(year, month + 1, 0).getDate(); // 달의 마지막 날짜

  // ---------------------- 요일 헤더 ----------------------
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

  // ---------------------- 날짜 채우기 ----------------------
  let tbody = document.createElement("tbody");
  tr = document.createElement("tr");

  // 달력 첫 줄 공백
  for (let i = 0; i < firstDay; i++) tr.appendChild(document.createElement("td"));

  for (let date = 1; date <= lastDate; date++) {
    let td = document.createElement("td");
    const fullDate = `${year}-${String(month+1).padStart(2,'0')}-${String(date).padStart(2,'0')}`;
    td.textContent = date;

    // 데이터 있는 날짜 표시
    if (dietData[fullDate] && dietData[fullDate].length > 0) {
      td.classList.add("hasData"); // 스타일 적용 (초록색)
      td.title = "식단 있음";

      td.addEventListener("click", () => {
        dateInput.value = fullDate;  // 날짜 선택
        renderList(fullDate);        // 리스트 렌더링
      });
    }

    tr.appendChild(td);

    // 7일마다 줄 바꿈
    if ((date + firstDay) % 7 === 0) {
      tbody.appendChild(tr);
      tr = document.createElement("tr");
    }
  }

  // 마지막 줄 추가
  tbody.appendChild(tr);
  calendar.appendChild(tbody);
}

// ---------------------- 페이지 로드 시 초기화 ----------------------
window.addEventListener("load", () => {
  if (!dateInput.value) dateInput.valueAsDate = today; // 오늘 날짜 설정
  renderList(dateInput.value);           // 리스트 렌더링
  renderCalendar(currentYear, currentMonth); // 달력 렌더링
});
