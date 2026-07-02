import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import paymentService from "../services/paymentService";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const orderId = searchParams.get("order_id");

    const [loading, setLoading] = useState(true);

    const [order, setOrder] = useState(null);

    const [payment, setPayment] = useState(null);

    useEffect(() => {

        verify();

    }, []);

    const verify = async () => {

        try {

            const res = await paymentService.verify(orderId);
            console.log(res);

            if (res.payment.order_status !== "PAID") {

                navigate("/payment-failed");

                return;

            }

            console.log(res);

            setOrder(res.order);

            setPayment(res.payment);

            setLoading(false);

            setTimeout(() => {

                window.location.href = "/customer/orders";

            }, 5000);

        }

        catch (err) {

            console.log(err);

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="min-h-screen flex justify-center items-center">

                <h2 className="text-2xl font-semibold">

                    Verifying Payment...

                </h2>

            </div>

        );

    }

    return (

        <div className="min-h-screen flex justify-center items-center bg-gray-100">

            <div className="bg-white shadow-xl rounded-xl p-10 w-[500px]">

                <div className="flex justify-center">

                    <CheckCircle

                        className="text-green-600"

                        size={80}

                    />

                </div>

                <h1 className="text-3xl font-bold text-center text-green-700 mt-4">

                    Payment Successful

                </h1>

                <p className="text-center text-gray-500 mt-2">

                    Thank you for your purchase.

                </p>

                <hr className="my-6" />

                <div className="space-y-3">

                    <div className="flex justify-between">

                        <span>Order Number</span>

                        <b>{order?.orderNumber}</b>

                    </div>

                    <div className="flex justify-between">

                        <span>Amount Paid</span>

                        <b>₹{order?.total}</b>

                    </div>

                    <div className="flex justify-between">

                        <span>Payment Status</span>

                        <span className="text-green-600 font-bold">

                            {order?.paymentStatus}

                        </span>

                    </div>

                    <div className="flex justify-between">

                        <span>Order Status</span>

                        <span className="text-blue-600 font-bold">

                            {order?.status}

                        </span>

                    </div>

                    <div className="flex justify-between">

                        <span>Cashfree Order</span>

                        <small>

                            {payment?.order_id}

                        </small>

                    </div>

                </div>

                <button

                    onClick={() => navigate("/customer/orders")}

                    className="w-full mt-8 bg-green-600 text-white py-3 rounded-lg"

                >

                    View My Orders

                </button>

                <button

                    onClick={() => navigate("/")}

                    className="w-full mt-3 border py-3 rounded-lg"

                >

                    Continue Shopping

                </button>

                <p className="text-center text-sm text-gray-500 mt-5">

                    Redirecting in 5 seconds...

                </p>

            </div>

        </div>

    );

}