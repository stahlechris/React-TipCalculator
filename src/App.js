import { useState } from "react";
import "./styles.css";

const optionLabels = [
  {
    label: "Dissatisfied (0%)",
    value: 0,
  },
  {
    label: "It was okay (5%)",
    value: 5,
  },
  {
    label: "It was good (10%)",
    value: 10,
  },
  {
    label: "Absolutely Amazing (20%)",
    value: 20,
  },
];

function CalculateTip(yourServiceRating, otherServiceRating) {
  if (yourServiceRating === null && otherServiceRating === null) return null;

  const totalRating = yourServiceRating + otherServiceRating;
  const averageRating = totalRating / 2;
  const tipInDollars = averageRating.toFixed(2);

  return Number(tipInDollars);
}

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [yourServiceRating, setYourServiceRating] = useState(
    optionLabels[0].value
  );
  const [otherServiceRating, setOtherServiceRating] = useState(
    optionLabels[0].value
  );
  const handleRatingChange = (selectedValue, ratingType) => {
    if (ratingType === "yourService") setYourServiceRating(selectedValue);
    else if (ratingType === "otherService")
      setOtherServiceRating(selectedValue);
  };
  //--todo no need to calculate this if empty input or 0 input
  //--this is a Number
  const tipInDollars = CalculateTip(yourServiceRating, otherServiceRating);

  return (
    <div className="App">
      <Bill inputValue={inputValue} setInputValue={setInputValue} />
      <Service
        title={"How did you like the service?"}
        optionLabels={optionLabels}
        onRatingChange={(value) => handleRatingChange(value, "yourService")}
        selectedValue={yourServiceRating}
      />
      <Service
        title={"How did your friend like the service?"}
        optionLabels={optionLabels}
        onRatingChange={(value) => handleRatingChange(value, "otherService")}
        selectedValue={otherServiceRating}
      />
      {inputValue !== "" && Number(inputValue) > 0 && (
        <Total
          amountAfterTip={Number(inputValue) + tipInDollars}
          amountBeforeTip={Number(inputValue)}
          tip={tipInDollars === null ? 0 : tipInDollars}
        />
      )}
      {inputValue !== "" && Number(inputValue) > 0 && (
        <Reset
          setInputValue={setInputValue}
          handleRatingChange={handleRatingChange}
        />
      )}
    </div>
  );
}

function Bill({ inputValue, setInputValue }) {
  const handleInputChange = (e) => {
    const value = e.target.value;
    //-- Check if the entered value is a valid number or an empty string
    //-- Not sure if there's an easier way than regexing to validate input in this language?
    if (/^\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  return (
    <div>
      How much was the bill?
      <input
        type="text"
        placeholder="Total..."
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
  );
}

function CreateDynamicDropdown({ optionLabels, onChange, selectedValue }) {
  const handleChange = (e) => {
    onChange(Number(e.target.value));
  };
  return (
    <select value={selectedValue} onChange={handleChange}>
      {optionLabels.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function Service({ title, optionLabels, onRatingChange, selectedValue }) {
  return (
    <div>
      {title}
      <CreateDynamicDropdown
        optionLabels={optionLabels}
        onChange={onRatingChange}
        selectedValue={selectedValue}
      />
    </div>
  );
}

function Total({ amountAfterTip, amountBeforeTip, tip }) {
  return (
    <h2>{`You pay $${amountAfterTip} ($${amountBeforeTip} + $${tip} tip)`}</h2>
  );
}

function Reset({ setInputValue, handleRatingChange }) {
  function handleOnClick() {
    setInputValue("");
    handleRatingChange(optionLabels[0].value, "yourService");
    handleRatingChange(optionLabels[0].value, "otherService");
  }

  return <button onClick={handleOnClick}>Reset</button>;
}
