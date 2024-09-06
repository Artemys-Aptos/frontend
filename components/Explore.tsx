import React, { useEffect, useState } from 'react';
import PromptCard from './cards/PromptCard';
import ExploreTab from './tab/ExploreTab';
import HomeHeader from './HomeHeader';
import ExploreMasonry from './ExploreMasonry';
import RangeSlider from './RangeSlider';

const Explore = () => {
  return (
    <>
      <HomeHeader />
      <div className="ml-[15px] flex items-center  mr-[40px] mt-[20px]">
        <ExploreTab />
        <div className="w-[400px] flex items-center text-white justify-end">
          <span className="text-xl cursor-pointer">-</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <RangeSlider count="hidden" cfg="hidden" />
          <span className="text-xl cursor-pointer">+</span>
        </div>
      </div>
      <ExploreMasonry />
    </>
  );
};

export default React.memo(Explore);
