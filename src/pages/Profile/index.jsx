import React, { useState, useEffect } from "react";
import * as API from "../../api/index";
import { Spin } from "antd";
import UserRecentBookings from "../../components/UserRecentBookings";
import { getUserLocally } from "../../utils/helpers";

const Profile = () => {
  const [user, setUser] = useState({});

  const [userBookings, setUserBookings] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUserLocally().then((user) => {
      setUser(user);
    });
    setIsLoading(true);
    API.getUserBookings()
      .then((res) => {
        setUserBookings(res?.data?.result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Spin spinning={isLoading}>
      <div className="w-full p-4">
        <h3 className="header !text-3xl !xs:text-xl">Profile Page</h3>

        <div className="w-full flex flex-col mb-10">
          <div className="w-full max-w-[400px] flex flex-row justify-between items-center flex-wrap gap-3 mb-2">
            <h3 className="w-[100px] text-lg font-normal xs:text-sm">
              Username:{" "}
            </h3>
            <h3 className="text-lg font-semibold xs:text-base">
              {user?.username}
            </h3>
          </div>
          <div className="w-full max-w-[400px] flex flex-row justify-between items-center flex-wrap gap-3 mb-2">
            <h3 className="w-[100px] text-lg font-normal xs:text-sm">
              First Name:{" "}
            </h3>
            <h3 className="text-lg font-semibold xs:text-base">
              {user?.firstName}
            </h3>
          </div>
          <div className="w-full max-w-[400px] flex flex-row justify-between items-center flex-wrap gap-3 mb-2">
            <h3 className="w-[100px] text-lg font-normal xs:text-sm">
              Last Name:{" "}
            </h3>
            <h3 className="text-lg font-semibold xs:text-base">
              {user?.lastName}
            </h3>
          </div>
          <div className="w-full max-w-[400px] flex flex-row justify-between items-center flex-wrap gap-3 mb-2">
            <h3 className="w-[100px] text-lg font-normal xs:text-sm">
              Email:{" "}
            </h3>
            <h3 className="text-lg font-semibold xs:text-base">
              {user?.email}
            </h3>
          </div>
        </div>

        <div className="my-10">
          <h3 className="header !text-xl !mb-3 !mt-3">My Bookings</h3>
          <UserRecentBookings props={userBookings} />
        </div>
      </div>
    </Spin>
  );
};

export default Profile;
