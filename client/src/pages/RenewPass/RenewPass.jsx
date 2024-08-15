import React, { useEffect } from "react";
import loginImage from "./../../assets/img/login.svg";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { MdLockReset } from "react-icons/md";
import { useRenewPass } from "../../hooks/useRenewPass";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../components/Modal";
import Error from "../../components/Error";
import { SlCheck } from "react-icons/sl";
import resetIMG from "./../../assets/img/reset.png";

export default function RenewPass() {
  const {
    password,
    setPassword,
    retype,
    setRetype,
    setCode,
    setToken,
    isShowPass,
    setShowPass,
    isOpen,
    setOpen,
    errorMessage,
    successMessage,
    isError,
    isSuccess,
    isPending,
    isLoading,
    handleSubmit,
    successModal,
    setSuccessModal,
  } = useRenewPass();

  const { code, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (code && token) {
      setCode(code);
      setToken(token);
    }
  }, [code, token, setCode, setToken]);

  useEffect(() => {
    if (isSuccess) {
      setPassword("");
      setRetype("");
      setShowPass(false);
    }
  }, [isSuccess]);

  const goLogIn = () => {
    setSuccessModal(false);
    navigate("/login");
  };

  return (
    <div className="width padding-x">
      {isOpen && (
        <Error isOpen={isOpen} setOpen={setOpen} errorMessage={errorMessage} />
      )}

      {isSuccess && (
        <Modal isOpen={successModal}>
          <section className="flex flex-col gap-4 items-center justify-center">
            <div className="text-green-500 flex items-center justify-center">
              <SlCheck size={55} />
            </div>
            <p className="text-2xl">Password Changed</p>
            <p>Your password has been changed successfully</p>
            <Button
              onClick={goLogIn}
              clName={"input ring-green-500 text-green-600 bg-green-200"}
            >
              Back to Login
            </Button>
          </section>
        </Modal>
      )}

      <div className="flex h-screen items-center justify-center">
        <img
          className="max-h-[25rem] object-center  hidden lg:block"
          src={resetIMG}
          alt="reset_password_image"
        />

        <section className="lg:w-1/2">
          <div className="lg:max-w-[23.5rem] xxl:max-w-[25rem] mx-auto flex flex-col gap-5 xxl:gap-7  p-5 md:border md:rounded-xl md:shadow-xl md:shadow-login/20">
            <div className="flex items-center justify-center">
              <div className="text-white bg-login rounded-full p-1">
                <MdLockReset size={45} />
              </div>
            </div>

            <header className="flex flex-col items-center justify-center gap-1">
              <h1 className="text-2xl font-bold opacity-70">Reset Password</h1>
              <div>
                <h1 className="opacity-70 xxl:text-lg text-center">
                  Competitive Programming Camp City University
                </h1>
              </div>
            </header>

            <main className="flex flex-col gap-5">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 xxl:gap-5"
              >
                <InputField
                  id="password"
                  type={isShowPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type new password"
                  disabled={isLoading || isPending}
                  required
                />

                <InputField
                  id="reType"
                  type={isShowPass ? "text" : "password"}
                  value={retype}
                  onChange={(e) => setRetype(e.target.value)}
                  placeholder="Retype new password"
                  disabled={isLoading || isPending}
                  required
                />

                <div className="flex gap-1 text-sm">
                  <input
                    className="cursor-pointer"
                    id="showPassword"
                    type="checkbox"
                    checked={isShowPass}
                    onChange={(e) => setShowPass(e.target.checked)}
                  />
                  <label
                    className="cursor-pointer opacity-60"
                    htmlFor="showPassword"
                  >
                    Show password
                  </label>
                </div>
                <Button
                  type="submit"
                  clName={"input mt-2 bg-login text-white font-semibold"}
                  disabled={isLoading || isPending}
                >
                  {isLoading || isPending ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </main>
          </div>
        </section>
      </div>
    </div>
  );
}
