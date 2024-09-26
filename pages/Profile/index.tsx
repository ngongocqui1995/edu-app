import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Avatar,
  Center,
  ChevronRightIcon,
  Divider,
  Flex,
  ScrollView,
  Spacer,
  Text,
} from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { resetProfile } from "../../slices/profileSlice";
import { NAVIGATOR_SCREEN } from "../../utils/enum";

const Profile = ({ navigation }: any) => {
  const profile = useSelector((state: any) => state.profile);
  const dispatch = useDispatch();

  return (
    <ScrollView
      style={{
        marginTop: 80,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 15,
      }}
    >
      <Flex direction="row">
        <Avatar
          bg="green.500"
          size={100}
          source={{
            uri:
              profile?.avatar ||
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          }}
        />
        <Center>
          <Flex direction="column" ml="2.5">
            <Text fontSize={20} fontWeight={700}>
              {profile?.name}
            </Text>
            <Text>{profile?.phone}</Text>
          </Flex>
        </Center>
      </Flex>
      <Flex direction="column" mt="10" h={56}>
        <Text fontSize={16} fontWeight={700}>
          Tài khoản của tôi
        </Text>
        <Spacer />
        <Divider />
        <Spacer />
        <Flex direction="row" justifyContent="space-between">
          <Text fontSize={14} fontWeight={400}>
            Yêu thích
          </Text>
          <ChevronRightIcon />
        </Flex>
        <Spacer />
        <Divider />
        <Spacer />
        <Flex direction="row" justifyContent="space-between">
          <Text fontSize={14} fontWeight={400}>
            Cài đặt an toàn
          </Text>
          <ChevronRightIcon />
        </Flex>
        <Spacer />
        <Divider />
        <Spacer />
        <Text
          onPress={async () => {
            dispatch(resetProfile());
            await AsyncStorage.removeItem("accessToken");
            navigation.navigate(NAVIGATOR_SCREEN.LOGIN);
          }}
          fontSize={14}
          fontWeight={400}
        >
          Đăng xuất
        </Text>
        <Spacer />
        <Divider />
      </Flex>
    </ScrollView>
  );
};

export default Profile;
