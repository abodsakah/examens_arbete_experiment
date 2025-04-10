import React from 'react';
import SlickSlider from 'react-slick';
// Import slider CSS
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// This wrapper is needed to fix typing issues between React 18 and react-slick
const SliderWrapper: React.FC<{
  children: React.ReactNode;
  settings: any;
}> = ({ children, settings }) => {
  return <SlickSlider {...settings}>{children}</SlickSlider>;
};

export default SliderWrapper;