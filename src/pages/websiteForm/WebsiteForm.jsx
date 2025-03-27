import React from "react";
import "./websiteForm.scss";
import Input from "../../components/input/Input";

const WebsiteForm = () => {
  const signupFields = [
    {
      label: "Email",
      name: "email",
      placeholderText: "Enter Your E-Mail",
    },
    {
      label: "Password",
      name: "password",
      placeholderText: "Enter Your Password",
    },
  ];
  return (
    <div className="website-form-page">
      <div className="website-form-card">
        <h2>Verification</h2>
        <div className="map"></div>
        <div className="shop-question">
          <p>Do you have the shop?</p>
        </div>
        <div className="fields-card">
          <div className="fields-container">
            {signupFields.map((item, index) => {
              return (
                <div key={index} className="input-single-card">
                  <label>{item.label}</label>
                  <Input initialData={item} />
                </div>
              );
            })}
          </div>
        </div>
        <button className="next-button">Next</button>
      </div>
    </div>
  );
};

export default WebsiteForm;
