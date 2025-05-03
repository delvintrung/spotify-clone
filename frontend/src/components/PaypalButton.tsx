import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { axiosInstance } from "@/lib/axios";

const PayPalButton: React.FC = () => {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: "0.01",
            currency_code: "USD",
          },
        },
      ],
    });
  };

  const onApprove = (data: any, actions: any) => {
    return actions.order.capture().then(async (details: any) => {
      const payerName = details.payer?.name?.given_name || "Người dùng";
      const csrfResponse = await axiosInstance.get("users/get-csrf-token", {
        withCredentials: true,
      });
      const csrfToken = csrfResponse.data.csrfToken;
      const res = await axiosInstance.post("/users/buy-premium", {
        headers: {
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      });
      if (res.status === 200) {
        setSuccess(true);
        console.log("Mua premium thành công!");
        alert(`Thanh toán thành công bởi ${payerName}`);
        console.log("Chi tiết giao dịch:", details);
      } else {
        setError("Đã có lỗi xảy ra trong quá trình thanh toán.");
        console.error("Lỗi thanh toán:", res.data.message);
      }
    });
  };

  // Hàm xử lý lỗi
  const onError = (err: any) => {
    setError("Đã có lỗi xảy ra trong quá trình thanh toán.");
    console.error("Lỗi thanh toán:", err);
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId:
          "AcGSxIG1RA1ET5wLdUsik5nzOVUhfWllT_hpplAThEmNH90YezGqlZ_SJloUxdJgbIzsfG2tfJlysdYn",
        currency: "USD",
      }}
    >
      <div style={{ maxWidth: "300px", margin: "20px auto" }}>
        {success ? (
          <h3>Thanh toán thành công!</h3>
        ) : (
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
          />
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
