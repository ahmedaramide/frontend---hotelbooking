import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./index.css";
import { getUserLocally } from "../../utils/helpers";
import * as API from "../../api/index";
import { Tooltip, Spin, Button, Select } from "antd";
import Swal from "sweetalert2";

const EditHotel = () => {
  const { hotelId } = useParams();
  const [user, setUser] = useState({});

  const [hotel, setHotel] = useState({});

  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [roomPagination, setRoomPagination] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    star: "",
    description: "",
    image: "",
  });

  const [roomFormData, setRoomFormData] = useState({
    id: "",
    capacity: 0,
    assets: [],
    price: 0,
  });

  // state to manage if it is edit room
  const [showEditRoom, setShowEditRoom] = useState(false);
  // state to manage if it is add room
  const [showAddRoom, setShowAddRoom] = useState(false);

  // This useEffect will run once the page is loaded but before the HTML content is displayed
  useEffect(() => {
    // Get user that is logged in
    getUserLocally().then((user) => {
      setUser(user);
    });

    // Set loading to load the page
    setIsLoading(true);

    // Get Hotel with the ID to edit
    API.getHotel(hotelId).then((res) => {
      // Save the hotel details into formData
      setFormData({
        ...formData,
        id: res.data?.data?._id,
        name: res.data?.data?.name,
        location: res.data?.data?.location,
        star: res.data?.data?.star,
        description: res.data?.data?.description,
        image: res.data?.data?.image,
      });

      // get hotel rooms to display and for edit
      API.getHotelRooms(hotelId)
        .then((result) => {
          const newRooms = result.data?.result?.sort(
            (a, b) => a?.index - b?.index
          );

          setRooms(newRooms);

          // set pagination in case there are many rooms
          const data = {
            currentPage: result.data?.currentPage,
            hasNext: result.data?.hasNext,
            hasPrevious: result.data?.hasPrevious,
            pageSize: result.data?.pageSize,
            totalCountOfRooms: result.data?.totalCountOfRooms,
            totalPages: result.data?.totalPages,
          };
          setRoomPagination(data);
        })
        .finally(() => {
          // set loading to false after everything
          setIsLoading(false);
        });
    });
  }, []);

  // function to handle change of the event in hotel details
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // function to handle change of the event in room details
  const handleRoomEditChange = (e) => {
    setRoomFormData({
      ...roomFormData,
      [e.target.name]: e.target.value,
    });
  };

  // function to handle select of assets
  const handleRoomAssetChange = (value) => {
    setRoomFormData({
      ...roomFormData,
      assets: value.map((item) => {
        return { value: item, label: item };
      }),
    });
  };

  // Function to show the edit room fields when room is clicked, the room is passed as parameter as to populate the data from the already fetched rooms
  const handleRoomEdit = (room) => {
    setShowEditRoom(true);
    setShowAddRoom(false);
    setRoomFormData({
      id: room._id,
      assets: room.assets.map((item) => {
        return { value: item, label: item };
      }),
      capacity: room.capacity,
      price: room.price,
    });
  };

  // Function to handle cancel room edit
  const handleCancelRoomEdit = () => {
    setShowEditRoom(false);
    setShowAddRoom(false);
    setRoomFormData({
      id: "",
      capacity: 0,
      assets: [],
      price: 0,
    });
  };

  // Function to handle add room instead of edit
  const handleAddRoom = () => {
    setShowEditRoom(false);
    setShowAddRoom(true);
    setRoomFormData({
      id: "",
      capacity: 0,
      assets: [],
      price: 0,
    });
  };

  // Function to submit the edit hotel
  const handleHotelSubmit = () => {
    setIsLoading(true);
    API.updateHotel(formData.id, formData)
      .then((res) => {
        Swal.fire({
          title: "Success!",
          text: "Hotel edited successfully.",
          icon: "success",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed || result.isDenied || result.isDismissed) {
            window.location.reload();
          }
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: "Error editing hotel, please try again later.",
          icon: "error",
          confirmButtonText: "Ok",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Function to submit the edit room
  const handleRoomSubmit = () => {
    setIsLoading(true);
    const data = {
      ...roomFormData,
      assets: roomFormData.assets.map((item) => item.value),
    };

    if (showEditRoom && !showAddRoom) {
      API.updateRoom(roomFormData.id, data)
        .then((res) => {
          Swal.fire({
            title: "Success!",
            text: "Room edited successfully.",
            icon: "success",
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed || result.isDenied || result.isDismissed) {
              window.location.reload();
            }
          });
        })
        .catch((err) => {
          Swal.fire({
            title: "Error!",
            text: "Error editing room, please try again later.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (showAddRoom && !showEditRoom) {
      API.addRoom({ ...data, hotelId })
        .then((res) => {
          Swal.fire({
            title: "Success!",
            text: "Room created successfully.",
            icon: "success",
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed || result.isDenied || result.isDismissed) {
              window.location.reload();
            }
          });
        })
        .catch((err) => {
          Swal.fire({
            title: "Error!",
            text: "Error creating room, please try again later.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
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
      <div className="w-full flex flex-col mb-8">
        <h3 className="header">Edit Hotel</h3>

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
                {formData?.image?.length > 0 && (
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
            Edit Hotel
          </button>
        </div>

        <div className="mt-6">
          <p>
            Mouse over or click on the rooms to see the room details, click to
            edit.
          </p>
          <div className="rooms__container__room">
            {rooms?.length > 0 ? (
              <div className="flex flex-col">
                {rooms?.map((item) => (
                  <Tooltip
                    placement="top"
                    title={
                      <div className="tooltip__container">
                        <div className="tooltip_item">
                          <p className="tooltip_title">Assets: </p>
                          {item?.assets?.map((asset) => (
                            <p className="tooltip_description">
                              {asset?.toUpperCase()}
                            </p>
                          ))}
                        </div>
                        <div className="tooltip_item">
                          <p className="tooltip_title">Price: </p>
                          <p className="tooltip_description">£{item?.price}</p>
                        </div>
                        <div className="tooltip_item">
                          <p className="tooltip_title">Room capacity: </p>
                          <p className="tooltip_description">
                            {item?.capacity}
                          </p>
                        </div>
                      </div>
                    }
                  >
                    <Button onClick={() => handleRoomEdit(item)}>
                      Room {item?.index}
                    </Button>
                  </Tooltip>
                ))}
                <div>
                  <button
                    onClick={handleAddRoom}
                    className="w-full max-w-[500px] mt-3 px-4 py-3 text-white transition-colors transform bg-red-700/90 rounded-md hover:bg-red-700 text-lg"
                  >
                    Add room
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p>No rooms in this hotel</p>
                <button
                  onClick={handleAddRoom}
                  className="w-full max-w-[500px] mt-3 px-4 py-3 text-white transition-colors transform bg-red-700/90 rounded-md hover:bg-red-700 text-lg"
                >
                  Add room
                </button>
              </div>
            )}
          </div>
        </div>

        {(showEditRoom || showAddRoom) && (
          <div className="w-full max-w-[500px] mt-8">
            <div className="w-full mb-5">
              <label htmlFor="">Room capacity</label>
              <input
                type="number"
                name="capacity"
                placeholder="Room capacity"
                defaultValue={roomFormData.capacity}
                onChange={handleRoomEditChange}
                className="bg-white xs:text-[14px] w-[100%] px-3 h-[50px] rounded-md focus:ring-flush-200 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="w-full mb-5">
              <label htmlFor="">Room Price</label>
              <input
                type="number"
                name="price"
                placeholder="Room price"
                defaultValue={roomFormData.price}
                onChange={handleRoomEditChange}
                className="bg-white xs:text-[14px] w-[100%] px-3 h-[50px] rounded-md focus:ring-flush-200 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="w-full mb-5">
              <label htmlFor="">Room Assets</label>
              <Select
                mode="tags"
                size={"large"}
                placeholder="Please select"
                defaultValue={roomFormData.assets}
                onChange={handleRoomAssetChange}
                style={{ width: "100%" }}
                options={roomFormData.assets}
              />
            </div>

            <div className="w-full flex flex-row gap-3">
              <button
                onClick={handleCancelRoomEdit}
                className="max-w-[200px] mt-3 px-4 py-3 text-white transition-colors transform bg-red-700/90 rounded-md hover:bg-red-700 text-lg"
              >
                Cancel {showAddRoom ? "Create" : "Edit"}
              </button>
              <button
                onClick={handleRoomSubmit}
                className="max-w-[200px] mt-3 px-4 py-3 text-white transition-colors transform bg-red-700/90 rounded-md hover:bg-red-700 text-lg"
              >
                {showAddRoom ? "Create" : "Save"} Room
              </button>
            </div>
          </div>
        )}
      </div>
    </Spin>
  );
};

export default EditHotel;
