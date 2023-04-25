import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { getUserLocally } from "../../utils/helpers";
import RecentBookings from "../../components/RecentBookings";
import HotelLists from "../../components/HotelLists";
import * as API from "../../api/index";
import Swal from "sweetalert2";
import { Spin } from "antd";

const AdminDashboard = () => {
  const [user, setUser] = useState({});
  const [adminDashboard, setAdminDashboard] = useState({});
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // This is from react to goto a page or route to a page, it monitors the state of the routes
  const navigate = useNavigate();

  // This useEffect will run once the page is loaded but before the HTML content is displayed
  useEffect(() => {
    // Get user signed in
    getUserLocally().then((user) => {
      setUser(user);
    });

    // Set is loading for page to load
    setIsLoading(true);

    // Fetch admin dashboard stats
    API.getAdminDashboard().then((res) => {
      setAdminDashboard(res.data?.data);
    });

    // Fetch bookings
    API.getAdminBookings().then((res) => {
      setBookings(res?.data?.result);
    });

    // get the hotels
    API.getHotels()
      .then((res) => {
        setHotels(res.data?.result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleDeleteHotel = (hotelId) => {
    // are you sure modal
    Swal.fire({
      title: "Warning!",
      text: "Are you sure you want to delete this hotel?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        // If yes, delete the hotel
        API.deleteHotel(hotelId)
          .then(() => {
            // Show success modal
            Swal.fire({
              title: "Success!",
              text: "Hotel Deleted successfully.",
              icon: "success",
              confirmButtonText: "Ok",
            }).then((result) => {
              if (result.isConfirmed || result.isDenied || result.isDismissed) {
                // reload the page
                window.location.reload();
              }
            });
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "Error creating hotel, please try again later.",
              icon: "error",
              confirmButtonText: "Ok",
            });
          });
      }
    });
  };

  return user && user?.role === "admin" ? (
    <Spin spinning={isLoading}>
      <div className="w-full p-4">
        <h3 className="header">Admin Dashboard</h3>

        <div className="w-full flex flex-row flex-wrap gap-5 mt-3 mb-8">
          <div className="dashboard_stat_card xs:min-w-[80%]">
            <p className="text-[#db273a] text-lg mb-1">Total Users</p>
            <p className="text-[#db273a] text-3xl font-extrabold">
              {adminDashboard?.totalNumberOfUser}
            </p>
          </div>
          <div className="dashboard_stat_card xs:min-w-[80%]">
            <p className="text-[#db273a] text-lg mb-1">Total Hotels</p>
            <p className="text-[#db273a] text-3xl font-extrabold">
              {adminDashboard?.totalNumberOfHotels}
            </p>
          </div>
          <div className="dashboard_stat_card xs:min-w-[80%]">
            <p className="text-[#db273a] text-lg mb-1">Total Rooms</p>
            <p className="text-[#db273a] text-3xl font-extrabold">
              {adminDashboard?.totalNumberOfRooms}
            </p>
          </div>
          <div className="dashboard_stat_card xs:min-w-[80%]">
            <p className="text-[#db273a] text-lg mb-1">Total Bookings</p>
            <p className="text-[#db273a] text-3xl font-extrabold">
              {adminDashboard?.totalNumberOfBookings}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <h3 className="header !text-xl !mb-3 !mt-3">Hotels</h3>
          <HotelLists props={hotels} handleDeleteHotel={handleDeleteHotel} />
          <button
            onClick={() => navigate("/admin/hotel/create")}
            className="mt-6 px-4 py-3 text-white transition-colors transform bg-red-700/90 rounded-md hover:bg-red-700 text-lg"
          >
            Create Hotel
          </button>
        </div>

        <div className="my-10">
          <h3 className="header !text-xl !mb-3 !mt-3">Hotel Booking</h3>
          <RecentBookings props={bookings} />
        </div>
      </div>
    </Spin>
  ) : (
    <>You are not an admin, you cannot access this page.</>
  );
};

export default AdminDashboard;
