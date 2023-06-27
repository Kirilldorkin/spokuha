import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const RegistrationPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dateOfBirth: "",
    agreeToPrivacyPolicy: false,
    role: "user",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrors({});
    const errors = {};

    if (!formData.name) {
      errors.name = "Укажите имя";
    }

    if (!formData.email) {
      errors.email = "Электронная почта обязательна";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Электронная почта недействительна";
    }

    if (!formData.password) {
      errors.password = "Необходим пароль";
    } else if (formData.password.length < 6) {
      errors.password = "Пароль должен содержать не менее 6 знаков";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Пароли не совпадают";
    }

    if (!formData.gender) {
      errors.gender = "Укажите пол";
    }

    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Укажите дату рождения.";
    }

    if (!formData.agreeToPrivacyPolicy) {
      errors.agreeToPrivacyPolicy =
        "Вы должны согласиться с политикой конфиденциальности";
    }

    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/users");
      const users = await response.json();

      const existingUser = users.find((user) => user.email === formData.email);

      if (existingUser) {
        setErrors({
          email:
            "Пользователь с таким адресом электронной почты уже существует",
        });
      } else {
        const response = await fetch("http://localhost:3001/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, role: "user" }),
        });

        if (response.ok) {
          router.push("/login");
          // console.log("Пользователь зарегистрирован:", formData);

          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            gender: "",
            dateOfBirth: "",
            agreeToPrivacyPolicy: false,
          });
        } else {
          console.error("Не удалось добавить пользователя в базу данных");
        }
      }
    } catch (error) {
      console.error("Произошла ошибка:", error);
    }
  };

  return (
    <>
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Имя:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <h5>{errors.name}</h5>}
        </label>

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

        <label>
          Подтвердите пароль:
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <h5>{errors.confirmPassword}</h5>}
        </label>

        <label>
          <div className="gender-inputs">
            Пол:
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === "male"}
              onChange={handleChange}
            />
            Мужской
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === "female"}
              onChange={handleChange}
            />
            Женский
          </div>
          {errors.gender && <h5>{errors.gender}</h5>}
        </label>

        <label>
          Дата рождения:
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          {errors.dateOfBirth && <h5>{errors.dateOfBirth}</h5>}
        </label>

        <label>
          <input
            type="checkbox"
            name="agreeToPrivacyPolicy"
            checked={formData.agreeToPrivacyPolicy}
            onChange={handleChange}
            required
          />
          Я согласен с условиями политики конфиденциальности
          {errors.agreeToPrivacyPolicy && (
            <h5>{errors.agreeToPrivacyPolicy}</h5>
          )}
        </label>

        <button type="submit">Зарегистрироваться</button>
      </form>

      <p>
        У меня уже есть аккаунт, <Link href="/login">Авторизоваться</Link>
      </p>
    </>
  );
};

export default RegistrationPage;
