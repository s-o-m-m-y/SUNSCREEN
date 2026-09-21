import express from 'express';
import axios from 'axios'; 


const app = express();
const port = 3000;
const API_URL = "https://api.openuv.io/api/v1"
const API_KEY = "openuv-3kq2lrmu5ilok5-io";

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index.ejs', {  content1: "--", content2: "--", content3: "--" });
});

app.get('/uv-details', async (req, res) => {
  
 try {
  const { lat, lng } = req.query;
    const response = await axios.get(
      API_URL + "/uv",
      {
        params: {
          "lat": lat,
          "lng": lng
        },
        headers: {
          "x-access-token": API_KEY,
        },
      }
    );
    res.json(response.data);
    console.log(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error fetching UV details');
  } finally {
    console.log("Request completed");
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
