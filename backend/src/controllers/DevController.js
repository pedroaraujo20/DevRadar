const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();
    return res.json(devs);
  },

  async store (req, res) {
    const { github_username, techs, latitude, longitude } = req.body;
  
    const devExists = await Dev.findOne({ github_username });

    if (devExists) {
      return res.status(401).json({ error: 'Usuário ja existe' });
    }

    const response = await axios.get(`https://api.github.com/users/${github_username}`);
  
    console.log(response.data);
  
    const { name = login, avatar_url, bio } = response.data;
  
    const techsArray = parseStringAsArray(techs);
  
    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    }
  
    console.log(location);
  
    const dev = await Dev.create({
      github_username,
      name,
      avatar_url,
      bio,
      techs: techsArray,
      location,
    });
  
    return res.json(dev);
  },
  
  async update() {

  },

  async destroy() {

  },
};