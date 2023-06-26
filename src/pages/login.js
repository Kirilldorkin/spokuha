import { useState } from "react";
import Link from "next/link";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrors({});

    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/users");
      const users = await response.json();

      const user = users.find(
        (user) =>
          user.email === formData.email && user.password === formData.password
      );

      if (user) {
        console.log("User logged in:", user);

        setFormData({
          email: "",
          password: "",
        });
      } else {
        setErrors({ email: "Invalid email or password" });
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      <h1>Авторизация</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Электронная почта:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <h5>{errors.email}</h5>}
        </label>

        <label>
          Пароль:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <h5>{errors.password}</h5>}
        </label>

        <button type="submit">Login</button>
      </form>

      <p>
        У вас нет аккаунта? <Link href="/registration">Зарегистрироваться</Link>
      </p>
    </>
  );
};

export default LoginPage;
