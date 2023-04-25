import React from "react";
import { Drawer } from "antd";
import "./overlay.css";

const Modal = ({ isOpen, closeModal, children }) => {
  return (
    <>
      {isOpen ? (
        <div className="overlay__wrapper xs:hidden">
          <div className="overlay__wrapper__content">
            <div
              className="overlay__wrapper__content__button"
              onClick={() => closeModal()}
            >
              Close
            </div>
            {children}
          </div>
          <div className="overlay__wrapper__bottom"></div>
        </div>
      ) : null}

      <div>
        <Drawer
          placement="bottom"
          closable={false}
          size={"default"}
          onClose={closeModal}
          open={isOpen}
          rootClassName="hidden xs:block"
          contentWrapperStyle={{
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
          }}
          style={{
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
          }}
        >
          {children}
        </Drawer>
      </div>
    </>
  );
};

export default Modal;
