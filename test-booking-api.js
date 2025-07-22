// Simple test to check bookings API
fetch('http://localhost:3000/api/bookings')
  .then(r => r.json())
  .then(data => {
    console.log('Bookings API Response:');
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(err => {
    console.error('Error:', err);
  });