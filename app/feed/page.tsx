"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RotatingTaco } from "@/components/FoodAnimations";
import { format } from "date-fns";

interface LunchUpdate {
  id: string;
  broughtLunch: boolean;
  foodRequest: string | null;
  createdAt: string;
  user: {
    name: string;
    employeeId: string;
  };
}

export default function FeedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [updates, setUpdates] = useState<LunchUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchUpdates();
      const interval = setInterval(() => {
        fetchUpdates();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const fetchUpdates = async () => {
    try {
      const res = await fetch("/api/lunch?all=true");
      const data = await res.json();
      // API already filters based on role:
      // - Admin sees all messages
      // - Employees see only last 2 days and only "didn't bring lunch"
      setUpdates(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching updates:", error);
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RotatingTaco />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-lunch-light via-white to-lunch-light">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="text-5xl mb-2"
          >
            💬
          </motion.h1>
          <h2 className="text-3xl font-bold text-lunch-dark mb-2">
            Lunch Announcement Board
          </h2>
          <p className="text-lunch-orange">
            {session?.user.role === "ADMIN" 
              ? "All lunch updates (past & present) 📋" 
              : "Who's ordering lunch today? (Last 2 days) 🍕🍔🌮"}
          </p>
        </div>

        <Card className="p-6">
          {updates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-4">🍽️</p>
              <p className="text-gray-500 text-lg">
                No one has ordered lunch yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {updates.map((update, index) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-lunch-orange flex items-center justify-center text-white font-bold text-lg">
                      {update.user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-lg border-2 border-lunch-yellow">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-lunch-dark">
                          {update.user.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(update.createdAt), "h:mm a")}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-sm text-gray-600">
                          ❌ Didn&apos;t bring lunch
                        </span>
                      </div>
                      {update.foodRequest && (
                        <div className="mt-3 p-3 bg-lunch-light rounded-xl">
                          <p className="text-lunch-dark font-medium">
                            🍴 &ldquo;{update.foodRequest}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 ml-2">
                      {format(new Date(update.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        <div className="text-center mt-6">
          <Button
            variant="secondary"
            onClick={() =>
              router.push(
                session?.user.role === "ADMIN" ? "/admin" : "/dashboard"
              )
            }
          >
            ← Back to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

