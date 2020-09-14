// all hooks are functions
import { useReducer, useEffect, useState } from 'react';
import { apiGet } from './config';

function showsReducer(prevState, action) {
  switch (action.type) {
    case 'ADD': {
      return [...prevState, action.showId];
    }
    case 'REMOVE': {
      return prevState.filter(showId => showId !== action.showId);
    }
    default:
      return prevState;
  }
}

function usePersistedReducer(reducer, initialState, key) {
  // whenever initial state needs to be computed use the third param
  const [state, dispatch] = useReducer(reducer, initialState, initial => {
    // what is returned will be sent as initial state
    // read from local storage
    const persisted = localStorage.getItem(key);
    // if persisted exists and will store obj
    return persisted ? JSON.parse(persisted) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  // synchronize state with our localStorage
  return [state, dispatch];
}

export function useShows(key = 'shows') {
  return usePersistedReducer(showsReducer, [], key);
}

export function useLastQuery(key = 'lastQuery') {
  const [input, setInput] = useState(() => {
    const persisted = localStorage.getItem(key);

    // if persisted exists and will store obj
    return persisted ? JSON.parse(persisted) : '';
  });
  const setPersistedInput = newState => {
    setInput(newState);
    sessionStorage.setItem(key, JSON.stringify(newState));
  };

  return [input, setPersistedInput];
}

export function useShow(showId) {
  // reducer is a function that returns a new state
  // recieves 2 arguements current or prev state and action objects
  // actions are objects
  const reducer = (prevState, action) => {
    switch (action.type) {
      // first action is when fetch is sucessful
      // whatever we return will be set as a new state
      case 'FETCH_SUCCESS': {
        // Return object
        // We will pass action of type and action.show wil return to reducer and set error to null
        return { isLoading: false, error: null, show: action.show };
      }

      // second action is a failed fetch
      case 'FETCH_FAILED': {
        // merge prev state and now our error is action.error
        return { ...prevState, isLoading: false, error: action.error };
      }
      default:
        return prevState;
    }
  };

  // Returns an array of 2 elements the same as useState

  // Actions are payloads of information that send data from your application to your store.
  // They are the only source of information for the store. You send them to the store using store.dispatch().
  const [state, dispatch] = useReducer(reducer, {
    show: null,
    isLoading: true,
    error: null,
  });
  useEffect(() => {
    // checks if our page is rendered on the page or not becasuse useEffect callback only renders when componoent is mounted
    let isMounted = true;

    apiGet(`/shows/${showId}?embed[]=seasons&embed[]=cast`)
      .then(results => {
        // if component is mounted only then we will set state
        if (isMounted) {
          // instead of setShow and setIsLoading
          // we can call dispatch function
          dispatch({ type: 'FETCH_SUCCESS', show: results });
        }
      })
      .catch(err => {
        if (isMounted) {
          dispatch({ type: 'FETCH_FAILED', error: err.message });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [showId]);

  return state;
  // console.log('show', show);
}
