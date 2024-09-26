import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../utils/request";

export const queryClassTeacher = async (teacher: string, params?: any) => {
  return await API.get(
    `classes?join=teacher&filter[0]=teacher.id||$eq||${teacher}`,
    {
      params,
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("accessToken")}`,
      },
    }
  );
};
