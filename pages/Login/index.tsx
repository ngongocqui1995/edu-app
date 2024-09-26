import { getProfile, loginAccount } from "@/api/auth";
import { updateProfileInfo } from "@/slices/profileSlice";
import { NAVIGATOR_SCREEN } from "@/utils/enum";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useAsyncEffect, useSetState } from "ahooks";
import to from "await-to-js";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  Heading,
  Input,
  Spinner,
  useToast,
  VStack,
} from "native-base";
import { useDispatch } from "react-redux";

const Login = ({ navigation }: any) => {
  const toast = useToast();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [state, setState] = useSetState({
    email: "",
    password: "",
    loading: false,
  });

  const updateProfile = async (
    token: string
  ): Promise<{ check: boolean; user: any }> => {
    const [err, res]: any = await to(getProfile(token));
    if (err) {
      toast.show({
        description:
          err?.response?.data?.message?.toString?.() || "Đăng nhập thất bại!",
        placement: "top",
      });
      return { check: false, user: {} };
    }

    dispatch(updateProfileInfo(res.data));
    return { check: true, user: res.data };
  };

  const handleLogin = async () => {
    setState({ loading: true });

    const [err, res]: any = await to(
      loginAccount({
        username: state.email?.trim?.(),
        password: state.password?.trim?.(),
      })
    );

    if (err) {
      setState({ loading: false });
      return toast.show({
        description:
          err?.response?.data?.message?.toString?.() || "Đăng nhập thất bại!",
        placement: "top",
      });
    }

    const token = res?.data?.accessToken || "";
    const { check, user } = await updateProfile(token);
    if (check) {
      toast.show({ description: "Đăng nhập thành công!", placement: "top" });
      await AsyncStorage.setItem("accessToken", token);

      if (user?.role) navigation.navigate(user?.role);
    }
    setState({ loading: false });
  };

  useAsyncEffect(async () => {
    const token = await AsyncStorage.getItem("accessToken");
    if (isFocused && token) {
      setState({ loading: true });
      const { check, user } = await updateProfile(token);

      if (check) {
        toast.show({ description: "Đăng nhập thành công!", placement: "top" });
        if (user?.role) navigation.navigate(user?.role);
      }
      setState({ loading: false });
    }
  }, [isFocused]);

  return (
    <Center w="100%" h="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading
          size="lg"
          fontWeight="600"
          color="blue.800"
          _dark={{
            color: "warmGray.50",
          }}
        >
          Edu Check
        </Heading>
        <Heading
          mt="1"
          _dark={{
            color: "warmGray.200",
          }}
          color="blue.600"
          fontWeight="medium"
          size="xs"
        >
          Đăng nhập tài khoản
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Số điện thoại</FormControl.Label>
            <Input
              placeholder="example@gmail.com"
              onChangeText={(value) => setState({ email: value })}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Mật khẩu</FormControl.Label>
            <Input
              type="password"
              placeholder="******"
              onChangeText={(value) => setState({ password: value })}
            />
          </FormControl>
          <Button background="blue.800" onPress={handleLogin} mt="2">
            Đăng nhập
          </Button>
        </VStack>
      </Box>
      {state.loading && (
        <Flex
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          bg="rgba(0, 0, 0, 0.2)"
          flex="1"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner color="blue.500" size="lg" />
        </Flex>
      )}
    </Center>
  );
};

export default Login;
