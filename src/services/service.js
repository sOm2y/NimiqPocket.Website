import axios from 'axios';
export const getTransactionsData = (type,limit, skip) => {
  axios.defaults.baseURL =
    `https://us.nimiqpocket.com:5656/api/${type}/NQ37%2047US%20CL1J%20M0KQ%20KEY3%20YQ4G%20KGHC%20VPVF%208L02`;
  return new Promise((resolve, reject) => {
    // resolve(require('../stub/gLinks-stub-data.json'));
    axios({
      method: 'get',
      url: `/${limit}/${skip}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 400 || res.status === 403) {
          reject(res);
        }
        console.log(res);
        resolve(res.data);
      })
      .catch(err => {
        reject(err.response);
      });
  });
};
