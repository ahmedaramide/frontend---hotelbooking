import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { BsCartFill } from "react-icons/bs";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineAccountCircle, MdHotel } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { BsUpload } from "react-icons/bs";
import Swal from "sweetalert2";
import { getUserLocally, logout } from "../utils/helpers";

const DashboardLayout = ({ cartChanged = false, children }) => {
  const [user, setUser] = useState({});

  const [cartLength, setCartLength] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartLength(cart?.length);
  }, [cartChanged]);

  // This useEffect will run once the page is loaded but before the HTML content is displayed
  useEffect(() => {
    // Get user signed in
    getUserLocally().then((user) => {
      setUser(user);
    });
  }, []);

  // state to manage the sidebar
  const [visible, setVisible] = React.useState(false);

  // This is from react to goto a page or route to a page, it monitors the state of the routes
  const navigate = useNavigate();

  // function to show drawer of the sidebar
  const showDrawer = () => {
    setVisible(true);
  };

  // function to close the sidebar drawer
  const onClose = () => {
    setVisible(false);
  };

  // function to handle logout
  const handleLogout = () => {
    Swal.fire({
      title: "Warning!",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/sign-in");
      }
    });
  };

  return (
    <>
      <div className="bg-white flex flex-col">
        <div className="sticky bg-white z-[100] top-0">
          <div className="flex justify-between items-center p-4 px-12">
            <MenuOutlined
              className="text-[28px] hidden mxs:block"
              onClick={() => showDrawer()}
            />
            <Link to="/">
              <p className="text-[50px] font-semibold text-[#df3d4e] mxs:text-[35px] xxs:text-[29px]">
                HOTEL
              </p>
            </Link>

            <div className="flex flex-row items-center gap-4 mxs:hidden">
              <NavLink
                to="/"
                style={({ isActive }) =>
                  isActive ? { background: "#df3d4e", color: "white" } : {}
                }
                className="flex items-center text-[16px] font-semibold py-3 rounded-2xl px-3 hover:bg-red-800 hover:text-white transition-colors"
              >
                <AiFillHome size="1.2rem" className="mr-4" /> Home
              </NavLink>

              <NavLink
                to="/hotels"
                style={({ isActive }) =>
                  isActive ? { background: "#df3d4e", color: "white" } : {}
                }
                className="flex items-center text-[16px] font-semibold py-3 rounded-2xl px-3 hover:bg-red-800 hover:text-white transition-colors"
              >
                <MdHotel size="1.2rem" className="mr-4" /> Hotels
              </NavLink>

              <NavLink
                to="/cart"
                style={({ isActive }) =>
                  isActive ? { background: "#df3d4e", color: "white" } : {}
                }
                className="flex items-center text-[16px] font-semibold py-3 rounded-2xl px-3 hover:bg-red-800 hover:text-white transition-colors"
              >
                <BsCartFill size="1.2rem" className="mr-4" /> Cart ({cartLength}
                )
              </NavLink>
            </div>

            {user && user?.userId ? (
              <div className="mxs:hidden flex flex-row gap-3">
                <p
                  onClick={() => navigate("/profile")}
                  className="flex flex-row items-center gap-2 cursor-pointer"
                >
                  <MdOutlineAccountCircle size="1.5rem" /> {user?.username}
                </p>
                {user?.role === "admin" && (
                  <p
                    onClick={() => navigate("/admin")}
                    className="flex items-center text-[16px] font-semibold py-3 rounded-2xl px-3 hover:bg-red-800 hover:text-white transition-colors cursor-pointer"
                  >
                    Admin
                  </p>
                )}
                <p
                  onClick={handleLogout}
                  className="flex items-center text-[16px] font-semibold py-3 rounded-2xl px-3 hover:bg-red-800 hover:text-white transition-colors cursor-pointer"
                >
                  Logout
                </p>
              </div>
            ) : (
              <div className="flex flex-row items-center gap-4 mxs:hidden">
                <NavLink
                  to="/sign-in"
                  style={({ isActive }) =>
                    isActive ? { background: "#df3d4e", color: "white" } : {}
                  }
                  className="flex items-center text-[16px] font-semibold py-3 rounded-2xl px-3 hover:bg-red-800 hover:text-white transition-colors"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/sign-up"
                  style={({ isActive }) =>
                    isActive ? { background: "#df3d4e", color: "white" } : {}
                  }
                  className="flex items-center text-[16px] font-semibold py-3 rounded-2xl px-3 hover:bg-red-800 hover:text-white transition-colors"
                >
                  Sign Up
                </NavLink>
              </div>
            )}

            <Drawer
              title={
                <p className="text-[60px] font-semibold text-[#df3d4e]">
                  HOTEL
                </p>
              }
              placement="left"
              bodyStyle={{ background: "#ffffff", padding: 0 }}
              onClose={onClose}
              open={visible}
            >
              <NavLink
                to="/"
                style={({ isActive }) =>
                  isActive ? { background: "#df3d4e", color: "white" } : {}
                }
                className="flex items-center text-[16px] font-semibold py-3 rounded-2xl px-3"
              >
                <AiFillHome size="1.2rem" className="mr-4" /> Home
              </NavLink>

              <NavLink
                to="/hotels"
                style={({ isActive }) =>
                  isActive ? { background: "#df3d4e", color: "white" } : {}
                }
                className="flex items-center text-[16px] font-semibold py-3 rounded-2xl px-3"
              >
                <MdHotel size="1.2rem" className="mr-4" />
                Hotels
              </NavLink>
              <NavLink
                to="/cart"
                style={({ isActive }) =>
                  isActive ? { background: "#df3d4e", color: "white" } : {}
                }
                className="flex items-center text-[16px] font-semibold py-3 rounded-2xl px-3"
              >
                <BsCartFill size="1.2rem" className="mr-4" />
                Cart ({cartLength})
              </NavLink>
              {!user?.userId && (
                <>
                  <NavLink
                    to="/sign-in"
                    style={({ isActive }) =>
                      isActive ? { background: "#df3d4e", color: "white" } : {}
                    }
                    className="flex items-center text-[16px] font-semibold py-3 rounded-2xl px-3"
                  >
                    <AiOutlineLogout size="1.2rem" className="mr-4" />
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/sign-up"
                    style={({ isActive }) =>
                      isActive ? { background: "#df3d4e", color: "white" } : {}
                    }
                    className="flex items-center text-[16px] font-semibold py-3 rounded-2xl px-3"
                  >
                    <BsUpload size="1.2rem" className="mr-4" />
                    Sign Up
                  </NavLink>
                </>
              )}

              {user && user?.userId && (
                <>
                  <NavLink
                    to="/profile"
                    style={({ isActive }) =>
                      isActive ? { background: "#df3d4e", color: "white" } : {}
                    }
                    className="flex items-center text-[16px] font-semibold py-3 rounded-2xl px-3"
                  >
                    <MdOutlineAccountCircle size="1.2rem" className="mr-4" />
                    Profile
                  </NavLink>
                  {user?.role === "admin" && (
                    <NavLink
                      to="/admin"
                      style={({ isActive }) =>
                        isActive
                          ? { background: "#df3d4e", color: "white" }
                          : {}
                      }
                      className="flex items-center text-[16px] font-semibold py-3 rounded-2xl px-3"
                    >
                      <MdOutlineAccountCircle size="1.2rem" className="mr-4" />
                      Admin Dashboard
                    </NavLink>
                  )}
                  <button
                    onClick={() => handleLogout()}
                    className="flex items-center text-[16px] font-semibold py-3 rounded-2xl px-3"
                  >
                    <AiOutlineLogout size="1.2rem" className="mr-4" />
                    Logout
                  </button>
                </>
              )}
            </Drawer>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-1 mxs:col-span-1 bg-[#f7f6f4] min-h-[90vh] px-3 py-5">
          {children}
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
