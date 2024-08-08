const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.get('/StartienClassified', (req, res) => {
    // Handle the request and send a response
    res.send('Hello, Startien Classified!');
  });


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
