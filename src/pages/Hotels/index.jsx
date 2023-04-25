import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import * as API from "../../api/index";
import defaultImage from "../../assets/hotel.jpg";
import { Spin } from "antd";

const Hotels = () => {
  // This is from react to goto a page or route to a page, it monitors the state of the routes
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  // State to manage hotels
  const [hotels, setHotels] = useState([]);
  const [initialHotels, setInitialHotels] = useState([]);

  // This useEffect will run once the page is loaded but before the HTML content is displayed
  useEffect(() => {
    setIsLoading(true);

    // Get hotels
    API.getHotels("")
      .then((res) => {
        setHotels(res.data?.result);
        setInitialHotels(res.data?.result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSearchChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    if (value.length > 0) {
      const filtered = initialHotels.filter((item) =>
        item?.name?.toLowerCase()?.includes(value?.toLowerCase())
      );
      setHotels(filtered);
    } else if (value.length === 0) {
      setHotels(initialHotels);
    }
  };

  return (
    <Spin spinning={isLoading}>
      <div className="w-full flex flex-col">
        <div className="flex flex-row items-center justify-center mt-10 mb-8">
          <input
            type="text"
            onChange={handleSearchChange}
            placeholder="Search for hotels"
            className="w-full max-w-[500px] px-2 py-3 bg-transparent border-2 border-black rounded-md"
          />
          <button
            // onClick={closeModal}
            className="ml-3 px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-red-800/90 rounded-md hover:bg-red-800 text-lg"
          >
            Search
          </button>
        </div>
        <div className="flex flex-col items-center justify-center mt-14 mb-10">
          <h4 className="main_title !text-3xl">Hotels</h4>
          <div className="flex flex-row flex-wrap mt-8 justify-center gap-8">
            {hotels.length > 0 &&
              hotels.map((item) => (
                <div
                  key={item?._id}
                  onClick={() => navigate(`/hotel/${item?._id}`)}
                  className="max-w-[300px] w-[300px] rounded overflow-hidden shadow-lg cursor-pointer"
                >
                  <img
                    className="w-full"
                    src={item?.image || defaultImage}
                    alt="Mountain"
                  />
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{item?.name}</div>
                    <p className="text-gray-700 text-base mb-3">
                      {item?.description}
                    </p>
                    <p className="text-gray-700 text-sm">
                      Location: {item?.location}
                    </p>
                  </div>
                  <div className="px-6 pt-4 pb-2 flex flex-row justify-between">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      {item?.star} star{item?.star > 1 ? "s" : ""} Hotel
                    </span>
                    <span
                      onClick={() => navigate(`/hotel/${item?._id}`)}
                      className="inline-block bg-red-600 rounded-full px-3 py-1 text-sm font-semibold text-shades-white mr-2 mb-2 cursor-pointer"
                    >
                      View
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default Hotels;
