import RenderBlog from "./renderblog";
import {
  HStack,
  VStack,
  Center,
  Progress,
  ButtonGroup,
  Box,
  Input,
  Button,
  FormControl,
  Skeleton,
  InputGroup,
  Divider,
  useToast,
  InputRightElement,
} from "@chakra-ui/react";

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { EmailIcon, Icon, ViewOffIcon, LockIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useState, useEffect } from "react";
const widthbreak = {
  base: "100%",
  sm: "80%",
  lg: "50%",
  xl: "40%",
  "2xl": "30%",
};

const breakpointsEM = {
  base: "0em", // 0px
  sm: "30em", // ~480px. em is a relative unit and is dependant on the font size.
  md: "48em", // ~768px
  lg: "62em", // ~992px
  xl: "80em", // ~1280px
  "2xl": "96em", // ~1536px
};
const App = ({ children }) => {
  const [userStatus, setUserStatus] = useState({
    status: false,
  });

  const toast = useToast();
  // const baseUrl = "";
  //
  const baseUrl = "http://127.168.0.1:3001";
  const [blogData, setBlogData] = useState([]);
  const [inputNameValue, setInputNameValue] = useState("");
  const [inputPasswordValue, setInputPasswordValue] = useState("");
  const [onLoad, setLoading] = useState(false);
  const [onGetBlog, setGetBlog] = useState(false);
  const [authLogin, setAuthLogin] = useState(false);
  const [alertSucess, setAlertSucess] = useState(false);
  useEffect(() => {
    window.addEventListener("load", setLoading(true));
  }, [onload]);

  const handleClearForm = () => {
    setInputNameValue("");
    setInputPasswordValue("");
  };
  const handleInputNameValue = (e) => {
    setInputNameValue(e.target.value);
  };
  const handleInputPasswordValue = (e) => {
    setInputPasswordValue(e.target.value);
  };
  const handleLogin = async () => {
    setAuthLogin(true);
    setAlertSucess(true);
    const login = await axios
      .post(baseUrl + "/login", {
        username: inputNameValue,
        password: inputPasswordValue,
      })
      .catch((e) => {
        toast({
          position: "bottom-right",
          title: "Login Fail",
          description: " Please use username and password in order to Log",
          status: "error",
          duration: 2200,
        });

        console.log(e);
      })
      .finally(() => {
        setTimeout(() => {
          setAuthLogin(false);
          setAlertSucess(false);
        }, 2000);
      });
    if (login.data.status) {
      setUserStatus({
        status: true,
        ...login.data,
      });
      toast({
        position: "bottom-right",
        title: "Login Sucess",
        description: " UserID :  " + login.data.userid,
        status: "success",
        duration: 1700,
      });
    }
  };
  const handleGetBlog = async () => {
    setGetBlog(true);
    const getblog = await axios
      .get(baseUrl + "/api/blog")
      .catch((e) => console.log(e));
    setBlogData(getblog.data);
    console.log(blogData);
    setTimeout(() => {
      setGetBlog(false);
    }, 2000);
  };

  const handleLogout = async () => {
    setGetBlog(true);
    setUserStatus({
      status: false,
    });
    setGetBlog(false);

    const logout = axios.post(baseUrl + "/logout");
    console.log(logout.data);
    setUserStatus({
      status: false,
    });
    setTimeout(() => {
      setGetBlog(false);
    }, 2000);
  };
  return (
    <>
      <FormControl
        className=" transition-all duration-1000 ease-in-out"
        height={userStatus.status == false ? "" : "0"}
        overflow={"hidden"}
      >
        <Center className="">
          <Box width={widthbreak} p="5" className=" ">
            <VStack className="">
              <Center>
                <Skeleton isLoaded={onLoad}>
                  <Divider />
                  <label htmlFor="name">Login Form</label>
                  <Divider />
                </Skeleton>
              </Center>

              <Box width="100%">
                <Skeleton isLoaded={onLoad}>
                  <label className="text-sm" htmlFor="name">
                    Name
                  </label>
                </Skeleton>
              </Box>
              <Skeleton width="100%" isLoaded={onLoad}>
                <InputGroup size="sm">
                  <Input
                    value={inputNameValue}
                    onChange={handleInputNameValue}
                    id="name"
                    type="name"
                  />
                  <InputRightElement
                    children={<LockIcon />}
                  ></InputRightElement>
                </InputGroup>
              </Skeleton>
              <Box className="" width="100%">
                <Skeleton width="100%" isLoaded={onLoad}>
                  <label className="text-sm" htmlFor="pwd">
                    Password
                  </label>
                </Skeleton>
              </Box>
              <Skeleton width="100%" isLoaded={onLoad}>
                <InputGroup size={"sm"}>
                  <Input
                    value={inputPasswordValue}
                    onChange={handleInputPasswordValue}
                    id="pwd"
                    type="password"
                  />
                  <InputRightElement
                    children={<ViewOffIcon />}
                  ></InputRightElement>
                </InputGroup>
              </Skeleton>
              <Divider />

              <Skeleton width="100%" isLoaded={onLoad}>
                <HStack>
                  <ButtonGroup size={"sm"} width={"100%"}>
                    <Button
                      width={100 / 3 + "%"}
                      isLoading={authLogin}
                      onClick={handleLogin}
                    >
                      Login
                    </Button>
                    <Button width={100 / 3 + "%"} onClick={handleClearForm}>
                      Clear Form
                    </Button>
                    <Button width={100 / 3 + "%"}>Forget Password</Button>
                  </ButtonGroup>
                </HStack>
              </Skeleton>
            </VStack>
          </Box>
        </Center>
      </FormControl>
      <Center
        className="mt-5 mb-5"
        opacity={userStatus.status == false ? 0 : 100}
      >
        <Box outline width={"50%"}>
          <Center>
            <VStack spacing={2}>
              <h1>WELCOME ! {userStatus.username}</h1>
              <h2> ID : {userStatus?.userid}</h2>
            </VStack>
          </Center>
        </Box>
      </Center>
      <Center opacity={userStatus.status == false ? 0 : 100}>
        <Box width={"50%"}>
          <VStack>
            <Box width="100%">
              <HStack>
                <Button size={"sm"} onClick={handleGetBlog}>
                  Get data
                </Button>
                <Button size={"sm"} onClick={handleLogout}>
                  Logout
                </Button>
              </HStack>
            </Box>
          </VStack>
        </Box>
      </Center>
      <Progress
        mt="5"
        size="xs"
        value={90}
        display={!authLogin ? "" : "none"}
        opacity={!onGetBlog ? 0 : 100}
        isIndeterminate={onGetBlog}
        className="my-1 "
      ></Progress>
      <Center className="" opacity={userStatus.status == false ? 0 : 100}>
        <Box className="mt-3" width={"90%"}>
          <RenderBlog onGetBlog={onGetBlog} blogData={blogData} />
        </Box>
      </Center>
    </>
  );
};

export default App;
