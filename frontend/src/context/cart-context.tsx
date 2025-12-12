"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { Goat } from "@/lib/data";

type CartContextType = {
    items: Goat[];
    addToCart: (goat: Goat) => void;
    removeFromCart: (goatId: string) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    checkout: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<Goat[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("smart-ngangon-cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart from local storage", e);
            }
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("smart-ngangon-cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (goat: Goat) => {
        setItems((prev) => {
            if (prev.find((item) => item.id === goat.id)) {
                return prev; // Prevent duplicates
            }
            return [...prev, goat];
        });
        setIsCartOpen(true); // Open cart when item is added
    };

    const removeFromCart = (goatId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== goatId));
    };

    const clearCart = () => {
        setItems([]);
    };

    const checkout = () => {
        if (items.length === 0) return;

        const phoneNumber = "6281234567890"; // Replace with actual number
        const message = `Halo Smart Ngangon, saya ingin membeli kambing berikut:\n\n${items
            .map((item) => `- ${item.nickname} (${item.id}): ${item.price}`)
            .join("\n")}\n\nMohon info selanjutnya.`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            message,
        )}`;
        window.open(whatsappUrl, "_blank");
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                clearCart,
                isCartOpen,
                setIsCartOpen,
                checkout,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
