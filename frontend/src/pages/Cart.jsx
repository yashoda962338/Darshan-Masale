import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { config } from "../config";

const Cart = () => {
  const navigate = useNavigate();

  const { language } = useLanguage();

  const {
    cart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
  } = useCart();

  const cartItems = cart?.items || [];

  const totalPrice = getTotalPrice ? getTotalPrice() : 0;

  const totalItems = getTotalItems ? getTotalItems() : 0;

  const freeShipping =
    totalPrice >= (config?.shipping?.freeShippingThreshold || 500);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    navigate("/checkout");
  };

  return (
    <>
      <Helmet>
        <title>Cart - Darshan Masale</title>
        <meta
          name="description"
          content="Your shopping cart at Darshan Masale."
        />
      </Helmet>
      <section className="section-padding bg-background-cream">
        <div className="container-custom">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="heading-section text-primary-maroon">
                {language === "mr" ? "खरेदी कार्ट" : "Shopping Cart"}
              </h1>

              <p className="subheading mt-1">
                {totalItems} {language === "mr" ? "वस्तू" : "items"} in your cart
              </p>
            </div>

            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-text-muted hover:text-primary-maroon transition-colors"
              >
                {language === "mr" ? "सर्व काढा" : "Clear All"}
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <ShoppingBag className="w-16 h-16 text-text-muted/30 mx-auto" />

              <h3 className="font-heading text-xl text-primary-maroon mt-4">
                {language === "mr"
                  ? "कार्ट रिक्त आहे"
                  : "Your cart is empty"}
              </h3>

              <p className="text-text-muted mt-2">
                {language === "mr"
                  ? "आमचे उत्तम मसाले पहा"
                  : "Explore our premium spices"}
              </p>

              <Link
                to="/shop"
                className="btn-primary inline-block mt-6"
              >
                {language === "mr"
                  ? "खरेदी सुरू करा"
                  : "Start Shopping"}
              </Link>
            </motion.div>
          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

              {/* LEFT SIDE */}

              <div className="lg:col-span-2 space-y-4">

                {cartItems.map((item, index) => {

                  const variant = item.variantId || {};

                  const product = variant.productId || {};

                  const name =
                    language === "mr"
                      ? product.nameMr
                      : product.name;

                  const image =
                    product?.images?.[0]?.url ||
                    "/images/placeholder.jpg";

                  const price =
                    item.price ||
                    variant.sellingPrice ||
                    0;

                  return (

                    <motion.div
                      key={item._id || index}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                      }}
                      className="card-premium p-4 flex gap-4"
                    >

                      <img
                        src={image}
                        alt={name}
                        className="w-20 h-20 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src =
                            "/images/placeholder.jpg";
                        }}
                      />

                      <div className="flex-1">

                        <div className="flex justify-between">

                          <div>

                            <h4 className="font-heading font-semibold text-primary-maroon">

                              {name}

                            </h4>

                            <span className="text-xs text-text-muted">

                              {variant.weight} {variant.unit}

                            </span>

                          </div>

                          <button
                            onClick={() =>
                              removeFromCart(item._id)
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                        <div className="flex justify-between mt-4">

                          <div className="flex items-center border rounded-full">

                            <button
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  item.quantity - 1
                                )
                              }
                              className="px-3 py-2"
                            >
                              <Minus size={14} />
                            </button>

                            <span className="px-4">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  item.quantity + 1
                                )
                              }
                              className="px-3 py-2"
                            >
                              <Plus size={14} />
                            </button>

                          </div>

                          <div className="font-bold text-primary-maroon">

                            ₹
                            {(
                              price *
                              item.quantity
                            ).toFixed(0)}

                          </div>

                        </div>

                      </div>

                    </motion.div>

                  );

                })}

              </div>
              {/* RIGHT SIDE */}

              <div>

                <div className="card-premium p-6 sticky top-24">

                  <h3 className="font-heading text-xl font-semibold text-primary-maroon">
                    {language === "mr"
                      ? "ऑर्डर सारांश"
                      : "Order Summary"}
                  </h3>

                  <div className="space-y-3 mt-4 border-t border-secondary-gold/10 pt-4">

                    <div className="flex justify-between text-sm">

                      <span className="text-text-muted">
                        Subtotal ({totalItems} items)
                      </span>

                      <span className="font-medium">
                        ₹{totalPrice.toFixed(0)}
                      </span>

                    </div>

                    <div className="flex justify-between text-sm">

                      <span className="text-text-muted">
                        Shipping
                      </span>

                      <span className="font-medium">

                        {freeShipping
                          ? "FREE"
                          : `₹${config?.shipping?.standardCost || 50}`}

                      </span>

                    </div>

                    {!freeShipping && totalPrice > 0 && (

                      <div className="flex justify-between text-xs text-text-muted">

                        <span>

                          Add ₹
                          {(config?.shipping?.freeShippingThreshold || 500) -
                            totalPrice}
                          {" "}more for FREE Delivery

                        </span>

                      </div>

                    )}

                    <div className="border-t border-secondary-gold/10 pt-3 flex justify-between">

                      <span className="font-heading text-lg font-semibold text-primary-maroon">

                        Total

                      </span>

                      <span className="font-heading text-2xl font-bold text-primary-maroon">

                        ₹
                        {(
                          totalPrice +
                          (freeShipping
                            ? 0
                            : config?.shipping?.standardCost || 50)
                        ).toFixed(0)}

                      </span>

                    </div>

                  </div>

                  {/* ✅ CHECKOUT BUTTON */}

                  <button

                    onClick={handleCheckout}

                    className="w-full mt-6 btn-gold flex items-center justify-center gap-2"

                  >

                    <span>

                      {language === "mr"
                        ? "चेकआउट करा"
                        : "Proceed to Checkout"}

                    </span>

                    <ArrowRight className="w-4 h-4" />

                  </button>

                  <Link

                    to="/shop"

                    className="block text-center text-sm text-text-muted hover:text-primary-maroon transition-colors mt-4"

                  >

                    {language === "mr"
                      ? "खरेदी सुरू ठेवा"
                      : "Continue Shopping"}

                  </Link>

                </div>

              </div>

            </div>

          )}

        </div>

      </section>
    </>
  );
};

export default Cart;
