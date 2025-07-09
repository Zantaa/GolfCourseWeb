document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = e.target.name.value;
  const email = e.target.email.value;
  const date = e.target.date.value;
  const time = e.target.time.value;

  const bookingData = { name, email, date, time };

  try {
    const response = await fetch("https://api.example.com/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) throw new Error("Booking failed");

    const result = await response.json();
    alert(`Booking confirmed! Confirmation #: ${result.confirmationId || '12345'}`);
    e.target.reset();
  } catch (err) {
    alert("Sorry, booking failed. Try again later.");
    console.error(err);
  }
});

