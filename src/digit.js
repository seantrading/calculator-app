import { ACTIONS } from "./App"

export default function DigitButton({ dispatch, digit }) {
  if (digit == "0") {
    return <button className="span-two" onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}>{digit}</button>
  } else {
    return <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}>{digit}</button>
  }
}