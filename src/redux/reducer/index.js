const initialState = {
  current: {},
  currentLocation: {}
};

const ForecastReducer = (state = initialState, action) => {
  // console.log('action', action.payload.current, action.payload.location)
  switch (action.type) {
    case 'current':
      return {...state, ...action.payload};
    case 'currentLocation':
      return {...state, currentLocation: action.payload};
    default:
      return state;
  }
};

export default ForecastReducer;
