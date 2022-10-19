import DonutChart from "react-donut-chart";
import { Grid, CardContent, Paper, Container, Box, Typography } from '@mui/material';
import MainCard from '../components/MainCard';

const DonutChartPurchaseOrder = (data, colors) => {

  const reactDonutChartBackgroundColor = //colors;
    [
      "#00E396",
      "#FEB019",
      "#FF4560",
      "#775DD0"
    ];

  const reactDonutChartInnerRadius = 0.5;
  const reactDonutChartSelectedOffset = 0.04;
  const reactDonutChartHandleClick = (item, toggled) => {
    if (toggled) {
      console.log(item);
    }
  };
  let reactDonutChartStrokeColor = "#FFFFFF";
  const reactDonutChartOnMouseEnter = (item) => {
    let color = data.data.find((q) => q.label === item.label).color;
    reactDonutChartStrokeColor = color;
  };
  return (
    <MainCard>
      <CardContent>
        <Grid container spacing={0.5}>
          <Grid item xs={12}>
            <Grid alignContent="center" justifyContent="center">
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Team delivery responsibility
              </Typography>
              <Grid item>
                <Container>
                  <DonutChart
                    width={500}
                    onMouseEnter={(item) => reactDonutChartOnMouseEnter(item)}
                    strokeColor={reactDonutChartStrokeColor}
                    data={data.data}
                    colors={reactDonutChartBackgroundColor}
                    innerRadius={reactDonutChartInnerRadius}
                    selectedOffset={reactDonutChartSelectedOffset}
                    onClick={(item, toggled) => reactDonutChartHandleClick(item, toggled)}
                  />
                </Container>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
}

export default DonutChartPurchaseOrder;
