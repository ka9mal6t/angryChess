export  const updateRating = (setNicnameClass: (className: string) => void, 
                              setRatingClass: (className: string) => void, 
                              value: number) => {
    if (value < 1000) {
      setRatingClass('rating__1');
      setNicnameClass('nickname__1');
    } else if (value < 1500) {
      setRatingClass('rating__2');
      setNicnameClass('nickname__2');
    } else if (value < 2000) {
      setRatingClass('rating__3');
      setNicnameClass('nickname__3');
    } else if (value < 2500) {
      setRatingClass('rating__4');
      setNicnameClass('nickname__4');
    } else if (value < 3000) {
      setRatingClass('rating__5');
      setNicnameClass('nickname__5');
    } else{
      setRatingClass('rating__6');
      setNicnameClass('nickname__6');
    }
  };