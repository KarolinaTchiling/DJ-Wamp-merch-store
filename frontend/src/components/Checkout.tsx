import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/Button.tsx";
import {useOrderDialog} from '../components/OrderDialog.tsx';
import { useNavigate } from 'react-router-dom';

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
  const [maskedCC, setMaskedCC] = useState("************");
  const [noCard, setNoCard] = useState(false);
  const [isEditCC, setIsEditCC] = useState(false);
  const [isEditAddress, setIsEditAddress] = useState(false);
  const showOrderDialog = useOrderDialog();
  const navigate = useNavigate();


  useEffect(() => {
    // Fetch account data
    axios({
      method: "get",
      baseURL: "http://127.0.0.1:5000",
      url: "/user/",
    })
      .then((response) => {
        const resp = response.data;

        if (resp.user && resp.user.cc_info) {
          setAcctData({
            cc_info: resp.user.cc_info || "",
            expiry: "",
            cvv: "",
            street: resp.user.street || "",
            city: resp.user.city || "",
            province: resp.user.province || "",
            postal_code: resp.user.postal_code || "",
          });

          // Fetch decoded credit card number
          axios({
            method: "get",
            baseURL: "http://127.0.0.1:5000",
            url: "/user/cc",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then((ccResponse) => {
              const decodedCC = ccResponse.data.cc_info;
              if (decodedCC) {
                const cardNumber = decodedCC.split("-")[0];
                const lastFour = cardNumber.slice(-4);
                setMaskedCC(`************${lastFour}`);
                setNoCard(false);
              } else {
                setNoCard(true);
              }
            })
            .catch((error) => {
              console.error("Error fetching decoded credit card info:", error);
              setNoCard(true);
            });
        } else {
          setNoCard(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setNoCard(true);
      });
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setAcctData((prev) => ({ ...prev, [name]: value }));
  }

  function editUserCC(event: React.FormEvent) {
    event.preventDefault();
    const fullCCInfo = `${accountData.cc_info}-${accountData.expiry}-${accountData.cvv}`;
    axios({
      method: "patch",
      baseURL: "http://127.0.0.1:5000",
      url: "/user/cc",
      data: {
        cc_info: fullCCInfo,
      },
    })
      .then(() => {
        const lastFour = accountData.cc_info.slice(-4);
        setMaskedCC(`************${lastFour}`);
        setNoCard(false);
        setIsEditCC(false);
        alert("Payment Information Updated!");
      })
      .catch((error) => console.error(error));
  }

  function editUserAddress(event: React.FormEvent) {
    event.preventDefault();
    const { street, city, province, postal_code } = accountData;

    axios({
      method: "patch",
      baseURL: "http://127.0.0.1:5000",
      url: "user/address",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        street,
        city,
        province,
        postal_code,
      },
    })
      .then(() => {
        setIsEditAddress(false);
        alert("Shipping Address Updated Successfully!");
      })
      .catch((error) => {
        console.error("Error updating address:", error);
        alert("Failed to update the shipping address. Please try again.");
      });
  }

  async function placeOrder() {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/sale/",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      await showOrderDialog();
      window.location.href = '/order-history';
      navigate('/order-history');

      // alert(response.data.message || "Order placed successfully!");
    } catch (error: any) {
      console.error("Error placing order:", error);
      alert(
        error.response?.data?.error || "Failed to place order. Please try again."
      );
    }
  }

  const fieldStyle = "text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel";
  const labelDivStyle = "mb-4 w-full";

  return (
    <div>
   
      <p className="text-2xl mb-6">Confirm your Order</p>
  
      {/* Scrollable Section */}
      <div className="overflow-y-auto h-[calc(100vh-380px)] scrollbar-hidden">
        <div className="grid gap-8">
          {/* Payment Information */}
          <div>
            <p className="text-xl mb-6">Payment Method</p>
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
                      placeholder="Enter 16-digit card number"
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
                <div className="flex space-x-4 mt-4">
                  <Button type="submit">Save Payment Info</Button>
                  <Button
                    type="button"
                    onClick={() => setIsEditCC(false)}
                    className="bg-pink text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className={labelDivStyle}>
                  <label>Credit Card</label>
                  <p>{noCard ? "No card on file" : maskedCC}</p>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setIsEditCC(true);
                      setAcctData((prev) => ({
                        ...prev,
                        cc_info: "",
                        expiry: "",
                        cvv: "",
                      }));
                    }}
                  >
                    {noCard ? "Add Card" : "Update Card"}
                  </Button>
                </div>
              </div>
            )}
          </div>
  
          {/* Shipping Address */}
          <div>
            <p className="text-xl mb-6">Shipping Address</p>
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
                <div className="flex space-x-4 mt-4">
                  <Button type="submit">Save Address</Button>
                  <Button
                    type="button"
                    onClick={() => setIsEditAddress(false)}
                    className="bg-pink text-white"
                  >
                    Cancel
                  </Button>
                </div>
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
                <Button
                  className="-mt-3 w-[120px]"
                  onClick={() => setIsEditAddress(true)}
                >
                  Edit Address
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
  
      {/* Button Outside Scrollable Section */}
      <div className="mt-6">
        <Button
          onClick={placeOrder}
          className="w-full py-2 bg-tea text-coffee rounded"
        >
          Place Order
        </Button>
      </div>
  </div>
  
  );
};

export default Checkout;


