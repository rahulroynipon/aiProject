import React, { useState } from "react";
import { MdLockReset } from "react-icons/md";
import resetIMG from "./../../assets/img/reset.png";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import OrPartition from "../../components/OrPartition";

const inputFieldInfo = [
  {
    label: "Fullname",
    id: "fullname",
    type: "text",
    placeholder: "Enter your fullname",
  },
  {
    label: "Email",
    id: "email",
    type: "email",
    placeholder: "Enter your email",
  },
  {
    label: "Password",
    id: "password",
    type: "password",
    placeholder: "Enter your password",
  },
  {
    label: "Confirm Password",
    id: "confirm_password",
    type: "password",
    placeholder: "Confirm your password",
  },
  {
    label: "Code",
    id: "code",
    type: "text",
    placeholder: "Enter the code",
  },
  {
    label: "Token",
    id: "token",
    type: "text",
    placeholder: "Enter the token",
  },
];

export default function RenewPass() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirm_password: "",
    code: "",
    token: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleNext = () => {
    if (step === 1) {
      const { fullname, email } = formData;
      let newErrors = {};
      if (!fullname) newErrors.fullname = "Fullname is required.";
      if (!email) newErrors.email = "Email is required.";
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setStep(2);
    } else if (step === 2) {
      const { password, confirm_password } = formData;
      let newErrors = {};
      if (!password || password.length < 6)
        newErrors.password = "Password must be at least 6 characters.";
      if (password !== confirm_password)
        newErrors.confirm_password = "Passwords do not match.";
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setStep(3);
    } else if (step === 3) {
      // Handle final submission or next steps
      console.log("Form data:", formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="width padding-x">
      <div className="flex h-screen items-center justify-center">
        <img
          className="max-h-[25rem] object-center hidden lg:block"
          src={resetIMG}
          alt="reset_password_image"
        />

        <section className="lg:w-1/2">
          <div className="lg:max-w-[23.5rem] xxl:max-w-[25rem] mx-auto flex flex-col p-5 md:border md:rounded-xl md:shadow-xl md:shadow-login/20">
            <div className="flex items-center justify-center">
              <div className="text-white bg-login rounded-full p-1">
                <MdLockReset size={45} />
              </div>
            </div>

            <header className="flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold opacity-70">Sign Up</h1>
              <div>
                <h1 className="opacity-70 xxl:text-lg text-center">
                  Competitive Programming Camp City University
                </h1>
              </div>
            </header>

            <OrPartition clName={"my-2"} text={"or"} />

            <main className="flex flex-col gap-5">
              <form className="flex flex-col gap-3 xxl:gap-5">
                {inputFieldInfo.slice((step - 1) * 2, step * 2).map((field) => (
                  <InputField
                    key={field.id}
                    label={field.label}
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.id]}
                    onChange={handleChange}
                    required
                    error={errors[field.id]}
                  />
                ))}
                <div className="flex items-center justify-end mt-5 gap-3">
                  {step > 1 && (
                    <Button
                      clName={"input bg-login text-white"}
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    clName={"input bg-login text-white"}
                    onClick={handleNext}
                  >
                    {step === 3 ? "Submit" : "Next"}
                  </Button>
                </div>
              </form>
            </main>
          </div>
        </section>
      </div>
    </div>
  );
}
