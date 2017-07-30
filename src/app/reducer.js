import { createStore } from 'redux';

const reducer = (state, action) => {
  const payload = action.payload;
  return payload;
};

export const store = createStore(reducer, null);
