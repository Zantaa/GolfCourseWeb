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

const dateInput = document.querySelector('input[name="date"]');
const timeSelect = document.getElementById("time-select");

dateInput.addEventListener("change", async (e) => {
  const selectedDate = e.target.value;
  if (!selectedDate) return;

  await updateBookedTimes(selectedDate);
});

async function updateBookedTimes(date) {
  try {
    const res = await fetch(`/.netlify/functions/bookings?date=${date}`);
    const data = await res.json();
    const bookedTimes = data.bookedTimes || [];

    // Regenerate tee times so we reset state
    generateTeeTimes();

    // Disable booked time options
    Array.from(timeSelect.options).forEach((option) => {
      if (bookedTimes.includes(option.value)) {
        option.disabled = true;
        option.textContent += " (Booked)";
      }
    });
  } catch (err) {
    console.error("Failed to load booked times:", err);
  }
}
