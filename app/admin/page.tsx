"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { RotatingTaco } from "@/components/FoodAnimations";
import { format } from "date-fns";

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  createdAt: string;
}

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

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [updates, setUpdates] = useState<LunchUpdate[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    passcode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      fetchEmployees();
      fetchUpdates();
      const interval = setInterval(() => {
        fetchUpdates();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchUpdates = async () => {
    try {
      const res = await fetch("/api/lunch?all=true");
      const data = await res.json();
      setUpdates(data);
    } catch (error) {
      console.error("Error fetching updates:", error);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create employee");
        return;
      }

      const newEmployee = await res.json();
      await fetchEmployees();
      setFormData({ name: "", passcode: "" });
      setShowAddForm(false);
      alert(`✅ Employee created! Employee ID: ${newEmployee.employeeId}`);
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      const res = await fetch(`/api/employees?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchEmployees();
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
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
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="text-5xl mb-2"
          >
            👨‍💼
          </motion.h1>
          <h2 className="text-3xl font-bold text-lunch-dark mb-2">
            Admin Dashboard
          </h2>
          <p className="text-lunch-orange">Manage employees and view updates</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Employee Management */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-lunch-dark">
                  Employees 👥
                </h3>
                <Button
                  variant="primary"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  {showAddForm ? "Cancel" : "+ Add Employee"}
                </Button>
              </div>

              <AnimatePresence>
                {showAddForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleAddEmployee}
                    className="mb-6 space-y-4 p-4 bg-lunch-light rounded-xl"
                  >
                    <Input
                      label="Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      placeholder="Employee Name"
                    />
                    <Input
                      label="Passcode"
                      type="password"
                      value={formData.passcode}
                      onChange={(e) =>
                        setFormData({ ...formData, passcode: e.target.value })
                      }
                      required
                      placeholder="Login Passcode"
                    />
                    <p className="text-sm text-gray-600 italic">
                      💡 Employee ID will be auto-generated (01, 02, 03...)
                    </p>
                    {error && (
                      <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-2 rounded-xl text-sm">
                        {error}
                      </div>
                    )}
                    <Button type="submit" variant="success" disabled={loading}>
                      {loading ? "Creating..." : "Create Employee"}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {employees.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No employees yet. Add one above!
                  </p>
                ) : (
                  employees.map((employee) => (
                    <motion.div
                      key={employee.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-lunch-light rounded-xl"
                    >
                      <div>
                        <p className="font-semibold text-lunch-dark">
                          {employee.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          ID: {employee.employeeId}
                        </p>
                      </div>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="text-sm px-4 py-2"
                      >
                        Delete
                      </Button>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>

          {/* Real-time Feed */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <h3 className="text-2xl font-bold text-lunch-dark mb-6">
                Live Lunch Feed 💬 (All Messages)
              </h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {updates.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No updates yet
                  </p>
                ) : (
                  updates.map((update) => (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl ${
                        update.broughtLunch
                          ? "bg-green-100 border-2 border-green-300"
                          : "bg-orange-100 border-2 border-orange-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">
                          {update.broughtLunch ? "✅" : "❌"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-lunch-dark">
                              {update.user.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({update.user.employeeId})
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            {update.broughtLunch
                              ? "Brought lunch today"
                              : "Didn't bring lunch"}
                          </p>
                          {update.foodRequest && (
                            <div className="bg-white p-3 rounded-lg mt-2">
                              <p className="text-sm font-semibold text-lunch-dark">
                                💬 "{update.foodRequest}"
                              </p>
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {format(new Date(update.createdAt), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="text-center mt-6">
          <Button
            variant="secondary"
            onClick={() => router.push("/feed")}
            className="mr-4"
          >
            View Full Feed 💬
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

