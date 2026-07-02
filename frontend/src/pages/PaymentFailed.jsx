import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentFailed() {

    const navigate = useNavigate();

    return (

        <div className="min-h-screen flex justify-center items-center bg-gray-100">

            <div className="bg-white rounded-xl shadow-xl p-10 w-[500px]">

                <div className="flex justify-center">

                    <XCircle

                        size={80}

                        className="text-red-600"

                    />

                </div>

                <h1 className="text-3xl font-bold text-center mt-5 text-red-600">

                    Payment Failed

                </h1>

                <p className="text-center mt-4 text-gray-500">

                    Your payment was not completed.

                </p>

                <button

                    onClick={() => navigate("/customer/orders")}

                    className="w-full bg-red-600 text-white rounded-lg py-3 mt-8"

                >

                    Retry Payment

                </button>

                <button

                    onClick={() => navigate("/")}

                    className="w-full border py-3 rounded-lg mt-3"

                >

                    Continue Shopping

                </button>

            </div>

        </div>

    );

}