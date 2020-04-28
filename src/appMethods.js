console.log('appMethods.js')

// const {setPosts} = require('./AppHome');
const axios = require('axios');
// import qs from 'qs';

const headers = () => {
  const token = window.localStorage.getItem('token');
  return {
      headers: {
          authorization: token
      }
  };
};

const getAllPosts = async() => {
  // console.log('getAllPosts')
  // console.log({setPosts})
  let sendIt = []

  await axios.get('/api/posts/getAllPosts', headers())
    .then((response) => sendIt = response)
    .catch(ex => console.log('AppHome.getAllPosts:', ex))
  
  // console.log(sendIt)
  return (sendIt)
}

module.exports = {
  getAllPosts,
  headers,
}