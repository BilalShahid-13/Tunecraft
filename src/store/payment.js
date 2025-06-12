import { musicPlans } from "@/lib/Constant";
import { create } from "zustand";

const usePaymentStore = create((set) => ({
  paymentRecords: [], // your mapped tableData
  totalEarnings: 0,
  pendingPayment: 0,
  isFetched: false,

  addPayments: (data) => {
    // 1) filter to only known plans
    const validPlanNames = new Set(musicPlans.map((p) => p.plan));
    const filtered = data.filter((item) => validPlanNames.has(item.plan.name));
    // 2) map into the shape you want
    const tableData = filtered.map((item) => {
      const planDetails = musicPlans.find((p) => p.plan === item.plan.name);
      const rolePrice = planDetails?.[item.crafterRole] ?? 0;

      return {
        projectName: item.projectName,
        price: rolePrice,
        date: item.assignedDate,
        status: item.paymentStatus,
        orderId: item.orderId,
        userId: item.crafterId,
      };
    });

    // 3) calculate totals
    const totalEarnings = tableData.reduce((sum, r) => sum + r.price, 0);
    const pendingPayment = tableData
      .filter((r) => r.status !== "completed")
      .reduce((sum, r) => sum + r.price, 0);

    // 4) write everything back into your store
    set({
      paymentRecords: tableData,
      totalEarnings,
      pendingPayment,
      isFetched: true,
    });
  },
}));

export default usePaymentStore;
