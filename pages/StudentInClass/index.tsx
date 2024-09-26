import { createAttendance, deleteAttendance } from "@/api/attendance";
import { queryStudentInClass } from "@/api/student";
import { useIsFocused } from "@react-navigation/native";
import { useAsyncEffect, useSetState } from "ahooks";
import to from "await-to-js";
import {
  Box,
  Center,
  FlatList,
  Heading,
  View,
  Text,
  Flex,
  useToast,
  ChevronLeftIcon,
} from "native-base";
import { RefreshControl, TouchableOpacity } from "react-native";

const StudentInClass = ({ route, navigation }: any) => {
  const { id, name, disabled } = route.params || {};
  const isFocused = useIsFocused();
  const toast = useToast();
  const [state, setState] = useSetState<any>({
    data: [],
    loading: false,
    isStop: false,
  });

  const loadMore = async (type: "refresh" | "loadMore") => {
    if (state.loading) return;
    if (type == "loadMore" && state.isStop) return;
    if (type == "refresh") setState({ data: [], isStop: false });

    setState({ loading: true });
    const [, res] = await to(
      queryStudentInClass(id, Date.now(), {
        offset: type == "loadMore" ? state.data.length : 0,
        limit: 10,
      })
    );

    if (res?.data.length < 10) {
      setState({ isStop: true });
    }
    if (type == "refresh") {
      setState({ data: res?.data || [] });
    }
    if (type == "loadMore") {
      setState({ data: [...state.data, ...(res?.data || [])] });
    }
    setState({ loading: false });
  };

  useAsyncEffect(async () => {
    if (id) await loadMore("refresh");
  }, [isFocused]);

  const onAttendance = async (item: any) => {
    setState({ loading: true });

    if (item.attendances?.length === 0) {
      const [err, res]: any = await to(
        createAttendance({ class: id, student: item.id })
      );

      if (err) {
        setState({ loading: false });
        return toast.show({
          description:
            err?.response?.data?.message?.toString?.() || "Điểm danh thất bại!",
          placement: "top",
        });
      }

      state.data.forEach((it: any) => {
        if (it.id === item.id && res.data?.data) {
          it.attendances = [res.data?.data];
        }
      });
      setState({ data: state.data, loading: false });
      toast.show({
        description: "Điểm danh thành công!",
        placement: "top",
      });
    } else {
      const attendanceId = item.attendances[0].id;
      const [err]: any = await to(deleteAttendance(attendanceId));

      if (err) {
        setState({ loading: false });
        return toast.show({
          description:
            err?.response?.data?.message?.toString?.() ||
            "Huỷ điểm danh thất bại!",
          placement: "top",
        });
      }

      state.data.forEach((it: any) => {
        if (it.id === item.id) {
          it.attendances = [];
        }
      });
      setState({ data: state.data, loading: false });

      toast.show({
        description: "Huỷ điểm danh thành công!",
        placement: "top",
      });
    }
  };

  return (
    <View w="100%" h="100%">
      <Box safeArea px="4" py="4">
        <Flex direction="row" alignItems="center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeftIcon size="24px" />
          </TouchableOpacity>
          <Center flex="1">
            <Heading
              size="lg"
              fontWeight="600"
              color="blue.800"
              _dark={{
                color: "warmGray.50",
              }}
            >
              Học sinh trong lớp
            </Heading>
          </Center>
        </Flex>
        <FlatList
          mt="4"
          ListEmptyComponent={
            !state.loading ? (
              <Box safeArea>
                <Center>
                  <Text fontSize={14}>Không có học sinh</Text>
                </Center>
              </Box>
            ) : null
          }
          refreshControl={
            <RefreshControl
              colors={["#9Bd35A", "#689F38"]}
              refreshing={state.loading}
              onRefresh={() => loadMore("refresh")}
            />
          }
          data={state.data}
          keyExtractor={(item: any) => item.id}
          onEndReachedThreshold={0.3}
          onEndReached={() => loadMore("loadMore")}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                disabled={disabled}
                onPress={() => onAttendance(item)}
              >
                <Flex
                  h="32"
                  w="full"
                  direction="row"
                  borderBottomWidth="1"
                  pl={["0", "4"]}
                  pr={["0", "5"]}
                  py="4"
                >
                  <View flex="1">
                    <Text fontSize={16} bold>
                      Tên: {item.name}
                    </Text>
                    <Text fontSize={16} bold>
                      Sđt: {item.phone}
                    </Text>
                    <Text fontSize={16} bold>
                      Email: {item.email}
                    </Text>
                    <Text fontSize={16} bold>
                      Trạng thái:{" "}
                      {item.attendances.length > 0 ? (
                        <Text color="green.600">Đã điểm danh</Text>
                      ) : (
                        <Text color="red.600">Chưa điểm danh</Text>
                      )}
                    </Text>
                  </View>
                </Flex>
              </TouchableOpacity>
            );
          }}
        />
      </Box>
    </View>
  );
};

export default StudentInClass;
