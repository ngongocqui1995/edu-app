import { queryClassTeacher } from "@/api/class";
import { NAVIGATOR_SCREEN } from "@/utils/enum";
import { useIsFocused } from "@react-navigation/native";
import { useAsyncEffect, useSetState } from "ahooks";
import to from "await-to-js";
import { Box, Center, FlatList, Flex, Heading, Text, View } from "native-base";
import {
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";

const HistoryTeacher = ({ navigation }: any) => {
  const isFocused = useIsFocused();
  const profile = useSelector((state: any) => state.profile);
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
      queryClassTeacher(profile.id, {
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
    if (profile?.id) {
      await loadMore("refresh");
    }
  }, [isFocused]);

  return (
    <Box safeArea px="4" py="4">
      <Heading
        size="lg"
        fontWeight="600"
        color="blue.800"
        _dark={{
          color: "warmGray.50",
        }}
      >
        Lịch sử
      </Heading>
      <FlatList
        mt="4"
        ListEmptyComponent={
          !state.loading ? (
            <Box safeArea>
              <Center>
                <Text fontSize={14}>Không có lớp học</Text>
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
              onPress={() => {
                navigation.navigate(NAVIGATOR_SCREEN.HISTORY_TEACHER_DATE, {
                  id: item.id,
                  name: item.name,
                });
              }}
            >
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
                    {item.name}
                  </Text>
                  <Text color="gray.600">Giáo viên: {item.teacher?.name}</Text>
                </View>
              </Flex>
            </TouchableOpacity>
          );
        }}
      />
    </Box>
  );
};

export default HistoryTeacher;
