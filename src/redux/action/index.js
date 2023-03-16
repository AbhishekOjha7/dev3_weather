import axios from 'axios';

export const getWeatherApi = (apiUrl, successCallback, failureCallback) => {
  return dispatch => {
    axios
      .get(apiUrl)
      .then(response => {
        const _data = response.data;
        console.log('_data', _data)
        dispatch({type: 'current', payload: _data});
        dispatch({type: 'currentLocation', payload: _data.location});
        successCallback(_data);
      })
      .catch(error => {
        failureCallback(error);
      });
  };
};
