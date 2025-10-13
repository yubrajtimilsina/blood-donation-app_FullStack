import { publicRequest, userRequest } from "../requestMethods.js";
import { loginFailure, loginStart, loginSuccess } from "./userRedux.js";

export const login = async (dispatch, user) => {
  dispatch(loginStart());

  try {
    const res = await publicRequest.post("/auth/login", user);
    console.log("Login response:", res.data);

    // FIXED: Handle the response structure correctly
    if (res.data.success) {
      dispatch(loginSuccess(res.data));
    } else {
      dispatch(loginFailure());
    }
  } catch (error) {
    console.error("Login error:", error);
    dispatch(loginFailure());
    throw error;
  }
};

// Hospital registration API call
export const registerHospital = async (hospitalData) => {
  return publicRequest.post("/auth/register-hospital", hospitalData);
};

// Donor API calls
export const getDonors = async () => {
  return publicRequest.get("/donors");
};

export const createDonor = async (donorData) => {
  return publicRequest.post("/donors", donorData);
};

export const updateDonor = async (id, donorData) => {
  return userRequest.put(`/donors/${id}`, donorData);
};

export const deleteDonor = async (id) => {
  return userRequest.delete(`/donors/${id}`);
};

// Blood Request API calls
export const getBloodRequests = async () => {
  return publicRequest.get("/bloodRequests");
};

export const createBloodRequest = async (requestData) => {
  return userRequest.post("/bloodRequests", requestData);
};

export const updateBloodRequest = async (id, updateData) => {
  return userRequest.put(`/bloodRequests/${id}`, updateData);
};

export const deleteBloodRequest = async (id) => {
  return userRequest.delete(`/bloodRequests/${id}`);
};

// Hospital API calls
export const getHospitals = async () => {
  return publicRequest.get("/hospitals");
};

// Notification API calls
export const getNotifications = async () => {
  return userRequest.get("/notifications");
};
