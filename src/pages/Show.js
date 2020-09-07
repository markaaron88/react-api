/* eslint-disable no-underscore-dangle */
import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { apiGet } from '../misc/config';
import ShowMainData from '../components/show/ShowMainData';
import Details from '../components/show/Details';
import Cast from '../components/show/Cast';
import Seasons from '../components/show/Seasons';
import { ShowPageWrapper, InfoBlock } from './Show.styled';

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

// mvoe our initial State
const initialState = {
  show: null,
  isLoading: true,
  error: null,
};

const Show = () => {
  const { id } = useParams();

  // Returns an array of 2 elements the same as useState

  // Actions are payloads of information that send data from your application to your store.
  // They are the only source of information for the store. You send them to the store using store.dispatch().
  const [{ show, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(() => {
    // checks if our page is rendered on the page or not becasuse useEffect callback only renders when componoent is mounted
    let isMounted = true;

    apiGet(`/shows/${id}?embed[]=seasons&embed[]=cast`)
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
  }, [id]);

  // console.log('show', show);

  if (isLoading) {
    return <div>Data is being loaded</div>;
  }

  if (error) {
    return <div>Error occured: {error}</div>;
  }

  return (
    <ShowPageWrapper>
      <ShowMainData
        image={show.image}
        name={show.name}
        rating={show.rating}
        summary={show.summary}
        tags={show.genres}
      />

      <InfoBlock>
        <h2> Details</h2>
        <Details
          staus={show.status}
          network={show.network}
          premiered={show.premiered}
        />
      </InfoBlock>
      <div>
        <h2> Seasons</h2>
        <Seasons seasons={show._embedded.seasons} />
      </div>
      <div>
        <h2> Cast</h2>
        <Cast cast={show._embedded.cast} />
      </div>
    </ShowPageWrapper>
  );
};
export default Show;
