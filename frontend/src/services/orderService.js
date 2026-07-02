import api from "./api";

const orderService = {

    // Place Order
    placeOrder: async (orderData) => {
        const res = await api.post("/orders", orderData);
        return res.data;
    },

    // My Orders
    getOrders: async () => {
        const res = await api.get("/orders");
        return res.data;
    },

    // Single Order
    getOrder: async (id) => {
        const res = await api.get(`/orders/${id}`);
        return res.data;
    },

    // Cancel Order
    cancelOrder: async (id, reason) => {
        const res = await api.put(`/orders/${id}/cancel`, {
            reason,
        });

        return res.data;
    },

    submitReview: async (data) => {

        const res = await api.post(

            "/reviews",

            data

        );

        return res.data;

    },

    // Download Invoice
    downloadInvoice: async (id) => {

        const token = localStorage.getItem("token");

        const response = await fetch(

            `http://localhost:5001/api/orders/${id}/invoice`,

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        if (!response.ok) {

            throw new Error("Unable to download invoice");

        }

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = `Invoice-${id}.pdf`;

        a.click();

        window.URL.revokeObjectURL(url);

    },

    getCoupons: async () => {

        const response = await api.get("/orders/coupons");

        return response.data;

    },

    applyCoupon: async (data) => {
        const response = await api.post("/orders/coupons/apply", data);
        return response.data;
    },

    
};

export default orderService;