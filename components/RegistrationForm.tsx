import { Button, createTheme, Grid, TextField } from "@mui/material";
import { Container } from "@mui/system";

export const RegistrationForm = (props: { setIsRegistration: () => void }) => {
  const { setIsRegistration } = props;
  return (
    <Container maxWidth="md">
      <Grid container xs={12} spacing={2}>
        <Grid item xs={6}>
          <TextField label="First name" />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Last name" />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Email" />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Password" />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Re-enter password" />
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" fullWidth>
            Register
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button color="warning" variant="contained" fullWidth>
            Continue without saving
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="secondary" fullWidth>
            Already have an account? Login
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
