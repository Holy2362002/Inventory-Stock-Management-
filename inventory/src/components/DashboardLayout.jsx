import { Edit } from "@mui/icons-material";
import {
  Container,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  ListItemButton,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router";

export default function DashBoardLayout({ products }) {
  const navigate = useNavigate();
  return (
    <Container>
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h4" fontWeight={600}>
            Inventory Dashboard
          </Typography>
          <Divider />
          <Grid
            container
            spacing={3}
            sx={{ display: "flex-row", justifyContent: "space-between" }}
          >
            <Grid sx={{ width: "45%" }}>
              <Card>
                <CardContent>
                  <Typography gutterBottom color="text.secondary">
                    Total Products
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="green">
                    ({products.length})
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Overall count of items in inventory.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid sx={{ width: "45%" }}>
              <Card
                sx={{
                  width: "100%",
                }}
              >
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Low Stock Alerts
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="red">
                    {products.filter((product) => product.Stock < 10).length}
                  </Typography>
                  <Typography color="warning" variant="body2">
                    Items nearing minimum quantity.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Low Stock Alarm
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {products
                .filter((product) => product.Stock < 10)
                .map((item) => (
                  <List key={item.id} dense disablePadding>
                    <ListItem
                      sx={{ display: "flex", color: "rgba(77, 27, 6, 1)" }}
                    >
                      <ListItemText primary={item.name} key={item.id} />
                    </ListItem>
                  </List>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" gutterBottom>
                  Stock Recommendations
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Refill
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {products
                .filter((product) => product.Stock < 10)
                .map((item) => (
                  <List
                    key={item.id}
                    dense
                    disablePadding
                    sx={{ justifyContent: "space-between" }}
                  >
                    <ListItem
                      sx={{ display: "flex", color: "rgba(12, 77, 6, 1)" }}
                    >
                      <ListItemText primary={item.name} />
                      <IconButton onClick={() => navigate("/inventory")}>
                        <Edit />
                      </IconButton>
                    </ListItem>
                  </List>
                ))}
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Container>
  );
}
