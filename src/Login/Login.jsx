import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MatrixClient } from "matrix-js-sdk";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const methods = useForm({
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const homeserverUrl = "http://localhost:8008";
  const token = localStorage.getItem("auth_token");

  const client = new MatrixClient({
    baseUrl: homeserverUrl,
    accessToken: token,
  });

  const { errors } = methods.formState;

  function loginWithRetry(name, password) {
    setIsLoading(true);
    client
      .login("m.login.password", { user: name, password: password })
      .then((response) => {
        localStorage.setItem("auth_token", response.access_token);
        setIsLoading(false);
        navigate("/");
      })
      .catch((error) => {
        console.error("Login failed:", error);
        setIsLoading(false);
      });
    client.startClient({ initialSyncLimit: 10 });
  }

  const onSubmit = (data) => {
    console.log("data", data);
    loginWithRetry(data.name, data.password);
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full md:w-1/2 lg:w-1/3 px-6 py-10 rounded-md shadow-xl bg-white"
      >
        <h1 className="text-center text-3xl font-medium mb-7">Matrix Login</h1>
        <div className="flex flex-col gap-y-3">
          <div>
            <label htmlFor="name" className="flex flex-col">
              <span>Name:</span>
              <input
                className="border focus:border-blue-500 outline-none py-1 indent-2 rounde-sm"
                id="name"
                {...methods.register("name", {
                  required: "Please enter your name.",
                })}
              />
            </label>
            {errors.name?.message && (
              <span className="text-red-500 py-2 text-sm">
                {errors.name?.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="password" className="flex flex-col">
              <span>Password:</span>
              <input
                className="border focus:border-blue-500 outline-none py-1 indent-2 rounde-sm"
                id="password"
                {...methods.register("password", {
                  required: "Please enter your password.",
                })}
              />
            </label>
            {errors.password?.message && (
              <span className="text-red-500 py-2 text-sm">
                {errors.password?.message}
              </span>
            )}
          </div>
        </div>
        <div className="mt-5">
          <button
            type="submit"
            className="flex justify-center gap-x-3 bg-indigo-400 cursor-pointer py-2 w-full rounded-md text-lg font-medium hover:bg-indigo-500 transition-all duration-300"
          >
            <span>Login </span> {isLoading && <Loader />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
