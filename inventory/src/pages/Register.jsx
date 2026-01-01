import {
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";
  import { useForm } from "react-hook-form";
  import { useNavigate } from "react-router";
  const api = "http://localhost:8800";
  export default function Register() {
    const navigate = useNavigate();
    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm();
    const onSubmit = async (data) => {
      const res = await fetch(`${api}/users`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (res.status == 201) {
        return navigate("/login");
      }
    };
    return (
      <Paper
        elevation={10}
        sx={{
          p: 4,
          maxWidth: 450,
          width: "100%",
          borderRadius: 4,
          margin: "50px auto",
        }}
      >
        <Typography variant="h5" component="h1" align="center" sx={{ mb: 3 }}>
          Create Account
        </Typography>
  
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              name="fullName"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <Typography color="error">name is required</Typography>
            )}
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
              label="bio"
              variant="outlined"
              name="bio"
              type="text"
            />
  
            <TextField
              fullWidth
              label="password"
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
              Register
            </Button>
          </Stack>
        </Box>
      </Paper>
    );
  }
  