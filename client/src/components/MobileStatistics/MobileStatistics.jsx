import { useSelector, useDispatch } from "react-redux";
import Dropdown from "../Dropdown/Dropdown";
import MobileChart from "../MobileChart/MobileChart";
import MobileNavigation from "../MobileNavigation/MobileNavigation";
import css from "./MobileStatistics.module.css";
import { selectIsLoading, selectStatisticsDate } from "../../redux/selector";
import { MONTH_NAME } from "../../redux/constant";
import { selectTransactions } from "../../redux/selector";
import { setMonth, setYear } from "../../redux/wallet/wallet.slice";
import { useMemo } from "react";
import DropdownList from "../DropdownList/DropdownList";
import MobieStatisticsList from "../MobileStatisticsList/MobieStatisticsList";
import Loader from "../Loader/Loader";

const MobileStatistics = () => {
  const statisticsDate = useSelector(selectStatisticsDate);
  const transactions = useSelector(selectTransactions);
  const date = new Date(statisticsDate);
  const month = MONTH_NAME[date.getMonth()];
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const transactionsYear = [
    ...new Set(
      useMemo(() => {
        if (transactions.length !== 0) {
          return transactions.map((elements) => {
            const transactionDate = new Date(elements.date);

            return transactionDate.getFullYear();
          });
        }

        return [new Date().getFullYear()];
      }, [transactions, statisticsDate])
    ),
  ];
  const handleYear = (event) => {
    event.preventDefault();

    dispatch(setYear(event.target.textContent));
  };

  const handleMonth = (event) => {
    event.preventDefault();
    const month = MONTH_NAME.indexOf(event.target.textContent);
    dispatch(setMonth(month));
  };

  return (
    <>
      <section className={css.navSection}>
        <MobileNavigation />
      </section>
      {!isLoading && (
        <>
          {" "}
          <section className={css.chartSection}>
            <MobileChart />
          </section>
          <section>
            <div className={css.container}>
              <>
                <Dropdown selectedName={month} handleDate={handleMonth}>
                  <DropdownList data={Object.values(MONTH_NAME)} />
                </Dropdown>
              </>
              <>
                <Dropdown
                  selectedName={date.getFullYear()}
                  handleDate={handleYear}
                >
                  <DropdownList data={transactionsYear} />
                </Dropdown>
              </>
            </div>
          </section>
          <section>
            <div className={css.container}>
              <MobieStatisticsList />
            </div>
          </section>
        </>
      )}
      {isLoading && (
        <div className={css.loaderWrapper}>
          <Loader variant={"wallet"} scale={0.5} />
        </div>
      )}
    </>
  );
};

export default MobileStatistics;
