import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import Swal from "sweetalert2";
import "./index.css";
import { getUserLocally, getBase64 } from "../../utils/helpers";
import * as API from "../../api/index";

const CreateHotel = () => {
  const [user, setUser] = useState({});

  // This is from react to goto a page or route to a page, it monitors the state of the routes
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    star: "",
    description: "",
    image: "",
  });

  // This useEffect will run once the page is loaded but before the HTML content is displayed
  useEffect(() => {
    // Get user that is logged in
    getUserLocally().then((user) => {
      setUser(user);
    });
  }, []);

  // function to handle change of the event in hotel details
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to submit the edit hotel
  const handleHotelSubmit = () => {
    setIsLoading(true);
    API.createHotel(formData)
      .then((res) => {
        Swal.fire({
          title: "Success!",
          text: "Hotel created successfully.",
          icon: "success",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed || result.isDenied || result.isDismissed) {
            navigate("/admin");
          }
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: "Error creating hotel, please try again later.",
          icon: "error",
          confirmButtonText: "Ok",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleImageUpload = async (value) => {
    getBase64(value, (url) => {
      setFormData({
        ...formData,
        image: url,
      });
    });
  };

  return (
    <Spin spinning={isLoading}>
      <div className="w-full flex flex-col mb-8 pl-6 xs:!px-2">
        <h3 className="header">Create Hotel</h3>

        <div>
          <div className="w-full max-w-[500px]">
            <div className="w-full mb-5">
              <label htmlFor="">Hotel name</label>
              <input
                type="text"
                name="name"
                placeholder="Hotel Name"
                defaultValue={formData.name}
                onChange={handleChange}
                className="bg-white xs:text-[14px] w-[100%] px-3 h-[50px] rounded-md focus:ring-flush-200 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="w-full mb-5">
              <label htmlFor="">Hotel description</label>
              <textarea
                name="description"
                cols="30"
                rows="5"
                defaultValue={formData.description}
                onChange={handleChange}
                className="bg-white xs:text-[14px] w-[100%] px-3 rounded-md focus:ring-flush-200 focus:outline-none focus:ring focus:ring-opacity-40 resize-none"
              ></textarea>
            </div>
            <div className="w-full mb-5">
              <label htmlFor="">Hotel location</label>
              <input
                type="text"
                name="location"
                placeholder="Location"
                defaultValue={formData.location}
                onChange={handleChange}
                className="bg-white xs:text-[14px] w-[100%] px-3 h-[50px] rounded-md focus:ring-flush-200 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="w-full mb-5">
              <label htmlFor="">Hotel Rating (star)</label>
              <input
                type="number"
                name="star"
                placeholder="0"
                defaultValue={formData.star}
                onChange={handleChange}
                className="bg-white xs:text-[14px] w-[100%] px-3 h-[50px] rounded-md focus:ring-flush-200 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="w-full mb-5">
              <label htmlFor="">Hotel Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                className="bg-white xs:text-[14px] w-[100%] px-3 h-[50px] rounded-md focus:ring-flush-200 focus:outline-none focus:ring focus:ring-opacity-40 flex items-center justify-center"
              />
              <div>
                {formData?.image.length > 0 && (
                  <img
                    src={formData?.image}
                    className="!w-[150px] !h-[150px] mt-2"
                    alt="Image uploaded"
                  />
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleHotelSubmit}
            className="w-full max-w-[500px] mt-3 px-4 py-3 text-white transition-colors transform bg-red-700/90 rounded-md hover:bg-red-700 text-lg"
          >
            Create Hotel
          </button>
        </div>
      </div>
    </Spin>
  );
};

export default CreateHotel;
