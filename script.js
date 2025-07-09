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
    const hours = current.getHours();
    const minutes = current.getMinutes();
    const value = current.toTimeString().slice(0, 5); // "HH:MM" for submission

    // Format for display: "h:mm AM/PM"
    const ampmHours = hours % 12 || 12;
    const ampm = hours < 12 ? "AM" : "PM";
    const display = `${ampmHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;

    const option = document.createElement("option");
    option.value = value;
    option.textContent = display;
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
document.getElementById("booking-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const name = form.name.value;
  const email = form.email.value;
  const date = form.date.value;
  const time = form.time.value;

  try {
    const res = await fetch("/.netlify/functions/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, date, time })
    });

    const result = await res.json();

    if (!res.ok) {
      if (res.status === 409) {
        alert("That tee time is already booked. Please choose another.");
      } else {
        alert("Booking failed. Please try again later.");
        console.error(result.error);
      }
      return;
    }

    alert(`Booking confirmed! Confirmation #: ${result.confirmationId}`);
    form.reset();
    generateTeeTimes(); // Refresh options
    updateBookedTimes(date); // Re-disable any booked times
  } catch (err) {
    alert("Something went wrong. Try again later.");
    console.error(err);
  }
});

