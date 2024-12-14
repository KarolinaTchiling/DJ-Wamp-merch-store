import React, { useState } from "react";
import axios from "axios";
import Button from "../components/Button.tsx";
import { useCartContext } from "../cart/CartContext";
import { useTokenContext } from "../components/TokenContext";
import {useOrderDialog} from '../components/OrderDialog.tsx';
import { useNavigate } from 'react-router-dom';

interface AccountInfo {
  fname: string;
  lname: string;
  email: string;
  password: string;
  card: string;
  expiry: string;
  cvv: string;
  street: string;
  city: string;
  province: string;
  postal: string;
}

const CheckoutGuest: React.FC = () => {
  const [accountData, setAcctData] = useState<AccountInfo>({
    fname: "",
    lname: "",
    email: "",
    password: "",
    card: "",
    expiry: "",
    cvv: "",
    street: "",
    city: "",
    province: "",
    postal: "",
  });
  const { handleCartMergeOnLogin } = useCartContext(); // Access cart merge logic
  const { setToken, setUserType } = useTokenContext(); // Access token handling logic
  const showOrderDialog = useOrderDialog();
  const navigate = useNavigate();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setAcctData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const {
      fname,
      lname,
      email,
      password,
      card,
      expiry,
      cvv,
      street,
      city,
      province,
      postal,
    } = accountData;

    if (!fname || !lname || !email || !password || !card || !street || !city || !province || !postal) {
      alert("Please fill in all required fields.");
      return;
    }

    const formattedCard = `${card}-${expiry}-${cvv}`; // Combine card fields

    try {
      // Step 1: Submit the user creation form
      await axios.post("http://127.0.0.1:5000/signup", {
        fname,
        lname,
        email,
        password,
        card: formattedCard,
        street,
        city,
        province,
        postal,
      });

      // alert("User registered successfully!");

      // Step 2: Automatically log the user in
      const loginResponse = await axios.post("http://127.0.0.1:5000/login", {
        email,
        password,
      });

      const token = loginResponse.data.token;
      setToken(token); // Save the token in the context or localStorage for future use
      setUserType("user");

      // Step 3: Merge frontend and backend carts
      await handleCartMergeOnLogin();

      // Step 4: Make the sale
      const saleResponse = await axios.post(
        "http://127.0.0.1:5000/sale/",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await showOrderDialog();
      navigate('/order-history');
      // alert(saleResponse.data.message || "Sale recorded successfully!");

    } catch (error: any) {
      console.error("Error during checkout process:", error);
      alert(
        error.response?.data?.error ||
          "An error occurred during the checkout process. Please try again."
      );
    }
  }

  const fieldStyle = "text-camel bg-transparent w-full mt-1 py-1 px-2 border border-camel";

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p className="-mt-5 text-2xl pb-5">Make an Account to Checkout</p>

        {/* Scrollable Form Section */}
        <div className="overflow-y-auto h-[calc(100vh-380px)] scrollbar-hidden">

          <div className="flex flex-row align-items-center justify-between pb-10">
            <p className="text-xl">Already have Account?</p>
            <Button className="m-0 px-10"
            onClick={() => navigate('/login')}> Sign In</Button>
          </div>

          <div className="grid gap-8">
            {/* First-Time User Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="fname">First Name</label>
                <input
                  id="fname"
                  name="fname"
                  type="text"
                  value={accountData.fname}
                  onChange={handleChange}
                  className={fieldStyle}
                />
              </div>
              <div>
                <label htmlFor="lname">Last Name</label>
                <input
                  id="lname"
                  name="lname"
                  type="text"
                  value={accountData.lname}
                  onChange={handleChange}
                  className={fieldStyle}
                />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={accountData.email}
                  onChange={handleChange}
                  className={fieldStyle}
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={accountData.password}
                  onChange={handleChange}
                  className={fieldStyle}
                />
              </div>
            </div>

            {/* Payment Information */}
            <div className="grid grid-cols-1 gap-4">
              <label className="text-xl mt-8">Payment Information</label>
              <div>
                <label htmlFor="card">Credit Card Number</label>
                <input
                  id="card"
                  name="card"
                  type="text"
                  value={accountData.card}
                  onChange={handleChange}
                  className={fieldStyle}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry">Expiry (MMYY)</label>
                  <input
                    id="expiry"
                    name="expiry"
                    type="text"
                    value={accountData.expiry}
                    onChange={handleChange}
                    className={fieldStyle}
                  />
                </div>
                <div>
                  <label htmlFor="cvv">CVV</label>
                  <input
                    id="cvv"
                    name="cvv"
                    type="text"
                    value={accountData.cvv}
                    onChange={handleChange}
                    className={fieldStyle}
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="grid grid-cols-2 gap-4">
              <label className="text-xl mt-8 col-span-2">Shipping Address</label>
              <div>
                <label htmlFor="street">Street Address</label>
                <input
                  id="street"
                  name="street"
                  type="text"
                  value={accountData.street}
                  onChange={handleChange}
                  className={fieldStyle}
                />
              </div>
              <div>
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={accountData.city}
                  onChange={handleChange}
                  className={fieldStyle}
                />
              </div>
              <div>
                <label htmlFor="province">Province</label>
                <input
                  id="province"
                  name="province"
                  type="text"
                  value={accountData.province}
                  onChange={handleChange}
                  className={fieldStyle}
                />
              </div>
              <div>
                <label htmlFor="postal">Postal Code</label>
                <input
                  id="postal"
                  name="postal"
                  type="text"
                  value={accountData.postal}
                  onChange={handleChange}
                  className={fieldStyle}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Button Outside Scrollable Section */}
        <div className="mt-6">
          <Button
            type="submit"
            className="w-full py-2 bg-tea text-coffee"
          >
            Place Order
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutGuest;


  

