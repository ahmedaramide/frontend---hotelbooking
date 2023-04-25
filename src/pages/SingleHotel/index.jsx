import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./index.css";

import defaultImage from "../../assets/hero.png";
import { Select, DatePicker, Spin, Tooltip, Button, message } from "antd";
const { RangePicker } = DatePicker;

import * as API from "../../api/index";
import Swal from "sweetalert2";
import moment from "moment";

import { getUserLocally } from "../../utils/helpers";

const SingleHotel = ({ cartChanged, setCartChanged }) => {
  const [user, setUser] = useState({});

  // This useEffect will run once the page is loaded but before the HTML content is displayed
  useEffect(() => {
    // Get user logged in
    getUserLocally().then((user) => {
      setUser(user);
    });
  }, []);

  // This is a ref to hold the comment field for any changes
  const commentDescriptionRef = useRef(null);

  // This is the params from query
  const { hotelId } = useParams();

  // This is from react to goto a page or route to a page, it monitors the state of the routes
  const navigate = useNavigate();

  // State to manage the hotel data
  const [hotel, setHotel] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  // State to manage if the comment is open
  const [openComment, setOpenComment] = useState(false);

  // State to manage the rooms that is mapped for the room buttons
  const [mappedRooms, setMappedRooms] = useState([]);

  // State to manage the rooms
  const [rooms, setRooms] = useState([]);

  // State to manage the comments on the hotel
  const [comments, setComments] = useState([]);

  // Pagination for rooms in case it is much
  const [roomPagination, setRoomPagination] = useState({});

  const [bookingFormData, setBookingFormData] = useState({
    bookingStart: "",
    bookingEnd: "",
    roomId: "",
  });

  // This useEffect will run once the page is loaded but before the HTML content is displayed
  useEffect(() => {
    setIsLoading(true);

    // get the hotel
    API.getHotel(hotelId)
      .then((res) => {
        setHotel(res.data?.data);

        // Get the hotel rooms
        API.getHotelRooms(hotelId).then((result) => {
          // mapped the hotel rooms for the option
          const options = result.data?.result
            ?.sort((a, b) => a?.index - b?.index)
            ?.map((item, key) => {
              return {
                value: item?._id,
                label: `Room ${item?.index}`,
              };
            });

          // Sorted the rooms to be according to their index order
          const newRooms = result.data?.result?.sort(
            (a, b) => a?.index - b?.index
          );

          setRooms(newRooms);
          setMappedRooms(options);

          // pagination
          const data = {
            currentPage: result.data?.currentPage,
            hasNext: result.data?.hasNext,
            hasPrevious: result.data?.hasPrevious,
            pageSize: result.data?.pageSize,
            totalCountOfRooms: result.data?.totalCountOfRooms,
            totalPages: result.data?.totalPages,
          };
          setRoomPagination(data);
        });

        // Get hotel comments
        API.getHotelComments(hotelId, "")
          .then((res) => {
            setComments(res.data?.result);
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch(() => {
        // If there is error loading this page, show this error
        Swal.fire({
          title: "Error!",
          text: "Error loading this page, hotel not found.",
          icon: "error",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed || result.isDenied || result.isDismissed) {
            navigate("/");
          }
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Function to handle add comment
  const handleAddComment = (e) => {
    e.preventDefault();
    const description = commentDescriptionRef.current?.value;
    const formData = {
      hotelId,
      description,
    };

    API.addComment(formData).then((res) => {
      API.getHotelComments(hotelId, "")
        .then((res) => {
          setComments(res.data?.result);
        })
        .finally(() => {
          setIsLoading(false);
        });
      // Reset text to null
      commentDescriptionRef.current.value = "";
      Swal.fire({
        title: "Success!",
        text: "You have successfully added a comment to this hotel",
        icon: "success",
        confirmButtonText: "Ok",
      });
    });
  };

  const handleChange = (value) => {
    setBookingFormData({
      ...bookingFormData,
      roomId: value,
    });
  };

  const onChange = (date, dateString) => {
    setBookingFormData({
      ...bookingFormData,
      bookingStart: new Date(dateString[0]),
      bookingEnd: new Date(dateString[1]),
    });
  };

  const checkForAvailability = () => {
    if (bookingFormData.roomId.length === 0) {
      message.error("Select a room to book");
      return;
    } else if (bookingFormData.bookingStart.length === 0) {
      message.error("Booking starting date is empty");
      return;
    } else if (bookingFormData.bookingEnd.length === 0) {
      message.error("Booking ending date is empty");
      return;
    }
    setIsLoading(true);
    API.getRoomAvailability(bookingFormData)
      .then((res) => {
        Swal.fire({
          title: "Success!",
          text: res?.data?.message || "The room is available for booking.",
          icon: "success",
          confirmButtonText: "Add to cart",
          cancelButtonText: "Cancel",
        }).then((result) => {
          // if (result.isConfirmed) {
          //   setIsLoading(true);
          //   API.bookRoom(bookingFormData)
          //     .then((res) => {
          //       Swal.fire({
          //         title: "Success!",
          //         text: res?.data?.message || "Room booked successfully.",
          //         icon: "success",
          //         confirmButtonText: "Ok",
          //       });
          //     })
          //     .catch((err) => {
          //       Swal.fire({
          //         title: "Error!",
          //         text:
          //           err?.response?.data?.message ||
          //           "Error checking for availabilty.",
          //         icon: "error",
          //         confirmButtonText: "Ok",
          //       });
          //     })
          //     .finally(() => {
          //       setIsLoading(false);
          //     });
          // }
          handleAddToCart();
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text:
            err?.response?.data?.message || "Error checking for availabilty.",
          icon: "error",
          confirmButtonText: "Ok",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.find(
      (item) =>
        item.roomId === bookingFormData?.roomId &&
        moment(item.bookingStart).isSame(bookingFormData.bookingStart) &&
        moment(item.bookingEnd).isSame(bookingFormData.bookingEnd)
    );

    const selectedRoom = rooms.find((r) => r._id === bookingFormData.roomId);

    if (exists) {
      Swal.fire({
        title: "Error!",
        text: "Hotel room with this date already exists in the cart. You can add a new date entry.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } else {
      const isOverlap = cart.some((booking) => {
        const isStartBetween = moment(bookingFormData.bookingStart).isBetween(
          booking.bookingStart,
          booking.bookingEnd,
          undefined,
          "[]"
        );
        const isEndBetween = moment(bookingFormData.bookingEnd).isBetween(
          booking.startDate,
          booking.bookingEnd,
          undefined,
          "[]"
        );
        const isOverlap = isStartBetween || isEndBetween;
        return isOverlap;
      });
      if (isOverlap) {
        Swal.fire({
          title: "Error!",
          text: "Hotel room that overlaps with the selected dates already exists in the cart. You can add a new date entry.",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }
      cart.push({
        name: hotel?.name,
        description: hotel?.description,
        location: hotel?.location,
        star: hotel?.star,
        id: hotel?._id,
        image: hotel?.image,
        roomId: bookingFormData.roomId,
        bookingStart: bookingFormData.bookingStart,
        bookingEnd: bookingFormData.bookingEnd,
        price: selectedRoom.price,
        index: selectedRoom.index,
      });

      Swal.fire({
        title: "Success!",
        text: "Added to the cart successfully.",
        icon: "success",
        confirmButtonText: "Ok",
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartChanged(!cartChanged);
  };

  return isLoading ? (
    <Spin spinning={isLoading} size="large"></Spin>
  ) : (
    hotel?._id && (
      <div className="single_hotel_container">
        <h2 className="single_hotel_header">{hotel?.name}</h2>

        <div className="single_hotel_details_container">
          <div className="single_hotel_details_image_container">
            <img
              src={hotel?.image || defaultImage}
              alt=""
              className="single_hotel_details_image"
            />
          </div>

          <div className="single_hotel_details_info_container">
            <div className="single_hotel_info">
              <h2 className="single_hotel_info_title">Description:</h2>
              <p className="single_hotel_info_description">
                {hotel?.description}
              </p>
            </div>

            <div className="single_hotel_info">
              <h2 className="single_hotel_info_title">Location:</h2>
              <p className="single_hotel_info_description">{hotel?.location}</p>
            </div>

            <div className="single_hotel_info">
              <h2 className="single_hotel_info_title">Star:</h2>
              <p className="single_hotel_info_description">
                {hotel?.star} star{hotel?.star > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="rooms__container">
          <h3 className="single_hotel_header !mb-4">Hotel Rooms</h3>

          <p>Mouse over or click on the rooms to see the room details</p>
          <div className="rooms__container__room">
            {rooms?.length > 0 ? (
              rooms?.map((item) => (
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
                        <p className="tooltip_description">{item?.capacity}</p>
                      </div>
                    </div>
                  }
                >
                  <Button>Room {item?.index}</Button>
                </Tooltip>
              ))
            ) : (
              <>
                <p>No rooms in this hotel</p>
              </>
            )}
          </div>
        </div>

        <div className="booking__container">
          <h3 className="single_hotel_header">Book hotel</h3>
          <div className="search_container">
            <div className="search_container__item">
              <h3>Select Room</h3>
              <Select
                size="large"
                defaultValue="Select room"
                onChange={handleChange}
                options={mappedRooms}
                className="booking__room__picker"
              />
            </div>
            <div className="search_container__item">
              <h3>Choose Date</h3>
              <RangePicker
                onChange={onChange}
                className="booking__date__picker"
              />
            </div>
            <button className="booking__button" onClick={checkForAvailability}>
              Check availability
            </button>
          </div>
        </div>

        <div className="review__container">
          <h3 className="review__header">Hotel Comments</h3>
          <div>
            {comments.map((comment, index) => (
              <>
                <div className="review__container__card">
                  <div className="review__container__card__header">
                    <p>
                      {comment?.user?.username ||
                        `${comment?.user?.firstName} ${comment?.user?.lastName}`}
                    </p>
                  </div>
                  <div className="review__container__card__stat">
                    <p>
                      {moment(comment?.createdAt).format("dddd, MMMM Do YYYY")}
                      {" at "}
                      {moment(comment?.createdAt).format("LT")}
                    </p>
                  </div>
                  <p className="review__container__card__comment">
                    {comment?.description}
                  </p>
                </div>
                {comments.length !== index + 1 && (
                  <>
                    <hr className="divider" />
                  </>
                )}
              </>
            ))}
            <div className="add_comment">
              {user && user?.userId ? (
                !openComment && (
                  <div className="cursor-pointer">
                    <button
                      onClick={() => setOpenComment(!openComment)}
                      className="comment__submit__button"
                    >
                      Add comment
                    </button>
                  </div>
                )
              ) : (
                <p
                  className="cursor-pointer"
                  onClick={() => navigate("/sign-in")}
                >
                  Want to leave a comment?{" "}
                  <span className="text-red-800">please sign in</span>
                </p>
              )}

              {openComment && (
                <div>
                  <textarea
                    name=""
                    id=""
                    rows="5"
                    placeholder="Write comment here"
                    className="comment__text"
                    ref={commentDescriptionRef}
                  ></textarea>
                  <div className="flex flex-row gap-3">
                    <button
                      className="comment__cancel__button"
                      onClick={() => setOpenComment(!openComment)}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddComment}
                      className="comment__submit__button"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default SingleHotel;
