import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../utils/request";

export const queryAttendanceClass = async (classes: string, params?: any) => {
  return await API.get(
    `attendances?join=class&join=student&filter[0]=class.id||$eq||${classes}&sort=attendance_date,DESC`,
    {
      params,
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const queryAttendanceStudent = async (student: string, params?: any) => {
  return await API.get(
    `attendances?join=class&join=student&filter[0]=student.id||$eq||${student}&sort=attendance_date,DESC`,
    {
      params,
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const createAttendance = async (body: any) => {
  return await API.post(`attendances`, body, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("accessToken")}`,
    },
  });
};

export const deleteAttendance = async (id: string) => {
  return await API.delete(`attendances/${id}`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("accessToken")}`,
    },
  });
};
