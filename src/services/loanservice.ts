import api from "./api";

export const fetchApplications = async () => {
  const res = await api.get("/loans");
  return res.data;
};

export const submitApplication = async (data: any) => {
  return api.post("/loans", data);
};

export const updateLoanStatus = async (id: string, status: string, reason: string) => {
  return api.put(`/loans/${id}/status`, { status, reason });
};

export {}; 
