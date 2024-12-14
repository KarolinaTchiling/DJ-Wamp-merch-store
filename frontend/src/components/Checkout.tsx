import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/Button.tsx";
import { useTokenContext } from "../components/TokenContext.tsx";

interface AccountInfo {
  cc_info: string;
  expiry: string;
  cvv: string;
  street: string;
  city: string;
  province: string;
  postal_code: string;
}

const Checkout: React.FC = () => {
  const [accountData, setAcctData] = useState<AccountInfo>({
    cc_info: "",
    expiry: "",
    cvv: "",
    street: "",
    city: "",
    province: "",
    postal_code: "",
  });

  const [isEditCC, setIsEditCC] = useState(false);
  const [isEditAddress, setIsEditAddress] = useState(false);

  useEffect(() => {
    axios({
      method: "get",
      baseURL: "http://127.0.0.1:5000",
      url: "/user/",
    })
      .then((response) => {
        const resp = response.data;
        setAcctData({
          cc_info: resp.user.cc_info || "",
          expiry: "",
          cvv: "",
          street: resp.user.street || "",
          city: resp.user.city || "",
          province: resp.user.province || "",
          postal_code: resp.user.postal_code || "",
        });
      })
      .catch((error) => console.error(error));
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setAcctData((prev) => ({ ...prev, [name]: value }));
  }

  function editUserCC(event: React.FormEvent) {
    event.preventDefault();
    axios({
      method: "patch",
      baseURL: "http://127.0.0.1:5000",
      url: "/user/cc",
      data: {
        cc_info: `${accountData.cc_info}-${accountData.expiry}-${accountData.cvv}`,
      },
    })
      .then(() => {
        setIsEditCC(false);
        alert("Payment Information Updated!");
      })
      .catch((error) => console.error(error));
  }

  function editUserAddress(event: React.FormEvent) {
    event.preventDefault();
    axios({
      method: "patch",
      baseURL: "http://127.0.0.1:5000",
      url: "/user/",
      data: {
        street: accountData.street,
        city: accountData.city,
        province: accountData.province,
        postal_code: accountData.postal_code,
      },
    })
      .then(() => {
        setIsEditAddress(false);
        alert("Shipping Address Updated!");
      })
      .catch((error) => console.error(error));
  }

  const fieldStyle =
    "text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel";
  const labelDivStyle = "mb-4 w-full";

  return (
    <div className="grid gap-8">
      {/* Payment Information */}
      <div>
        <p className="text-3xl mb-6">Payment Information</p>
        {isEditCC ? (
          <form onSubmit={editUserCC}>
            <div className="grid grid-cols-2 gap-4">
              <div className={labelDivStyle}>
                <label htmlFor="cc_info">Credit Card Number</label>
                <input
                  id="cc_info"
                  name="cc_info"
                  type="text"
                  value={accountData.cc_info}
                  onChange={handleChange}
                  className={fieldStyle}
                  placeholder="16 digits"
                />
              </div>
              <div className={labelDivStyle}>
                <label htmlFor="expiry">Expiry Date (MMYY)</label>
                <input
                  id="expiry"
                  name="expiry"
                  type="text"
                  value={accountData.expiry}
                  onChange={handleChange}
                  className={fieldStyle}
                  placeholder="MMYY"
                />
              </div>
              <div className={labelDivStyle}>
                <label htmlFor="cvv">CVV</label>
                <input
                  id="cvv"
                  name="cvv"
                  type="text"
                  value={accountData.cvv}
                  onChange={handleChange}
                  className={fieldStyle}
                  placeholder="3 digits"
                />
              </div>
            </div>
            <Button type="submit">Save Payment Info</Button>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className={labelDivStyle}>
              <label>Credit Card</label>
              <p>************</p>
            </div>
            <Button onClick={() => setIsEditCC(true)}>
              {accountData.cc_info ? "Update Card" : "Add Card"}
            </Button>
          </div>
        )}
      </div>

      {/* Shipping Address */}
      <div>
        <p className="text-3xl mb-6">Shipping Address</p>
        {isEditAddress ? (
          <form onSubmit={editUserAddress}>
            <div className="grid grid-cols-2 gap-4">
              <div className={labelDivStyle}>
                <label htmlFor="street">Street Address</label>
                <input
                  id="street"
                  name="street"
                  type="text"
                  value={accountData.street}
                  onChange={handleChange}
                  className={fieldStyle}
                  placeholder="Street Address"
                />
              </div>
              <div className={labelDivStyle}>
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={accountData.city}
                  onChange={handleChange}
                  className={fieldStyle}
                  placeholder="City"
                />
              </div>
              <div className={labelDivStyle}>
                <label htmlFor="province">Province</label>
                <input
                  id="province"
                  name="province"
                  type="text"
                  value={accountData.province}
                  onChange={handleChange}
                  className={fieldStyle}
                  placeholder="Province"
                />
              </div>
              <div className={labelDivStyle}>
                <label htmlFor="postal_code">Postal Code</label>
                <input
                  id="postal_code"
                  name="postal_code"
                  type="text"
                  value={accountData.postal_code}
                  onChange={handleChange}
                  className={fieldStyle}
                  placeholder="Postal Code"
                />
              </div>
            </div>
            <Button type="submit">Save Address</Button>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className={labelDivStyle}>
              <label>Street Address</label>
              <p>{accountData.street}</p>
            </div>
            <div className={labelDivStyle}>
              <label>City</label>
              <p>{accountData.city}</p>
            </div>
            <div className={labelDivStyle}>
              <label>Province</label>
              <p>{accountData.province}</p>
            </div>
            <div className={labelDivStyle}>
              <label>Postal Code</label>
              <p>{accountData.postal_code}</p>
            </div>
            <Button onClick={() => setIsEditAddress(true)}>Edit Address</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
