import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import * as API from "../../api/index";
import hotelImage from "../../assets/hotel.jpg";

const Home = () => {
  // This is from react to goto a page or route to a page, it monitors the state of the routes
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  // State to manage the hotels fetched
  const [hotels, setHotels] = useState([]);

  // State to manage the hotels fetched
  const [topHotels, setTopHotels] = useState([]);
  const [initialHotels, setInitialHotels] = useState([]);

  // This useEffect will run once the page is loaded but before the HTML content is displayed
  useEffect(() => {
    setIsLoading(true);
    // Get top hotels
    API.getTopHotels()
      .then((res) => {
        setHotels(res.data?.result);
        setInitialHotels(res.data?.result);
      })
      .finally(() => {
        setIsLoading(false);
      });
    // Get third party hotels
    API.getHotelsFromAPI()
      .then((res) => {
        const data = res
          .map((item) => {
            return {
              name: item?.hotel_name || "",
              hotelImage: item?.main_photo_url || "",
              review: item?.review_score || 0,
              url: item?.url || "",
              price: item?.min_total_price || 0,
              location: `${item?.city}, ${item?.country_trans}`,
            };
          })
          .sort((a, b) => b.review - a.review);
        setTopHotels(data);
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
      {/* Landing page */}
      <div className="hero_section">
        <h3 className="hero_title">HOTEL BOOKING</h3>
        <p className="description">
          Discover world-class hospitality experience at premium hotels.
        </p>
      </div>

      {/* Hotels */}
      <div className="flex flex-row items-center justify-center mt-16 mb-8">
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
      <div className="flex flex-col items-center justify-center mt-14 mb-8">
        <h5 className="sub_title">Hotels</h5>
        <h4 className="main_title">Top star hotels</h4>
        <div className="flex flex-row flex-wrap mt-8 justify-center gap-8">
          {hotels.length > 0 &&
            hotels.map((item) => (
              <div
                key={item?._id}
                className="max-w-[300px] w-[300px] rounded overflow-hidden shadow-lg cursor-pointer"
              >
                <img
                  className="w-full h-[200px]"
                  src={item?.image || hotelImage}
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

      {/* Third party Hotels */}
      <div className="flex flex-col items-center justify-center mt-10 mb-8">
        <h5 className="sub_title">Top Hotels</h5>
        <div className="flex flex-row flex-wrap mt-8 justify-center gap-8">
          {topHotels.length > 0 &&
            topHotels.map((item) => (
              <div
                key={item?.name}
                className="max-w-[300px] w-[300px] rounded overflow-hidden shadow-lg cursor-pointer"
              >
                {/* <div className="w-full "></div> */}
                <img
                  className="w-full h-[200px]"
                  src={item?.hotelImage}
                  alt="Mountain"
                />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{item?.name}</div>
                  <p className="text-gray-700 text-sm">
                    Location: {item?.location}
                  </p>
                </div>
                <div className="px-6 pt-4 pb-2 flex flex-row justify-between">
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {item?.review} star{item?.review > 1 ? "s" : ""} Hotel
                  </span>
                  <a
                    href={item?.url}
                    target="_blank"
                    className="inline-block bg-red-600 rounded-full px-3 py-1 text-sm font-semibold text-shades-white mr-2 mb-2 cursor-pointer"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* About */}
      <section className="services_area pt-12 mb-10" id="about">
        <div className="container">
          <div className="flex row justify-center">
            <div className="w-full lg:w-1/2">
              <div className="section_title text-center pb-6">
                <h5 className="sub_title">About Us</h5>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center flex-wrap">
            <div className="w-full sm:w-10/12 md:w-6/12 lg:w-4/12">
              <div className="single_services text-center mt-8 mx-3">
                <div className="services_icon">
                  <i className="lni lni-write"></i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="94"
                    height="92"
                    viewBox="0 0 94 92"
                  >
                    <path
                      className="services_shape"
                      id="Polygon_12"
                      data-name="Polygon 12"
                      d="M42.212,2.315a11,11,0,0,1,9.576,0l28.138,13.6a11,11,0,0,1,5.938,7.465L92.83,54.018A11,11,0,0,1,90.717,63.3L71.22,87.842A11,11,0,0,1,62.607,92H31.393a11,11,0,0,1-8.613-4.158L3.283,63.3A11,11,0,0,1,1.17,54.018L8.136,23.383a11,11,0,0,1,5.938-7.465Z"
                    />
                  </svg>
                </div>
                <div className="services_content mt-5">
                  <h3 className="services_title text-black font-semibold text-xl md:text-3xl">
                    Secure Booking
                  </h3>
                  <p className="mt-4">
                    We facilitate hundreds of thousands of transactions every
                    day through our secure platform, and work to the highest
                    standards to guarantee your privacy.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-10/12 md:w-6/12 lg:w-4/12">
              <div className="single_services text-center mt-8 mx-3">
                <div className="services_icon">
                  <i className="lni lni-bulb"></i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="94"
                    height="92"
                    viewBox="0 0 94 92"
                  >
                    <path
                      className="services_shape"
                      id="Polygon_12"
                      data-name="Polygon 12"
                      d="M42.212,2.315a11,11,0,0,1,9.576,0l28.138,13.6a11,11,0,0,1,5.938,7.465L92.83,54.018A11,11,0,0,1,90.717,63.3L71.22,87.842A11,11,0,0,1,62.607,92H31.393a11,11,0,0,1-8.613-4.158L3.283,63.3A11,11,0,0,1,1.17,54.018L8.136,23.383a11,11,0,0,1,5.938-7.465Z"
                    />
                  </svg>
                </div>
                <div className="services_content mt-5">
                  <h3 className="services_title text-black font-semibold text-xl md:text-3xl">
                    24/7 support
                  </h3>
                  <p className="mt-4">
                    We facilitate hundreds of thousands of transactions every
                    day through our secure platform, and work to the highest
                    standards to guarantee your privacy.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-10/12 md:w-6/12 lg:w-4/12">
              <div className="single_services text-center mt-8 mx-3">
                <div className="services_icon">
                  <i className="lni lni-checkmark-circle"></i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="94"
                    height="92"
                    viewBox="0 0 94 92"
                  >
                    <path
                      className="services_shape"
                      id="Polygon_12"
                      data-name="Polygon 12"
                      d="M42.212,2.315a11,11,0,0,1,9.576,0l28.138,13.6a11,11,0,0,1,5.938,7.465L92.83,54.018A11,11,0,0,1,90.717,63.3L71.22,87.842A11,11,0,0,1,62.607,92H31.393a11,11,0,0,1-8.613-4.158L3.283,63.3A11,11,0,0,1,1.17,54.018L8.136,23.383a11,11,0,0,1,5.938-7.465Z"
                    />
                  </svg>
                </div>
                <div className="services_content mt-5">
                  <h3 className="services_title text-black font-semibold text-xl md:text-3xl">
                    Low rates
                  </h3>
                  <p className="mt-4">
                    We guarantee to offer you the best available rates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Spin>
  );
};

export default Home;
