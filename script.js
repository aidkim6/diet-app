let totalCalories = 0;

function addMeal() {
  const foodInput = document.getElementById("food");
  const caloriesInput = document.getElementById("calories");
  const mealList = document.getElementById("mealList");
  const totalDisplay = document.getElementById("total");

  const food = foodInput.value;
  const calories = parseInt(caloriesInput.value);

  if (!food || !calories) {
    alert("음식 이름과 칼로리를 입력하세요!");
    return;
  }

 const li = document.createElement("li"); //음식 하나당 한 줄

const text = document.createElement("span");
text.textContent = `${food} - ${calories} kcal`;

const deleteBtn = document.createElement("button");
deleteBtn.textContent = "❌";

deleteBtn.onclick = function() {
  totalCalories -= calories;
  totalDisplay.textContent = totalCalories;
  li.remove();
};

li.appendChild(text);
li.appendChild(deleteBtn);
mealList.appendChild(li);

  totalCalories += calories;
  totalDisplay.textContent = totalCalories;

  foodInput.value = "";
  caloriesInput.value = "";
}