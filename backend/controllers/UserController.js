exports.CheckLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userData.findOne({ email });

    // ❌ No account
    if (!user) {
      return res
        .status(404)
        .json("Account not found. Please signup first");
    }

    // ❌ Google user trying password login
    if (user.authType === "google") {
      return res.status(400).json(
        "This account uses Google login. Please continue with Google."
      );
    }

    // ❌ Wrong password
    if (password !== user.password) {
      return res.status(401).json(
        "Invalid credentials. Re-enter password or login through Google."
      );
    }

    // ✅ Success
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (err) {
    res.status(500).json("Login error");
  }
};
exports.Signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const check = await userData.findOne({ email });

    if (check) {
      return res.status(409).json(
        "Email already exists. Please login."
      );
    }

    await userData.create({
      email,
      password,
      authType: "local"
    });

    res.status(201).json("User created successfully");

  } catch (err) {
    res.status(500).json("Signup failed");
  }
};
exports.googleLogin = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json("Email required");
    }

    let user = await userData.findOne({ email });

    // If not exists → create Google user
    if (!user) {
      user = await userData.create({
        email,
        name,
        authType: "google"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Google login success",
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json("Google login failed");
  }
};
const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await loginUser(email, password);

    if (res.token) {
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } else {
      setError(res);
    }

  } catch (err) {

    if (err.response?.status === 400) {
      setError(
        "This account uses Google login. Continue with Google."
      );
    }

    else if (err.response?.status === 401) {
      setError(
        "Invalid credentials. Re-enter password."
      );
    }

    else if (err.response?.status === 404) {
      setError(
        "Account not found. Please signup."
      );
    }

    else {
      setError("Login failed");
    }
  }
};
const handleSignup = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await signupUser(email, password);

    if (res.token) {
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    }

  } catch (err) {

    if (err.response?.status === 409) {
      setError(
        "Email already exists. Please login."
      );
    } else {
      setError("Signup failed");
    }
  }
};
// 🔹 Get logged-in user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await userData
      .findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json("User not found");
    }

    res.status(200).json(user);

  } catch (err) {
    res.status(500).json("Failed to fetch profile");
  }
};
