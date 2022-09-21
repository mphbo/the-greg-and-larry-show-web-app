import { createTheme } from "@mui/material/styles";
import { green, purple } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        color: "success",
        focused: true,
        fullWidth: true,
        inputProps: {
          style: {
            color: "white",
            fontSize: "20px",
          },
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        color: "secondary",
        style: {
          fontSize: "50px",
          marginBottom: "20px",
        },
      },
    },
  },
});
