function generateTeeTimes(start = "07:00", end = "19:00", interval = 10) {
  const select = document.getElementById("time-select");
  select.innerHTML = ""; // Clear existing

  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);

  let current = new Date();
  current.setHours(startHour, startMin, 0);

  const endTime = new Date();
  endTime.setHours(endHour, endMin, 0);

  while (current <= endTime) {
    const timeStr = current.toTimeString().slice(0, 5);
    const option = document.createElement("option");
    option.value = timeStr;
    option.textContent = timeStr;
    select.appendChild(option);
    current.setMinutes(current.getMinutes() + interval);
  }
}
generateTeeTimes();
