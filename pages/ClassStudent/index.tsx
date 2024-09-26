import { getOneStudent } from "@/api/student";
import { NAVIGATOR_SCREEN } from "@/utils/enum";
import { useIsFocused } from "@react-navigation/native";
import { useAsyncEffect, useSetState } from "ahooks";
import to from "await-to-js";
import { FlatList, Flex, View, Text, Box, Heading, Center } from "native-base";
import {
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";

const ClassStudent = ({ navigation }: any) => {
  const isFocused = useIsFocused();
  const profile = useSelector((state: any) => state.profile);
  const [state, setState] = useSetState({ data: [], loading: false });

  const loadMore = async () => {
    setState({ loading: true });
    const [, res] = await to(getOneStudent(profile?.id));
    setState({ data: res?.data?.classes || [], loading: false });
  };

  useAsyncEffect(async () => {
    if (profile?.id) {
      await loadMore();
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
        Lớp học
      </Heading>
      <FlatList
        mt="4"
        ListEmptyComponent={
          state.loading ? (
            <ActivityIndicator />
          ) : (
            <Box safeArea>
              <Center>
                <Text fontSize={14}>Không có lớp học</Text>
              </Center>
            </Box>
          )
        }
        refreshControl={
          <RefreshControl
            colors={["#9Bd35A", "#689F38"]}
            refreshing={state.loading}
            onRefresh={loadMore}
          />
        }
        data={state.data}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(NAVIGATOR_SCREEN.STUDENT_IN_CLASS, {
                  id: item.id,
                  name: item.name,
                  disabled: true,
                });
              }}
            >
              <Flex
                h="20"
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

export default ClassStudent;
