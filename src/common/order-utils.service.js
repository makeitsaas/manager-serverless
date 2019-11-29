export const OrderUtilsService = {
  formatReport(report) {
    console.log("report", report);

    const steps =
      (report &&
        report.steps.map(step => ({
          ...step
        }))) ||
      [];

    const pointers =
      (report &&
        report.pointers.map(pointer => ({
          ...pointer
        }))) ||
      [];

    return {
      steps,
      pointers
    };
  },
  getOrderStatusName(report) {
    console.log("order", report);

    return (report && report.statusName) || "unknown";
  }
};

export default OrderUtilsService;
