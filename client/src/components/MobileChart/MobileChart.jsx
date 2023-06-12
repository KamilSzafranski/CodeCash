import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import css from "./MobileChart.module.css";
import { useEffect, useMemo, useRef } from "react";
import { Colors } from "chart.js";
import { CATEGORY_NAME, CHART_COLOR } from "../../redux/constant";
import { selectTransactions } from "../../redux/selector";
import { useSelector } from "react-redux";
import { selectStatisticsDate } from "../../redux/selector";
import Empty from "../Empty/Empty";

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

const MobileChart = () => {
  const statisticsDate = useSelector(selectStatisticsDate);
  const chartRef = useRef();
  const transactions = useSelector(selectTransactions);

  const getTransactionsCategoryValue = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      const transactionDate = new Date(transaction.date);
      const pickDate = new Date(statisticsDate);

      const yearCondition =
        transactionDate.getFullYear() === pickDate.getFullYear();
      const monthCondition = transactionDate.getMonth() === pickDate.getMonth();

      if (!transaction.type && yearCondition && monthCondition) {
        acc[transaction.category] =
          (acc[transaction.category] ?? 0) - transaction.amount;
      }
      if (transaction.type && yearCondition && monthCondition) {
        acc[transaction.category] =
          (acc[transaction.category] ?? 0) + transaction.amount;
      }

      return acc;
    }, {});
  }, [transactions, statisticsDate]);

  const categoryName = Object.keys(getTransactionsCategoryValue);
  const transactionsCategorySum = Object.values(getTransactionsCategoryValue);
  const chartBg = categoryName.map((elements) => {
    const CategoryValues = Object.values(CATEGORY_NAME);
    const bgColorKeys = Object.keys(CHART_COLOR);
    const indexOfCategory = CategoryValues.indexOf(elements);
    return CHART_COLOR[bgColorKeys[indexOfCategory]];
  });

  const sumOfAllTransactions = useMemo(
    () =>
      transactions.reduce((acc, transaction) => {
        const transactionDate = new Date(transaction.date);
        const pickDate = new Date(statisticsDate);

        const yearCondition =
          transactionDate.getFullYear() === pickDate.getFullYear();
        const monthCondition =
          transactionDate.getMonth() === pickDate.getMonth();

        if (transaction.type && yearCondition && monthCondition)
          return acc + transaction.amount;
        if (yearCondition && monthCondition) return acc - transaction.amount;

        return acc + 0;
      }, 0),
    [transactions, statisticsDate]
  );

  useEffect(() => {
    const updateChartSize = () => {
      if (transactionsCategorySum?.length === 0) return;

      chartRef.current.resize();
    };
    window.addEventListener("resize", updateChartSize);
    return () => window.removeEventListener("resize", updateChartSize);
  }, [getTransactionsCategoryValue]);

  const data = {
    labels: categoryName,
    datasets: [
      {
        label: "Cash",
        data: transactionsCategorySum,
        backgroundColor: chartBg,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const plugin = {
    id: "emptyDoughnut",
    afterDraw(chart, args, options) {
      const { datasets } = chart.data;
      const { color, width, radiusDecrease } = options;
      let hasData = false;

      for (let i = 0; i < datasets.length; i += 1) {
        const dataset = datasets[i];
        hasData |= dataset.data.length > 0;
      }

      if (!hasData) {
        const {
          chartArea: { left, top, right, bottom },
          ctx,
        } = chart;
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;
        const r = Math.min(right - left, bottom - top) / 2;

        ctx.beginPath();
        ctx.lineWidth = width || 2;
        ctx.strokeStyle = color || "rgba(255, 128, 0, 0.5)";
        ctx.arc(centerX, centerY, r - radiusDecrease || 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
    },
  };

  return (
    <>
      <div className={css.container}>
        <>
          <h3 className={css.title}>Statistics</h3>
          <div className={css.chartWrapper}>
            <p className={css.text}>{`PLN  ${sumOfAllTransactions}`}</p>
            {transactionsCategorySum?.length === 0 && (
              <>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="40" />
                </svg>
              </>
            )}
            {transactionsCategorySum?.length !== 0 && (
              <Doughnut
                ref={chartRef}
                data={data}
                options={options}
                redraw="true"
                updateMode="resize"
              />
            )}
          </div>
        </>
      </div>
    </>
  );
};

export default MobileChart;
