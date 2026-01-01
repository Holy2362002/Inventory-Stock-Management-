import {
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
    Alert,
  } from "@mui/material";
  import { useForm } from "react-hook-form";
  import { useNavigate } from "react-router";
  import { useApp } from "../AppProvider";
  import { useState } from "react";
  const api = "https://inventory-api-b0va.onrender.com";
  export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useApp();
    const [error, setError] = useState();
    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm();
    const onSubmit = async (data) => {
      const res = await fetch(`${api}/users/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const { user, token } = await res.json();
        setUser(user);
        localStorage.setItem("token", token);
        navigate("/");
      } else {
        setError("Incorrect username or password");
      }
    };
    return (
      <Paper
        elevation={3}
        sx={{
          p: 2,
          maxWidth: 500,
          width: "100%",
          borderRadius: 4,
          margin: "50px auto",
        }}
      >
        <Typography variant="h5" component="h1" align="center" sx={{ mb: 3 }}>
          Account Login
        </Typography>
        {error && (
          <Alert severity="warning" sx={{ mt: 2, mb: 1 }}>
            {error}
          </Alert>
        )}
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={5}>
            <TextField
              fullWidth
              label="username"
              variant="outlined"
              name="username"
              type="text"
              {...register("username", { required: true })}
            />
            {errors.username && (
              <Typography color="error">username is required</Typography>
            )}
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              name="password"
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <Typography color="error">password is required</Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{ mt: 2 }}
            >
              Login In
            </Button>
          </Stack>
        </Box>
      </Paper>
    );
  }
  