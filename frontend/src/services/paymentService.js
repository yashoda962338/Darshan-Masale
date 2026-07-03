import api from "./api";

const paymentService = {

    createOrder: async (orderId) => {

        const res = await api.post("/payments/create-order", {
            orderId
        });

        console.log("PAYMENT API RESPONSE");
        console.log(res.data);

        return res.data;

    },

    verify: async (orderId) => {

        const res = await api.get(`/payments/verify/${orderId}`);

        return res.data;

    },

    retryPayment: async (orderId) => {

        const res = await api.post(`/payments/retry/${orderId}`);

        return res.data;

    }

};

export default paymentService;