import { queryAttendanceClass } from "@/api/attendance";
import { useIsFocused } from "@react-navigation/native";
import { useAsyncEffect, useSetState } from "ahooks";
import to from "await-to-js";
import dayjs from "dayjs";
import {
  Box,
  Center,
  ChevronLeftIcon,
  FlatList,
  Flex,
  Heading,
  View,
  Text,
} from "native-base";
import { RefreshControl, TouchableOpacity } from "react-native";

const HistoryTeacherDate = ({ navigation, route }: any) => {
  const { id } = route.params || {};
  const isFocused = useIsFocused();
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
      queryAttendanceClass(id, {
        offset: type == "loadMore" ? state.data.length : 0,
        limit: 10,
      })
    );

    if (res?.data?.data.length < 10) {
      setState({ isStop: true });
    }
    if (type == "refresh") {
      setState({ data: res?.data?.data || [] });
    }
    if (type == "loadMore") {
      setState({ data: [...state.data, ...(res?.data?.data || [])] });
    }
    setState({ loading: false });
  };

  useAsyncEffect(async () => {
    if (id) await loadMore("refresh");
  }, [isFocused]);

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
              Chi tiết
            </Heading>
          </Center>
        </Flex>
        <FlatList
          mt="4"
          ListEmptyComponent={
            !state.loading ? (
              <Box safeArea>
                <Center>
                  <Text fontSize={14}>Không có ngày</Text>
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
              <Flex
                w="full"
                direction="row"
                borderBottomWidth="1"
                pl={["0", "4"]}
                pr={["0", "5"]}
                py="4"
              >
                <View flex="1">
                  <Text fontSize={16} bold>
                    Lớp: {item.class?.name}
                  </Text>
                  <Text fontSize={16} bold>
                    Tên SV: {item.student?.name}
                  </Text>
                  <Text fontSize={16} bold>
                    Trạng thái: <Text color="green.600">Đã điểm danh</Text>
                  </Text>
                  <Text fontSize={16} bold>
                    Ngày điểm danh:{" "}
                    {dayjs(item.attendance_date).format("DD/MM/YYYY")}
                  </Text>
                </View>
              </Flex>
            );
          }}
        />
      </Box>
    </View>
  );
};

export default HistoryTeacherDate;
