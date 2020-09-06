import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGet } from '../misc/config';

const Show = () => {
  const { id } = useParams();

  const [show, setShow] = useState(null);

  // boolean value if data is being loaded or not
  const [isLoading, setIsLoading] = useState(true);

  // for errors
  const [error, setError] = useState(null);

  useEffect(() => {
    // checks if our page is rendered on the page or not becasuse useEffect callback only renders when componoent is mounted
    let isMounted = true;

    apiGet(`/shows/${id}?embed[]=seasons&embed[]=cast`)
      .then(results => {
        // if component is mounted only then we will set state
        if (isMounted) {
          setShow(results);
          // after setting state for show set state for Loading
          // we will set the stae for data being loaded and set it to false
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  console.log('show', show);

  if (isLoading) {
    return <div>Data is being loaded</div>;
  }

  if (error) {
    return <div>Error occured: {error}</div>;
  }

  return <div>This is show page</div>;
};

export default Show;
