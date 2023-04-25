import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import defaultImage from "../../assets/hotel.jpg";
import { AiFillDelete } from "react-icons/ai";
import { getUserLocally } from "../../utils/helpers";
import * as API from "../../api/index";
import { Spin } from "antd";

const CartPage = ({ cartChanged, setCartChanged }) => {
  const [user, setUser] = useState({});

  const [cart, setCart] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // This useEffect will run once the page is loaded but before the HTML content is displayed
  useEffect(() => {
    // Get user signed in
    getUserLocally().then((user) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cart);
  }, [cartChanged]);

  const handleRemoveCart = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.find((item, index) => index === id);
    const filtered = cart.filter((item, index) => index !== id);
    if (exists) {
      Swal.fire({
        title: "Success!",
        text: "You have successfully removed a booking from the cart.",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Error removing this booking from the cart. Please reload and try again later.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }

    localStorage.setItem("cart", JSON.stringify(filtered));
    setCartChanged(!cartChanged);
  };

  const cartPrice = cart
    .map((item) => parseInt(item.price))
    .reduce((sum, a) => sum + a, 0);

  const handleCheckout = () => {
    setIsLoading(true);
    const formData = cart.map((item) => {
      return {
        hotelName: item.name,
        roomId: item.roomId,
        bookingStart: item.bookingStart,
        bookingEnd: item.bookingEnd,
      };
    });
    API.bookMultipleRoom(formData)
      .then(() => {
        localStorage.removeItem("cart");
        setCartChanged(!cartChanged);
        setCart([]);
        Swal.fire({
          title: "Success!",
          text: "You have successfully booked the rooms in your cart.",
          icon: "success",
          confirmButtonText: "Ok",
        });
      })
      .catch((err) => {
        console.log("Error", err?.response);
        Swal.fire({
          title: "Error!",
          text:
            err?.response?.data?.message ||
            "Error booking the rooms, please try again later.",
          icon: "error",
          confirmButtonText: "Ok",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Spin spinning={isLoading}>
      <div className="w-full flex flex-col justify-center items-center mt-4 px-10 xs:px-4">
        <h3 className="text-4xl xs:text-xl mb-2 font-semibold">Your cart</h3>

        {cart?.length > 0 ? (
          <>
            <div className="w-full flex flex-row gap-4 flex-wrap justify-start items-center mt-6">
              {cart?.map((item, index) => (
                <div
                  key={index}
                  className="max-w-[300px] w-[300px] rounded overflow-hidden shadow-lg"
                >
                  <img
                    className="w-full h-[200px]"
                    src={item?.image || defaultImage}
                    alt="Mountain"
                  />
                  <div className="px-5 mt-3 mb-2">
                    <h3 className="font-bold text-xl mb-2">{item?.name}</h3>
                    <p className="text-gray-700 text-sm">
                      Location: {item?.location}
                    </p>
                    <p className="inline-block bg-gray-200 rounded-full px-1 py-1 text-sm font-semibold text-gray-700 mb-2 mt-3">
                      From{" "}
                      {new Date(item?.bookingStart).toISOString().split("T")[0]}{" "}
                      {"to "}
                      {new Date(item?.bookingEnd).toISOString().split("T")[0]}
                    </p>
                    <p className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      Room {item?.index}
                    </p>
                  </div>
                  <div className="px-6 pb-2 flex flex-row justify-between">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      {item?.star} star{item?.review > 1 ? "s" : ""} Hotel
                    </span>
                    <p
                      className="cursor-pointer"
                      onClick={() => handleRemoveCart(index)}
                    >
                      <AiFillDelete size="1.5rem" fill="red" />
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full mt-12 mb-10">
              <h3 className="text-2xl font-bold mb-4">Checkout</h3>

              <div className="w-full flex flex-col">
                <div className="max-w-[500px] w-full flex flex-row justify-between items-center mb-3">
                  <p>Accumulated Price: </p>
                  <p>£{cartPrice} </p>
                </div>
                <div className="max-w-[500px] w-full flex flex-row justify-between items-center mb-3">
                  <p>Service Fee: </p>
                  <p>£0 </p>
                </div>
                <div className="max-w-[500px] w-full flex flex-row justify-between items-center mb-3">
                  <p>Total Fee: </p>
                  <p>£{cartPrice}</p>
                </div>
              </div>
              {user && user?.userId ? (
                <button
                  onClick={handleCheckout}
                  className="w-full mt-4 max-w-[500px] p-4 tracking-wide text-white transition-colors duration-200 transform bg-red-800/90 rounded-md hover:bg-red-800 text-lg"
                >
                  Checkout
                </button>
              ) : (
                <>
                  <p className="text-lg my-3">
                    You are not signed in, sign in to Checkout
                  </p>
                  <button
                    onClick={() => navigate("/sign-in")}
                    className="w-full mt-4 max-w-[500px] p-4 tracking-wide text-white transition-colors duration-200 transform bg-red-800/90 rounded-md hover:bg-red-800 text-lg"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <p className="text-xl font-normal">You cart is empty</p>
        )}
      </div>
    </Spin>
  );
};

export default CartPage;
