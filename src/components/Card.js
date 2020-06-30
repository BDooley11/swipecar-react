import React from "react";
import { string, number, array } from "prop-types";
import { animated, interpolate } from "react-spring/hooks";
import Carousel from "nuka-carousel";

const Card = ({ i, x, bind, data }) => {
  const { dealer, model, year, brief, mileage,location,update,price,pics } = data[i];

  return (
    <animated.div
      key={i}
      style={{
        transform: interpolate([x], (x) => `translate3d(${x}px,0px,0)`)
        
      }}
    >
      <animated.div
        {...bind(i)}

      >
        <div className="card">
          <h2>{dealer}</h2>
          <h2>{price}</h2>
          <Carousel>
            {pics.map((pic, index) => (
              <img src={pic} key={index} alt="profilePicture" />
            ))}
          </Carousel>
          <h2>{model},</h2>
          <h2>{year}</h2>
          <br></br>
          <h3>{brief} - </h3>
          <h3>{mileage} - </h3>
          <h3>{location} - </h3>
          <h3>{update}</h3>
        </div>
      </animated.div>
    </animated.div>
  );
};

Card.propTypes = {
  dealer: string,
  model: string,
  year: number,
  brief: string,
  mileage: string,
  location: string,
  update: string,
  price: string,
  pics: array
};

export default Card;
