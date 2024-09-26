import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../utils/request";
import dayjs from "dayjs";

export const queryStudentInClass = async (
  classes: string,
  date: number = Date.now(),
  params?: any
) => {
  const startDate = dayjs(date).startOf("day").toISOString();
  const endDate = dayjs(date).endOf("day").toISOString();

  const students = API.get(
    `students?join=classes&filter[0]=classes.id||$eq||${classes}&sort=createdAt,ASC`,
    {
      params,
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("accessToken")}`,
      },
    }
  );

  const attendances = API.get(
    `attendances?join=class&join=student&filter[0]=class.id||$eq||${classes}&filter[1]=attendance_date||$between||${startDate},${endDate}`,
    {
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("accessToken")}`,
      },
    }
  );

  const [studentsRes, attendancesRes] = await Promise.all([
    students,
    attendances,
  ]);
  const studentsData = studentsRes.data?.data || [];
  const attendancesData = attendancesRes.data;

  studentsData.forEach((student: any) => {
    student.attendances = attendancesData.filter(
      (attendance: any) => attendance.student.id === student.id
    );
  });

  return { data: studentsData };
};

export const getOneStudent = async (id: string, params?: any) => {
  return await API.get(`students/${id}?join=classes&join=classes.teacher`, {
    params,
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("accessToken")}`,
    },
  });
};
