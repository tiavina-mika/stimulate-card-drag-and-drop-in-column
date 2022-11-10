import dayjs from "dayjs";
import {
  cardItem,
  newProductionDate,
  oldProdDataPlanning,
  oldProductionDate
} from "./data";
import "./styles.css";

/**
 * copy a card from a column to another column
 * the card should be copied only in the same product type
 * each column is a day
 * @param {*} sourceDate
 * @param {*} destinationDate
 */
const updateProdData = (sourceDate, destinationDate) => {
  const newProdDataPlanning = [];
  const sourceDay = oldProdDataPlanning.find((day) => day.date === sourceDate);
  console.log("oldProdDataPlanning", oldProdDataPlanning);

  for (const day of oldProdDataPlanning) {
    // get current card from card list of a day
    const newCard = sourceDay.cards[cardItem.productType].find(
      (card) => card.id === cardItem.id
    );
    let newDlcDateDiff;
    const isNewDateAfterOldDate = dayjs(sourceDate).isAfter(
      dayjs(destinationDate)
    );

    if (isNewDateAfterOldDate) {
      newDlcDateDiff = dayjs(sourceDate).diff(destinationDate, "day");
    } else {
      newDlcDateDiff = dayjs(destinationDate).diff(sourceDate, "day");
    }

    // ----------------------------------- //
    // --------- destination day --------- //
    // ----------------------------------- //
    if (day.date === destinationDate) {
      const newCardWithNewDlcs = {
        ...newCard,
        dlc:
          newCard.dlc.map((dlcItem) => ({
            ...dlcItem,
            value: isNewDateAfterOldDate
              ? // subtract day if the card is dragged backward
                dayjs(dlcItem.value).subtract(newDlcDateDiff, "days").valueOf()
              : // add day if the card is dragged forward
                dayjs(dlcItem.value).add(newDlcDateDiff, "days").valueOf()
          })) || []
      };

      // add the updated card to the day (destination)
      newProdDataPlanning.push({
        ...day,
        cards: {
          ...day.cards,
          [cardItem.productType]: [
            ...day.cards[cardItem.productType],
            newCardWithNewDlcs
          ]
        }
      });
      // ----------------------------------- //
      // ------------ source day ----------- //
      // ----------------------------------- //
    } else if (day.date === sourceDate) {
      // remove the dragged card to the day (source)
      newProdDataPlanning.push({
        ...day,
        cards: {
          ...day.cards,
          [cardItem.productType]: day.cards[cardItem.productType].filter(
            (card) => card.id !== cardItem.id
          )
        }
      });
      // ----------------------------------- //
      // ------------ other days ----------- //
      // ----------------------------------- //
    } else {
      newProdDataPlanning.push(day);
    }
  }
  return newProdDataPlanning;
};

const newDataPlanning = updateProdData(oldProductionDate, newProductionDate);
console.log("newDataPlanning", newDataPlanning);

const App = () => {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
};

export default App;
