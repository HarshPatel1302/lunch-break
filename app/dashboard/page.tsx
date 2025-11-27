"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { BouncingFood, RotatingTaco } from "@/components/FoodAnimations";
import { format } from "date-fns";

interface LunchUpdate {
  id: string;
  broughtLunch: boolean;
  foodRequest: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showFoodInput, setShowFoodInput] = useState(false);
  const [foodRequest, setFoodRequest] = useState("");
  const [loading, setLoading] = useState(false);
  const [updates, setUpdates] = useState<LunchUpdate[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user.role === "ADMIN") {
      router.push("/admin");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user) {
      fetchUpdates();
    }
  }, [session]);

  const fetchUpdates = async () => {
    try {
      const res = await fetch("/api/lunch");
      const data = await res.json();
      setUpdates(data);
    } catch (error) {
      console.error("Error fetching updates:", error);
    }
  };

  const handleLunchUpdate = async (broughtLunch: boolean) => {
    if (!broughtLunch) {
      setShowFoodInput(true);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/lunch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ broughtLunch: true, foodRequest: null }),
      });

      if (res.ok) {
        await fetchUpdates();
        setShowFoodInput(false);
      }
    } catch (error) {
      console.error("Error updating lunch:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFoodRequestSubmit = async () => {
    if (!foodRequest.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/lunch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          broughtLunch: false,
          foodRequest: foodRequest.trim(),
        }),
      });

      if (res.ok) {
        await fetchUpdates();
        setFoodRequest("");
        setShowFoodInput(false);
      }
    } catch (error) {
      console.error("Error submitting food request:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RotatingTaco />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="text-5xl mb-2"
          >
            🍽️
          </motion.h1>
          <h2 className="text-3xl font-bold text-lunch-dark mb-2">
            Welcome, {session.user.name}!
          </h2>
          <p className="text-lunch-orange">Update your lunch status</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="text-center p-8 hover:shadow-2xl transition-shadow">
              <div className="text-6xl mb-4">
                <BouncingFood emoji="✅" />
              </div>
              <h3 className="text-2xl font-bold text-lunch-dark mb-4">
                Brought Lunch
              </h3>
              <Button
                variant="success"
                onClick={() => handleLunchUpdate(true)}
                disabled={submitting}
                className="w-full"
              >
                {submitting ? "Updating..." : "Yes, I brought lunch! 🍱"}
              </Button>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="text-center p-8 hover:shadow-2xl transition-shadow">
              <div className="text-6xl mb-4">
                <BouncingFood emoji="❌" />
              </div>
              <h3 className="text-2xl font-bold text-lunch-dark mb-4">
                Didn&apos;t Bring Lunch
              </h3>
              <Button
                variant="danger"
                onClick={() => handleLunchUpdate(false)}
                disabled={submitting}
                className="w-full"
              >
                No, I need to order 🛒
              </Button>
            </Card>
          </motion.div>
        </div>

        <AnimatePresence>
          {showFoodInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="p-6">
                <h3 className="text-xl font-bold text-lunch-dark mb-4">
                  What do you want to eat today? 🍴
                </h3>
                <Textarea
                  value={foodRequest}
                  onChange={(e) => setFoodRequest(e.target.value)}
                  placeholder="e.g., I want biryani today, I want a sandwich, etc."
                  rows={3}
                  className="mb-4"
                />
                <div className="flex gap-4">
                  <Button
                    variant="primary"
                    onClick={handleFoodRequestSubmit}
                    disabled={submitting || !foodRequest.trim()}
                    className="flex-1"
                  >
                    {submitting ? "Submitting..." : "Submit 🚀"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowFoodInput(false);
                      setFoodRequest("");
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <h3 className="text-2xl font-bold text-lunch-dark mb-4">
              Your Lunch History 📝
            </h3>
            <div className="space-y-4">
              {updates.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No updates yet. Update your lunch status above!
                </p>
              ) : (
                updates.map((update) => (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-xl border-2 ${
                      update.broughtLunch
                        ? "bg-green-50 border-green-200"
                        : "bg-orange-50 border-orange-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">
                            {update.broughtLunch ? "✅" : "❌"}
                          </span>
                          <span className="font-semibold text-lunch-dark">
                            {update.broughtLunch
                              ? "Brought Lunch"
                              : "Didn't Bring Lunch"}
                          </span>
                        </div>
                        {update.foodRequest && (
                          <p className="text-lunch-dark ml-8">
                            💬 &ldquo;{update.foodRequest}&rdquo;
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {format(new Date(update.createdAt), "MMM d, h:mm a")}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        <div className="mt-6 text-center">
          <Button
            variant="secondary"
            onClick={() => router.push("/feed")}
            className="mr-4"
          >
            View Lunch Feed 💬
          </Button>
          <Button
            variant="secondary"
            onClick={async () => {
              await signOut({ callbackUrl: "/login" });
            }}
          >
            Logout
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

