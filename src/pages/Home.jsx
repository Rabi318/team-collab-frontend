import React from "react";
import Banner from "../components/Banner";
import Carousel from "../components/Carousel";
import FeatureSection from "../components/FeatureSection";
import FeaturesGrid from "../components/FeaturesGrid";
import ReachChannels from "../components/ReachChannels";
import AddOnHubs from "../components/AddOnHubs";

const Home = () => {
  return (
    <>
      <Banner />
      <Carousel />
      <FeatureSection />
      <FeaturesGrid />
      <ReachChannels />
      <AddOnHubs />
    </>
  );
};

export default Home;
