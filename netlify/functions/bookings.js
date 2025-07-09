const bookings = {}; // In-memory store, reset every deployment

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: ''
    };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  const date = new URLSearchParams(event.queryStringParameters).get('date');

  if (event.httpMethod === 'GET') {
    if (!date) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing date parameter' })
      };
    }
    const bookedTimes = bookings[date] || [];
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ bookedTimes })
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const { name, email, date, time } = JSON.parse(event.body);
      if (!name || !email || !date || !time) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing fields' }) };
      }
      if (!bookings[date]) bookings[date] = [];
      if (bookings[date].includes(time)) {
        return { statusCode: 409, headers, body: JSON.stringify({ error: 'Time slot already booked' }) };
      }

      bookings[date].push(time);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Booking confirmed', confirmationId: Date.now() })
      };
    } catch (err) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method Not Allowed' })
  };
};
