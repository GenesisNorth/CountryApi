const express = require('express');
const fs = require('fs/promises'); // Using fs.promises for asynchronous file reading
const app = express();

async function readJsonFile(filename) {
  const content = await fs.readFile(filename, 'utf-8');
  return JSON.parse(content);
}

// API endpoint to get all countries
app.get('/countries', async (req, res) => {
  try {
    const countriesData = await readJsonFile('completedata.json');
    const countries = countriesData.map(country => ({ name: country.name }));
    res.json(countries);
    console.log(countries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to get states of a specific country
app.get('/countries/:countryName/states', async (req, res) => {
  const countryName = req.params.countryName;

  try {
    const countriesData = await readJsonFile('completedata.json');
    const country = countriesData.find(country => country.name === countryName);

    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    const states = country.states.map(state => ({ name: state.name }));
    res.json(states);
  } catch (error) {
    console.error(error);
    // console.log(country);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to get cities of a specific country
app.get('/countries/:countryName/:states/cities', async (req, res) => {
  const countryName = req.params.countryName;

  try {
    const countriesData = await readJsonFile('completedata.json');
    const country = countriesData.find(country => country.name === countryName);

    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    const cities = country.states.flatMap(state => state.cities.map(city => ({ name: city.name })));
    // const cities = country.states.cities.map(cities => ({ name: state.name.cities.name }));
    // const citiesData = await readJsonFile('completedata.json');
    // const cities = citiesData


    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
